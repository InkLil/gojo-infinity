// GameOverScene.js
// Game Over obrazovka — červený overlay, tlačítka Znovu / Menu
// V Fázi 1 základní placeholder

class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Červený overlay (tmavší červená)
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a0000);

    this.add.text(width / 2, height / 2 - 60, 'GAME OVER', {
      fontSize: '42px',
      fill: '#DC2626',
      fontFamily: 'monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Tlačítko — Znovu
    const retryBtn = this.add.text(width / 2, height / 2 + 20, '[ ZKUSIT ZNOVU ]', {
      fontSize: '20px',
      fill: '#F0F0FF',
      fontFamily: 'monospace'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    retryBtn.on('pointerover', () => retryBtn.setStyle({ fill: '#C4B5FD' }));
    retryBtn.on('pointerout', () => retryBtn.setStyle({ fill: '#F0F0FF' }));
    retryBtn.on('pointerdown', () => this.scene.start('Level1Scene'));

    // Tlačítko — Hlavní menu
    const menuBtn = this.add.text(width / 2, height / 2 + 60, '[ HLAVNÍ MENU ]', {
      fontSize: '16px',
      fill: '#6B21A8',
      fontFamily: 'monospace'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    menuBtn.on('pointerover', () => menuBtn.setStyle({ fill: '#C4B5FD' }));
    menuBtn.on('pointerout', () => menuBtn.setStyle({ fill: '#6B21A8' }));
    menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
