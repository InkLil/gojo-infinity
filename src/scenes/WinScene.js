// WinScene.js
// Výherní obrazovka — Gojo oslavná póza, confetti bílá + fialová
// V Fázi 1 základní placeholder

class WinScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WinScene' });
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a1a);

    this.add.text(width / 2, height / 2 - 60, 'VÍTĚZSTVÍ!', {
      fontSize: '42px',
      fill: '#C4B5FD',
      fontFamily: 'monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2, 'Gojo vyhrál!', {
      fontSize: '18px',
      fill: '#F0F0FF',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    const menuBtn = this.add.text(width / 2, height / 2 + 60, '[ HLAVNÍ MENU ]', {
      fontSize: '20px',
      fill: '#6B21A8',
      fontFamily: 'monospace'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    menuBtn.on('pointerover', () => menuBtn.setStyle({ fill: '#C4B5FD' }));
    menuBtn.on('pointerout', () => menuBtn.setStyle({ fill: '#6B21A8' }));
    menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
