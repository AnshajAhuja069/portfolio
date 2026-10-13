/**
 * Site-wide personal content. Edit copy and links here — no component or
 * animation code needs to change. Source/status for each fact is tracked in
 * docs/content-status.md.
 */

export const profile = {
  name: "Anshaj Ahuja",
  firstName: "Anshaj",
  positioning: "Frontend Developer & UX Engineer",
  /** The hero eyebrow cycles through these, in order. The first is the lead role. */
  roles: ["Frontend Developer", "UX Engineer", "Product Designer"],
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
      "I’m Anshaj, a frontend developer and UX engineer with a product designer’s eye. I build responsive web and mobile interfaces in React, Next.js and React Native, and shape how they look, work and feel.",
    cue: "See 3 case studies",
  },

  work: {
    title: "Selected work",
    intro:
      "Three sides of my work at Gamersberg: the community and the trading tools I built on web and mobile, and the brand behind them. Each one shows what I implemented, what the team owned and how it was checked.",
  },

  contact: {
    heading: "Let’s connect.",
    lead: "Have a product challenge or a role in mind? Let’s talk design, details and what comes next.",
  },

  meta: {
    title: "Anshaj Ahuja · Frontend Developer & UX Engineer",
    description:
      "Frontend development and UX engineering by Anshaj Ahuja. Explore Gamersberg’s community and messaging interfaces, the trading rebuild, and the identity behind its mascot, Peak.",
  },
};

export type Profile = typeof profile;
