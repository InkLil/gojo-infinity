// Level1Scene.js
// Level 1 — Japonská vesnice
// Fáze 2: pohyb, platformy
// Fáze 3: HUD, schopnosti
// Fáze 4: nepřátelé (malá kletba, čaroděj), skóre
// Fáze 6+: finální design, mince, brána

class Level1Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1Scene' });
    this.score = 0;
  }

  preload() {
    // --- Placeholder textury ---

    // Gojo
    const gojoGfx = this.make.graphics({ x: 0, y: 0, add: false });
    gojoGfx.fillStyle(0xF0F0FF);
    gojoGfx.fillRect(0, 0, 32, 48);
    gojoGfx.fillStyle(0x1E1E3F);
    gojoGfx.fillRect(6, 12, 20, 8);
    gojoGfx.fillStyle(0xEA580C);
    gojoGfx.fillCircle(10, 28, 4);
    gojoGfx.generateTexture('gojo_placeholder', 32, 48);
    gojoGfx.destroy();

    // Platforma
    const platGfx = this.make.graphics({ x: 0, y: 0, add: false });
    platGfx.fillStyle(0x92400E);
    platGfx.fillRect(0, 0, 200, 20);
    platGfx.fillStyle(0x78350F);
    platGfx.fillRect(0, 0, 200, 4);
    platGfx.generateTexture('platform', 200, 20);
    platGfx.destroy();

    // Podlaha
    const groundGfx = this.make.graphics({ x: 0, y: 0, add: false });
    groundGfx.fillStyle(0x4ADE80);
    groundGfx.fillRect(0, 0, 800, 32);
    groundGfx.fillStyle(0x166534);
    groundGfx.fillRect(0, 6, 800, 26);
    groundGfx.generateTexture('ground', 800, 32);
    groundGfx.destroy();

    // Duté fialové koule
    const purpleGfx = this.make.graphics({ x: 0, y: 0, add: false });
    purpleGfx.fillStyle(0x6B21A8);
    purpleGfx.fillCircle(12, 12, 12);
    purpleGfx.fillStyle(0xC4B5FD);
    purpleGfx.fillCircle(12, 12, 6);
    purpleGfx.generateTexture('hollow_purple', 24, 24);
    purpleGfx.destroy();

    // Cílová brána
    const gateGfx = this.make.graphics({ x: 0, y: 0, add: false });
    gateGfx.fillStyle(0xFFD700);
    gateGfx.fillRect(0, 0, 40, 60);
    gateGfx.lineStyle(3, 0xFFA500);
    gateGfx.strokeRect(2, 2, 36, 56);
    gateGfx.generateTexture('gate', 40, 60);
    gateGfx.destroy();

    // Malá kletba — tmavě fialový blob 24×24
    const scGfx = this.make.graphics({ x: 0, y: 0, add: false });
    scGfx.fillStyle(0x4B0082);          // tmavá fialová
    scGfx.fillCircle(12, 14, 11);       // tělo
    scGfx.fillStyle(0xFF0000);
    scGfx.fillCircle(8,  10, 3);        // levé oko
    scGfx.fillCircle(16, 10, 3);        // pravé oko
    scGfx.generateTexture('small_curse', 24, 24);
    scGfx.destroy();

    // Velká kletba — větší tmavý blob 40×40
    const lcGfx = this.make.graphics({ x: 0, y: 0, add: false });
    lcGfx.fillStyle(0x2D0057);          // ještě temnější fialová
    lcGfx.fillCircle(20, 22, 18);
    lcGfx.fillStyle(0xFF0000);
    lcGfx.fillCircle(13, 16, 4);
    lcGfx.fillCircle(27, 16, 4);
    lcGfx.fillStyle(0xFF6600);          // oranžová ústa
    lcGfx.fillRect(12, 26, 16, 4);
    lcGfx.generateTexture('large_curse', 40, 40);
    lcGfx.destroy();

    // Čaroděj — tmavá humanoidní postava 28×40
    const sorGfx = this.make.graphics({ x: 0, y: 0, add: false });
    sorGfx.fillStyle(0x1a1a3a);         // tmavě modrá
    sorGfx.fillRect(8, 0, 12, 12);      // hlava
    sorGfx.fillRect(4, 12, 20, 20);     // tělo
    sorGfx.fillRect(0, 12, 6, 16);      // levá ruka
    sorGfx.fillRect(22, 12, 6, 16);     // pravá ruka
    sorGfx.fillRect(6, 32, 6, 8);       // levá noha
    sorGfx.fillRect(16, 32, 6, 8);      // pravá noha
    sorGfx.fillStyle(0xFF4500);         // oranžová koule v ruce
    sorGfx.fillCircle(2, 20, 4);
    sorGfx.generateTexture('sorcerer', 28, 40);
    sorGfx.destroy();

    // Projektil čaroděje — oranžový blob 12×12
    const projGfx = this.make.graphics({ x: 0, y: 0, add: false });
    projGfx.fillStyle(0xFF4500);
    projGfx.fillCircle(6, 6, 6);
    projGfx.generateTexture('sorcerer_proj', 12, 12);
    projGfx.destroy();
  }

  create() {
    const { width, height } = this.scale;
    this.score = 0;
    this.levelComplete = false;

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

    // --- Cílová brána ---
    this.gate = this.physics.add.staticSprite(760, height - 46, 'gate');
    this.physics.add.overlap(this.gojo, this.gate, this.completeLevel, null, this);

    // --- HUD ---
    this.hud = new HUD(this, this.gojo);

    // --- Skupiny nepřátel ---
    this.smallCurses = this.physics.add.group();
    this.largeCurses = this.physics.add.group();
    this.sorcerers   = this.physics.add.group();

    // GDD Level 1: 4 malé kletby, 2 čarodějové
    this.spawnSmallCurse(280,  height - 60);
    this.spawnSmallCurse(460,  height - 60);
    this.spawnSmallCurse(330,  235);          // na platformě y=260
    this.spawnSmallCurse(540,  165);          // na platformě y=190

    this.spawnSorcerer(180,   295);           // na platformě y=320
    this.spawnSorcerer(680,   275);           // na platformě y=300

    // Kolize nepřátel s platformami (aby stáli na zemi)
    this.physics.add.collider(this.smallCurses, this.platforms);
    this.physics.add.collider(this.largeCurses, this.platforms);
    this.physics.add.collider(this.sorcerers,   this.platforms);

    // --- Projektily ---
    this.hollowPurples      = this.physics.add.group();
    this.sorcererProjectiles = this.physics.add.group();

    // Události z entit
    this.events.on('fireHollowPurple', this.spawnHollowPurple, this);
    this.events.on('sorcererShoot',    this.spawnSorcererProj, this);
    this.events.on('enemyKilled',      this.onEnemyKilled,     this);

    // --- Kolize: Gojo × nepřátelé (kontaktní poškození) ---
    this.physics.add.overlap(this.gojo, this.smallCurses, (gojo, enemy) => {
      gojo.takeDamage(enemy.damage);
    });
    this.physics.add.overlap(this.gojo, this.largeCurses, (gojo, enemy) => {
      gojo.takeDamage(enemy.damage);
    });
    this.physics.add.overlap(this.gojo, this.sorcerers, (gojo, enemy) => {
      gojo.takeDamage(enemy.damage);
    });

    // --- Kolize: Gojo × projektil čaroděje ---
    this.physics.add.overlap(this.gojo, this.sorcererProjectiles, (gojo, proj) => {
      proj.destroy();
      gojo.takeDamage(1);
    });

    // --- Kolize: Duté fialové × nepřátelé (zabití) ---
    this.physics.add.overlap(this.hollowPurples, this.smallCurses, (ball, enemy) => {
      enemy.takeDamage(10);  // okamžitě zabije
    });
    this.physics.add.overlap(this.hollowPurples, this.largeCurses, (ball, enemy) => {
      enemy.takeDamage(10);
    });
    this.physics.add.overlap(this.hollowPurples, this.sorcerers, (ball, enemy) => {
      enemy.takeDamage(10);
    });
  }

  // --- Spawn helpers ---
  spawnSmallCurse(x, y) {
    const enemy = new SmallCurse(this, x, y);
    this.smallCurses.add(enemy);
    return enemy;
  }

  spawnSorcerer(x, y) {
    const enemy = new Sorcerer(this, x, y);
    this.sorcerers.add(enemy);
    return enemy;
  }

  // --- Projektily ---
  spawnHollowPurple(x, y, facingLeft) {
    const ball = this.hollowPurples.create(x, y, 'hollow_purple');
    ball.body.setAllowGravity(false);
    ball.setVelocityX(facingLeft ? -600 : 600);
    this.time.delayedCall(3000, () => { if (ball && ball.active) ball.destroy(); });
  }

  spawnSorcererProj(x, y, dirX) {
    const proj = this.sorcererProjectiles.create(x, y, 'sorcerer_proj');
    proj.body.setAllowGravity(false);
    proj.setVelocityX(dirX * 250);
    this.time.delayedCall(4000, () => { if (proj && proj.active) proj.destroy(); });
  }

  // --- Skóre za zabití nepřítele ---
  onEnemyKilled(x, y, points) {
    this.score += points;

    // Krátký text "+100" kde nepřítel zemřel
    const txt = this.add.text(x, y - 10, '+' + points, {
      fontSize: '14px', fill: '#FFD700', fontFamily: 'monospace', fontStyle: 'bold'
    }).setDepth(20);

    this.tweens.add({
      targets: txt,
      y: y - 40,
      alpha: 0,
      duration: 800,
      onComplete: () => txt.destroy()
    });
  }

  // --- Dokončení levelu ---
  completeLevel() {
    if (this.levelComplete) return;
    this.levelComplete = true;
    this.gojo.gainLife();
    this.time.delayedCall(800, () => { this.scene.start('Level2Scene'); });
  }

  update() {
    this.gojo.update();
    this.hud.update(this.score);

    // Update nepřátel
    this.smallCurses.getChildren().forEach(e => { if (e.active) e.update(); });
    this.largeCurses.getChildren().forEach(e => { if (e.active) e.update(); });

    // Čistění projektilů mimo obrazovku
    [this.hollowPurples, this.sorcererProjectiles].forEach(group => {
      group.getChildren().forEach(p => {
        if (p.x < -50 || p.x > 850) p.destroy();
      });
    });
  }
}
