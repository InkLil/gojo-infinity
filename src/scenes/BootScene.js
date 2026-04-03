// BootScene.js
// První scéna která se spustí — načte assety a přejde do MenuScene
// V Fázi 1 slouží jako placeholder — zobrazí text a přejde dál

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' }); // 'key' = unikátní název scény
  }

  preload() {
    // Zde budeme v dalších fázích načítat spritesheety, zvuky, tilemapy
    // Zatím prázdné — v Fázi 1 nemáme žádné assety
  }

  create() {
    const { width, height } = this.scale;

    // Fialový nadpis — primární barva hry (#6B21A8)
    this.add.text(width / 2, height / 2 - 30, "GOJO'S INFINITY", {
      fontSize: '32px',
      fill: '#C4B5FD',        // světlá fialová z barevné palety GDD
      fontFamily: 'monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);         // setOrigin(0.5) = střed textu na souřadnici

    // Podtitulek
    this.add.text(width / 2, height / 2 + 20, 'Loading...', {
      fontSize: '16px',
      fill: '#F0F0FF',        // Gojo bílá z barevné palety GDD
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    // Po 1.5 sekundě přejde do MenuScene
    this.time.delayedCall(1500, () => {
      this.scene.start('MenuScene');
    });
  }
}
