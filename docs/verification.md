# Verification report

Last run 29 Sep 2026 (round 3: heading clipping fix, `/resume` journey map,
negative wordmark, phone hero, depth-field background, corrected links,
mascot favicon). Windows 11, Node 22.11, npm 10.9. Browser for all automated
checks: **Microsoft Edge 154 (Chromium)** via Playwright.
**Not tested:** Safari/WebKit, Firefox, real phones or tablets, screen readers.

## Build and static checks

| Check | Result |
|---|---|
| `npm run lint` | 0 errors, 0 warnings |
| `npm run typecheck` | Pass |
| `npm run build` | Pass — `/`, `/resume`, 3 case studies, 404, `icon.svg`, `apple-icon.png` prerendered |

## Playwright smoke tests (`tests/smoke.spec.ts`)

Production build on :3100; desktop 1440×900 and mobile 390×844 (touch).
**33 passed, 7 skipped** (desktop-only checks in the mobile project), 0 failed.
The back-navigation test now polls for scroll restoration (it was flaky
under parallel load with a single 800 ms sample).

New this round:
- `/resume` loads with one `<h1>`, shows the journey, links to the real PDF (view + `download`), and the nav's Resume link points to `/resume`.
- Wordmark: `mix-blend-mode: difference` on paper; switches to the solid state (`normal`) over the teal work intro.
- Overflow check now includes `/resume` at 360–1920px.

## Visual checks (Edge screenshots)

| What | Result |
|---|---|
| Case-study titles (desktop + 390) | Descenders (g, y, p) fully visible after the line reveal. |
| Layout shift from line splitting | Fixed: `/resume` header height identical with and without JS; 0 layout shifts recorded (was 0.083). |
| Wordmark across the homepage | Dark pill on paper, light pill on ink, solid ink pill over teal (hero field, work intro, teal cover). |
| Phone hero (390×844, 360×640) | Stage now holds; field grows from the mascot and inverts the headline in view. |
| `/resume` (1440, 390) | Spine fills, mini mascot rides it, dates light up, cards slide in; contours + crystals behind. |
| Depth field (home + resume, 1440 + 390) | 3D crystals turn and drift at the edges; contours draw in; kept clear of text columns. |
| Favicon | Mascot face readable at 32px. |

## Lighthouse 12 (Edge headless, local production server)

Mobile = simulated slow 4G + 4× CPU. Lab numbers on one shared machine;
repeated runs varied by up to ±10 performance points.

| Page | Perf | A11y | BP | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| `/` desktop | 100 | 100 | 100 | 100 | 0.7 s | 0 ms | 0 |
| `/` mobile | 91 | 100 | 100 | 100 | 3.3 s | 130 ms | 0 |
| `/resume` desktop | 98 | 96* | 100 | 100 | 0.7 s | 0 ms | 0.085 → 0 after fix |
| `/resume` mobile | 76 | 96* | 100 | 100 | 3.4 s | 630 ms | 0.002 |
| `/work/community-servers` mobile | 95 | 97* | 100 | 100 | 2.9 s | 60 ms | 0.004 |
| `/work/brand-identity` mobile | 94 | 96* | 100 | 100 | 3.1 s | 60 ms | 0.004 |
| `/work/trading-platform` mobile | 90 | 96* | 100 | 100 | 3.2 s | 120 ms | 0 |

\* The only accessibility finding is `color-contrast` on the name pill. The
checker ignores `mix-blend-mode`: it compares the pill's black text
against the *blended* background (#0a0d14 → 1.08:1). On screen the text
shows the surface colour (paper on a near-black pill ≈ 17:1; ink on a light
pill ≈ 14:1), and over teal the pill switches to solid ink/paper. It's a
tool limitation, but some automated audits will keep flagging it.

`/resume` mobile is the heaviest page (two mascots, journey motion, 3D
crystals, contour SVGs): ~630 ms TBT under 4× CPU throttle. Investigated:
layout cost is the same with JS off or sections removed, so it's baseline
for this machine; heading splits are now lazy (only when on screen) and
ScrollTriggers were merged where possible.

## Known limitations

- Communities and trading visuals are illustrative mocks.
- The site mascot is a provisional drawing.
- Automated contrast tools flag the negative wordmark (see above).
- No domain / Open Graph image yet.
