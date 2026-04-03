// Level2Scene.js
// Level 2 — Temný les
// Placeholder pro Fázi 7

class Level2Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level2Scene' });
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    this.add.text(width / 2, height / 2, 'Level 2 — Temný les\n[ Placeholder ]', {
      fontSize: '20px',
      fill: '#C4B5FD',
      fontFamily: 'monospace',
      align: 'center'
    }).setOrigin(0.5);
  }
}
