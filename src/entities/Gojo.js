// Gojo.js
// Hlavní postava — Satoru Gojo
// Fáze 2: pohyb, skok, dvojitý skok
// Fáze 3: schopnosti (Nekonečno Z, Duté fialové X), HP systém

class Gojo extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'gojo_placeholder');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.body.setSize(28, 44);
    this.body.setOffset(2, 4);

    // --- Pohyb ---
    this.speed = 200;
    this.jumpVelocity = -480;
    this.maxJumps = 2;
    this.jumpsLeft = 2;
    this.jumpPressed = false;

    // --- HP ---
    this.hp = 3;
    this.maxHp = 3;
    this.invincible = false; // krátká neporazitelnost po zásahu (blikání)

    // --- Schopnosti — časy (ms timestamps) ---
    // Phaser.time.now = aktuální čas v ms od spuštění hry
    this.infinityReadyAt     = 0; // kdy bude Nekonečno znovu připraveno
    this.infinityActiveUntil = 0; // do kdy je štít aktivní
    this.infinityDuration    = 3000; // 3 sekundy aktivní
    this.infinityCooldownMs  = 8000; // 8 sekund cooldown (GDD spec)

    this.purpleReadyAt      = 0;    // kdy bude Duté fialové připraveno
    this.purpleCooldownMs   = 5000; // 5 sekund cooldown (GDD spec)

    // --- Klávesy ---
    this.cursors  = scene.input.keyboard.createCursorKeys();
    this.wasd     = scene.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.zKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.xKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    // Zabraňuje opakování při držení klávesy
    this.zPressed    = false;
    this.xPressed    = false;
  }

  // --- Veřejná metoda: zásah nepřítelem ---
  // --- Veřejná metoda: získání života po dokončení levelu ---
  gainLife() {
    if (this.hp < this.maxHp) {
      this.hp++;
      // Zlatý záblesk jako vizuální potvrzení
      this.setTint(0xFFD700);
      this.scene.time.delayedCall(400, () => { this.clearTint(); });
    }
  }

  takeDamage(amount = 1) {
    // Nekonečno blokuje veškeré poškození
    if (this.infinityActive || this.invincible) return;

    this.hp = Math.max(0, this.hp - amount);

    // Krátká neporazitelnost po zásahu (1 sekunda), zamezí opakovanému poškození
    this.invincible = true;
    this.scene.time.delayedCall(1000, () => { this.invincible = false; });

    // Červené bliknutí při zásahu
    this.setTint(0xFF0000);
    this.scene.time.delayedCall(200, () => {
      if (!this.infinityActive) this.clearTint();
    });

    // Smrt
    if (this.hp <= 0) {
      this.scene.scene.start('GameOverScene');
    }
  }

  update() {
    const now      = this.scene.time.now;
    const onGround = this.body.blocked.down;

    // --- Reset skoků při přistání ---
    if (onGround) {
      this.jumpsLeft = this.maxJumps;
    }

    // --- Pohyb ---
    const goLeft  = this.cursors.left.isDown  || this.wasd.left.isDown;
    const goRight = this.cursors.right.isDown || this.wasd.right.isDown;

    if (goLeft) {
      this.setVelocityX(-this.speed);
      this.setFlipX(true);
    } else if (goRight) {
      this.setVelocityX(this.speed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    // --- Skok ---
    const jumpDown = this.cursors.up.isDown || this.cursors.space.isDown || this.wasd.up.isDown;

    if (jumpDown && !this.jumpPressed && this.jumpsLeft > 0) {
      this.setVelocityY(this.jumpVelocity);
      this.jumpsLeft--;
      this.jumpPressed = true;
    }
    if (!jumpDown) this.jumpPressed = false;

    // =====================================================
    // SCHOPNOSTI
    // =====================================================

    // --- Nekonečno [Z] — štít ---
    this.infinityActive = now < this.infinityActiveUntil;

    if (this.zKey.isDown && !this.zPressed && now >= this.infinityReadyAt) {
      // Aktivace štítu
      this.infinityActiveUntil = now + this.infinityDuration;
      this.infinityReadyAt     = now + this.infinityCooldownMs;
      this.zPressed = true;
    }
    if (!this.zKey.isDown) this.zPressed = false;

    // Vizuál: fialový tint při aktivním štítu
    if (this.infinityActive) {
      // Pulsující efekt — střídáme dva odstíny fialové
      const pulse = Math.sin(now * 0.01) > 0 ? 0xC4B5FD : 0x9B59B6;
      this.setTint(pulse);
    } else if (!this.invincible) {
      this.clearTint();
    }

    // --- Duté fialové [X] — výstřel ---
    if (this.xKey.isDown && !this.xPressed && now >= this.purpleReadyAt) {
      // Informujeme scénu ať spawne projektil (scéna řídí fyziku projektilů)
      this.scene.events.emit('fireHollowPurple', this.x, this.y, this.flipX);
      this.purpleReadyAt = now + this.purpleCooldownMs;
      this.xPressed = true;
    }
    if (!this.xKey.isDown) this.xPressed = false;
  }
}
