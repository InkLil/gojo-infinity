// Level1Scene.js
// Level 1 — Středověká vesnice — FINÁLNÍ DESIGN (Fáze 8)
// GDD: 4 malé kletby, 2 čarodějové, zlaté mince, bonus srdíčko, zlatá brána

class Level1Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1Scene' });
    this.score = 0;
  }

  // Textury jsou generovány v BootScene

  create() {
    const { width, height } = this.scale;
    this.score         = 0;
    this.levelComplete = false;

    this.scene.launch('MobileControls');

    // -------------------------------------------------------
    // PARALLAX POZADÍ — středověká vesnice (2 vrstvy)
    // bg_far  = vzdálené hory + nebe (1334×750 → scale 0.6)
    // bg_near = zelené kopce u země s průhledným nebem (1334×750)
    // -------------------------------------------------------
    const bgScale = height / 750;  // 1334×750 → škálujeme na výšku hry

    this.bg1 = this.add.tileSprite(0, 0, width, height, 'medieval_bg_far')
      .setOrigin(0, 0)
      .setTileScale(bgScale, bgScale);

    this.bg2 = this.add.tileSprite(0, 0, width, height, 'medieval_bg_near')
      .setOrigin(0, 0)
      .setTileScale(bgScale, bgScale);

    // -------------------------------------------------------
    // DEKORATIVNÍ VRSTVA — stromy v pozadí
    // -------------------------------------------------------
    this.add.image(80,  height - 90, 'medieval_tree1').setDisplaySize(70, 110).setAlpha(0.85);
    this.add.image(350, height - 85, 'medieval_tree2').setDisplaySize(55, 100).setAlpha(0.80);
    this.add.image(520, height - 88, 'medieval_tree1').setDisplaySize(65, 105).setAlpha(0.88);
    this.add.image(740, height - 82, 'medieval_tree2').setDisplaySize(50, 95).setAlpha(0.75);

    // -------------------------------------------------------
    // PLATFORMY — tutoriál skoku (jednoduché → obtížnější)
    // -------------------------------------------------------
    this.platforms = this.physics.add.staticGroup();

    // Podlaha
    const ground = this.platforms.create(width / 2, height - 16, 'ground');
    ground.setDisplaySize(width, 32).refreshBody();

    // Platforma 1 — nízká vlevo (dosažitelná jedním skokem)
    this.platforms.create(200, 330, 'medieval_platform_tile').setDisplaySize(200, 30).refreshBody();
    // Platforma 2 — střední (dosažitelná z platformy 1)
    this.platforms.create(390, 265, 'medieval_platform_tile').setDisplaySize(200, 30).refreshBody();
    // Platforma 3 — vyšší vpravo (double jump nebo skok z 2)
    this.platforms.create(570, 195, 'medieval_platform_tile').setDisplaySize(200, 30).refreshBody();
    // Platforma 4 — vede k bráně
    this.platforms.create(700, 300, 'medieval_platform_tile').setDisplaySize(200, 30).refreshBody();
    // Tajná platforma — schovaná výše, vede k bonus srdíčku
    this.platforms.create(290, 165, 'medieval_platform_tile').setDisplaySize(200, 30).refreshBody();

    // -------------------------------------------------------
    // GOJO
    // -------------------------------------------------------
    this.gojo = new Gojo(this, 60, height - 80);
    this.physics.add.collider(this.gojo, this.platforms);

    // -------------------------------------------------------
    // HUD
    // -------------------------------------------------------
    this.hud = new HUD(this, this.gojo, 1);

    // -------------------------------------------------------
    // NEPŘÁTELÉ — GDD Level 1: 4 malé kletby, 2 čarodějové
    // -------------------------------------------------------
    this.smallCurses = this.physics.add.group();
    this.sorcerers   = this.physics.add.group();
    this.largeCurses = this.physics.add.group(); // prázdná (Level 1 nemá velké kletby)

    // Malé kletby — postupně obtížnější pozice
    this.smallCurses.add(new SmallCurse(this, 280,  height - 60)); // 1. na zemi hned na začátku
    this.smallCurses.add(new SmallCurse(this, 200,  305));         // 2. na platformě 1
    this.smallCurses.add(new SmallCurse(this, 500,  height - 60)); // 3. na zemi uprostřed
    this.smallCurses.add(new SmallCurse(this, 390,  240));         // 4. na platformě 2

    // Čarodějové — na vyvýšených platformách
    this.sorcerers.add(new Sorcerer(this, 590, 170));  // na platformě 3, střílí dolů
    this.sorcerers.add(new Sorcerer(this, 720, 275));  // na platformě 4, hlídá bránu

    this.physics.add.collider(this.smallCurses, this.platforms);
    this.physics.add.collider(this.sorcerers,   this.platforms);

    // -------------------------------------------------------
    // MINCE — vedou hráče správným směrem
    // -------------------------------------------------------
    this.coins = this.physics.add.staticGroup();

    // Řada na zemi — navigace doprava
    [130, 160, 190].forEach(x => this.coins.create(x, height - 50, 'coin'));
    // Na platformě 1
    [170, 200, 230].forEach(x => this.coins.create(x, 310, 'coin'));
    // Přechod na platformu 2
    [330, 360, 390].forEach(x => this.coins.create(x, 245, 'coin'));
    // Na zemi za platformou
    [450, 480, 510].forEach(x => this.coins.create(x, height - 50, 'coin'));
    // Na platformě 3 a 4
    [550, 580].forEach(x => this.coins.create(x, 175, 'coin'));
    [670, 700].forEach(x => this.coins.create(x, 280, 'coin'));

    // Sběr mince
    this.physics.add.overlap(this.gojo, this.coins, (gojo, coin) => {
      coin.destroy();
      this.score += 50;
      this._showPoints(coin.x, coin.y, '+50');
    });

    // -------------------------------------------------------
    // BONUS SRDÍČKO — skryté na tajné platformě (y=165)
    // Vyžaduje double jump nebo skok z platformy 1
    // -------------------------------------------------------
    this.bonusHeart = this.physics.add.staticSprite(290, 140, 'bonus_heart');

    this.physics.add.overlap(this.gojo, this.bonusHeart, (gojo, heart) => {
      heart.destroy();
      gojo.gainLife();         // +1 HP (max 3)
      this._showPoints(heart.x, heart.y, '❤ +1');
    });

    // -------------------------------------------------------
    // CÍLOVÁ BRÁNA — na konci za čarodějem
    // -------------------------------------------------------
    this.gate = this.physics.add.staticSprite(765, height - 46, 'gate');
    this.physics.add.overlap(this.gojo, this.gate, this.completeLevel, null, this);

    // Šipka ukazující na bránu (jako hint)
    this.add.text(750, height - 115, '▼ CÍLE', {
      fontSize: '11px', fill: '#FFD700', fontFamily: 'monospace', fontStyle: 'bold'
    }).setOrigin(0.5);

    // -------------------------------------------------------
    // PROJEKTILY
    // -------------------------------------------------------
    this.hollowPurples       = this.physics.add.group();
    this.sorcererProjectiles = this.physics.add.group();

    this.events.on('fireHollowPurple', this.spawnHollowPurple, this);
    this.events.on('sorcererShoot',    this.spawnSorcererProj, this);
    this.events.on('enemyKilled',      this.onEnemyKilled,     this);
    this.events.on('showMessage',      this._showPoints,       this);

    // Kolize: Gojo × nepřátelé
    this.physics.add.overlap(this.gojo, this.smallCurses, (g, e) => g.takeDamage(e.damage));
    this.physics.add.overlap(this.gojo, this.sorcerers,   (g, e) => g.takeDamage(e.damage));
    this.physics.add.overlap(this.gojo, this.sorcererProjectiles, (g, p) => { p.destroy(); g.takeDamage(1); });

    // Kolize: Duté fialové × nepřátelé
    this.physics.add.overlap(this.hollowPurples, this.smallCurses, (b, e) => { if (e.active) e.takeDamage(10); });
    this.physics.add.overlap(this.hollowPurples, this.sorcerers,   (b, e) => { if (e.active) e.takeDamage(10); });
  }

  // --- Skóre za nepřítele ---
  onEnemyKilled(x, y, points) {
    this.score += points;
    this._showPoints(x, y, '+' + points);
  }

  // --- Plovoucí text (mince, body, srdíčko) ---
  _showPoints(x, y, text) {
    const txt = this.add.text(x, y - 10, text, {
      fontSize: '14px', fill: '#FFD700', fontFamily: 'monospace', fontStyle: 'bold'
    }).setDepth(20);
    this.tweens.add({
      targets: txt, y: y - 40, alpha: 0, duration: 800,
      onComplete: () => txt.destroy()
    });
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

  // --- Dokončení levelu ---
  completeLevel() {
    if (this.levelComplete) return;
    this.levelComplete = true;
    this.gojo.gainLife();
    this.time.delayedCall(800, () => { this.scene.start('Level2Scene'); });
  }

  update(time, delta) {
    // Parallax scrolling — hory pomalu, kopce rychleji
    this.bg1.tilePositionX += 6  * (delta / 1000);   // 6 px/s — vzdálené hory
    this.bg2.tilePositionX += 18 * (delta / 1000);   // 18 px/s — zelené kopce

    this.gojo.update();
    this.hud.update(this.score);

    this.smallCurses.getChildren().forEach(e => { if (e.active) e.update(); });

    [this.hollowPurples, this.sorcererProjectiles].forEach(grp => {
      grp.getChildren().forEach(p => { if (p.x < -50 || p.x > 850) p.destroy(); });
    });
  }
}
