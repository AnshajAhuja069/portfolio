"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Mascot, type MascotAction, type MascotHandle } from "@/components/mascot/Mascot";
import { guide } from "@/content/guide";
import { store, useGuideHidden } from "./store";
import s from "./TalkingMascot.module.css";

type Props = {
  /** Session key, so each nudge plays once per visit. */
  id: string;
  /** Said once, a moment after the mascot is in view. */
  onView?: string;
  onViewDelay?: number;
  /** Rotating lines for clicks. */
  clicks: string[];
  /** Said once when this element (e.g. the footer) comes into view. */
  end?: { selector: string; text: string };
  /** Drop the bubble once the page scrolls past this many pixels. */
  quietAfter?: number;
  /** Bubble position per placement (see the CSS). */
  variant: "hero" | "contact";
  greetOnView?: boolean;
};

/**
 * A page mascot (hero, contact) that reacts to clicks and says a line or two.
 * These are where the corner guide steps aside, so they speak for him.
 * Decorative: the corner guide and the page carry the same information.
 */
export function TalkingMascot({ id, onView, onViewDelay = 2200, clicks, end, quietAfter, variant, greetOnView }: Props) {
  const endSelector = end?.selector;
  const endText = end?.text;
  const wrap = useRef<HTMLDivElement>(null);
  const face = useRef<MascotHandle>(null);
  const bubble = useRef<HTMLSpanElement>(null);
  // Automatic comments respect "Hide me"; clicks always answer.
  const quiet = useGuideHidden(true);
  const [line, setLine] = useState<string | null>(null);
  const meta = useRef({ i: 0, last: "" as MascotAction | "", timer: 0 as ReturnType<typeof setTimeout> | 0 });

  const say = useCallback((text: string, ms = 4200) => {
    clearTimeout(meta.current.timer);
    setLine(text);
    meta.current.timer = setTimeout(() => setLine(null), ms);
  }, []);

  // Nudge once, a moment after coming into view.
  useEffect(() => {
    const el = wrap.current;
    if (!el || !onView || quiet) return;
    const key = `talk:${id}`;
    let t: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        clearTimeout(t);
        if (!e.isIntersecting || store.seen().has(key)) return;
        t = setTimeout(() => {
          if (quietAfter !== undefined && window.scrollY > quietAfter) return;
          store.markSeen(key);
          face.current?.react("wave");
          say(onView, 5200);
        }, onViewDelay);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, [id, onView, onViewDelay, quiet, quietAfter, say]);

  // A closing line when the footer (or another end marker) arrives.
  useEffect(() => {
    const target = endSelector ? document.querySelector(endSelector) : null;
    if (!endText || !target || quiet) return;
    const key = `talk:${id}:end`;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || store.seen().has(key)) return;
        store.markSeen(key);
        face.current?.react("nod");
        say(endText, 4600);
      },
      { threshold: 0.5 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [endSelector, endText, id, quiet, say]);

  // The hero bubble gets out of the way as soon as the visitor scrolls.
  useEffect(() => {
    if (quietAfter === undefined) return;
    const onScroll = () => window.scrollY > quietAfter && setLine(null);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [quietAfter]);

  useEffect(() => () => clearTimeout(meta.current.timer), []);

  // Keep the bubble on screen: where the mascot lands depends on the
  // headline's width, so measure and narrow it if it would hit the edge.
  useLayoutEffect(() => {
    const b = bubble.current;
    if (!b) return;
    b.style.maxWidth = "";
    delete b.dataset.tight;
    // offsetWidth ignores the pop-in scale; the left edge is its origin.
    const r = b.getBoundingClientRect();
    const right = r.left + b.offsetWidth;
    const edge = document.documentElement.clientWidth - 12;
    const room = edge - r.left;
    b.dataset.tight = room < 140 ? 'true' : 'false';
    if (right > edge) b.style.maxWidth = `${Math.max(96, room)}px`;
  }, [line]);

  const onClick = () => {
    const m = meta.current;
    const pool = guide.reactions.filter((r) => r !== m.last);
    const r = pool[Math.floor(Math.random() * pool.length)];
    m.last = r;
    face.current?.react(r);
    say(clicks[m.i % clicks.length], 2800);
    m.i += 1;
  };

  return (
    <div ref={wrap} className={s.wrap} onClick={onClick}>
      <Mascot ref={face} interactive={false} greetOnView={greetOnView} />
      {line && (
        <span ref={bubble} className={`${s.bubble} ${s[variant]}`} aria-hidden="true" key={line}>
          {line}
        </span>
      )}
    </div>
  );
}
