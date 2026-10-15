import type { ReactNode } from "react";
import { Link } from "wouter";
import { DistrictArt } from "./art/district-art";
import type { DistrictKind, Project } from "../../lib/town/content";

export function ExternalLink({
  href,
  children,
  className = "text-link",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children} <span aria-hidden="true">↗</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function PageIntro({
  eyebrow,
  title,
  children,
  location,
  back = "/",
  backLabel = "Town",
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  location?: string;
  back?: string;
  backLabel?: string;
}) {
  return (
    <>
      <Link href={back} className="town-back">
        <span aria-hidden="true">← </span>
        {backLabel}
      </Link>
      <header className="page-intro">
        <div>
          <div className="pixel-label">{eyebrow}</div>
          <h1 tabIndex={-1}>{title}</h1>
          <div className="page-description">{children}</div>
        </div>
        {location && (
          <div className="location-stamp" aria-hidden="true">
            {location}
            <br />
            Sunny’s Town
          </div>
        )}
      </header>
    </>
  );
}

export function ArtPanel({ kind, label }: { kind: DistrictKind; label?: string }) {
  return (
    <div className="art-panel">
      <DistrictArt kind={kind} />
      {label && <span className="art-label">{label}</span>}
    </div>
  );
}

export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="tags" aria-label="Topics">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="content-card">
      <ArtPanel kind={project.art} label={project.format} />
      <div className="card-body">
        <div className="card-meta">
          {project.owner} / {project.topic}
        </div>
        <h2>{project.title}</h2>
        <p>{project.description}</p>
        <Tags items={project.tags} />
        <Link href={`/projects/${project.id}`} className="town-button">
          {project.action} <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="card-footer">
        <span>
          {project.communityId ? "Part of a bigger community" : "Also on the library shelves"}
        </span>
        <Link
          href={project.communityId ? `/communities/${project.communityId}` : "/writing"}
          className="text-link"
        >
          {project.communityId ? project.owner : "Writing & Videos"}{" "}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export function Filters<T extends string>({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  items: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="filters">
      <legend className="sr-only">{label}</legend>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          aria-pressed={item === value}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </fieldset>
  );
}

export function CrossLink({
  children,
  href,
  label,
}: {
  children: ReactNode;
  href: string;
  label: string;
}) {
  return (
    <div className="cross-link">
      <p>{children}</p>
      <Link href={href} className="text-link">
        {label} <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
