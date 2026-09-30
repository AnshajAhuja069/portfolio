# Anshaj Ahuja — portfolio

Personal portfolio for Product Designer / UX Engineer roles.
Next.js 16 (App Router) · React 19 · TypeScript · CSS Modules · GSAP.

Homepage: **Hero → Selected work → Let's connect.** Each project has its own
statically prerendered case study at `/work/<slug>`: communities & messaging,
the Gamersberg brand identity (logo + Peak, with a scroll-driven iceberg
story), and the trading platform rebuild. `/resume` is a scroll-driven
journey map built from `src/content/resume.ts`, with buttons to view or
download the actual PDF. Accent colour: teal (`--accent`).

## Run it

Requires Node ≥ 20.9 (tested on 22.11) and npm.

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # production build (prerenders every page)
npm run start        # serve the build on :3000
```

Checks:

```bash
npm run lint
npm run typecheck
npm run build && npm run test:e2e   # Playwright smoke tests on :3100
```

The tests and the resume script drive the **installed Microsoft Edge**
(`channel: "msedge"`), so no browser download is needed. Use
`PW_CHANNEL=chrome` / `RESUME_BROWSER_CHANNEL=chrome` to use Chrome instead,
or run `npx playwright install chromium` and remove the `channel` option.

## Where to change things

| What | Where |
|---|---|
| Name, email, links, hero/work/contact copy, resume link | `src/content/profile.ts` |
| Projects, case-study text, statuses, covers, figures | `src/content/projects.ts` |
| Colours, type scale, spacing, motion tokens | `src/styles/tokens.css` |
| Fonts | `src/app/layout.tsx` (`next/font/google`) |
| Favicon / app icon | `src/app/icon.svg` (mascot face) + `src/app/apple-icon.png` |
| Background crystals / contours | `GALLERY_*` in `SelectedWork.tsx`, `JOURNEY_*` in `ResumePage.tsx` |
| Page titles / descriptions | `profile.meta` and each project's `title` / `summary` |
| Resume page (journey map, toolkit) | `src/content/resume.ts` |
| Resume file (the download) | `public/resume/Anshaj_Ahuja.pdf` — set `profile.resume` to `null` to hide every resume link |
| Hide or add a case study | `published` / `order` in `projects.ts` |

Animation code never needs to change for content edits.

### Replacing illustrative mocks with real work

All three case studies use real screens and artwork from
`public/images/work/<slug>/` (WebP, quality 90; Android status bars cropped).
Each decision can carry a `shot` (phone, browser or art frame) that the
page pairs with it; `live` adds the "See it live" address bar and dock. To use real screenshots, put files in
`public/images/work/<slug>/` and switch the project's `cover` (and any
`media` entries) to `kind: "image"`. Full steps and sizes:
[`docs/asset-manifest.md`](docs/asset-manifest.md).

### Replacing the mascot

`src/components/mascot/Mascot.tsx` is a provisional SVG. Keep the
`data-part` groups listed in the asset manifest and the blink, pointer-follow,
tap and greeting behaviour keep working.

## Structure

```
src/app/                 layout, home, /work/[slug], 404, icon
src/components/hero/     hero + colour-field transition
src/components/work/     gallery, covers (mock + identity), work motion
src/components/mocks/    illustrative interface screens
src/components/mascot/   layered SVG mascot + behaviour
src/components/contact/  contact ending, copy-email
src/components/case-study/ template, figures, reply demo, page motion
src/components/brand/    iceberg art + scroll story (brand case study)
src/content/             profile, projects, resume (all editable content)
src/components/resume/   /resume journey map
src/components/decor/    depth field: 3D ice crystals + contour lines
src/lib/gsap.ts          GSAP plugin registration + shared media queries
scripts/                 resume PDF build
tests/                   Playwright smoke tests
docs/                    content status, motion spec, assets, licences, verification
references/              private, git-ignored, never imported
```

## Notes

- Native scrolling only. The hero transition uses a CSS `position: sticky`
  stage (not JS pinning), so anchors, back/forward and scroll restoration
  work from the server-rendered layout.
- `prefers-reduced-motion: reduce` removes the colour field, parallax,
  reveals and mascot motion; all content is visible by default in CSS.
- No analytics, cookies, CMS or backend. Contact is `mailto:` plus a
  copy-to-clipboard button.
- Not deployed. No domain, canonical URL or social-preview image is set;
  add `metadataBase` in `src/app/layout.tsx` once there is a domain.
