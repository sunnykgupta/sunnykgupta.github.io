import { allFacts } from "../../lib/game/content";
import type { Progress } from "../../hooks/use-progress";
import { Panel, PixelButton, ProgressStrip } from "./ui";

export function AchievementsPanel({
  progress,
  onClose,
}: {
  progress: Progress;
  onClose: () => void;
}) {
  const facts = allFacts();
  const grouped = facts.reduce<Record<string, typeof facts>>((acc, fact) => {
    acc[fact.zoneTitle] = acc[fact.zoneTitle] ?? [];
    acc[fact.zoneTitle].push(fact);
    return acc;
  }, {});

  return (
    <Panel
      title={`DISCOVERY LOG ${progress.count}/${progress.total}`}
      onClose={onClose}
      wide
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-muted font-body text-[18px]">
            {progress.count === progress.total
              ? "Everything found. You know the whole story now."
              : `${progress.total - progress.count} still hidden in the zones.`}
          </span>
          <PixelButton onClick={progress.reset}>↺ Wipe save</PixelButton>
        </div>
      }
    >
      <div className="mb-5">
        <ProgressStrip percent={progress.percent} color="#7ee787" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {Object.entries(grouped).map(([zoneTitle, items]) => (
          <div key={zoneTitle}>
            <h3 className="text-gold mb-2 text-[14px]">{zoneTitle}</h3>
            <ul className="space-y-1">
              {items.map((fact) => {
                const found = progress.has(fact.id);
                return (
                  <li
                    key={fact.id}
                    className={`flex gap-2 font-body text-[19px] leading-snug ${
                      found ? "text-parchment" : "text-muted/60"
                    }`}
                  >
                    <span className={found ? "text-lime" : "text-muted/50"}>
                      {found ? "★" : "☆"}
                    </span>
                    <span>{found ? fact.label : "???"}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Panel>
  );
}
