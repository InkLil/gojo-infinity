# Gojo's Infinity — CLAUDE.md

## Mobilní ovládání — HOTOVO ✅

- Ovládání je HTML overlay (`index.html`) — postranní panely vlevo (← →) a vpravo (Z X ↑)
- Nepřekrývá herní canvas, sedí v černých pruzích po stranách (hra je 16:9, telefony ~20:9)
- `window.mobileInput` je sdílený stav mezi HTML tlačítky a `Gojo.js`
- Velikost tlačítek škáluje přes `clamp(52px, 9vh, 80px)`
- Portrait → overlay "Otoč telefon", Landscape → hra + ovládání
- Auto-fullscreen při prvním dotyku (skryje adresní lištu Chrome)
