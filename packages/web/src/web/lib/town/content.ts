/** One catalogue, shared by the town, communities, projects, and library. */
export type CommunityId = "impromptu" | "teamshiksha";
export type ProjectId = "system-design-sessions" | "from-first-principles";
export type DistrictKind = "cafe" | "school" | "systems" | "studio" | "letters";

export const DESTINATIONS = [
  {
    id: "communities",
    label: "Communities",
    path: "/communities",
    hint: "Impromptu · TeamShiksha",
  },
  { id: "projects", label: "Projects", path: "/projects", hint: "The workshop" },
  { id: "writing", label: "Writing & Videos", path: "/writing", hint: "The library" },
  { id: "about", label: "About Sunny", path: "/about", hint: "Home, work & hello" },
] as const;

export const COMMUNITIES: {
  id: CommunityId;
  title: string;
  art: DistrictKind;
  eyebrow: string;
  description: string;
  introduction: string;
  tags: string[];
  url: string;
  action: string;
  aside: string;
}[] = [
  {
    id: "impromptu",
    title: "Impromptu Communities",
    art: "cafe",
    eyebrow: "People · Conversations · Meetups",
    description:
      "For spontaneous plans and conversations that go somewhere. Find a gathering, meet someone new, and see what happens next.",
    introduction:
      "I pick a café in Bengaluru and share a location and a time, often at the last minute. Techies, designers, and product folks turn up with laptops, books, or something they want to work through. There is no stage and there are no slides. Just people making time for a conversation.",
    tags: ["Meetups", "Conversations", "Connections"],
    url: "https://impromptu.community",
    action: "Visit Impromptu",
    aside: "Pull up a chair.",
  },
  {
    id: "teamshiksha",
    title: "TeamShiksha",
    art: "school",
    eyebrow: "Engineering · Learning · Building",
    description:
      "For engineers who want to go deeper than a tutorial. Learn how systems work, explore projects, and share what you discover.",
    introduction:
      "TeamShiksha is the community I run for engineers who want to understand how things work. We learn together, build projects, and ask the questions that tutorials leave out. Teaching in public helps me too. Nothing finds a gap in my understanding faster than a room asking why.",
    tags: ["System design", "Projects", "Shared learning"],
    url: "https://team.shiksha",
    action: "Visit TeamShiksha",
    aside: "A place to ask “why?”",
  },
];

export type Project = {
  id: ProjectId;
  title: string;
  art: DistrictKind;
  format: string;
  communityId?: CommunityId;
  owner: string;
  topic: string;
  description: string;
  detail: string;
  tags: string[];
  action: string;
  url: string;
  externalAction: string;
};
export const PROJECTS: Project[] = [
  {
    id: "system-design-sessions",
    title: "System Design Sessions",
    art: "systems",
    format: "Learning series",
    communityId: "teamshiksha",
    owner: "TeamShiksha",
    topic: "System design",
    description:
      "Understand the decisions behind the diagrams. Explore networking, APIs, data modelling, caching, and how systems fit together.",
    detail:
      "The sessions have covered networking, APIs, data modelling, indexing, caching, sharding, consistent hashing, and CAP. We start with the fundamentals and work through the choices and tradeoffs behind a system.",
    tags: ["Engineering", "Learning together"],
    action: "Explore the sessions",
    url: "https://team.shiksha",
    externalAction: "Find sessions at TeamShiksha",
  },
  {
    id: "from-first-principles",
    title: "From First Principles",
    art: "studio",
    format: "Video series",
    owner: "Independent",
    topic: "Computers & software",
    description:
      "Take an idea apart until the assumptions fall away. Then build the understanding back up, one explanation at a time.",
    detail:
      "Computers and Software is a video series about understanding the fundamentals. Why binary? What is a bit? How do the pieces fit together? Start with a question, then work from the ground up.",
    tags: ["Video", "Fundamentals"],
    action: "Explore the series",
    url: "https://www.youtube.com/sunnykgupta",
    externalAction: "Watch on YouTube",
  },
];

export const PUBLICATIONS = [
  {
    name: "Medium",
    format: "Essays",
    heading: "More room for an idea.",
    description: "Browse my essays and longer pieces on Medium.",
    url: "https://medium.com/@sunnykgupta",
    action: "Read on Medium",
  },
  {
    name: "Peerlist",
    format: "Writing",
    heading: "Notes from a builder.",
    description: "Find my writing and profile on Peerlist.",
    url: "https://peerlist.io/sunny",
    action: "Explore Peerlist",
  },
];
export const NEWSLETTER = { name: "When?", url: "https://when.substack.com" };
export const GATHERINGS_URL = "https://luma.com/impromptu";
