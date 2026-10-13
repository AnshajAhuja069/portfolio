/**
 * Resume content for the /resume journey page.
 *
 * Source: Anshaj_Ahuja_Resume_BCG.tex (supplied 13 Oct 2026), which is also the
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
    "Frontend developer and UX engineer building responsive web and mobile applications with React, Next.js, React Native and TypeScript. I rebuilt Gamersberg’s trading frontend, implemented its community messaging interactions and built its CMS dashboard, turning product requirements into reusable components, API specifications and integrated interfaces with the backend team.",

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
        "Rebuilt the trading platform’s legacy frontend around reusable components and responsive layouts for offers, requests and item comparison.",
        "Adapted web layouts and interaction patterns into the mobile app’s first interface.",
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
        "Implemented responsive community and messaging interfaces across web and React Native: channel navigation, replies, reactions, message actions, attachments and unread states.",
        "Designed and built the CMS dashboard and reusable content templates for game pages, including the interface and content logic, and specified the backend APIs it required.",
        "Translated product requirements into technical documentation for engineering, specifying API endpoints and data needs and planning feature architecture for message search, content history and read-state sync.",
        "Ran Lighthouse and other performance audits on web interfaces and documented findings and recommendations for the engineering team.",
        "Led product and UX direction across game communities, Rooms, discussions and rewards. Registered users grew from about 200K to 1.5M during my tenure, and the Android app passed 50K Google Play downloads.",
        "Created the Gamersberg logo and its mascot, Peak, around an iceberg and an infinity mask.",
      ],
      tags: ["Frontend delivery", "Community & messaging", "CMS", "API specs", "Brand identity"],
      links: [
        { label: "Communities", href: "/work/community-servers" },
        { label: "Brand identity", href: "/work/brand-identity" },
      ],
    },
  ] satisfies JourneyStop[],

  skills: [
    {
      group: "Frontend",
      items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "shadcn/ui", "Framer Motion"],
    },
    {
      group: "Mobile & engineering",
      items: ["React Native", "Expo", "REST API integration", "Jotai", "API requirement specs", "Lighthouse audits", "Git", "GitHub"],
    },
    {
      group: "Design & tools",
      items: ["Figma", "User flows", "Interaction design", "Claude", "Codex"],
    },
  ],
};
