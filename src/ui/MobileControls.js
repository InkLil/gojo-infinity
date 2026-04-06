// MobileControls.js
// Dotyková tlačítka pro mobilní zařízení
// Spouští se souběžně s každým levelem: this.scene.launch('MobileControls')
// Zapisuje stav do window.mobileInput = { left, right, jump, z, x }

class MobileControls extends Phaser.Scene {
  constructor() {
    super({ key: 'MobileControls' });
  }

  create() {
    // Inicializace globálního stavu
    window.mobileInput = { left: false, right: false, jump: false, z: false, x: false };

    // Na zařízeních bez dotyku scénu ihned vypneme
    if (!this.sys.game.device.input.touch) {
      this.scene.stop();
      return;
    }

    const { width, height } = this.scale;

    // --- Konfigurace tlačítek ---
    const BTN_SIZE   = 70;   // px — velikost tlačítka
    const MARGIN     = 16;   // px — odstup od okraje
    const BOTTOM     = height - MARGIN - BTN_SIZE / 2;

    // Levá strana: ← →
    const leftX  = MARGIN + BTN_SIZE / 2;
    const rightX = leftX + BTN_SIZE + 12;

    // Pravá strana: Z, X, JUMP (zleva doprava)
    const jumpX  = width - MARGIN - BTN_SIZE / 2;
    const xX     = jumpX - BTN_SIZE - 12;
    const zX     = xX   - BTN_SIZE - 12;

    // --- Vytvoření tlačítek ---
    this._makeBtn(leftX,  BOTTOM, BTN_SIZE, '←', 0x334155, 'left');
    this._makeBtn(rightX, BOTTOM, BTN_SIZE, '→', 0x334155, 'right');
    this._makeBtn(zX,     BOTTOM, BTN_SIZE, 'Z', 0x4c1d95, 'z');
    this._makeBtn(xX,     BOTTOM, BTN_SIZE, 'X', 0x831843, 'x');
    this._makeBtn(jumpX,  BOTTOM, BTN_SIZE, '↑', 0x14532d, 'jump');

    // Při přechodu na jinou scénu resetujeme vstupy
    this.events.on('sleep',   this._resetAll, this);
    this.events.on('destroy', this._resetAll, this);
  }

  // Vytvoří jedno kruhové tlačítko s textem
  _makeBtn(x, y, size, label, color, key) {
    const r = size / 2;

    // Pozadí tlačítka
    const bg = this.add.graphics();
    bg.fillStyle(color, 0.75);
    bg.fillCircle(0, 0, r);
    bg.lineStyle(2, 0xffffff, 0.4);
    bg.strokeCircle(0, 0, r);
    bg.setPosition(x, y);

    // Popisek
    const txt = this.add.text(x, y, label, {
      fontSize: '26px',
      color: '#ffffff',
      fontFamily: 'Arial',
    }).setOrigin(0.5, 0.5);

    // Interaktivní zóna
    const zone = this.add.zone(x, y, size, size).setInteractive();

    zone.on('pointerdown', () => {
      window.mobileInput[key] = true;
      bg.setAlpha(1);
    });

    zone.on('pointerup',   () => {
      window.mobileInput[key] = false;
      bg.setAlpha(0.75);
    });

    zone.on('pointerout',  () => {
      window.mobileInput[key] = false;
      bg.setAlpha(0.75);
    });
  }

  _resetAll() {
    if (window.mobileInput) {
      window.mobileInput.left  = false;
      window.mobileInput.right = false;
      window.mobileInput.jump  = false;
      window.mobileInput.z     = false;
      window.mobileInput.x     = false;
    }
  }
}
