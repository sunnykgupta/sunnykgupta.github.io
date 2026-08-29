import { useEffect, useState } from "react";
import type { Boss } from "../../lib/game/content";
import type { Progress } from "../../hooks/use-progress";
import { PixelSprite } from "./pixel-sprite";
import { PixelBar, PixelButton } from "./ui";
import { audio } from "../../lib/game/audio";

const MAX_LOAD = 3;

export function BossFight({
  boss,
  progress,
  onExit,
}: {
  boss: Boss;
  progress: Progress;
  onExit: () => void;
}) {
  const [hp, setHp] = useState(boss.hp);
  const [load, setLoad] = useState(0);
  const [used, setUsed] = useState<string[]>([]);
  const [log, setLog] = useState<string[]>(boss.intro);
  const [shake, setShake] = useState(false);
  const [phase, setPhase] = useState<"fight" | "won" | "lost">("fight");

  useEffect(() => {
    if (phase !== "won") return;
    for (const fact of boss.facts) progress.discover(fact.id);
  }, [phase, boss.facts, progress]);

  const reset = () => {
    setHp(boss.hp);
    setLoad(0);
    setUsed([]);
    setLog(["Reset. The load is back to baseline. Try a different order of moves."]);
    setPhase("fight");
  };

  const play = (label: string) => {
    if (phase !== "fight") return;
    const move = boss.moves.find((m) => m.label === label);
    if (!move) return;

    if (used.includes(label)) {
      setLog([`"${label}" is already deployed. Doing it again does not help.`]);
      return;
    }
    setUsed((prev) => [...prev, label]);

    if (move.damage > 0) {
      const next = Math.max(0, hp - move.damage);
      setHp(next);
      audio.sfx("hit");
      setShake(true);
      window.setTimeout(() => setShake(false), 240);
      if (next === 0) {
        setLog([move.response, ...boss.victory]);
        audio.sfx("discover");
        setPhase("won");
      } else {
        setLog([move.response]);
      }
      return;
    }

    const nextLoad = load + 1;
    setLoad(nextLoad);
    if (nextLoad >= MAX_LOAD) {
      setLog([move.response, "Service degraded. Users are seeing spinners. Regroup and go again."]);
      audio.sfx("fail");
      setPhase("lost");
    } else {
      setLog([move.response]);
    }
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onExit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onExit]);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col justify-center px-4 py-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button type="button" onClick={onExit} className="pixel-btn px-3 py-2 text-[13px]">
          ◀ LEAVE
        </button>
        <div className="text-coral text-[13px]">BOSS FIGHT</div>
      </div>

      {/* boss card */}
      <div className="crt-scanlines pixel-frame relative overflow-hidden p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-coral text-[19px] sm:text-[24px]">{boss.name}</h2>
            <div className="text-muted font-body mt-1 text-[19px]">{boss.subtitle}</div>
          </div>
          <div className={`shrink-0 ${shake ? "anim-shake" : ""}`}>
            <PixelSprite sprite="servers" pixel={3} tint="#ff6e4d" />
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-1 flex justify-between text-[12px]">
              <span className="text-muted">SYSTEM PRESSURE</span>
              <span className="text-coral">
                {hp}/{boss.hp}
              </span>
            </div>
            <PixelBar value={hp} max={boss.hp} color="#ff6e4d" />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[12px]">
              <span className="text-muted">{boss.loadLabel.toUpperCase()}</span>
              <span className="text-gold">
                {load}/{MAX_LOAD}
              </span>
            </div>
            <PixelBar value={load} max={MAX_LOAD} color="#ffc94a" />
          </div>
        </div>

        {/* log */}
        <div className="mt-4 border-t-[3px] border-[#35275f] pt-3">
          {log.map((line, i) => (
            <p key={i} className="text-parchment font-body mb-2 text-[19px] leading-snug sm:text-[21px]">
              {line}
            </p>
          ))}
        </div>

        {phase === "won" && (
          <div className="anim-pop mt-3 border-[3px] border-[#7ee787] p-3">
            <div className="text-lime text-[14px]">★ BOSS CLEARED</div>
            {boss.facts.map((fact) => (
              <div key={fact.id} className="text-parchment font-body mt-1 text-[19px]">
                {fact.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* moves */}
      <div className="mt-4">
        {phase === "fight" ? (
          <>
            <div className="text-muted mb-2 text-[12px]">CHOOSE YOUR MOVE</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {boss.moves.map((move) => {
                const spent = used.includes(move.label);
                return (
                  <button
                    key={move.label}
                    type="button"
                    onClick={() => play(move.label)}
                    disabled={spent}
                    className="pixel-btn p-3 text-left disabled:opacity-40"
                  >
                    <div className="text-[13px] uppercase">
                      {spent ? "✓ " : "▸ "}
                      {move.label}
                    </div>
                    <div className="text-muted font-body mt-1 text-[18px] leading-tight">
                      {move.hint}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-wrap gap-2">
            {phase === "lost" && <PixelButton onClick={reset}>↺ Retry</PixelButton>}
            <PixelButton onClick={onExit} active>
              {phase === "won" ? "◀ Back to the tower" : "◀ Leave"}
            </PixelButton>
          </div>
        )}
      </div>
    </div>
  );
}
