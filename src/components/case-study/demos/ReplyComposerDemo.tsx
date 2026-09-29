"use client";

import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";
import { gsap } from "@/lib/gsap";
import s from "./ReplyComposerDemo.module.css";

/**
 * Portfolio re-creation of two messaging behaviours: swipe-to-reply and a
 * reply state that stays attached to the composer. Not production code.
 * Fictional sample conversation.
 */

type Message = {
  id: number;
  name: string;
  color: string;
  text: string;
  replyTo?: { name: string; text: string };
};

const INITIAL: Message[] = [
  { id: 1, name: "Mira", color: "#7c9cff", text: "Anyone up for a run tonight?" },
  { id: 2, name: "Kabir", color: "#f2c14e", text: "Queue opens at nine. I’m in." },
  { id: 3, name: "Theo", color: "#5ad19a", text: "Same — bringing the new build." },
];

const SWIPE_TRIGGER = 56;
const SWIPE_MAX = 84;

export function ReplyComposerDemo() {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [replyTo, setReplyTo] = useState<Message | null>(INITIAL[1]);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const idRef = useRef(100);

  // Keep the newest message in view inside the demo (not the page).
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages]);

  const startReply = (m: Message) => {
    setReplyTo(m);
    inputRef.current?.focus({ preventScroll: true });
  };

  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    idRef.current += 1;
    setMessages((ms) => [
      ...ms,
      {
        id: idRef.current,
        name: "You",
        color: "#0e93a6",
        text,
        replyTo: replyTo ? { name: replyTo.name, text: replyTo.text } : undefined,
      },
    ]);
    setDraft("");
    setReplyTo(null);
  };

  const reset = () => {
    setMessages(INITIAL);
    setReplyTo(INITIAL[1]);
    setDraft("");
  };

  return (
    <div className={s.demo}>
      <p className={s.hint} id="demo-hint">
        Swipe a message to the right — or use <strong>Reply</strong> — then send.
      </p>
      <div className={s.phone}>
        <div className={s.header}>
          <span className={s.hash} aria-hidden="true">
            #
          </span>
          general
          <button type="button" className={s.reset} onClick={reset}>
            Reset
          </button>
        </div>

        <ol ref={listRef} className={s.list} aria-label="Demo conversation" aria-describedby="demo-hint">
          {messages.map((m) => (
            <SwipeRow key={m.id} message={m} active={replyTo?.id === m.id} onReply={startReply} />
          ))}
        </ol>

        <form className={s.composer} onSubmit={send}>
          {replyTo && (
            <div className={s.replyBar}>
              <span className={s.replyAccent} aria-hidden="true" />
              <span className={s.replyText}>
                Replying to <b>{replyTo.name}</b>
                <span className={s.excerpt}>{replyTo.text}</span>
              </span>
              <button
                type="button"
                className={s.cancel}
                onClick={() => setReplyTo(null)}
                aria-label={`Cancel reply to ${replyTo.name}`}
              >
                ×
              </button>
            </div>
          )}
          <div className={s.inputRow}>
            <label htmlFor="demo-input" className="sr-only">
              Message #general
            </label>
            <input
              ref={inputRef}
              id="demo-input"
              className={s.input}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape" && replyTo) {
                  e.preventDefault();
                  setReplyTo(null);
                }
              }}
              placeholder="Message #general"
              autoComplete="off"
              enterKeyHint="send"
              maxLength={140}
            />
            <button type="submit" className={s.send} aria-label="Send message" disabled={!draft.trim()}>
              <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                <path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </form>
        <p className="sr-only" aria-live="polite">
          {replyTo ? `Replying to ${replyTo.name}.` : ""}
        </p>
      </div>
    </div>
  );
}

function SwipeRow({
  message,
  active,
  onReply,
}: {
  message: Message;
  active: boolean;
  onReply: (m: Message) => void;
}) {
  const bubble = useRef<HTMLDivElement>(null);
  const icon = useRef<HTMLSpanElement>(null);
  const drag = useRef<{ x: number; y: number; active: boolean } | null>(null);

  const setOffset = (x: number) => {
    gsap.set(bubble.current, { x });
    gsap.set(icon.current, { opacity: Math.min(x / SWIPE_TRIGGER, 1), scale: 0.6 + 0.4 * Math.min(x / SWIPE_TRIGGER, 1) });
  };

  const release = () => {
    gsap.to(bubble.current, { x: 0, duration: 0.25, ease: "power3.out" });
    gsap.to(icon.current, { opacity: 0, scale: 0.6, duration: 0.2 });
  };

  const onPointerDown = (e: PointerEvent<HTMLLIElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button")) return;
    drag.current = { x: e.clientX, y: e.clientY, active: false };
  };

  const onPointerMove = (e: PointerEvent<HTMLLIElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.active) {
      // Only claim clearly horizontal, rightward drags; vertical stays native.
      if (dx > 8 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        d.active = true;
        e.currentTarget.setPointerCapture(e.pointerId);
      } else if (Math.abs(dy) > 10 || dx < -8) {
        drag.current = null;
        return;
      } else {
        return;
      }
    }
    setOffset(Math.min(Math.max(dx, 0), SWIPE_MAX));
  };

  const onPointerEnd = (e: PointerEvent<HTMLLIElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d?.active) return;
    if (e.clientX - d.x >= SWIPE_TRIGGER) onReply(message);
    release();
  };

  return (
    <li
      className={`${s.row} ${active ? s.rowActive : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      <span ref={icon} className={s.swipeIcon} aria-hidden="true">
        ↩
      </span>
      <div ref={bubble} className={s.bubble}>
        <span className={s.avatar} style={{ background: message.color }} aria-hidden="true" />
        <div className={s.body}>
          {message.replyTo && (
            <span className={s.quote}>
              <span className="sr-only">In reply to </span>
              <b>{message.replyTo.name}</b> {message.replyTo.text}
            </span>
          )}
          <span className={s.name}>{message.name}</span>
          <span className={s.text}>{message.text}</span>
        </div>
        {message.name !== "You" && (
          <button
            type="button"
            className={s.replyBtn}
            onClick={() => onReply(message)}
            aria-label={`Reply to ${message.name}`}
          >
            Reply
          </button>
        )}
      </div>
    </li>
  );
}
