import { useCallback, useEffect, useState } from "react";
import { audio } from "../../lib/game/audio";

/**
 * Prominent, always-visible sound switch. Fixed top-right on every screen.
 */
export function SoundToggle() {
  const [muted, setMuted] = useState(() => audio.isMuted());

  useEffect(() => audio.subscribe(() => setMuted(audio.isMuted())), []);

  const toggle = useCallback(() => {
    audio.toggleMuted();
    if (!audio.isMuted()) audio.sfx("select");
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={!muted}
      aria-label={muted ? "Turn sound on" : "Turn sound off"}
      title={muted ? "Turn sound on (M)" : "Turn sound off (M)"}
      className={`pixel-btn ${
        muted ? "" : "pixel-btn-active"
      } fixed top-3 right-3 z-50 flex items-center gap-2 px-3 py-3 text-[13px] uppercase sm:top-4 sm:right-4 sm:px-4`}
    >
      <span className="text-[19px] leading-none">{muted ? "🔇" : "🔊"}</span>
      <span className="hidden sm:inline">{muted ? "Sound off" : "Sound on"}</span>
    </button>
  );
}
