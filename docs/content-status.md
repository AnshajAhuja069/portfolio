# Content status

Private authoring record — **not** published on the site.
Last updated 29 Sep 2026.

## Content and imagery refresh — 29 Sep 2026

The current refresh supersedes the earlier placeholder-image and copy notes below.

- User supplied actual community and trading screenshots. Captions describe visible interfaces; screenshots do not establish research findings, measured outcomes, or authorship of every feature.
- Community copy now focuses on reply context, reactions, navigation and device-local pinning. The stock screen is supporting product context, not a new ownership claim.
- Trading copy describes offer/request structure, grid and list presentations, item previews, ratings and the calculator. Backend calculations remain outside the claimed contribution.
- Relevant account history (portfolio planning and Gamersberg product documentation) informs tone and the proposed reliability focus. Future product ideas are not presented as shipped work.
- Homepage, metadata, resume-page descriptions and surrounding brand copy were refined. Titles, dates, contact details and the downloadable resume were retained.
- The animated iceberg storyline and its motion remain unchanged. Peak illustrations were refreshed with AI assistance from the user-supplied character reference and original poses; this is portfolio presentation work, not evidence of newly shipped product assets.
- Original Peak renders are retained as `peak-rocket-original.png`, `peak-gaming-original.png` and `peak-peek-original.png`.
- Onboarding and participation drafts remain unpublished. No metrics or new research claims were added.

Legend
- **S** source-backed (supplied resume says so)
- **U** user-reported (from the brief, not in a resume)
- **P** provisional wording written for the site — needs your eyes
- **?** needs confirmation before it can be treated as fact

Sources
- `R1` = `product_designer_ux_engineer.tex` (28 Sep 2026, 11:37)
- `R2` = `product_engineer.pdf` (28 Sep 2026, 23:23 — newer)
- `B` = the build brief

---

## 1. Identity and contact

| Item | Value used | Status | Source |
|---|---|---|---|
| Name | Anshaj Ahuja | S | R1, R2 |
| Public location | India | S | R1 (R2 says "Rajasthan, India"; brief asks for "India") |
| Email | anshajahujaa@gmail.com | S | R1, R2 |
| LinkedIn | linkedin.com/in/anshaj-ahuja-b528a11b6 | U | Corrected by you on 29 Sep 2026 (resumes had an older URL) |
| GitHub | github.com/Anshajgamersberg | U | Corrected by you on 29 Sep 2026 (resumes had an older URL) |
| Phone | **not published** | — | present in R1/R2; removed from the public resume PDF |
| Positioning | Product Designer & UX Engineer | S | R1 heading, B |

## 2. Hero and site copy

| Copy | Status | Note |
|---|---|---|
| "Thoughtfully designed. Carefully built." | U | Working hero copy from the brief. |
| "I’m Anshaj, a product designer and UX engineer. I lead visual direction and build the interfaces behind it — from the first flow to the final interaction." | S + P | First half paraphrases R1's summary; the ending is the brief's wording. |
| Gallery intro: "Three workstreams from Gamersberg, a gaming platform on web and mobile, where I led visual and UX direction and built interfaces across both." | S + P | "Led visual and UX direction" = R1. "Gaming platform" is a description I chose — **?** confirm how you describe Gamersberg publicly. |
| "Have a product worth making better? Let’s talk." | U | Brief. |

## 3. Experience records (not shown as a timeline on the site)

| Record | Status | Note |
|---|---|---|
| Gamersberg — Chief Product Officer, Jul 2025–Present | **?** | In R1 and R2. Brief: keep provisional, don't publish chronology. The site shows **no titles or dates**; the resume PDF (built from R1) does list it. |
| Gamersberg, Mar–Jul 2025 | **?** | **Title conflict:** R1 "User Interface Engineer", R2 "Product Engineer". The public PDF uses R1's title. Confirm which is correct. |
| Benepik Technologies — Associate UI/UX Designer, Aug 2024–Mar 2025 | S | Not featured on the site. R2 adds a spin-wheel for a Hero FinCorp festive bonus event — **not used** (client name, no assets). |
| Jai Kisan — UI/UX Graphic Designer Intern, Feb–Apr 2024 | S | Not featured. |
| BCA, Christ University, Bengaluru, 2024 | S | R2 gives 2021–2024. |

### Resume page (`/resume`, content in `src/content/resume.ts`)

You asked for a journey page built from the resume, so **titles and dates
are now public there** (the case-study pages still show contribution only).
It follows the public PDF (R1) plus R2's BCA years (2021–2024).

| Item | Status | Note |
|---|---|---|
| Gamersberg, Mar–Jul 2025: "User Interface Engineer" | **?** | R2 says "Product Engineer". Edit `resume.ts` + the PDF when confirmed. |
| Gamersberg, Jul 2025–Present: "Chief Product Officer" | S | R1, R2 |
| Tags on each stop (e.g. "Legacy redesign") | P | Short labels drawn from each role's bullets |
| "Now — Designing the experience. Building the interface." | P | Closing line, not a claim |
| Updated resume | — | You mentioned sending a newer one: replace `public/resume/anshaj-ahuja-resume.pdf` and update `resume.ts` (or send it and I'll do both) |

## 4. Numbers deliberately not used

- R2: "Gamersberg grew from approximately 200K to 1.5M registered users", "Android app reached 50K+ Google Play downloads".
  Brief: don't present platform traffic as a personal achievement. **Not used anywhere.**
  **?** Say if you'd like them used as neutral context (e.g. "a platform with 1.5M registered users").

## 5. Case studies

All three are Gamersberg workstreams (stated on the gallery and each page).
Order: 01 Communities, 02 Brand identity, 03 Trading.
Every "Decision → Interface → Behaviour" line and every reflection is **P** —
phrased from the delivered work, but the rationale is my wording. Please read
them as drafts in your voice.

### 01 Community servers & mobile messaging — `community-servers`

| Claim | Status | Source |
|---|---|---|
| Designed and implemented a community-server refresh: chat, navigation, member lists, composers, mobile interaction states | S | R1 |
| Reply and reaction flows, message actions, unread states, avatar decorations | S | R2 ("shaped") |
| Shared theme tokens and typography | U | B |
| Long-press server/channel menus; reply & edit composer states; swipe-to-reply; quick + expanded reactions; attachment controls; emoji/GIF/sticker access; jump-to-latest; navigation states; profile transitions; local channel pinning | U | B ("user-reported delivered work") |
| Web **and** React Native implementation | U + S | B ("built and refined web and React Native interfaces"); **?** confirm which items were web, mobile or both |
| Pinning is device-only, not synced | U | B |
| Team built backend: search, thread infrastructure, media-history endpoints | **?** | Brief says not to claim these; the page attributes them to the team — confirm that framing |
| Scope badges all say "Designed & built" | **?** | Confirm each item actually shipped to users |
| Collaborators: "The Gamersberg product and engineering team" | P | Generic on purpose; add names/roles only if you want |
| Avatar decorations | — | In R2, not yet on the page |

### 02 Brand identity, logo & Peak — `brand-identity`

Source `C` = your message of 29 Sep 2026 (logo, Peak renders and the concept).

| Claim | Status | Source |
|---|---|---|
| Directed the product identity, mascot and app-store visuals | S | R1 |
| You created the Gamersberg identity: the logo and the mascot, Peak | U | C ("the whole identity that I have created in Gamersberg"). R1 says "directed" — the page says "I built it around one idea" / "created". **?** confirm wording |
| Concept: Gamersberg as an iceberg — show the surface, do the deep research underneath | U | C |
| Logo inspired by iceberg patterns + an infinity mask; "infinity is the limit" / sky is the limit | U | C |
| Mascot named Peak, inspired by the iceberg design, wears the infinity mask = gamers' online identity | U | C |
| Peak poses: rocket, headset, controller, peeking over a card edge | U | The four supplied images |
| "About 90% of an iceberg sits below the waterline" | General fact | Used as the metaphor (commonly cited ≈ 87–90%) |
| Constraints ("small mark and full character", "poseable") and decision "Meaning" lines | P | My wording from your concept — please rewrite in your voice |
| Team line: "Applying the identity across the product, together with the Gamersberg team" | **?** | Not supplied — confirm or replace |
| Where Peak/logo are live today (site, app icon, store listing) | **?** | Not claimed on the page yet |
| Supplied renders are 408×605, 507×392 and 192×242 px | — | Fine at current sizes; higher-res exports would look sharper on retina screens |

### Unpublished — Discovery, onboarding & game hubs — `discovery-onboarding`

Removed from the gallery on your request (replaced by the brand identity
case study). Content kept in `projects.ts` with `published: false`; the
route returns 404.

| Claim | Status | Source |
|---|---|---|
| Onboarding UI implementation — front end complete, backend integration still required at the time | U | B |
| Game-selection interactions | U | B |
| Journeys connecting game discovery to communities, Rooms, discussions and giveaways (web + mobile) | S | R2 ("designed journeys") |
| Mapped onboarding and discovery experiences | S | R1 |
| Homepage content hierarchy — **proposal** | U | B ("may be a proposal") — **?** confirm proposal vs shipped |
| Landing/marketing pages — visual and UX direction | S | R1 |
| Current status of onboarding today | **?** | Page says "at the time"; update if it has since launched |

### 03 Trading platform rebuild — `trading-platform`

| Claim | Status | Source |
|---|---|---|
| Redesigned and rebuilt the dated trading interface from the ground up | S | R2 |
| Reusable UI patterns and a cohesive visual language | S | R2 |
| Helped adapt the new web experience into the initial mobile app flows | S | R2 |
| Early web UI and visual foundation for later releases | S | R1 |
| "Trading is where Gamersberg started, before it expanded into communities and content" | S + P | R2 ("expanded beyond trading", "from its trading platform revamp through communities…") |
| What is traded, specific screens, before/after | **?** | Nothing supplied — the page stays general on purpose |
| Team: "backend and trading services", "mobile app engineering beyond the initial flows" | **?** | Inferred from "helped adapt" — confirm |

### Draft (unpublished) — Participation & progression

Giveaways, quests, streaks, spin-wheel, Gbucks, profiles, badges.
`published: false` in `src/content/projects.ts`. Badges are planning only.
**?** Your specific contribution to each area.

## 6. Missing inputs

- Real Gamersberg screenshots / screen recordings for the communities and
  trading case studies (those visuals are **illustrative mocks**, labelled as
  such). The brand case study uses your real logo and Peak renders.
- Higher-resolution exports of the Peak renders (optional).
- The "colourful portfolio screenshot" mentioned in the brief (not attached).
- Final layered mascot art (see `asset-manifest.md`).
- Your review of the generated resume PDF (or your own compiled PDF).
- A domain, if/when you deploy (needed for canonical URLs and social previews).


## Round 4 (30 Sep 2026)

- Resume replaced by **Anshaj_Ahuja.pdf** (supplied). It resolves the title question: Mar to Jul 2025 is **Product Designer & UI Engineer**. The resume page follows it, including the CMS dashboard work, the Benepik spin-wheel for Hero FinCorp, and the platform growth figures (200K to 1.5M registered users, 50K+ Android downloads), which the resume states in your own words.
- All em and en dashes removed from site copy, metadata and alt text (the PDF itself is unchanged).
- Case studies now use your real screenshots; live links: gamersberg.com/community/blox-fruits and gamersberg.com/blox-fruits/trading.
- Decision copy was tightened; rationale lines remain my wording, please read them in your voice.
