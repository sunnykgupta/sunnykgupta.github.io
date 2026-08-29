# Sunny Quest — Design

A 16-bit SNES-style RPG portfolio for Sunny R Gupta, shipping on web (single Vite/React app).
Visitors pick a zone from a pixel hub, walk a sprite around a room, talk to props and NPCs, and
each conversation unlocks one grounded fact about Sunny. Three boss fights cover scale work.
A `SKIP` route (`/about`) gives recruiters the same story as a clean scrollable page.

## Brand & Colors

Web tokens live in `packages/web/src/web/styles.css` (`@theme` block). Dusk-indigo base, warm gold
and coral accents, cyan/lime for UI feedback. Deliberately limited, SNES-palette feel.

| Token | Value | Use |
|-------|-------|-----|
| ink | #0b0817 | Page background, outside the CRT |
| deep | #15112b | Screen background |
| panel | #241a45 | Dialogue boxes, cards |
| panel2 | #35275f | Panel highlights, borders, hover |
| gold | #ffc94a | Primary accent: headings, XP, selection |
| coral | #ff6e4d | Secondary accent: player, boss HP, CTAs |
| cyan | #6ee7ff | Links, interactive hints |
| lime | #7ee787 | Discovered / success states |
| parchment | #f4ecff | Primary text |
| muted | #a99ad6 | Secondary text |

Zone palettes (floor/wall/accent triples) live in `lib/game/content.ts` so each room reads as its
own biome: bedroom warm brown, startup office teal, lab violet, scale tower steel-blue, war room
navy, guild hall gold, café warm amber.

## Typography

Readability comes first. The old pairing (Press Start 2P everywhere plus VT323 body) looked retro
but was hard to read, so it was replaced.

- **Logo only:** `Press Start 2P` via the `font-title` utility. Used for the SUNNY QUEST title
  screen logo and nothing else.
- **Display / UI:** `Silkscreen` (`--font-display`, the default). Headings, menus, HUD, buttons,
  labels. Pixel-shaped but readable. Never below 12px. Labels 12 to 16px, headings 16 to 26px.
- **Body / dialogue:** `DotGothic16` (`--font-body`, the `font-body` utility). Dialogue,
  descriptions, about-page prose. 18 to 23px with relaxed line height.
- Loaded from Google Fonts in `packages/web/index.html`.

## Voice

Copy is written the way Sunny writes. Short, fully formed sentences. Plain words. No em-dashes and
no en-dashes anywhere in user-facing text. Date ranges read "2019 to 2023".

## Pixel-art system

No image assets. Every sprite is authored as rows of palette chars in `lib/game/sprites.ts` and
rendered by `components/game/pixel-sprite.tsx` as a single div using `box-shadow` pixels — sharp at
any scale, tintable per instance (`tint` remaps the accent char). Terrain is a CSS grid of tile divs.
The room viewport is a fixed logical size (19×11 tiles × 24px) scaled with `transform: scale()` to
fit the container, so the pixel grid never fractions.

## Pages & Screens

- **Web — Game** (`pages/index.tsx`) — state machine: `title → hub → zone → boss / youtube / saves / achievements`.
- **Web — About** (`pages/about.tsx`) — long-form scrollable version of the same story, for recruiters and SEO.
- Screens live in `components/game/`: `title-screen`, `hub-screen`, `zone-screen`, `dialogue-box`,
  `boss-fight`, `achievements-panel`, `save-file`, `youtube-panel`, `touch-controls`, `hud`.

## Key User Flows

1. Title → `PRESS START` → hub map with 7 zones and per-zone completion bars.
2. Enter zone → walk with arrows/WASD (or on-screen D-pad) → stand next to a prop → `A`/Space →
   dialogue → last line unlocks a fact, HUD counter and zone bar update, progress saved to localStorage.
3. Scale Tower → boss door → pick engineering "moves"; real mitigations damage the boss, cargo-cult
   moves raise the load meter. Win → facts unlocked.
4. Any screen → `SAVE FILE` for links/resume, `ACHIEVEMENTS` for the fact log, `SKIP` for `/about`.

## Architecture

- Fully client-side: no API calls, no database — the site must be able to sit on a static host
  (sunnykgupta.github.io). Progress persists in `localStorage` under `sunny-quest:v1`.
- Content is data, not markup: zones, entities, dialogue, facts and bosses in `lib/game/content.ts`.
