import { useEffect, useState } from "react";
import type { Entity } from "../../lib/game/content";
import { PixelSprite } from "./pixel-sprite";

type Props = {
  entity: Entity;
  lineIndex: number;
  isNewFact: boolean;
  onAdvance: () => void;
  onOpenPanel?: () => void;
};

/** Typewriter dialogue box, SNES bottom-of-screen style. */
export function DialogueBox({ entity, lineIndex, isNewFact, onAdvance, onOpenPanel }: Props) {
  const lines = entity.lines ?? [];
  const line = lines[lineIndex] ?? "";
  const [typed, setTyped] = useState("");
  const done = typed.length >= line.length;
  const isLast = lineIndex >= lines.length - 1;

  useEffect(() => {
    setTyped("");
    let i = 0;
    const timer = window.setInterval(() => {
      i += 2;
      setTyped(line.slice(0, i));
      if (i >= line.length) window.clearInterval(timer);
    }, 14);
    return () => window.clearInterval(timer);
  }, [line]);

  return (
    <div className="pixel-frame relative w-full p-4 sm:p-5">
      <div className="flex gap-4">
        <div className="hidden shrink-0 sm:block">
          <div className="border-[3px] border-[#0b0817] bg-[#191233] p-2">
            <PixelSprite sprite={entity.sprite} tint={entity.tint} pixel={2} />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          {entity.name && (
            <div className="text-gold mb-2 text-[14px] uppercase sm:text-[15px]">{entity.name}</div>
          )}
          <button
            type="button"
            onClick={() => (done ? onAdvance() : setTyped(line))}
            className="text-parchment block w-full cursor-pointer text-left font-body text-[19px] leading-[1.45] sm:text-[22px]"
          >
            <span className="block min-h-[4.5rem] sm:min-h-[5rem]">
              {typed}
              {!done && <span className="anim-blink">▌</span>}
            </span>
          </button>

          {done && isLast && entity.fact && (
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t-[3px] border-[#35275f] pt-3">
              <span className={`text-[13px] ${isNewFact ? "text-lime" : "text-muted"}`}>
                {isNewFact ? "★ NEW ENTRY" : "★ LOGGED"}
              </span>
              <span className="text-parchment font-body text-[18px]">{entity.fact.label}</span>
            </div>
          )}

          {done && isLast && entity.link && (
            <a
              href={entity.link.href}
              target="_blank"
              rel="noreferrer noopener"
              onClick={(event) => event.stopPropagation()}
              className="text-cyan font-body mt-3 inline-block text-[18px] underline decoration-dotted"
            >
              → {entity.link.label}
            </a>
          )}

          {done && isLast && entity.panel && onOpenPanel && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpenPanel();
              }}
              className="pixel-btn pixel-btn-active mt-3 block px-3 py-2 text-[13px]"
            >
              ▶ Watch the videos
            </button>
          )}

          <div className="text-muted mt-3 text-right text-[12px]">
            {done ? (isLast ? "[A] CLOSE ▾" : "[A] NEXT ▸") : "..."}
          </div>
        </div>
      </div>
    </div>
  );
}
