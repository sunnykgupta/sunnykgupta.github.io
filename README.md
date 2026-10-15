# Sunny’s Town

Sunny R Gupta’s personal website: a lively pixel town with direct access to communities, projects, writing, videos, and professional background. The Midnight arcade theme pairs pixel artwork with readable text and ordinary links.

Live at [sunnykgupta.com](https://sunnykgupta.com).

## Explore

- `/`: town map, noticeboard, optional animation, window lights, and a town cat.
- `/communities`: Impromptu Communities and TeamShiksha, with individual community pages.
- `/projects`: a shared catalogue with community filters and individual series pages.
- `/writing`: newsletter, essays, and videos, filterable by format.
- `/about`: background, principles, career, and contact links.
- `/play`: the original Sunny Quest, preserved as an optional playable story.

The site is client-side React on Vite, with Wouter navigation. No API or database is required. Town preferences and game progress stay in the visitor’s browser. Animation honours reduced motion and pauses when the page or artwork is not visible. Sound belongs to the optional game.

## Develop

Requires Bun 1.3.14 or compatible, as specified in `package.json`.

```bash
bun install --frozen-lockfile
bun run dev
```

The web preview uses the configured port 4200. On a web-only workstation, use `ELECTRON_SKIP_BINARY_DOWNLOAD=1 bun install --frozen-lockfile` to skip downloading the unrelated desktop runtime.

## Verify

```bash
bun run lint
bun x tsc -p packages/web/tsconfig.app.json --noEmit
bun x tsc -p packages/web/tsconfig.node.json --noEmit
bun run build:web
```

The build is written to `packages/web/dist`. The build emits entry files for all known routes, a `404.html` fallback, and `.nojekyll`, so section links work directly on GitHub Pages.

For browser verification, check map and menu navigation, direct page reloads, browser Back, the community-to-project flow, both sets of filters, keyboard focus, reduced motion, saved town preferences, mobile layouts, and entering/exiting `/play`.

## Content and structure

| Path                                                 | Purpose                                                               |
| ---------------------------------------------------- | --------------------------------------------------------------------- |
| `packages/web/src/web/components/town/town-site.tsx` | Shared shell, route selection, titles, and focus management           |
| `packages/web/src/web/components/town/pages.tsx`     | Homepage, collections, details, About, and not-found views            |
| `packages/web/src/web/components/town/ui.tsx`        | Shared cards, filters, links, and page headings                       |
| `packages/web/src/web/components/town/art/`          | Hand-authored town and district canvas artwork                        |
| `packages/web/src/web/components/town/town.css`      | Scoped Midnight arcade design system                                  |
| `packages/web/src/web/lib/town/content.ts`           | Communities, projects, publications, and their relationships          |
| `packages/web/src/web/lib/town/profile.ts`           | Career timeline and principles                                        |
| `packages/web/src/web/pages/quest.tsx`               | Original game state machine                                           |
| `packages/web/src/web/lib/game/`                     | Original zones, dialogue, sprites, links, video references, and audio |
| `packages/web/vite/plugins/town-pages.ts`            | Static route entries for GitHub Pages                                 |

Add a project once in `PROJECTS` and set its `communityId` to include it on that community’s page. Its detail route and static entry are generated from the same catalogue. Keep titles, descriptions, and destinations grounded in real work.

## Deployment

The existing GitHub Actions workflow builds and deploys the site on pushes to `main`. Local edits and previews do not publish anything.
