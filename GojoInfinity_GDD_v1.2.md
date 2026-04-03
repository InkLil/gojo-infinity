# GOJO'S INFINITY
## Game Design Document — v1.2 — Duben 2026

---

| Pole | Detail |
|---|---|
| Název hry | Gojo's Infinity |
| Žánr | 2D plošinovka (Side-scrolling Platformer) |
| Engine | Phaser.js 3 |
| Hosting | Vercel — gojo-infinity.vercel.app |
| Gojo sprite | 32 × 48 px pixel art |
| Sukuna | Speciální nepřítel — objeví se náhodně v Level 2 a 3 |
| Stav | Pre-produkce — v přípravě |

### Changelog

| Verze | Změny |
|---|---|
| v1.0 | Základní GDD — postava, nepřátelé, 3 levely, technická specifikace |
| v1.1 | Sprite specifikace 32×48 px, barevná paleta, animace, bílé vlasy v UI |
| v1.2 | Level 3 změněn na Tokio, přidán Sukuna jako speciální nepřítel, přidán Vercel průvodce krok za krokem |

---

## 1. Přehled projektu

| Pole | Detail |
|---|---|
| Název hry | Gojo's Infinity |
| Žánr | 2D plošinovka (Side-scrolling Platformer) |
| Inspirace | Super Mario Bros. + Jujutsu Kaisen (manga/anime) |
| Platforma | Webový prohlížeč (HTML5) — desktop i mobil |
| Engine | Phaser.js 3 |
| Jazyk kódu | JavaScript (ES6+) |
| Publikování | Vercel — gojo-infinity.vercel.app |
| Grafický styl | Pixel art — retro 16-bit styl |
| Počet levelů | 3 (rozšiřitelné) |
| Cílová skupina | Fanoušci anime (JJK) + casual hráči, 13–30 let |
| Vývoj | Claude Code (AI-assisted development) |

### Herní koncept

Gojo's Infinity je 2D plošinovka inspirovaná klasickými Mario hrami, zasazená do světa anime série Jujutsu Kaisen. Hráč ovládá Satoru Gojo a bojuje proti kletbám, nepřátelským čarodějům a občas se střetne s Ryomen Sukunou — Králem kleteb — který se kdykoli nečekaně objeví.

### Unikátní prodejní bod (USP)

- Ikonická postava z Jujutsu Kaisen v retro pixel art kabátě
- Dvě věrné schopnosti z mangy — Nekonečno jako štít, Duté fialové jako megaútok
- Sukuna jako nečekaný speciální nepřítel — hráč nikdy neví kdy se objeví
- Hratelné ihned v prohlížeči, žádná instalace
- Bleskový deploy přes Vercel — sdílitelná URL do 10 sekund

---

## 2. Hlavní postava — Satoru Gojo

| Pole | Detail |
|---|---|
| Jméno | Satoru Gojo |
| Série | Jujutsu Kaisen (manga/anime, autor Gege Akutami) |
| Vizuál | Bílé rozcuchané vlasy, kulaté tmavé brýle, celý černý outfit |
| Outfit detail | Černý rolák s vysokým límcem, černé kalhoty, tmavohnědé kotníkové boty |
| Charakteristický prvek | Oranžový kruhový odznak na hrudi (levá strana) |
| Rozměr spriteu | 32 × 48 px |
| Životy | 3 srdíčka |
| Rychlost pohybu | 200 px/s |
| Skok | Dvojitý skok povolen (výška ~120 px) |

### Ovládání

#### Klávesnice (desktop)

- **← → nebo A / D** — pohyb vlevo / vpravo
- **Mezerník nebo ↑** — skok (dvojitý skok povolen)
- **Klávesa Z** — Nekonečno (štít)
- **Klávesa X** — Duté fialové (útok)

#### Mobilní ovládání

- Virtuální joystick v levém dolním rohu — pohyb
- Tlačítko skoku v pravém dolním rohu
- Tlačítka Z a X nad tlačítkem skoku

### Schopnosti

#### Nekonečno (Infinity) — `[Z]`

> Gojo aktivuje nekonečný voidový štít. Po dobu 3 sekund jsou všechny projektily odráženy zpět a hráč je imunní vůči kontaktnímu poškození. Vizuálně: fialová aura pulzuje kolem postavy.

- **Cooldown:** 8 sekund
- **Efekt:** Odráží projektily + imunita vůči kontaktu

#### Duté fialové (Hollow Purple) — `[X]`

> Gojo vystřelí masivní fialovou kouli energie, která letí horizontálně přes celou obrazovku a ničí vše na trase.

- **Cooldown:** 5 sekund
- **Efekt:** Vysoké poškození, prostřelí více nepřátel najednou

---

## 3. Sprite & animační specifikace

### Rozměry a technické parametry

| Parametr | Hodnota |
|---|---|
| Rozměr | 32 × 48 px na jeden snímek |
| Formát | PNG s průhledností (alpha channel) |
| Spritesheet layout | Horizontální řádky |
| Renderování | `image-rendering: pixelated` — žádné vyhlazování |
| Výchozí směr | Gojo kouká doprava, levý směr = flip v kódu |
| Anchor point | Střed-dolní část (nohy na platformě) |

### Barevná paleta — Gojo

| Hex kód | Název | Použití |
|---|---|---|
| `#F0F0FF` | Bílá vlasová (světlá) | Hlavní barva vlasů |
| `#C8C8EE` | Bílá vlasová (stín) | Stíny ve vlasech |
| `#F5CBA7` | Pleť (světlá) | Obličej, ruce |
| `#E8A882` | Pleť (stín) | Stíny pod brýlemi |
| `#111827` | Černá outfit (hlavní) | Rolák, kalhoty |
| `#1E2A3A` | Černá outfit (stín) | Záhyby oblečení |
| `#0F0F1F` | Brýle (rámeček) | Rámeček brýlí |
| `#1E1E3F` | Brýle (sklo) | Výplň skel |
| `#3D2B1F` | Bota (tmavá) | Hlavní barva bot |
| `#5A3F2A` | Bota (světlá) | Odraz světla na botách |
| `#EA580C` | Odznak (oranžová) | Kruhový odznak na hrudi |
| `#C04A08` | Odznak (stín) | Spodní polovina odznaku |

### Barevná paleta — Sukuna

| Hex kód | Název | Použití |
|---|---|---|
| `#1a1a1a` | Černá vlasová | Ostré tmavé vlasy |
| `#F0D9C0` | Pleť (světlá) | Obličej, paže |
| `#D4B896` | Pleť (stín) | Stíny na těle |
| `#EFEFEF` | Kimono (světlé) | Hlavní barva kimona/haori |
| `#D0D0D0` | Kimono (stín) | Záhyby látky |
| `#222222` | Obi pás | Černý pás v pase |
| `#333333` | Bandáže | Pásky na zápěstích a kotnících |
| `#5a4030` | Sandály | Geta/sandály |
| `#8B0000` | Tetování / extra oči | Červené detaily — Sukuna sigil |

### Animace — Gojo

| Animace | Snímků | FPS | Trigger |
|---|---|---|---|
| Idle | 4 | 8 | Hráč nic nestiskne |
| Run | 6 | 12 | Pohyb vlevo / vpravo |
| Jump | 3 | 10 | Stisk skoku |
| Fall | 2 | 8 | Hráč klesá |
| Land | 2 | 14 | Kontakt se zemí |
| Infinity (Z) | 5 | 10 | Stisk Z |
| Hollow Purple (X) | 6 | 14 | Stisk X |
| Hit | 3 | 12 | Zásah nepřítelem |
| Death | 5 | 8 | HP = 0 |

### Animace — Sukuna

| Animace | Snímků | FPS | Trigger |
|---|---|---|---|
| Idle | 4 | 6 | Čeká — arogantní postoj, ruka za hlavou |
| Walk | 4 | 10 | Pohyb k hráči |
| Cleave | 5 | 14 | Vlna energie po zemi |
| Malevolent Shrine | 6 | 14 | Ohnivé šípy |
| Hit | 2 | 10 | Zasažen hráčem |
| Death | 5 | 8 | HP = 0 |

### Vizuální identita — bílé vlasy napříč celou hrou

- **Hlavní menu** — Gojo stojí vpravo celou postavou, bílé vlasy kontrastují s tmavým pozadím
- **HUD** — místo generických srdíček jsou 16×16 px portréty Gojo hlavy
- **Game Over** — Gojo v death animaci, bílé vlasy na červeném overlaye
- **Výherní obrazovka** — oslavná póza, confetti v bílé a fialové

---

## 4. Nepřátelé

### Běžní nepřátelé

| Nepřítel | HP | Rychlost | Poškození | Chování |
|---|---|---|---|---|
| Malá kletba | 1 | Rychlá | 1 srdíčko | Chodí tam a zpět po platformě |
| Velká kletba | 3 | Pomalá | 2 srdíčka | Pomalejší, větší, silnější |
| Nepř. čaroděj | 2 | Stojí | 1 srdíčko | Střílí projektily na hráče |

### Speciální nepřítel — Ryomen Sukuna

| Pole | Detail |
|---|---|
| Jméno | Ryomen Sukuna — Král kleteb |
| Vizuál | Bílé kimono, černý obi pás, tmavé vlasy, červené tetování, 4 oči |
| Rozměr spriteu | 32 × 48 px |
| HP | 8 |
| Rychlost | Střední — pomalý ale hrozivý |
| Poškození kontakt | 2 srdíčka |
| Kdy se objeví | Náhodně v Level 2 a Level 3 |
| Pravděpodobnost | 30 % šance na spawn na začátku každé sekce |

#### Sukuna — AI chování

- Při spawnu: dramatická animace zjevení — červená záře + varování na HUD
- Pomalu kráčí k hráči — arogantně, nespěchá (odráží jeho charakter z mangy)
- Každé 4 sekundy střídá Cleave a Malevolent Shrine
- Při HP ≤ 3: zrychlí pohyb, zkrátí cooldown na 2 sekundy
- Po porážce: rozpadne se v červeno-fialové energii + bonus skóre pro hráče

#### Sukuna — schopnosti

**Cleave — seknutí vlnou energie `[automatické]`**

> Sukuna sekne rukou k zemi a vyšle horizontální vlnu energie po celé podlaze. Hráč musí vyskočit nebo aktivovat Nekonečno. Vizuálně: červená vlna s efektem řezu.

- Dosah: celá podlaha levelu
- Poškození: 1 srdíčko
- Counter: skok nebo Nekonečno

**Malevolent Shrine — ohnivé šípy `[automatické]`**

> Sukuna zaujme pose a vystřelí 3 ohnivé šípy najednou v různých úhlech. Vizuálně: oranžovo-červené šípy s ohňovým trailing efektem.

- Počet šípů: 3 najednou (rovně, mírně nahoru, mírně dolů)
- Poškození: 1 srdíčko za zásah
- Counter: Nekonečno odrazí šípy zpět na Sukunu

---

## 5. Level Design

### Přehled levelů

| Level | Název | Prostředí | Nepřátelé | Obtížnost |
|---|---|---|---|---|
| 1 | Japonská vesnice | Tradiční vesnice, den | Malé kletby, čarodějové | ⭐ Lehká |
| 2 | Temný les | Noční les, fialová mlha | Malé + velké kletby, čarodějové, možný Sukuna | ⭐⭐ Střední |
| 3 | Tokio — noční město | Střechy mrakodrapů, neon | Všichni + Sukuna garantován + Boss | ⭐⭐⭐ Těžká |

---

### Level 1 — Japonská vesnice

**Prostředí:** Světlé tradiční japonské prostředí za dne. Dřevěné domy, sakury, bambusové ploty. Slouží jako tutoriál — žádný Sukuna.

**Cíle:**
- Naučit pohyb, skok a dvojitý skok
- Představit malé kletby a čaroděje
- Ukázat Duté fialové
- Dosáhnout zlaté cílové brány

**Rozmístění:**
- Jednoduché horizontální platformy v různých výškách
- 4 malé kletby, 2 čarodějové
- Zlaté mince vedou hráče správným směrem
- 1 srdíčko jako bonus za odbočení

**Barvy prostředí:** obloha `#87CEEB`, tráva `#4ADE80`, dřevo `#92400E`, střechy `#DC2626`

---

### Level 2 — Temný les

**Prostředí:** Noční les s fialovou mlhou. Sakury s černými listy, kořeny stromů jako platformy. Vizuálně temnější, atmosféra nebezpečí.

**Nové herní prvky:**
- Pohybující se platformy (vlevo-vpravo)
- Velké kletby poprvé
- Čarodějové na vyvýšených platformách
- **Sukuna může kdykoliv spawnnout** — 30 % šance na začátku každé sekce

**Rozmístění:**
- 3 pohybující se platformy v kritických místech
- 5 malých kleteb + 2 velké kletby + 3 čarodějové
- 1 srdíčko skryté za obtížnou sekcí

**Barvy prostředí:** obloha `#1a1a2e`, mlha `#6B21A8`, stromy `#166534`, kořeny `#92400E`

---

### Level 3 — Tokio, noční město

**Prostředí:** Noční ulice Tokia. Hráč skáče po střechách mrakodrapů, klimatizacích, výtahových šachtách a neonových reklamách. Futuristické i japonské — ideální kontrast k Gojově postavě.

**Atmosféra:**
- Tmavá noční obloha s fialovým nádechem
- Neonové nápisy v japonštině v pozadí (dekorace)
- Odlesky světel na mokrém asfaltu

**Nové herní prvky:**
- Padající platformy — zmizí 2 sekundy po kontaktu
- Vertikální pohybující se platformy (výtahy mezi budovami)
- Mix všech nepřátel současně
- **Sukuna garantovaně spawne** alespoň 2× v průběhu levelu
- Finální boss encounter na střeše nejvyšší budovy

**Rozmístění:**
- Střechy budov jako hlavní platformy
- Klimatizace, antény, neonové reklamy jako skákací body
- 6 malých kleteb + 3 velké + 4 čarodějové
- 2 garantované Sukuna encountery
- Finální boss arena — otevřená střecha mrakodrapu

**Barvy prostředí:** obloha `#0a0a1a`, neon modrá `#00BFFF`, neon fialová `#9B59B6`, neon červená `#FF2D55`, budovy `#1a1a2a`

**Finální boss — Prokletý duch (Tokio):**
- 10 HP, 3× větší než velká kletba, tmavě fialová s červenýma očima
- Fáze 1 (10–7 HP): pohyb + skok
- Fáze 2 (6–4 HP): 3 projektily najednou, zrychlení
- Fáze 3 (3–1 HP): šílené tempo, salvy projektilů

---

## 6. Technická specifikace

### Stack a nástroje

| Pole | Detail |
|---|---|
| Herní engine | Phaser.js 3 (CDN) |
| Jazyk | JavaScript ES6+ |
| Fyzika | Phaser Arcade Physics |
| Grafika | HTML5 Canvas — pixel art + particle efekty |
| Zvuk | Phaser Sound Manager (Web Audio API) |
| Verzování | Git + GitHub (veřejný repozitář) |
| CI/CD | Vercel — automatický deploy z main větve |
| Live URL | gojo-infinity.vercel.app |
| Vývoj | Claude Code — AI-assisted development |

### Struktura projektu

```
gojo-infinity/
├── index.html                  ← hlavní vstupní bod
├── vercel.json                 ← Vercel konfigurace
├── src/
│   ├── main.js                 ← inicializace Phaser
│   ├── scenes/
│   │   ├── BootScene.js
│   │   ├── MenuScene.js        ← Gojo idle animace
│   │   ├── Level1Scene.js      ← japonská vesnice
│   │   ├── Level2Scene.js      ← temný les + možný Sukuna
│   │   ├── Level3Scene.js      ← Tokio + Sukuna + boss
│   │   ├── GameOverScene.js
│   │   └── WinScene.js
│   ├── entities/
│   │   ├── Gojo.js
│   │   ├── Sukuna.js           ← Cleave + Malevolent Shrine
│   │   ├── SmallCurse.js
│   │   ├── LargeCurse.js
│   │   ├── Sorcerer.js
│   │   └── Boss.js
│   └── ui/
│       └── HUD.js              ← Gojo portréty místo srdíček
└── assets/
    ├── sprites/
    │   ├── gojo_spritesheet.png
    │   ├── sukuna_spritesheet.png
    │   ├── gojo_portrait.png   ← 16×16 pro HUD
    │   └── enemies/
    └── sounds/
```

### Technické konstanty

| Parametr | Hodnota |
|---|---|
| Rozlišení hry | 800 × 450 px (16:9) |
| Škálování | Phaser Scale Manager — fit do okna |
| FPS cíl | 60 FPS |
| Gravitace | 800 px/s² |
| Sukuna spawn šance | 30 % na začátku každé sekce (Level 2 a 3) |

---

## 7. Uživatelské rozhraní (UI/UX)

### HUD

- Levý horní roh — 3 portréty Gojo hlavy (16×16 px), plný = žije, šedý = ztraceno
- Pravý horní roh — skóre, bílý text
- Levý dolní roh — cooldown bar Nekonečna (modrá)
- Vedle — cooldown bar Dutého fialového (fialová)
- Střed nahoře — číslo levelu
- Při Sukuna spawnu — červený flash + text "Sukuna se blíží..."

### Obrazovky

- **Hlavní menu** — Gojo idle animace vpravo, logo vlevo, tmavé japonské pozadí
- **Game Over** — Gojo v death animaci, červený overlay, tlačítka ZKUSIT ZNOVU / HLAVNÍ MENU
- **Výherní** — Gojo v oslavné póze, confetti v bílé a fialové, finální skóre

---

## 8. Vizuální styl a zvuk

### Barevná paleta hry

| Barva | Hex | Použití |
|---|---|---|
| Primární fialová | `#6B21A8` | Infinity aura, UI akcenty |
| Světlá fialová | `#C4B5FD` | Efekty schopností |
| Gojo bílá | `#F0F0FF` | Vlasy, UI identita |
| Sukuna červená | `#8B0000` | Tetování, Cleave efekt, Shrine šípy |
| Level 1 obloha | `#87CEEB` | Japonská vesnice |
| Level 2 obloha | `#1a1a2e` | Temný les |
| Level 3 obloha | `#0a0a1a` | Noční Tokio |
| Tokio neon | `#00BFFF` / `#FF2D55` | Neonové světla města |

### Zvukový design

**Zvukové efekty:**
- Skok — krátký 8-bit tón nahoru
- Duté fialové — mohutný výbuch s ozvěnou
- Nekonečno aktivace — mystický hum
- Sukuna spawn — dramatický basový dunivý zvuk + varování
- Cleave — zvuk řezu vzduchem + dopad vlny
- Malevolent Shrine — ohnivý whoosh × 3
- Mince — klasický 8-bit pickup
- Game Over — 8-bit gameover jingle
- Vítězství — triumfální fanfára

**Hudba:**
- Level 1: Japonský ambient — koto + 8-bit synth, 120 BPM
- Level 2: Temnější — nižší tóny, pomalejší tempo, tajemno
- Level 3: Elektronická + japonské motivy — neon city vibes, 140 BPM
- Sukuna encounter: speciální intenzivní smyčka — přepne při spawnu
- Boss fight: nejtěžší varianta — buben, výrazný rytmus
- Menu: klidná instrumentální verze hlavního tématu

---

## 9. Vývojový plán

### Milníky

| Fáze | Co se dělá | Výstup | Čas |
|---|---|---|---|
| 1 — Setup | Phaser init, struktura, Vercel napojení | Prázdná scéna online | 1–2 dny |
| 2 — Prototyp | Gojo pohyb, skok, fyzika | Hratelný pohyb | 2–3 dny |
| 3 — Schopnosti | Nekonečno + Duté fialové, HUD | Obě schopnosti fungují | 2–3 dny |
| 4 — Nepřátelé | Malá kletba, velká kletba, čaroděj | Nepřátelé fungují | 3–4 dny |
| 5 — Sukuna | Sukuna entita, Cleave, Shrine, random spawn | Sukuna hratelný | 3–4 dny |
| 6 — Level 1 | Vesnice, platformy, mince, brána | Dohratelný Level 1 | 2–3 dny |
| 7 — Level 2 + 3 | Temný les + Tokio, boss | Kompletní hra | 4–5 dní |
| 8 — Polish | Zvuky, animace, menu, testování | Publikovatelná hra | 3–4 dny |

### Prompt šablona pro Claude Code

```
Pracujeme na hře Gojo's Infinity — 2D plošinovka v Phaser.js 3.
Referenční dokument: GDD v1.2

Postavy:
- Gojo: 32×48 px, bílé vlasy #F0F0FF, tmavé brýle #0F0F1F, černý outfit #111827
- Sukuna: 32×48 px, bílé kimono #EFEFEF, černý obi #222222, červené tetování #8B0000

Hosting: Vercel (index.html jako vstupní bod)
Engine: Phaser.js 3 (CDN), Arcade Physics, 800×450px

Dnešní úkol: [POPIS ÚKOLU]

Vysvětluj každý krok srozumitelně. Piš čistý, komentovaný kód.
Pokud nastavujeme Vercel, postupuj pomalu a každou akci vysvětli.
```

---

## 10. Vercel — průvodce nasazením (krok za krokem)

> Claude Code bude každý krok trpělivě vysvětlovat. Tato sekce je váš přehled co se bude dít a proč.

### Co je Vercel a proč ho používáme?

Vercel je služba která vezme váš kód z GitHubu a automaticky ho zpřístupní na internetu. Každý push = nová verze hry online za ~10 sekund. Zdarma, žádná konfigurace serverů.

---

### Krok 1 — Vytvoření GitHub repozitáře

**Co děláme:** Vytvoříme místo kde bude žít kód hry.

1. Jděte na [github.com](https://github.com) a přihlaste se (nebo vytvořte účet zdarma)
2. Klikněte na zelené tlačítko **"New"** vlevo nahoře
3. Vyplňte:
   - Repository name: `gojo-infinity`
   - Visibility: **Public** (Vercel to vyžaduje na free plánu)
4. Zaškrtněte **"Add a README file"**
5. Klikněte **"Create repository"**

**Co se stalo:** Máte prázdný repozitář na GitHubu připravený pro kód.

---

### Krok 2 — Napojení Claude Code na repozitář

**Co děláme:** Propojíme vývojové prostředí s GitHubem.

Claude Code vám tyto příkazy vygeneruje a vysvětlí každý z nich:

```bash
git init
git remote add origin https://github.com/VAS-USERNAME/gojo-infinity.git
git branch -M main
git push -u origin main
```

**Co každý příkaz dělá:**
- `git init` — inicializuje Git ve vaší složce (začne sledovat změny)
- `git remote add origin ...` — řekne Gitu kde je váš GitHub repozitář
- `git branch -M main` — přejmenuje větev na "main" (standard)
- `git push -u origin main` — pošle kód na GitHub

---

### Krok 3 — Vytvoření Vercel účtu

**Co děláme:** Registrujeme se na Vercelu a propojíme ho s GitHubem.

1. Jděte na [vercel.com](https://vercel.com)
2. Klikněte **"Sign Up"**
3. Zvolte **"Continue with GitHub"**
4. Přihlaste se přes GitHub — Vercel se automaticky propojí

**Proč přes GitHub:** Vercel pak "vidí" vaše repozitáře a při každém push automaticky deployuje.

---

### Krok 4 — Import projektu do Vercelu

**Co děláme:** Řekneme Vercelu aby sledoval náš repozitář.

1. Na Vercel dashboardu klikněte **"Add New Project"**
2. Najděte `gojo-infinity` v seznamu a klikněte **"Import"**
3. Vercel detekuje statický web automaticky
4. **Framework Preset:** nechte na "Other"
5. **Root Directory:** `.` (tečka = kořen projektu)
6. Klikněte **"Deploy"**

**Co se stane:** Vercel vezme kód a za ~30 sekund vám dá URL `gojo-infinity.vercel.app`.

---

### Krok 5 — vercel.json konfigurace

**Co děláme:** Přidáme konfigurační soubor — Claude Code ho vytvoří automaticky.

```json
{
  "version": 2,
  "builds": [
    { "src": "index.html", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/$1" }
  ]
}
```

**Proč to potřebujeme:** Říká Vercelu "servíruj statické soubory, index.html je hlavní stránka".

---

### Krok 6 — Každodenní workflow

**Takto bude vypadat každý den vývoje:**

```bash
# 1. Napište/upravte kód s Claude Code
# 2. Uložte změny:
git add .
git commit -m "Přidán Sukuna spawn systém"
git push
# 3. Vercel automaticky deployuje za ~10 sekund
# 4. Nová verze je na gojo-infinity.vercel.app
```

**Preview URL:** Každý commit dostane také preview URL (např. `gojo-infinity-abc123.vercel.app`) — ideální pro sdílení před tím než změnu zveřejníte.

---

### Krok 7 — Sledování deployů

- Na [vercel.com/dashboard](https://vercel.com/dashboard) vidíte každý deploy
- Zelená fajfka = úspěch, červený křížek = chyba
- Kliknutím na deploy vidíte logy — Claude Code vám pomůže chyby rozluštit
- Vercel Analytics (zdarma) = vidíte kolik hráčů hraje vaši hru

---

### Časté chyby a jejich řešení

| Chyba | Příčina | Řešení |
|---|---|---|
| Hra se nenačte | `index.html` není v kořeni projektu | Přesuňte `index.html` do root složky |
| Zvuky nefungují | Prohlížeč blokuje autoplay | Přidejte zvuk až po první interakci uživatele |
| Sprite se nezobrazí | Špatná cesta k souboru | Zkontrolujte cestu — `assets/sprites/gojo.png` |
| Deploy selže | Chyba v JS kódu | Zkontrolujte Vercel logy, Claude Code opraví |
| CORS error | Testujete přes `file://` | Vždy testujte přes Vercel nebo lokální server |

---

## 11. Zdroje

### Technologie

- Phaser.js 3 — [phaser.io/docs](https://phaser.io/docs)
- Vercel dokumentace — [vercel.com/docs](https://vercel.com/docs)
- GitHub — [github.com](https://github.com)

### Grafické assety (free pixel art)

- [OpenGameArt.org](https://opengameart.org) — CC licence
- [CraftPix.net/freebies](https://craftpix.net/freebies)
- [itch.io/game-assets/free](https://itch.io/game-assets/free)

### Zvukové efekty (free)

- [freesound.org](https://freesound.org) — CC databáze
- [sfxr.me](https://sfxr.me) — online generátor 8-bit zvuků
- [opengameart.org](https://opengameart.org) — sekce audio

---

*Gojo's Infinity — Game Design Document v1.2 — Duben 2026*
