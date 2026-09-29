# Motion specification

Written before implementation; values are starting points and get tuned by
testing the real build. Update this file when a value changes.

## Global rules

- **Ownership.** GSAP owns every scroll-linked or choreographed transform,
  clip-path and opacity. CSS owns only simple hover/focus colour and
  underline transitions. No element property is animated by both.
- **Scope/cleanup.** Every effect is created inside `useGSAP` with a scope
  ref, and inside `gsap.matchMedia()` so breakpoints and reduced motion are
  reverted automatically. React Strict Mode double-mounts are safe because
  `useGSAP` reverts its context on unmount. Event handlers that create
  animations are wrapped with `contextSafe`.
- **Visible by default.** CSS renders every piece of content in its final,
  readable state. Animations only ever animate *from* an offset state, so if
  JavaScript or GSAP fails, nothing stays hidden.
- **Breakpoints.** `desktop = (min-width: 900px)`,
  `mobile = (max-width: 899.98px)`,
  `reduce = (prefers-reduced-motion: reduce)`. Desktop/mobile effects are only
  registered when `reduce` does not match.
- **Layout refresh.** `ScrollTrigger.refresh()` after `document.fonts.ready`.
  Images reserve their size, so they do not change layout after load.
- **No per-frame React state.** Pointer-driven motion uses `gsap.quickTo`.

## Effects

### 1. Hero field + text inversion (desktop)
| | |
|---|---|
| Purpose | Turn the hero into the work section with one confident colour move; show the headline changing colour exactly where the field passes. |
| Technique | CSS `position: sticky` stage inside a taller track (no ScrollTrigger pin, so no pin-spacer and a stable server-rendered layout). Two stacked layers render the same hero content: base (paper bg, ink text) and overlay (accent bg, paper headline, ink small text; `aria-hidden` + `inert`). The overlay is clipped with `clip-path: circle()` centred on the mascot disc. |
| Trigger | ScrollTrigger on the track, `start: top top`, `end: bottom bottom`, `scrub: 0.6`. |
| Start | Circle radius = mascot disc radius (overlay looks exactly like the disc). |
| End | Circle radius = distance from disc centre to the farthest viewport corner (+2%). |
| Distance | Track = `100svh + 90svh`, so ≈ 0.9 viewport of sticky scrolling. |
| Easing | `none` on the scrub (distance maps linearly to radius); scrub smoothing 0.6s. |
| Secondary | From 72%→100% of the track (circle already full): both layers + mascot move `y: -6vh` together, handing over to the accent "Selected work" band below. |
| Mobile | No sticky track (hero is 92svh so the accent band peeks in). Same overlay/circle, scrubbed from `top top` to `bottom 40%` while the hero scrolls away normally. |
| Reduced motion | Overlay hidden; the static disc + hero remain; the work band follows in normal flow. |

### 2. Gallery cover reveal + layered parallax
| | |
|---|---|
| Purpose | Give each project an art-directed arrival and a sense of depth. |
| Trigger | Each cover: `start: top 92%`, `end: top 38%`, `scrub: 0.5`. |
| Start → end | `clip-path: inset(8% 6% 8% 6% round 28px)` → `inset(0% 0% 0% 0% round 20px)`. |
| Layers | Back layer `yPercent: 6 → -6`, front layer `yPercent: 14 → -10` over the cover's whole pass through the viewport (`top bottom` → `bottom top`, scrub). |
| Labels | Once on enter (`top 82%`): `y: 24 → 0`, `opacity: 0 → 1`, 0.6s, `power3.out`, 0.06s stagger. |
| Mobile | No clip reveal, no parallax. Labels reveal once (0.5s). Covers use the mobile crop. |
| Reduced motion | Nothing animates. |

### 3. Gallery hover tilt
| | |
|---|---|
| Purpose | Small tactile response on pointer devices. |
| Condition | `(hover: hover) and (pointer: fine)` and not reduced. |
| Behaviour | `rotateX`/`rotateY` ≤ 2.5°, following pointer position over the cover; `quickTo` 0.25s `power3.out`; resets to 0 on leave. `transformPerspective: 1400`. |
| Mobile / touch | Off. |

### 4. "Let's connect." entrance
| | |
|---|---|
| Purpose | Close the page with the same typographic confidence. |
| Technique | GSAP `SplitText` (`type: "lines,words"`, `mask: "lines"`, `aria: "auto"` so screen readers get the full sentence once). |
| Trigger | `top 78%`, **once**. |
| Start → end | words `yPercent: 110 → 0`, 0.8s, `power4.out`, stagger 0.06. |
| Mobile | Same, 0.6s. |
| Reduced motion | No split; static text. |

### 5. Mascot
| | |
|---|---|
| Blink | Eyes `scaleY 1 → 0.1 → 1` (0.07s down, 0.1s up) on a random 2.8–6s timer. |
| Pointer follow | Fine pointers only. Pupils ±2.6px, head `rotation` ±2.5°, head `x` ±3px. `quickTo` 0.5s `power3.out`. Driven by one `pointermove` listener per mascot. |
| Tap | Brows `y: -3` and head nod (`rotation` +4° then back), 0.18s + 0.35s. Cosmetic only. |
| Contact | On first view: neutral mouth → smile (crossfade 0.25s) + one small nod. |
| Pausing | IntersectionObserver stops the blink timer and pointer listener offscreen; `visibilitychange` stops it when the tab is hidden. |
| Reduced motion | Fully static (contact still shows the smile, without motion). |

### 6. Reply demo (case study 1)
| | |
|---|---|
| Purpose | Let visitors try swipe-to-reply and the attached reply state. |
| Technique | Pointer events; a drag is only claimed when it is clearly horizontal and rightward (`dx > 8` and `|dx| > 1.3·|dy|`), with `touch-action: pan-y` so vertical scrolling stays native. GSAP `set` follows the finger; release springs back with `gsap.to` 0.25s `power3.out`. Trigger distance 56px, max 84px. |
| Alternative | Every message has a visible **Reply** button (keyboard / mouse). Escape cancels a reply. |
| Reduced motion | Same behaviour; the spring-back is short and user-initiated. |

### 8. Work section extras
| Effect | Spec |
|---|---|
| Title drift | "Selected work" `xPercent 3 → -5` across its pass through the viewport, scrub 0.6. Desktop only. |
| Crossing tapes | Two rotated bands (−3°, +2.2°) straddling the teal→ink boundary; tracks move `xPercent 0 ↔ -33.33` in opposite directions, scrub 0.6. Scroll-linked only (never moving on their own). Decorative, `aria-hidden`. Off with reduced motion. |
| Line reveals | Section title, project index numbers and titles: SplitText `lines` + `mask`, `yPercent 110 → 0`, 0.9s `power4.out`, stagger 0.08, once at `top 88%`. `aria: "auto"`. |
| Mid layer | Brand cover logo `yPercent 5 → -4` (between back and front). |
| Cursor pill | Fine pointers ≥ 900px: a teal "View case study" pill follows the pointer over covers (`quickTo` 0.35s), scales in with `back.out(2)`. Decorative; the real link is the CTA. |
| Magnetic buttons | `[data-magnetic]` pills pull ≤ 10px toward the pointer (0.35s `power3.out`), spring back with `elastic.out(1, 0.45)`. Applied through CSS `translate`, so it never conflicts with GSAP transforms. Fine pointers, motion allowed. |

### 9. Case-study pages
| Effect | Spec |
|---|---|
| Reading progress | 3px teal bar, `scaleX 0 → 1` over the page, scrub 0.3. Runs with reduced motion (informative). |
| Title | SplitText line reveal (as §8). |
| Preview settle | Desktop: cover `scale 0.92, y 40 → 1, 0` from `top bottom` to `top 25%`, scrub 0.5. |
| Section reveals | Section content `y 28 → 0`, fade, 0.7s, stagger 0.07, once at `top 85%`. |
| Sticky labels | Desktop: section labels stick under the nav (CSS). |

### 10. Brand story ("Surface, depth and a mask")
| | |
|---|---|
| Layout | Desktop: steps scroll on the left, scene sticky on the right. Mobile: scene sticky under the nav, steps scroll beneath. |
| Trigger | Steps list `top 55%` → `bottom 60%`, scrub 0.8. |
| 1 Surface | Drawn iceberg tip rises `y 46 → 0`. Depth pill reads "Surface". |
| 2 Depth | Camera pans `y 0 → -300` (the underwater mass); pill counts to "90% below". |
| 3 Mask | Camera returns; ∞ strokes on (`strokeDashoffset`), mask pops in (`back.out(1.6)`), ∞ fades. |
| 4 Peak | Drawing cross-fades into the real logo, which slides left; Peak card rises in. |
| Active step | Current step at full opacity, others 55% (only while JS runs). |
| Reduced motion / no JS | Static final scene (logo + Peak), all steps full opacity, nothing sticky. |

### 11. Mascot hover
Mouse/pen hover: blush fades to 60% and the smile cross-fades in (0.3s);
leaving restores the resting face. Touch: tap blushes for 1.4s.
Reduced motion: the same states without transitions.

### 13. Resume journey map (`/resume`)
| | |
|---|---|
| Spine | Teal line `scaleY 0 → 1` from the map's `top 55%` to `bottom 55%`, scrub 0.5. |
| Traveler | Mini mascot rides the spine (`y` over the same range). Static/hidden with reduced motion. |
| Stops | Node + outlined date light up teal when the stop's top passes 55% (reversible). |
| Cards | Desktop: slide in from their side (`x ±56`), mobile: rise (`y 36`), fade, 0.8s once. |
| Dates | Big outlined labels drift `yPercent 35 → -35` across each stop (depth). |
| Chips | Toolkit chips stagger in (0.025s). |

### 14. Negative wordmark
The name pill uses `mix-blend-mode: difference` (white fill, black text): it
shows the inverse of whatever passes under it. `SurfaceWatcher` reads the
nearest `[data-surface]` under the pill; over teal (`accent`) — where an
inverse is unreadable — it switches to a solid ink pill. The hero reports
when its growing circle covers the pill (checked once per frame).

### 15. Depth field (background)
| Element | Spec |
|---|---|
| Crystals | CSS-3D octahedra (8 faces, iceberg proportions: short tip, long mass below). One timeline per field: `rotationY −40° → 320°`, `rotationX 16° → −14°`, drift `yPercent ±(120·depth + 40)`, scrub 0.9. |
| Contours | Seeded topographic rings drawn ring-by-ring (`strokeDashoffset 1 → 0`, stagger 0.12) from `top 95%` to `center 35%`, with a slight rotation; labels fade in. Depth marks in the gallery, years on the journey map. |
| Mobile | Crystals 62% size, contours 70%; far elements hidden. |
| Reduced motion | Static, contours fully drawn. |

### 16. Hero on phones
Portrait phones (≥ 560px tall) now use the same sticky stage as desktop over
a `180svh` track, so the field fills while the hero is held in view. Short
screens (landscape) keep the unpinned scrub.

### 17. Simple interactions (CSS)
- Links/buttons: colour/underline transitions 180ms `cubic-bezier(.22,1,.36,1)`.
- Focus: 2px outline, 3px offset, always visible, never animated.

## Navigation readability
The links pill stays paper-coloured (ink text, ≈ 16:1) everywhere. The name
pill uses the negative blend described in §14.
