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

  // Textury jsou generovány v BootScene

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
