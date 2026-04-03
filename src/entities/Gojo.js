// Gojo.js
// Hlavní postava — Satoru Gojo
// Fáze 2: pohyb, skok, dvojitý skok
// Fáze 3: schopnosti (Nekonečno Z, Duté fialové X), HP systém

class Gojo extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'gojo_spritesheet');

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
    this.invincible = true; // spawn invincibility — 1 sekunda na začátku levelu
    scene.time.delayedCall(1000, () => { this.invincible = false; });

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

    // --- Animační příznaky ---
    this._hitAnim    = false;
    this._firingAnim = false;
    this._dyingAnim  = false;

    this.play('gojo_idle');
  }

  // --- Veřejná metoda: zásah nepřítelem ---
  // --- Veřejná metoda: získání života ---
  gainLife() {
    if (this.hp < this.maxHp) {
      this.hp++;
      this.setTint(0xFFD700);
      this.scene.time.delayedCall(400, () => { if (this.active) this.clearTint(); });
    } else {
      // Již plné HP — ukáž MAX!
      this.scene.events.emit('showMessage', this.x, this.y - 20, 'MAX!', '#FFD700');
    }
  }

  takeDamage(amount = 1) {
    // Nekonečno blokuje veškeré poškození
    if (this.infinityActive || this.invincible) return;

    this.hp = Math.max(0, this.hp - amount);

    // Krátká neporazitelnost po zásahu (1 sekunda), zamezí opakovanému poškození
    this.invincible = true;
    this.scene.time.delayedCall(1000, () => { this.invincible = false; });

    // Animace + červené bliknutí při zásahu
    if (this.hp > 0) {
      this._hitAnim = true;
      this.play('gojo_hit');
      this.setTint(0xFF0000);
      this.once('animationcomplete-gojo_hit', () => {
        this._hitAnim = false;
        if (!this.infinityActive) this.clearTint();
      });
    }

    // Smrt
    if (this.hp <= 0) {
      this._dyingAnim = true;
      this.play('gojo_death');
      this.once('animationcomplete-gojo_death', () => {
        this.scene.scene.start('GameOverScene');
      });
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
      this.scene.events.emit('fireHollowPurple', this.x, this.y, this.flipX);
      this.purpleReadyAt = now + this.purpleCooldownMs;
      this.xPressed = true;
      this._firingAnim = true;
      this.play('gojo_hollow_purple');
      this.once('animationcomplete-gojo_hollow_purple', () => { this._firingAnim = false; });
    }
    if (!this.xKey.isDown) this.xPressed = false;

    this._playAnimation();
  }

  _playAnimation() {
    if (this._dyingAnim) return;
    if (this._hitAnim)   { this.play('gojo_hit', true); return; }
    if (this._firingAnim){ this.play('gojo_hollow_purple', true); return; }

    const onGround = this.body.blocked.down;
    const vy       = this.body.velocity.y;

    if (this.infinityActive) {
      this.play('gojo_infinity', true);
      return;
    }
    if (!onGround) {
      if (vy < -50) this.play('gojo_jump', true);
      else          this.play('gojo_fall', true);
      return;
    }
    if (Math.abs(this.body.velocity.x) > 10) {
      this.play('gojo_run', true);
    } else {
      this.play('gojo_idle', true);
    }
  }
}
