// Level1Scene.js
// Level 1 — Japonská vesnice
// Fáze 2: Gojo pohyb, skok, platformy
// Fáze 6+: nepřátelé, mince, brána, finální design

class Level1Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1Scene' });
  }

  preload() {
    // Vytvoříme placeholder textury programaticky — žádné externí soubory
    // Gojo: bílý obdélník 32×48 px (barva #F0F0FF z GDD barevné palety)
    const gojoGfx = this.make.graphics({ x: 0, y: 0, add: false });
    gojoGfx.fillStyle(0xF0F0FF); // Gojo bílá
    gojoGfx.fillRect(0, 0, 32, 48);
    // Fialový proužek = tmavé brýle (orientační detail)
    gojoGfx.fillStyle(0x1E1E3F);
    gojoGfx.fillRect(6, 12, 20, 8);
    // Oranžový odznak na hrudi
    gojoGfx.fillStyle(0xEA580C);
    gojoGfx.fillCircle(10, 28, 4);
    gojoGfx.generateTexture('gojo_placeholder', 32, 48);
    gojoGfx.destroy();

    // Platforma: hnědé dřevo (#92400E z GDD Level 1 barvy)
    const platGfx = this.make.graphics({ x: 0, y: 0, add: false });
    platGfx.fillStyle(0x92400E);
    platGfx.fillRect(0, 0, 200, 20);
    platGfx.generateTexture('platform', 200, 20);
    platGfx.destroy();

    // Podlaha: tráva (#4ADE80 z GDD Level 1)
    const groundGfx = this.make.graphics({ x: 0, y: 0, add: false });
    groundGfx.fillStyle(0x4ADE80);
    groundGfx.fillRect(0, 0, 800, 32);
    groundGfx.generateTexture('ground', 800, 32);
    groundGfx.destroy();
  }

  create() {
    const { width, height } = this.scale;

    // --- Pozadí — světlá obloha Level 1 ---
    this.add.rectangle(width / 2, height / 2, width, height, 0x87CEEB);

    // --- Podlaha ---
    // staticGroup = pevné objekty s fyzikou, které se nehýbou
    this.platforms = this.physics.add.staticGroup();

    const ground = this.platforms.create(width / 2, height - 16, 'ground');
    ground.setDisplaySize(width, 32).refreshBody();

    // --- Platformy (různé výšky — tutoriál skoku) ---
    // Phaser souřadnice: y=0 je nahoře, y=450 je dole
    this.platforms.create(150, 320, 'platform'); // nízká vlevo
    this.platforms.create(350, 260, 'platform'); // střední uprostřed
    this.platforms.create(560, 190, 'platform'); // vyšší vpravo
    this.platforms.create(700, 300, 'platform'); // nízká vpravo

    // --- Gojo ---
    // Přidáme soubor Gojo.js jako třídu — musí být načten v index.html
    this.gojo = new Gojo(this, 80, height - 80);

    // Kolize Gojo s platformami a podlahou
    this.physics.add.collider(this.gojo, this.platforms);

    // --- HUD (placeholder) ---
    this.add.text(16, 16, 'Level 1 — Japonská vesnice', {
      fontSize: '14px',
      fill: '#111827',
      fontFamily: 'monospace'
    });

    this.add.text(16, 36, '← → pohyb  |  Mezerník / ↑ skok (2×)', {
      fontSize: '11px',
      fill: '#333333',
      fontFamily: 'monospace'
    });
  }

  update() {
    // Volá Gojo.update() každý snímek — zde řídí pohyb a skok
    this.gojo.update();
  }
}
