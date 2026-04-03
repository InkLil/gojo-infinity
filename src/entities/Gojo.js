// Gojo.js
// Hlavní postava — Satoru Gojo
// Fáze 2: pohyb, skok, dvojitý skok
// Fáze 3+: animace, schopnosti (Nekonečno, Duté fialové)

class Gojo extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'gojo_placeholder'); // placeholder texture — viz Level1Scene.preload

    // Přidej Gojo do scény a fyzikálního světa
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // --- Fyzika ---
    this.setCollideWorldBounds(true); // nesmí vypadnout z obrazovky
    this.body.setSize(28, 44);        // hitbox mírně menší než sprite (32×48)
    this.body.setOffset(2, 4);        // vycentrování hitboxu

    // --- Proměnné pohybu ---
    this.speed = 200;        // GDD: 200 px/s
    this.jumpVelocity = -480; // výška skoku ~120 px (výpočet: sqrt(2 * 800 * 120) ≈ 438, trochu více pro pohodlí)
    this.maxJumps = 2;       // GDD: dvojitý skok povolen
    this.jumpsLeft = 2;      // kolik skoků zbývá

    // --- Klávesy ---
    this.cursors = scene.input.keyboard.createCursorKeys(); // šipky + Space
    this.wasd = scene.input.keyboard.addKeys({              // WASD alternativa
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.jumpKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.upKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

    // jumpPressed: zabrání opakovanému skoku při držení klávesy
    this.jumpPressed = false;
  }

  update() {
    const onGround = this.body.blocked.down; // je Gojo na zemi nebo platformě?

    // --- Reset počtu skoků při přistání ---
    if (onGround) {
      this.jumpsLeft = this.maxJumps;
    }

    // --- Pohyb vlevo / vpravo ---
    const goLeft  = this.cursors.left.isDown  || this.wasd.left.isDown;
    const goRight = this.cursors.right.isDown || this.wasd.right.isDown;

    if (goLeft) {
      this.setVelocityX(-this.speed);
      this.setFlipX(true);   // otočení spriteu doleva
    } else if (goRight) {
      this.setVelocityX(this.speed);
      this.setFlipX(false);  // výchozí směr = doprava
    } else {
      this.setVelocityX(0);  // zastavení
    }

    // --- Skok (jednoduchý + dvojitý) ---
    const jumpDown = this.cursors.up.isDown || this.jumpKey.isDown || this.wasd.up.isDown;

    if (jumpDown && !this.jumpPressed && this.jumpsLeft > 0) {
      this.setVelocityY(this.jumpVelocity);
      this.jumpsLeft--;
      this.jumpPressed = true; // zablokuj dokud klávesa není puštěna
    }

    // Uvolnění klávesy = povolení dalšího skoku
    if (!jumpDown) {
      this.jumpPressed = false;
    }
  }
}
