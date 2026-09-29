# Asset manifest

What the site uses, where it comes from, and what should replace it.

## In use

| Asset | Location | Origin | Status |
|---|---|---|---|
| Mascot (of Anshaj) | `src/components/mascot/Mascot.tsx` (inline SVG) | Drawn in code for this site from the concept sheet; gradient shading, defined jaw, hover blush | **Provisional** |
| Gamersberg logo | `public/images/work/brand-identity/gamersberg-logo.png` (457×408, transparent, trimmed) | Supplied by Anshaj (29 Sep 2026) | Real work |
| Peak — rocket | `public/images/work/brand-identity/peak-rocket.png` (1030×1527; existing 408×605 display box retained) | AI-assisted refresh using Anshaj’s original pose and character sheet | Portfolio illustration |
| Peak — headset + controller | `public/images/work/brand-identity/peak-gaming.png` (1426×1103; existing 507×392 display box retained) | AI-assisted refresh using original poses and character sheet | Portfolio illustration |
| Peak — peeking | `public/images/work/brand-identity/peak-peek.png` (1117×1408; existing 192×242 display box retained) | AI-assisted refresh using original pose and character sheet | Portfolio illustration |
| Brand cover + iceberg story art | `src/components/work/IdentityCover.tsx`, `src/components/brand/*` | Real logo/Peak images + iceberg shapes drawn in code to explain the concept | Final unless you want changes |
| Project covers (communities, trading) | `src/components/work/Cover.tsx` with `kind: "screenshots"` | Supplied product screenshots in existing desktop/phone frames | Real screenshots; original layers and motion preserved |
| Published case-study figures | `public/images/*.png`, selected in `src/content/projects.ts` | Screenshots supplied by Anshaj, 29 Sep 2026 | Real screenshots; mock screens remain only in unpublished drafts |
| Reply demo | `src/components/case-study/demos/ReplyComposerDemo.tsx` | Built for this portfolio | Labelled "Interactive re-creation … not production code" |
| Resume PDF | `public/resume/anshaj-ahuja-resume.pdf` | Printed from `scripts/resume/resume.html` (content of the supplied .tex, phone removed) | Needs your review |
| Favicon + Apple touch icon | `src/app/icon.svg`, `src/app/apple-icon.png` (180×180, rendered from the SVG with sharp) | The site mascot's face on the teal disc | Final unless you want a change |
| Fonts | Archivo, Inter via `next/font/google` | Downloaded at build, served from this site | See `licences.md` |

## Refresh and references

### Refresh source mapping

- Community cover: `community server web.png` + `community server mobile app.png`.
- Community figures: desktop overview, mobile reply, `moible app reaction.png`, `mobile community server.png`, `community seevrer functionality.png`, and `community server stock page.png`.
- Trading cover: `trading web 2.png` + `trading mobile.png`.
- Trading figures: `trading web.png`, `trading web 2.png`, `trading mobile.png`, `trading mobile two.png`, and `trading calculator.png`.
- `communnty server web.png` remains unused because it duplicates chat coverage at lower clarity.
- Peak source reference: `public/images/work/brand-identity/mascot 3d map.png`. The three original pose files remain beside their replacements with `-original` suffixes. The logo is unchanged.
- Screenshot files are displayed without generative edits. Their original dimensions are recorded in the content model. Peak display dimensions are intentionally retained to preserve the existing composition; replacement rasters have almost identical aspect ratios at higher resolution.

### Private personal references (never published)

`references/` is outside `public/` and git-ignored. It holds a copy of the
concept sheet (`mascot-concept-sheet.png`). Nothing in `references/` is
imported by the site. Keep face photos here or elsewhere outside `public/`.

## Replacing project media

1. Put files in `public/images/work/<slug>/`, e.g.
   `public/images/work/community-servers/cover-desktop.webp` and
   `cover-mobile.webp`.
2. In `src/content/projects.ts`, change that project's `cover` to:

   ```ts
   cover: {
     kind: "image",
     desktop: { src: "/images/work/community-servers/cover-desktop.webp", width: 2400, height: 1650 },
     mobile: { src: "/images/work/community-servers/cover-mobile.webp", width: 1200, height: 1500 },
     alt: "Community server on desktop with the reply bar attached to the composer",
   },
   ```

   `width`/`height` must be the real pixel size (they reserve layout space).
3. For case-study figures, replace `media` entries with
   `{ kind: "image", image: { src, width, height }, caption, alt }`.
4. Once a project has real media, the "Illustrative mock" tags disappear
   automatically (they only render for `kind: "mock"`).

Recommended sizes
- Desktop cover: 16:11, ≥ 2400px wide, WebP/AVIF, < 400 KB.
- Mobile cover: 4:5, ≥ 1200px wide.
- Screen recordings: MP4/WebM, muted, with a poster image; keep under ~4 MB
  and don't autoplay offscreen (a `MediaFigure` video variant would need adding).

## Final mascot art — what to prepare

The code animates named layers, so a replacement SVG only needs the same
groups (`data-part` attributes) in a 200×200 viewBox, head centred around
x=100:

| `data-part` | Contents | Used for |
|---|---|---|
| `follow` | Everything below | Pointer follow (rotate ±2.5°, x ±3) |
| `shoulders`, `neck` | Sweater + neck | — |
| `nod` | Head and hair | Tap nod / greeting nod |
| `hair-back`, `hair-front` | Hair volume behind and fringe in front of the face | — |
| `head` | Face shape | — |
| `brows` | Both eyebrows | Brow lift on tap |
| `eyes` | Whites, pupils, lid lines | Blink (`scaleY`) around y=102 |
| `pupil` (×2) | Iris/pupil for each eye | Pointer follow (±2.6px) |
| `mouth` / `smile` | Neutral and smiling mouth paths | Cross-fade at the contact section and on hover |
| `blush` (×2) | Cheek ellipses, hidden by default | Hover (mouse) or tap (touch) |

Peak (the Gamersberg mascot) is separate from this site mascot and only
appears in the brand identity case study.

Export from Figma as SVG with "Include id/attributes" on, keep shapes as
paths, no embedded rasters. A future 3D version can replace `<Mascot/>` with
a lazily-loaded GLB component (R3F) taking the same props
(`expression`, `track`, `greetOnView`), with the SVG as its static fallback.

**Not possible with the current supplied art:** the concept sheet is one
flattened raster, so independent eye/brow/mouth animation of *that* artwork
isn't possible without redrawing it in layers.
