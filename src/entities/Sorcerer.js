// Sorcerer.js
// Nepřátelský čaroděj — stojí na místě, každé 3 sekundy střílí projektil na hráče

class Sorcerer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'sorcerer');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.hp     = 2;
    this.damage = 1;

    this.setCollideWorldBounds(true);
    this.body.setImmovable(true); // nestojí — nedá se odstrčit
    this.body.setSize(24, 36);

    // Střílení každé 3 sekundy
    this.shootTimer = scene.time.addEvent({
      delay: 3000,
      loop: true,
      callback: this.shoot,
      callbackScope: this
    });
  }

  shoot() {
    if (!this.active || !this.scene) return;

    const gojo = this.scene.gojo;
    if (!gojo || !gojo.active) return;

    // Směr k hráči
    const dirX = gojo.x > this.x ? 1 : -1;
    this.setFlipX(dirX === -1);

    // Informujeme scénu ať spawne projektil čaroděje
    this.scene.events.emit('sorcererShoot', this.x, this.y, dirX);
  }

  takeDamage(amount = 1) {
    this.hp -= amount;
    this.setTint(0xFF4444);
    this.scene.time.delayedCall(150, () => { if (this.active) this.clearTint(); });

    if (this.hp <= 0) {
      if (this.shootTimer) this.shootTimer.remove();
      this.scene.events.emit('enemyKilled', this.x, this.y, 200); // 200 bodů
      this.destroy();
    }
  }
}
