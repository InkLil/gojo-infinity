// Sukuna.js — α1 Ryomen Sukuna, Král kleteb
// Fáze 5: AI pohyb, Cleave, Malevolent Shrine, fázový systém

class Sukuna extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'sukuna_spritesheet');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // --- Statistiky ---
    this.hp          = 12;      // zvýšeno z 8
    this.maxHp       = 12;
    this.damage      = 3;       // zvýšeno z 2
    this.speed       = 70;
    this.attackDelay = 3000;    // zkráceno z 4000
    this.attackPhase = 0;
    this.isPhase2    = false;   // HP ≤ 5 = fáze 2

    this.setCollideWorldBounds(true);
    this.body.setSize(28, 44);
    this.body.setOffset(2, 4);

    this._dying = false;

    // Spawn efekt — červená záře + varování
    this.setTint(0xFF0000);
    scene.time.delayedCall(600, () => { if (this.active) this.clearTint(); });

    this.play('sukuna_idle');

    // Oznámení scéně že Sukuna se zjevil
    scene.events.emit('sukunaSpawned');

    // Útočný timer
    this.attackTimer = scene.time.addEvent({
      delay: this.attackDelay,
      loop: true,
      callback: this.doAttack,
      callbackScope: this
    });
  }

  // --- Útok: střídá Cleave a Malevolent Shrine ---
  doAttack() {
    if (!this.active) return;

    if (this.attackPhase === 0) {
      this.doCleave();
    } else {
      this.doShrine();
    }
    this.attackPhase = (this.attackPhase + 1) % 2;
  }

  // Cleave — vlna energie po celé podlaze
  doCleave() {
    this.scene.events.emit('sukunaCleave', this.x, this.y);
    this.play('sukuna_cleave');
    this.once('animationcomplete-sukuna_cleave', () => { if (this.active && !this._dying) this.play('sukuna_idle', true); });
  }

  doShrine() {
    const gojo = this.scene.gojo;
    if (!gojo) return;

    const dirX = gojo.x > this.x ? 1 : -1;
    this.scene.events.emit('sukunaShrine', this.x, this.y - 10, dirX);
    this.play('sukuna_shrine');
    this.once('animationcomplete-sukuna_shrine', () => { if (this.active && !this._dying) this.play('sukuna_idle', true); });
  }

  takeDamage(amount = 1) {
    if (this._dying) return; // death animace nesmí být přerušena dalším zásahem
    this.hp -= amount;

    this.play('sukuna_hit');
    this.once('animationcomplete-sukuna_hit', () => { if (this.active && !this._dying) this.play('sukuna_idle', true); });

    // Fáze 2: HP ≤ 5 — zrychlení, kratší cooldown
    if (this.hp <= 5 && !this.isPhase2) {
      this.isPhase2 = true;
      this.speed = 140;
      if (this.attackTimer) {
        this.attackTimer.remove();
        this.attackTimer = this.scene.time.addEvent({
          delay: 1500,
          loop: true,
          callback: this.doAttack,
          callbackScope: this
        });
      }
      // Vizuální signál fáze 2
      this.scene.events.emit('sukunaPhase2');
    }

    if (this.hp <= 0) {
      if (this.attackTimer) this.attackTimer.remove();
      this._dying = true;
      this.body.setVelocity(0);
      this.play('sukuna_death');
      this.once('animationcomplete-sukuna_death', () => {
        this.scene.events.emit('sukunaKilled', this.x, this.y);
        this.destroy();
      });
    }
  }

  update() {
    if (!this.active) return;
    if (this._dying) return;
    const gojo = this.scene.gojo;
    if (!gojo || !gojo.active) return;

    const dirX = gojo.x > this.x ? 1 : -1;
    this.setVelocityX(this.speed * dirX);
    this.setFlipX(dirX === -1);

    // Chůze vs. idle — jen pokud nehraje útočná animace
    const cur = this.anims.currentAnim ? this.anims.currentAnim.key : '';
    if (cur === 'sukuna_idle' || cur === 'sukuna_walk') {
      this.play('sukuna_walk', true);
    }
  }
}
