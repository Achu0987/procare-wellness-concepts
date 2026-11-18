"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import {
  ADDRESS_LINE_1,
  BP,
  ADDRESS_LINE_2,
  ALSO,
  AREAS,
  CREDITS,
  FAQ,
  FIGURES,
  HOURS,
  JOURNEY,
  MARQUEE,
  MAPS_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  QUOTES,
  SPECIALTIES,
  STAGE_IMAGES,
  TEAM,
} from "./content";

const Stage = dynamic(() => import("./Stage"), { ssr: false, loading: () => <div className="c1-stage-media" /> });
const STAGE_ALTS = SPECIALTIES.map((s) => s.alt);
const HERO_IMAGES = [`${BP}/c1/consult.jpg`];
const HERO_ALTS = ["A bright, quiet clinic lounge with a palm and green armchairs"];
const N = SPECIALTIES.length;
const INTRO =
  "ProCare treats joint pain, nerve pain and wounds that will not heal, without surgery, with every specialist in one Savannah building.";

/* ---------- live opening status, in Savannah's time zone ---------- */
function useOpenStatus() {
  const [state, setState] = useState<{ text: string; today: number } | null>(null);
  useEffect(() => {
    const calc = () => {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      }).formatToParts(new Date());
      const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
      const dayIdx = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
      const now = (Number(get("hour")) % 24) + Number(get("minute")) / 60;
      const fmt = (x: number) => `${x > 12 ? x - 12 : x}:00 ${x >= 12 ? "pm" : "am"}`;
      const today = HOURS.find((d) => d.idx === dayIdx);
      if (today?.open && now >= today.open[0] && now < today.open[1]) {
        setState({ text: `Open now, until ${fmt(today.open[1])}`, today: dayIdx });
        return;
      }
      for (let k = 0; k < 7; k++) {
        const idx = (dayIdx + k) % 7;
        const d = HOURS.find((x) => x.idx === idx);
        if (!d?.open || (k === 0 && now >= d.open[0])) continue;
        const label = k === 0 ? "today" : k === 1 ? "tomorrow" : d.day;
        setState({ text: `Closed now, opens ${label} at ${fmt(d.open[0])}`, today: dayIdx });
        return;
      }
    };
    calc();
    const t = setInterval(calc, 60_000);
    return () => clearInterval(t);
  }, []);
  return state;
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="pc-icon">
      <path
        d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Concept1() {
  const [active, setActive] = useState(0);
  const [note, setNote] = useState(false);
  const status = useOpenStatus();
  const root = useRef<HTMLDivElement>(null);
  const pinRef = useRef<ScrollTrigger | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    root.current?.classList.add("js");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = (t: number) => lenisRef.current?.raf(t * 1000);
    if (!reduce) {
      const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      lenisRef.current = lenis;
    }

    // The phone action bar waits until the hero, which has its own actions, has gone.
    const heroEl = document.querySelector(".pc-hero");
    const io = heroEl
      ? new IntersectionObserver(([e]) => root.current?.classList.toggle("hero-in", e.isIntersecting), { threshold: 0.15 })
      : null;
    if (heroEl && io) io.observe(heroEl);

    const splits: SplitText[] = [];
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 60rem)" },
        (mctx) => {
          const { motion: canMove, desktop } = mctx.conditions as { motion: boolean; desktop: boolean };
          if (!canMove) return;

          /* ---------- 1. Every pinned scene first, in page order, so later triggers measure the real page ---------- */

          // The name opens: letters grow until the photograph inside them fills the screen.
          const zoom = gsap.timeline({
            scrollTrigger: { trigger: ".pc-zoom", start: "top top", end: "+=180%", pin: ".pc-zoom-pin", scrub: 1, anticipatePin: 1 },
          });
          zoom
            .fromTo(".pc-zoom-mask", { scale: 1 }, { scale: 42, ease: "power2.in", duration: 1 }, 0)
            .fromTo(".pc-zoom-photo img", { scale: 1.35 }, { scale: 1, ease: "none", duration: 1 }, 0)
            .to(".pc-zoom-mask", { opacity: 0, duration: 0.15 }, 0.85)
            .fromTo(".pc-zoom-after", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.25 }, 0.9);

          // The specialties chapter holds and steps through six rooms.
          if (desktop) {
            pinRef.current = ScrollTrigger.create({
              trigger: ".pc-chapter-pin",
              start: "top top",
              end: () => `+=${window.innerHeight * 0.75 * N}`,
              pin: true,
              anticipatePin: 1,
              onUpdate: (self) => {
                const i = Math.min(N - 1, Math.floor(self.progress * N));
                setActive((a) => (a === i ? a : i));
                const bar = document.querySelector<HTMLElement>(".pc-progress-fill");
                if (bar) bar.style.transform = `scaleX(${self.progress})`;
              },
            });
          }

          // The first visit runs sideways while its section holds.
          const track = document.querySelector<HTMLElement>(".pc-journey-track");
          if (desktop && track) {
            const dist = () => track.scrollWidth - window.innerWidth + 64;
            const run = gsap.to(track, {
              x: () => -dist(),
              ease: "none",
              scrollTrigger: {
                trigger: ".pc-journey",
                start: "top top+=76",
                end: () => `+=${dist()}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  const bar = document.querySelector<HTMLElement>(".pc-journey-fill");
                  if (bar) bar.style.transform = `scaleX(${self.progress})`;
                },
              },
            });
            gsap.utils.toArray<HTMLElement>(".pc-journey-card").forEach((card) => {
              const img = card.querySelector("img");
              if (img)
                gsap.fromTo(img, { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: { trigger: card, containerAnimation: run, start: "left right", end: "right left", scrub: true } });
              gsap.from(card.querySelector(".pc-journey-text"), {
                y: 50,
                opacity: 0,
                duration: 0.9,
                ease: "expo.out",
                scrollTrigger: { trigger: card, containerAnimation: run, start: "left 80%", toggleActions: "play none none reverse" },
              });
            });
          }

          /* ---------- 2. The hero ---------- */
          gsap.to(".pc-progress-top", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
          const h1 = SplitText.create(".pc-hero h1", { type: "words,lines", mask: "lines", linesClass: "pc-mask" });
          splits.push(h1);
          gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .from(".pc-hero-media", { scale: 1.15, duration: 2.2, ease: "power3.out" }, 0)
            .from(".pc-hero-scrim", { opacity: 0, duration: 1.2 }, 0.1)
            .from(h1.words, { yPercent: 120, rotate: 4, duration: 1.3, stagger: 0.06 }, 0.3)
            .from(".pc-hero [data-r]", { y: 20, opacity: 0, duration: 1, stagger: 0.1 }, 0.9);
          // Leaving the hero: the picture eases back into a framed card. Transform only, so it stays smooth.
          gsap.to(".pc-hero-frame", { scale: 0.9, yPercent: 3, ease: "none", scrollTrigger: { trigger: ".pc-hero", start: "top top", end: "bottom top", scrub: 0.4 } });
          gsap.to(".pc-hero-grid", { y: -120, opacity: 0, ease: "none", scrollTrigger: { trigger: ".pc-hero", start: "20% top", end: "75% top", scrub: 0.4 } });

          /* ---------- 3. Everything that plays as it arrives (and replays when scrolled back past) ---------- */
          const enter = (trigger: Element | string, start = "top 82%") => ({
            trigger,
            start,
            toggleActions: "play none none reverse",
          });

          // The intro sentence fills in, word by word, as it is read.
          const introSplit = SplitText.create(".pc-intro-text", { type: "words" });
          splits.push(introSplit);
          gsap.fromTo(introSplit.words, { opacity: 0.15 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: ".pc-intro", start: "top 70%", end: "center 45%", scrub: true } });

          // Real figures count up.
          gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
            const obj = { v: 0 };
            gsap.to(obj, {
              v: Number(el.dataset.count),
              duration: 1.8,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = String(Math.round(obj.v));
              },
              scrollTrigger: enter(el, "top 88%"),
            });
          });
          gsap.from(".pc-figure", { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.12, scrollTrigger: enter(".pc-figures", "top 88%") });

          // Conditions run in two strips, opposite ways.
          gsap.fromTo(".pc-strip-0", { xPercent: 0 }, { xPercent: -35, ease: "none", scrollTrigger: { trigger: ".pc-marquee", start: "top bottom", end: "bottom top", scrub: 0.6 } });
          gsap.fromTo(".pc-strip-1", { xPercent: -35 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: ".pc-marquee", start: "top bottom", end: "bottom top", scrub: 0.6 } });

          // Every heading rises out of its own lines, word by word.
          gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
            const sp = SplitText.create(el, { type: "lines,words", mask: "lines", linesClass: "pc-mask" });
            splits.push(sp);
            gsap.from(sp.words, { yPercent: 115, rotate: 3, duration: 1.2, ease: "expo.out", stagger: 0.05, scrollTrigger: enter(el, "top 88%") });
          });

          // The chapter's frame and list arrive.
          gsap.from(".pc-stage", { clipPath: "inset(20% 0% 20% 30%)", duration: 1.6, ease: "expo.out", scrollTrigger: enter(".pc-chapter", "top 70%") });
          gsap.from(".pc-rail li", { x: -40, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.06, scrollTrigger: enter(".pc-chapter", "top 65%") });

          // Pictures open from a smaller frame and settle.
          gsap.utils.toArray<HTMLElement>("[data-unveil]").forEach((el) => {
            gsap.fromTo(el, { clipPath: "inset(16% 12% 16% 12%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: el, start: "top 92%", end: "top 30%", scrub: true } });
            const img = el.querySelector("img");
            if (img) gsap.fromTo(img, { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
          });

          // The mission: the field opens to full width and its lines rise from behind a mask.
          const mission = SplitText.create(".pc-statement-q p", { type: "lines", mask: "lines", linesClass: "pc-mask" });
          splits.push(mission);
          gsap.from(mission.lines, { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.12, scrollTrigger: enter(".pc-statement", "top 70%") });
          gsap.fromTo(".pc-statement", { clipPath: "inset(0% 6% 0% 6%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: ".pc-statement", start: "top bottom", end: "top 30%", scrub: true } });

          // Team roles slide in one after another.
          gsap.from(".pc-team-row", { x: 80, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.08, scrollTrigger: enter(".pc-team-list", "top 85%") });

          // Patient cards rise in, then settle back as the next slides over.
          gsap.utils.toArray<HTMLElement>(".pc-card").forEach((card, i, all) => {
            gsap.from(card.querySelector("blockquote"), { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: enter(card, "top 80%") });
            if (i < all.length - 1)
              gsap.to(card, { scale: 0.94, ease: "none", scrollTrigger: { trigger: all[i + 1], start: "top bottom", end: "top 25%", scrub: true } });
          });

          // Questions slide in, row by row.
          gsap.from(".pc-faq-item", { x: -60, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.07, scrollTrigger: enter(".pc-faq-list", "top 85%") });

          // The close: the booking heading grows into place.
          gsap.fromTo("#pc-book-h", { scale: 0.7, transformOrigin: "0% 50%" }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".pc-book-grid", start: "top bottom", end: "top 50%", scrub: true } });
          gsap.from(".pc-form > *", { y: 30, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.06, scrollTrigger: enter(".pc-form", "top 88%") });
          gsap.from(".pc-hours tr", { x: 40, opacity: 0, duration: 0.7, ease: "expo.out", stagger: 0.05, scrollTrigger: enter(".pc-hours", "top 90%") });

          // Any other marked parts rise as they arrive.
          gsap.utils.toArray<HTMLElement>("[data-sec]").forEach((sec) => {
            const items = sec.querySelectorAll("[data-r]");
            if (items.length) gsap.from(items, { y: 36, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08, scrollTrigger: enter(sec, "top 80%") });
          });

          // Footer: the logo and links rise into place.
          gsap.from(".pc-foot-logo", { y: 80, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: enter(".pc-foot", "top 90%") });
          gsap.from(".pc-foot-grid > *", { y: 30, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.08, scrollTrigger: enter(".pc-foot", "top 85%") });

          // Measure again once fonts and pictures have settled.
          const re = () => ScrollTrigger.refresh();
          document.fonts?.ready.then(re);
          window.addEventListener("load", re, { once: true });

          return () => {
            pinRef.current = null;
          };
        }
      );
    }, root);

    return () => {
      io?.disconnect();
      ctx.revert();
      mm.revert();
      splits.forEach((s) => s.revert());
      gsap.ticker.remove(tick);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    const el = document.querySelector<HTMLElement>(id);
    if (!el) return;
    e.preventDefault();
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -76, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  // Rail click: inside the pinned chapter, scroll to that room; otherwise just show it.
  const pick = (i: number) => {
    setActive(i);
    const st = pinRef.current;
    if (!st) return;
    const y = st.start + ((i + 0.5) / N) * (st.end - st.start);
    if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const s = SPECIALTIES[active];

  return (
    <div className="pc" ref={root}>
      <a href="#main" className="pc-skip">
        Skip to content
      </a>
      <div className="pc-progress-top" aria-hidden="true" />

      <header className="pc-nav">
        <div className="container pc-nav-in">
          <a href="#top" className="pc-logo" aria-label="ProCare Wellness Institute, home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${BP}/c1/procare-logo-color.png`} alt="ProCare Wellness Institute, Regenerative and Aesthetic Medicine" width={480} height={135} />
          </a>
          <nav aria-label="Primary" className="pc-nav-links">
            <a href="#specialties" onClick={go("#specialties")}>Specialties</a>
            <a href="#team" onClick={go("#team")}>Care team</a>
            <a href="#first-visit" onClick={go("#first-visit")}>First visit</a>
            <a href="#questions" onClick={go("#questions")}>Questions</a>
          </nav>
          <a href="#book" onClick={go("#book")} className="pc-btn pc-btn-quiet pc-nav-cta">
            Book a consultation
          </a>
          <a href={PHONE_TEL} className="pc-btn pc-btn-quiet pc-nav-call">
            <PhoneIcon />
            <span>Call</span>
          </a>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        {/* ===== Hero ===== */}
        <section className="pc-hero" id="top" aria-labelledby="pc-h1">
          <div className="pc-hero-frame">
            <figure className="pc-hero-photo" data-slot="hero" data-alt="ProCare's own reception or treatment room, in daylight">
              <div className="pc-hero-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={HERO_IMAGES[0]} alt={HERO_ALTS[0]} width={2000} height={1348} fetchPriority="high" decoding="async" />
              </div>
            </figure>
            <div className="pc-hero-scrim" aria-hidden="true" />
          </div>
          <div className="container pc-hero-grid">
            <div className="pc-hero-text">
              <h1 id="pc-h1">Specialist care, without surgery.</h1>
              <p className="pc-lead" data-r>
                Joint pain, neuropathy, wound care and chronic pain, treated in Savannah.
              </p>
              <div className="pc-actions" data-r>
                <motion.a href="#book" onClick={go("#book")} className="pc-btn pc-btn-primary" whileTap={{ y: 1 }}>
                  Book a consultation
                </motion.a>
                <a href={PHONE_TEL} className="pc-btn pc-btn-light">
                  <PhoneIcon />
                  <span>{PHONE_DISPLAY}</span>
                </a>
              </div>
            </div>
          </div>
          <div className="pc-hero-band">
            <div className="container pc-hero-facts" data-r>
              <p className="pc-hero-status">{status ? status.text : "Open Monday to Thursday"}</p>
              <a href={MAPS_URL} target="_blank" rel="noreferrer">
                {ADDRESS_LINE_1}, Savannah
              </a>
              <p>Same-day urgent appointments available</p>
              <p>Insurance benefits verified at your first visit</p>
            </div>
          </div>
        </section>

        {/* ===== The name opens: the photograph inside the letters fills the screen ===== */}
        <section className="pc-zoom" aria-labelledby="pc-zoom-h">
          <div className="pc-zoom-pin">
            <div className="pc-zoom-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BP}/c1/team.jpg`} alt="" width={2000} height={1333} loading="lazy" />
            </div>
            <svg className="pc-zoom-mask" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <defs>
                <mask id="pc-zoom-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="900">
                  <rect width="1600" height="900" fill="white" />
                  <text x="800" y="470" textAnchor="middle" dominantBaseline="middle" className="pc-zoom-word">
                    ProCare
                  </text>
                </mask>
              </defs>
              <rect width="1600" height="900" className="pc-zoom-fill" mask="url(#pc-zoom-cut)" />
            </svg>
            <div className="pc-zoom-after container">
              <h2 id="pc-zoom-h">Every specialist you need, in one Savannah building.</h2>
            </div>
          </div>
        </section>

        {/* ===== What ProCare does, in one sentence and four real figures ===== */}
        <section className="pc-intro" aria-labelledby="pc-intro-h">
          <div className="container">
            <h2 id="pc-intro-h" className="pc-intro-text">
              {INTRO}
            </h2>
            <ul className="pc-figures">
              {FIGURES.map((f) => (
                <li key={f.label} className="pc-figure">
                  <span className="pc-figure-num num">
                    {f.prefix}
                    <span data-count={f.value}>{f.value}</span>
                  </span>
                  <span className="pc-figure-label">{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ===== What we treat, as two strips that run with the scroll ===== */}
        <section className="pc-marquee" aria-labelledby="pc-marquee-h">
          <div className="container">
            <h2 id="pc-marquee-h" data-split>From knee pain to wounds that will not heal</h2>
          </div>
          <div className="pc-strips" aria-label="Conditions ProCare treats">
            {MARQUEE.map((row, r) => (
              <ul key={r} className={`pc-strip pc-strip-${r}`}>
                {[...row, ...row].map((c, i) => (
                  <li key={i} className={i % 2 ? "pc-strip-out" : undefined} aria-hidden={i >= row.length ? true : undefined}>
                    {c}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </section>

        {/* ===== Signature: the six specialties, one room at a time ===== */}
        <section className="pc-chapter" id="specialties" aria-labelledby="pc-spec-h">
          <div className="pc-chapter-pin">
            <div className="container pc-chapter-grid">
              <div className="pc-chapter-text">
                <h2 id="pc-spec-h">Six specialties, one Savannah address</h2>
                <ul className="pc-rail" aria-label="Specialties">
                  {SPECIALTIES.map((sp, i) => (
                    <li key={sp.id}>
                      <button
                        type="button"
                        className="pc-rail-btn"
                        aria-current={i === active ? "true" : undefined}
                        aria-controls="pc-room"
                        onClick={() => pick(i)}
                      >
                        {sp.name}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="pc-room" id="pc-room" aria-live="polite">
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="pc-room-summary">{s.summary}</p>
                    <p className="pc-room-cond">{s.conditions.join(", ")}.</p>
                    {s.confirm && (
                      <p className="fill" data-fill="vascular">
                        {s.confirm}
                      </p>
                    )}
                    <a href={s.href} className="pc-link" target="_blank" rel="noreferrer">
                      Read about {s.short.toLowerCase()} on pcw.health
                    </a>
                  </motion.div>
                </div>
              </div>
              <figure className="pc-stage" aria-label={`Photograph: ${s.name}`}>
                <Stage images={STAGE_IMAGES} active={active} alts={STAGE_ALTS} />
                <figcaption className="pc-stage-cap">
                  <motion.span
                    key={s.id}
                    className="pc-stage-name"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {s.name}
                  </motion.span>
                  <span className="pc-stage-tr">{s.treatments}</span>
                </figcaption>
                <div className="pc-progress" aria-hidden="true">
                  <span className="pc-progress-fill" />
                </div>
              </figure>
            </div>
          </div>

          {/* Phones and reduced motion: the same six rooms, stacked */}
          <ol className="container pc-rooms" aria-label="Specialties in detail">
            {SPECIALTIES.map((sp) => (
              <li key={sp.id} className="pc-room-card" data-sec>
                <figure className="pc-room-photo" data-unveil>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sp.image} alt={sp.alt} width={1200} height={900} loading="lazy" />
                </figure>
                <h3 data-r>{sp.name}</h3>
                <p data-r>{sp.summary}</p>
                <p className="pc-room-cond" data-r>{sp.conditions.join(", ")}.</p>
                {sp.confirm && <p className="fill" data-fill="vascular-m">{sp.confirm}</p>}
                <a href={sp.href} className="pc-link" target="_blank" rel="noreferrer" data-r>
                  Read about {sp.short.toLowerCase()}
                </a>
              </li>
            ))}
          </ol>

          <div className="container pc-also" data-sec>
            <p data-r>Also in Building 500:</p>
            <ul data-r>
              {ALSO.map((a) => (
                <li key={a.label}>
                  <a href={a.href} className="pc-link" target="_blank" rel="noreferrer">
                    {a.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ===== Statement, in the practice's own published words ===== */}
        <section className="pc-statement" aria-labelledby="pc-statement-h" data-sec>
          <div className="container">
            <h2 id="pc-statement-h" className="visually-hidden">Our purpose</h2>
            <blockquote className="pc-statement-q">
              <p>Our purpose is to treat as many patients as possible with treatments that are innovative and effective.</p>
            </blockquote>
            <div className="pc-statement-foot" data-r>
              <p>
                A commitment to honor, support, and uplift those who have tirelessly served us, whether on the
                battlefield, in our communities, or within families.
              </p>
              <p className="pc-cite">From ProCare’s mission statement</p>
            </div>
          </div>
        </section>

        {/* ===== Care team ===== */}
        <section className="pc-team" id="team" aria-labelledby="pc-team-h" data-sec>
          <div className="container pc-team-grid">
            <figure className="pc-team-photo" data-slot="team" data-alt="ProCare's providers together in the clinic" data-unveil>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BP}/c1/team.jpg`} alt="Two clinicians reviewing a patient's imaging together on a screen" width={2000} height={1333} loading="lazy" />
            </figure>
            <div className="pc-team-text">
              <h2 id="pc-team-h" data-split>Your care team, in Building 500</h2>
              <dl className="pc-team-list">
                {TEAM.map((t) => (
                  <div key={t.role} className="pc-team-row">
                    <dt>{t.role}</dt>
                    <dd>{t.line}</dd>
                  </div>
                ))}
              </dl>
              <p data-r>
                <span className="fill" data-fill="providers">Provider names, photographs and credentials, from ProCare</span>
              </p>
            </div>
          </div>
        </section>

        {/* ===== First visit: a sideways run while the section holds ===== */}
        <section className="pc-journey" id="first-visit" aria-labelledby="pc-journey-h">
          <div className="container pc-journey-head">
            <h2 id="pc-journey-h" data-split>Your first visit to Building 500</h2>
            <a href="https://pcw.health/patient-info/patient-info-forms/" className="pc-link pc-link-light" target="_blank" rel="noreferrer">
              Download patient forms
            </a>
          </div>
          <ol className="pc-journey-track">
            {JOURNEY.map((j, i) => (
              <li key={j.title} className="pc-journey-card">
                {j.image ? (
                  <figure className="pc-journey-photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={j.image} alt={j.alt} width={1600} height={1100} loading="lazy" />
                  </figure>
                ) : (
                  <a href={PHONE_TEL} className="pc-journey-call">
                    <PhoneIcon />
                    <span>{PHONE_DISPLAY}</span>
                  </a>
                )}
                <div className="pc-journey-text">
                  <span className="pc-journey-num num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3>{j.title}</h3>
                  <p>{j.line}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="container" aria-hidden="true">
            <div className="pc-journey-bar">
              <span className="pc-journey-fill" />
            </div>
          </div>
        </section>

        {/* ===== Patients' words, verbatim, as cards that stack ===== */}
        <section className="pc-words" aria-labelledby="pc-words-h">
          <div className="container">
            <h2 id="pc-words-h" data-split>What ProCare patients say</h2>
            <ol className="pc-stack">
              {[QUOTES.main, ...QUOTES.more].map((q, i) => (
                <li key={q.name} className={`pc-card pc-card-${i}`}>
                  <blockquote>
                    <p>“{q.text}”</p>
                    <footer>{q.name}, ProCare patient</footer>
                  </blockquote>
                </li>
              ))}
            </ol>
            <a href="https://pcw.health/testimonials/" className="pc-link pc-words-more" target="_blank" rel="noreferrer">
              Read every review on pcw.health
            </a>
          </div>
        </section>

        {/* ===== Questions ===== */}
        <section className="pc-faq" id="questions" aria-labelledby="pc-faq-h" data-sec>
          <div className="container pc-faq-grid">
            <h2 id="pc-faq-h" data-split>Insurance, costs and care</h2>
            <div className="pc-faq-list" data-r>
              {FAQ.map(([q, a]) => (
                <details key={q} className="pc-faq-item">
                  <summary>
                    <span>{q}</span>
                    <span className="pc-plus" aria-hidden="true" />
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Booking: the close ===== */}
        <section className="pc-book" id="book" aria-labelledby="pc-book-h" data-sec>
          <div className="container">
            <figure className="pc-place-photo">
              <div className="pc-place-frame" data-unveil>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${BP}/c1/forsyth.jpg`} alt="The white cast-iron fountain in Forsyth Park, Savannah, under a blue sky" width={3840} height={2923} loading="lazy" />
              </div>
              <figcaption className="pc-place-cap">
                Forsyth Park, Savannah. Patients come from {AREAS.slice(0, -1).join(", ")} and {AREAS[AREAS.length - 1]}.
              </figcaption>
            </figure>
          </div>
          <div className="container pc-book-grid">
            <div className="pc-book-form">
              <h2 id="pc-book-h" data-split>Book a consultation</h2>
              <p className="pc-lead" data-r>Tell us what is going on. The front desk calls you back to find a time.</p>
              <form
                className="pc-form"
                data-endpoint=""
                data-r
                onSubmit={(e) => {
                  e.preventDefault();
                  setNote(true);
                }}
              >
                <label>
                  <span>Full name</span>
                  <input name="name" autoComplete="name" required />
                </label>
                <label>
                  <span>Phone</span>
                  <input name="phone" type="tel" inputMode="tel" autoComplete="tel" required />
                </label>
                <label className="pc-form-wide">
                  <span>What would you like help with?</span>
                  <select name="concern" defaultValue="">
                    <option value="" disabled>
                      Choose one
                    </option>
                    {SPECIALTIES.map((sp) => (
                      <option key={sp.id}>{sp.name}</option>
                    ))}
                    {ALSO.map((a) => (
                      <option key={a.label}>{a.label}</option>
                    ))}
                    <option>I am not sure yet</option>
                  </select>
                </label>
                <button type="submit" className="pc-btn pc-btn-primary pc-form-wide">
                  Request a call back
                </button>
                <p className="pc-form-note pc-form-wide" role="status">
                  {note
                    ? "This prototype is not connected yet, so nothing was sent. Please call the office instead."
                    : "Prototype form: please do not enter medical details."}
                </p>
              </form>
            </div>

            <div className="pc-book-info" data-r>
              <h3>Opening hours</h3>
              <p className="pc-book-status">{status ? status.text : "Open Monday to Thursday"}</p>
              <table className="pc-hours">
                <tbody>
                  {HOURS.map((d) => (
                    <tr key={d.day} data-today={status?.today === d.idx}>
                      <th scope="row">{d.day}</th>
                      <td className="num">{d.open ? `${d.open[0]}:00 am to ${d.open[1] - 12}:00 pm` : "Closed"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <a href={PHONE_TEL} className="pc-bigtel">
                {PHONE_DISPLAY}
              </a>
              <a href={MAPS_URL} target="_blank" rel="noreferrer" className="pc-addr">
                {ADDRESS_LINE_1}
                <br />
                {ADDRESS_LINE_2}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="pc-foot">
        <div className="container">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${BP}/c1/procare-logo-white.png`} alt="ProCare Wellness Institute" width={480} height={135} className="pc-foot-logo" />
          <div className="pc-foot-grid">
            <nav aria-label="Footer">
              <ul>
                <li><a href="#specialties" onClick={go("#specialties")}>Specialties</a></li>
                <li><a href="#team" onClick={go("#team")}>Care team</a></li>
                <li><a href="#first-visit" onClick={go("#first-visit")}>First visit</a></li>
                <li><a href="#questions" onClick={go("#questions")}>Questions</a></li>
                <li><a href="#book" onClick={go("#book")}>Book</a></li>
              </ul>
            </nav>
            <p className="pc-foot-contact">
              <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>
              <br />
              {ADDRESS_LINE_1}
              <br />
              {ADDRESS_LINE_2}
            </p>
            <ul className="pc-foot-social">
              <li><a href="https://www.instagram.com/procarewellnessinstitute/" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href="https://www.facebook.com/profile.php?id=100091856139219" target="_blank" rel="noreferrer">Facebook</a></li>
              <li><a href="https://www.youtube.com/@ProCareWellnessInstitute" target="_blank" rel="noreferrer">YouTube</a></li>
            </ul>
          </div>
          <p className="pc-legal">
            © 2026 ProCare Wellness Institute, Savannah. Information on this site is for education and is not a diagnosis.
            Homepage concept for discussion.
          </p>
          <p className="pc-legal" data-credits>
            {CREDITS}
          </p>
        </div>
      </footer>

      <div className="pc-mobilebar">
        <a href={PHONE_TEL} className="pc-btn pc-btn-quiet">
          <PhoneIcon />
          <span>Call</span>
        </a>
        <a href="#book" onClick={go("#book")} className="pc-btn pc-btn-primary">
          Book a consultation
        </a>
      </div>
    </div>
  );
}
