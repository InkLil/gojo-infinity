// Level2Scene.js
// Level 2 — Temný les
// Fáze 5: nepřátelé, 30% šance na Sukuna spawn, Cleave, Malevolent Shrine
// Fáze 7+: pohybující se platformy, finální design

class Level2Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level2Scene' });
    this.score = 0;
  }

  create() {
    const { width, height } = this.scale;
    this.score = 0;
    this.levelComplete = false;
    this.sukuna = null;

    // --- Pozadí — temný les (#1a1a2e z GDD) ---
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Fialová mlha — dekorativní obdélníky různé průhlednosti
    this.add.rectangle(width / 2, height - 80, width, 160, 0x6B21A8, 0.08);
    this.add.rectangle(width / 2, height - 40, width, 80,  0x6B21A8, 0.12);

    // --- Platformy (kořeny stromů) ---
    this.platforms = this.physics.add.staticGroup();

    const ground = this.platforms.create(width / 2, height - 16, 'ground_dark');
    ground.setDisplaySize(width, 32).refreshBody();

    // Kořeny stromů jako platformy (tmavší verze)
    this.platforms.create(120, 340, 'platform_dark');
    this.platforms.create(310, 280, 'platform_dark');
    this.platforms.create(500, 210, 'platform_dark');
    this.platforms.create(680, 290, 'platform_dark');
    this.platforms.create(230, 170, 'platform_dark');

    // --- Gojo ---
    this.gojo = new Gojo(this, 60, height - 80);
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

    // GDD Level 2: 5 malých kleteb + 2 velké kletby + 3 čarodějové
    this.spawnSmallCurse(200, height - 60);
    this.spawnSmallCurse(400, height - 60);
    this.spawnSmallCurse(600, height - 60);
    this.spawnSmallCurse(290, 255);
    this.spawnSmallCurse(480, 185);
    this.spawnLargeCurse(350, height - 70);
    this.spawnLargeCurse(580, 265);
    this.spawnSorcerer(160,  315);
    this.spawnSorcerer(490,  185);
    this.spawnSorcerer(660,  265);

    // Kolize nepřátel s platformami
    this.physics.add.collider(this.smallCurses, this.platforms);
    this.physics.add.collider(this.largeCurses, this.platforms);
    this.physics.add.collider(this.sorcerers,   this.platforms);

    // --- Projektily ---
    this.hollowPurples       = this.physics.add.group();
    this.sorcererProjectiles = this.physics.add.group();
    this.cleaveWaves         = this.physics.add.group();
    this.shrineArrows        = this.physics.add.group();

    // --- Události ---
    this.events.on('fireHollowPurple', this.spawnHollowPurple,    this);
    this.events.on('sorcererShoot',    this.spawnSorcererProj,     this);
    this.events.on('enemyKilled',      this.onEnemyKilled,         this);
    this.events.on('sukunaSpawned',    this.onSukunaSpawned,       this);
    this.events.on('sukunaCleave',     this.spawnCleave,           this);
    this.events.on('sukunaShrine',     this.spawnShrineArrows,     this);
    this.events.on('sukunaKilled',     this.onSukunaKilled,        this);
    this.events.on('sukunaPhase2',     this.onSukunaPhase2,        this);

    // --- Kolize: Gojo × nepřátelé ---
    this.physics.add.overlap(this.gojo, this.smallCurses, (g, e) => g.takeDamage(e.damage));
    this.physics.add.overlap(this.gojo, this.largeCurses, (g, e) => g.takeDamage(e.damage));
    this.physics.add.overlap(this.gojo, this.sorcerers,   (g, e) => g.takeDamage(e.damage));

    // --- Kolize: Gojo × projektily ---
    this.physics.add.overlap(this.gojo, this.sorcererProjectiles, (g, p) => {
      p.destroy(); g.takeDamage(1);
    });
    this.physics.add.overlap(this.gojo, this.cleaveWaves, (g, w) => {
      // Cleave poškodí jen pokud Gojo stojí na zemi
      if (g.body.blocked.down) g.takeDamage(1);
    });
    this.physics.add.overlap(this.gojo, this.shrineArrows, (g, a) => {
      a.destroy(); g.takeDamage(1);
    });

    // --- Kolize: Duté fialové × nepřátelé ---
    this.physics.add.overlap(this.hollowPurples, this.smallCurses, (b, e) => e.takeDamage(10));
    this.physics.add.overlap(this.hollowPurples, this.largeCurses, (b, e) => e.takeDamage(10));
    this.physics.add.overlap(this.hollowPurples, this.sorcerers,   (b, e) => e.takeDamage(10));

    // --- 30% šance na Sukuna spawn (GDD spec) ---
    this.time.delayedCall(2000, () => {
      if (Math.random() < 0.30) {
        this.spawnSukuna(width - 80, height - 80);
      }
    });

    // HUD text pro Level 2
    this.add.text(400, 16, 'Level 2', {
      fontSize: '14px', fill: '#F0F0FF', fontFamily: 'monospace'
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(10);
  }

  // --- Spawn helpers ---
  spawnSmallCurse(x, y) {
    this.smallCurses.add(new SmallCurse(this, x, y));
  }
  spawnLargeCurse(x, y) {
    this.largeCurses.add(new LargeCurse(this, x, y));
  }
  spawnSorcerer(x, y) {
    this.sorcerers.add(new Sorcerer(this, x, y));
  }

  spawnSukuna(x, y) {
    this.sukuna = new Sukuna(this, x, y);
    this.physics.add.collider(this.sukuna, this.platforms);

    // Sukuna kontaktní poškození
    this.physics.add.overlap(this.gojo, this.sukuna, (g, s) => {
      g.takeDamage(s.damage);
    });

    // Duté fialové na Sukunu
    this.physics.add.overlap(this.hollowPurples, this.sukuna, (b, s) => {
      s.takeDamage(3); // Hollow Purple = 3 damage na Sukunu
    });
  }

  // --- Sukuna: Cleave vlna (pokryje celou podlahu) ---
  spawnCleave(sukunaX, sukunaY) {
    const { height } = this.scale;

    // Varování — blikne podlaha
    const warning = this.add.rectangle(400, height - 26, 800, 20, 0xFF0000, 0.4).setDepth(5);
    this.time.delayedCall(400, () => warning.destroy());

    // Po varování se objeví vlna
    this.time.delayedCall(500, () => {
      if (!this.scene.isActive()) return;
      const wave = this.cleaveWaves.create(400, height - 26, 'cleave_wave');
      wave.body.setAllowGravity(false);
      wave.body.setImmovable(true);
      wave.setDepth(5);

      // Zmizí po 0.6 sekundy
      this.time.delayedCall(600, () => { if (wave && wave.active) wave.destroy(); });
    });
  }

  // --- Sukuna: Malevolent Shrine (3 šípy) ---
  spawnShrineArrows(x, y, dirX) {
    // 3 šípy: rovně, mírně nahoru, mírně dolů
    const angles = [0, -0.3, 0.3]; // radiány
    const speed  = 300;

    angles.forEach(angle => {
      const arrow = this.shrineArrows.create(x, y, 'shrine_arrow');
      arrow.body.setAllowGravity(false);
      arrow.setVelocityX(dirX * speed * Math.cos(angle));
      arrow.setVelocityY(speed * Math.sin(angle));
      arrow.setFlipX(dirX === -1);
      arrow.setRotation(dirX === -1 ? Math.PI + angle : angle);

      // Pokud má Gojo Nekonečno — šíp se odrazí zpět na Sukunu
      if (this.gojo.infinityActive) {
        arrow.setVelocityX(-dirX * speed);
        // Šíp poškodí Sukunu při zpětném letu
        if (this.sukuna && this.sukuna.active) {
          this.physics.add.overlap(arrow, this.sukuna, (a, s) => {
            a.destroy();
            s.takeDamage(1);
          });
        }
      }

      this.time.delayedCall(3000, () => { if (arrow && arrow.active) arrow.destroy(); });
    });
  }

  // --- Sukuna události ---
  onSukunaSpawned() {
    this.hud.showWarning('⚠ α1 SE BLÍŽÍ... ⚠', 0xFF0000);
  }

  onSukunaPhase2() {
    this.hud.showWarning('α1 ZRYCHLUJE!', 0xFF4500);
  }

  onSukunaKilled(x, y) {
    this.score += 1000;
    this.onEnemyKilled(x, y, 1000);
    this.sukuna = null;
  }

  // --- Skóre ---
  onEnemyKilled(x, y, points) {
    this.score += points;
    const txt = this.add.text(x, y - 10, '+' + points, {
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
    this.time.delayedCall(800, () => { this.scene.start('Level3Scene'); });
  }

  update() {
    this.gojo.update();
    this.hud.update(this.score);

    this.smallCurses.getChildren().forEach(e => { if (e.active) e.update(); });
    this.largeCurses.getChildren().forEach(e => { if (e.active) e.update(); });
    if (this.sukuna && this.sukuna.active) this.sukuna.update();

    [this.hollowPurples, this.sorcererProjectiles, this.shrineArrows].forEach(group => {
      group.getChildren().forEach(p => { if (p.x < -60 || p.x > 860) p.destroy(); });
    });
  }
}
