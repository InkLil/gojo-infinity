// Level3Scene.js
// Level 3 — Tokio, noční město
// GDD: střechy mrakodrapů, neon světla, všichni nepřátelé, 2× garantovaný Sukuna, finální boss

class Level3Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level3Scene' });
    this.score = 0;
  }

  create() {
    const { width, height } = this.scale;
    this.score         = 0;
    this.levelComplete = false;
    this.sukuna        = null;
    this.boss          = null;
    this.sukunaCount   = 0;   // kolik Sukunů bylo spawnnuto (max 2)
    this.bossSpawned   = false;

    // -------------------------------------------------------
    // POZADÍ — noční Tokio (#0a0a1a)
    // -------------------------------------------------------
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a1a);

    // Neonové záblesky v pozadí (dekorativní)
    this.add.rectangle(100, 200, 6, 120, 0x00BFFF, 0.6); // modrý neon
    this.add.rectangle(300, 150, 6, 80,  0xFF2D55, 0.6); // červený neon
    this.add.rectangle(500, 180, 6, 100, 0x9B59B6, 0.6); // fialový neon
    this.add.rectangle(700, 130, 6, 140, 0x00BFFF, 0.6);
    this.add.rectangle(200, 350, 80, 4,  0xFF2D55, 0.5); // horizontální neon
    this.add.rectangle(550, 300, 60, 4,  0x9B59B6, 0.5);

    // -------------------------------------------------------
    // PLATFORMY — střechy budov, klimatizace, antény
    // -------------------------------------------------------
    this.platforms = this.physics.add.staticGroup();

    // Podlaha (střecha nejnižší budovy)
    const ground = this.platforms.create(width / 2, height - 16, 'ground_dark');
    ground.setDisplaySize(width, 32).refreshBody();

    // Střechy v různých výškách
    this.platforms.create(130, 340, 'platform_dark');
    this.platforms.create(320, 270, 'platform_dark');
    this.platforms.create(500, 200, 'platform_dark');
    this.platforms.create(680, 250, 'platform_dark');
    this.platforms.create(240, 160, 'platform_dark');
    this.platforms.create(600, 140, 'platform_dark');

    // -------------------------------------------------------
    // GOJO
    // -------------------------------------------------------
    this.gojo = new Gojo(this, 60, height - 80);
    this.physics.add.collider(this.gojo, this.platforms);

    // -------------------------------------------------------
    // CÍLOVÁ BRÁNA (dostupná až po porážce bosse)
    // -------------------------------------------------------
    this.gate = this.physics.add.staticSprite(760, height - 46, 'gate');
    this.gate.setVisible(false); // skrytá dokud není boss poražen
    this.gateOverlap = this.physics.add.overlap(
      this.gojo, this.gate, this.completeLevel, null, this
    );

    // -------------------------------------------------------
    // HUD
    // -------------------------------------------------------
    this.hud = new HUD(this, this.gojo, 3);

    // -------------------------------------------------------
    // SKUPINY NEPŘÁTEL
    // -------------------------------------------------------
    this.sukunaGroup  = this.physics.add.group();
    this.bossGroup    = this.physics.add.group();
    this.smallCurses  = this.physics.add.group();
    this.largeCurses  = this.physics.add.group();
    this.sorcerers    = this.physics.add.group();

    // GDD Level 3: 6 malých + 3 velké + 4 čarodějové
    this.spawnSmallCurse(200, height - 60);
    this.spawnSmallCurse(380, height - 60);
    this.spawnSmallCurse(560, height - 60);
    this.spawnSmallCurse(300, 245);
    this.spawnSmallCurse(480, 175);
    this.spawnSmallCurse(230, 135);
    this.spawnLargeCurse(300, height - 70);
    this.spawnLargeCurse(500, height - 70);
    this.spawnLargeCurse(660, 225);
    this.spawnSorcerer(160,  315);
    this.spawnSorcerer(430,  245);
    this.spawnSorcerer(575,  175);
    this.spawnSorcerer(700,  225);

    this.physics.add.collider(this.smallCurses, this.platforms);
    this.physics.add.collider(this.largeCurses, this.platforms);
    this.physics.add.collider(this.sorcerers,   this.platforms);

    // -------------------------------------------------------
    // PROJEKTILY
    // -------------------------------------------------------
    this.hollowPurples       = this.physics.add.group();
    this.sorcererProjectiles = this.physics.add.group();
    this.cleaveWaves         = this.physics.add.group();
    this.shrineArrows        = this.physics.add.group();
    this.bossProjectiles     = this.physics.add.group();

    // -------------------------------------------------------
    // UDÁLOSTI
    // -------------------------------------------------------
    this.events.on('fireHollowPurple', this.spawnHollowPurple,  this);
    this.events.on('sorcererShoot',    this.spawnSorcererProj,  this);
    this.events.on('enemyKilled',      this.onEnemyKilled,      this);
    this.events.on('sukunaSpawned',    this.onSukunaSpawned,    this);
    this.events.on('sukunaCleave',     this.spawnCleave,        this);
    this.events.on('sukunaShrine',     this.spawnShrineArrows,  this);
    this.events.on('sukunaKilled',     this.onSukunaKilled,     this);
    this.events.on('sukunaPhase2',     this.onSukunaPhase2,     this);
    this.events.on('bossSpawned',      this.onBossSpawned,      this);
    this.events.on('bossShoot',        this.spawnBossProjectile,this);
    this.events.on('bossPhase',        this.onBossPhase,        this);
    this.events.on('bossKilled',       this.onBossKilled,       this);

    // -------------------------------------------------------
    // KOLIZE
    // -------------------------------------------------------
    this.physics.add.overlap(this.gojo, this.smallCurses, (g, e) => g.takeDamage(e.damage));
    this.physics.add.overlap(this.gojo, this.largeCurses, (g, e) => g.takeDamage(e.damage));
    this.physics.add.overlap(this.gojo, this.sorcerers,   (g, e) => g.takeDamage(e.damage));
    this.physics.add.overlap(this.gojo, this.sukunaGroup, (g, s) => g.takeDamage(s.damage));
    this.physics.add.overlap(this.gojo, this.bossGroup,   (g, b) => g.takeDamage(b.damage));

    this.physics.add.overlap(this.gojo, this.sorcererProjectiles, (g, p) => { p.destroy(); g.takeDamage(1); });
    this.physics.add.overlap(this.gojo, this.shrineArrows,        (g, a) => { a.destroy(); g.takeDamage(1); });
    this.physics.add.overlap(this.gojo, this.bossProjectiles,     (g, p) => { p.destroy(); g.takeDamage(1); });
    this.physics.add.overlap(this.gojo, this.cleaveWaves,         (g, w) => { if (g.body.blocked.down) g.takeDamage(1); });

    this.physics.add.overlap(this.hollowPurples, this.smallCurses, (b, e) => { if (e.active) e.takeDamage(10); });
    this.physics.add.overlap(this.hollowPurples, this.largeCurses, (b, e) => { if (e.active) e.takeDamage(10); });
    this.physics.add.overlap(this.hollowPurples, this.sorcerers,   (b, e) => { if (e.active) e.takeDamage(10); });
    this.physics.add.overlap(this.hollowPurples, this.sukunaGroup, (b, s) => { if (s.active) s.takeDamage(3); });
    this.physics.add.overlap(this.hollowPurples, this.bossGroup,   (b, s) => { if (s.active) s.takeDamage(2); });

    // -------------------------------------------------------
    // 2× GARANTOVANÝ SUKUNA SPAWN (GDD spec)
    // -------------------------------------------------------
    this.time.delayedCall(3000,  () => { this.spawnSukuna(width - 80, height - 80); });
    this.time.delayedCall(25000, () => {
      // Druhý Sukuna — pokud první je poražen, nebo i vedle
      if (!this.sukuna || !this.sukuna.active) {
        this.spawnSukuna(80, height - 80);
      }
    });
  }

  // -------------------------------------------------------
  // SPAWN HELPERS
  // -------------------------------------------------------
  spawnSmallCurse(x, y) { this.smallCurses.add(new SmallCurse(this, x, y)); }
  spawnLargeCurse(x, y) { this.largeCurses.add(new LargeCurse(this, x, y)); }
  spawnSorcerer(x, y)   { this.sorcerers.add(new Sorcerer(this, x, y)); }

  spawnSukuna(x, y) {
    this.sukuna = new Sukuna(this, x, y);
    this.sukunaGroup.add(this.sukuna);
    this.physics.add.collider(this.sukuna, this.platforms);
    this.sukunaCount++;
  }

  spawnBoss() {
    if (this.bossSpawned) return;
    this.bossSpawned = true;
    const { width, height } = this.scale;
    this.boss = new Boss(this, width - 100, height - 90);
    this.bossGroup.add(this.boss);
    this.physics.add.collider(this.boss, this.platforms);
  }

  // -------------------------------------------------------
  // PROJEKTILY
  // -------------------------------------------------------
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

  spawnBossProjectile(x, y, dirX, count) {
    const speed   = 320;
    const angles  = count === 1 ? [0] : [0, -0.3, 0.3];
    angles.forEach(angle => {
      const p = this.bossProjectiles.create(x, y, 'sorcerer_proj');
      p.setScale(1.6);
      p.body.setAllowGravity(false);
      p.setVelocityX(dirX * speed * Math.cos(angle));
      p.setVelocityY(speed * Math.sin(angle));
      this.time.delayedCall(4000, () => { if (p && p.active) p.destroy(); });
    });
  }

  spawnCleave(sx, sy) {
    const { height } = this.scale;
    const warning = this.add.rectangle(400, height - 26, 800, 20, 0xFF0000, 0.4).setDepth(5);
    this.time.delayedCall(400, () => { if (warning) warning.destroy(); });
    this.time.delayedCall(500, () => {
      const wave = this.cleaveWaves.create(400, height - 26, 'cleave_wave');
      wave.body.setAllowGravity(false);
      wave.setDepth(5);
      this.time.delayedCall(600, () => { if (wave && wave.active) wave.destroy(); });
    });
  }

  spawnShrineArrows(x, y, dirX) {
    const speed  = 300;
    [0, -0.3, 0.3].forEach(angle => {
      const arrow = this.shrineArrows.create(x, y, 'shrine_arrow');
      arrow.body.setAllowGravity(false);
      arrow.setVelocityX(dirX * speed * Math.cos(angle));
      arrow.setVelocityY(speed * Math.sin(angle));
      if (this.gojo.infinityActive && this.sukuna && this.sukuna.active) {
        arrow.setVelocityX(-dirX * speed);
        this.physics.add.overlap(arrow, this.sukunaGroup, (a, s) => { a.destroy(); if (s.active) s.takeDamage(1); });
      }
      this.time.delayedCall(3000, () => { if (arrow && arrow.active) arrow.destroy(); });
    });
  }

  // -------------------------------------------------------
  // UDÁLOSTI — Sukuna
  // -------------------------------------------------------
  onSukunaSpawned() { this.hud.showWarning('⚠ α1 SE BLÍŽÍ... ⚠', 0xFF0000); }
  onSukunaPhase2()  { this.hud.showWarning('α1 ZRYCHLUJE!', 0xFF4500); }

  onSukunaKilled(x, y) {
    this.onEnemyKilled(x, y, 1000);
    this.sukuna = null;

    // Druhý Sukuna spawne dříve pokud ještě nebyl
    if (this.sukunaCount < 2) {
      this.time.delayedCall(5000, () => {
        if (this.sukunaCount < 2) this.spawnSukuna(400, this.scale.height - 80);
      });
    }

    // Boss spawne po porážce prvního Sukuny (pokud ne dříve)
    if (!this.bossSpawned) {
      this.time.delayedCall(3000, () => { this.spawnBoss(); });
    }
  }

  // -------------------------------------------------------
  // UDÁLOSTI — Boss
  // -------------------------------------------------------
  onBossSpawned() {
    this.hud.showWarning('⚡ PROKLETÝ DUCH! ⚡', 0x9B59B6);
  }

  onBossPhase(phase) {
    const msgs = { 2: '💀 FÁZE 2!', 3: '☠ FÁZE 3 — ŠÍLENÉ TEMPO!' };
    if (msgs[phase]) this.hud.showWarning(msgs[phase], 0xFF0000);
  }

  onBossKilled(x, y) {
    this.onEnemyKilled(x, y, 2000);
    this.boss = null;
    this.hud.showWarning('BOSS PORAŽEN!', 0x4ADE80);

    // Zobraz bránu
    this.time.delayedCall(1500, () => {
      this.gate.setVisible(true);
    });
  }

  // -------------------------------------------------------
  // SKÓRE
  // -------------------------------------------------------
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

  // -------------------------------------------------------
  // DOKONČENÍ HRY
  // -------------------------------------------------------
  completeLevel() {
    if (this.levelComplete || !this.gate.visible) return;
    this.levelComplete = true;
    this.gojo.gainLife();
    this.time.delayedCall(1000, () => { this.scene.start('WinScene'); });
  }

  // -------------------------------------------------------
  // UPDATE
  // -------------------------------------------------------
  update() {
    this.gojo.update();
    this.hud.update(this.score);

    this.smallCurses.getChildren().forEach(e => { if (e.active) e.update(); });
    this.largeCurses.getChildren().forEach(e => { if (e.active) e.update(); });
    if (this.sukuna && this.sukuna.active) this.sukuna.update();
    if (this.boss   && this.boss.active)   this.boss.update();

    // Boss spawne automaticky když Gojo dojde na pravou stranu (x > 650)
    if (!this.bossSpawned && this.gojo.x > 650) {
      this.spawnBoss();
    }

    [this.hollowPurples, this.sorcererProjectiles, this.shrineArrows, this.bossProjectiles].forEach(grp => {
      grp.getChildren().forEach(p => { if (p.x < -60 || p.x > 860 || p.y < -60 || p.y > 520) p.destroy(); });
    });
  }
}
