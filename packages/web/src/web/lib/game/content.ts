import type { SpriteKey } from "./sprites";

/** ------------------------------------------------------------------
 * Terrain
 * '#' outer wall  '=' wall face  '.' floor  ':' alt floor  '_' carpet
 * ------------------------------------------------------------------ */
export const TILE = 24;
export const MAP_W = 19;
export const MAP_H = 11;
export const SOLID_TILES = new Set(["#", "="]);

export type Vec = { x: number; y: number };

export type ZonePalette = {
  floor: string;
  floorAlt: string;
  carpet: string;
  wall: string;
  wallFace: string;
  glow: string;
};

export type Entity = {
  id: string;
  x: number;
  y: number;
  sprite: SpriteKey;
  /** Overrides the sprite's accent colour. */
  tint?: string;
  /** Header shown in the dialogue box. */
  name?: string;
  lines?: string[];
  fact?: { id: string; label: string };
  link?: { label: string; href: string };
  /** Opens a special panel instead of plain dialogue. */
  panel?: "youtube";
  /** Starts a boss fight. */
  boss?: string;
  solid?: boolean;
  float?: boolean;
};

export type BossMove = {
  label: string;
  hint: string;
  /** Real mitigation gives damage. Bad move gives none and raises load. */
  damage: number;
  response: string;
};

export type Boss = {
  id: string;
  name: string;
  subtitle: string;
  hp: number;
  intro: string[];
  moves: BossMove[];
  victory: string[];
  facts: { id: string; label: string }[];
  loadLabel: string;
};

export type Zone = {
  id: string;
  title: string;
  subtitle: string;
  era: string;
  blurb: string;
  cartridgeTint: string;
  palette: ZonePalette;
  map: string[];
  spawn: Vec;
  entities: Entity[];
  bosses?: Boss[];
};

const ROOM = [
  "###################",
  "#=================#",
  "#=================#",
  "#.................#",
  "#.................#",
  "#.................#",
  "#.................#",
  "#.................#",
  "#.................#",
  "#.................#",
  "###################",
];

/** Same shell, with a carpet runner down the middle. */
function withCarpet(rows: string[], cols: number[]): string[] {
  return rows.map((row, y) => {
    if (y < 3 || y === MAP_H - 1) return row;
    return row
      .split("")
      .map((tile, x) => (tile === "." && cols.includes(x) ? "_" : tile))
      .join("");
  });
}

/** Checkerboard the floor for the office and tower rooms. */
function withTiles(rows: string[]): string[] {
  return rows.map((row, y) =>
    row
      .split("")
      .map((tile, x) => (tile === "." && (x + y) % 2 === 0 ? ":" : tile))
      .join(""),
  );
}

export const ZONES: Zone[] = [
  /* ------------------------------------------------------------ 1 */
  {
    id: "bootloader",
    title: "The Bootloader",
    subtitle: "Jamnagar, age 12",
    era: "1998 to 2012",
    blurb: "A bedroom, an old machine, and the wrong hobby for the right reasons.",
    cartridgeTint: "#ff6e4d",
    palette: {
      floor: "#5b3a26",
      floorAlt: "#6b452d",
      carpet: "#8a3f2f",
      wall: "#2a1b3d",
      wallFace: "#462f4d",
      glow: "#ffc94a",
    },
    map: withCarpet(ROOM, [9]),
    spawn: { x: 9, y: 8 },
    entities: [
      {
        id: "crt",
        x: 4,
        y: 4,
        sprite: "crt",
        name: "The First Machine",
        lines: [
          "I was 12 when I wrote my first real lines of code. It was on a machine like this one.",
          "There was no course to follow and no video to copy. I had a manual, a compiler, and a lot of failed attempts.",
          "That is when the screen stopped being something I watched. It became something I could build with.",
        ],
        fact: { id: "age-12", label: "Started coding at 12" },
      },
      {
        id: "console",
        x: 14,
        y: 5,
        sprite: "console",
        name: "The Road Not Taken",
        lines: [
          "Everyone my age was on the other side of this controller. High scores, cheat codes, weekend tournaments.",
          "I liked the games too. I was just more interested in how the game decided where the sprite should move.",
          "Same room, same age, different question. That question turned into a career.",
        ],
        fact: { id: "why-not-games", label: "Played the games, then took them apart" },
      },
      {
        id: "shelf",
        x: 7,
        y: 3,
        sprite: "bookshelf",
        name: "Manuals And Fundamentals",
        lines: [
          "My degree is in Electronics and Telecommunication from Pune University. It is not Computer Science.",
          "So I had to work out the basics myself. How a machine remembers. How two machines talk. Why binary in the first place.",
          "It turned out to be useful. When nobody hands you the shortcut, you learn how the thing actually works.",
        ],
        fact: { id: "no-cs-degree", label: "No CS degree, learned the stack from the ground up" },
      },
      {
        id: "laptop",
        x: 11,
        y: 7,
        sprite: "laptop",
        name: "Answering Strangers",
        lines: [
          "Early on I started answering questions on Stack Overflow.",
          "It added up to 5,000 plus reputation and answers that around 1.4 million people have read.",
          "That taught me something simple. Write it once and it can help thousands of people.",
        ],
        fact: { id: "stackoverflow", label: "Stack Overflow answers read by around 1.4M people" },
      },
      { id: "bed", x: 16, y: 8, sprite: "bed", solid: true },
      {
        id: "poster",
        x: 6,
        y: 8,
        sprite: "poster",
        name: "Unfinished Game",
        lines: [
          "A poster for a game I never finished building. I keep it around on purpose.",
          "You have to start with the idea. You also have to ship it.",
        ],
      },
      { id: "plant1", x: 2, y: 8, sprite: "plant", solid: true },
    ],
  },

  /* ------------------------------------------------------------ 2 */
  {
    id: "startup-arena",
    title: "Startup Arena",
    subtitle: "Build, break, repeat",
    era: "2012 to 2019",
    blurb: "Seven years of shipping in public, sitting close to founders and to the numbers.",
    cartridgeTint: "#6ee7ff",
    palette: {
      floor: "#1f4a4a",
      floorAlt: "#26575a",
      carpet: "#2f6f6b",
      wall: "#14243a",
      wallFace: "#233a58",
      glow: "#6ee7ff",
    },
    map: withTiles(ROOM),
    spawn: { x: 9, y: 9 },
    entities: [
      {
        id: "tavisca",
        x: 3,
        y: 4,
        sprite: "desk",
        tint: "#7ee787",
        name: "Tavisca, 2012 to 2013",
        lines: [
          "My first job. I was in the R and D unit, rewriting a travel platform from scratch.",
          "We moved a monolith to microservices and server rendered pages to an MVC app. In 2012 both of those were still arguments people had.",
          "The app got faster, conversions went up, and revenue followed. That is where I learned code is a business lever.",
        ],
        fact: { id: "tavisca", label: "First job at 20, rewrote a monolith into microservices" },
      },
      {
        id: "fab",
        x: 6,
        y: 4,
        sprite: "desk",
        tint: "#ffc94a",
        name: "Fab and Hem.com, 2014",
        lines: [
          "I was the founding developer on the Hem.com web portal. You could configure furniture in 3D inside the browser.",
          "It ran on vanilla JavaScript and jQuery, with the price recalculating while you dragged things around. Browsers were not really ready for that yet.",
          "The company wound down in a PE exit. That one project taught me more than a year of reading would have.",
        ],
        fact: { id: "fab-hem", label: "Built an in-browser 3D furniture configurator in 2014" },
      },
      {
        id: "wooplr",
        x: 9,
        y: 4,
        sprite: "desk",
        tint: "#ff5fa2",
        name: "Wooplr, 2015 to 2016",
        lines: [
          "I was the lead web engineer on a social commerce platform. The users were on 2G, on cheap phones, on networks that dropped mid request.",
          "I built the in-house CMS, the curator queues, and the dashboards the business ran on.",
          "Performance was not a nice thing to have there. It was the product.",
        ],
        fact: { id: "wooplr", label: "Shipped for 2G India, where performance was the product" },
      },
      {
        id: "flyoso",
        x: 12,
        y: 4,
        sprite: "whiteboard",
        tint: "#ff6e4d",
        name: "Flyoso, 2016 to 2017",
        lines: [
          "Then I left to build my own thing. It was a meta search for the best travel deals across flights and hotels.",
          "We built it. We never found product market fit. I shut it down.",
          "Failing at your own company teaches you faster than anything else. I would recommend doing it once.",
        ],
        fact: { id: "flyoso", label: "Founded a startup, found no PMF, shut it down" },
      },
      {
        id: "jio",
        x: 15,
        y: 4,
        sprite: "desk",
        tint: "#4a7cff",
        name: "Reliance Jio, 2017 to 2018",
        lines: [
          "I ran frontend and apps for the Financial Innovation Group. We built a UI widget library and an analytics SDK from scratch, for the JioPhone.",
          "A feature phone, a very small runtime, and a target of a billion users.",
          "Apps built on that framework went out to hundreds of millions of devices.",
        ],
        fact: { id: "jio-fig", label: "Built a UI framework running on 100M+ JioPhones" },
      },
      {
        id: "thoughtspot",
        x: 4,
        y: 8,
        sprite: "dashboard",
        name: "ThoughtSpot, 2018 to 2019",
        lines: [
          "Member of Technical Staff on the UI side. I worked on charting and plotting BI data across very different domains.",
          "Cross platform GUI work, enterprise dashboards, and a lot of refactoring nobody claps for.",
          "It was my first real look at enterprise level rigour after years of startup speed. Both are skills worth having.",
        ],
        fact: { id: "thoughtspot", label: "Learned enterprise rigour at ThoughtSpot" },
      },
      {
        id: "founders",
        x: 13,
        y: 8,
        sprite: "npc",
        tint: "#ffc94a",
        name: "The Founder",
        lines: [
          "Startups let you break things in public and then own the fix.",
          "I spent those years sitting with founders. We talked about pricing, funnels, retention, and what actually made money.",
          "Most of my peers were busy getting better at frameworks. I was learning why the company existed. Both matter, but only one of them prepares you to lead.",
        ],
        fact: {
          id: "business-side",
          label: "Learned the business side while peers focused on frameworks",
        },
      },
      { id: "plant2", x: 17, y: 8, sprite: "plant", solid: true },
      { id: "coffee1", x: 8, y: 8, sprite: "coffee", solid: true },
    ],
  },

  /* ------------------------------------------------------------ 3 */
  {
    id: "first-principles-lab",
    title: "First Principles Lab",
    subtitle: "Strip it down, rebuild it",
    era: "Always on",
    blurb: "Side projects, System Design Sessions, and a camera that finally got switched on.",
    cartridgeTint: "#b98cff",
    palette: {
      floor: "#332352",
      floorAlt: "#3b2a5d",
      carpet: "#4a2f7a",
      wall: "#1b1233",
      wallFace: "#2e1f4f",
      glow: "#b98cff",
    },
    map: withCarpet(ROOM, [8, 9, 10]),
    spawn: { x: 9, y: 9 },
    entities: [
      {
        id: "fp-board",
        x: 4,
        y: 4,
        sprite: "whiteboard",
        name: "The Method",
        lines: [
          "My method is simple. I take a thing apart until nothing is assumed, then I build it back up.",
          "Why binary? Why does a packet need a header? Why is cache invalidation the hard part? I start at the bottom every time.",
          "If you only learn the abstraction, you are trusting someone else's understanding. I would rather have my own.",
        ],
        fact: { id: "first-principles", label: "Learns everything from first principles" },
      },
      {
        id: "bench",
        x: 7,
        y: 4,
        sprite: "workbench",
        name: "Side Project Pile",
        lines: [
          "There is always a pile of side projects going. Some of them ship, some of them die quietly, all of them teach me something.",
          "They keep my hands on the keyboard even when the day job is mostly people and planning.",
          "If I stop building, I start guessing. That is a bad trade for an engineering leader.",
        ],
        fact: { id: "side-projects", label: "Keeps shipping side projects to keep learning" },
      },
      {
        id: "teamshiksha",
        x: 11,
        y: 4,
        sprite: "sign",
        name: "TeamShiksha",
        lines: [
          "TeamShiksha is the community I run for engineers who want to go deeper than a tutorial.",
          "In the System Design Sessions we have covered networking, APIs, data modelling, indexing, caching, sharding, consistent hashing and CAP.",
          "Teaching in public is good for me too. Nothing finds a gap in your understanding faster than a room asking why.",
        ],
        fact: { id: "teamshiksha", label: "Runs TeamShiksha and the System Design Sessions" },
        link: { label: "team.shiksha", href: "https://team.shiksha" },
      },
      {
        id: "camera",
        x: 14,
        y: 5,
        sprite: "camera",
        name: "From First Principles",
        panel: "youtube",
        lines: [
          "I had been meaning to record videos for years. It sat on my list with plenty of intent and no progress.",
          "Season 1 is now live. It is Computers and Software, explained from first principles.",
          "The first video was not the hard part. The fiftieth one is. So the plan is to stay consistent.",
        ],
        fact: {
          id: "youtube",
          label: "Started the YouTube channel and is staying consistent",
        },
        link: { label: "youtube.com/sunnykgupta", href: "https://www.youtube.com/sunnykgupta" },
      },
      {
        id: "writing",
        x: 6,
        y: 8,
        sprite: "laptop",
        name: "Writing Desk",
        lines: [
          "I write as well. There is the 'for Bunnies' series, essays on Medium and Peerlist, and a newsletter called When?.",
          "The test is always the same. If I cannot explain it simply, I have not understood it yet.",
        ],
        fact: { id: "writing", label: "Writes the 'for Bunnies' series and the When? newsletter" },
      },
      { id: "plant3", x: 2, y: 4, sprite: "plant", solid: true },
      { id: "shelf3", x: 16, y: 8, sprite: "bookshelf", solid: true },
    ],
  },

  /* ------------------------------------------------------------ 4 */
  {
    id: "scale-tower",
    title: "Scale Tower",
    subtitle: "Three boss fights",
    era: "2019 to 2026",
    blurb: "Atlassian, two platform migrations, and 50 million people watching at once.",
    cartridgeTint: "#4a7cff",
    palette: {
      floor: "#1c2a44",
      floorAlt: "#22334f",
      carpet: "#2b4470",
      wall: "#0f1729",
      wallFace: "#1b2b47",
      glow: "#4a7cff",
    },
    map: withTiles(ROOM),
    spawn: { x: 9, y: 9 },
    entities: [
      {
        id: "door-atlassian",
        x: 4,
        y: 4,
        sprite: "door",
        tint: "#4a7cff",
        boss: "boss-atlassian",
        name: "Boss Door 1",
        float: true,
      },
      {
        id: "door-migration",
        x: 9,
        y: 4,
        sprite: "door",
        tint: "#b98cff",
        boss: "boss-migration",
        name: "Boss Door 2",
        float: true,
      },
      {
        id: "door-ipl",
        x: 14,
        y: 4,
        sprite: "door",
        tint: "#ff6e4d",
        boss: "boss-ipl",
        name: "Boss Door 3",
        float: true,
      },
      {
        id: "ops",
        x: 6,
        y: 8,
        sprite: "dashboard",
        name: "The Ops Wall",
        lines: [
          "Reliability is not about heroics. It comes from observability, SLOs, and operational discipline applied every week.",
          "We ran a strict incident review process and kept it blameless. Fix the system, not the person.",
          "The goal is a team that sleeps well and an on-call rota nobody dreads.",
        ],
        fact: { id: "ops", label: "Blameless incident reviews and SLO driven operations" },
      },
      { id: "servers1", x: 2, y: 8, sprite: "servers", solid: true },
      { id: "servers2", x: 17, y: 8, sprite: "servers", solid: true },
      {
        id: "trophy",
        x: 12,
        y: 8,
        sprite: "trophy",
        name: "Scoreboard",
        lines: [
          "At JioHotstar, previously JioCinema, I led three verticals. Identity, Web, and Dazzle, which was the engagement charter.",
          "Those systems served over 300 million visitors a day. Identity held hundreds of millions of user records.",
          "At that size the numbers stop being numbers. Each one is a failure mode you have to design for.",
        ],
        fact: {
          id: "scoreboard",
          label: "Led Identity, Web and Engagement for a platform serving 300M+ a day",
        },
      },
    ],
    bosses: [
      {
        id: "boss-atlassian",
        name: "JIRA And Commerce",
        subtitle: "Atlassian, 2019 to 2023",
        hp: 3,
        loadLabel: "Tech debt",
        intro: [
          "Millions of teams depend on this product. There is legacy inside the legacy. And you are moving it to cloud while it is live.",
          "Pick your moves.",
        ],
        moves: [
          {
            label: "Migrate in slices",
            hint: "Move to cloud one seam at a time",
            damage: 1,
            response:
              "Right call. Small slices, behind flags, reversible at every step. A good migration is one nobody notices.",
          },
          {
            label: "Engineering health and SLOs",
            hint: "KTLO, on-call, SLIs that mean something",
            damage: 1,
            response:
              "Right call. Keeping the lights on is not exciting work, but it is where trust with users gets built.",
          },
          {
            label: "Distributed UI architecture",
            hint: "Many teams shipping into one surface",
            damage: 1,
            response:
              "Right call. Next generation JIRA Cloud needed a UI architecture that many teams could ship into without breaking each other.",
          },
          {
            label: "Rewrite it from scratch",
            hint: "It will be cleaner this time",
            damage: 0,
            response:
              "This is the classic trap. Two years pass, users get nothing, and you relearn the same complexity the hard way. Debt goes up.",
          },
          {
            label: "Freeze all releases",
            hint: "Stability by doing nothing",
            damage: 0,
            response:
              "Freezes feel safe and quietly add risk. The next release just gets bigger and scarier. Debt goes up.",
          },
        ],
        victory: [
          "Four years. I joined as a senior developer on the core platform and led features for next generation JIRA Cloud with a PM and a designer.",
          "I left as an Engineering Manager owning three services, a team, stakeholder communication, SLOs and the on-call roster.",
        ],
        facts: [
          {
            id: "atlassian",
            label: "Four years at Atlassian, senior dev to EM owning three services",
          },
        ],
      },
      {
        id: "boss-migration",
        name: "The Migration Hydra",
        subtitle: "Voot to JioCinema to JioHotstar",
        hp: 3,
        loadLabel: "Churn risk",
        intro: [
          "Two platform migrations in three years. Voot to JioCinema in 2023. JioCinema to JioHotstar in 2025.",
          "Hundreds of millions of user records, and identity is the one thing you cannot get wrong.",
        ],
        moves: [
          {
            label: "Dual write identity",
            hint: "Keep both systems true at once",
            damage: 1,
            response:
              "Right call. Dual write and shadow reads until the new system is provably correct. That beats a hopeful cutover.",
          },
          {
            label: "Migrate in cohorts",
            hint: "Keep the blast radius small",
            damage: 1,
            response:
              "Right call. Cohorts, canaries, and a rollback you have actually rehearsed rather than only documented.",
          },
          {
            label: "Backfill, then verify",
            hint: "Reconcile every record",
            damage: 1,
            response:
              "Right call. Backfill hundreds of millions of records, then reconcile and verify. Data integrity is the migration.",
          },
          {
            label: "Big bang cutover on match day",
            hint: "Biggest audience, biggest moment",
            damage: 0,
            response: "Bold. It is also how you end up as a cautionary tale. Risk goes up.",
          },
          {
            label: "Ask users to sign up again",
            hint: "Start with a clean slate",
            damage: 0,
            response:
              "Every re-registration screen is a churn event at this size. You do not hand users an exit. Risk goes up.",
          },
        ],
        victory: [
          "Both migrations landed, brand to brand, with identity intact for hundreds of millions of accounts.",
          "From the outside it looked like a rename. Underneath, the platform changed while it kept running.",
        ],
        facts: [
          { id: "migrations", label: "Led two brand scale platform migrations at 100M+ users" },
        ],
      },
      {
        id: "boss-ipl",
        name: "IPL Live",
        subtitle: "50 million concurrent viewers",
        hp: 4,
        loadLabel: "Request storm",
        intro: [
          "Final over. 50 million people are watching at the same time, and they all tap the same engagement feature in the same second.",
          "One of your backends just got slow. The audience should never find out.",
        ],
        moves: [
          {
            label: "Exponential backoff",
            hint: "Retries that do not become the outage",
            damage: 1,
            response:
              "Right call. Naive retries turn a small blip into an outage. Backoff with jitter turns a storm into a drizzle.",
          },
          {
            label: "Thundering herd guard",
            hint: "Millions of clients, one shared moment",
            damage: 1,
            response:
              "Right call. Stagger, jitter and combine requests. When every client reacts to the same ball, being in sync is the problem.",
          },
          {
            label: "Client side caching",
            hint: "The request you never send",
            damage: 1,
            response:
              "Right call. The cheapest request never leaves the device, and it still works when we are having a bad minute.",
          },
          {
            label: "CDN offload",
            hint: "Serve it from the edge",
            damage: 1,
            response:
              "Right call. Push static and semi static content to the edge and keep origin for what really needs it.",
          },
          {
            label: "Add more pods and hope",
            hint: "Scale is just money, right?",
            damage: 0,
            response:
              "Sometimes it buys you a minute. It also puts more pressure on the database behind it. Load goes up.",
          },
          {
            label: "Turn the feature off",
            hint: "No feature, no bug",
            damage: 0,
            response:
              "That is a last resort, not a plan. Design for graceful degradation instead of a light switch. Load goes up.",
          },
        ],
        victory: [
          "50 million concurrent viewers on live events, and over 300 million visitors a day across the engagement systems.",
          "We designed it so that when a backend has a bad day, users still see something sensible. Our problem, not their evening.",
        ],
        facts: [
          { id: "ipl", label: "Engineered for 50M concurrent viewers during IPL" },
          {
            id: "graceful",
            label: "Built systems that degrade gracefully so users never see a bad day",
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------ 5 */
  {
    id: "war-room",
    title: "The War Room",
    subtitle: "Global stakeholders",
    era: "The senior years",
    blurb: "Where technology stops being the point and starts being the enabler.",
    cartridgeTint: "#7ee787",
    palette: {
      floor: "#20304a",
      floorAlt: "#26385a",
      carpet: "#2f4a6b",
      wall: "#111a2c",
      wallFace: "#1d2c47",
      glow: "#7ee787",
    },
    map: withCarpet(ROOM, [7, 8, 9, 10, 11]),
    spawn: { x: 9, y: 9 },
    entities: [
      { id: "boardtable", x: 9, y: 6, sprite: "table", solid: true },
      {
        id: "globe",
        x: 5,
        y: 4,
        sprite: "globe",
        name: "Global Stakeholders",
        lines: [
          "My desk is in Bengaluru and my stakeholders are spread across the world. Product sits in one timezone, business in another, and users are everywhere.",
          "You learn to write things down, decide without waiting for a meeting, and share more context than feels necessary. A timezone is not an excuse.",
        ],
        fact: { id: "global", label: "Works with global stakeholders across timezones" },
      },
      {
        id: "biz",
        x: 9,
        y: 4,
        sprite: "dashboard",
        name: "Technology Is The Enabler",
        lines: [
          "At some point the job changes. Technology becomes the enabler and the thing you are really building is a business.",
          "So you ship value in small pieces, often, without giving up quality, observability or reliability.",
          "Good engineering does not slow a business down. Badly run engineering does.",
        ],
        fact: { id: "tech-enabler", label: "Treats tech as the enabler and the business as the goal" },
      },
      {
        id: "translate",
        x: 13,
        y: 4,
        sprite: "whiteboard",
        tint: "#7ee787",
        name: "Translation",
        lines: [
          "The most useful senior skill is translation, and nobody teaches it.",
          "Roadmap into architecture. Architecture into cost. Incidents into business risk. Revenue targets into a sprint that makes sense.",
          "Do that well and engineering stops being treated as a cost centre.",
        ],
        fact: { id: "translation", label: "Translates between business and engineering" },
      },
      { id: "plant5", x: 2, y: 8, sprite: "plant", solid: true },
      { id: "coffee5", x: 16, y: 8, sprite: "coffee", solid: true },
    ],
  },

  /* ------------------------------------------------------------ 6 */
  {
    id: "guild-hall",
    title: "Guild Hall",
    subtitle: "Leading people",
    era: "Leadership",
    blurb: "Impact first, then a growth plan that tells you what to practise.",
    cartridgeTint: "#ffc94a",
    palette: {
      floor: "#4a3a1f",
      floorAlt: "#584526",
      carpet: "#7a5320",
      wall: "#241a33",
      wallFace: "#3d2c47",
      glow: "#ffc94a",
    },
    map: withCarpet(ROOM, [9]),
    spawn: { x: 9, y: 9 },
    entities: [
      {
        id: "skilltree",
        x: 9,
        y: 4,
        sprite: "skilltree",
        name: "The Growth Plan",
        lines: [
          "Everyone on my team gets a growth plan across a few pillars. Technical depth, product sense, ownership, communication, and business context.",
          "Telling someone to do good work and they will grow is not a plan. A plan says what to practise this quarter and what better looks like.",
          "Careers get built on deliberate practice, not on hoping somebody notices you.",
        ],
        fact: {
          id: "growth-pillars",
          label: "Builds growth plans across technical and business pillars",
        },
      },
      {
        id: "mentee1",
        x: 5,
        y: 5,
        sprite: "npc",
        tint: "#6ee7ff",
        name: "Engineer, Two Years In",
        lines: [
          "The first thing I ask a team is whether they know why this work matters, to the user and to the business.",
          "If the answer is that it was in the sprint, that is on me as a leader, not on them.",
          "People do their best work when they can see the difference it makes.",
        ],
        fact: { id: "impact", label: "Makes sure teams understand the impact of their work" },
      },
      {
        id: "mentee2",
        x: 13,
        y: 5,
        sprite: "npc",
        tint: "#ff5fa2",
        name: "Tech Lead",
        lines: [
          "My job is to remove friction, give clarity, and then get out of the way.",
          "Hire carefully. Trust people out loud. Keep reviews blameless. Stay close to the customer so the team solves the right problem.",
          "Culture is not a poster on the wall. It is what gets rewarded during a bad week.",
        ],
        fact: { id: "leading", label: "Leads by removing friction and giving clarity" },
      },
      {
        id: "lectern",
        x: 6,
        y: 8,
        sprite: "lectern",
        name: "The Lectern",
        lines: [
          "I speak, teach and mentor. Keynotes, colleges, communities, and a lot of one on one conversations that never reach a stage.",
          "The reason is the same as everything else here. Explaining something is the fastest way to find out whether you understand it.",
        ],
        fact: { id: "speaking", label: "Keynote speaker, teacher and mentor" },
      },
      { id: "shelf6", x: 16, y: 8, sprite: "bookshelf", solid: true },
      { id: "plant6", x: 2, y: 5, sprite: "plant", solid: true },
    ],
  },

  /* ------------------------------------------------------------ 7 */
  {
    id: "impromptu-cafe",
    title: "Impromptu Cafe",
    subtitle: "Bengaluru, tonight",
    era: "2024 to now",
    blurb: "A cafe, a last minute pin on a map, and whoever shows up.",
    cartridgeTint: "#ff5fa2",
    palette: {
      floor: "#5a3a24",
      floorAlt: "#68452b",
      carpet: "#8a5a2f",
      wall: "#2c1c2e",
      wallFace: "#4a3038",
      glow: "#ff5fa2",
    },
    map: withCarpet(ROOM, [9]),
    spawn: { x: 9, y: 9 },
    entities: [
      {
        id: "counter",
        x: 9,
        y: 4,
        sprite: "counter",
        name: "Impromptu Meetups",
        lines: [
          "I pick a cafe in Bengaluru and share the location and time, usually at the last minute and usually after work.",
          "Techies, designers and product folks turn up. Bring a laptop, bring a book, or bring the problem you have been stuck on all week.",
          "Why impromptu? Because last minute plans actually happen, unlike that Goa trip you have been planning for three years.",
        ],
        fact: { id: "impromptu", label: "Hosts Impromptu Meetups in Bengaluru cafes" },
        link: { label: "impromptu.community", href: "https://impromptu.community" },
      },
      {
        id: "regular1",
        x: 5,
        y: 6,
        sprite: "npc",
        tint: "#7ee787",
        name: "A Regular",
        lines: [
          "People talk about what is actually going on. A promotion that did not come through. A system that will not scale. A side project that stalled in week two.",
          "There is no stage and there are no slides. It is the part of a conference you actually remember.",
          "Some people come to share what they have learned. Some come to borrow a bit of confidence. Both are welcome.",
        ],
        fact: { id: "what-happens", label: "Meetups cover real blockers and real growth questions" },
      },
      {
        id: "notice",
        x: 14,
        y: 4,
        sprite: "notice",
        name: "Notice Board",
        lines: [
          "JP Nagar, HSR, Bellandur, Sarjapur Road, Vittal Mallya Road, Residency Road. We have been to most parts of the city.",
          "Events go out on the WhatsApp community and on Luma. If you are in Bengaluru, just turn up.",
        ],
        fact: { id: "join", label: "Anyone in the tech ecosystem can just turn up" },
        link: { label: "luma.com/impromptu", href: "https://luma.com/impromptu" },
      },
      { id: "cafe1", x: 4, y: 8, sprite: "cafeTable", solid: true },
      { id: "cafe2", x: 12, y: 8, sprite: "cafeTable", solid: true },
      { id: "plant7", x: 17, y: 5, sprite: "plant", solid: true },
      { id: "laptop7", x: 7, y: 8, sprite: "laptop", solid: true },
    ],
  },
];

/** Every discoverable fact, in zone order. Used by the discovery log. */
export function allFacts(): { zoneId: string; zoneTitle: string; id: string; label: string }[] {
  const out: { zoneId: string; zoneTitle: string; id: string; label: string }[] = [];
  for (const zone of ZONES) {
    for (const entity of zone.entities) {
      if (entity.fact) {
        out.push({
          zoneId: zone.id,
          zoneTitle: zone.title,
          id: entity.fact.id,
          label: entity.fact.label,
        });
      }
    }
    for (const boss of zone.bosses ?? []) {
      for (const fact of boss.facts) {
        out.push({ zoneId: zone.id, zoneTitle: zone.title, id: fact.id, label: fact.label });
      }
    }
  }
  return out;
}

export function zoneFactIds(zone: Zone): string[] {
  const ids = zone.entities.filter((e) => e.fact).map((e) => e.fact!.id);
  for (const boss of zone.bosses ?? []) ids.push(...boss.facts.map((f) => f.id));
  return ids;
}

export const TOTAL_FACTS = allFacts().length;

export const YOUTUBE_VIDEOS = [
  { id: "N2H1lwyzdag", title: "Why Do Computers Use Binary? S1E1" },
  { id: "ShJ1CMdOqxU", title: "How Do Machines Talk?" },
  { id: "Hzg2i__ohZg", title: "How Computers Learned to Remember and Talk" },
  { id: "qwi5wcTXYVU", title: "Hello World!" },
];

export const LINKS = [
  { label: "Resume", value: "sunnygupta.in", href: "https://sunnygupta.in" },
  { label: "LinkedIn", value: "in/sunnykgupta", href: "https://www.linkedin.com/in/sunnykgupta" },
  { label: "X", value: "@sunnykgupta", href: "https://x.com/sunnykgupta" },
  { label: "Instagram", value: "@icodestartups", href: "https://instagram.com/icodestartups" },
  { label: "YouTube", value: "From First Principles", href: "https://www.youtube.com/sunnykgupta" },
  { label: "Peerlist", value: "peerlist.io/sunny", href: "https://peerlist.io/sunny" },
  { label: "Medium", value: "@sunnykgupta", href: "https://medium.com/@sunnykgupta" },
  { label: "Newsletter", value: "When?", href: "https://when.substack.com" },
  { label: "TeamShiksha", value: "team.shiksha", href: "https://team.shiksha" },
  { label: "Impromptu", value: "impromptu.community", href: "https://impromptu.community" },
  {
    label: "Stack Overflow",
    value: "1.4M people reached",
    href: "https://stackoverflow.com/users/1477051/sunny-r-gupta",
  },
];
