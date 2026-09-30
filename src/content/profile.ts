/**
 * Site-wide personal content. Edit copy and links here — no component or
 * animation code needs to change. Source/status for each fact is tracked in
 * docs/content-status.md.
 */

export const profile = {
  name: "Anshaj Ahuja",
  firstName: "Anshaj",
  positioning: "Product Designer & UX Engineer",
  location: "India",
  email: "anshajahujaa@gmail.com",

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
      "I’m Anshaj, a product designer and UX engineer. I shape how products look, work and feel, then build the interfaces that bring those decisions to life.",
    cue: "See selected work",
  },

  work: {
    title: "Selected work",
    intro:
      "Three sides of my work at Gamersberg: the community, the brand and the trading tools. Each one runs from product and UX direction to the interfaces people use on web and mobile.",
  },

  contact: {
    heading: "Let’s connect.",
    lead: "Have a product challenge or a role in mind? Let’s talk design, details and what comes next.",
  },

  meta: {
    title: "Anshaj Ahuja · Product Designer & UX Engineer",
    description:
      "Product design and UX engineering by Anshaj Ahuja. Explore Gamersberg’s community interfaces, trading experience, and the identity behind its mascot, Peak.",
  },
};

export type Profile = typeof profile;
