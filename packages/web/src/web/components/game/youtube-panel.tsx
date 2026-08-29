import { useState } from "react";
import { YOUTUBE_VIDEOS } from "../../lib/game/content";
import { Panel, PixelButton } from "./ui";

export function YouTubePanel({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState(YOUTUBE_VIDEOS[0]);

  return (
    <Panel
      title="FROM FIRST PRINCIPLES / YOUTUBE"
      onClose={onClose}
      wide
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-muted font-body text-[18px]">
            Season 1: Computers &amp; Software, from the ground up.
          </span>
          <PixelButton href="https://www.youtube.com/sunnykgupta" active>
            ▶ Subscribe on YouTube
          </PixelButton>
        </div>
      }
    >
      <div className="border-[3px] border-[#0b0817] bg-black">
        <div className="relative aspect-video w-full">
          <iframe
            key={current.id}
            src={`https://www.youtube-nocookie.com/embed/${current.id}`}
            title={current.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {YOUTUBE_VIDEOS.map((video) => (
          <button
            key={video.id}
            type="button"
            onClick={() => setCurrent(video)}
            className={`pixel-btn ${
              current.id === video.id ? "pixel-btn-active" : ""
            } p-3 text-left text-[14px] leading-relaxed`}
          >
            {current.id === video.id ? "▶ " : "· "}
            {video.title}
          </button>
        ))}
      </div>
    </Panel>
  );
}
