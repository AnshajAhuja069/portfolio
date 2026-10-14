/**
 * Resume content for the /resume journey page.
 *
 * Sources: anshaj_product.pdf and Anshaj_Ahuja_Amex_GRC_Resume.tex (14 Oct
 * 2026), the BCG resume (13 Oct 2026) and facts confirmed in chat:
 * community messaging was implemented by Anshaj; the Mar to Jul 2025 title is
 * "Product Designer & UI Engineer"; SQL, GCP and CI/CD are working knowledge
 * gained alongside the backend engineers. Tailored resumes may change
 * emphasis, never titles, dates or employers.
 *
 * Keep scripts/resume/resume.html (the downloadable PDF) in step with this
 * file; the page rebuilds itself from this data.
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
    "Product and UX engineer, currently Chief Product Officer at Gamersberg. I translate business needs into requirements and technical documentation, design the experience, and build responsive web and mobile interfaces in React, Next.js, React Native and TypeScript. I rebuilt Gamersberg’s trading frontend, implemented its community messaging and designed its CMS dashboard, coordinating delivery with the backend team.",

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
        "Analysed enterprise workflows and redesigned legacy screens with clearer information hierarchy, navigation and standardised components, working with developers on implementation.",
        "Designed and specified the interaction states for a Hero FinCorp employee rewards experience.",
      ],
      tags: ["Enterprise workflows", "Standardised components", "Interaction design"],
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
        "Partner with leadership and engineering to scope platform capabilities, prioritise requirements and coordinate delivery across web and mobile.",
        "Led product and UX direction as the product grew from trading into game communities, Rooms, content and rewards. Registered users grew from about 200K to 1.5M during my tenure, and the Android app passed 50K Google Play downloads.",
        "Implemented responsive community and messaging interfaces across web and React Native: channel navigation, replies, reactions, message actions, attachments and unread states.",
        "Helped plan the content management system, designed its dashboard and built reusable page templates and parts of its content logic to standardise how game content is published, specifying the backend APIs it required.",
        "Document feature behaviour, edge cases, testing feedback and backend dependencies for messaging, profiles, badges, activity and rewards, including API endpoints and data needs for message search, content history and read-state sync.",
        "Coordinate consistency and release readiness across Community Servers, Rooms, giveaways and rewards, tracking outstanding integration requirements.",
        "Ran Lighthouse and other performance audits on web interfaces and documented findings and recommendations for the engineering team.",
        "Created the Gamersberg logo and its mascot, Peak, around an iceberg and an infinity mask.",
      ],
      tags: ["Product strategy", "Requirements & specs", "Frontend delivery", "CMS", "Release readiness"],
      links: [
        { label: "Communities", href: "/work/community-servers" },
        { label: "CMS", href: "/work/cms-dashboard" },
        { label: "Brand identity", href: "/work/brand-identity" },
      ],
    },
  ] satisfies JourneyStop[],

  /** Verified skills only; no levels or percentages. `note` qualifies a group. */
  skills: [
    {
      group: "Product & delivery",
      items: [
        "Requirements analysis",
        "Technical documentation",
        "API requirement specs",
        "Prioritisation",
        "Cross-functional coordination",
        "Testing & release readiness",
        "Process standardisation",
      ],
    },
    {
      group: "Engineering",
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "React Native",
        "Expo",
        "HTML & CSS",
        "Tailwind CSS",
        "REST API integration",
        "Lighthouse audits",
        "Git & GitHub",
      ],
    },
    {
      group: "Design",
      items: ["Figma", "User flows", "Interaction design", "Design systems", "Responsive design", "Prototyping"],
    },
    {
      group: "Data & cloud",
      note: "Working knowledge, alongside backend engineers",
      items: ["SQL", "PostgreSQL", "GCP deployments", "CI/CD"],
    },
    {
      group: "Also used",
      items: ["Jotai", "shadcn/ui", "Framer Motion", "Claude", "Codex"],
    },
  ] as { group: string; note?: string; items: string[] }[],
};
