/**
 * Site-wide personal content. Edit copy and links here — no component or
 * animation code needs to change. Source/status for each fact is tracked in
 * docs/content-status.md.
 */

export const profile = {
  name: "Anshaj Ahuja",
  firstName: "Anshaj",
  positioning: "Product Engineer & UX Engineer",
  /** Current title, shown beside the positioning (hero intro, How I work). */
  currentRole: "Chief Product Officer at Gamersberg",
  /** The hero eyebrow cycles through these, in order. The first is the lead role. */
  roles: ["Product Engineer", "UX Engineer", "Product Designer"],
  location: "India",
  email: "anshajahujaa@gmail.com",
  phone: { display: "+91 89051 30393", href: "tel:+918905130393" },

  links: {
    linkedin: "https://www.linkedin.com/in/anshaj-ahuja-b528a11b6/",
    github: "https://github.com/Anshajgamersberg",
  },

  /**
   * Public resume. Set to `null` to hide every resume link on the site.
   * The file lives in /public/resume/.
   */
  resume: {
    href: "/resume/Anshaj_Ahuja.pdf",
    label: "Resume",
  } as { href: string; label: string } | null,

  hero: {
    /** Each entry is one deliberate line of the headline. */
    lines: ["Thoughtfully", "designed.", "Carefully", "built."],
    intro:
      "I’m Anshaj, Chief Product Officer at Gamersberg. I turn product problems into clear requirements, design the experience and build the frontend in React, Next.js and React Native, working with engineering from first spec to release.",
    cue: "See 4 case studies",
  },

  work: {
    title: "Selected work",
    intro:
      "Four pieces of work from Gamersberg, which grew from about 200K to 1.5M registered users while I was there. Each one separates what I built, what I specified for engineering and what the wider team owned.",
  },

  contact: {
    heading: "Let’s connect.",
    lead: "Hiring for product engineering, UX engineering or product design? I’m happy to walk you through how any of this was scoped, designed and built.",
  },

  /** Homepage "How I work": three disciplines, one loop. */
  approach: {
    eyebrow: "How I work",
    title: "Product, design and code in one loop.",
    pillars: [
      {
        title: "Product",
        body: "I scope and prioritise platform features with leadership and engineering, and write the requirements, edge cases and backend dependencies before anything is built. I review release readiness across web and mobile.",
      },
      {
        title: "Design",
        body: "Flows, interaction states and component systems in Figma, designed so the same patterns hold from desktop to phone.",
      },
      {
        title: "Engineering",
        body: "Production frontends in React, Next.js, React Native and TypeScript: reusable components, responsive layouts and API integration with the backend team.",
      },
    ],
    /** Stated as working knowledge: done alongside the backend engineers. */
    data: "Working knowledge of SQL (PostgreSQL), GCP deployments and CI/CD, from working alongside our backend engineers.",
  },

  meta: {
    /** Production origin, used for canonical URLs, Open Graph and the sitemap. */
    siteUrl: "https://portfolioanshaj.vercel.app",
    title: "Anshaj Ahuja · Product Engineer & UX Engineer",
    description:
      "Chief Product Officer at Gamersberg. I turn product problems into requirements, design the experience and build web and mobile frontends in React, Next.js and React Native.",
  },
};

export type Profile = typeof profile;
