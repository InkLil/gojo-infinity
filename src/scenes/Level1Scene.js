// Level1Scene.js
// Level 1 — Japonská vesnice
// V Fázi 1 jen placeholder — v Fázi 2+ přidáme Gojo, platformy, nepřátele

class Level1Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1Scene' });
  }

  create() {
    const { width, height } = this.scale;

    // Placeholder pozadí — světlá obloha Level 1 (#87CEEB)
    this.add.rectangle(width / 2, height / 2, width, height, 0x87ceeb);

    // Placeholder text
    this.add.text(width / 2, height / 2 - 20, 'Level 1 — Japonská vesnice', {
      fontSize: '20px',
      fill: '#111827',
      fontFamily: 'monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 20, '[ Placeholder — Fáze 2 ]', {
      fontSize: '14px',
      fill: '#333333',
      fontFamily: 'monospace'
    }).setOrigin(0.5);
  }
}
