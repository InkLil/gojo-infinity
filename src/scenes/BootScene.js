// BootScene.js
// První scéna — generuje VŠECHNY placeholder textury (dostupné ve všech levelech)
// a přechází do MenuScene

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this._makeTextures();
    this.load.spritesheet('gojo_spritesheet', 'assets/sprites/gojo_spritesheet.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('sukuna_spritesheet', 'assets/sprites/sukuna_spritesheet.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('gojo_portrait', 'assets/sprites/gojo_portrait.png');

    // --- Menu / end obrazovky ---
    this.load.image('menu_background', 'assets/backgrounds/menu_background.png');
    this.load.image('end_vin_background',  'assets/backgrounds/end_vin_background.jpg');
    this.load.image('end_lost_background', 'assets/backgrounds/end_lost_background.jpg');

    // --- Pozadí Level 1 — vesnice (496×272 px) ---
    this.load.image('village_bg1', 'assets/backgrounds/village/Background_1.png');
    this.load.image('village_bg2', 'assets/backgrounds/village/Background_2.png');

    // --- Pozadí Level 2 — les (320×180 px) ---
    this.load.image('forest_layer1', 'assets/backgrounds/forest/background_layer_1.png');
    this.load.image('forest_layer2', 'assets/backgrounds/forest/background_layer_2.png');
    this.load.image('forest_layer3', 'assets/backgrounds/forest/background_layer_3.png');

    // --- Pozadí Level 3 — Tokio (různé šířky, 272 px výška) ---
    this.load.image('tokyo_back',   'assets/backgrounds/tokyo/back.png');
    this.load.image('tokyo_middle', 'assets/backgrounds/tokyo/middle.png');
    this.load.image('tokyo_fore',   'assets/backgrounds/tokyo/foreground.png');

    // --- Hudba Level 3 ---
    this.load.audio('cyberpunk_music', [
      'assets/sounds/cyberpunk-street.ogg',
      'assets/sounds/cyberpunk-street.mp3'
    ]);

    // --- Platform textury (z tilesetů) ---
    this.load.image('village_platform_tile',   'assets/tilesets/village_platform_tile.png');
    this.load.image('medieval_platform_tile',  'assets/tilesets/medieval_platform_tile.png');
    this.load.image('mossy_platform_tile',     'assets/tilesets/mossy_platform_tile.png');
    this.load.image('cave_platform_tile',      'assets/tilesets/cave_platform_tile.png');

    // --- Level 1 medieval dekorace ---
    this.load.image('medieval_bg_far',  'assets/backgrounds/medieval_bg_far.png');
    this.load.image('medieval_bg_near', 'assets/backgrounds/medieval_bg_near.png');
    this.load.image('medieval_tree1',   'assets/sprites/medieval_tree1.png');
    this.load.image('medieval_tree2',   'assets/sprites/medieval_tree2.png');
    this.load.image('medieval_house',   'assets/sprites/medieval_house.png');

    // --- Čaroděj (Blue Wizard spritesheet 96×96, 40 framů) ---
    this.load.spritesheet('wizard_spritesheet', 'assets/sprites/wizard_spritesheet.png', {
      frameWidth: 96, frameHeight: 96
    });
  }

  create() {
    const { width, height } = this.scale;

    this.add.text(width / 2, height / 2 - 30, "GOJO'S INFINITY", {
      fontSize: '32px', fill: '#C4B5FD', fontFamily: 'monospace', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 20, 'Loading...', {
      fontSize: '16px', fill: '#F0F0FF', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this._createAnimations();
    this.time.delayedCall(1200, () => { this.scene.start('MenuScene'); });
  }

  _createAnimations() {
    const A = this.anims;
    // Gojo: idle 0-3 | run 4-9 | jump 10-12 | fall 13-14 | land 15-16
    //       infinity 17-21 | hollow_purple 22-27 | hit 28-30 | death 31-35
    A.create({ key: 'gojo_idle',          frames: A.generateFrameNumbers('gojo_spritesheet', { start: 0,  end: 3  }), frameRate: 8,  repeat: -1 });
    A.create({ key: 'gojo_run',           frames: A.generateFrameNumbers('gojo_spritesheet', { start: 4,  end: 9  }), frameRate: 12, repeat: -1 });
    A.create({ key: 'gojo_jump',          frames: A.generateFrameNumbers('gojo_spritesheet', { start: 10, end: 12 }), frameRate: 10, repeat: 0  });
    A.create({ key: 'gojo_fall',          frames: A.generateFrameNumbers('gojo_spritesheet', { start: 13, end: 14 }), frameRate: 8,  repeat: -1 });
    A.create({ key: 'gojo_land',          frames: A.generateFrameNumbers('gojo_spritesheet', { start: 15, end: 16 }), frameRate: 14, repeat: 0  });
    A.create({ key: 'gojo_infinity',      frames: A.generateFrameNumbers('gojo_spritesheet', { start: 17, end: 21 }), frameRate: 10, repeat: -1 });
    A.create({ key: 'gojo_hollow_purple', frames: A.generateFrameNumbers('gojo_spritesheet', { start: 22, end: 27 }), frameRate: 14, repeat: 0  });
    A.create({ key: 'gojo_hit',           frames: A.generateFrameNumbers('gojo_spritesheet', { start: 28, end: 30 }), frameRate: 12, repeat: 0  });
    A.create({ key: 'gojo_death',         frames: A.generateFrameNumbers('gojo_spritesheet', { start: 31, end: 35 }), frameRate: 8,  repeat: 0  });
    // Sukuna: idle 0-3 | walk 4-7 | cleave 8-12 | shrine 13-18 | hit 19-20 | death 21-25
    A.create({ key: 'sukuna_idle',   frames: A.generateFrameNumbers('sukuna_spritesheet', { start: 0,  end: 3  }), frameRate: 6,  repeat: -1 });
    A.create({ key: 'sukuna_walk',   frames: A.generateFrameNumbers('sukuna_spritesheet', { start: 4,  end: 7  }), frameRate: 10, repeat: -1 });
    A.create({ key: 'sukuna_cleave', frames: A.generateFrameNumbers('sukuna_spritesheet', { start: 8,  end: 12 }), frameRate: 14, repeat: 0  });
    A.create({ key: 'sukuna_shrine', frames: A.generateFrameNumbers('sukuna_spritesheet', { start: 13, end: 18 }), frameRate: 14, repeat: 0  });
    A.create({ key: 'sukuna_hit',    frames: A.generateFrameNumbers('sukuna_spritesheet', { start: 19, end: 20 }), frameRate: 10, repeat: 0  });
    A.create({ key: 'sukuna_death',  frames: A.generateFrameNumbers('sukuna_spritesheet', { start: 21, end: 25 }), frameRate: 8,  repeat: 0  });
    // Čaroděj (Blue Wizard): idle 0-19 | walk 20-39
    A.create({ key: 'wizard_idle', frames: A.generateFrameNumbers('wizard_spritesheet', { start: 0,  end: 19 }), frameRate: 10, repeat: -1 });
    A.create({ key: 'wizard_walk', frames: A.generateFrameNumbers('wizard_spritesheet', { start: 20, end: 39 }), frameRate: 12, repeat: -1 });
  }

  _makeTextures() {
    const g = (w, h) => this.make.graphics({ x: 0, y: 0, add: false });

    // --- Platforma (200×20) ---
    const platGfx = g();
    platGfx.fillStyle(0x92400E); platGfx.fillRect(0, 0, 200, 20);
    platGfx.fillStyle(0x78350F); platGfx.fillRect(0, 0, 200, 4);
    platGfx.generateTexture('platform', 200, 20); platGfx.destroy();

    // --- Tmavá platforma pro Level 2 (200×20) ---
    const darkPlatGfx = g();
    darkPlatGfx.fillStyle(0x166534); darkPlatGfx.fillRect(0, 0, 200, 20);
    darkPlatGfx.fillStyle(0x14532D); darkPlatGfx.fillRect(0, 0, 200, 4);
    darkPlatGfx.generateTexture('platform_dark', 200, 20); darkPlatGfx.destroy();

    // --- Podlaha (800×32) ---
    const groundGfx = g();
    groundGfx.fillStyle(0x4ADE80); groundGfx.fillRect(0, 0, 800, 32);
    groundGfx.fillStyle(0x166534); groundGfx.fillRect(0, 6, 800, 26);
    groundGfx.generateTexture('ground', 800, 32); groundGfx.destroy();

    // --- Tmavá podlaha pro Level 2 ---
    const darkGroundGfx = g();
    darkGroundGfx.fillStyle(0x1a3a1a); darkGroundGfx.fillRect(0, 0, 800, 32);
    darkGroundGfx.fillStyle(0x0f2010); darkGroundGfx.fillRect(0, 6, 800, 26);
    darkGroundGfx.generateTexture('ground_dark', 800, 32); darkGroundGfx.destroy();

    // --- Duté fialové koule (24×24) ---
    const purpleGfx = g();
    purpleGfx.fillStyle(0x6B21A8); purpleGfx.fillCircle(12, 12, 12);
    purpleGfx.fillStyle(0xC4B5FD); purpleGfx.fillCircle(12, 12, 6);
    purpleGfx.generateTexture('hollow_purple', 24, 24); purpleGfx.destroy();

    // --- Cílová brána (40×60) ---
    const gateGfx = g();
    gateGfx.fillStyle(0xFFD700); gateGfx.fillRect(0, 0, 40, 60);
    gateGfx.lineStyle(3, 0xFFA500); gateGfx.strokeRect(2, 2, 36, 56);
    gateGfx.generateTexture('gate', 40, 60); gateGfx.destroy();

    // --- Malá kletba (24×24) ---
    const scGfx = g();
    scGfx.fillStyle(0x4B0082); scGfx.fillCircle(12, 14, 11);
    scGfx.fillStyle(0xFF0000); scGfx.fillCircle(8, 10, 3); scGfx.fillCircle(16, 10, 3);
    scGfx.generateTexture('small_curse', 24, 24); scGfx.destroy();

    // --- Velká kletba (40×40) ---
    const lcGfx = g();
    lcGfx.fillStyle(0x2D0057); lcGfx.fillCircle(20, 22, 18);
    lcGfx.fillStyle(0xFF0000); lcGfx.fillCircle(13, 16, 4); lcGfx.fillCircle(27, 16, 4);
    lcGfx.fillStyle(0xFF6600); lcGfx.fillRect(12, 26, 16, 4);
    lcGfx.generateTexture('large_curse', 40, 40); lcGfx.destroy();

    // --- Čaroděj (28×40) ---
    const sorGfx = g();
    sorGfx.fillStyle(0x1a1a3a);
    sorGfx.fillRect(8, 0, 12, 12);   // hlava
    sorGfx.fillRect(4, 12, 20, 20);  // tělo
    sorGfx.fillRect(0, 12, 6, 16);   // levá ruka
    sorGfx.fillRect(22, 12, 6, 16);  // pravá ruka
    sorGfx.fillRect(6, 32, 6, 8);    // levá noha
    sorGfx.fillRect(16, 32, 6, 8);   // pravá noha
    sorGfx.fillStyle(0xFF4500); sorGfx.fillCircle(2, 20, 4);
    sorGfx.generateTexture('sorcerer', 28, 40); sorGfx.destroy();

    // --- Projektil čaroděje (12×12) ---
    const projGfx = g();
    projGfx.fillStyle(0xFF4500); projGfx.fillCircle(6, 6, 6);
    projGfx.generateTexture('sorcerer_proj', 12, 12); projGfx.destroy();

    // --- Mince (16×16) ---
    const coinGfx = g();
    coinGfx.fillStyle(0xFFD700); coinGfx.fillCircle(8, 8, 7);
    coinGfx.fillStyle(0xFFA500); coinGfx.fillCircle(8, 8, 4);
    coinGfx.generateTexture('coin', 16, 16); coinGfx.destroy();

    // --- Bonus srdíčko (16×16) ---
    const heartGfx = g();
    heartGfx.fillStyle(0xFF0055);
    heartGfx.fillCircle(5, 5, 4); heartGfx.fillCircle(11, 5, 4);
    heartGfx.fillTriangle(1, 7, 15, 7, 8, 15);
    heartGfx.generateTexture('bonus_heart', 16, 16); heartGfx.destroy();

    // --- Boss placeholder (70×70) — tmavě fialový, červené oči ---
    const bossGfx = g();
    bossGfx.fillStyle(0x2D0057); bossGfx.fillCircle(35, 38, 32);
    bossGfx.fillStyle(0xFF0000); bossGfx.fillCircle(24, 28, 6); bossGfx.fillCircle(46, 28, 6);
    bossGfx.fillStyle(0x9B59B6); bossGfx.fillCircle(35, 20, 12); // koruna
    bossGfx.fillStyle(0xFF0000); bossGfx.fillRect(22, 44, 26, 5); // ústa
    bossGfx.generateTexture('boss_placeholder', 70, 70); bossGfx.destroy();

    // --- Cleave vlna (800×20) — červená vlna po podlaze ---
    const cleaveGfx = g();
    cleaveGfx.fillStyle(0x8B0000); cleaveGfx.fillRect(0, 0, 800, 20);
    cleaveGfx.fillStyle(0xFF0000); cleaveGfx.fillRect(0, 0, 800, 6);
    cleaveGfx.generateTexture('cleave_wave', 800, 20); cleaveGfx.destroy();

    // --- Malevolent Shrine šíp (20×8) ---
    const arrowGfx = g();
    arrowGfx.fillStyle(0xFF4500); arrowGfx.fillRect(0, 2, 14, 4);   // tělo šípu
    arrowGfx.fillStyle(0xFF6600);
    arrowGfx.fillTriangle(14, 0, 14, 8, 20, 4);                      // hrot
    arrowGfx.generateTexture('shrine_arrow', 20, 8); arrowGfx.destroy();
  }
}
