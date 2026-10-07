# Invitation engine
One engine, many invitations. Content = `src/invitations/<slug>.json`; look = CSS tokens under `[data-theme]` in `src/styles.css`.

- Add a couple: copy a JSON file, register it in `src/invitations/index.ts`, open `/?i=<slug>` (or serve at `/<slug>`).
- Reorder/remove sections with `scenes`. Scene components live in `src/Scenes.tsx` (registry at the bottom).
- RSVP: set `rsvp.endpoint` to a POST URL (Apps Script / serverless). Without one, replies are saved to localStorage (demo only).
- Run: `npm install && npm run dev`.
- Not yet done: self-hosted fonts and AVIF art (placeholders are vector), Tailwind/Framer Motion (not needed so far: CSS handles all motion, JS is ~68 KB gzipped).
