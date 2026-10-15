import { useEffect, useRef } from "react";

type TownArtProps = {
  lively: boolean;
  warmLights: boolean;
  catGreeted: boolean;
};

/** Decorative town artwork; destination links are real HTML supplied by the page. */
export function TownArt({ lively, warmLights, catGreeted }: TownArtProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.imageSmoothingEnabled = false;
    const scene = createScene(context, warmLights, catGreeted);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let elapsed = 0;
    let previousTime: number | null = null;
    let lastPaint = 0;
    let inViewport = true;
    let disposed = false;

    const canAnimate = () =>
      lively && !reducedMotion.matches && !document.hidden && inViewport && !disposed;
    const tick = (now: number) => {
      frame = 0;
      if (!canAnimate()) return;
      if (previousTime !== null) elapsed += now - previousTime;
      previousTime = now;
      // Pixel animation needs only twelve paints per second.
      if (now - lastPaint >= 1000 / 12) {
        scene(elapsed);
        lastPaint = now;
      }
      frame = requestAnimationFrame(tick);
    };
    const syncAnimation = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = null;
      if (canAnimate()) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      syncAnimation();
    });
    scene(0);
    observer.observe(canvas);
    reducedMotion.addEventListener("change", syncAnimation);
    document.addEventListener("visibilitychange", syncAnimation);
    syncAnimation();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      reducedMotion.removeEventListener("change", syncAnimation);
      document.removeEventListener("visibilitychange", syncAnimation);
    };
  }, [lively, warmLights, catGreeted]);

  return (
    <canvas ref={canvasRef} className="town-canvas" width={480} height={310} aria-hidden="true" />
  );
}

function createScene(c: CanvasRenderingContext2D, warmLights: boolean, catGreeted: boolean) {
  const r = (x: number, y: number, w: number, h: number, col: string) => {
    c.fillStyle = col;
    c.fillRect(Math.round(x), Math.round(y), w, h);
  };
  const p = {
    grass: "#243a50",
    grass2: "#2c4559",
    leaf: "#206569",
    leaf2: "#398b87",
    path: "#566d83",
    pave: "#6d8295",
    river: "#1d6589",
    edge: "#354966",
    light: "#ffd18c",
  };
  const tree = (x: number, y: number, s = 1) => {
    r(x - 8 * s, y + 14 * s, 22 * s, 6 * s, "#344c4933");
    r(x + 2 * s, y + 6 * s, 4 * s, 12 * s, "#44536a");
    r(x - 8 * s, y - 9 * s, 25 * s, 17 * s, p.leaf);
    r(x - 4 * s, y - 16 * s, 17 * s, 29 * s, p.leaf);
    r(x - 5 * s, y - 11 * s, 17 * s, 12 * s, p.leaf2);
    r(x - 2 * s, y - 17 * s, 10 * s, 7 * s, p.leaf2);
    r(x - 8 * s, y - 4 * s, 5 * s, 7 * s, p.leaf2);
  };
  const shrub = (x: number, y: number) => {
    r(x, y, 16, 6, p.leaf);
    r(x + 3, y - 3, 10, 6, p.leaf2);
  };
  const windowPixel = (x: number, y: number, w = 13, h = 15) => {
    r(x - 2, y - 2, w + 4, h + 4, "#3a475b");
    r(x, y, w, h, warmLights ? "#ffd48b" : "#9de2e9");
    r(x + Math.floor(w / 2), y, 2, h, "#435268");
    r(x, y + 6, w, 2, "#435268");
    r(x - 3, y + h + 2, w + 6, 3, "#5b708f");
  };
  const house = (x: number, y: number, w: number, h: number, roof: string, wall: string) => {
    r(x + 5, y + h - 3, w, 10, "#34464444");
    r(x, y + 18, w, h - 18, "#435268");
    r(x + 3, y + 20, w - 6, h - 25, wall);
    r(x + 3, y + h - 12, w - 6, 7, "#7589a7");
    r(x - 5, y + 10, w + 10, 18, roof);
    r(x, y + 5, w, 22, roof);
    r(x + 7, y, w - 14, 23, roof);
    r(x - 5, y + 27, w + 10, 4, "#39465a");
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < w / 14; j++)
        r(x + j * 14 + (i % 2) * 7, y + 7 + i * 6, 10, 1, "#ffffff20");
    r(x + w / 2 - 8, y + h - 29, 17, 28, "#3d4b60");
    r(x + w / 2 - 5, y + h - 25, 11, 23, "#495a73");
    r(x + w / 2 + 3, y + h - 15, 2, 2, "#92a2ba");
  };
  const lamp = (x: number, y: number) => {
    r(x, y, 3, 24, "#394558");
    r(x - 4, y - 6, 11, 3, "#394558");
    r(x - 2, y - 3, 7, 8, p.light);
    r(x - 4, y + 4, 11, 2, "#394558");
    r(x - 2, y + 24, 7, 3, "#394558");
    if (warmLights) {
      r(x - 8, y - 8, 20, 17, "#9caabf18");
    }
  };
  const bench = (x: number, y: number) => {
    r(x, y, 23, 3, "#415066");
    r(x, y + 5, 23, 3, "#51637e");
    r(x + 2, y - 2, 2, 16, "#364355");
    r(x + 19, y - 2, 2, 16, "#364355");
  };
  const person = (x: number, y: number, shirt: string, hair = "#323d4e", step = 0) => {
    r(x - 3, y + 14, 12, 3, "#36494744");
    r(x, y - 2, 7, 4, hair);
    r(x - 1, y + 1, 9, 6, "#e7b797");
    r(x - 2, y + 7, 11, 8, shirt);
    r(x - 3, y + 8, 2, 5, "#e7b797");
    r(x + 9, y + 8, 2, 5, "#e7b797");
    r(x, y + 15, 3, 4 + step, "#53515a");
    r(x + 5, y + 15, 3, 5 - step, "#53515a");
  };
  return (t: number) => {
    r(0, 0, 480, 310, p.grass);
    for (let y = 4; y < 310; y += 13)
      for (let x = 4; x < 480; x += 17) {
        const n = (x * 7 + y * 11) % 23;
        r(x + n / 4, y, 2, 2, p.grass2);
        if (n < 6) r(x + 4, y + 4, 2, 1, "#8496b0");
      }
    // River, stone walks, and a shared central plaza.
    r(448, 0, 32, 310, p.river);
    r(443, 0, 5, 310, "#537d78");
    r(438, 210, 10, 100, p.river);
    r(430, 266, 18, 44, p.river);
    for (let y = 12; y < 310; y += 22) {
      r(450 + (y % 11), y, 14, 1, "#90c1bb66");
      r(464, y + 8, 9, 2, "#90c1bb44");
    }
    r(0, 142, 449, 29, p.path);
    r(224, 0, 28, 310, p.path);
    r(169, 129, 129, 59, p.path);
    r(180, 136, 107, 44, p.pave);
    r(101, 86, 17, 68, p.path);
    r(365, 83, 16, 72, p.path);
    r(104, 167, 17, 102, p.path);
    r(365, 167, 16, 114, p.path);
    for (let y = 138; y < 180; y += 8)
      for (let x = 184; x < 285; x += 11) r(x + (y % 3), y, 8, 5, "#a8b4c74d");
    // River crossing and fence.
    r(433, 144, 47, 25, "#4b5b75");
    for (let x = 435; x < 480; x += 7) r(x, 145, 5, 23, "#617797");
    r(430, 140, 50, 3, "#3a475b");
    r(430, 170, 50, 3, "#3a475b");
    for (let x = 18; x < 430; x += 11) {
      r(x, 16, 3, 13, "#96a5bc");
    }
    r(18, 20, 412, 3, "#8c9db6");
    // The café and its little courtyard.
    house(62, 40, 96, 63, "#f28387", "#bbb6d0");
    windowPixel(72, 77, 19, 14);
    windowPixel(128, 77, 19, 14);
    r(60, 69, 100, 9, "#fff0da");
    for (let x = 60; x < 160; x += 18) r(x, 69, 9, 12, "#f28387");
    r(85, 54, 50, 10, "#a1afc3");
    r(90, 58, 40, 2, "#435269");
    house(160, 56, 37, 43, "#556884", "#8e9eb7");
    windowPixel(171, 86, 12, 9);
    r(169, 63, 17, 7, "#526e6b");
    // Café tables, flower boxes, and people chatting.
    for (const [x, y] of [
      [38, 87],
      [41, 115],
    ]) {
      r(x, y, 13, 10, "#536682");
      r(x - 5, y + 2, 3, 7, "#3e4d62");
      r(x + 16, y + 2, 3, 7, "#3e4d62");
      r(x + 5, y + 2, 3, 3, "#b3bece");
    }
    for (let x = 65; x < 152; x += 21) {
      r(x, 102, 13, 4, "#485870");
      r(x + 1, 99, 11, 4, p.leaf);
      r(x + 3, 97, 3, 3, "#8093ae");
    }
    // Workshop: skylight, chimney, garage, and half-built machine.
    house(318, 41, 100, 64, "#49a8bc", "#9cafc6");
    r(391, 28, 11, 24, "#4b5c76");
    r(388, 26, 17, 5, "#5c7190");
    r(338, 48, 30, 15, "#324e51");
    for (let x = 341; x < 367; x += 8) r(x, 50, 5, 10, "#9ebeb9");
    r(329, 78, 29, 27, "#576563");
    for (let y = 80; y < 104; y += 5) r(331, y, 25, 2, "#6f938f");
    windowPixel(388, 78, 17, 17);
    r(365, 67, 15, 9, "#63799a");
    r(369, 69, 7, 5, "#55756a");
    r(292, 86, 20, 14, "#596c8a");
    r(295, 89, 6, 5, "#495553");
    r(299, 81, 9, 5, "#8a9bb4");
    r(295, 100, 4, 6, "#3b4644");
    r(306, 100, 4, 6, "#3b4644");
    // Library: clock tower, book displays, and reading garden.
    house(67, 211, 105, 58, "#a193dd", "#a9b9d6");
    r(104, 187, 25, 40, "#8798b2");
    r(100, 184, 33, 8, "#785469");
    r(108, 177, 17, 10, "#785469");
    r(109, 193, 15, 15, "#aebacb");
    r(116, 196, 2, 7, "#404e64");
    r(113, 202, 5, 2, "#404e64");
    windowPixel(78, 245, 17, 16);
    windowPixel(141, 245, 17, 16);
    for (let x = 80; x < 96; x += 4) r(x, 251, 2, 8, x % 3 ? "#607774" : "#5c7190");
    r(39, 238, 18, 23, "#46566e");
    for (let y = 241; y < 260; y += 7) {
      r(41, y, 14, 2, "#7287a5");
      for (let x = 42; x < 55; x += 4) r(x, y - 4, 3, 4, x % 3 ? "#5e7e7b" : "#63799a");
    }
    bench(181, 220);
    bench(180, 246);
    // Sunny’s house, roof antenna, bicycle, and vegetable patch.
    house(335, 211, 81, 59, "#e6ad69", "#afbed0");
    windowPixel(344, 245, 13, 14);
    windowPixel(395, 245, 12, 14);
    r(389, 195, 2, 22, "#45504f");
    r(381, 200, 18, 2, "#45504f");
    r(385, 195, 2, 10, "#45504f");
    r(396, 195, 2, 10, "#45504f");
    r(306, 238, 19, 4, "#51647f");
    r(309, 223, 4, 22, "#425168");
    r(304, 220, 15, 10, "#789189");
    r(310, 223, 7, 2, "#99a8be");
    for (let y = 280; y < 301; y += 9) {
      r(337, y, 73, 5, "#4e607a");
      for (let x = 341; x < 410; x += 9) {
        r(x, y - 2, 5, 3, "#3b6762");
        r(x + 2, y - 4, 2, 3, "#4a857e");
      }
    }
    // Central fountain and lanterns.
    r(218, 145, 40, 21, "#5b6a68");
    r(214, 148, 48, 15, "#697f7c");
    r(218, 149, 40, 12, p.river);
    r(223, 151, 30, 7, "#9ecac4");
    r(235, 136, 6, 23, "#91a1b9");
    r(230, 137, 16, 5, "#a3b0c4");
    r(235, 128, 6, 10, "#95b8b0");
    r(233, 132, 10, 2, "#8cc9c1");
    for (const [x, y] of [
      [207, 121],
      [273, 121],
      [208, 184],
      [276, 183],
      [23, 157],
      [424, 157],
    ])
      lamp(x, y);
    // Pennants stretch between the community and workshop courtyards.
    r(174, 30, 122, 1, "#485870");
    for (let x = 180; x < 292; x += 14) {
      r(x, 31, 7, 6, x % 3 ? "#6c82a1" : "#a96856");
      r(x + 2, 37, 3, 3, x % 3 ? "#6c82a1" : "#a96856");
    }
    // Street furniture and small gardens.
    bench(64, 154);
    bench(344, 154);
    r(201, 68, 12, 17, "#47576f");
    r(198, 61, 18, 13, "#5a6f8d");
    r(201, 64, 12, 6, "#a6b3c6");
    r(206, 85, 3, 7, "#404e63");
    for (const [x, y] of [
      [15, 40],
      [27, 202],
      [12, 271],
      [205, 278],
      [276, 270],
      [426, 34],
      [427, 210],
      [285, 34],
      [220, 28],
      [9, 120],
      [430, 101],
    ])
      tree(x, y, x === 12 ? 1.3 : 1);
    for (const [x, y] of [
      [16, 177],
      [76, 191],
      [151, 190],
      [312, 181],
      [403, 183],
      [264, 69],
      [187, 112],
      [293, 286],
      [54, 283],
    ])
      shrub(x, y);
    for (let i = 0; i < 26; i++) {
      const x = 18 + ((i * 83) % 411),
        y = 32 + ((i * 61) % 261);
      if ((y > 130 && y < 180) || (x > 222 && x < 252)) continue;
      r(x, y, 2, 5, p.leaf);
      r(x - 1, y, 4, 2, i % 2 ? "#8294af" : "#d98a77");
    }
    // A small pond and stepping stones near the library.
    r(25, 291, 48, 15, p.river);
    r(32, 287, 33, 22, p.river);
    r(35, 291, 17, 1, "#89cbc3");
    r(62, 296, 7, 4, "#407972");
    // Residents stroll while motion is enabled.
    const step = Math.floor(t / 180) % 2;
    const dx = Math.round(Math.sin(t / 1500) * 12);
    person(141, 153, "#f28387");
    person(161, 151, "#49a8bc", "#303b4b");
    person(192 + dx, 160, "#f3c970", "#384457", step);
    person(269, 208 + dx / 2, "#a193dd", "#364254", step);
    person(378, 179, "#ed9eb1");
    person(52, 195, "#f3c970");
    // Cat on the green by the square.
    r(237, 255, 11, 7, catGreeted ? "#f1be7b" : "#e7ac69");
    r(243, 250, 7, 8, "#f1c389");
    r(243, 248, 2, 4, "#ae755d");
    r(248, 248, 2, 4, "#ae755d");
    r(247, 253, 1, 1, "#303a4a");
    r(235, 256, 3, 2, "#e7ac69");
    r(232, 251, 3, 7, "#e7ac69");
    r(239, 262, 2, 3, "#ae755d");
    r(246, 262, 2, 3, "#ae755d");
    if (catGreeted) {
      r(252, 239, 2, 4, "#fa84a0");
      r(250, 237, 2, 3, "#fa84a0");
      r(254, 237, 2, 3, "#fa84a0");
    }
  };
}
