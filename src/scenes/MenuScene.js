// MenuScene.js
// Hlavní menu — v Fázi 1 jen placeholder s tlačítkem START
// V Fázi 2+ přidáme Gojo idle animaci a pozadí

class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Menu pozadí — roztažené přesně na velikost hry (800×450)
    this.add.image(width / 2, height / 2, 'menu_background')
      .setDisplaySize(width, height);

    // Tmavý overlay pro čitelnost textu
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.45);

    // Logo hry
    this.add.text(width / 2, height / 2 - 80, "GOJO'S INFINITY", {
      fontSize: '36px',
      fill: '#C4B5FD',
      fontFamily: 'monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Podtitulek
    this.add.text(width / 2, height / 2 - 30, '— 2D Plošinovka —', {
      fontSize: '14px',
      fill: '#6B21A8',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    // Tlačítko START — klikatelný text
    const startBtn = this.add.text(width / 2, height / 2 + 40, '[ HRÁT ]', {
      fontSize: '24px',
      fill: '#F0F0FF',
      fontFamily: 'monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Hover efekt — změní barvu při najetí myší
    startBtn.on('pointerover', () => startBtn.setStyle({ fill: '#C4B5FD' }));
    startBtn.on('pointerout', () => startBtn.setStyle({ fill: '#F0F0FF' }));

    // Klik — spustí Level 1
    startBtn.on('pointerdown', () => {
      this.scene.start('Level1Scene');
    });

    // Blikání textu "Stiskni libovolnou klávesu"
    const hint = this.add.text(width / 2, height - 40, 'Klikni nebo stiskni Enter', {
      fontSize: '12px',
      fill: '#6B21A8',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    // Blikání každých 600ms
    this.time.addEvent({
      delay: 600,
      loop: true,
      callback: () => { hint.setVisible(!hint.visible); }
    });

    // Enter klávesa také spustí Level 1
    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('Level1Scene');
    });
  }
}
