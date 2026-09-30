/**
 * Resume content for the /resume journey page.
 *
 * Source: Anshaj_Ahuja.pdf (supplied 30 Sep 2026), which is also the
 * downloadable file in public/resume/. When the resume changes, replace the
 * PDF and update this file; the page rebuilds itself from this data.
 */

export type JourneyStop = {
  id: string;
  /** Big outlined label on the map (keep it short, e.g. "Feb ’24"). */
  year: string;
  /** Full date range. */
  period: string;
  kind: "education" | "work";
  title: string;
  org: string;
  place?: string;
  current?: boolean;
  highlights: string[];
  tags: string[];
  links?: { label: string; href: string }[];
};

export const resume = {
  heading: "The journey so far.",
  summary:
    "Product designer and UX engineer bridging interface design and front-end implementation across web and mobile. I rebuilt Gamersberg’s trading interface and shaped its community, messaging and content experiences, working across Figma, React, Next.js and React Native to turn user flows into cohesive interfaces and reusable components.",

  journey: [
    {
      id: "bca",
      year: "2021",
      period: "2021 to 2024",
      kind: "education",
      title: "Bachelor of Computer Applications (BCA)",
      org: "Christ University",
      place: "Bengaluru",
      highlights: [],
      tags: ["Computer applications"],
    },
    {
      id: "jai-kisan",
      year: "Feb ’24",
      period: "Feb 2024 to Apr 2024",
      kind: "work",
      title: "UI/UX Graphic Designer Intern",
      org: "Jai Kisan",
      place: "Bengaluru",
      highlights: ["Created interface mockups and visual assets for fintech products while keeping the brand consistent."],
      tags: ["Interface mockups", "Visual assets", "Fintech"],
    },
    {
      id: "benepik",
      year: "Aug ’24",
      period: "Aug 2024 to Mar 2025",
      kind: "work",
      title: "Associate UI/UX Designer",
      org: "Benepik Technologies",
      place: "Gurugram",
      highlights: [
        "Redesigned legacy product screens and worked with developers on responsive components and application data integration.",
        "Designed a spin-wheel interaction for a Hero FinCorp festive employee bonus event.",
      ],
      tags: ["Legacy redesign", "Responsive components", "Interaction design"],
    },
    {
      id: "gb-ui",
      year: "Mar ’25",
      period: "Mar 2025 to Jul 2025",
      kind: "work",
      title: "Product Designer & UI Engineer",
      org: "Gamersberg",
      place: "Remote",
      highlights: [
        "Redesigned and rebuilt the trading platform’s outdated interface from the ground up, creating reusable UI components and a cohesive experience across key screens.",
        "Helped establish the mobile app’s first interface, adapting the redesigned web flows and interactions for smaller screens.",
      ],
      tags: ["Trading rebuild", "Reusable components", "Mobile app"],
      links: [{ label: "Trading rebuild", href: "/work/trading-platform" }],
    },
    {
      id: "gb-cpo",
      year: "Jul ’25",
      period: "Jul 2025 to present",
      kind: "work",
      title: "Chief Product Officer",
      org: "Gamersberg",
      place: "Remote",
      current: true,
      highlights: [
        "Contributed product direction, UX design and hands-on UI implementation as the platform expanded into game communities, Rooms, discussions and rewards. Registered users grew from about 200K to 1.5M during my tenure, and the Android app passed 50K Google Play downloads.",
        "Designed and implemented web and mobile interactions for community servers and messaging: channel navigation, reply and reaction flows, message actions, attachments and unread states.",
        "Designed the CMS dashboard and reusable content templates that power game pages and connect tools, content and community destinations.",
        "Created the Gamersberg logo and its mascot, Peak, around an iceberg and an infinity mask.",
        "Worked with engineering to refine interaction details, test user flows and identify backend dependencies for search, content history and read state.",
      ],
      tags: ["Product direction", "Community & messaging", "CMS", "Brand identity"],
      links: [
        { label: "Communities", href: "/work/community-servers" },
        { label: "Brand identity", href: "/work/brand-identity" },
      ],
    },
  ] satisfies JourneyStop[],

  skills: [
    {
      group: "Design",
      items: ["Figma", "UI/UX design", "User flows", "Interface mockups", "Interaction design"],
    },
    {
      group: "Web & mobile",
      items: ["React", "Next.js", "React Native", "Expo", "TypeScript", "JavaScript"],
    },
    {
      group: "UI & tools",
      items: ["HTML", "CSS", "Tailwind CSS", "shadcn/ui", "Framer Motion", "Git", "GitHub", "Jotai"],
    },
  ],
};
