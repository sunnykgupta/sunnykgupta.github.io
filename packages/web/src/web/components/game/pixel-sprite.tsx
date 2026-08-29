import { useMemo } from "react";
import { PALETTE, SPRITES, TINT_CHAR, normalizeSprite, type SpriteKey } from "../../lib/game/sprites";

type Props = {
  sprite: SpriteKey;
  /** Size of one art pixel, in CSS px. */
  pixel?: number;
  /** Overrides the accent colour (char "R"). */
  tint?: string;
  className?: string;
  flip?: boolean;
  title?: string;
};

/** Renders hand-authored pixel art as a single element with box-shadow pixels. */
export function PixelSprite({ sprite, pixel = 3, tint, className, flip, title }: Props) {
  const rows = useMemo(() => normalizeSprite(SPRITES[sprite]), [sprite]);

  const { shadow, width, height } = useMemo(() => {
    const parts: string[] = [];
    for (let y = 0; y < rows.length; y++) {
      const row = rows[y];
      for (let x = 0; x < row.length; x++) {
        const char = row[x];
        if (char === " ") continue;
        const color = char === TINT_CHAR && tint ? tint : PALETTE[char];
        if (!color) continue;
        parts.push(`${x * pixel}px ${y * pixel}px 0 0 ${color}`);
      }
    }
    return {
      shadow: parts.join(","),
      width: (rows[0]?.length ?? 0) * pixel,
      height: rows.length * pixel,
    };
  }, [rows, pixel, tint]);

  return (
    <div
      className={className}
      title={title}
      style={{
        width,
        height,
        position: "relative",
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: pixel,
          height: pixel,
          boxShadow: shadow,
        }}
      />
    </div>
  );
}
