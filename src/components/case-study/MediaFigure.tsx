import Image from "next/image";
import type { Media } from "@/content/projects";
import { MockScreenView } from "@/components/mocks/Screens";
import { ReplyComposerDemo } from "./demos/ReplyComposerDemo";
import s from "./CaseStudy.module.css";

export function MediaFigure({ media }: { media: Media }) {
  if (media.kind === "demo") {
    return (
      <figure className={`${s.figure} ${s.figurePhone}`}>
        <div className={s.plate}>
          <span className={s.plateTag}>Interactive re-creation</span>
          {media.demo === "reply-composer" && <ReplyComposerDemo />}
        </div>
        <figcaption className={s.caption}>{media.caption}</figcaption>
      </figure>
    );
  }

  if (media.kind === "story") return null; // rendered full-bleed by CaseStudy

  if (media.kind === "image") {
    const layout = media.layout ?? "full";
    const layoutClass = layout === "full" ? s.figureFull : layout === "half" ? s.figureHalf : s.figureThird;
    return (
      <figure className={`${s.figure} ${layoutClass}`} data-figure>
        <div
          className={`${s.imagePlate} ${media.plate ? "" : s.imagePlateBare}`}
          style={media.plate ? { background: media.plate } : undefined}
        >
          <Image
            src={media.image.src}
            width={media.image.width}
            height={media.image.height}
            alt={media.alt}
            sizes={layout === "full" ? "(max-width: 899px) 100vw, 70vw" : "(max-width: 899px) 100vw, 34vw"}
            className={s.figureImg}
          />
        </div>
        <figcaption className={s.caption}>{media.caption}</figcaption>
      </figure>
    );
  }

  const isPhone = media.frame === "phone";
  return (
    <figure className={`${s.figure} ${isPhone ? s.figurePhone : s.figureWide}`}>
      <div className={s.plate}>
        <span className={s.plateTag}>Illustrative mock</span>
        <div className={isPhone ? s.phoneSlot : s.windowSlot} role="img" aria-label={media.alt}>
          <MockScreenView screen={media.screen} />
        </div>
      </div>
      <figcaption className={s.caption}>{media.caption}</figcaption>
    </figure>
  );
}
