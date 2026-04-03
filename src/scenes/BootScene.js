// BootScene.js
// První scéna — generuje VŠECHNY placeholder textury (dostupné ve všech levelech)
// a přechází do MenuScene

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Všechny textury generujeme tady jednou — Phaser je cachuje globálně
    this._makeTextures();
  }

  create() {
    const { width, height } = this.scale;

    this.add.text(width / 2, height / 2 - 30, "GOJO'S INFINITY", {
      fontSize: '32px', fill: '#C4B5FD', fontFamily: 'monospace', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 20, 'Loading...', {
      fontSize: '16px', fill: '#F0F0FF', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.time.delayedCall(1200, () => { this.scene.start('MenuScene'); });
  }

  _makeTextures() {
    const g = (w, h) => this.make.graphics({ x: 0, y: 0, add: false });

    // --- Gojo placeholder (32×48) ---
    const gojoGfx = g();
    gojoGfx.fillStyle(0xF0F0FF); gojoGfx.fillRect(0, 0, 32, 48);
    gojoGfx.fillStyle(0x1E1E3F); gojoGfx.fillRect(6, 12, 20, 8);   // brýle
    gojoGfx.fillStyle(0xEA580C); gojoGfx.fillCircle(10, 28, 4);    // odznak
    gojoGfx.generateTexture('gojo_placeholder', 32, 48); gojoGfx.destroy();

    // --- Platforma (200×20) ---
    const platGfx = g();
    platGfx.fillStyle(0x92400E); platGfx.fillRect(0, 0, 200, 20);
    platGfx.fillStyle(0x78350F); platGfx.fillRect(0, 0, 200, 4);
    platGfx.generateTexture('platform', 200, 20); platGfx.destroy();

    // --- Tmavá platforma pro Level 2 (200×20) ---
    const darkPlatGfx = g();
    darkPlatGfx.fillStyle(0x166534); darkPlatGfx.fillRect(0, 0, 200, 20);
    darkPlatGfx.fillStyle(0x14532D); darkPlatGfx.fillRect(0, 0, 200, 4);
    darkPlatGfx.generateTexture('platform_dark', 200, 20); darkPlatGfx.destroy();

    // --- Podlaha (800×32) ---
    const groundGfx = g();
    groundGfx.fillStyle(0x4ADE80); groundGfx.fillRect(0, 0, 800, 32);
    groundGfx.fillStyle(0x166534); groundGfx.fillRect(0, 6, 800, 26);
    groundGfx.generateTexture('ground', 800, 32); groundGfx.destroy();

    // --- Tmavá podlaha pro Level 2 ---
    const darkGroundGfx = g();
    darkGroundGfx.fillStyle(0x1a3a1a); darkGroundGfx.fillRect(0, 0, 800, 32);
    darkGroundGfx.fillStyle(0x0f2010); darkGroundGfx.fillRect(0, 6, 800, 26);
    darkGroundGfx.generateTexture('ground_dark', 800, 32); darkGroundGfx.destroy();

    // --- Duté fialové koule (24×24) ---
    const purpleGfx = g();
    purpleGfx.fillStyle(0x6B21A8); purpleGfx.fillCircle(12, 12, 12);
    purpleGfx.fillStyle(0xC4B5FD); purpleGfx.fillCircle(12, 12, 6);
    purpleGfx.generateTexture('hollow_purple', 24, 24); purpleGfx.destroy();

    // --- Cílová brána (40×60) ---
    const gateGfx = g();
    gateGfx.fillStyle(0xFFD700); gateGfx.fillRect(0, 0, 40, 60);
    gateGfx.lineStyle(3, 0xFFA500); gateGfx.strokeRect(2, 2, 36, 56);
    gateGfx.generateTexture('gate', 40, 60); gateGfx.destroy();

    // --- Malá kletba (24×24) ---
    const scGfx = g();
    scGfx.fillStyle(0x4B0082); scGfx.fillCircle(12, 14, 11);
    scGfx.fillStyle(0xFF0000); scGfx.fillCircle(8, 10, 3); scGfx.fillCircle(16, 10, 3);
    scGfx.generateTexture('small_curse', 24, 24); scGfx.destroy();

    // --- Velká kletba (40×40) ---
    const lcGfx = g();
    lcGfx.fillStyle(0x2D0057); lcGfx.fillCircle(20, 22, 18);
    lcGfx.fillStyle(0xFF0000); lcGfx.fillCircle(13, 16, 4); lcGfx.fillCircle(27, 16, 4);
    lcGfx.fillStyle(0xFF6600); lcGfx.fillRect(12, 26, 16, 4);
    lcGfx.generateTexture('large_curse', 40, 40); lcGfx.destroy();

    // --- Čaroděj (28×40) ---
    const sorGfx = g();
    sorGfx.fillStyle(0x1a1a3a);
    sorGfx.fillRect(8, 0, 12, 12);   // hlava
    sorGfx.fillRect(4, 12, 20, 20);  // tělo
    sorGfx.fillRect(0, 12, 6, 16);   // levá ruka
    sorGfx.fillRect(22, 12, 6, 16);  // pravá ruka
    sorGfx.fillRect(6, 32, 6, 8);    // levá noha
    sorGfx.fillRect(16, 32, 6, 8);   // pravá noha
    sorGfx.fillStyle(0xFF4500); sorGfx.fillCircle(2, 20, 4);
    sorGfx.generateTexture('sorcerer', 28, 40); sorGfx.destroy();

    // --- Projektil čaroděje (12×12) ---
    const projGfx = g();
    projGfx.fillStyle(0xFF4500); projGfx.fillCircle(6, 6, 6);
    projGfx.generateTexture('sorcerer_proj', 12, 12); projGfx.destroy();

    // --- Boss placeholder (70×70) — tmavě fialový, červené oči ---
    const bossGfx = g();
    bossGfx.fillStyle(0x2D0057); bossGfx.fillCircle(35, 38, 32);
    bossGfx.fillStyle(0xFF0000); bossGfx.fillCircle(24, 28, 6); bossGfx.fillCircle(46, 28, 6);
    bossGfx.fillStyle(0x9B59B6); bossGfx.fillCircle(35, 20, 12); // koruna
    bossGfx.fillStyle(0xFF0000); bossGfx.fillRect(22, 44, 26, 5); // ústa
    bossGfx.generateTexture('boss_placeholder', 70, 70); bossGfx.destroy();

    // --- Sukuna / α1 placeholder (32×48) ---
    // Bílé kimono, černý obi, tmavé vlasy, červené tetování (GDD paleta)
    const sukGfx = g();
    sukGfx.fillStyle(0xEFEFEF); sukGfx.fillRect(0, 0, 32, 48);   // kimono (bílé)
    sukGfx.fillStyle(0x1a1a1a); sukGfx.fillRect(8, 0, 16, 14);   // tmavé vlasy
    sukGfx.fillStyle(0xF0D9C0); sukGfx.fillRect(10, 4, 12, 10);  // pleť obličeje
    sukGfx.fillStyle(0x222222); sukGfx.fillRect(4, 22, 24, 6);   // obi pás
    sukGfx.fillStyle(0x8B0000);                                    // červené tetování
    sukGfx.fillRect(2, 16, 4, 8);
    sukGfx.fillRect(26, 16, 4, 8);
    sukGfx.fillCircle(16, 10, 2);  // třetí oko
    sukGfx.generateTexture('sukuna_placeholder', 32, 48); sukGfx.destroy();

    // --- Cleave vlna (800×20) — červená vlna po podlaze ---
    const cleaveGfx = g();
    cleaveGfx.fillStyle(0x8B0000); cleaveGfx.fillRect(0, 0, 800, 20);
    cleaveGfx.fillStyle(0xFF0000); cleaveGfx.fillRect(0, 0, 800, 6);
    cleaveGfx.generateTexture('cleave_wave', 800, 20); cleaveGfx.destroy();

    // --- Malevolent Shrine šíp (20×8) ---
    const arrowGfx = g();
    arrowGfx.fillStyle(0xFF4500); arrowGfx.fillRect(0, 2, 14, 4);   // tělo šípu
    arrowGfx.fillStyle(0xFF6600);
    arrowGfx.fillTriangle(14, 0, 14, 8, 20, 4);                      // hrot
    arrowGfx.generateTexture('shrine_arrow', 20, 8); arrowGfx.destroy();
  }
}
