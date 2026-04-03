// Level3Scene.js
// Level 3 — Tokio, noční město
// Placeholder pro Fázi 7

class Level3Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level3Scene' });
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a1a);

    this.add.text(width / 2, height / 2, 'Level 3 — Tokio, noční město\n[ Placeholder ]', {
      fontSize: '20px',
      fill: '#00BFFF',
      fontFamily: 'monospace',
      align: 'center'
    }).setOrigin(0.5);
  }
}
