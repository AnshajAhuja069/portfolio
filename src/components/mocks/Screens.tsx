/**
 * Illustrative interface screens drawn in code. They are *not* screenshots
 * of the real product — every place they appear is labelled as illustrative.
 * Replace with real media via src/content/projects.ts.
 */
import type { CSSProperties } from "react";
import type { MockScreen } from "@/content/projects";
import { Bar, PhoneFrame, WindowFrame } from "./Frames";
import s from "./mocks.module.css";

type MsgProps = {
  name: string;
  color: string;
  lines: number[];
  target?: boolean;
  lifted?: boolean;
  replyTo?: string;
  reactions?: string[];
};

function Msg({ name, color, lines, target, lifted, replyTo, reactions }: MsgProps) {
  return (
    <div className={`${s.msg} ${target ? s.msgTarget : ""} ${lifted ? s.msgLifted : ""}`}>
      <span className={s.avatar} style={{ background: color }} />
      <div className={s.msgBody}>
        {replyTo && (
          <span className={s.quote}>
            <span className={s.quoteName}>↳ {replyTo}</span>
            <Bar w={46} />
          </span>
        )}
        <span className={s.msgName}>{name}</span>
        {lines.map((w, i) => (
          <Bar key={i} w={w} tone="strong" />
        ))}
        {reactions && (
          <span className={s.reactions}>
            {reactions.map((r) => (
              <span key={r} className={s.reaction}>
                {r}
              </span>
            ))}
          </span>
        )}
      </div>
    </div>
  );
}

function AppHeader({ title, hash = true }: { title: string; hash?: boolean }) {
  return (
    <div className={s.appHeader}>
      {hash && <span className={s.hash}>#</span>}
      <span className={s.appTitle}>{title}</span>
      <span className={s.headerIcons}>
        <i />
        <i />
      </span>
    </div>
  );
}

function Composer({ reply }: { reply?: string }) {
  return (
    <div className={s.composer}>
      {reply && (
        <div className={s.replyBar}>
          <span className={s.replyAccent} />
          <span className={s.replyText}>
            Replying to <b>{reply}</b>
          </span>
          <span className={s.replyClose}>×</span>
        </div>
      )}
      <div className={s.inputRow}>
        <span className={s.iconBtn}>+</span>
        <span className={s.input}>Message #general</span>
        <span className={s.iconBtn}>☺</span>
        <span className={s.send} />
      </div>
    </div>
  );
}

export function ChatReplyScreen() {
  return (
    <>
      <AppHeader title="general" />
      <div className={s.messages}>
        <Msg name="Mira" color="#7c9cff" lines={[82, 54]} />
        <Msg name="Kabir" color="#f2c14e" lines={[68]} target reactions={["🔥 3"]} />
        <Msg name="Theo" color="#5ad19a" lines={[74, 38]} />
        <Msg name="You" color="#0e93a6" lines={[52]} replyTo="Kabir" />
      </div>
      <Composer reply="Kabir" />
    </>
  );
}

export function ChatActionsScreen() {
  return (
    <>
      <AppHeader title="general" />
      <div className={`${s.messages} ${s.dimmed}`}>
        <Msg name="Mira" color="#7c9cff" lines={[70, 40]} />
        <Msg name="Kabir" color="#f2c14e" lines={[62, 44]} lifted />
        <Msg name="Theo" color="#5ad19a" lines={[58]} />
      </div>
      <div className={s.sheet}>
        <span className={s.grabber} />
        <div className={s.quickReactions}>
          {["❤️", "😂", "🔥", "👍", "😮"].map((r) => (
            <span key={r} className={s.quickReaction}>
              {r}
            </span>
          ))}
          <span className={`${s.quickReaction} ${s.more}`}>+</span>
        </div>
        <ul className={s.actions}>
          {["Reply", "Edit", "Add reaction", "Copy text"].map((a) => (
            <li key={a}>
              <span className={s.actionIcon} />
              {a}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function ServerNavScreen() {
  return (
    <div className={s.desktopApp}>
      <div className={s.rail}>
        {["#0e93a6", "#7c9cff", "#5ad19a", "#f2c14e", "#c58cff"].map((c, i) => (
          <span
            key={c}
            className={`${s.server} ${i === 0 ? s.serverActive : ""} ${i === 2 ? s.serverUnread : ""}`}
            style={{ "--c": c } as CSSProperties}
          />
        ))}
      </div>
      <div className={s.channels}>
        <div className={s.serverName}>
          <Bar w={62} tone="strong" />
        </div>
        <span className={s.section}>Pinned</span>
        <span className={s.channel}>
          <span className={s.pin} /># announcements
        </span>
        <span className={s.channel}>
          <span className={s.pin} /># lfg
        </span>
        <span className={s.section}>Channels</span>
        <span className={`${s.channel} ${s.channelActive}`}># general</span>
        <span className={`${s.channel} ${s.channelUnread}`}>
          # clips <span className={s.unreadDot} />
        </span>
        <span className={s.channel}># trading</span>
        <span className={`${s.channel} ${s.channelUnread}`}>
          # events <span className={s.unreadDot} />
        </span>
        <span className={s.channel}># off-topic</span>
      </div>
      <div className={s.chat}>
        <AppHeader title="general" />
        <div className={s.messages}>
          <Msg name="Mira" color="#7c9cff" lines={[64, 40]} />
          <Msg name="Kabir" color="#f2c14e" lines={[52]} reactions={["🔥 3", "👍 2"]} />
          <Msg name="Theo" color="#5ad19a" lines={[70, 58, 30]} />
          <Msg name="You" color="#0e93a6" lines={[44]} replyTo="Theo" />
        </div>
        <span className={s.jump}>Jump to latest ↓</span>
        <Composer />
      </div>
      <div className={s.members}>
        <span className={s.section}>Online</span>
        {["#7c9cff", "#f2c14e", "#5ad19a", "#0e93a6", "#c58cff", "#8ad1f0"].map((c, i) => (
          <span key={c} className={s.member}>
            <span className={s.avatarSm} style={{ background: c }} />
            <Bar w={[60, 44, 70, 52, 38, 56][i]} />
          </span>
        ))}
      </div>
    </div>
  );
}

const GAME_TILES = [
  ["#ff7a59", "#b8325a"],
  ["#5ad19a", "#1d6f6b"],
  ["#7c9cff", "#3b3fb6"],
  ["#f2c14e", "#c0612b"],
  ["#c58cff", "#5b2f9f"],
  ["#8ad1f0", "#2a6fa0"],
  ["#ff9fb5", "#a33d68"],
  ["#b7e36a", "#4f7d23"],
  ["#ffcf8a", "#b06a2a"],
  ["#9fb0c8", "#3e4a63"],
  ["#f58b6c", "#8c2f2f"],
  ["#7fe0d0", "#1f7a70"],
];

export function OnboardingGamesScreen() {
  const selected = new Set([1, 4, 6]);
  return (
    <div className={s.onboarding}>
      <div className={s.progress}>
        <span className={s.progressOn} />
        <span className={s.progressOn} />
        <span />
      </div>
      <span className={s.stepLabel}>Step 2 of 3</span>
      <span className={s.onbTitle}>Pick your games</span>
      <Bar w={78} />
      <div className={s.tiles}>
        {GAME_TILES.map(([a, b], i) => (
          <span
            key={i}
            className={`${s.tile} ${selected.has(i) ? s.tileOn : ""}`}
            style={{ background: `linear-gradient(145deg, ${a}, ${b})` }}
          >
            {selected.has(i) && <span className={s.check}>✓</span>}
          </span>
        ))}
      </div>
      <span className={s.cta}>Continue · 3 selected</span>
    </div>
  );
}

export function GameHubScreen() {
  return (
    <div className={s.hub}>
      <div className={s.topNav}>
        <span className={s.logoDot} />
        <Bar w={8} tone="strong" />
        <Bar w={8} />
        <Bar w={8} />
        <span className={s.search} />
      </div>
      <div className={s.hubBanner}>
        <span className={s.gameIcon} />
        <div className={s.hubTitle}>
          <span className={s.hubName}>Game hub</span>
          <Bar w={60} />
        </div>
        <span className={s.follow}>Follow</span>
      </div>
      <div className={s.tabs}>
        <span className={s.tabOn}>Communities</span>
        <span>Rooms</span>
        <span>Discussions</span>
        <span>Giveaways</span>
      </div>
      <div className={s.hubGrid}>
        {["#7c9cff", "#5ad19a", "#f2c14e"].map((c, i) => (
          <div key={c} className={s.hubCard}>
            <span className={s.hubCardArt} style={{ "--c": c } as CSSProperties} />
            <Bar w={[70, 56, 64][i]} tone="strong" />
            <Bar w={[48, 60, 40][i]} />
            <span className={s.join}>Join</span>
          </div>
        ))}
        <div className={s.liveRooms}>
          <span className={s.section}>Live rooms</span>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={s.member}>
              <span className={s.liveDot} />
              <Bar w={[64, 50, 70, 44][i]} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const ITEMS = ["#2ec4c9", "#7c9cff", "#5ad19a", "#c58cff", "#f2c14e", "#8ad1f0", "#ff9fb5", "#b7e36a"];

function ItemThumb({ c, i }: { c: string; i: number }) {
  return (
    <span className={s.thumb} style={{ "--c": c } as CSSProperties}>
      <span className={s[`shape${i % 3}`]} />
    </span>
  );
}

export function TradeListScreen() {
  return (
    <div className={s.trade}>
      <div className={s.topNav}>
        <span className={s.logoDot} />
        <Bar w={8} tone="strong" />
        <Bar w={8} />
        <span className={s.searchWide}>Search items</span>
      </div>
      <div className={s.chips}>
        <span className={s.chipOn}>All</span>
        <span>Popular</span>
        <span>Recent</span>
        <span>Offers</span>
      </div>
      <div className={s.itemGrid}>
        {ITEMS.map((c, i) => (
          <div key={c} className={s.itemCard}>
            <ItemThumb c={c} i={i} />
            <Bar w={[70, 56, 64, 48, 60, 72, 50, 66][i]} tone="strong" />
            <span className={s.itemMeta}>
              <Bar w={36} tone="accent" />
              <span className={s.itemBtn} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TradeMobileScreen() {
  return (
    <div className={s.tradeMobile}>
      <div className={s.appHeader}>
        <span className={s.appTitle}>Trading</span>
        <span className={s.headerIcons}>
          <i />
        </span>
      </div>
      <span className={s.searchMobile}>Search items</span>
      <div className={s.chips}>
        <span className={s.chipOn}>All</span>
        <span>Popular</span>
        <span>Recent</span>
      </div>
      <div className={s.itemList}>
        {ITEMS.slice(0, 5).map((c, i) => (
          <div key={c} className={s.itemRow}>
            <ItemThumb c={c} i={i} />
            <span className={s.itemRowText}>
              <Bar w={[70, 56, 64, 48, 60][i]} tone="strong" />
              <Bar w={40} tone="accent" />
            </span>
            <span className={s.chevron}>›</span>
          </div>
        ))}
      </div>
      <div className={s.tabBar}>
        <i className={s.tabBarOn} />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

const SCREENS: Record<MockScreen, { frame: "phone" | "window"; Screen: () => React.JSX.Element }> = {
  "chat-reply": { frame: "phone", Screen: ChatReplyScreen },
  "chat-actions": { frame: "phone", Screen: ChatActionsScreen },
  "server-nav": { frame: "window", Screen: ServerNavScreen },
  "onboarding-games": { frame: "phone", Screen: OnboardingGamesScreen },
  "game-hub": { frame: "window", Screen: GameHubScreen },
  "trade-list": { frame: "window", Screen: TradeListScreen },
  "trade-mobile": { frame: "phone", Screen: TradeMobileScreen },
};

/** One framed screen, used for case-study figures. */
export function MockScreenView({ screen, className }: { screen: MockScreen; className?: string }) {
  const { frame, Screen } = SCREENS[screen];
  return frame === "phone" ? (
    <PhoneFrame className={className}>
      <Screen />
    </PhoneFrame>
  ) : (
    <WindowFrame className={className}>
      <Screen />
    </WindowFrame>
  );
}
