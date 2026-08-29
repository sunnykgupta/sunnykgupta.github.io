/**
 * Tiny audio manager for the game. Client-side only, no deps.
 * Music tracks loop and cross-fade per screen. SFX are one-shots.
 * Mute state lives in localStorage so it survives reloads.
 */

const MUTE_KEY = "sunny-quest:muted";

export type MusicTrack =
  | "title"
  | "cartridge"
  | "walkBedroom"
  | "walkBuild"
  | "walkSteel"
  | "walkCafe"
  | "boss"
  | "panel";

export type Sfx = "select" | "discover" | "hit" | "fail" | "step";

const MUSIC_SRC: Record<MusicTrack, string> = {
  title: "/audio/title.mp3",
  cartridge: "/audio/cartridge.mp3",
  walkBedroom: "/audio/walk-bedroom.mp3",
  walkBuild: "/audio/walk-build.mp3",
  walkSteel: "/audio/walk-steel.mp3",
  walkCafe: "/audio/walk-cafe.mp3",
  boss: "/audio/boss.mp3",
  panel: "/audio/panel.mp3",
};

const SFX_SRC: Record<Sfx, string> = {
  select: "/audio/select.mp3",
  discover: "/audio/discover.mp3",
  hit: "/audio/hit.mp3",
  fail: "/audio/fail.mp3",
  step: "/audio/step.mp3",
};

/** Footsteps sit far under everything else so they never nag. */
const SFX_VOLUME: Record<Sfx, number> = {
  select: 0.2,
  discover: 0.24,
  hit: 0.22,
  fail: 0.2,
  step: 0.06,
};

/** Which walking track each zone uses. Zones not listed fall back to walkBuild. */
const ZONE_TRACK: Record<string, MusicTrack> = {
  bootloader: "walkBedroom",
  "startup-arena": "walkBuild",
  "first-principles-lab": "walkBuild",
  "scale-tower": "walkSteel",
  "war-room": "walkSteel",
  "guild-hall": "walkCafe",
  "impromptu-cafe": "walkCafe",
};

export function zoneTrack(zoneId: string): MusicTrack {
  return ZONE_TRACK[zoneId] ?? "walkBuild";
}

/** Background music sits well under the SFX. Deliberately quiet. */
const MUSIC_VOLUME = 0.13;
/** Volume while a dialogue box is open, so reading stays comfortable. */
const DUCKED_VOLUME = 0.05;
const FADE_MS = 700;
const FADE_STEP_MS = 40;

function readMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

let muted = readMuted();
let ducked = false;
let currentTrack: MusicTrack | null = null;
const listeners = new Set<() => void>();
const musicEls = new Map<MusicTrack, HTMLAudioElement>();
const sfxEls = new Map<Sfx, HTMLAudioElement>();
const fades = new Map<HTMLAudioElement, number>();

function notify() {
  for (const listener of listeners) listener();
}

function targetVolume() {
  return ducked ? DUCKED_VOLUME : MUSIC_VOLUME;
}

/** Fire and forget. Autoplay rejections are expected before the first gesture. */
function attemptPlay(el: HTMLAudioElement) {
  const played = el.play();
  if (played && typeof played.catch === "function") played.catch(() => {});
}

/** Linear volume ramp. Pauses the element when it fades all the way out. */
function fadeTo(el: HTMLAudioElement, to: number, pauseAtEnd = false) {
  const existing = fades.get(el);
  if (existing) window.clearInterval(existing);
  const from = el.volume;
  const steps = Math.max(1, Math.round(FADE_MS / FADE_STEP_MS));
  let step = 0;
  const timer = window.setInterval(() => {
    step += 1;
    const value = from + ((to - from) * step) / steps;
    el.volume = Math.min(1, Math.max(0, value));
    if (step >= steps) {
      window.clearInterval(timer);
      fades.delete(el);
      if (pauseAtEnd) {
        el.pause();
        el.currentTime = 0;
      }
    }
  }, FADE_STEP_MS);
  fades.set(el, timer);
}

function musicEl(track: MusicTrack): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  let el = musicEls.get(track);
  if (!el) {
    el = new window.Audio(MUSIC_SRC[track]);
    el.loop = true;
    el.preload = "auto";
    el.volume = 0;
    musicEls.set(track, el);
  }
  return el;
}

export const audio = {
  isMuted: () => muted,

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setMuted(next: boolean) {
    muted = next;
    try {
      window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
    } catch {
      /* private mode, mute just won't persist */
    }
    if (next) {
      for (const el of musicEls.values()) {
        el.pause();
        el.volume = 0;
      }
    } else if (currentTrack) {
      const el = musicEl(currentTrack);
      if (el) {
        attemptPlay(el);
        fadeTo(el, targetVolume());
      }
    }
    notify();
  },

  toggleMuted() {
    audio.setMuted(!muted);
  },

  /** Drop the music under dialogue, then bring it back. */
  setDucked(next: boolean) {
    if (ducked === next) return;
    ducked = next;
    if (muted || !currentTrack) return;
    const el = musicEl(currentTrack);
    if (el) fadeTo(el, targetVolume());
  },

  playMusic(track: MusicTrack) {
    if (currentTrack === track) {
      const same = musicEl(track);
      if (same && !muted) {
        if (same.paused) attemptPlay(same);
        fadeTo(same, targetVolume());
      }
      return;
    }
    for (const [key, el] of musicEls) {
      if (key !== track && !el.paused) fadeTo(el, 0, true);
    }
    currentTrack = track;
    const el = musicEl(track);
    if (!el || muted) return;
    attemptPlay(el);
    fadeTo(el, targetVolume());
  },

  stopMusic() {
    currentTrack = null;
    for (const el of musicEls.values()) {
      if (!el.paused) fadeTo(el, 0, true);
    }
  },

  sfx(name: Sfx) {
    if (muted || typeof window === "undefined") return;
    let el = sfxEls.get(name);
    if (!el) {
      el = new window.Audio(SFX_SRC[name]);
      el.preload = "auto";
      sfxEls.set(name, el);
    }
    el.volume = SFX_VOLUME[name];
    el.currentTime = 0;
    attemptPlay(el);
  },
};
