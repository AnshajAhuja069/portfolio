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
  | "proposal"
  | "planning";

export const statusLabel: Record<ItemStatus, string> = {
  built: "Designed & built",
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
    };

export type Media =
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
};

export type Project = {
  slug: string;
  order: number;
  published: boolean;
  title: string;
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
    outcome: string[];
    reflection: string;
  };
  next?: string;
};

export const projects: Project[] = [
  {
    slug: "community-servers",
    order: 1,
    published: true,
    title: "Making communities easier to use",
    summary:
      "Bringing conversations, channels and game tools together — with replies that keep their context and message actions within reach on web and mobile.",
    company: "Gamersberg",
    workstream: "Community servers & mobile messaging",
    contribution: "Interaction design + front-end build (web & React Native)",
    disciplines: ["Interaction design", "Design systems", "Front-end"],
    platforms: ["Web", "Mobile"],
    band: "Communities · Messaging",
    cover: {
      kind: "screenshots",
      composition: "community",
      desktop: { src: "/images/community server web.png", width: 4625, height: 2411 },
      mobile: { src: "/images/community server mobile app.png", width: 1080, height: 2400 },
      plate: "#0E93A6",
      alt: "Gamersberg’s Blox Fruits community on desktop, with channels and members beside the conversation, and a mobile reply attached to the composer.",
    },
    caseStudy: {
      overview:
        "A game community is more than a chat feed. Players move between conversations, announcements and tools for the game they share. I designed and implemented Gamersberg’s community refresh across web and React Native, connecting that navigation with the small interactions that keep a conversation moving.",
      role: {
        contribution:
          "Interaction and visual design, and front-end implementation on web and React Native.",
        collaborators: "The Gamersberg product and engineering team.",
        status: "Designed and implemented",
      },
      scope: [
        { label: "Chat and message actions", status: "built" },
        { label: "Composer: reply, edit, attachments, emoji / GIF / stickers", status: "built" },
        { label: "Server and channel navigation states", status: "built" },
        { label: "Member lists", status: "built" },
        { label: "Mobile gestures: swipe-to-reply, long-press menus, reactions", status: "built" },
        { label: "Shared theme tokens and typography", status: "built" },
        { label: "Local channel pinning", status: "built", note: "Saved on the device only." },
      ],
      problem:
        "The design challenge was to support a busy conversation without losing context. Players needed to answer a specific message, react quickly, find a channel and return to recent messages — while keeping the current conversation easy to follow.",
      constraints: [
        "Web and mobile needed to share one visual language.",
        "Mobile gestures could not get in the way of normal scrolling.",
        "The interface sat on top of backend services built by the wider engineering team.",
      ],
      decisions: [
        {
          title: "Keep the reply attached to the composer",
          interface:
            "Reply and edit states dock directly above the input, showing whose message you are answering and a short excerpt, with a single control to cancel.",
          behaviour:
            "The excerpt keeps the reply target in view while you type, even when the original message has scrolled away. Editing uses the same area with a distinct state.",
        },
        {
          title: "Put frequent actions one gesture away",
          interface:
            "Swipe a message to reply. Long-press for quick reactions and message actions, with an expanded reaction picker one step further.",
          behaviour:
            "A swipe starts a reply; a long press brings reactions and other actions to the message. The bottom sheet keeps those controls accessible on a phone.",
        },
        {
          title: "One composer for everything you can send",
          interface:
            "Attachment controls and emoji, GIF and sticker access all start from the composer.",
          behaviour:
            "Sending media or a sticker begins in the same place as sending text.",
        },
        {
          title: "Help people find their place again",
          interface:
            "A jump-to-latest control, unread states, and clear navigation states for servers and channels.",
          behaviour:
            "After scrolling back through history, one tap returns you to the newest messages.",
        },
        {
          title: "Let people shape their own navigation",
          interface:
            "Long-press menus on servers and channels, and channel pinning.",
          behaviour:
            "The channel menu makes pinning, muting and notification settings available in context. Pinning is explicitly labelled ‘On this phone’ because it is stored locally.",
        },
      ],
      media: [
        {
          kind: "image",
          image: { src: "/images/community server web.png", width: 4625, height: 2411 },
          caption: "The desktop community: server and channel navigation on the left, the conversation in the centre, and members on the right.",
          alt: "Gamersberg Blox Fruits desktop community showing grouped channels, general chat, a message composer and online members.",
        },
        {
          kind: "image",
          image: { src: "/images/community server mobile app.png", width: 1080, height: 2400 },
          layout: "half",
          caption: "A reply carries the sender and message excerpt into the composer.",
          alt: "Mobile general chat with a reply to player25718 docked directly above the message input.",
        },
        {
          kind: "image",
          image: { src: "/images/moible app reaction.png", width: 1080, height: 2400 },
          layout: "half",
          caption: "Long-press actions bring quick reactions, reply, copy and profile access into one sheet.",
          alt: "Mobile message action sheet with six quick reactions and Reply, Add Reaction, Copy Text, View Profile and Forward actions.",
        },
        {
          kind: "image",
          image: { src: "/images/mobile community server.png", width: 1018, height: 2262 },
          layout: "half",
          caption: "Channels and game tools share one navigation: announcements, trading, stock, private servers and wiki.",
          alt: "Blox Fruits mobile server navigation with Important, Products and General channel groups.",
        },
        {
          kind: "image",
          image: { src: "/images/community seevrer functionality.png", width: 1080, height: 2400 },
          layout: "half",
          caption: "Channel controls explain the scope of pinning: ‘On this phone’.",
          alt: "Giveaways channel menu showing Pin to top with On this phone, Mute channel and Notifications.",
        },
        {
          kind: "image",
          image: { src: "/images/community server stock page.png", width: 1080, height: 2400 },
          layout: "half",
          caption: "The stock page shows the game-tool context beside community conversations: availability, rarity, price, demand and value.",
          alt: "Mobile Blox Fruits stock page with item cards for Rocket, Spin, Blade, Diamond, Quake and Tiger.",
        },
        {
          kind: "demo",
          demo: "reply-composer",
          caption:
            "Interactive re-creation of swipe-to-reply and the attached reply state. Built for this portfolio — not production code.",
        },
      ],
      implemented: {
        mine: [
          "Interaction and visual design, followed through into web and React Native implementation.",
          "Message and composer states, mobile gestures, channel controls and profile transitions.",
          "Shared theme tokens and typography across the refreshed interfaces.",
        ],
        team: [
          "The backend services supporting the community experience; the contribution described here is interface design and front-end implementation.",
        ],
      },
      outcome: [
        "A conversation can stay in context from selecting a message to composing a reply.",
        "Mobile message and channel actions have dedicated, consistent entry points.",
        "The refreshed navigation and messaging interfaces share a visual foundation across web and mobile.",
      ],
      reflection:
        "My next focus would be reliability across these everyday actions: replying while scrolling, returning to recent messages and keeping composer state predictable. Reaction defaults and synced pins would need evidence before expanding the feature set.",
    },
    next: "brand-identity",
  },
  {
    slug: "brand-identity",
    order: 2,
    published: true,
    title: "Giving Gamersberg an identity with depth",
    summary:
      "An iceberg became a logo. The logo became Peak. A shared silhouette and infinity mask connect Gamersberg’s mark with a character built for play.",
    company: "Gamersberg",
    workstream: "Brand identity, logo & mascot",
    contribution: "Brand concept, logo and mascot (Peak)",
    disciplines: ["Brand identity", "Visual design", "Character design"],
    platforms: ["Web", "App", "App store"],
    band: "Brand identity · Mascot",
    cover: {
      kind: "identity",
      alt: "The Gamersberg logo — faceted iceberg peaks wearing a white infinity-shaped mask — above a waterline, with Peak the mascot holding a rocket.",
    },
    caseStudy: {
      overview:
        "I built Gamersberg’s identity around an iceberg: a clear, recognisable surface with depth beneath it. A white infinity mask adds the idea of the identities players choose online. Together, those forms became the logo and the starting point for Peak — a character that carries the same idea into more expressive moments.",
      role: {
        contribution:
          "Brand concept, logo design and the mascot, Peak, with its poses; direction for app-store visuals.",
        collaborators: "The Gamersberg team.",
        status: "Created",
      },
      scope: [
        { label: "Brand concept: Gamersberg as an iceberg", status: "designed" },
        { label: "Logo: iceberg peaks and an infinity mask", status: "designed" },
        { label: "Mascot: Peak", status: "designed" },
        { label: "Peak poses: rocket, headset, controller, peeking", status: "designed" },
        { label: "App-store visuals", status: "directed" },
      ],
      problem:
        "The identity needed to hold together at two scales: a compact mark and an expressive character. The challenge was to give Peak personality while keeping the logo’s distinctive peaks, colours and mask recognisable.",
      constraints: [
        "One idea had to work as a small mark and as a full character.",
        "The character had to be poseable for different moments: play, launches, small in-product touches.",
        "It had to feel native to gaming culture, including the identities players build online.",
      ],
      decisionLabels: ["Form", "Meaning"],
      decisions: [
        {
          title: "Start with an iceberg",
          interface:
            "Faceted iceberg peaks form the silhouette of the mark, in blues that run from deep navy to ice white.",
          behaviour:
            "What players see is the tip. Underneath is the deep research — most of the work sits below the waterline.",
        },
        {
          title: "An infinity sign, worn as a mask",
          interface:
            "A white band across the face is an infinity sign shaped into a mask, with two eye openings.",
          behaviour:
            "Gamers build identities online; the mask is that identity. And infinity says there’s no ceiling — the sky is the limit.",
        },
        {
          title: "Let the logo become a character",
          interface:
            "Peak takes the logo’s iceberg head and infinity mask and gives it a soft, rounded body.",
          behaviour:
            "The shared head and mask make Peak recognisable as part of Gamersberg, even when the pose or props change.",
        },
        {
          title: "Pose Peak for the moments that matter",
          interface:
            "Peak holds a controller, wears a headset, launches a rocket and peeks over the edge of a card.",
          behaviour:
            "One character covers play, launches and playful product moments without redrawing the brand each time.",
        },
      ],
      media: [
        {
          kind: "story",
          story: "iceberg",
          caption: "How the identity is built: the surface, the depth, the mask — and Peak.",
        },
        {
          kind: "image",
          image: { src: "/images/work/brand-identity/gamersberg-logo.png", width: 457, height: 408 },
          alt: "The Gamersberg logo: three faceted iceberg peaks in light-to-deep blues, with a white infinity-shaped mask and two dark eye openings.",
          caption: "The mark: iceberg peaks and an infinity mask.",
          layout: "half",
          plate: "#0a1b44",
        },
        {
          kind: "image",
          image: { src: "/images/work/brand-identity/peak-gaming.png", width: 507, height: 392 },
          alt: "Two poses of Peak sitting: one wearing a headset with a microphone, one holding a game controller, both smiling behind the mask.",
          caption: "Peak at play — headset and controller.",
          layout: "half",
          plate: "#281e3b",
        },
        {
          kind: "image",
          image: { src: "/images/work/brand-identity/peak-rocket.png", width: 408, height: 605 },
          alt: "Peak standing with one hand on its hip, holding up a red toy rocket, smiling behind its infinity mask.",
          caption: "Peak with a rocket — for launches and big moments.",
          layout: "half",
          plate: "#01103a",
        },
        {
          kind: "image",
          image: { src: "/images/work/brand-identity/peak-peek.png", width: 192, height: 242 },
          alt: "Peak peeking over the edge of a dark interface card, hands resting on the edge.",
          caption: "Peeking over a card edge — a small, playful UI moment.",
          layout: "half",
          plate: "#1a1328",
        },
      ],
      implemented: {
        mine: [
          "The brand concept: Gamersberg as an iceberg.",
          "The logo: faceted iceberg peaks with an infinity mask.",
          "The mascot, Peak, and its poses.",
          "Direction for app-store visuals.",
        ],
        team: ["Applying the identity across the product, together with the Gamersberg team."],
      },
      outcome: [
        "A connected identity: the logo and Peak share the iceberg silhouette and infinity mask.",
        "A consistent palette of deep navy, ice white and cyan carries across the character’s poses.",
        "Distinct poses express play, launches and small moments within an interface.",
      ],
      reflection:
        "The next step would be to test where Peak adds clarity as well as personality — for example, acknowledging success or guiding an empty state. A consistent expression set would keep those moments connected to the same character.",
    },
    next: "trading-platform",
  },
  {
    // Unpublished — replaced in the gallery by the brand identity case study.
    slug: "discovery-onboarding",
    order: 5,
    published: false,
    title: "Helping players find where they belong",
    summary:
      "Onboarding, game selection and hub journeys that lead players from the games they play to the communities around them.",
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
      overview:
        "Gamersberg spans many games. This work covers the first steps: picking your games during onboarding, finding hubs and communities for them, and making the homepage and landing pages easier to read. Each part is shown with its real status — not everything here shipped.",
      role: {
        contribution:
          "UX direction for discovery journeys, front-end implementation of onboarding, and a homepage hierarchy proposal.",
        collaborators: "The Gamersberg product and engineering team.",
        status: "Mixed — see status per item",
      },
      scope: [
        {
          label: "Onboarding interface",
          status: "frontend-complete",
          note: "Backend integration was still required at the time.",
        },
        { label: "Game-selection interactions", status: "frontend-complete" },
        { label: "Journeys from game hubs to communities, Rooms, discussions and giveaways", status: "designed" },
        { label: "Homepage content hierarchy", status: "proposal" },
        { label: "Landing and marketing pages", status: "directed" },
      ],
      problem:
        "New players arrive with games in mind, not a map of the product. Hubs, communities, Rooms, discussions and giveaways all compete for attention in the first few screens.",
      constraints: [
        "The onboarding front end was completed ahead of its backend integration.",
        "Discovery had to lead into destinations that already existed: hubs, communities, Rooms, discussions and giveaways.",
        "Journeys had to work on both web and mobile.",
      ],
      decisions: [
        {
          title: "Start with the player’s games",
          interface:
            "An onboarding step for choosing the games you play, with a clear selected state on each game.",
          behaviour:
            "Each game toggles on tap, and the selection is visible at a glance before you continue.",
          status: "frontend-complete",
        },
        {
          title: "Route from games to people",
          interface:
            "Game hubs lead into the communities, Rooms, discussions and giveaways around that game.",
          behaviour:
            "Discovery follows the game you care about rather than a generic feed.",
          status: "designed",
        },
        {
          title: "Give the homepage one clear order",
          interface:
            "A proposed hierarchy for the homepage’s content blocks.",
          behaviour:
            "Presented as a proposal — it is not described here as shipped.",
          status: "proposal",
        },
        {
          title: "Say what Gamersberg is, quickly",
          interface:
            "Visual and UX direction for landing and marketing pages.",
          behaviour:
            "Pages lead with what you can do on Gamersberg before the details.",
          status: "directed",
        },
      ],
      media: [
        {
          kind: "mock",
          screen: "onboarding-games",
          frame: "phone",
          caption: "Game selection during onboarding. Front end complete; backend integration pending at the time.",
          alt: "Illustrative phone screen: a grid of game tiles, three of them marked as selected, with a continue button.",
        },
        {
          kind: "mock",
          screen: "game-hub",
          frame: "window",
          caption: "A game hub leading into communities, Rooms, discussions and giveaways.",
          alt: "Illustrative desktop screen: a game hub header with tabs and cards for communities, rooms, discussions and giveaways.",
        },
      ],
      implemented: {
        mine: [
          "Front-end implementation of the onboarding interface, including game-selection interactions.",
          "Journey design connecting game discovery to communities, Rooms, discussions and giveaways.",
          "A homepage content-hierarchy proposal.",
          "Visual and UX direction for landing and marketing pages.",
        ],
        team: [
          "Backend integration for onboarding.",
          "Services behind hubs, communities and activities.",
        ],
      },
      outcome: [
        "Onboarding front end, including game selection, completed and ready for backend integration at the time.",
        "Discovery journeys designed from game hubs into communities and activities.",
        "Homepage hierarchy documented as a proposal.",
      ],
      reflection:
        "The honest next step is to see onboarding fully connected, learn where people hesitate, and only then refine the homepage proposal.",
    },
    next: "trading-platform",
  },
  {
    slug: "trading-platform",
    order: 3,
    published: true,
    title: "Rebuilding the trading experience",
    summary:
      "A redesigned trading interface that puts offers, requests and item values in view — with reusable patterns for desktop browsing and mobile comparison.",
    company: "Gamersberg",
    workstream: "Trading platform redesign & rebuild",
    contribution: "Redesign + front-end rebuild; patterns adapted for mobile",
    disciplines: ["Product design", "Visual language", "Front-end"],
    platforms: ["Web", "Mobile"],
    band: "Trading · Visual language",
    cover: {
      kind: "screenshots",
      composition: "trading",
      desktop: { src: "/images/trading web 2.png", width: 3536, height: 1819 },
      mobile: { src: "/images/trading mobile.png", width: 743, height: 1692 },
      plate: "#F2C14E",
      alt: "Gamersberg trading listings on desktop and mobile, showing offered and requested items, their values, and Calculate and Inspect actions.",
    },
    caseStudy: {
      overview:
        "Trading was the starting point for my work on Gamersberg’s interface. I redesigned and rebuilt the web experience around reusable patterns, then helped adapt those patterns into the initial mobile flows. The screens shown here bring listings, item details and value comparison into a shared visual language.",
      role: {
        contribution:
          "Redesign and front-end rebuild of the trading interface; help adapting it into the initial mobile flows.",
        collaborators: "The Gamersberg product and engineering team.",
        status: "Redesigned and rebuilt",
      },
      scope: [
        { label: "Trading interface redesign", status: "built" },
        { label: "Reusable UI patterns", status: "built" },
        { label: "Cohesive visual language", status: "built" },
        { label: "Initial mobile app flows and patterns", status: "designed", note: "Helped adapt the web experience." },
      ],
      problem:
        "A trade involves more than recognising an item. Players need to distinguish what someone offers from what they want, compare values and decide what to inspect next. The dated interface needed a clearer structure that could carry across different listing views and screen sizes.",
      constraints: [
        "Item artwork, values, requests and trader information needed a consistent hierarchy.",
        "Reusable web patterns had to remain legible when stacked on a narrow mobile screen.",
        "The interface presents trading data; backend services and value calculations are outside the ownership claimed here.",
      ],
      decisions: [
        {
          title: "Make both sides of a trade explicit",
          interface: "Offer and Request sections separate the items being exchanged, with values alongside them in the list view.",
          behaviour:
            "Players can read the two sides of a listing before choosing Calculate or Inspect. On mobile, the same sections stack vertically.",
        },
        {
          title: "Keep the structure across grid and list views",
          interface:
            "Desktop listings use both compact cards and horizontal rows. Trader information, item groups and actions keep a consistent order.",
          behaviour: "The presentation changes with the view, while the information needed to read a trade stays familiar.",
        },
        {
          title: "Bring item details closer to the listing",
          interface: "An item preview exposes the item name and value. Listing cards also show trader ratings and win, fair and loss counts.",
          behaviour:
            "Item values, trader ratings and community trade assessments are presented as distinct signals, giving players more context than item artwork alone.",
        },
        {
          title: "Give comparison its own space",
          interface: "The calculator groups Offer and Request items with value, price and demand summaries, followed by a comparison result and difference.",
          behaviour: "Players can examine the two sides together. The supplied example shows a loss result for an offer compared with an empty request; it illustrates the interface, not a completed trade.",
        },
      ],
      media: [
        {
          kind: "image",
          image: { src: "/images/trading web.png", width: 3523, height: 1811 },
          caption: "Desktop grid: offers, requests and ratings, with an item preview showing the selected item’s value.",
          alt: "Blox Fruits trading card grid with offers, requests, ratings, Calculate and Inspect buttons, and an open Lightning item preview.",
        },
        {
          kind: "image",
          image: { src: "/images/trading web 2.png", width: 3536, height: 1819 },
          caption: "Desktop list: offers and requests sit side by side, with their total values and next actions.",
          alt: "Horizontal trading listings with offered items on the left, requested items on the right, and value totals beside each group.",
        },
        {
          kind: "image",
          image: { src: "/images/trading mobile.png", width: 743, height: 1692 },
          layout: "half",
          caption: "The mobile list stacks both sides of a trade while keeping the values and actions visible.",
          alt: "Mobile trading list with All Trades, Verified Trades and My Trades tabs and a listing showing Offer and Request values.",
        },
        {
          kind: "image",
          image: { src: "/images/trading mobile two.png", width: 757, height: 1672 },
          layout: "half",
          caption: "The compact card pattern carries item groups, ratings and the same two actions into a narrow screen.",
          alt: "Mobile trading cards showing offered and requested items, win fair loss ratings, and Calculate and Inspect buttons.",
        },
        {
          kind: "image",
          image: { src: "/images/trading calculator.png", width: 1657, height: 1961 },
          caption: "Calculator example: value, price and demand are separated from the comparison result. Here, an empty request produces a loss result.",
          alt: "Trade calculator with two offered items, an empty request, offer and request summaries, a loss indicator and a value difference.",
        },
      ],
      implemented: {
        mine: [
          "Redesign and front-end rebuild of the web trading interface.",
          "Reusable components and a visual language that informed later product work.",
          "Help adapting the web patterns into the initial mobile app flows.",
        ],
        team: [
          "Backend and trading services.",
          "Mobile app engineering beyond the initial flows and patterns.",
        ],
      },
      outcome: [
        "A rebuilt web interface with a shared structure for reading and comparing trades.",
        "Reusable visual patterns that informed communities, messaging and content pages.",
        "Initial mobile flows adapted from the same web foundation.",
      ],
      reflection:
        "If I did it again, I’d document the pattern set as it grew — not only how to use each pattern, but why it exists — so later features could extend it with less guesswork.",
    },
    next: "community-servers",
  },
  {
    // Draft — not published until contribution per area is confirmed.
    slug: "participation-progression",
    order: 4,
    published: false,
    title: "Designing participation and progression",
    summary:
      "Giveaways, quests, streaks, spin-wheel and profile experiences. Contribution per area still to be confirmed.",
    company: "Gamersberg",
    workstream: "Rewards & engagement",
    contribution: "To be confirmed",
    disciplines: ["Product design"],
    platforms: ["Web", "Mobile"],
    band: "Rewards · Profiles",
    cover: {
      kind: "mock",
      composition: "discovery",
      plate: "#171717",
      alt: "Placeholder cover.",
    },
    caseStudy: {
      overview: "Draft.",
      role: { contribution: "To be confirmed", collaborators: "To be confirmed", status: "To be confirmed" },
      scope: [
        { label: "Giveaways", status: "planning" },
        { label: "Quests", status: "planning" },
        { label: "Streaks", status: "planning" },
        { label: "Spin-wheel interfaces", status: "planning" },
        { label: "Badges", status: "planning", note: "Implementation planning only." },
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
