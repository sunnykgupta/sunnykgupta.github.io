# Sunny Quest

A retro 16-bit game you play to learn about Sunny R Gupta.

Live at [sunnykgupta.com](https://sunnykgupta.com).

## What it is

Seven zones, three boss fights, 32 facts to discover. Everything is client side.
There is no API and no database, so the built output is a static site that any
static host can serve. Progress is saved in `localStorage`.

## Stack

Bun workspaces, Vite, React 19, Wouter, Tailwind CSS 4.

## Running it

```bash
bun install
bun run dev        # serves on the port fixed in __ports.cjs
```

## Checks and build

```bash
bun run lint
bun run typecheck
bun run build      # output in packages/web/dist
```

## Where things live

| Path | What |
| --- | --- |
| `packages/web/src/web/pages/index.tsx` | Screen state machine: title, hub, zone, boss |
| `packages/web/src/web/lib/game/content.ts` | All zones, facts, bosses, dialogue |
| `packages/web/src/web/lib/game/sprites.ts` | Hand authored pixel art and palette |
| `packages/web/src/web/lib/game/audio.ts` | Music, cross fades, sound effects, mute |
| `packages/web/src/web/components/game/` | Title, hub, zone, boss, panels, HUD |
| `packages/web/public/audio/` | Music and sound effect files |
| `packages/web/assets-src/assets.json` | Manifest of binary assets restored at build time |
| `design.md` | Colors, typography, voice |

## Deployment

GitHub Actions builds `packages/web/dist` and publishes it to GitHub Pages. See
`.github/workflows/deploy.yml`.
