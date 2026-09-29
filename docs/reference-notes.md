# Reference notes

Internal authoring note. Not published.

Inspected on 29 Sep 2026 in the Claude desktop built-in browser (Chromium).
Desktop viewport ≈ 1024×768, mobile emulation 375×812.
Method: sampled screenshots at fixed scroll offsets + computed styles.
**Timing, easing and scrub-vs-time behaviour were not measured** — anything
about timing below is marked *inferred*.

## Palmer template — https://palmer-template.framer.website/

Observed
- Black page, white type. Display face: Inter Display 600.
  Section headings computed at 128px / 108px line-height / −6px tracking
  (≈ −0.047em, line-height ≈ 0.84) at 1024px width.
- Hero: short 4-line statement left, video right, then a full-bleed
  oversized name ("Akihiko™") running edge to edge.
- A large portrait follows the name, then a short bio line and a pill CTA.
- "Featured Works©" appears as a horizontal marquee band (text repeated,
  clipped at both edges).
- Project list: full-width cards stacked vertically. Each card = background
  image + centred smaller inset image + a white full-width label band
  ("Branding", "Web Design", "Creative Direction") crossing the card.
  Under each card: project name left, index "(01)" right.
- Hover over a card shows a small "VIEW" pill near the cursor.
- Footer: quick links, networks, then a giant "©2025".
- Mobile (375): same stacked card pattern at full width; labels stay
  visible. On first load the top of the page was **blank** for a moment —
  content is gated behind an entrance animation.

Inferred (not verified)
- Inset image likely moves at a different rate than its card (parallax).
- The marquee is likely time-based, not scroll-linked.

## Jastin Design — https://www.jastindesign.com/

Observed
- Light sage background. Manrope / Poppins.
- Hero: ghosted oversized "Aloha, I'm Jastin" marquee text behind a
  bold statement; illustrated mascot head to the right of the copy.
- Work: large colourful device-mockup tiles with title + one-line
  description beneath and an arrow.

## Gloria Ha — https://www.gloriaha.com/

Observed
- Grey/lime/purple palette; Krona One, Syne, Montserrat.
- Stamp/badge graphics, circular "scroll down" text.
- Stacked case-study rows: image left, company + project title + disciplines
  right, explicit "Read Case Study" button.

## Supplied screenshots

- "Jeremy Myskole" (video frame): off-white page, near-black grotesk set
  very large on two lines, the "O" replaced by a vermilion disc containing an
  eye — character integrated into the type. Small uppercase nav corners.
- The brief mentions a "colourful portfolio screenshot" — **not supplied**.

## What this build takes (proposal, not copy)

- From Jeremy: type confidence, lots of off-white space, a character that
  lives inside the composition on a vermilion disc.
- From Palmer: editorial scale, index numbers, a label band across each
  project cover, a giant closing statement.
- From Gloria: an explicit, always-visible case-study link per project.
- Avoided: gating the hero behind an intro (Palmer mobile), infinite
  marquees for navigation, template source or imagery of any kind.
