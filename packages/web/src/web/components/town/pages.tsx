import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  COMMUNITIES,
  DESTINATIONS,
  GATHERINGS_URL,
  NEWSLETTER,
  PROJECTS,
  PUBLICATIONS,
} from "../../lib/town/content";
import { LINKS, YOUTUBE_VIDEOS } from "../../lib/game/content";
import { PRINCIPLES, TIMELINE } from "../../lib/town/profile";
import { TownArt } from "./art/town-art";
import { ArtPanel, CrossLink, ExternalLink, Filters, PageIntro, ProjectCard, Tags } from "./ui";

function useTownPreference(key: string, fallback: boolean) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(`sunny-town:${key}`);
      return saved === null ? fallback : saved === "true";
    } catch {
      return fallback;
    }
  });
  function update(next: boolean) {
    setValue(next);
    try {
      localStorage.setItem(`sunny-town:${key}`, String(next));
    } catch {
      /* Browsing works when storage is unavailable. */
    }
  }
  return [value, update] as const;
}

export function HomePage() {
  const [warmLights, setWarmLights] = useTownPreference("warm-lights", false);
  const [lively, setLively] = useTownPreference("motion", true);
  const [catGreeted, setCatGreeted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return (
    <>
      <header className="home-intro">
        <div>
          <div className="pixel-label">Welcome to my corner of the internet</div>
          <h1 tabIndex={-1}>A small town. A lot going on.</h1>
          <p>
            I’m Sunny. I build things, bring people together,
            <br className="desktop-break" /> and share what I learn along the way.
          </p>
        </div>
        <div className="home-stamp" aria-hidden="true">
          Built on curiosity.
          <br />
          Fuelled by conversation.
          <br />
          Mumbai, India ↗
        </div>
      </header>
      <section className="town-world" aria-label="Explore Sunny’s Town">
        <div className="town-hud">
          <span className="pixel-label">✦ Sunny’s Town / The commons</span>
          <div className="town-controls">
            <button
              type="button"
              aria-pressed={warmLights}
              onClick={() => setWarmLights(!warmLights)}
            >
              Window glow {warmLights ? "on" : "off"}
            </button>
            <button
              type="button"
              disabled={reducedMotion}
              aria-pressed={lively && !reducedMotion}
              onClick={() => setLively(!lively)}
            >
              {reducedMotion ? "Motion reduced" : lively ? "Pause town" : "Wake town"}
            </button>
          </div>
        </div>
        <div className="town-map">
          <TownArt
            lively={lively && !reducedMotion}
            warmLights={warmLights}
            catGreeted={catGreeted}
          />
          <nav className="map-destinations" aria-label="Town destinations">
            {DESTINATIONS.map((place, index) => (
              <Link
                key={place.id}
                href={place.path}
                className={`map-destination destination-${place.id}`}
              >
                <span className="destination-label">
                  <span className="destination-number" aria-hidden="true">
                    {index + 1}.{" "}
                  </span>
                  {place.label} <span aria-hidden="true">↗</span>
                </span>
                <small>{place.hint}</small>
              </Link>
            ))}
          </nav>
          <button
            className="town-cat"
            type="button"
            aria-label="Say hello to the town cat"
            aria-pressed={catGreeted}
            onClick={() => setCatGreeted(!catGreeted)}
          >
            <span>pspsps…</span>
          </button>
        </div>
        <div className="town-dialogue">
          <strong>{catGreeted ? "Town cat" : "Sunny"}</strong>
          <p aria-live="polite">
            {catGreeted
              ? "“I supervise all the projects. Mostly from this sunny patch.”"
              : "Make yourself at home. Click a building to explore, or use the menu above."}
          </p>
        </div>
      </section>
      <div className="section-heading">
        <h2>The town noticeboard</h2>
        <span>A few places to start</span>
      </div>
      <div className="noticeboard">
        <Link href="/communities/impromptu" className="notice">
          <span className="card-meta">The café ↗</span>
          <h3>Meet the Impromptu community</h3>
          <p>Good conversations start with showing up.</p>
        </Link>
        <Link href="/projects/system-design-sessions" className="notice">
          <span className="card-meta">The workshop ↗</span>
          <h3>System Design Sessions</h3>
          <p>Get into the how and why with TeamShiksha.</p>
        </Link>
        <Link href="/writing" className="notice">
          <span className="card-meta">The library ↗</span>
          <h3>A letter from Sunny: When?</h3>
          <p>Find the newsletter and more things to read.</p>
        </Link>
      </div>
    </>
  );
}

export function CommunitiesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Communities / The square"
        title="Good things happen together."
        location="The community square"
      >
        <p>
          Places to meet people, exchange ideas, and build something together. Pick the conversation
          you want to be part of.
        </p>
      </PageIntro>
      <div className="card-grid">
        {COMMUNITIES.map((community) => (
          <article key={community.id} className="content-card">
            <ArtPanel kind={community.art} label={community.title} />
            <div className="card-body">
              <div className="card-meta">{community.eyebrow}</div>
              <h2>{community.title}</h2>
              <p>{community.description}</p>
              <Tags items={community.tags} />
              <Link href={`/communities/${community.id}`} className="town-button">
                Explore {community.id === "impromptu" ? "Impromptu" : "TeamShiksha"}{" "}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="card-footer">
              <span>{community.aside}</span>
              {community.id === "impromptu" ? (
                <ExternalLink href={GATHERINGS_URL}>Browse gatherings</ExternalLink>
              ) : (
                <Link href="/projects/system-design-sessions" className="text-link">
                  Explore the sessions <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
      <CrossLink href="/projects" label="Step into the workshop">
        Curious about what’s being built across the town?
      </CrossLink>
    </>
  );
}

export function CommunityPage({ id }: { id: string }) {
  const community = COMMUNITIES.find((item) => item.id === id);
  if (!community) return <NotFoundPage />;
  const projects = PROJECTS.filter((project) => project.communityId === community.id);
  return (
    <>
      <PageIntro
        back="/communities"
        backLabel="Communities"
        eyebrow={`Communities / ${community.title}`}
        title={
          community.id === "impromptu"
            ? "Good things happen when we meet."
            : "Learn it. Build it. Explain it."
        }
      >
        <p>{community.description}</p>
      </PageIntro>
      <div className="detail-grid">
        <div>
          <article className="content-card">
            <ArtPanel kind={community.art} label={community.title} />
            <div className="card-body">
              <h2>{community.title}</h2>
              <p>{community.introduction}</p>
              <Tags items={community.tags} />
              {community.id === "impromptu" ? (
                <ExternalLink href={GATHERINGS_URL} className="town-button">
                  Browse gatherings
                </ExternalLink>
              ) : (
                <ExternalLink href={community.url} className="town-button">
                  Join the learning at TeamShiksha
                </ExternalLink>
              )}
            </div>
          </article>
        </div>
        <aside className="town-aside">
          <div className="card-meta">
            {community.id === "impromptu" ? "Pull up a chair" : "Keep learning together"}
          </div>
          <h2>{community.aside}</h2>
          <p>
            {community.id === "impromptu"
              ? "See the community’s home for ways to take part. Find upcoming gatherings on our event calendar."
              : "Find more community projects, activities, and ways to take part at TeamShiksha."}
          </p>
          <ExternalLink href={community.url} className="town-button secondary">
            {community.action}
          </ExternalLink>
        </aside>
      </div>
      {projects.length > 0 && (
        <section className="related-projects">
          <div className="section-heading">
            <h2>Projects & series</h2>
            <Link href="/projects" className="text-link">
              All projects <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="card-grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}
      <CrossLink href="/communities" label="Back to the square">
        There’s more than one way to find your people.
      </CrossLink>
    </>
  );
}

const projectFilters = ["All", "TeamShiksha", "Independent"] as const;
export function ProjectsPage() {
  const [filter, setFilter] = useState<(typeof projectFilters)[number]>("All");
  const projects = PROJECTS.filter((project) => filter === "All" || project.owner === filter);
  return (
    <>
      <PageIntro
        eyebrow="Projects / The workshop"
        title="Ideas, with their sleeves rolled up."
        location="The workshop"
      >
        <p>
          Projects and learning series from across my world. Follow an interest, or see what’s
          happening within a community.
        </p>
      </PageIntro>
      <div className="collection-toolbar">
        <Filters
          label="Filter projects by community"
          items={projectFilters}
          value={filter}
          onChange={setFilter}
        />
        <output className="result-count">{projects.length} series</output>
      </div>
      <div className="card-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <CrossLink href="/writing" label="Browse the library">
        Some projects start as conversations. Some turn into things worth sharing.
      </CrossLink>
    </>
  );
}

export function ProjectPage({ id }: { id: string }) {
  const project = PROJECTS.find((item) => item.id === id);
  if (!project) return <NotFoundPage />;
  const community = COMMUNITIES.find((item) => item.id === project.communityId);
  return (
    <>
      <PageIntro
        back="/projects"
        backLabel="Projects"
        eyebrow={`The workshop / ${project.format}`}
        title={project.title}
      >
        <p>{project.description}</p>
      </PageIntro>
      <div className="detail-grid">
        <article className="content-card">
          <ArtPanel kind={project.art} label={project.format} />
          <div className="card-body">
            <div className="card-meta">
              {project.owner} / {project.topic}
            </div>
            <h2>{community ? "Start with the fundamentals." : "Start with “why?”"}</h2>
            <p>{project.detail}</p>
            <Tags items={project.tags} />
            <ExternalLink href={project.url} className="town-button">
              {project.externalAction}
            </ExternalLink>
          </div>
        </article>
        <aside className="town-aside">
          <div className="card-meta">
            {community ? `Part of ${community.title}` : "From the library"}
          </div>
          <h2>{community ? "Learn with other engineers." : "Keep following the idea."}</h2>
          <p>
            {community
              ? "Explore the community behind the sessions and find more ways to learn and build together."
              : "Find the video series alongside essays and the newsletter in Writing & Videos."}
          </p>
          <Link
            href={community ? `/communities/${community.id}` : "/writing"}
            className="town-button secondary"
          >
            {community ? "Explore the community" : "Explore the library"}{" "}
            <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </div>
      {project.id === "from-first-principles" && (
        <section className="video-list">
          <div className="section-heading">
            <h2>Computers & Software</h2>
            <span>From the series</span>
          </div>
          <ul>
            {YOUTUBE_VIDEOS.map((video) => (
              <li key={video.id}>
                <ExternalLink href={`https://www.youtube.com/watch?v=${video.id}`}>
                  {video.title}
                </ExternalLink>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

const writingFilters = ["All", "Essays", "Newsletter", "Video"] as const;
export function WritingPage() {
  const [filter, setFilter] = useState<(typeof writingFilters)[number]>("All");
  const show = (kind: (typeof writingFilters)[number]) => filter === "All" || filter === kind;
  return (
    <>
      <PageIntro
        eyebrow="Writing & Videos / The library"
        title="Follow an idea. See where it goes."
        location="The library"
      >
        <p>
          Essays, newsletters, and explanations from across the places I publish. One library, with
          a few different doors.
        </p>
      </PageIntro>
      <div className="collection-toolbar">
        <Filters
          label="Filter the library by format"
          items={writingFilters}
          value={filter}
          onChange={setFilter}
        />
        <output className="sr-only">
          Showing {filter === "All" ? "all formats" : filter.toLowerCase()}
        </output>
      </div>
      {show("Newsletter") && (
        <article className="newsletter-feature">
          <div className="card-body">
            <div className="card-meta">Newsletter / Substack</div>
            <h2>{NEWSLETTER.name}</h2>
            <p>
              A letter from my corner of the internet. Read the newsletter and browse the archive on
              Substack.
            </p>
            <ExternalLink href={NEWSLETTER.url} className="town-button">
              Read When?
            </ExternalLink>
          </div>
          <ArtPanel kind="letters" />
        </article>
      )}
      {show("Essays") && (
        <section>
          <div className="section-heading library-heading">
            <h2>Writing across the web</h2>
            <span>Pick a publishing home</span>
          </div>
          <div className="publication-grid">
            {PUBLICATIONS.map((publication) => (
              <article key={publication.name} className="publication">
                <div className="card-meta">
                  {publication.name} / {publication.format}
                </div>
                <h2>{publication.heading}</h2>
                <p>{publication.description}</p>
                <ExternalLink href={publication.url}>{publication.action}</ExternalLink>
              </article>
            ))}
          </div>
        </section>
      )}
      {show("Video") && (
        <article className="video-feature">
          <ArtPanel kind="studio" />
          <div className="card-body">
            <div className="card-meta">YouTube / Video series</div>
            <h2>From First Principles</h2>
            <p>Computers and software, explained from the ground up.</p>
            <Link href="/projects/from-first-principles" className="text-link">
              Explore the video series <span aria-hidden="true">→</span>
            </Link>
          </div>
        </article>
      )}
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="At home with Sunny"
        title="Builder. Community host. Always a student."
        location="Mumbai, India"
      >
        <p>
          I’m Sunny R Gupta. I work in engineering, run communities, and share what I learn along
          the way.
        </p>
      </PageIntro>
      <div className="detail-grid">
        <section className="about-intro">
          <h2>It started with a question.</h2>
          <p>
            I started coding at 12. I liked games, but I was more curious about how the sprite knew
            where to move. That question turned into a career.
          </p>
          <p>
            My degree is in Electronics and Telecommunication, not Computer Science. I learned the
            fundamentals by building things, taking them apart, and trying again.
          </p>
          <p>
            Since then I’ve worked across startups, frontend, backend, and distributed systems.
            Outside work, I run Impromptu Communities and TeamShiksha, write, teach, and keep
            building.
          </p>
          <Link href="/communities" className="text-link">
            Explore my communities <span aria-hidden="true">→</span>
          </Link>
        </section>
        <aside className="town-aside">
          <div className="card-meta">Say hello</div>
          <h2>Let’s connect.</h2>
          <p>For my professional background or a conversation about work.</p>
          <div className="aside-links">
            <ExternalLink href="https://www.linkedin.com/in/sunnykgupta">LinkedIn</ExternalLink>
            <ExternalLink href="https://sunnygupta.in">Résumé</ExternalLink>
          </div>
        </aside>
      </div>
      <section className="about-section">
        <div className="section-heading">
          <h2>How I work</h2>
        </div>
        <div className="principle-grid">
          {PRINCIPLES.map((principle) => (
            <article key={principle.title}>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="about-section">
        <div className="section-heading">
          <h2>The journey so far</h2>
        </div>
        <ol className="career-timeline">
          {[...TIMELINE].reverse().map((item) => (
            <li key={item.when}>
              <div className="career-date">{item.when}</div>
              <div>
                <h3>{item.what}</h3>
                <p>{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="education">
          Certification Programme in AI, IIM Bengaluru (2022). Electronics and Telecommunications, D
          Y Patil College of Engineering, Pune University (2012).
        </p>
      </section>
      <section className="about-section">
        <div className="section-heading">
          <h2>Find me around the internet</h2>
        </div>
        <div className="social-links">
          {LINKS.map((link) => (
            <ExternalLink key={link.label} href={link.href}>
              {link.label}
            </ExternalLink>
          ))}
        </div>
      </section>
      <aside className="play-story">
        <div>
          <div className="card-meta">An optional side quest</div>
          <h2>Play my story.</h2>
          <p>
            The original Sunny Quest: seven zones, conversations, and a few engineering boss fights.
          </p>
        </div>
        <Link href="/play" className="town-button">
          Enter Sunny Quest <span aria-hidden="true">→</span>
        </Link>
      </aside>
    </>
  );
}

export function NotFoundPage() {
  return (
    <>
      <PageIntro eyebrow="A little off the map" title="This street isn’t on the map.">
        <p>That page may have moved. The town square is a good place to start again.</p>
      </PageIntro>
      <Link href="/" className="town-button">
        Back to Sunny’s Town <span aria-hidden="true">→</span>
      </Link>
    </>
  );
}
