// Level2Scene.js
// Level 2 — Temný les — FINÁLNÍ DESIGN (Fáze 7)
// GDD: 5 malých kleteb, 2 velké kletby, 3 čarodějové, 3 pohybující se platformy, bonus srdíčko, 30% Sukuna

class Level2Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level2Scene' });
    this.score = 0;
  }

  create() {
    const { width, height } = this.scale;
    this.score         = 0;
    this.levelComplete = false;
    this.sukuna        = null;
    this.movingPlats   = []; // pohybující se platformy — aktualizujeme v update()

    // -------------------------------------------------------
    // POZADÍ — temný les
    // -------------------------------------------------------
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Stromy v pozadí (dekorativní)
    [[60,380],[160,360],[340,390],[500,370],[650,380],[780,360]].forEach(([x,y]) => {
      this.add.triangle(x, y, 0,0, 40,0, 20,-80, 0x166534, 0.7);
      this.add.rectangle(x + 10, y + 10, 12, 30, 0x78350F, 0.8);
    });

    // Fialová mlha u země
    this.add.rectangle(width / 2, height - 60, width, 80, 0x6B21A8, 0.1);

    // -------------------------------------------------------
    // STATICKÉ PLATFORMY
    // -------------------------------------------------------
    this.platforms = this.physics.add.staticGroup();

    const ground = this.platforms.create(width / 2, height - 16, 'ground_dark');
    ground.setDisplaySize(width, 32).refreshBody();

    this.platforms.create(120,  340, 'platform_dark'); // vlevo nízká
    this.platforms.create(580,  185, 'platform_dark'); // vpravo vysoko
    this.platforms.create(240,  170, 'platform_dark'); // tajná (bonus srdíčko)

    // -------------------------------------------------------
    // POHYBUJÍCÍ SE PLATFORMY (3 ks — GDD spec)
    // Phaser dynamic body: immovable=true, gravity=false, pohyb přes velocityX
    // -------------------------------------------------------
    const makeMovingPlat = (x, y, minX, maxX) => {
      const p = this.physics.add.image(x, y, 'platform_dark');
      p.setImmovable(true);
      p.body.setAllowGravity(false);
      p.body.setVelocityX(70);
      p._minX = minX;
      p._maxX = maxX;
      this.movingPlats.push(p);
      return p;
    };

    this.movingPlat1 = makeMovingPlat(260, 300, 120, 380); // spodní sekce
    this.movingPlat2 = makeMovingPlat(450, 240, 330, 560); // střední
    this.movingPlat3 = makeMovingPlat(640, 310, 520, 740); // vede k bráně

    // -------------------------------------------------------
    // GOJO
    // -------------------------------------------------------
    this.gojo = new Gojo(this, 60, height - 80);
    this.physics.add.collider(this.gojo, this.platforms);
    // Kolize s pohybujícími platformami — musí být collider aby Gojo jel s platformou
    [this.movingPlat1, this.movingPlat2, this.movingPlat3].forEach(p => {
      this.physics.add.collider(this.gojo, p);
    });

    // -------------------------------------------------------
    // HUD
    // -------------------------------------------------------
    this.hud = new HUD(this, this.gojo, 2);

    // -------------------------------------------------------
    // NEPŘÁTELÉ — GDD Level 2: 5 malých + 2 velké + 3 čarodějové
    // -------------------------------------------------------
    this.sukunaGroup  = this.physics.add.group();
    this.smallCurses  = this.physics.add.group();
    this.largeCurses  = this.physics.add.group();
    this.sorcerers    = this.physics.add.group();

    // Malé kletby
    this.smallCurses.add(new SmallCurse(this, 220,  height - 60));
    this.smallCurses.add(new SmallCurse(this, 420,  height - 60));
    this.smallCurses.add(new SmallCurse(this, 140,  315));       // na statické platformě
    this.smallCurses.add(new SmallCurse(this, 560,  160));       // na vysoké platformě
    this.smallCurses.add(new SmallCurse(this, 620,  height - 60));

    // Velké kletby
    this.largeCurses.add(new LargeCurse(this, 350,  height - 70));
    this.largeCurses.add(new LargeCurse(this, 580,  height - 70));

    // Čarodějové na vyvýšených pozicích
    this.sorcerers.add(new Sorcerer(this, 140,  315));
    this.sorcerers.add(new Sorcerer(this, 600,  160));
    this.sorcerers.add(new Sorcerer(this, 700,  height - 60));

    this.physics.add.collider(this.smallCurses, this.platforms);
    this.physics.add.collider(this.largeCurses, this.platforms);
    this.physics.add.collider(this.sorcerers,   this.platforms);

    // -------------------------------------------------------
    // MINCE — vedou hráče
    // -------------------------------------------------------
    this.coins = this.physics.add.staticGroup();

    [120, 150, 180].forEach(x => this.coins.create(x, height - 50, 'coin'));
    [280, 310, 340].forEach(x => this.coins.create(x, height - 50, 'coin'));
    [110, 140].forEach(x => this.coins.create(x, 320, 'coin'));
    [430, 460].forEach(x => this.coins.create(x, 220, 'coin'));
    [560, 590].forEach(x => this.coins.create(x, 165, 'coin'));
    [650, 690, 730].forEach(x => this.coins.create(x, 290, 'coin'));

    this.physics.add.overlap(this.gojo, this.coins, (g, coin) => {
      coin.destroy(); this.score += 50;
      this._showPoints(coin.x, coin.y, '+50');
    });

    // -------------------------------------------------------
    // BONUS SRDÍČKO — na tajné platformě vlevo nahoře (y=170)
    // Vyžaduje double jump — obtížná sekce (GDD spec)
    // -------------------------------------------------------
    this.bonusHeart = this.physics.add.staticSprite(240, 145, 'bonus_heart');
    this.physics.add.overlap(this.gojo, this.bonusHeart, (g, heart) => {
      heart.destroy(); g.gainLife();
      this._showPoints(heart.x, heart.y, '❤ +1');
    });

    // -------------------------------------------------------
    // CÍLOVÁ BRÁNA
    // -------------------------------------------------------
    this.gate = this.physics.add.staticSprite(765, height - 46, 'gate');
    this.physics.add.overlap(this.gojo, this.gate, this.completeLevel, null, this);

    // -------------------------------------------------------
    // PROJEKTILY
    // -------------------------------------------------------
    this.hollowPurples       = this.physics.add.group();
    this.sorcererProjectiles = this.physics.add.group();
    this.cleaveWaves         = this.physics.add.group();
    this.shrineArrows        = this.physics.add.group();

    this.events.on('showMessage',      this._showPoints,        this);
    this.events.on('fireHollowPurple', this.spawnHollowPurple,  this);
    this.events.on('sorcererShoot',    this.spawnSorcererProj,  this);
    this.events.on('enemyKilled',      this.onEnemyKilled,      this);
    this.events.on('sukunaSpawned',    this.onSukunaSpawned,    this);
    this.events.on('sukunaCleave',     this.spawnCleave,        this);
    this.events.on('sukunaShrine',     this.spawnShrineArrows,  this);
    this.events.on('sukunaKilled',     this.onSukunaKilled,     this);
    this.events.on('sukunaPhase2',     this.onSukunaPhase2,     this);

    // Kolize
    this.physics.add.overlap(this.gojo, this.smallCurses, (g, e) => g.takeDamage(e.damage));
    this.physics.add.overlap(this.gojo, this.largeCurses, (g, e) => g.takeDamage(e.damage));
    this.physics.add.overlap(this.gojo, this.sorcerers,   (g, e) => g.takeDamage(e.damage));
    this.physics.add.overlap(this.gojo, this.sukunaGroup, (g, s) => g.takeDamage(s.damage));
    this.physics.add.overlap(this.gojo, this.sorcererProjectiles, (g, p) => { p.destroy(); g.takeDamage(1); });
    this.physics.add.overlap(this.gojo, this.cleaveWaves, (g, w) => { if (g.body.blocked.down) g.takeDamage(1); });
    this.physics.add.overlap(this.gojo, this.shrineArrows,(g, a) => { a.destroy(); g.takeDamage(1); });

    this.physics.add.overlap(this.hollowPurples, this.smallCurses, (b, e) => { if (e.active) e.takeDamage(10); });
    this.physics.add.overlap(this.hollowPurples, this.largeCurses, (b, e) => { if (e.active) e.takeDamage(10); });
    this.physics.add.overlap(this.hollowPurples, this.sorcerers,   (b, e) => { if (e.active) e.takeDamage(10); });
    this.physics.add.overlap(this.hollowPurples, this.sukunaGroup, (b, s) => { if (s.active) s.takeDamage(3); });

    // 30% šance Sukuna spawn
    this.time.delayedCall(2000, () => {
      if (Math.random() < 0.30) this.spawnSukuna(width - 80, height - 80);
    });
  }

  // --- Spawn ---
  spawnSukuna(x, y) {
    this.sukuna = new Sukuna(this, x, y);
    this.sukunaGroup.add(this.sukuna);
    this.physics.add.collider(this.sukuna, this.platforms);
  }

  // --- Pohybující se platformy ---
  _updateMovingPlats() {
    this.movingPlats.forEach(p => {
      if (p.x >= p._maxX) p.body.setVelocityX(-70);
      if (p.x <= p._minX) p.body.setVelocityX(70);
    });
  }

  // --- Sukuna události ---
  onSukunaSpawned() { this.hud.showWarning('⚠ α1 SE BLÍŽÍ... ⚠', 0xFF0000); }
  onSukunaPhase2()  { this.hud.showWarning('α1 ZRYCHLUJE!', 0xFF4500); }
  onSukunaKilled(x, y) { this.onEnemyKilled(x, y, 1000); this.sukuna = null; }

  // --- Skóre ---
  onEnemyKilled(x, y, points) {
    this.score += points;
    this._showPoints(x, y, '+' + points);
  }

  _showPoints(x, y, text) {
    const txt = this.add.text(x, y - 10, text, {
      fontSize: '14px', fill: '#FFD700', fontFamily: 'monospace', fontStyle: 'bold'
    }).setDepth(20);
    this.tweens.add({ targets: txt, y: y - 40, alpha: 0, duration: 800, onComplete: () => txt.destroy() });
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

  spawnCleave(sx, sy) {
    const { height } = this.scale;
    const warning = this.add.rectangle(400, height - 26, 800, 20, 0xFF0000, 0.4).setDepth(5);
    this.time.delayedCall(400, () => { if (warning) warning.destroy(); });
    this.time.delayedCall(500, () => {
      const wave = this.cleaveWaves.create(400, height - 26, 'cleave_wave');
      wave.body.setAllowGravity(false); wave.setDepth(5);
      this.time.delayedCall(600, () => { if (wave && wave.active) wave.destroy(); });
    });
  }

  spawnShrineArrows(x, y, dirX) {
    [0, -0.3, 0.3].forEach(angle => {
      const arrow = this.shrineArrows.create(x, y, 'shrine_arrow');
      arrow.body.setAllowGravity(false);
      arrow.setVelocityX(dirX * 300 * Math.cos(angle));
      arrow.setVelocityY(300 * Math.sin(angle));
      if (this.gojo.infinityActive && this.sukuna && this.sukuna.active) {
        arrow.setVelocityX(-dirX * 300);
        this.physics.add.overlap(arrow, this.sukunaGroup, (a, s) => { a.destroy(); if (s.active) s.takeDamage(1); });
      }
      this.time.delayedCall(3000, () => { if (arrow && arrow.active) arrow.destroy(); });
    });
  }

  // --- Dokončení ---
  completeLevel() {
    if (this.levelComplete) return;
    this.levelComplete = true;
    this.gojo.gainLife();
    this.time.delayedCall(800, () => { this.scene.start('Level3Scene'); });
  }

  update() {
    this.gojo.update();
    this.hud.update(this.score);
    this._updateMovingPlats();

    this.smallCurses.getChildren().forEach(e => { if (e.active) e.update(); });
    this.largeCurses.getChildren().forEach(e => { if (e.active) e.update(); });
    if (this.sukuna && this.sukuna.active) this.sukuna.update();

    [this.hollowPurples, this.sorcererProjectiles, this.shrineArrows].forEach(grp => {
      grp.getChildren().forEach(p => { if (p.x < -60 || p.x > 860) p.destroy(); });
    });
  }
}
