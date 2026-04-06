// MobileControls.js
// Mobilní ovládání je řešeno HTML overlay v index.html (pruh pod herním canvasem).
// Tento soubor zajišťuje jen inicializaci window.mobileInput jako fallback.
// Skutečné touch handlery jsou v index.html — viz #mobile-controls sekce.

if (typeof window.mobileInput === 'undefined') {
  window.mobileInput = { left: false, right: false, jump: false, z: false, x: false };
}
