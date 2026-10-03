/**
 * Everything Mini Anshaj (the corner guide) says. Edit copy here; the guide
 * components only read it. Keep lines short, playful and useful, and keep
 * them free of dashes (house style).
 */
import type { MascotAction } from "@/components/mascot/Mascot";
import { publishedProjects } from "./projects";

const community = publishedProjects.find((p) => p.slug === "community-servers");
const users = community?.impact?.[0];

export const guide = {
  welcome: {
    first: "Hi, I'm Anshaj. The drawn version, so I never miss a deadline. Want the quick tour?",
    tour: "Show me around",
    explore: "I'll explore",
    /** Shown on later visits; {last} becomes a link to the last case study viewed. */
    back: "Back again? Pick up where you left off:",
    backPlain: "Back again? Good taste. Tap me if you need anything.",
  },

  /** Every click plays the next one of these, never the same twice in a row. */
  reactions: ["wave", "wink", "nod", "blush", "lookAround", "surprised", "think"] as MascotAction[],

  /** Said when the visitor keeps clicking (count → line). 10 also spins him dizzy. */
  clicks: {
    3: "That tickles.",
    6: "Okay, you found my hobby.",
    10: "Iceberg ahead!",
  } as Record<number, string>,

  /** The big hero mascot: a nudge after a moment, and lines for clicks. */
  hero: {
    onView: "Psst. Scroll down, I'll tag along in the corner.",
    clicks: [
      "Hi! Yes, I'm clickable. Everything here is.",
      "I design it, then I build it. Both versions of me.",
      "Keep scrolling, the good stuff is right below.",
      "Careful, I'm load bearing for this headline.",
    ],
  },

  /** The contact mascot: where the corner guide hands over. */
  contact: {
    onView: "Okay, handing you over to the real me. He replies fast.",
    clicks: [
      "Email works. Phone works. Waving also works.",
      "The real me is even nicer, apparently.",
      "Go on, say hi. I'll wait right here.",
    ],
    /** When the footer comes into view. */
    end: "That's the bottom. Thanks for scrolling all the way.",
  },

  /** Hidden guide: the sleeping tab, and what he says when woken. */
  sleeping: "Bring back the guide",
  woken: "I'm back. Did you miss me?",

  idle: "Still there? I can skip you to the good part.",
  pageEnd: "That's everything. The real me is one email away.",

  /** Section bubbles, keyed by the anchor they appear at. */
  sections: {
    work: "Three projects, all shipped. Pick one, I'll wait.",
    contact: "This is where I hand you over to the real me.",
    project: {
      "community-servers": "I drew 100+ of the decorations in this one. Yes, all of them.",
      "brand-identity": "Fun fact: Peak and I share a designer.",
      "trading-platform": "Rebuilt from zero. The old one is in a better place now.",
    } as Record<string, string>,
    impact: "Numbers first, because recruiters asked nicely.",
    decisions: "These are the calls I'd defend in any design review.",
    gallery: {
      default: "More screens, fewer words. Enjoy.",
      "community-servers": "Try the reply demo down here, it's real code.",
      "brand-identity": "Meet Peak, my favourite colleague.",
    } as Record<string, string>,
    outcome: "Almost done. The next one is good too.",
  },

  card: {
    homeTitle: "Where to?",
    homeIntro: "I know every corner of this site. Pick a door.",
    caseTitle: "The TL;DR",
    resumeTitle: "The paper version",
    resumeIntro: "Same story, printer friendly.",
    resume: "Grab my resume",
    sayHi: "Say hi",
    tour: "Show me around",
    hide: "Hide me",
    decisions: "Skip to key decisions",
    live: "See it live",
    next: "Next case study",
    allWork: "All work",
    download: "Download PDF",
    seeWork: "See the work",
  },

  /** Homepage tour: each step scrolls to its target and says its line. */
  tour: [
    { target: "#hero-title", line: "This is the short version of me: thoughtful design, carefully built." },
    { target: "#work [aria-label='Jump to a case study']", line: "Three case studies. Start anywhere, they're all real, shipped work." },
    { target: "#project-community-servers", line: "Each one walks through the problem, the calls I made and what shipped." },
    {
      target: "#project-community-servers",
      line: users
        ? `Scale check: ${users.value}${users.unit ?? ""} ${users.label.toLowerCase()} on the platform, 50K+ app downloads.`
        : "Every case study opens with its impact.",
    },
    { target: "#contact", line: "And this is the real me. Email, phone, the lot." },
  ],

  footerBringBack: "Bring back the guide",
};
