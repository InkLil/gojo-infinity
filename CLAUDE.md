# Gojo's Infinity — CLAUDE.md

## Aktuální úkoly: Mobilní ovládání

- [ ] **Task 1** — Vytvořit `src/ui/MobileControls.js` — dotyková Phaser scéna s 5 tlačítky (←, →, Skok, Z, X). Zapisuje do `window.mobileInput`. Zobrazí se jen na touch zařízeních.
- [ ] **Task 2** — Upravit `src/entities/Gojo.js` — v `update()` číst `window.mobileInput` vedle klávesnice (OR logika, ~5 řádků).
- [ ] **Task 3** — Registrovat `MobileControls` v `src/main.js` + spouštět `this.scene.launch('MobileControls')` v Level1Scene, Level2Scene, Level3Scene.
- [ ] **Task 4** — Otestovat na mobilu přes Vercel, doladit velikost tlačítek (min. 60px), ověřit že na desktopu se nezobrazují.
