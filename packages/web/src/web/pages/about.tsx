import { Link } from "wouter";
import { LINKS, YOUTUBE_VIDEOS } from "../lib/game/content";
import { PixelSprite } from "../components/game/pixel-sprite";

const TIMELINE = [
  {
    when: "2012 to 2013",
    what: "Tavisca Solutions · Software Developer",
    detail:
      "R&D unit. We rewrote a travel platform from scratch, moved a monolith to microservices and server-rendered pages to MVC. The app got faster, conversions went up, and revenue followed.",
  },
  {
    when: "2013 to 2014",
    what: "InBetween IT Services · Senior Software Developer",
    detail:
      "Media asset inventory management. I also built a plugin that let designers pull assets straight into Adobe InDesign.",
  },
  {
    when: "2014 to 2015",
    what: "Fab Inc / Hem.com · Senior Software Engineer",
    detail:
      "Founding developer on the Hem.com web portal, including an in-browser 3D furniture configurator with dynamic pricing. The company wound down in a PE exit.",
  },
  {
    when: "2015 to 2016",
    what: "Wooplr · Lead Web Engineer",
    detail:
      "B2C social commerce built for real Indian networks. High performance on low bandwidth, an in-house CMS, curator queues, and the dashboards the business ran on.",
  },
  {
    when: "2016 to 2017",
    what: "Flyoso · Founder and Developer",
    detail:
      "A travel meta-search for the best deals across flights and hotels. I built it, could not find product market fit, and shut it down. I learned more from that than from any course.",
  },
  {
    when: "2017 to 2018",
    what: "Reliance Jio (FIG) · Sr. Manager, Frontend and Apps",
    detail:
      "Built a UI widget library and an analytics SDK from scratch for the JioPhone. Apps on that framework shipped to hundreds of millions of devices.",
  },
  {
    when: "2018 to 2019",
    what: "ThoughtSpot · Member of Technical Staff, UI",
    detail:
      "Cross-platform GUI for charting and plotting BI data, plus a serious refactor of the user-facing enterprise dashboards.",
  },
  {
    when: "2019 to 2023",
    what: "Atlassian · Senior Engineer to Engineering Manager",
    detail:
      "Core platform work and feature leadership on next-gen JIRA Cloud. Later I was EM across KTLO, cloud migrations and engineering health, with three services, direct reports, SLOs and the on-call roster.",
  },
  {
    when: "2023 to 2026",
    what: "JioHotstar (prev. JioCinema) · Sr. Director",
    detail:
      "Led three verticals: Identity, Web and Dazzle (engagement). Two brand-scale migrations from Voot to JioCinema to JioHotstar, hundreds of millions of user records, 300M+ visitors a day, and live events at around 50M concurrent viewers.",
  },
];

const PRINCIPLES = [
  {
    title: "First principles, every time",
    body: "I strip a thing down until nothing is assumed, then rebuild it. Why binary? Why does a packet need a header? Why is cache invalidation hard? If I cannot answer that, I do not understand the thing yet.",
  },
  {
    title: "Build to keep learning",
    body: "I keep a rolling set of side projects so my hands stay on the keyboard even when the day job is people and strategy. If I stop building, I start guessing.",
  },
  {
    title: "Technology is the enabler, the business is the product",
    body: "Ship value in small pieces, often, without giving up quality, observability or reliability. Engineering excellence is not the opposite of speed. Badly run engineering is.",
  },
  {
    title: "Teams need impact, then a plan",
    body: "Everyone should know why their work matters to the user and to the business. Everyone should also have a growth plan across clear pillars: technical depth, product sense, ownership, communication and business context.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="pixel-btn px-3 py-2 text-[13px] uppercase no-underline">
          ◀ Play the game instead
        </Link>
        <span className="text-muted font-body text-[17px]">
          Plain version. No controls needed.
        </span>
      </div>

      <header className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="border-[3px] border-[#35275f] bg-[#191233] p-3">
          <PixelSprite sprite="player" pixel={4} />
        </div>
        <div>
          <h1 className="text-gold text-[26px] sm:text-[34px]">SUNNY R GUPTA</h1>
          <p className="text-muted font-body mt-2 text-[20px] leading-snug">
            Engineering leader · Bengaluru, India
          </p>
        </div>
      </header>

      <section className="mb-12">
        <p className="text-parchment font-body text-[21px] leading-relaxed sm:text-[23px]">
          I started coding at 12, when everyone around me my age was playing the games. I liked the
          games too. I was just more curious about how the sprite knew where to move. That question
          turned into a career.
        </p>
        <p className="text-muted font-body mt-4 text-[20px] leading-relaxed">
          My degree is in Electronics and Telecommunication, not Computer Science, so I had to go
          and earn the fundamentals myself. I started my career at startups, building things and
          breaking things in public. In those years I sat with founders on product and business
          decisions while most of my peers were still ramping up on technology. Both are useful. One
          of them changed how I work.
        </p>
        <p className="text-muted font-body mt-4 text-[20px] leading-relaxed">
          Since then I have built and operated systems across frontend, backend and distributed
          systems. A UI framework running on hundreds of millions of JioPhones. JIRA Cloud at
          Atlassian. Streaming platforms serving 300M+ visitors a day with live events at around 50
          million concurrent viewers.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-coral mb-5 text-[18px]">HOW I WORK</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((item) => (
            <div key={item.title} className="pixel-frame p-4">
              <h3 className="text-gold text-[15px] leading-relaxed">{item.title}</h3>
              <p className="text-parchment/90 font-body mt-2 text-[19px] leading-snug">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-coral mb-5 text-[18px]">CAREER</h2>
        <ol className="border-l-[3px] border-[#35275f] pl-5">
          {TIMELINE.slice()
            .reverse()
            .map((item) => (
              <li key={item.when} className="relative mb-7">
                <span className="absolute top-[8px] -left-[27px] block h-[9px] w-[9px] bg-[#ffc94a]" />
                <div className="text-muted text-[13px]">{item.when}</div>
                <div className="text-parchment mt-1 text-[16px] leading-snug">{item.what}</div>
                <p className="text-muted font-body mt-1 text-[19px] leading-snug">{item.detail}</p>
              </li>
            ))}
        </ol>
        <p className="text-muted font-body text-[18px] leading-snug">
          Also: Certification Programme in AI, IIM Bengaluru (2022). Degree in Electronics and
          Telecommunications, D Y Patil College of Engineering, Pune University (2012).
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-coral mb-5 text-[18px]">COMMUNITIES AND TEACHING</h2>
        <div className="space-y-4">
          <div className="pixel-frame p-4">
            <h3 className="text-gold text-[15px]">Impromptu Meetups</h3>
            <p className="text-parchment/90 font-body mt-2 text-[19px] leading-snug">
              I pick a cafe in Bengaluru and drop the location and a time, usually at the last
              minute. Techies, designers and product folks turn up with laptops, books, or the
              blocker they have been stuck on all week. People talk about personal growth, project
              blockers, and what is actually going on. There is no stage and there are no slides.
            </p>
            <a
              href="https://impromptu.community"
              target="_blank"
              rel="noreferrer noopener"
              className="text-cyan font-body mt-2 inline-block text-[19px] underline decoration-dotted"
            >
              impromptu.community
            </a>
          </div>
          <div className="pixel-frame p-4">
            <h3 className="text-gold text-[15px]">TeamShiksha and System Design Sessions</h3>
            <p className="text-parchment/90 font-body mt-2 text-[19px] leading-snug">
              A community for engineers who want to go deeper than tutorials. The System Design
              Sessions have covered networking, APIs, data modelling, indexing, caching, sharding,
              consistent hashing and CAP. Teaching in public is a selfish habit. Nothing finds a gap
              in my understanding faster than a room asking me why.
            </p>
            <a
              href="https://team.shiksha"
              target="_blank"
              rel="noreferrer noopener"
              className="text-cyan font-body mt-2 inline-block text-[19px] underline decoration-dotted"
            >
              team.shiksha
            </a>
          </div>
          <div className="pixel-frame p-4">
            <h3 className="text-gold text-[15px]">From First Principles (YouTube)</h3>
            <p className="text-parchment/90 font-body mt-2 text-[19px] leading-snug">
              I had been meaning to record videos for years. Season 1 is live: Computers and
              Software, from the ground up. The first video was not the hard part. Staying consistent
              is.
            </p>
            <ul className="mt-3 space-y-1">
              {YOUTUBE_VIDEOS.map((video) => (
                <li key={video.id}>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-cyan font-body text-[19px] underline decoration-dotted"
                  >
                    ▶ {video.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-coral mb-5 text-[18px]">FIND ME</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="pixel-btn flex items-baseline justify-between gap-2 px-3 py-2 no-underline"
            >
              <span className="text-[12px] uppercase">{link.label}</span>
              <span className="text-cyan font-body truncate text-[18px]">{link.value}</span>
            </a>
          ))}
        </div>
      </section>

      <footer className="border-t-[3px] border-[#35275f] pt-6 text-center">
        <Link
          to="/"
          className="pixel-btn pixel-btn-active inline-block px-4 py-3 text-[14px] uppercase no-underline"
        >
          ▶ Play Sunny Quest
        </Link>
      </footer>
    </div>
  );
}
