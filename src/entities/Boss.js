// Boss.js — Prokletý duch (Tokio)
// GDD: 10 HP, 3 fáze, finální nepřítel Level 3

class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'boss_placeholder');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.hp      = 10;
    this.maxHp   = 10;
    this.damage  = 2;
    this.phase   = 1;   // 1, 2, 3
    this.speed   = 80;

    this.setCollideWorldBounds(true);
    this.body.setSize(60, 60);

    // Spawn efekt
    this.setTint(0x9B59B6);
    scene.time.delayedCall(800, () => { if (this.active) this.clearTint(); });
    scene.events.emit('bossSpawned');

    // HP bar nad bossem
    this.hpBarBg   = scene.add.rectangle(x, y - 50, 80, 8, 0x333333).setDepth(15);
    this.hpBarFill = scene.add.rectangle(x, y - 50, 80, 8, 0x8B0000).setDepth(16);

    // Útočný timer
    this.attackTimer = scene.time.addEvent({
      delay: 3000,
      loop: true,
      callback: this.doAttack,
      callbackScope: this
    });
  }

  doAttack() {
    if (!this.active) return;
    const gojo = this.scene.gojo;
    if (!gojo) return;

    const dirX = gojo.x > this.x ? 1 : -1;

    if (this.phase === 1) {
      // Fáze 1: 1 projektil rovně
      this.scene.events.emit('bossShoot', this.x, this.y, dirX, 1);
    } else if (this.phase === 2) {
      // Fáze 2: 3 projektily (rovně + nahoru + dolů)
      this.scene.events.emit('bossShoot', this.x, this.y, dirX, 3);
    } else {
      // Fáze 3: 3 projektily + kratší cooldown (řeší se přenastavením timeru)
      this.scene.events.emit('bossShoot', this.x, this.y, dirX, 3);
    }

    this.setTint(0xFF00FF);
    this.scene.time.delayedCall(200, () => { if (this.active) this.clearTint(); });
  }

  takeDamage(amount = 1) {
    this.hp -= amount;
    this.setTint(0xFF4444);
    this.scene.time.delayedCall(150, () => { if (this.active) this.clearTint(); });

    // Aktualizace HP baru
    const ratio = Math.max(0, this.hp / this.maxHp);
    this.hpBarFill.setDisplaySize(80 * ratio, 8);

    // Přechod do fáze 2
    if (this.hp <= 6 && this.phase === 1) {
      this.phase = 2;
      this.speed = 120;
      this.attackTimer.delay = 2000;
      this.scene.events.emit('bossPhase', 2);
    }

    // Přechod do fáze 3
    if (this.hp <= 3 && this.phase === 2) {
      this.phase = 3;
      this.speed = 160;
      this.attackTimer.delay = 1000;
      this.scene.events.emit('bossPhase', 3);
    }

    if (this.hp <= 0) {
      if (this.attackTimer) this.attackTimer.remove();
      this.hpBarBg.destroy();
      this.hpBarFill.destroy();
      this.scene.events.emit('bossKilled', this.x, this.y);
      this.destroy();
    }
  }

  update() {
    if (!this.active) return;
    const gojo = this.scene.gojo;
    if (!gojo) return;

    // Pohybuje se k hráči
    const dirX = gojo.x > this.x ? 1 : -1;
    this.setVelocityX(this.speed * dirX);
    this.setFlipX(dirX === -1);

    // HP bar sleduje bosse
    this.hpBarBg.setPosition(this.x, this.y - 50);
    this.hpBarFill.setPosition(this.x - 40 + (40 * (this.hp / this.maxHp)), this.y - 50);

    // Fáze 3: občas skočí na hráče
    if (this.phase === 3 && this.body.blocked.down && Math.random() < 0.005) {
      this.setVelocityY(-550);
    }
  }
}
