// Gojo's Infinity — main.js
// Inicializace Phaser 3 a registrace všech scén

const config = {
  type: Phaser.AUTO,           // automaticky zvolí WebGL nebo Canvas
  width: 800,                  // šířka hry (GDD: 800×450)
  height: 450,                 // výška hry
  backgroundColor: '#0a0a1a', // tmavé pozadí (Tokio noční obloha)

  // Phaser Scale Manager — přizpůsobí hru oknu prohlížeče
  parent: 'game',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  // Arcade Physics — jednoduchá fyzika pro plošinovky
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },   // gravitace 800 px/s² (GDD spec)
      debug: false            // true = zobrazí hitboxy (užitečné při vývoji)
    }
  },

  // Registrace všech scén — pořadí určuje která se načte první (BootScene)
  scene: [
    BootScene,
    MenuScene,
    Level1Scene,
    Level2Scene,
    Level3Scene,
    GameOverScene,
    WinScene
  ]
};

// Spuštění hry
const game = new Phaser.Game(config);
