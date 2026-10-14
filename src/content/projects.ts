/**
 * Project + case-study content model.
 *
 * Everything shown on the homepage gallery and the /work/[slug] pages comes
 * from here. To replace an illustrative mock with real work, change a
 * `cover` or `media` entry from `kind: "mock"` to `kind: "image"` and put
 * the file in /public/images/work/<slug>/ (see docs/asset-manifest.md).
 *
 * Accuracy rules (see docs/content-status.md):
 * - No metrics, research, personas or team sizes unless supplied.
 * - Every scope item carries its real status.
 * - Backend work is never claimed.
 */

export type ItemStatus =
  | "built" // designed and implemented
  | "designed"
  | "directed" // visual / UX direction
  | "frontend-complete"
  | "specified" // requirements and API contract written by me, built by the team
  | "proposal"
  | "planning";

export const statusLabel: Record<ItemStatus, string> = {
  built: "Designed & built",
  specified: "Specified for engineering",
  designed: "Designed",
  directed: "Design direction",
  "frontend-complete": "Front end complete",
  proposal: "Proposal",
  planning: "Planning",
};

/** Illustrative screens drawn in code (src/components/mocks). */
export type MockScreen =
  | "chat-reply"
  | "chat-actions"
  | "server-nav"
  | "onboarding-games"
  | "game-hub"
  | "trade-list"
  | "trade-mobile";

export type CoverComposition = "community" | "discovery" | "trading";

export type ImageAsset = {
  src: string;
  width: number;
  height: number;
};

export type Cover =
  | {
      /** Real screens inside the existing animated desktop/phone composition. */
      kind: "screenshots";
      composition: "community" | "trading";
      desktop: ImageAsset;
      mobile: ImageAsset;
      plate: string;
      alt: string;
    }
  | {
      kind: "mock";
      composition: CoverComposition;
      /** Background plate colour behind the layered screens. */
      plate: string;
      alt: string;
    }
  | {
      kind: "image";
      desktop: ImageAsset;
      /** Optional art-directed crop for narrow screens. */
      mobile?: ImageAsset;
      plate?: string;
      alt: string;
    }
  | {
      /** Layered brand composition built from the real identity assets. */
      kind: "identity";
      alt: string;
    }
  | {
      /** Two real desktop screens: a large window behind, a smaller one in front. */
      kind: "dashboard";
      back: ImageAsset;
      front: ImageAsset;
      plate: string;
      alt: string;
    };

/** A real screen or artwork shown inside a device frame. */
export type Shot = ImageAsset & {
  alt: string;
  /** phone: device frame; browser: window chrome with the page URL; art: rounded image on a plate. */
  frame: "phone" | "browser" | "art";
  /** Background behind art. */
  plate?: string;
  /** Address shown in the browser chrome. */
  url?: string;
};

export type Media =
  | {
      kind: "shot";
      shot: Shot;
      caption: string;
      /** "showcase": the large featured screen right after the overview. */
      placement?: "showcase" | "gallery";
      /** In the gallery, sit beside phones instead of spanning the full width. */
      compact?: boolean;
    }
  | {
      kind: "mock";
      screen: MockScreen;
      frame: "phone" | "window";
      caption: string;
      alt: string;
    }
  | {
      kind: "image";
      image: ImageAsset;
      caption: string;
      alt: string;
      /** Width in the figure grid (default "full"). */
      layout?: "full" | "half" | "third";
      /** Background behind small images. */
      plate?: string;
    }
  | {
      kind: "demo";
      demo: "reply-composer";
      caption: string;
    }
  | {
      /** Scroll-driven explainer (full-bleed section). */
      kind: "story";
      story: "iceberg";
      caption: string;
    };

export type ScopeItem = { label: string; status: ItemStatus; note?: string };

export type Decision = {
  title: string;
  /** What the interface does. */
  interface: string;
  /** How it behaves for the person using it. */
  behaviour: string;
  status?: ItemStatus;
  /** The screen that shows this decision (paired with it on the page). */
  shot?: Shot;
};

export type Project = {
  slug: string;
  order: number;
  published: boolean;
  title: string;
  /** Short name for quick links (e.g. the case-study index). */
  short: string;
  /** One sentence for the gallery. */
  summary: string;
  company: string;
  workstream: string;
  /** Short contribution line shown on the gallery. */
  contribution: string;
  disciplines: string[];
  platforms: string[];
  /** Short label for the cover band. */
  band: string;
  /**
   * Impact at scale, shown once on the case study. Only broad, real numbers
   * (users, downloads, platforms) from the resume; never feature counts.
   * `unit` is the suffix drawn in the accent colour, e.g. "M" or "K+".
   */
  impact?: { value: string; unit?: string; label: string; note: string }[];
  /** Link to the live product, shown as "See it live". */
  live?: { href: string; label: string };
  cover: Cover;
  caseStudy: {
    overview: string;
    role: {
      contribution: string;
      collaborators: string;
      status: string;
    };
    scope: ScopeItem[];
    problem: string;
    constraints: string[];
    /** Labels for the two halves of each decision (default Interface / Behaviour). */
    decisionLabels?: [string, string];
    decisions: Decision[];
    media: Media[];
    implemented: { mine: string[]; team: string[] };
    /**
     * "How I built it": the engineering view. Only what is confirmed; no
     * invented tests, metrics or backend work.
     */
    engineering?: {
      stack: string[];
      points: { title: string; body: string }[];
      validation: string;
    };
    outcome: string[];
    reflection: string;
  };
  next?: string;
};

const CS = "/images/work/community-servers";
const TP = "/images/work/trading-platform";
const BI = "/images/work/brand-identity";
const CMS = "/images/work/cms";

/** CMS screenshots supplied by Anshaj on 14 Oct 2026 (work email masked). */
const CMS_SHOTS = {
  pages: { src: `${CMS}/pages.webp`, width: 1919, height: 994 },
  media: { src: `${CMS}/media.webp`, width: 1919, height: 998 },
  data: { src: `${CMS}/data-registry.webp`, width: 1918, height: 995 },
  widgets: { src: `${CMS}/widgets.webp`, width: 1915, height: 981 },
  store: { src: `${CMS}/store.webp`, width: 1915, height: 997 },
  rooms: { src: `${CMS}/rooms.webp`, width: 1913, height: 996 },
};
const CMS_URL = "dashboard.gamersberg.com";

export const projects: Project[] = [
  {
    slug: "cms-dashboard",
    order: 2,
    published: true,
    title: "Building the CMS behind Gamersberg",
    short: "CMS dashboard",
    summary:
      "An internal dashboard where the team manages game pages, data collections, media, shop items, rooms and widgets, organised by game and traceable through audit logs.",
    company: "Gamersberg",
    workstream: "Content management system (internal tool)",
    contribution: "Planning, dashboard design and page templates; front end with the team; API specs",
    disciplines: ["Product planning", "Information architecture", "Front-end", "API specs"],
    platforms: ["Web (internal)"],
    band: "CMS · Internal tool",
    cover: {
      kind: "dashboard",
      back: CMS_SHOTS.pages,
      front: CMS_SHOTS.store,
      plate: "#3D5AFE",
      alt: "The Gamersberg CMS: the Pages screen with a card for each game, and in front, the Store screen listing cosmetic products with slot, rarity, price and status.",
    },
    caseStudy: {
      overview:
        "Every game on Gamersberg needs pages, item data, images, shop items and room settings, and all of them change often. I helped plan a content management system with leadership, designed its dashboard, and worked with the team on the front end, where I built the reusable page templates and parts of the content logic. I also specified the backend APIs it needed. The result is one internal tool, organised by game, where each area keeps its own record of what changed.",
      role: {
        contribution:
          "Planning with leadership, the dashboard’s design, the reusable page templates and parts of the content logic; specifying the backend APIs. The front end was a team build.",
        collaborators: "Gamersberg leadership and the backend engineering team.",
        status: "Designed, built with the team, in use",
      },
      scope: [
        { label: "Pages organised by game, with headless pages and interlinks", status: "designed", note: "Front end built with the team." },
        { label: "Reusable page templates for game content", status: "built" },
        { label: "Data registry: a collection per game, moderation and audit log", status: "designed", note: "Front end built with the team." },
        { label: "Media library: folders per game, grid and list views, CSV file manager", status: "designed", note: "Front end built with the team." },
        { label: "Store: cosmetic products by slot, collection, rarity, price and status", status: "designed", note: "Front end built with the team." },
        { label: "Rooms setup for game rooms and custom rooms", status: "designed", note: "Front end built with the team." },
        { label: "Widget manager for the stock and trading widgets", status: "designed", note: "Front end built with the team." },
        { label: "Backend APIs for every module", status: "specified", note: "Built by the backend team." },
      ],
      problem:
        "Game content touches every part of the product: pages, item data, images, shop items and room settings, for many games at once. The team needed one place to manage all of it, where every game follows the same structure, updates can happen without touching the product’s code, and every change can be traced.",
      constraints: [
        "Many games, each with its own pages, data, media and settings, so everything had to be organised by game first.",
        "Updates had to be possible without a code change, so structure comes from templates, collections and forms.",
        "Backend services and storage sit with the engineering team; the dashboard is built against the APIs I specified.",
      ],
      decisions: [
        {
          title: "Treat game data as collections",
          interface:
            "The data registry holds one collection per game, each showing its entity count and last update, with tabs for moderation and an audit log.",
          behaviour:
            "Structured data lives in one predictable place per game. Updates can be moderated before they go live, and every change is tracked.",
          shot: { ...CMS_SHOTS.data, frame: "browser", url: `${CMS_URL}/data-registry`, alt: "The Data Registry with a card per game collection, such as Adopt Me with 1752 entities and Blade Ball with 4321, plus Collections, Moderation and Audit Log tabs." },
        },
        {
          title: "Keep media next to the game it belongs to",
          interface:
            "The media library groups assets into a folder per game, with grid and list views, a CSV file manager and its own audit log.",
          behaviour:
            "With more than 19,000 assets, a file is found by game first, and its name, game, size and upload date are visible before it is opened.",
          shot: { ...CMS_SHOTS.media, frame: "browser", url: `${CMS_URL}/media`, alt: "The Media Library with game folders on the left and a grid of character renders, each labelled with file name, game, size and date, over 979 pages." },
        },
        {
          title: "Make shop items data, not code",
          interface:
            "Each store product has a slot (avatar decoration, nameplate, profile effect or profile frame), a collection, a rarity, a gem price and a status, filterable by slot.",
          behaviour:
            "Cosmetics like the decorations in the community case study are added, priced and switched on or off from the dashboard.",
          shot: { ...CMS_SHOTS.store, frame: "browser", url: `${CMS_URL}/store`, alt: "The Store products table listing avatar decorations such as Galaxy Aurora and Jester with collection, rarity, gem price and Active status." },
        },
        {
          title: "Configure live features in place",
          interface:
            "Rooms setup lists configurable games and custom rooms beside a configuration panel for media, categories and settings.",
          behaviour:
            "Room settings are published from the dashboard, and non-game rooms such as Anime sit in the same list as game rooms.",
          shot: { ...CMS_SHOTS.rooms, frame: "browser", url: `${CMS_URL}/rooms`, alt: "Rooms Setup with a list of configurable games such as adopt-me and blox-fruits, a Custom Rooms list with Anime, and an empty configuration deck." },
        },
      ],
      media: [
        {
          kind: "shot",
          placement: "showcase",
          shot: {
            ...CMS_SHOTS.pages,
            frame: "browser",
            url: `${CMS_URL}/pages`,
            alt: "The CMS Pages screen: a sidebar of modules and a grid of game cards, each with its icon, slug and page count, plus a Headless group for pages not tied to a game.",
          },
          caption:
            "Everything starts from the game. Pages, data, media and rooms all open on the same kind of game list, so whatever you need to change, you find the game first.",
        },
        {
          kind: "shot",
          placement: "gallery",
          shot: {
            ...CMS_SHOTS.widgets,
            frame: "browser",
            url: `${CMS_URL}/widgets`,
            alt: "The Widget Manager with active Stock and Trading widgets, each opening its own configuration.",
          },
          caption: "The widget manager. The stock and trading widgets are configured independently, each from its own card.",
        },
      ],
      implemented: {
        mine: [
          "Planning the CMS with leadership: its modules and how content is organised by game.",
          "Design of the dashboard: navigation, game lists, collections, media library, store, rooms and widgets.",
          "Front-end work alongside the team: the reusable page templates and parts of the content logic.",
          "Specifying the backend APIs each module needs, and agreeing them with engineering.",
        ],
        team: [
          "The front end of the dashboard modules, built together with the team.",
          "The backend services, APIs, storage and access control behind the CMS.",
        ],
      },
      engineering: {
        stack: ["Next.js", "React", "REST APIs"],
        points: [
          {
            title: "One pattern for every module",
            body: "Pages, data, media and rooms share one shape: pick a game, then work inside it. Cards, filters, tabs and search are reused across modules instead of each screen inventing its own.",
          },
          {
            title: "Templates instead of one-off pages",
            body: "Game pages are built from reusable templates, so every game’s pages follow the same structure and a new game starts from a known layout.",
          },
          {
            title: "Built against a specified contract",
            body: "I specified the endpoints and data each module needed and the backend team built them. The interface, built with the team, works from that contract, including empty collections, entity counts and active or inactive states.",
          },
          {
            title: "Every change leaves a trail",
            body: "Pages, media and the data registry each keep an audit log, collection updates can be moderated, and the dashboard has a Bin, so changes stay traceable.",
          },
        ],
        validation:
          "In use by the Gamersberg team: assets are uploaded and collections updated through it, and changes are recorded in each module’s audit log.",
      },
      outcome: [
        "One place to manage pages, data, media, shop items, rooms and widgets for every game.",
        "Every game follows the same structure, from its pages to its data collections.",
        "Changes are traceable through audit logs and moderation.",
        "Shop cosmetics and room settings change from the dashboard instead of in code.",
      ],
      reflection:
        "Next, I’d look at where editors spend their time in the dashboard, and document each page template’s purpose alongside how to use it, so new games and new editors get started faster.",
    },
    next: "trading-platform",
  },
  {
    slug: "community-servers",
    order: 1,
    published: true,
    title: "Making communities easier to use",
    short: "Community servers",
    impact: [
      { value: "1.5", unit: "M", label: "Registered users", note: "Up from about 200K during my tenure." },
      { value: "50", unit: "K+", label: "Google Play downloads", note: "On the Gamersberg Android app." },
      { value: "3", label: "Platforms", note: "Web and Android today, with a Windows app on the Microsoft Store coming soon." },
    ],
    summary:
      "Conversations, channels and game tools in one place, with replies that keep their context, message actions within thumb’s reach, and over 100 decorations that let players make their profile their own.",
    company: "Gamersberg",
    workstream: "Community servers & mobile messaging",
    contribution: "Interaction design and front-end build, web and React Native",
    disciplines: ["Interaction design", "Visual design", "Design systems", "Front-end"],
    platforms: ["Web", "Mobile"],
    band: "Communities · Messaging · Shop",
    live: { href: "https://www.gamersberg.com/community/blox-fruits", label: "gamersberg.com/community/blox-fruits" },
    cover: {
      kind: "screenshots",
      composition: "community",
      desktop: { src: `${CS}/desktop.webp`, width: 4625, height: 2411 },
      mobile: { src: `${CS}/reply.webp`, width: 1080, height: 2304 },
      plate: "#0E93A6",
      alt: "Gamersberg’s Blox Fruits community on desktop, with channels and members beside the conversation, and a mobile reply attached to the composer.",
    },
    caseStudy: {
      overview:
        "A game community is more than a chat feed. Players jump between conversations, announcements and tools for the game they share. I designed and implemented Gamersberg’s community refresh on web and React Native, pairing clear navigation with the small interactions that keep a conversation moving. Around it, I created the identity layer players show off: more than 100 decoration items, the shop that sells them and the profile hover cards that wear them.",
      role: {
        contribution: "Interaction and visual design, and front-end implementation on web and React Native.",
        collaborators: "The Gamersberg product and engineering team.",
        status: "Designed and implemented",
      },
      scope: [
        { label: "Chat and message actions", status: "built" },
        { label: "Composer: reply, edit, attachments, emoji, GIFs and stickers", status: "built" },
        { label: "Server and channel navigation, unread states", status: "built" },
        { label: "Member lists", status: "built" },
        { label: "Mobile gestures: swipe to reply, long-press menus, reactions", status: "built" },
        { label: "Shared theme tokens and typography", status: "built" },
        { label: "Local channel pinning", status: "built", note: "Saved on the device only." },
        { label: "100+ decoration items: nameplates, avatar decorations and card frames", status: "built" },
        { label: "Decoration shop with previews, prices, rarity and owned states", status: "built" },
        { label: "Profile hover cards that show equipped decorations", status: "built" },
      ],
      problem:
        "Busy conversations lose context fast. Players needed to answer a specific message, react quickly, find the right channel and get back to the latest messages, all without losing their place in the conversation they were following.",
      constraints: [
        "Web and mobile needed to share one visual language.",
        "Mobile gestures could not get in the way of normal scrolling.",
        "Search, content history and read state depended on backend work, so the interface had to be designed around those dependencies.",
      ],
      decisions: [
        {
          title: "Keep the reply attached to the composer",
          interface:
            "Reply and edit states dock right above the input, showing who you are answering and a short excerpt, with one control to cancel.",
          behaviour:
            "The target stays in view while you type, even after the original message scrolls away. Editing uses the same slot with its own state.",
          shot: {
            src: `${CS}/reply.webp`,
            width: 1080,
            height: 2304,
            frame: "phone",
            alt: "Mobile general chat with a reply to player25718 docked directly above the message input.",
          },
        },
        {
          title: "Put frequent actions one gesture away",
          interface:
            "Swipe a message to reply. Long press for quick reactions and message actions, with the full reaction picker one step further.",
          behaviour:
            "Common responses never need a trip into a menu, and the bottom sheet keeps every action within thumb’s reach.",
          shot: {
            src: `${CS}/actions.webp`,
            width: 1080,
            height: 2304,
            frame: "phone",
            alt: "Mobile message action sheet with six quick reactions and Reply, Add Reaction, Copy Text, View Profile and Forward.",
          },
        },
        {
          title: "One composer for everything you can send",
          interface: "Attachments, emoji, GIFs and stickers all start from the composer.",
          behaviour:
            "Sharing a screenshot or a sticker begins in the same place as sending text, so the conversation keeps its rhythm.",
          shot: {
            src: `${CS}/chat-media.webp`,
            width: 951,
            height: 2205,
            frame: "phone",
            alt: "Mobile web general chat with shared game screenshots, and a composer with attachment, emoji, GIF and sticker controls.",
          },
        },
        {
          title: "Help people find their place again",
          interface: "Grouped channels, unread states and a jump to latest control.",
          behaviour:
            "After scrolling back through history, one tap returns you to the newest messages, and unread markers show where the new activity is.",
          shot: {
            src: `${CS}/channels.webp`,
            width: 1018,
            height: 2172,
            frame: "phone",
            alt: "Blox Fruits mobile server navigation with Important, Products and General channel groups and an unread marker on suggestions.",
          },
        },
        {
          title: "Let people shape their own navigation",
          interface: "Long-press menus on servers and channels, with pinning, muting and notification settings.",
          behaviour:
            "Controls live where they apply. Pinning is labelled ‘On this phone’ because it is stored on the device.",
          shot: {
            src: `${CS}/channel-menu.webp`,
            width: 1080,
            height: 2304,
            frame: "phone",
            alt: "Giveaways channel menu showing Pin to top with On this phone, Mute channel and Notifications.",
          },
        },
      ],
      media: [
        {
          kind: "shot",
          placement: "showcase",
          shot: {
            src: `${CS}/desktop.webp`,
            width: 4625,
            height: 2411,
            frame: "browser",
            url: "gamersberg.com/community/blox-fruits",
            alt: "Gamersberg Blox Fruits desktop community showing grouped channels, general chat, a message composer and online members.",
          },
          caption: "The desktop community: servers and channels on the left, the conversation in the centre, members on the right.",
        },
        {
          kind: "shot",
          placement: "gallery",
          shot: {
            src: `${CS}/shop.webp`,
            width: 1894,
            height: 971,
            frame: "art",
            plate: "#0b0a12",
            alt: "The Gamersberg decoration shop with rows of nameplates and avatar decorations, each with a preview, price in gems, rarity, and Owned or Equipped tags.",
          },
          caption: "The decoration shop. I created more than 100 items, from nameplates to avatar decorations, each previewed at the same proportions members see, with price, rarity and owned states.",
        },
        {
          kind: "shot",
          placement: "gallery",
          compact: true,
          shot: {
            src: `${CS}/hover-card.webp`,
            width: 941,
            height: 884,
            frame: "art",
            plate: "#0b0a12",
            alt: "A profile hover card in an ornate purple frame, opened from the member list, showing the player’s decorated avatar, bio, Gamersberg stats and actions.",
          },
          caption: "Hover cards bring decorations into the conversation. Open a member and their frame, avatar decoration and stats come with them.",
        },
        {
          kind: "shot",
          placement: "gallery",
          shot: {
            src: `${CS}/stock.webp`,
            width: 1080,
            height: 2304,
            frame: "phone",
            alt: "Mobile Blox Fruits stock page with item cards for Rocket, Spin, Blade, Diamond, Quake and Tiger.",
          },
          caption: "Game tools sit beside the conversation. The stock page shows availability, rarity, price, demand and value.",
        },
        {
          kind: "demo",
          demo: "reply-composer",
          caption:
            "Try it: swipe a message to the right, or use Reply. A re-creation built for this portfolio in React and TypeScript, not production code. Pointer events drive the swipe past a fixed threshold, and the reply target is held in state and copied into the sent message, so its context survives scrolling.",
        },
      ],
      implemented: {
        mine: [
          "Interaction and visual design for chat, navigation, member lists and the composer.",
          "Web and React Native implementation of message and composer states, mobile gestures, channel controls and profile transitions.",
          "Shared theme tokens and typography across the refreshed interfaces.",
          "More than 100 decoration items, the shop that presents them and the hover cards that display them across the community.",
          "Documenting the API endpoints and data needs for search, content history and read state, and agreeing them with engineering.",
        ],
        team: ["The backend services behind communities, including search, content history and read state."],
      },
      engineering: {
        stack: ["React", "Next.js", "React Native", "TypeScript", "REST APIs"],
        points: [
          {
            title: "One composer, several states",
            body: "Reply and edit share the slot above the input, each with its own state and a single cancel. The reply target is kept with the draft, so it stays visible after the original message scrolls out of view.",
          },
          {
            title: "Gestures that don’t fight scrolling",
            body: "Swipe-to-reply and long-press menus had to sit alongside normal vertical scrolling on mobile, so the gestures were tuned to trigger on deliberate movement while the feed scrolls as usual.",
          },
          {
            title: "Built around backend dependencies",
            body: "Search, content history and read state depended on backend services. I documented the API endpoints and data each screen needed, and built unread markers and jump-to-latest around that contract.",
          },
          {
            title: "One foundation for web and mobile",
            body: "Shared theme tokens and typography keep web and React Native consistent, so navigation and messaging read the same on every screen.",
          },
        ],
        validation:
          "Checked user flows with the product and engineering team, and ran Lighthouse and other performance audits, documenting findings and recommendations in reports for engineering.",
      },
      outcome: [
        "A reply keeps its context from the moment you pick a message to the moment you send.",
        "Every mobile message and channel action has one consistent entry point.",
        "Web and mobile share one visual foundation for navigation and messaging.",
        "Decorations follow a player everywhere they appear: the member list, the hover card and the shop preview all match.",
      ],
      reflection:
        "Next, I’d focus on reliability in everyday moments: replying while the feed moves, jumping back to recent messages and keeping the composer predictable. Reaction defaults and synced pins should wait for evidence before the feature set grows.",
    },
    next: "cms-dashboard",
  },
  {
    slug: "brand-identity",
    order: 4,
    published: true,
    title: "Giving Gamersberg an identity with depth",
    short: "Brand identity & Peak",
    summary:
      "An iceberg became a logo, and the logo became Peak. One silhouette and an infinity mask connect Gamersberg’s mark with a character built for play.",
    company: "Gamersberg",
    workstream: "Brand identity, logo & mascot",
    contribution: "Brand concept, logo and mascot (Peak)",
    disciplines: ["Brand identity", "Visual design", "Character design"],
    platforms: ["Web", "App", "App store"],
    band: "Brand identity · Mascot",
    cover: {
      kind: "identity",
      alt: "The Gamersberg logo, faceted iceberg peaks wearing a white infinity-shaped mask, above a waterline, with Peak the mascot holding a rocket.",
    },
    caseStudy: {
      overview:
        "I built Gamersberg’s identity around an iceberg: a clear, recognisable surface with real depth beneath it. A white infinity mask adds the identities players choose online. Together, those forms became the logo and the starting point for Peak, a character who carries the same idea into more expressive moments.",
      role: {
        contribution: "Brand concept, logo design and the mascot, Peak, with its poses; direction for app-store visuals.",
        collaborators: "The Gamersberg team.",
        status: "Created",
      },
      scope: [
        { label: "Brand concept: Gamersberg as an iceberg", status: "designed" },
        { label: "Logo: iceberg peaks and an infinity mask", status: "designed" },
        { label: "Mascot: Peak, with a full character reference", status: "designed" },
        { label: "Peak poses: rocket, headset, controller, peeking", status: "designed" },
        { label: "App-store visuals", status: "directed" },
      ],
      problem:
        "The identity had to hold together at two scales: a compact mark and an expressive character. The challenge was to give Peak personality while keeping the logo’s distinctive peaks, colours and mask recognisable.",
      constraints: [
        "One idea had to work as a small mark and as a full character.",
        "The character had to be poseable for different moments: play, launches and small in-product touches.",
        "It had to feel native to gaming culture, including the identities players build online.",
      ],
      decisionLabels: ["Form", "Meaning"],
      decisions: [
        {
          title: "Start with an iceberg",
          interface: "Faceted iceberg peaks form the silhouette of the mark, in blues that run from deep navy to ice white.",
          behaviour: "What players see is the tip. Underneath is the deep research, because most of the work sits below the waterline.",
          shot: {
            src: `${BI}/gamersberg-logo.png`,
            width: 457,
            height: 408,
            frame: "art",
            plate: "#0a1b44",
            alt: "The Gamersberg logo: three faceted iceberg peaks in light to deep blues, with a white infinity-shaped mask and two dark eye openings.",
          },
        },
        {
          title: "An infinity sign, worn as a mask",
          interface: "A white band across the face is an infinity sign shaped into a mask, with two eye openings.",
          behaviour: "Gamers build identities online, and the mask is that identity. Infinity says there is no ceiling: the sky is the limit.",
          shot: {
            src: `${BI}/peak-peek.webp`,
            width: 1117,
            height: 1408,
            frame: "art",
            plate: "#1a1328",
            alt: "Peak peeking over the edge of a dark interface card, the white infinity mask and cyan eyes in close-up.",
          },
        },
        {
          title: "Let the logo become a character",
          interface: "Peak takes the logo’s iceberg head and infinity mask and gives it a soft, rounded body.",
          behaviour: "The shared head and mask keep Peak recognisably Gamersberg, whatever the pose or props.",
          shot: {
            src: `${BI}/peak-rocket.webp`,
            width: 1030,
            height: 1527,
            frame: "art",
            plate: "#01103a",
            alt: "Peak standing with one hand on its hip, holding up a red toy rocket, smiling behind its infinity mask.",
          },
        },
        {
          title: "Pose Peak for the moments that matter",
          interface: "Peak holds a controller, wears a headset, launches a rocket and peeks over the edge of a card.",
          behaviour: "One character covers play, launches and playful product moments without redrawing the brand each time.",
          shot: {
            src: `${BI}/peak-gaming.webp`,
            width: 1426,
            height: 1103,
            frame: "art",
            plate: "#281e3b",
            alt: "Two poses of Peak sitting: one wearing a headset with a microphone, one holding a game controller, both smiling behind the mask.",
          },
        },
      ],
      media: [
        {
          kind: "story",
          story: "iceberg",
          caption: "How the identity is built: the surface, the depth, the mask, and then Peak.",
        },
        {
          kind: "shot",
          placement: "gallery",
          shot: {
            src: `${BI}/peak-sheet.webp`,
            width: 1774,
            height: 887,
            frame: "art",
            plate: "#e9edf3",
            alt: "Peak character reference sheet: front, three-quarter, side, back and rear three-quarter views, head details, happy, wink and surprised expressions, and navy, ice, white and cyan materials.",
          },
          caption: "The character reference: turnaround, expressions, and the four materials that define Peak.",
        },
      ],
      implemented: {
        mine: [
          "The brand concept: Gamersberg as an iceberg.",
          "The logo: faceted iceberg peaks with an infinity mask.",
          "The mascot, Peak, its character reference and poses.",
          "Direction for app-store visuals.",
        ],
        team: ["Applying the identity across the product, together with the Gamersberg team."],
      },
      outcome: [
        "A connected identity: the logo and Peak share the iceberg silhouette and the infinity mask.",
        "One palette of deep navy, ice white and cyan carries across every pose.",
        "Distinct poses cover play, launches and small moments inside the interface.",
      ],
      reflection:
        "The next step is to test where Peak adds clarity as well as personality, for example acknowledging success or guiding an empty state. A consistent expression set would keep those moments tied to the same character.",
    },
    next: "community-servers",
  },
  {
    // Unpublished: replaced in the gallery by the brand identity case study.
    slug: "discovery-onboarding",
    order: 5,
    published: false,
    title: "Helping players find where they belong",
    short: "Discovery",
    summary: "Onboarding, game selection and hub journeys that lead players from the games they play to the communities around them.",
    company: "Gamersberg",
    workstream: "Discovery, onboarding & game hubs",
    contribution: "UX direction, onboarding UI build, hierarchy proposal",
    disciplines: ["UX design", "Information architecture", "Front-end"],
    platforms: ["Web", "Mobile"],
    band: "Onboarding · Discovery",
    cover: {
      kind: "mock",
      composition: "discovery",
      plate: "#3D5AFE",
      alt: "Illustrative composition of a game hub page on desktop and a phone showing a game-selection onboarding step.",
    },
    caseStudy: {
      overview: "Draft, unpublished.",
      role: { contribution: "UX direction and onboarding front end.", collaborators: "The Gamersberg team.", status: "Mixed" },
      scope: [
        { label: "Onboarding interface", status: "frontend-complete", note: "Backend integration was still required at the time." },
        { label: "Homepage content hierarchy", status: "proposal" },
      ],
      problem: "Draft.",
      constraints: [],
      decisions: [],
      media: [],
      implemented: { mine: [], team: [] },
      outcome: [],
      reflection: "",
    },
  },
  {
    slug: "trading-platform",
    order: 3,
    published: true,
    title: "Rebuilding the trading experience",
    short: "Trading platform",
    summary:
      "A rebuilt trading interface that keeps offers, requests and item values in view, with patterns that carry from desktop browsing to mobile comparison.",
    company: "Gamersberg",
    workstream: "Trading platform redesign & rebuild",
    contribution: "Redesign and front-end rebuild, patterns adapted for mobile",
    disciplines: ["Product design", "Visual language", "Front-end"],
    platforms: ["Web", "Mobile"],
    band: "Trading · Visual language",
    live: { href: "https://www.gamersberg.com/blox-fruits/trading", label: "gamersberg.com/blox-fruits/trading" },
    cover: {
      kind: "screenshots",
      composition: "trading",
      desktop: { src: `${TP}/list.webp`, width: 3536, height: 1819 },
      mobile: { src: `${TP}/mobile-list.webp`, width: 743, height: 1692 },
      plate: "#F2C14E",
      alt: "Gamersberg trading listings on desktop and mobile, showing offered and requested items, their values, and Calculate and Inspect actions.",
    },
    caseStudy: {
      overview:
        "Trading is where my work on Gamersberg’s interface began. I redesigned and rebuilt the outdated web experience from the ground up around reusable components, then helped establish the mobile app’s first interface by adapting those flows for smaller screens.",
      role: {
        contribution: "Redesign and front-end rebuild of the trading interface; helped establish the first mobile interface.",
        collaborators: "The Gamersberg product and engineering team.",
        status: "Redesigned and rebuilt",
      },
      scope: [
        { label: "Trading interface redesign", status: "built" },
        { label: "Reusable UI components", status: "built" },
        { label: "Cohesive visual language across key screens", status: "built" },
        { label: "The mobile app’s initial interface", status: "designed", note: "Adapted from the redesigned web flows." },
      ],
      problem:
        "A trade is more than recognising an item. Players need to tell what someone offers from what they want, compare values and decide what to inspect next. The old interface needed a clearer structure that would hold up across listing views and screen sizes.",
      constraints: [
        "Item artwork, values, requests and trader information needed one consistent hierarchy.",
        "Web patterns had to stay legible when stacked on a narrow phone screen.",
        "Backend services and value calculations sit with the wider team; the work here is the interface that presents them.",
      ],
      decisions: [
        {
          title: "Make both sides of a trade explicit",
          interface: "Offer and Request sit in separate, labelled groups, each with its total value.",
          behaviour: "Players read both sides of a listing at a glance before choosing Calculate or Inspect.",
          shot: {
            src: `${TP}/list.webp`,
            width: 3536,
            height: 1819,
            frame: "browser",
            url: "gamersberg.com/blox-fruits/trading",
            alt: "Horizontal trading listings with offered items on the left, requested items on the right, and value totals beside each group.",
          },
        },
        {
          title: "Keep the structure on every screen size",
          interface: "On mobile, the same Offer and Request groups stack vertically, with the actions kept at the bottom of each listing.",
          behaviour: "The layout changes with the screen while the way you read a trade stays familiar.",
          shot: {
            src: `${TP}/mobile-list.webp`,
            width: 743,
            height: 1692,
            frame: "phone",
            alt: "Mobile trading list with All Trades, Verified Trades and My Trades tabs and a listing showing Offer and Request values.",
          },
        },
        {
          title: "Bring the trader into the listing",
          interface: "Compact cards show each trader’s rating and their win, fair and loss counts next to the items.",
          behaviour: "Trust signals sit beside the trade itself, so players get more context than item artwork alone.",
          shot: {
            src: `${TP}/mobile-cards.webp`,
            width: 757,
            height: 1672,
            frame: "phone",
            alt: "Mobile trading cards showing offered and requested items, win fair loss ratings, and Calculate and Inspect buttons.",
          },
        },
        {
          title: "Give comparison its own space",
          interface: "The calculator groups Offer and Request items with value, price and demand, followed by a verdict and the difference.",
          behaviour:
            "Players weigh both sides together before committing. In this example an offer against an empty request reads as a loss; it shows the interface, not a completed trade.",
          shot: {
            src: `${TP}/calculator.webp`,
            width: 1657,
            height: 1961,
            frame: "browser",
            url: "gamersberg.com/blox-fruits/calculator",
            alt: "Trade calculator with two offered items, an empty request, offer and request summaries, a loss indicator and a value difference.",
          },
        },
      ],
      media: [
        {
          kind: "shot",
          placement: "showcase",
          shot: {
            src: `${TP}/grid.webp`,
            width: 3523,
            height: 1811,
            frame: "browser",
            url: "gamersberg.com/blox-fruits/trading",
            alt: "Blox Fruits trading card grid with offers, requests, ratings, Calculate and Inspect buttons, and an open Lightning item preview.",
          },
          caption: "The desktop grid: offers, requests and ratings on every card, with an item preview showing the selected item’s value.",
        },
      ],
      implemented: {
        mine: [
          "Redesign and front-end rebuild of the web trading interface.",
          "Reusable components and a visual language that later product work built on.",
          "Helping establish the mobile app’s first interface from the redesigned web flows.",
        ],
        team: ["Backend and trading services, including value data.", "Mobile app engineering beyond the initial interface."],
      },
      engineering: {
        stack: ["React", "Next.js", "TypeScript", "REST APIs", "Responsive CSS"],
        points: [
          {
            title: "A small set of reusable parts",
            body: "Offer and Request groups, item tiles, value totals and trader ratings were built as reusable components and composed into the list view, the card grid and the calculator, instead of each screen drawing its own version.",
          },
          {
            title: "One structure, every screen size",
            body: "On narrow screens the same Offer and Request groups stack vertically, with the actions kept at the bottom of each listing, so the layout adapts without changing how a trade is read.",
          },
          {
            title: "Presenting data the team owns",
            body: "Item values and trade data come from the team’s trading services. The interface’s job is to present them consistently: totals per side, price and demand in the calculator, then a verdict and the difference.",
          },
          {
            title: "Handling incomplete trades",
            body: "The calculator still gives a clear answer when one side is empty: an offer against an empty request reads as a loss, with the difference shown, rather than an empty or broken result.",
          },
        ],
        validation:
          "Reviewed the rebuilt screens with the product and engineering team across desktop and mobile breakpoints before they replaced the old interface.",
      },
      outcome: [
        "A rebuilt web interface with one shared structure for reading and comparing trades.",
        "Reusable patterns that later shaped communities, messaging and content pages.",
        "A first mobile interface adapted from the same foundation.",
      ],
      reflection:
        "If I did it again, I’d document the pattern set as it grew, recording why each pattern exists as well as how to use it, so later features could extend it with less guesswork.",
    },
    next: "brand-identity",
  },
  {
    // Draft: not published until contribution per area is confirmed.
    slug: "participation-progression",
    order: 4,
    published: false,
    title: "Designing participation and progression",
    short: "Rewards",
    summary: "Giveaways, quests, streaks, spin-wheel and profile experiences. Contribution per area still to be confirmed.",
    company: "Gamersberg",
    workstream: "Rewards & engagement",
    contribution: "To be confirmed",
    disciplines: ["Product design"],
    platforms: ["Web", "Mobile"],
    band: "Rewards · Profiles",
    cover: { kind: "mock", composition: "discovery", plate: "#171717", alt: "Placeholder cover." },
    caseStudy: {
      overview: "Draft.",
      role: { contribution: "To be confirmed", collaborators: "To be confirmed", status: "To be confirmed" },
      scope: [{ label: "Giveaways, quests, streaks, spin-wheel", status: "planning" }],
      problem: "Draft.",
      constraints: [],
      decisions: [],
      media: [],
      implemented: { mine: [], team: [] },
      outcome: [],
      reflection: "",
    },
  },
];

export const publishedProjects = projects
  .filter((p) => p.published)
  .sort((a, b) => a.order - b.order);

export function getProject(slug: string) {
  return publishedProjects.find((p) => p.slug === slug);
}

export function getProjectIndex(slug: string) {
  return publishedProjects.findIndex((p) => p.slug === slug);
}
