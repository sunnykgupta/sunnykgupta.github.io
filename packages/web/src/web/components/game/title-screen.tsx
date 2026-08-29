import { useCallback, useEffect } from "react";
import { PixelSprite } from "./pixel-sprite";
import { PixelButton } from "./ui";
import { audio } from "../../lib/game/audio";

export function TitleScreen({
  onStart: rawStart,
  onAbout,
  savedCount,
  total,
}: {
  onStart: () => void;
  onAbout: () => void;
  savedCount: number;
  total: number;
}) {
  const onStart = useCallback(() => {
    audio.sfx("select");
    rawStart();
  }, [rawStart]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (["Enter", " ", "e", "E"].includes(event.key)) {
        event.preventDefault();
        onStart();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onStart]);

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 py-12">
      {/* starfield */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        {Array.from({ length: 44 }).map((_, i) => (
          <span
            key={i}
            className="absolute block h-[3px] w-[3px] bg-[#f4ecff]"
            style={{
              left: `${(i * 37 + 11) % 100}%`,
              top: `${(i * 61 + 7) % 100}%`,
              animation: `twinkle ${1.5 + (i % 5) * 0.6}s steps(2, end) infinite`,
              animationDelay: `${(i % 7) * 0.2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        <div className="text-muted mb-6 text-[13px] tracking-[0.3em]">SUNNY R GUPTA PRESENTS</div>

        <h1 className="text-gold font-title text-[30px] leading-[1.4] sm:text-[52px]">
          SUNNY
          <br />
          <span className="text-coral">QUEST</span>
        </h1>

        <p className="text-muted font-body mt-5 max-w-md text-[20px] leading-snug sm:text-[23px]">
          A 16-bit adventure through one engineer's career. Walk the rooms, talk to everything, beat
          the scale bosses, and find out how I work.
        </p>

        <div className="anim-bob mt-8">
          <PixelSprite sprite="player" pixel={5} />
        </div>

        <div className="mt-8 flex w-full flex-col items-center gap-3">
          <PixelButton onClick={onStart} active className="w-full max-w-xs animate-pulse">
            ▶ Press Start
          </PixelButton>
          <PixelButton onClick={onAbout} className="w-full max-w-xs">
            Skip the game, just read about me
          </PixelButton>
        </div>

        <div className="text-muted font-body mt-8 text-[18px]">
          {savedCount > 0 ? (
            <>
              Save file found. <span className="text-lime">{savedCount}</span>/{total} discovered.
            </>
          ) : (
            <>{total} things to discover. Progress saves on its own.</>
          )}
        </div>

        <div className="text-muted/70 mt-6 text-[12px] leading-relaxed">
          ARROWS / WASD MOVE · [SPACE] TALK · [ESC] BACK
        </div>
      </div>
    </div>
  );
}
