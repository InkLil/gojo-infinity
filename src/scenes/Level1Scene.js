// Level1Scene.js
// Level 1 — Japonská vesnice
// Fáze 2: Gojo pohyb, platformy
// Fáze 3: HUD, schopnosti (Nekonečno, Duté fialové)
// Fáze 6+: nepřátelé, mince, brána, finální design

class Level1Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1Scene' });
    this.score = 0;
  }

  preload() {
    // --- Placeholder textury (programaticky generované) ---

    // Gojo: bílý obdélník 32×48 px
    const gojoGfx = this.make.graphics({ x: 0, y: 0, add: false });
    gojoGfx.fillStyle(0xF0F0FF);          // bílá
    gojoGfx.fillRect(0, 0, 32, 48);
    gojoGfx.fillStyle(0x1E1E3F);          // tmavé brýle
    gojoGfx.fillRect(6, 12, 20, 8);
    gojoGfx.fillStyle(0xEA580C);          // oranžový odznak
    gojoGfx.fillCircle(10, 28, 4);
    gojoGfx.generateTexture('gojo_placeholder', 32, 48);
    gojoGfx.destroy();

    // Platforma: hnědé dřevo
    const platGfx = this.make.graphics({ x: 0, y: 0, add: false });
    platGfx.fillStyle(0x92400E);
    platGfx.fillRect(0, 0, 200, 20);
    platGfx.fillStyle(0x78350F);          // tmavší horní okraj
    platGfx.fillRect(0, 0, 200, 4);
    platGfx.generateTexture('platform', 200, 20);
    platGfx.destroy();

    // Podlaha: tráva
    const groundGfx = this.make.graphics({ x: 0, y: 0, add: false });
    groundGfx.fillStyle(0x4ADE80);
    groundGfx.fillRect(0, 0, 800, 32);
    groundGfx.fillStyle(0x166534);        // tmavší spodní část
    groundGfx.fillRect(0, 6, 800, 26);
    groundGfx.generateTexture('ground', 800, 32);
    groundGfx.destroy();

    // Cílová brána: zlatý obdélník (placeholder — finální sprite v Fázi 6)
    const gateGfx = this.make.graphics({ x: 0, y: 0, add: false });
    gateGfx.fillStyle(0xFFD700);           // zlatá
    gateGfx.fillRect(0, 0, 40, 60);
    gateGfx.fillStyle(0xFFA500);           // tmavší rámeček
    gateGfx.lineStyle(3, 0xFFA500);
    gateGfx.strokeRect(2, 2, 36, 56);
    gateGfx.generateTexture('gate', 40, 60);
    gateGfx.destroy();

    // Duté fialové: fialová koule 24px
    const purpleGfx = this.make.graphics({ x: 0, y: 0, add: false });
    purpleGfx.fillStyle(0x6B21A8);
    purpleGfx.fillCircle(12, 12, 12);
    purpleGfx.fillStyle(0xC4B5FD);        // světlé jádro
    purpleGfx.fillCircle(12, 12, 6);
    purpleGfx.generateTexture('hollow_purple', 24, 24);
    purpleGfx.destroy();
  }

  create() {
    const { width, height } = this.scale;
    this.score = 0;

    // --- Pozadí ---
    this.add.rectangle(width / 2, height / 2, width, height, 0x87CEEB);

    // --- Platformy ---
    this.platforms = this.physics.add.staticGroup();

    const ground = this.platforms.create(width / 2, height - 16, 'ground');
    ground.setDisplaySize(width, 32).refreshBody();

    this.platforms.create(150, 320, 'platform');
    this.platforms.create(350, 260, 'platform');
    this.platforms.create(560, 190, 'platform');
    this.platforms.create(700, 300, 'platform');

    // --- Gojo ---
    this.gojo = new Gojo(this, 80, height - 80);
    this.physics.add.collider(this.gojo, this.platforms);

    // --- HUD ---
    this.hud = new HUD(this, this.gojo);

    // --- Cílová brána — konec levelu ---
    // Umístěna vpravo na poslední platformě (x=700, y=300)
    this.gate = this.physics.add.staticSprite(750, height - 46, 'gate');

    // Když se Gojo dotkne brány → dokončení levelu
    this.physics.add.overlap(this.gojo, this.gate, this.completeLevel, null, this);

    // --- Projektily Dutého fialového ---
    // physics.add.group = pohybující se objekty s fyzikou
    this.hollowPurples = this.physics.add.group();

    // Posloucháme událost z Gojo.js když hráč stiskne X
    this.events.on('fireHollowPurple', this.spawnHollowPurple, this);
  }

  // Dokončení levelu — +1 život, přechod na Level 2
  completeLevel() {
    if (this.levelComplete) return; // zabraňuje dvojímu spuštění
    this.levelComplete = true;

    this.gojo.gainLife(); // +1 srdíčko (max 3)

    // Krátká pauza před přechodem (hráč vidí zlatý záblesk)
    this.time.delayedCall(800, () => {
      this.scene.start('Level2Scene');
    });
  }

  // Spawnuje fialovou kouli při stisku X
  spawnHollowPurple(x, y, facingLeft) {
    const ball = this.hollowPurples.create(x, y, 'hollow_purple');

    // Vypne gravitaci pro projektil — letí horizontálně
    ball.body.setAllowGravity(false);

    // Rychlost: 600 px/s vlevo nebo vpravo podle směru Gojo
    const speed = 600;
    ball.setVelocityX(facingLeft ? -speed : speed);

    // Zničí se po 3 sekundách (kdyby minul okraj)
    this.time.delayedCall(3000, () => {
      if (ball && ball.active) ball.destroy();
    });
  }

  update() {
    this.gojo.update();
    this.hud.update(this.score);

    // Zničení projektilů mimo obrazovku
    this.hollowPurples.getChildren().forEach(ball => {
      if (ball.x < -50 || ball.x > 850) ball.destroy();
    });
  }
}
