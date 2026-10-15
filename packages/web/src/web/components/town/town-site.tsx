import { useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { DESTINATIONS, PROJECTS, COMMUNITIES } from "../../lib/town/content";
import {
  AboutPage,
  CommunitiesPage,
  CommunityPage,
  HomePage,
  NotFoundPage,
  ProjectPage,
  ProjectsPage,
  WritingPage,
} from "./pages";
import "./town.css";

function pageDetails(path: string) {
  if (path === "/") return { title: "Sunny’s Town", chapter: "home" };
  if (path === "/communities") return { title: "Communities", chapter: "communities" };
  if (path === "/projects") return { title: "Projects", chapter: "projects" };
  if (path === "/writing") return { title: "Writing & Videos", chapter: "writing" };
  if (path === "/about") return { title: "About Sunny", chapter: "about" };
  const community = COMMUNITIES.find((item) => path === `/communities/${item.id}`);
  if (community) return { title: community.title, chapter: "communities" };
  const project = PROJECTS.find((item) => path === `/projects/${item.id}`);
  if (project) return { title: project.title, chapter: "projects" };
  return { title: "Page not found", chapter: "home" };
}

function TownPage({ path }: { path: string }) {
  switch (path) {
    case "/":
      return <HomePage />;
    case "/communities":
      return <CommunitiesPage />;
    case "/projects":
      return <ProjectsPage />;
    case "/writing":
      return <WritingPage />;
    case "/about":
      return <AboutPage />;
    default: {
      const community = /^\/communities\/([^/]+)$/.exec(path);
      if (community) return <CommunityPage id={community[1]} />;
      const project = /^\/projects\/([^/]+)$/.exec(path);
      return project ? <ProjectPage id={project[1]} /> : <NotFoundPage />;
    }
  }
}

export default function TownSite() {
  const [location] = useLocation();
  const path = location.replace(/\/+$/, "") || "/";
  const { title, chapter } = pageDetails(path);
  const main = useRef<HTMLElement>(null);
  const previousPath = useRef(path);
  useEffect(() => {
    document.title = path === "/" ? "Sunny’s Town | Sunny R Gupta" : `${title} | Sunny’s Town`;
    if (previousPath.current !== path) {
      window.scrollTo({ top: 0, behavior: "instant" });
      main.current?.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
      previousPath.current = path;
    }
  }, [path, title]);
  return (
    <div className="town-site" data-chapter={chapter}>
      <a className="town-skip" href="#town-content">
        Skip to content
      </a>
      <div className="town-shell">
        <header className="site-header">
          <Link href="/" className="town-brand" aria-label="Sunny’s Town home">
            <span className="town-mark" aria-hidden="true" />
            Sunny’s Town
          </Link>
          <nav className="site-nav" aria-label="Main navigation">
            {DESTINATIONS.map((item) => (
              <Link
                href={item.path}
                key={item.id}
                aria-current={chapter === item.id ? "page" : undefined}
              >
                {item.id === "about" ? "About" : item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main id="town-content" className="town-content" ref={main} tabIndex={-1}>
          <TownPage path={path} />
        </main>
        <footer className="site-footer">
          <span>A little corner of my internet.</span>
          <span>Sunny R Gupta · Mumbai</span>
          <Link href="/about">
            About & contact <span aria-hidden="true">↗</span>
          </Link>
        </footer>
      </div>
    </div>
  );
}
