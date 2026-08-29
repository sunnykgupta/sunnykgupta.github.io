import { useCallback, useEffect, useState } from "react";
import { TOTAL_FACTS, ZONES, zoneFactIds } from "../lib/game/content";

const STORAGE_KEY = "sunny-quest:v1";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export type Progress = {
  discovered: Set<string>;
  count: number;
  total: number;
  percent: number;
  has: (id: string) => boolean;
  discover: (id: string) => boolean;
  reset: () => void;
  zonePercent: (zoneId: string) => number;
  zoneCounts: (zoneId: string) => { found: number; total: number };
};

export function useProgress(): Progress {
  const [discovered, setDiscovered] = useState<Set<string>>(() => new Set(read()));

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...discovered]));
    } catch {
      /* private mode — progress just won't persist */
    }
  }, [discovered]);

  const discover = useCallback((id: string) => {
    let isNew = false;
    setDiscovered((prev) => {
      if (prev.has(id)) return prev;
      isNew = true;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    return isNew;
  }, []);

  const has = useCallback((id: string) => discovered.has(id), [discovered]);

  const zoneCounts = useCallback(
    (zoneId: string) => {
      const zone = ZONES.find((z) => z.id === zoneId);
      if (!zone) return { found: 0, total: 0 };
      const ids = zoneFactIds(zone);
      return { found: ids.filter((id) => discovered.has(id)).length, total: ids.length };
    },
    [discovered],
  );

  const zonePercent = useCallback(
    (zoneId: string) => {
      const { found, total } = zoneCounts(zoneId);
      return total === 0 ? 0 : Math.round((found / total) * 100);
    },
    [zoneCounts],
  );

  const reset = useCallback(() => setDiscovered(new Set()), []);

  return {
    discovered,
    count: discovered.size,
    total: TOTAL_FACTS,
    percent: Math.round((discovered.size / TOTAL_FACTS) * 100),
    has,
    discover,
    reset,
    zonePercent,
    zoneCounts,
  };
}
