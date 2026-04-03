// HUD.js
// Heads-Up Display — srdíčka, cooldown bary, skóre
// Všechny prvky mají setScrollFactor(0) = zůstanou pevně na obrazovce
// i když se kamera později pohybuje s Gojem

class HUD {
  constructor(scene, gojo, levelNumber = 1) {
    this.scene = scene;
    this.gojo  = gojo;

    const depth = 10; // HUD je nad vším ostatním

    // -------------------------------------------------------
    // SRDÍČKA — 3 portréty Gojo (placeholder: bílé čtverečky)
    // Levý horní roh — GDD spec
    // -------------------------------------------------------
    this.hearts = [];
    for (let i = 0; i < 3; i++) {
      // Tmavé pozadí (vždy viditelné)
      const bg = scene.add.rectangle(20 + i * 28, 20, 20, 20, 0x333333)
        .setScrollFactor(0).setDepth(depth);

      // Gojo portrét — plný = žije, šedý tint = ztraceno
      const portrait = scene.add.image(20 + i * 28, 20, 'gojo_portrait')
        .setScrollFactor(0).setDepth(depth + 1)
        .setDisplaySize(18, 18);

      this.hearts.push({ bg, portrait });
    }

    // -------------------------------------------------------
    // COOLDOWN BARY — levý dolní roh
    // -------------------------------------------------------
    const barY  = 430;
    const barW  = 110;
    const barH  = 10;

    // -- Nekonečno [Z] — vlevo --
    scene.add.text(16, barY - 14, '[Z] Nekonečno', {
      fontSize: '10px', fill: '#111111', fontFamily: 'monospace'
    }).setScrollFactor(0).setDepth(depth);

    scene.add.rectangle(16, barY, barW, barH, 0x222222)
      .setOrigin(0, 0.5).setScrollFactor(0).setDepth(depth);

    this.infinityBar = scene.add.rectangle(16, barY, barW, barH, 0x6B21A8)
      .setOrigin(0, 0.5).setScrollFactor(0).setDepth(depth + 1);

    this.infinityReady = scene.add.text(130, barY - 5, 'READY', {
      fontSize: '9px', fill: '#4ADE80', fontFamily: 'monospace'
    }).setScrollFactor(0).setDepth(depth + 1).setVisible(true);

    // -- Duté fialové [X] — hned vedle, s mezerou 160px --
    scene.add.text(176, barY - 14, '[X] Duté fialové', {
      fontSize: '10px', fill: '#111111', fontFamily: 'monospace'
    }).setScrollFactor(0).setDepth(depth);

    scene.add.rectangle(176, barY, barW, barH, 0x222222)
      .setOrigin(0, 0.5).setScrollFactor(0).setDepth(depth);

    this.purpleBar = scene.add.rectangle(176, barY, barW, barH, 0x9B59B6)
      .setOrigin(0, 0.5).setScrollFactor(0).setDepth(depth + 1);

    this.purpleReady = scene.add.text(290, barY - 5, 'READY', {
      fontSize: '9px', fill: '#4ADE80', fontFamily: 'monospace'
    }).setScrollFactor(0).setDepth(depth + 1).setVisible(true);

    // -------------------------------------------------------
    // SCREENSHOT tlačítko — vedle skóre vpravo nahoře
    // -------------------------------------------------------
    const ssBtn = scene.add.text(680, 16, '[📸]', {
      fontSize: '13px', fill: '#F0F0FF', fontFamily: 'monospace'
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(depth).setInteractive({ useHandCursor: true });

    ssBtn.on('pointerover', () => ssBtn.setStyle({ fill: '#FFD700' }));
    ssBtn.on('pointerout',  () => ssBtn.setStyle({ fill: '#F0F0FF' }));
    ssBtn.on('pointerdown', () => {
      scene.game.renderer.snapshot((image) => {
        const link = document.createElement('a');
        link.href = image.src;
        link.download = 'gojo-infinity.png';
        link.click();
      });
    });

    // -------------------------------------------------------
    // SKÓRE — pravý horní roh
    // -------------------------------------------------------
    this.scoreText = scene.add.text(790, 16, 'Skóre: 0', {
      fontSize: '14px', fill: '#F0F0FF', fontFamily: 'monospace'
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(depth);

    // -------------------------------------------------------
    // ČÍSLO LEVELU — střed nahoře
    // -------------------------------------------------------
    scene.add.text(400, 16, 'Level ' + levelNumber, {
      fontSize: '14px', fill: '#F0F0FF', fontFamily: 'monospace'
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(depth);

    // -------------------------------------------------------
    // INFINITY AKTIVNÍ — zpráva uprostřed (blikne při aktivaci)
    // -------------------------------------------------------
    this.infinityMsg = scene.add.text(400, 80, '∞ NEKONEČNO AKTIVNÍ ∞', {
      fontSize: '16px', fill: '#111111', fontFamily: 'monospace', fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 2).setVisible(false);
  }

  // Zobrazí varování uprostřed obrazovky (Sukuna spawn, fáze 2)
  showWarning(text, color = 0xFF0000) {
    const hex = '#' + color.toString(16).padStart(6, '0');
    const msg = this.scene.add.text(400, 100, text, {
      fontSize: '18px', fill: hex, fontFamily: 'monospace', fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5).setScrollFactor(0).setDepth(50);

    // Blikání + zmizení po 2.5 sekundách
    this.scene.tweens.add({
      targets: msg, alpha: { from: 1, to: 0 },
      duration: 2500, ease: 'Power2',
      onComplete: () => msg.destroy()
    });
  }

  // Voláno každý snímek z Level1Scene.update()
  update(score = 0) {
    const now   = this.scene.time.now;
    const gojo  = this.gojo;

    // --- Srdíčka ---
    for (let i = 0; i < 3; i++) {
      const alive = i < gojo.hp;
      this.hearts[i].portrait.setTint(alive ? 0xFFFFFF : 0x444444);
    }

    // --- Nekonečno bar ---
    // fillRatio: 0 = prázdný (právě použito), 1 = plný (připraveno)
    const infFill = gojo.infinityReadyAt <= now
      ? 1
      : 1 - ((gojo.infinityReadyAt - now) / gojo.infinityCooldownMs);

    this.infinityBar.setDisplaySize(Math.max(2, 110 * infFill), 10);
    this.infinityReady.setVisible(infFill >= 1);

    // Zpráva "NEKONEČNO AKTIVNÍ"
    this.infinityMsg.setVisible(gojo.infinityActive);

    // --- Duté fialové bar ---
    const purFill = gojo.purpleReadyAt <= now
      ? 1
      : 1 - ((gojo.purpleReadyAt - now) / gojo.purpleCooldownMs);

    this.purpleBar.setDisplaySize(Math.max(2, 110 * purFill), 10);
    this.purpleReady.setVisible(purFill >= 1);

    // --- Skóre ---
    this.scoreText.setText('Skóre: ' + score);
  }
}
