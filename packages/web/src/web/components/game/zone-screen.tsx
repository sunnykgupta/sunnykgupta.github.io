import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MAP_H,
  MAP_W,
  SOLID_TILES,
  TILE,
  type Entity,
  type Vec,
  type Zone,
} from "../../lib/game/content";
import type { Progress } from "../../hooks/use-progress";
import { useStageScale } from "../../hooks/use-stage-scale";
import { DialogueBox } from "./dialogue-box";
import { PixelSprite } from "./pixel-sprite";
import { ProgressStrip } from "./ui";
import { audio } from "../../lib/game/audio";

type Facing = "up" | "down" | "left" | "right";

const STAGE_W = MAP_W * TILE;
const STAGE_H = MAP_H * TILE;
const STEP_MS = 110;

export function ZoneScreen({
  zone,
  progress,
  onExit,
  onStartBoss,
  onOpenYouTube,
}: {
  zone: Zone;
  progress: Progress;
  onExit: () => void;
  onStartBoss: (bossId: string) => void;
  onOpenYouTube: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const scale = useStageScale(stageRef, STAGE_W, STAGE_H);

  const [pos, setPos] = useState<Vec>(zone.spawn);
  const [facing, setFacing] = useState<Facing>("up");
  const [active, setActive] = useState<{ entity: Entity; line: number; isNew: boolean } | null>(
    null,
  );
  const [toast, setToast] = useState<string | null>(null);
  const lastStep = useRef(0);

  const solidAt = useMemo(() => {
    const set = new Set<string>();
    zone.map.forEach((row, y) => {
      row.split("").forEach((tile, x) => {
        if (SOLID_TILES.has(tile)) set.add(`${x},${y}`);
      });
    });
    for (const entity of zone.entities) {
      if (entity.solid !== false) set.add(`${entity.x},${entity.y}`);
    }
    return set;
  }, [zone]);

  const interactives = useMemo(
    () => zone.entities.filter((e) => (e.lines && e.lines.length > 0) || e.boss),
    [zone],
  );

  const counts = progress.zoneCounts(zone.id);

  const openEntity = useCallback(
    (entity: Entity) => {
      if (entity.boss) {
        onStartBoss(entity.boss);
        return;
      }
      const isNew = entity.fact ? !progress.has(entity.fact.id) : false;
      setActive({ entity, line: 0, isNew });
    },
    [onStartBoss, progress],
  );

  /** Nearest interactive entity orthogonally adjacent to the player (facing tile wins). */
  const nearby = useCallback(
    (from: Vec, dir: Facing) => {
      const delta: Record<Facing, Vec> = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
      };
      const front = { x: from.x + delta[dir].x, y: from.y + delta[dir].y };
      const atFront = interactives.find((e) => e.x === front.x && e.y === front.y);
      if (atFront) return atFront;
      return interactives.find(
        (e) => Math.abs(e.x - from.x) + Math.abs(e.y - from.y) === 1,
      );
    },
    [interactives],
  );

  const move = useCallback(
    (dir: Facing) => {
      const now = performance.now();
      if (now - lastStep.current < STEP_MS) return;
      lastStep.current = now;
      setFacing(dir);
      audio.sfx("step");
      setPos((prev) => {
        const delta: Record<Facing, Vec> = {
          up: { x: 0, y: -1 },
          down: { x: 0, y: 1 },
          left: { x: -1, y: 0 },
          right: { x: 1, y: 0 },
        };
        const next = { x: prev.x + delta[dir].x, y: prev.y + delta[dir].y };
        if (next.x < 0 || next.y < 0 || next.x >= MAP_W || next.y >= MAP_H) return prev;
        if (solidAt.has(`${next.x},${next.y}`)) return prev;
        return next;
      });
    },
    [solidAt],
  );

  const advance = useCallback(() => {
    setActive((prev) => {
      if (!prev) return null;
      const lines = prev.entity.lines ?? [];
      if (prev.line < lines.length - 1) return { ...prev, line: prev.line + 1 };
      if (prev.entity.fact) {
        const wasNew = progress.discover(prev.entity.fact.id);
        if (wasNew) {
          setToast(prev.entity.fact.label);
          audio.sfx("discover");
        }
      }
      return null;
    });
  }, [progress]);

  const interact = useCallback(() => {
    if (active) {
      advance();
      return;
    }
    const entity = nearby(pos, facing);
    if (entity) {
      audio.sfx("select");
      openEntity(entity);
    }
  }, [active, advance, facing, nearby, openEntity, pos]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["arrowup", "w", "arrowdown", "s", "arrowleft", "a", "arrowright", "d"].includes(key)) {
        event.preventDefault();
        if (active) return;
        if (key === "arrowup" || key === "w") move("up");
        else if (key === "arrowdown" || key === "s") move("down");
        else if (key === "arrowleft" || key === "a") move("left");
        else move("right");
        return;
      }
      if (key === " " || key === "enter" || key === "e") {
        event.preventDefault();
        interact();
        return;
      }
      if (key === "escape") {
        event.preventDefault();
        if (active) setActive(null);
        else onExit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, interact, move, onExit]);

  useEffect(() => {
    audio.setDucked(active !== null);
    return () => audio.setDucked(false);
  }, [active]);

  const hint = !active ? nearby(pos, facing) : undefined;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-3 py-3 sm:px-6 sm:py-5">
      {/* HUD */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onExit} className="pixel-btn px-3 py-2 text-[13px]">
            ◀ MAP
          </button>
          <div>
            <div className="text-[16px] uppercase" style={{ color: zone.cartridgeTint }}>
              {zone.title}
            </div>
            <div className="text-muted font-body text-[17px] leading-none">{zone.era}</div>
          </div>
        </div>
        <div className="min-w-[150px] flex-1 sm:max-w-[220px]">
          <div className="mb-1 flex justify-between text-[12px]">
            <span className="text-muted">ZONE</span>
            <span className="text-lime">
              {counts.found}/{counts.total}
            </span>
          </div>
          <ProgressStrip
            percent={counts.total ? (counts.found / counts.total) * 100 : 0}
            color={zone.cartridgeTint}
          />
        </div>
      </div>

      {/* Stage */}
      <div
        ref={stageRef}
        className="crt-scanlines crt-vignette relative flex flex-1 items-center justify-center overflow-hidden border-[4px] border-[#0b0817]"
        style={{ background: zone.palette.wall, minHeight: 260 }}
      >
        <div
          className="relative"
          style={{
            width: STAGE_W,
            height: STAGE_H,
            transform: `scale(${scale})`,
            transformOrigin: "center center",
          }}
        >
          {/* terrain */}
          <div
            className="absolute inset-0 grid"
            style={{
              gridTemplateColumns: `repeat(${MAP_W}, ${TILE}px)`,
              gridTemplateRows: `repeat(${MAP_H}, ${TILE}px)`,
            }}
          >
            {zone.map.flatMap((row, y) =>
              row.split("").map((tile, x) => (
                <div
                  key={`${x}-${y}`}
                  style={{
                    background:
                      tile === "#"
                        ? zone.palette.wall
                        : tile === "="
                          ? zone.palette.wallFace
                          : tile === ":"
                            ? zone.palette.floorAlt
                            : tile === "_"
                              ? zone.palette.carpet
                              : zone.palette.floor,
                    boxShadow:
                      tile === "="
                        ? `inset 0 -3px 0 0 rgba(0,0,0,0.35)`
                        : tile === "#"
                          ? "inset 0 0 0 1px rgba(0,0,0,0.25)"
                          : "inset -1px -1px 0 0 rgba(0,0,0,0.14)",
                  }}
                />
              )),
            )}
          </div>

          {/* entities */}
          {zone.entities.map((entity) => {
            const interactive = (entity.lines && entity.lines.length > 0) || entity.boss;
            const found = entity.fact ? progress.has(entity.fact.id) : false;
            return (
              <div
                key={entity.id}
                className="absolute"
                style={{
                  left: entity.x * TILE - TILE / 2,
                  top: entity.y * TILE - TILE,
                  width: TILE * 2,
                  height: TILE * 2,
                }}
              >
                <button
                  type="button"
                  onClick={() => interactive && openEntity(entity)}
                  className={`absolute inset-0 flex items-end justify-center ${
                    interactive ? "cursor-pointer" : "pointer-events-none"
                  }`}
                  aria-label={entity.name ?? entity.id}
                >
                  <PixelSprite
                    sprite={entity.sprite}
                    tint={entity.tint}
                    pixel={3}
                    className={entity.float ? "anim-float" : undefined}
                  />
                </button>
                {interactive && (
                  <span
                    className="anim-blink absolute -top-1 left-1/2 -translate-x-1/2 text-[14px]"
                    style={{ color: found ? "#7ee787" : "#ffc94a" }}
                  >
                    {found ? "★" : "!"}
                  </span>
                )}
              </div>
            );
          })}

          {/* player */}
          <div
            className="absolute transition-all duration-100 ease-linear"
            style={{
              left: pos.x * TILE - TILE / 2,
              top: pos.y * TILE - TILE,
              width: TILE * 2,
              height: TILE * 2,
            }}
          >
            <div className="absolute inset-0 flex items-end justify-center">
              <PixelSprite
                sprite={facing === "up" ? "playerBack" : "player"}
                pixel={3}
                flip={facing === "left"}
                className="anim-bob"
              />
            </div>
          </div>
        </div>

        {/* interaction hint */}
        {hint && (
          <div className="text-parchment pointer-events-none absolute bottom-2 left-1/2 z-[62] -translate-x-1/2 border-[3px] border-[#0b0817] font-body bg-[#241a45] px-3 py-1 text-[18px]">
            {hint.boss ? "⚔ " : ""}
            {hint.name ?? "Look"}. Press <span className="text-gold">[SPACE]</span>
          </div>
        )}

        {/* new-fact toast */}
        {toast && (
          <div className="anim-pop pointer-events-none absolute top-3 left-1/2 z-[62] w-[min(92%,420px)] -translate-x-1/2 border-[3px] border-[#7ee787] bg-[#15112b] px-3 py-2">
            <div className="text-lime text-[12px]">★ DISCOVERED {progress.count}/{progress.total}</div>
            <div className="text-parchment font-body text-[19px] leading-tight">{toast}</div>
          </div>
        )}
      </div>

      {/* dialogue */}
      <div className="mt-3">
        {active ? (
          <DialogueBox
            entity={active.entity}
            lineIndex={active.line}
            isNewFact={active.isNew}
            onAdvance={advance}
            onOpenPanel={active.entity.panel === "youtube" ? onOpenYouTube : undefined}
          />
        ) : (
          <TouchControls onMove={move} onAction={interact} />
        )}
      </div>
    </div>
  );
}

function TouchControls({
  onMove,
  onAction,
}: {
  onMove: (dir: Facing) => void;
  onAction: () => void;
}) {
  const hold = useRef<number | null>(null);

  const start = (dir: Facing) => {
    onMove(dir);
    hold.current = window.setInterval(() => onMove(dir), STEP_MS + 20);
  };
  const stop = () => {
    if (hold.current !== null) window.clearInterval(hold.current);
    hold.current = null;
  };

  useEffect(() => stop, []);

  const pad = (dir: Facing, label: string, className: string) => (
    <button
      type="button"
      className={`pixel-btn flex h-11 w-11 items-center justify-center text-[12px] ${className}`}
      onPointerDown={(event) => {
        event.preventDefault();
        start(dir);
      }}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      aria-label={`Move ${dir}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-end justify-between gap-4">
      <div className="grid grid-cols-3 grid-rows-3 gap-1">
        <span />
        {pad("up", "▲", "")}
        <span />
        {pad("left", "◀", "")}
        <span className="flex h-11 w-11 items-center justify-center border-[3px] border-[#0b0817] bg-[#191233] text-[12px] text-[#4d3b85]">
          ✛
        </span>
        {pad("right", "▶", "")}
        <span />
        {pad("down", "▼", "")}
        <span />
      </div>

      <div className="text-muted hidden flex-1 self-center text-center text-[12px] leading-relaxed sm:block">
        ARROWS / WASD TO WALK · [SPACE] TO TALK · [ESC] BACK TO MAP
        <br />
        <span className="text-gold">!</span> = something to discover ·{" "}
        <span className="text-lime">★</span> = already logged
      </div>

      <button
        type="button"
        onClick={onAction}
        className="pixel-btn pixel-btn-active mr-2 flex h-16 w-16 items-center justify-center rounded-full text-[12px] sm:mr-36"
        aria-label="Interact"
      >
        A
      </button>
    </div>
  );
}
