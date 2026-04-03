// SmallCurse.js
// Malá kletba — chodí tam a zpět, 1 HP, 1 srdíčko poškození

class SmallCurse extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'small_curse');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.hp     = 1;
    this.damage = 1;
    this.speed  = 80;
    this.dir    = 1; // 1 = doprava, -1 = doleva

    this.setCollideWorldBounds(true);
    this.body.setSize(18, 18);
  }

  update() {
    this.setVelocityX(this.speed * this.dir);

    // Otočení při nárazu do zdi
    if (this.body.blocked.left)  this.dir = 1;
    if (this.body.blocked.right) this.dir = -1;

    this.setFlipX(this.dir === -1);
  }

  takeDamage(amount = 1) {
    this.hp -= amount;
    this.setTint(0xFF4444);
    this.scene.time.delayedCall(150, () => { if (this.active) this.clearTint(); });

    if (this.hp <= 0) {
      this.scene.events.emit('enemyKilled', this.x, this.y, 100); // 100 bodů
      this.destroy();
    }
  }
}
