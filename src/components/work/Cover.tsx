import type { CSSProperties } from "react";
import { getImageProps } from "next/image";
import Image from "next/image";
import type { Cover as CoverData, CoverComposition } from "@/content/projects";
import { PhoneFrame, WindowFrame } from "@/components/mocks/Frames";
import {
  ChatReplyScreen,
  GameHubScreen,
  OnboardingGamesScreen,
  ServerNavScreen,
  TradeListScreen,
  TradeMobileScreen,
} from "@/components/mocks/Screens";
import { IdentityCover } from "./IdentityCover";
import s from "./Cover.module.css";

const COMPOSITIONS: Record<
  CoverComposition,
  { Back: () => React.JSX.Element; Front: () => React.JSX.Element }
> = {
  community: { Back: ServerNavScreen, Front: ChatReplyScreen },
  discovery: { Back: GameHubScreen, Front: OnboardingGamesScreen },
  trading: { Back: TradeListScreen, Front: TradeMobileScreen },
};

/** Teal plates need the nav wordmark's solid (non-inverted) state. */
const isAccentPlate = (plate: string) => plate.toLowerCase() === "#0e93a6";

type Props = {
  cover: CoverData;
  /** Show the "Illustrative mock" label (kept on while real media is pending). */
  showTag?: boolean;
  priority?: boolean;
  className?: string;
};

/**
 * A project cover. Either a layered, code-drawn illustrative composition or a
 * real image with an optional mobile crop. Layers carry data-layer so the
 * gallery can add parallax without knowing what's inside.
 */
export function Cover({ cover, showTag = true, priority = false, className }: Props) {
  if (cover.kind === "image") {
    return <ImageCover cover={cover} priority={priority} className={className} />;
  }
  if (cover.kind === "identity") {
    return <IdentityCover alt={cover.alt} priority={priority} className={className} />;
  }

  const { Back, Front } = COMPOSITIONS[cover.composition];
  const realScreens = cover.kind === "screenshots";
  return (
    <div
      className={`${s.cover} ${s[cover.composition]} ${className ?? ""}`}
      style={{ "--plate": cover.plate } as CSSProperties}
      role="img"
      aria-label={cover.alt}
      data-cover
      data-surface={isAccentPlate(cover.plate) ? "accent" : undefined}
    >
      <div className={s.back} data-layer="back">
        <div className={s.backTilt}>
          <WindowFrame>
            {realScreens ? (
              <Image {...cover.desktop} alt="" sizes="(max-width: 899px) 130vw, 48vw" priority={priority} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "top", background: "#08080b" }} />
            ) : <Back />}
          </WindowFrame>
        </div>
      </div>
      <div className={s.front} data-layer="front">
        <PhoneFrame showStatusBar={!realScreens}>
          {realScreens ? (
            <Image {...cover.mobile} alt="" sizes="(max-width: 899px) 46vw, 16vw" priority={priority} style={{ width: "100%", height: "100%", minHeight: 0, objectFit: "contain", objectPosition: "top", background: cover.composition === "community" ? "#101128" : "#08080b" }} />
          ) : <Front />}
        </PhoneFrame>
      </div>
      {showTag && !realScreens && (
        <span className={s.tag} aria-hidden="true">
          Illustrative mock
        </span>
      )}
    </div>
  );
}

function ImageCover({
  cover,
  priority,
  className,
}: {
  cover: Extract<CoverData, { kind: "image" }>;
  priority: boolean;
  className?: string;
}) {
  const common = { alt: cover.alt, sizes: "(max-width: 899px) 100vw, 64vw", priority };
  const { props: desktop } = getImageProps({ ...common, ...cover.desktop });
  const mobile = cover.mobile ? getImageProps({ ...common, ...cover.mobile }).props : null;

  return (
    <div
      className={`${s.cover} ${s.imageCover} ${className ?? ""}`}
      style={{ "--plate": cover.plate ?? "var(--ink-3)" } as CSSProperties}
      data-cover
    >
      <picture>
        {mobile && <source media="(max-width: 899px)" srcSet={mobile.srcSet} />}
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is supplied via getImageProps */}
        <img {...desktop} className={s.img} data-layer="back" />
      </picture>
    </div>
  );
}
