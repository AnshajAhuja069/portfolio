import Image from "next/image";
import { IcebergDepth } from "@/components/brand/IcebergArt";
import s from "./IdentityCover.module.css";

const LOGO = { src: "/images/work/brand-identity/gamersberg-logo.png", width: 457, height: 408 };
const PEAK = { src: "/images/work/brand-identity/peak-rocket.png", width: 408, height: 605 };

/**
 * Brand cover built from the real Gamersberg identity assets: the logo sits
 * on a waterline like the tip of an iceberg, with its (drawn) underwater mass
 * below, and Peak in front. Layers carry data-layer for gallery parallax.
 */
export function IdentityCover({
  alt,
  priority = false,
  className,
}: {
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`${s.cover} ${className ?? ""}`} role="img" aria-label={alt} data-cover>
      <span className={s.stars} aria-hidden="true" />
      <span className={s.glow} aria-hidden="true" />

      <div className={s.depth} data-layer="back" aria-hidden="true">
        <IcebergDepth />
      </div>

      <span className={s.waterline} aria-hidden="true" />

      <div className={s.gauge} aria-hidden="true">
        <span className={s.gaugeTop}>Surface</span>
        <span className={s.gaugeBottom}>≈90% below</span>
      </div>

      <div className={s.logo} data-layer="mid">
        <Image src={LOGO.src} width={LOGO.width} height={LOGO.height} alt="" sizes="(max-width: 899px) 60vw, 24vw" priority={priority} />
        <Image
          className={s.reflection}
          src={LOGO.src}
          width={LOGO.width}
          height={LOGO.height}
          alt=""
          sizes="(max-width: 899px) 60vw, 24vw"
        />
      </div>

      <div className={s.card} data-layer="front">
        <Image src={PEAK.src} width={PEAK.width} height={PEAK.height} alt="" sizes="(max-width: 899px) 34vw, 18vw" />
        <span className={s.cardLabel}>Peak</span>
      </div>
    </div>
  );
}
