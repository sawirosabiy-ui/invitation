# Digital Invitation: Analysis & Blueprint

*Based on a frame-by-frame review of the 23s reference (a phone screen filmed in a hand). I could not analyze the audio track, so music is treated as unknown. A circular pause button visible from the cover onward shows the original has background music.*

---

## Phase 1. The reference, scene by scene

The real structure is shorter and more cinematic than the generic list. There is a **sealed-envelope prologue**, then **one continuous scroll** divided by torn-paper edges.

| # | Time | Scene | What happens |
|---|---|---|---|
| 1 | 0-2s | **Sealed envelope** | Dark burgundy envelope fills the screen. Faint embossed roses, thin gold X-fold lines, a blush wax seal with the monogram. Nearly static; the stillness invites a touch. |
| 2 | 2-3.5s | **Foil awakening** | Gold-foil florals "light up" out of the embossed pattern, as if a light sweeps across. Material change, not movement. |
| 3 | 3.5-7.5s | **Flap opens + light burst** | Top flap folds back. A warm white-gold glow rises from inside the envelope with radiating rays behind the seal. The foil leaves keep shimmering. This is the emotional peak. |
| 4 | 8-9.5s | **Cover** | Cross-dissolve into an arched, painterly garden scene: swans, roses, arch. "Wedding Day / 10.10.26", couple names in large burgundy script, "Scroll down" with a chevron. |
| 5 | 9.5-11s | **Invitation line** | A torn-paper edge slides up. Couple names in smaller script, "warmly invite you", one sentence naming the occasion. |
| 6 | 11-12.5s | **Countdown** | Script heading and a serif D:H:M:S counter with small labels. |
| 7 | 12-14.5s | **Schedule** | Vertical hairline with diamond nodes; time on the left, event on the right. **A rose marker travels down the line as you scroll.** The most original micro-interaction in the video. |
| 8 | 14-16s | **Venue** | Centered title, date/time, address, a sepia ink drawing of the building, then an embedded Google map. Loose petals drift near the title. |
| 9 | 16-18.5s | **Dress code** | One sentence on palette plus an illustrated group in the palette, framed by floral corners. |
| 10 | 18.5-20.5s | **RSVP** | Burgundy wax seal "RSVP" with "Click to open", then a sign-off with names and a rose border. |
| 11 | 20.5-23s | **RSVP form** | Plain modal: name, accept/decline radios, guest count, Submit. It breaks the spell. |

**Common language across scenes:**
- Typography: calligraphic script for emotion, wide-set serif for facts.
- Paper: blush paper with torn horizontal edges as scene dividers.
- Florals: used as corner anchors, never wallpaper.
- Wax seals appear **twice** (open, RSVP), which gives the story its bookends.
- Motion is slow and mostly opacity/translate; nothing bounces.

**What I would not copy:** the generic form (scene 11), the iframe map, and the stock-feeling illustrated groups.

---

## Phase 2. Video to product

| Element | Build as | Why |
|---|---|---|
| Envelope, flap, seal | Layered WebP/AVIF plates + CSS 3D transform (flap) + SVG seal | Crisp at any DPR, tiny, interactive |
| Foil "awakening" | Two stacked layers (dim emboss, gold foil) with an animated `mask-image` sweep | Same effect, ~0 JS |
| Light burst | Radial gradients + `mix-blend-mode: screen` + rotating ray conic gradient | No video, resolution-independent |
| Cover scene | One optimized illustration + slow parallax drift | |
| Torn-paper dividers | SVG masks reused across sections | |
| Countdown | React component, `setInterval` at 1s | Real data, accessible |
| Schedule rose | Scroll-linked transform (`useScroll`) | Signature micro-interaction |
| Map | Static styled image + "Open in Maps" deep links | Faster and more reliable than an iframe |
| RSVP | Bottom-sheet that feels like a reply card | See Phase 7 |

**Never as video:** the envelope opening (it must respond to the guest's touch, and video would be heavy on slow connections and forbid reduced-motion fallbacks), the countdown (must be live and selectable text), and anything containing text (accessibility, translation, SEO). The one acceptable video is an **optional 3-5s muted looped cover background**, only if it measurably adds something; I'd start without it.

---

## Phase 3. Signature interaction: the scratch date reveal

**Placement:** right after the invitation line. The guest has just been invited; now they *discover when*.

**Look:** three narrow cards (DAY / MONTH / YEAR), each a rose-gold foil panel with fine engraving texture and an embossed small-caps label. They sit on the blush paper like three lottery-free, letterpress tokens. No sparkles, no coins.

**Behavior**
1. Cards sit slightly overlapped and settle apart on entry (400ms).
2. Touch/drag wipes foil away (`destination-out`) with a soft 22px brush, revealing the numeral printed in script beneath.
3. At ~55% cleared (sampled every 150ms, low-res), the rest dissolves automatically so nobody has to chase corners.
4. A tiny `navigator.vibrate(8)` where supported; no sound.
5. Once all three are revealed, wait ~900ms, then the date settles into one line ("10 · October · 2026") and the page eases into the countdown. A "Add to calendar" link appears here, at peak delight.

**Accessibility & fallbacks**
- The real date is always in the DOM (visually under the foil, `aria-label` on each card).
- Each card is a focusable button: Enter/Space reveals it; a "Reveal all" text link appears if idle for 8s.
- `prefers-reduced-motion`: foil fades on tap, no drag required.
- Canvas is 1 per card, sized to the CSS box x DPR (capped at 2).

---

## Phase 4. Final experience map

**Principle:** an opening, a long exhale, and an invitation. Every screen answers one question.

```
0  SEAL          "You've received something."      (tap / hold to break seal)
1  LIGHT+COVER   "It's a wedding."                 (names, arch)
2  INVITE LINE   "...and it's you they're asking." (families, occasion)
3  DATE SCRATCH  "When?"                           (3 cards)
4  COUNTDOWN     "Soon."                           (live)
5  SCHEDULE      "How will the day go?"            (timeline + rose)
6  VENUE         "Where?"                          (drawing, address, map links)
7  DRESS CODE    "What to wear?"                   (optional module)
8  RSVP          "Will you come?"                  (seal, reply card)
9  THANK YOU     "We can't wait."                  (post-submit state, calendar, directions)
```

**Included but off by default (modules):** Story, Photos, Wedding party, Gift/registry note. Add only when the couple has real content; empty or filler sections hurt more than skipped ones.

**Cut from common wedding sites:** guestbook, FAQ accordion, hotel lists (put those in one optional "Good to know" card).

**Music:** one small toggle, **off until the guest taps**; never autoplay (browsers block it and it feels pushy).

---

## Phase 5. Design system ("luxury stationery")

**Color**
| Role | Token | Value |
|---|---|---|
| Primary | `--oxblood` | `#4A1420` |
| Secondary | `--burgundy` | `#7A2133` |
| Accent (foil) | `--rosegold` | `#C98F6B` -> highlight `#E8BE9A` |
| Paper | `--blush-paper` | `#F4E1DA` |
| Paper light | `--champagne` | `#FAF0E6` |
| Ink | `--ink` | `#3B2326` |
| Quiet text | `--ink-soft` | `#7B5C5C` |

**Typography direction:** script (Pinyon Script or Great Vibes class) *only* for names and section titles; a high-contrast serif (Cormorant Garamond or similar) for body; widely letterspaced small caps for labels. Self-host two weights, `font-display: swap`. Minimum body size 16px.

**Components**
- *Headings:* script, one size per level, never bold.
- *Body:* centered, 28-32 character measure on mobile, generous leading (1.6).
- *Buttons:* small, quiet: oxblood fill, champagne text, 2px radius, small-caps label. The primary RSVP "button" is the wax seal itself.
- *Cards:* paper-on-paper; 1px rose-gold hairline border, no drop shadow; at most a very soft 1-2px inset for the foil cards.
- *Textures:* subtle paper grain (inline SVG noise, <2KB), torn edges, embossed relief (light/dark offset pairs).
- *Florals:* corner-anchored sprigs, 2-3 reusable assets recolored via theme tokens.

**Motion language:** slow, soft ease-out (500-900ms), fade+rise of 12-16px, one thing moving at a time. The only "big" moments are the envelope and the date reveal.

**Spacing:** a 4px base, with big, ceremonial vertical gaps (96-128px) between scenes.

**Avoid (per brief):** gradients as decoration, glass, neon/glow (the light burst is the *one* permitted glow), icon clutter, big buttons.

---

## Phase 6. Responsive

- **Design targets:** 360, 390, 430 wide; use `100svh` for full-screen scenes (iOS toolbar-safe) and safe-area insets.
- Single column, fluid type via `clamp()`.
- **Tablet:** same column at max ~520px, centered, paper background fills the page.
- **Desktop:** the invitation becomes a **tall card ~440px wide, centered, over a darker oxblood backdrop** with a very faint envelope/paper texture and soft vignette: an invitation lying on a table, not a stretched phone layout. Optionally show the monogram seal and a short line in the margins on very wide screens; no extra content.

---

## Phase 7. RSVP

**Concept:** it's a **reply card** that slides up from the seal.

1. Tap the seal; it presses in slightly and a card rises as a bottom sheet (paper texture, rose-gold border).
2. Fields: *Name* -> *Joyfully accepts / Regretfully declines* (two large, tappable text choices, not radio dots) -> *Guests* (stepper, capped by the couple's setting) -> *Optional note* (single toggle expands message + dietary textarea).
3. Submit button: "Send reply."
4. Success: a small wax seal "stamps" onto the card, replaced by "Thank you, [name]."; offer calendar + directions.
5. Errors are inline, gentle, and keep inputs intact; submissions queue locally if offline and retry.

**Backend (MVP):** one serverless endpoint writing to a Google Sheet (or Supabase table). No accounts, no auth. Basic honeypot + rate limit. Guests identified by name only; an optional per-guest **personalized link** (`?g=abc`) can prefill the name later.

---

## Phase 8. Technical architecture

- **React + TypeScript + Vite:** requested stack, fast builds, small output.
- **Tailwind CSS:** theme tokens as CSS variables, so a theme is a variables file.
- **Framer Motion** (via `LazyMotion` + `m`): used for orchestration and scroll-linked values. CSS handles simple fades/transforms. *Justification:* the envelope sequence and scroll-linked rose are much cleaner with it.
- **Canvas (native, no library)** for scratch.
- **No router** (single page), **no state library**, **no UI kit**.
- **Images:** AVIF/WebP with `srcset`, blurred tiny placeholders, lazy-load below the fold; preload only the envelope plates.
- **Performance budget:** <180KB JS gzipped, hero scene visible in <2s on 4G, total first-load <1.2MB.
- **Accessibility:** semantic sections, visible focus, labels on every control, `prefers-reduced-motion` skips the envelope animation to a simple fade, sufficient contrast for small script text (use script only large).
- **Timers/battery:** countdown pauses when the tab is hidden.

---

## Phase 9. One engine, many invitations

**Configurable:** names, initials/monogram, date/time/timezone, schedule, venue (name, address, coords, map links, illustration), copy for every scene, photos, story, party, palette tokens, fonts, floral set, music, RSVP rules (deadline, max guests, endpoints), which modules are enabled, and the scene *order*.

```ts
interface Invitation {
  slug: string;
  theme: "burgundy-rose" | string;          // maps to a tokens file + asset pack
  couple: { a: Person; b: Person; monogram: string };
  families?: { label: string; names: string[] }[];
  occasion: { title: string; line: string };
  date: { iso: string; timezone: string };
  schedule: { time: string; title: string; note?: string }[];
  venue: { name: string; address: string; lat: number; lng: number; image?: string };
  dressCode?: { text: string; palette: string[] };
  story?: { title: string; body: string }[];
  photos?: { src: string; alt: string }[];
  party?: { name: string; role: string; photo?: string }[];
  music?: { src: string; title: string };
  rsvp: { enabled: boolean; deadline?: string; maxGuests: number; endpoint: string };
  scenes: SceneId[];                        // order + on/off
}
```
Content lives in `/invitations/<slug>/invitation.json`; a **theme** is `tokens.css` + an asset folder (envelope plates, florals, cover art, seal). The scene components never contain couple-specific text.

---

## Phase 10. Build plan

**1. Experience map:** see Phase 4.

**2. Component hierarchy**
```
<InvitationApp>
  <ThemeProvider>
    <Stage>                    // desktop table backdrop + centered card
      <EnvelopeScene/>         // Seal, Flap, FoilLayer, LightBurst
      <Scroll>
        <CoverScene/>
        <InviteLineScene/>
        <DateRevealScene/>     // ScratchCard x3
        <CountdownScene/>
        <ScheduleScene/>       // Timeline, RoseMarker
        <VenueScene/>
        <DressCodeScene/>
        <RsvpScene/>           // WaxSeal, ReplyCard
        <ThanksScene/>
      </Scroll>
      <MusicToggle/>
    </Stage>
  </ThemeProvider>
</InvitationApp>
```
Shared primitives: `Scene`, `TornEdge`, `ScriptHeading`, `Ornament`, `WaxSeal`, `useReducedMotion`.

**3. Page/section structure:** one scroll container; each scene is a `<section>` with its own entrance trigger (`IntersectionObserver`). The envelope is a fixed overlay that unmounts after opening, so it never costs scroll performance.

**4. Animation plan**
| Moment | Technique | Duration |
|---|---|---|
| Envelope idle | slow seal "breathing" (scale 1 to 1.01) | loop |
| Seal tap | press-in, crack mask | 400ms |
| Foil sweep | animated `mask-position` | 1.2s |
| Flap open | 3D rotateX on flap | 1.4s |
| Light burst | opacity + conic rotation | 1.5s |
| Envelope to cover | cross-dissolve + slight zoom | 900ms |
| Scene entrances | fade + 14px rise | 700ms |
| Scratch | canvas, no tween | live |
| Date to countdown | cards merge, line settles | 900ms |
| Rose marker | scroll-linked | live |
| RSVP sheet | spring-less ease-out slide | 500ms |
| Seal stamp (success) | scale 1.15 to 1 + fade | 450ms |

**5. Data model:** Phase 9.

**6. Dependencies:** `react`, `react-dom`, `typescript`, `vite`, `tailwindcss`, `framer-motion` (LazyMotion). Optional: `zod` (validate invitation JSON and RSVP payload). Nothing else for MVP.

**7. Folder structure**
```
src/
  engine/        // loadInvitation, sceneRegistry, types, theme loader
  scenes/        // one folder per scene
  components/    // WaxSeal, TornEdge, ScratchCard, Countdown, ...
  hooks/         // useCountdown, useReducedMotion, useScrollProgress
  themes/
    burgundy-rose/ tokens.css, assets/
  rsvp/          // client + schema
invitations/
  <slug>/ invitation.json, images/
api/rsvp.ts      // serverless handler
```

**8. Implementation order**
1. Project, tokens, fonts, `Stage`, config loader.
2. Static scenes with real content (cover through venue).
3. Countdown.
4. Scratch date reveal (isolated, tested on real phones early).
5. Envelope opening.
6. Schedule rose.
7. RSVP reply card + endpoint.
8. Thank-you, calendar file, map deep links.
9. Music toggle, reduced-motion paths, performance pass.
10. Second sample invitation to prove the engine.

**9. Risks**
- **Scratch canvas on iOS Safari:** touch scrolling conflicts (use `touch-action: none` on cards only), memory with many canvases.
- **Envelope art:** needs layered, high-quality assets; AI or stock art quality varies and licensing must be clean (I'd commission or generate original plates, not reuse the reference).
- **Heavy images on slow networks:** budgets and preloading discipline.
- **`100vh` and in-app browsers** (Instagram/WhatsApp webviews): test there; many guests open links from chat apps.
- **Time zones:** countdown must use the venue's timezone.
- **RSVP spam/abuse:** honeypot, rate limit.
- **Fonts:** script faces render poorly small; keep them large.
- **Music:** autoplay is blocked; keep it opt-in.

**10. MVP, build first**
Envelope -> cover -> invite line -> **scratch date reveal** -> countdown -> schedule -> venue -> RSVP -> thank-you, all driven by one JSON file and one theme. Defer story, photos, party, dress code and music until the core feels right on a real phone.

---

### Decisions for you
1. **Language/script:** one language, or bilingual copy?
2. **Art source:** commissioned/generated original envelope and cover art, or a simpler typographic cover for MVP?
3. **RSVP storage:** Google Sheet (easiest) or a small database?
4. **Date/time/venue/schedule:** what are the real values to seed the first invitation?
