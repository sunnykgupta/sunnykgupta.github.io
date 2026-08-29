import { LINKS } from "../../lib/game/content";
import type { Progress } from "../../hooks/use-progress";
import { PixelSprite } from "./pixel-sprite";
import { Panel, ProgressStrip } from "./ui";

export function SaveFile({
  progress,
  onClose,
}: {
  progress: Progress;
  onClose: () => void;
}) {
  return (
    <Panel title="SAVE FILE / PLAYER 1" onClose={onClose} wide>
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex shrink-0 flex-col items-center gap-3">
          <div className="border-[3px] border-[#35275f] bg-[#191233] p-3">
            <PixelSprite sprite="player" pixel={4} />
          </div>
          <div className="text-center">
            <div className="text-gold text-[16px]">SUNNY R GUPTA</div>
            <div className="text-muted font-body mt-1 text-[18px] leading-tight">
              Engineering Leader
              <br />
              Bengaluru, India
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-[12px]">
              <span className="text-muted">COMPLETION</span>
              <span className="text-lime">
                {progress.count}/{progress.total} · {progress.percent}%
              </span>
            </div>
            <ProgressStrip percent={progress.percent} color="#7ee787" />
          </div>

          <div className="text-parchment font-body mb-5 space-y-2 text-[19px] leading-snug">
            <p>
              I have built and scaled products for 14 years, across startups, Atlassian, and
              streaming at hundreds of millions of users.
            </p>
            <p className="text-muted">
              I learn from first principles, build in public, and lead teams that know why their
              work matters.
            </p>
          </div>

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
        </div>
      </div>
    </Panel>
  );
}
