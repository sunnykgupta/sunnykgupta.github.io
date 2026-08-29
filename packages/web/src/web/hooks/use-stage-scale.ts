import { useEffect, useState, type RefObject } from "react";

/**
 * Integer-ish scale factor that fits a fixed logical stage (w x h) inside its container.
 * Keeps the pixel grid crisp by preferring whole/half steps.
 */
export function useStageScale(ref: RefObject<HTMLElement | null>, w: number, h: number) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const compute = () => {
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const raw = Math.min(rect.width / w, rect.height / h);
      const stepped = Math.max(0.5, Math.floor(raw * 4) / 4);
      setScale(stepped);
    };

    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(element);
    window.addEventListener("orientationchange", compute);
    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", compute);
    };
  }, [ref, w, h]);

  return scale;
}
