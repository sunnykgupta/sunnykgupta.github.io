import { useEffect, useRef } from "react";

export type DistrictKind = "cafe" | "school" | "systems" | "studio" | "letters";

type DistrictArtProps = {
  kind: DistrictKind;
  className?: string;
};

/** Decorative pixel vignettes shared by the town's directory pages. */
export function DistrictArt({ kind, className }: DistrictArtProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const height = kind === "letters" ? 200 : 115;

  useEffect(() => {
    const canvas = canvasRef.current;
    const c = canvas?.getContext("2d");
    if (!canvas || !c) return;
    c.imageSmoothingEnabled = false;
    drawDistrict(c, canvas, kind);
  }, [kind]);

  return (
    <canvas
      ref={canvasRef}
      className={["district-canvas", className].filter(Boolean).join(" ")}
      width={300}
      height={height}
      aria-hidden="true"
    />
  );
}

function drawDistrict(c: CanvasRenderingContext2D, canvas: HTMLCanvasElement, kind: DistrictKind) {
  const r = (x: number, y: number, w: number, h: number, col: string) => {
    c.fillStyle = col;
    c.fillRect(x, y, w, h);
  };
  const star = (x: number, y: number) => {
    r(x, y, 2, 6, "#9eafd2");
    r(x - 2, y + 2, 6, 2, "#9eafd2");
  };
  const plant = (x: number, y: number) => {
    r(x, y, 9, 8, "#597c90");
    r(x - 2, y - 8, 13, 9, "#3c8f8d");
    r(x + 3, y - 13, 4, 8, "#88d6b8");
  };
  const person = (x: number, y: number, col: string) => {
    r(x, y, 6, 5, "#e6b591");
    r(x - 1, y - 2, 8, 3, "#45465e");
    r(x - 2, y + 5, 10, 9, col);
    r(x, y + 14, 2, 4, "#91a9c6");
    r(x + 5, y + 14, 2, 4, "#91a9c6");
  };
  r(0, 0, 300, canvas.height, "#22344d");
  r(0, 90, 300, 25, "#2c405a");
  if (kind === "cafe") {
    for (const [x, y] of [
      [17, 26],
      [270, 37],
      [228, 18],
      [57, 14],
    ])
      star(x, y);
    r(70, 29, 152, 65, "#b7b8d2");
    r(64, 22, 164, 15, "#ef858a");
    r(73, 15, 145, 12, "#ef858a");
    r(64, 36, 164, 4, "#ae637c");
    r(118, 48, 57, 12, "#34435e");
    r(126, 52, 42, 3, "#f7b5b9");
    r(130, 65, 31, 29, "#4a5f7e");
    r(135, 69, 20, 24, "#6a819e");
    r(150, 80, 2, 2, "#f7c782");
    for (let x of [81, 178]) {
      r(x, 52, 31, 28, "#405574");
      r(x + 3, 55, 25, 21, "#95dedf");
      r(x + 14, 55, 3, 21, "#405574");
    }
    for (let x = 65; x < 225; x += 20) {
      r(x, 39, 10, 9, "#ffe5cb");
      r(x + 10, 39, 10, 9, "#ec7c87");
    }
    for (const x of [37, 246]) {
      r(x, 85, 19, 7, "#d2a17e");
      r(x + 8, 91, 3, 9, "#778ca7");
      r(x - 5, 87, 3, 10, "#778ca7");
      r(x + 23, 87, 3, 10, "#778ca7");
      r(x + 5, 82, 4, 4, "#e9dfcc");
    }
    person(29, 79, "#ad9fdf");
    person(270, 82, "#88d9ce");
    plant(14, 89);
    plant(232, 89);
    r(50, 54, 2, 29, "#7b94b4");
    r(46, 50, 10, 8, "#ffd18c");
  } else if (kind === "school") {
    r(46, 26, 208, 63, "#7e96b7");
    r(41, 20, 219, 11, "#5ba9b4");
    r(48, 16, 204, 6, "#7fc6cf");
    r(55, 35, 98, 41, "#273d51");
    r(58, 38, 92, 35, "#355b6d");
    for (let i = 0; i < 3; i++) {
      r(68, 45 + i * 9, 52 - i * 10, 2, "#89ddcc");
      r(126, 45 + i * 9, 10, 2, "#b9c9dd");
    }
    r(167, 37, 72, 36, "#3e526e");
    for (let x = 174; x < 233; x += 10) {
      r(x, 43, 5, 23, ["#a99bde", "#88d9ce", "#ef9999"][Math.floor(x / 10) % 3]);
    }
    r(167, 60, 72, 3, "#768eac");
    for (let x of [69, 121, 174, 224]) {
      r(x, 87, 23, 5, "#88a3be");
      r(x + 2, 92, 3, 11, "#607791");
      r(x + 18, 92, 3, 11, "#607791");
      r(x + 6, 80, 14, 8, "#36506c");
      r(x + 8, 82, 10, 4, "#85dbd0");
    }
    person(98, 76, "#e8ae71");
    person(199, 78, "#b5a1e6");
    plant(24, 90);
    plant(272, 90);
  } else if (kind === "systems") {
    r(0, 0, 300, 115, "#1c3148");
    for (let y = 9; y < 115; y += 13) for (let x = 7; x < 300; x += 13) r(x, y, 1, 1, "#334d65");
    r(77, 59, 147, 2, "#5b8b9a");
    r(149, 36, 2, 50, "#5b8b9a");
    r(148, 34, 59, 2, "#5b8b9a");
    r(148, 85, 59, 2, "#5b8b9a");
    for (const [x, y, w, col] of [
      [34, 41, 53, "#88e4d6"],
      [122, 44, 54, "#a89cde"],
      [204, 21, 60, "#f5b77b"],
      [204, 72, 60, "#88e4d6"],
    ] as const) {
      r(x, y, w, 31, "#405976");
      r(x + 2, y + 2, w - 4, 27, "#20344d");
      r(x + 7, y + 7, 7, 7, col);
      r(x + 20, y + 9, w - 27, 2, "#a5b9cf");
      r(x + 7, y + 20, w - 15, 2, "#5e7c95");
    }
  } else if (kind === "studio") {
    r(0, 0, 300, 115, "#2a304b");
    r(24, 22, 148, 73, "#47506c");
    r(28, 26, 140, 65, "#111e33");
    r(34, 32, 128, 51, "#354b67");
    for (let x = 58; x < 118; x += 12) r(x, 44, 5, 25, "#88d9cf");
    r(62, 48, 47, 2, "#88d9cf");
    r(62, 62, 47, 2, "#88d9cf");
    r(79, 53, 3, 5, "#f5b77b");
    r(88, 96, 15, 5, "#7586a5");
    r(73, 102, 45, 3, "#7586a5");
    r(209, 50, 35, 22, "#869bb4");
    r(215, 54, 14, 13, "#344c65");
    r(244, 53, 11, 16, "#a8b5cb");
    r(223, 74, 4, 27, "#7384a2");
    r(214, 101, 23, 3, "#7384a2");
    r(191, 26, 5, 18, "#d8b48a");
    r(180, 23, 27, 6, "#f6d39e");
    plant(268, 90);
  } else if (kind === "letters") {
    r(0, 0, 300, 200, "#27324c");
    for (const [x, y] of [
      [28, 26],
      [256, 29],
      [269, 159],
      [29, 161],
    ])
      star(x, y);
    r(49, 45, 203, 121, "#34405e");
    r(60, 38, 182, 117, "#8d82ba");
    r(68, 32, 166, 117, "#c5c1e0");
    r(79, 45, 144, 91, "#ede9f7");
    r(91, 61, 60, 6, "#716a9e");
    r(91, 78, 116, 3, "#9e99bb");
    r(91, 89, 116, 3, "#9e99bb");
    r(91, 100, 87, 3, "#9e99bb");
    r(107, 112, 35, 24, "#b89bdc");
    r(112, 116, 25, 16, "#d9c8ed");
    r(149, 123, 63, 34, "#b495d7");
    r(153, 128, 55, 22, "#d9b6e8");
    plant(35, 146);
    r(237, 128, 20, 24, "#f5b77b");
    r(257, 134, 7, 12, "#f5b77b");
    r(259, 137, 3, 6, "#27324c");
    r(240, 124, 14, 5, "#a97b64");
  }
}
