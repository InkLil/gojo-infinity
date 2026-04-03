// LargeCurse.js
// Velká kletba — pomalejší, větší, 3 HP, 2 srdíčka poškození

class LargeCurse extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'large_curse');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.hp     = 3;
    this.damage = 2;
    this.speed  = 45;
    this.dir    = 1;

    this.setCollideWorldBounds(true);
    this.body.setSize(34, 34);
  }

  update() {
    this.setVelocityX(this.speed * this.dir);

    if (this.body.blocked.left)  this.dir = 1;
    if (this.body.blocked.right) this.dir = -1;

    this.setFlipX(this.dir === -1);
  }

  takeDamage(amount = 1) {
    this.hp -= amount;
    this.setTint(0xFF4444);
    this.scene.time.delayedCall(150, () => { if (this.active) this.clearTint(); });

    if (this.hp <= 0) {
      this.scene.events.emit('enemyKilled', this.x, this.y, 300); // 300 bodů
      this.destroy();
    }
  }
}
