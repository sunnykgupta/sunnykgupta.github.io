import { ZONES } from "../../lib/game/content";
import type { Progress } from "../../hooks/use-progress";
import { PixelSprite } from "./pixel-sprite";
import { PixelButton, ProgressStrip } from "./ui";

export function HubScreen({
  progress,
  onEnterZone,
  onOpenSaves,
  onOpenLog,
  onAbout,
}: {
  progress: Progress;
  onEnterZone: (zoneId: string) => void;
  onOpenSaves: () => void;
  onOpenLog: () => void;
  onAbout: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-gold text-[20px] sm:text-[26px]">SELECT A ZONE</h1>
          <p className="text-muted font-body mt-2 text-[19px] sm:text-[21px]">
            Seven cartridges. Walk in, talk to everything, and come out knowing how I got here.
          </p>
        </div>
        <div className="min-w-[190px]">
          <div className="mb-2 flex items-baseline justify-between gap-3 text-[13px]">
            <span className="text-muted">DISCOVERED</span>
            <span className="text-lime">
              {progress.count}/{progress.total}
            </span>
          </div>
          <ProgressStrip percent={progress.percent} color="#7ee787" />
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ZONES.map((zone, index) => {
          const counts = progress.zoneCounts(zone.id);
          const percent = progress.zonePercent(zone.id);
          const complete = counts.found === counts.total;
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => onEnterZone(zone.id)}
              className="pixel-btn group flex flex-col gap-3 p-4 text-left"
            >
              <div className="flex items-start gap-3">
                <PixelSprite sprite="cartridge" pixel={2} tint={zone.cartridgeTint} />
                <div className="min-w-0 flex-1">
                  <div className="text-muted text-[12px]">
                    ZONE {String(index + 1).padStart(2, "0")} · {zone.era}
                  </div>
                  <div
                    className="mt-1 truncate text-[15px] uppercase"
                    style={{ color: zone.cartridgeTint }}
                  >
                    {zone.title}
                  </div>
                  <div className="text-muted font-body mt-1 text-[17px] leading-tight">{zone.subtitle}</div>
                </div>
                {complete && <span className="text-lime text-[14px]">★</span>}
              </div>

              <p className="text-parchment/90 min-h-[3.4rem] font-body text-[19px] leading-snug">
                {zone.blurb}
              </p>

              <div>
                <div className="mb-1 flex justify-between text-[12px]">
                  <span className="text-muted">
                    {counts.found}/{counts.total} FOUND
                  </span>
                  <span style={{ color: zone.cartridgeTint }}>{percent}%</span>
                </div>
                <ProgressStrip percent={percent} color={zone.cartridgeTint} />
              </div>
            </button>
          );
        })}

        <div className="pixel-frame flex flex-col justify-between gap-3 p-4">
          <div>
            <div className="text-muted text-[12px]">MENU</div>
            <div className="text-cyan mt-1 text-[15px] uppercase">Player Card</div>
            <p className="text-parchment/90 font-body mt-2 text-[19px] leading-snug">
              Links, resume and socials in one place.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <PixelButton onClick={onOpenSaves}>💾 Save File / Links</PixelButton>
            <PixelButton onClick={onOpenLog}>★ Discovery Log</PixelButton>
            <PixelButton onClick={onAbout}>Skip to plain about page</PixelButton>
          </div>
        </div>
      </div>

      <p className="text-muted/70 mt-8 text-center text-[12px] leading-relaxed">
        PROGRESS SAVES TO THIS BROWSER · BENGALURU, INDIA
      </p>
    </div>
  );
}
