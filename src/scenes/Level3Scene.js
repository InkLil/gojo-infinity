// Level3Scene.js
// Level 3 — Tokio, noční město — FINÁLNÍ DESIGN (Fáze 7)
// GDD: střechy mrakodrapů, padající platformy, vertikální výtahy, 2× Sukuna, Boss

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
    this.sukunaCount   = 0;
    this.bossSpawned   = false;
    this.elevators     = []; // vertikální pohybující se platformy
    this.fallingPlats  = []; // padající platformy

    // -------------------------------------------------------
    // POZADÍ — noční Tokio
    // -------------------------------------------------------
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a1a);

    // Budovy v pozadí
    [[50,200,60,250],[150,180,80,270],[280,200,50,250],[420,160,70,290],
     [580,190,60,260],[700,170,80,280],[760,200,40,250]].forEach(([x,w,bw,bh]) => {
      this.add.rectangle(x, height - bh/2, bw, bh, 0x1a1a2a);
    });

    // Neonové světla
    this.add.rectangle(80,  220, 5, 80,  0x00BFFF, 0.7);
    this.add.rectangle(250, 180, 5, 60,  0xFF2D55, 0.7);
    this.add.rectangle(450, 200, 5, 90,  0x9B59B6, 0.7);
    this.add.rectangle(650, 170, 5, 100, 0x00BFFF, 0.7);
    this.add.rectangle(200, 340, 60, 4,  0xFF2D55, 0.5);
    this.add.rectangle(500, 310, 50, 4,  0x9B59B6, 0.5);

    // -------------------------------------------------------
    // STATICKÉ PLATFORMY — střechy budov
    // -------------------------------------------------------
    this.platforms = this.physics.add.staticGroup();

    const ground = this.platforms.create(width / 2, height - 16, 'ground_dark');
    ground.setDisplaySize(width, 32).refreshBody();

    this.platforms.create(120, 350, 'platform_dark');  // nízká vlevo
    this.platforms.create(580, 190, 'platform_dark');  // vysoká uprostřed

    // -------------------------------------------------------
    // PADAJÍCÍ PLATFORMY (GDD spec) — zmizí 2s po kontaktu
    // -------------------------------------------------------
    this._makeFallingPlat(310, 280);
    this._makeFallingPlat(470, 220);
    this._makeFallingPlat(660, 260);

    // -------------------------------------------------------
    // VERTIKÁLNÍ VÝTAHY (GDD spec) — pohyb nahoru-dolů
    // -------------------------------------------------------
    this._makeElevator(200, 260, 180, 360);  // vlevo — střední výška
    this._makeElevator(700, 230, 160, 330);  // vpravo

    // -------------------------------------------------------
    // GOJO
    // -------------------------------------------------------
    this.gojo = new Gojo(this, 60, height - 80);
    this.physics.add.collider(this.gojo, this.platforms);
    this.elevators.forEach(e => this.physics.add.collider(this.gojo, e));

    // -------------------------------------------------------
    // HUD
    // -------------------------------------------------------
    this.hud = new HUD(this, this.gojo, 3);

    // -------------------------------------------------------
    // NEPŘÁTELÉ — GDD Level 3: 6 malých + 3 velké + 4 čarodějové
    // -------------------------------------------------------
    this.sukunaGroup  = this.physics.add.group();
    this.bossGroup    = this.physics.add.group();
    this.smallCurses  = this.physics.add.group();
    this.largeCurses  = this.physics.add.group();
    this.sorcerers    = this.physics.add.group();

    this.smallCurses.add(new SmallCurse(this, 200, height - 60));
    this.smallCurses.add(new SmallCurse(this, 380, height - 60));
    this.smallCurses.add(new SmallCurse(this, 560, height - 60));
    this.smallCurses.add(new SmallCurse(this, 140, 325));
    this.smallCurses.add(new SmallCurse(this, 560, 165));
    this.smallCurses.add(new SmallCurse(this, 300, height - 60));

    this.largeCurses.add(new LargeCurse(this, 320, height - 70));
    this.largeCurses.add(new LargeCurse(this, 500, height - 70));
    this.largeCurses.add(new LargeCurse(this, 620, 240));

    this.sorcerers.add(new Sorcerer(this, 140, 325));
    this.sorcerers.add(new Sorcerer(this, 470, 195));
    this.sorcerers.add(new Sorcerer(this, 600, 165));
    this.sorcerers.add(new Sorcerer(this, 700, height - 60));

    this.physics.add.collider(this.smallCurses, this.platforms);
    this.physics.add.collider(this.largeCurses, this.platforms);
    this.physics.add.collider(this.sorcerers,   this.platforms);

    // -------------------------------------------------------
    // MINCE
    // -------------------------------------------------------
    this.coins = this.physics.add.staticGroup();
    [130, 160, 190].forEach(x => this.coins.create(x, height - 50, 'coin'));
    [110, 140].forEach(x => this.coins.create(x, 330, 'coin'));
    [300, 330].forEach(x => this.coins.create(x, 260, 'coin'));
    [460, 490].forEach(x => this.coins.create(x, 200, 'coin'));
    [560, 590].forEach(x => this.coins.create(x, 170, 'coin'));
    [660, 700].forEach(x => this.coins.create(x, 240, 'coin'));

    this.physics.add.overlap(this.gojo, this.coins, (g, coin) => {
      coin.destroy(); this.score += 50;
      this._showPoints(coin.x, coin.y, '+50');
    });

    // -------------------------------------------------------
    // CÍLOVÁ BRÁNA — skrytá, zobrazí se po porážce bosse
    // -------------------------------------------------------
    this.gate = this.physics.add.staticSprite(765, height - 46, 'gate');
    this.gate.setVisible(false);
    this.physics.add.overlap(this.gojo, this.gate, this.completeLevel, null, this);

    // -------------------------------------------------------
    // PROJEKTILY
    // -------------------------------------------------------
    this.hollowPurples       = this.physics.add.group();
    this.sorcererProjectiles = this.physics.add.group();
    this.cleaveWaves         = this.physics.add.group();
    this.shrineArrows        = this.physics.add.group();
    this.bossProjectiles     = this.physics.add.group();

    this.events.on('fireHollowPurple', this.spawnHollowPurple,   this);
    this.events.on('sorcererShoot',    this.spawnSorcererProj,   this);
    this.events.on('enemyKilled',      this.onEnemyKilled,       this);
    this.events.on('sukunaSpawned',    this.onSukunaSpawned,     this);
    this.events.on('sukunaCleave',     this.spawnCleave,         this);
    this.events.on('sukunaShrine',     this.spawnShrineArrows,   this);
    this.events.on('sukunaKilled',     this.onSukunaKilled,      this);
    this.events.on('sukunaPhase2',     this.onSukunaPhase2,      this);
    this.events.on('bossSpawned',      this.onBossSpawned,       this);
    this.events.on('bossShoot',        this.spawnBossProjectile, this);
    this.events.on('bossPhase',        this.onBossPhase,         this);
    this.events.on('bossKilled',       this.onBossKilled,        this);

    // Kolize
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

    // 2× garantovaný Sukuna spawn
    this.time.delayedCall(3000,  () => this.spawnSukuna(width - 80, height - 80));
    this.time.delayedCall(25000, () => {
      if (this.sukunaCount < 2) this.spawnSukuna(80, height - 80);
    });
  }

  // -------------------------------------------------------
  // PADAJÍCÍ PLATFORMY
  // -------------------------------------------------------
  _makeFallingPlat(x, y) {
    const p = this.physics.add.image(x, y, 'platform_dark');
    p.setImmovable(true);
    p.body.setAllowGravity(false);
    p._triggered = false;

    this.physics.add.collider(this.gojo, p, () => {
      // Spustí se jen když Gojo stojí NA platformě (shora)
      if (!p._triggered && this.gojo.body.blocked.down) {
        p._triggered = true;
        // Blikání 3× pak pádem
        this.tweens.add({
          targets: p, alpha: 0.2,
          duration: 200, yoyo: true, repeat: 3,
          onComplete: () => {
            if (p && p.active) {
              p.setImmovable(false);
              p.body.setAllowGravity(true);
              // Zničí se po vypadnutí z obrazovky
              this.time.delayedCall(2000, () => { if (p && p.active) p.destroy(); });
            }
          }
        });
      }
    });

    this.fallingPlats.push(p);
  }

  // -------------------------------------------------------
  // VERTIKÁLNÍ VÝTAHY
  // -------------------------------------------------------
  _makeElevator(x, y, minY, maxY) {
    const p = this.physics.add.image(x, y, 'platform_dark');
    p.setImmovable(true);
    p.body.setAllowGravity(false);
    p.body.setVelocityY(50);
    p._minY = minY;
    p._maxY = maxY;
    this.physics.add.collider(this.gojo, p);
    this.elevators.push(p);
  }

  // -------------------------------------------------------
  // SPAWN
  // -------------------------------------------------------
  spawnSukuna(x, y) {
    this.sukuna = new Sukuna(this, x, y);
    this.sukunaGroup.add(this.sukuna);
    this.physics.add.collider(this.sukuna, this.platforms);
    this.sukunaCount++;
  }

  spawnBoss() {
    if (this.bossSpawned) return;
    this.bossSpawned = true;
    this.boss = new Boss(this, this.scale.width - 100, this.scale.height - 90);
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
    const angles = count === 1 ? [0] : [0, -0.3, 0.3];
    angles.forEach(angle => {
      const p = this.bossProjectiles.create(x, y, 'sorcerer_proj');
      p.setScale(1.6); p.body.setAllowGravity(false);
      p.setVelocityX(dirX * 320 * Math.cos(angle));
      p.setVelocityY(320 * Math.sin(angle));
      this.time.delayedCall(4000, () => { if (p && p.active) p.destroy(); });
    });
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
      this.time.delayedCall(3000, () => { if (arrow && arrow.active) arrow.destroy(); });
    });
  }

  // -------------------------------------------------------
  // UDÁLOSTI
  // -------------------------------------------------------
  onSukunaSpawned() { this.hud.showWarning('⚠ α1 SE BLÍŽÍ... ⚠', 0xFF0000); }
  onSukunaPhase2()  { this.hud.showWarning('α1 ZRYCHLUJE!', 0xFF4500); }
  onSukunaKilled(x, y) {
    this.onEnemyKilled(x, y, 1000); this.sukuna = null;
    if (this.sukunaCount < 2) {
      this.time.delayedCall(5000, () => {
        if (this.sukunaCount < 2) this.spawnSukuna(400, this.scale.height - 80);
      });
    }
    if (!this.bossSpawned) this.time.delayedCall(3000, () => this.spawnBoss());
  }

  onBossSpawned() { this.hud.showWarning('⚡ PROKLETÝ DUCH! ⚡', 0x9B59B6); }
  onBossPhase(phase) {
    const msgs = { 2: '💀 FÁZE 2!', 3: '☠ FÁZE 3 — ŠÍLENÉ TEMPO!' };
    if (msgs[phase]) this.hud.showWarning(msgs[phase], 0xFF0000);
  }
  onBossKilled(x, y) {
    this.onEnemyKilled(x, y, 2000); this.boss = null;
    this.hud.showWarning('BOSS PORAŽEN!', 0x4ADE80);
    this.time.delayedCall(1500, () => { this.gate.setVisible(true); });
  }

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

  // -------------------------------------------------------
  // DOKONČENÍ
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

    // Výtahy — obracejí směr na krajních hodnotách
    this.elevators.forEach(e => {
      if (e.y >= e._maxY) e.body.setVelocityY(-50);
      if (e.y <= e._minY) e.body.setVelocityY(50);
    });

    this.smallCurses.getChildren().forEach(e => { if (e.active) e.update(); });
    this.largeCurses.getChildren().forEach(e => { if (e.active) e.update(); });
    if (this.sukuna && this.sukuna.active) this.sukuna.update();
    if (this.boss   && this.boss.active)   this.boss.update();

    if (!this.bossSpawned && this.gojo.x > 650) this.spawnBoss();

    [this.hollowPurples, this.sorcererProjectiles, this.shrineArrows, this.bossProjectiles].forEach(grp => {
      grp.getChildren().forEach(p => { if (p.x < -60 || p.x > 860 || p.y > 520) p.destroy(); });
    });
  }
}
