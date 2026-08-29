import { useCallback, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ZONES } from "../lib/game/content";
import { useProgress } from "../hooks/use-progress";
import { TitleScreen } from "../components/game/title-screen";
import { HubScreen } from "../components/game/hub-screen";
import { ZoneScreen } from "../components/game/zone-screen";
import { BossFight } from "../components/game/boss-fight";
import { AchievementsPanel } from "../components/game/achievements-panel";
import { SaveFile } from "../components/game/save-file";
import { YouTubePanel } from "../components/game/youtube-panel";
import { SoundToggle } from "../components/game/sound-toggle";
import { audio, zoneTrack } from "../lib/game/audio";

type Screen =
  | { name: "title" }
  | { name: "hub" }
  | { name: "zone"; zoneId: string }
  | { name: "boss"; zoneId: string; bossId: string };

type Overlay = "log" | "saves" | "youtube" | null;

function Index() {
  const progress = useProgress();
  const [, navigate] = useLocation();
  const [screen, setScreen] = useState<Screen>({ name: "title" });
  const [overlay, setOverlay] = useState<Overlay>(null);

  const goAbout = useCallback(() => {
    audio.stopMusic();
    navigate("/about");
  }, [navigate]);

  // Music follows the screen and the current activity. Browsers only let it
  // start after the first gesture, which is Press Start.
  useEffect(() => {
    if (overlay) {
      audio.playMusic("panel");
      return;
    }
    if (screen.name === "title") {
      audio.playMusic("title");
      return;
    }
    if (screen.name === "boss") {
      audio.playMusic("boss");
      return;
    }
    if (screen.name === "zone") {
      audio.playMusic(zoneTrack(screen.zoneId));
      return;
    }
    audio.playMusic("cartridge");
  }, [overlay, screen]);

  // Global shortcuts: L = log, K = save file, M = mute
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (screen.name === "title") return;
      const key = event.key.toLowerCase();
      if (key === "l") setOverlay((prev) => (prev === "log" ? null : "log"));
      if (key === "k") setOverlay((prev) => (prev === "saves" ? null : "saves"));
      if (key === "m") audio.toggleMuted();
      if (key === "escape" && overlay) setOverlay(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [overlay, screen.name]);

  const zone = screen.name === "zone" || screen.name === "boss"
    ? ZONES.find((z) => z.id === screen.zoneId)
    : undefined;
  const boss =
    screen.name === "boss" ? zone?.bosses?.find((b) => b.id === screen.bossId) : undefined;

  return (
    <div className="relative min-h-dvh">
      <SoundToggle />
      {screen.name === "title" && (
        <TitleScreen
          onStart={() => setScreen({ name: "hub" })}
          onAbout={goAbout}
          savedCount={progress.count}
          total={progress.total}
        />
      )}

      {screen.name === "hub" && (
        <HubScreen
          progress={progress}
          onEnterZone={(zoneId) => setScreen({ name: "zone", zoneId })}
          onOpenSaves={() => setOverlay("saves")}
          onOpenLog={() => setOverlay("log")}
          onAbout={goAbout}
        />
      )}

      {screen.name === "zone" && zone && (
        <ZoneScreen
          key={zone.id}
          zone={zone}
          progress={progress}
          onExit={() => setScreen({ name: "hub" })}
          onStartBoss={(bossId) => setScreen({ name: "boss", zoneId: zone.id, bossId })}
          onOpenYouTube={() => setOverlay("youtube")}
        />
      )}

      {screen.name === "boss" && boss && zone && (
        <BossFight
          boss={boss}
          progress={progress}
          onExit={() => setScreen({ name: "zone", zoneId: zone.id })}
        />
      )}

      {/* persistent bottom bar */}
      {screen.name !== "title" && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center pb-2">
          <div className="pointer-events-auto flex items-center gap-2 border-[3px] border-[#0b0817] bg-[#241a45]/95 px-2 py-1">
            <button
              type="button"
              onClick={() => setOverlay("log")}
              className="text-muted hover:text-lime px-2 text-[12px]"
            >
              ★ LOG {progress.count}/{progress.total}
            </button>
            <span className="text-[#4d3b85]">|</span>
            <button
              type="button"
              onClick={() => setOverlay("saves")}
              className="text-muted hover:text-gold px-2 text-[12px]"
            >
              💾 LINKS
            </button>
            <span className="text-[#4d3b85]">|</span>
            <button
              type="button"
              onClick={goAbout}
              className="text-muted hover:text-cyan px-2 text-[12px]"
            >
              SKIP ▸
            </button>
          </div>
        </div>
      )}

      {overlay === "log" && (
        <AchievementsPanel progress={progress} onClose={() => setOverlay(null)} />
      )}
      {overlay === "saves" && <SaveFile progress={progress} onClose={() => setOverlay(null)} />}
      {overlay === "youtube" && <YouTubePanel onClose={() => setOverlay(null)} />}
    </div>
  );
}

export default Index;
