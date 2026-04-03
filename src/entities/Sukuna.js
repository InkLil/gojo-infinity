// Sukuna.js — α1 Ryomen Sukuna, Král kleteb
// Fáze 5: AI pohyb, Cleave, Malevolent Shrine, fázový systém

class Sukuna extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'sukuna_placeholder');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // --- Statistiky (GDD spec) ---
    this.hp          = 8;
    this.maxHp       = 8;
    this.damage      = 2;       // kontaktní poškození
    this.speed       = 60;      // pomalý ale hrozivý
    this.attackDelay = 4000;    // 4 sekundy mezi útoky
    this.attackPhase = 0;       // 0 = Cleave, 1 = Shrine (střídá)
    this.isPhase2    = false;   // HP ≤ 3 = fáze 2 (zrychlení)

    this.setCollideWorldBounds(true);
    this.body.setSize(28, 44);
    this.body.setOffset(2, 4);

    // Spawn efekt — červená záře + varování
    this.setTint(0xFF0000);
    scene.time.delayedCall(600, () => { if (this.active) this.clearTint(); });

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

    // Vizuální animace: Sukuna se červeně rozsvítí při útoku
    this.setTint(0x8B0000);
    this.scene.time.delayedCall(300, () => { if (this.active) this.clearTint(); });
  }

  // Malevolent Shrine — 3 ohnivé šípy
  doShrine() {
    const gojo = this.scene.gojo;
    if (!gojo) return;

    const dirX = gojo.x > this.x ? 1 : -1;
    this.scene.events.emit('sukunaShrine', this.x, this.y - 10, dirX);

    this.setTint(0xFF4500);
    this.scene.time.delayedCall(300, () => { if (this.active) this.clearTint(); });
  }

  takeDamage(amount = 1) {
    this.hp -= amount;

    this.setTint(0xFF4444);
    this.scene.time.delayedCall(150, () => { if (this.active) this.clearTint(); });

    // Fáze 2: HP ≤ 3 — zrychlení, kratší cooldown
    if (this.hp <= 3 && !this.isPhase2) {
      this.isPhase2 = true;
      this.speed = 110;
      // Zkrátí cooldown na 2 sekundy (GDD spec)
      if (this.attackTimer) {
        this.attackTimer.remove();
        this.attackTimer = this.scene.time.addEvent({
          delay: 2000,
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
      this.scene.events.emit('sukunaKilled', this.x, this.y);
      this.destroy();
    }
  }

  update() {
    if (!this.active) return;
    const gojo = this.scene.gojo;
    if (!gojo || !gojo.active) return;

    // Pomalu kráčí k hráči
    const dirX = gojo.x > this.x ? 1 : -1;
    this.setVelocityX(this.speed * dirX);
    this.setFlipX(dirX === -1);
  }
}
