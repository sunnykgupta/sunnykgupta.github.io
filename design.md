# Sunny’s Town

The main website is an accessible, browsable neighbourhood. Pixel artwork provides the game personality; ordinary links, visible labels, and readable pages provide the navigation. No visitor needs to walk a character, complete a quest, or unlock content.

## Midnight arcade

The approved palette is scoped to `.town-site` in `components/town/town.css`.

| Color      | Value     | Use                              |
| ---------- | --------- | -------------------------------- |
| Midnight   | `#101827` | Page background                  |
| Panel      | `#1b2940` | Cards and town interface         |
| Ink        | `#f1f5ff` | Primary text                     |
| Muted text | `#b3c4dc` | Descriptions and supporting text |
| Border     | `#354966` | Structure and pixel frames       |
| Mint       | `#88e4d6` | Town and Projects actions        |
| Coral      | `#f28387` | Communities actions              |
| Lavender   | `#b5a6ee` | Writing & Videos actions         |

Use DM Sans for headings, prose, and controls. Use Silkscreen for the wordmark, compact section labels, and town signs. The original game retains its existing fonts, palette, and styles.

## Navigation and grouping

The homepage has four labelled destinations: Communities, Projects, Writing & Videos, and About. Every destination is also present in the main navigation. On phones, the map becomes a decorative scene above large destination links.

Communities have their own pages and associated projects. `lib/town/content.ts` is the source of truth: a project’s `communityId` makes it appear under that community as well as in Projects. The library groups publishing homes and series by format. It links to the original publishing platforms.

The About page retains the existing background, principles, career timeline, and contact links. “Play my story” links to the original Sunny Quest at `/play`.

## Artwork and interaction

`components/town/art/` contains hand-authored pixel scenes painted into canvas. Canvas is decorative; labels and links remain semantic HTML. The town has residents, a café, workshop, library, home, fountain, gardens, and a clickable cat. Short, optional interactions never hide useful content.

Town animation has a pause control, honours `prefers-reduced-motion`, and stops drawing when offscreen or when the document is hidden. Window lighting and motion preferences persist safely in localStorage. The main website does not play audio. Leaving the optional game stops its music.

## Accessibility and hosting

- Visible navigation and descriptive links, with no hover-only content.
- Native buttons, fieldsets, and output elements for filters and status.
- A skip link, visible keyboard focus, and heading focus after route changes.
- Real, shareable paths and a helpful unknown-route page.
- Responsive content down to 320px, with touch-sized controls.
- Physical entry files for known paths on GitHub Pages, plus a 404 fallback.

## Voice and content

Use short, fully formed sentences in Sunny’s voice. Use plain words and avoid em-dashes and en-dashes in public copy. Career dates read “2019 to 2023”. Claims, project names, articles, and external destinations must come from supplied or verified material. Do not invent projects, event dates, testimonials, metrics, or article titles to fill the layout.

The current catalogue uses the existing community, series, writing, and professional information. Add further work through the central data catalogue.

## Original game

Sunny Quest remains client-side at `/play`, with its seven zones, boss fights, dialogue, sound controls, and existing `sunny-quest:v1` saved progress. Its styles stay separate from the new town. The game is optional and does not gate any main-site content.
