# Sunny Quest — build scratchpad

App: /home/user/sunny-quest (managed template, web only, port 4200)
Plan approved: SNES 16-bit RPG + arcade hub, 7 zones, 3 boss fights, achievements, save-file, /about skip page.
Client-side only (no DB/API) so it can eventually sit on sunnykgupta.github.io.

## Done
- design.md (design system)
- index.html (fonts Press Start 2P + VT323, meta)
- styles.css (retro theme tokens, pixel frames, CRT scanlines, animations)
- lib/game/sprites.ts (hand-authored pixel art + box-shadow renderer palette)
- lib/game/content.ts (7 zones, entities, dialogue, 30 facts, 3 bosses, links, YT video ids)
- hooks/use-progress.ts (localStorage discovery tracking)
- hooks/use-stage-scale.ts
- components/game/pixel-sprite.tsx
- components/game/ui.tsx (PixelBar, ProgressStrip, PixelButton, Panel)
- components/game/dialogue-box.tsx
- components/game/title-screen.tsx
- components/game/hub-screen.tsx
- components/game/zone-screen.tsx (walkable room, keyboard + touch D-pad)

## Next
- components/game/boss-fight.tsx
- components/game/achievements-panel.tsx
- components/game/save-file.tsx
- components/game/youtube-panel.tsx
- pages/index.tsx (state machine) + pages/about.tsx + app.tsx routes
- bun run lint / typecheck / build, then dev server on 4200, verify with mb, deliver

## Decisions
- No audio (user didn't select it)
- Touch D-pad included anyway for mobile usability
- Skipped the "60-80% student / highest CTC" story and current-employer mention per user
- Facts grounded in resume + user's brief only; no invented anecdotes

## Update (Aug 29) — voice + font pass
- Fonts: Press Start 2P now only for the SUNNY QUEST logo (`font-title`). Silkscreen is the UI/display font, DotGothic16 is body/dialogue. No UI text below 12px.
- Copy rewritten in Sunny's voice across content.ts, about.tsx, title/hub/zone/boss/dialogue/save-file/log/youtube components. Zero em-dashes or en-dashes in user-facing text (verified with grep).
- design.md typography and a new Voice section updated.
- lint, typecheck and build pass. Dev server on 4200 verified with screenshots: title, hub, zone 1, dialogue, /about.

## Update (Aug 29) — location + audio
- Zone 1 subtitle is now "Jamnagar, age 12". Pune stays only in the degree line (Pune University), which is accurate.
- Added chiptune audio: public/audio/{theme,zone,boss}.mp3 loops + {select,discover,hit,fail}.mp3 SFX, generated with the music/sound-effects commands.
- lib/game/audio.ts is a dependency-free manager: per-screen looping music, one-shot SFX, mute persisted at localStorage "sunny-quest:muted". Music only starts after Press Start (browser autoplay rule).
- Wired: title (select + theme), hub/zone/boss music swap, interact = select, new fact = discover, boss damage = hit, boss loss = fail, boss win = discover.
- Mute toggle in the persistent bottom bar plus the M key. lint, typecheck, build pass. Verified in browser: audio files serve 200, bottom bar shows SOUND ON.

## Update (Aug 29) — music per activity, calmer mix, prominent mute
- Volumes: music 0.13 (was 0.32), ducks to 0.05 under dialogue, SFX 0.20 to 0.24, footsteps 0.06. Tracks cross-fade over 700ms instead of cutting.
- 8 tracks generated: title, cartridge (zone select), walk-bedroom, walk-build, walk-steel, walk-cafe, boss (regenerated), panel (overlays). Plus a soft step blip.
- Zone to track map lives in lib/game/audio.ts (zoneTrack): bootloader=bedroom, startup-arena/first-principles-lab=build, scale-tower/war-room=steel, guild-hall/impromptu-cafe=cafe.
- Music now follows both screen and activity: overlays (log, links, YouTube) swap to panel.mp3 and swap back on close.
- Mute is a large SOUND ON/OFF button fixed top-right on every screen (components/game/sound-toggle.tsx), M key still toggles. Removed the tiny bottom-bar toggle.
- Old theme.mp3 and zone.mp3 deleted. All files re-encoded mono 80kbps: 4.9MB down to 2.5MB.
- lint, typecheck, build pass. Verified in browser: title.mp3, select.mp3 and cartridge.mp3 all fetched in sequence when moving title -> Press Start -> zone select.
