"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import {
  ADDRESS_LINE_1,
  ADDRESS_LINE_2,
  ALSO,
  AREAS,
  BP,
  CREDITS,
  FAQ,
  FIGURES,
  HOURS,
  JOURNEY,
  MAPS_URL,
  MARQUEE,
  PHONE_DISPLAY,
  PHONE_TEL,
  QUOTES,
  SPECIALTIES,
  TEAM,
} from "./content";

const INTRO =
  "ProCare treats joint pain, nerve pain and wounds that will not heal, without surgery, with every specialist in one Savannah building.";
const N = SPECIALTIES.length;

/* ---------- live opening status, in Savannah's time zone ---------- */
function useOpenStatus() {
  const [state, setState] = useState<{ text: string; open: boolean; today: number } | null>(null);
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
        setState({ text: `Open now, until ${fmt(today.open[1])}`, open: true, today: dayIdx });
        return;
      }
      for (let k = 0; k < 7; k++) {
        const idx = (dayIdx + k) % 7;
        const d = HOURS.find((x) => x.idx === idx);
        if (!d?.open || (k === 0 && now >= d.open[0])) continue;
        const label = k === 0 ? "today" : k === 1 ? "tomorrow" : d.day;
        setState({ text: `Closed now, opens ${label} at ${fmt(d.open[0])}`, open: false, today: dayIdx });
        return;
      }
    };
    calc();
    const t = setInterval(calc, 60_000);
    return () => clearInterval(t);
  }, []);
  return state;
}

function PhoneIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="pc-icon" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}
function Arrow({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="pc-icon" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function Concept1() {
  const [room, setRoom] = useState(0);
  const [note, setNote] = useState(false);
  const status = useOpenStatus();
  const root = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const roomsRef = useRef<ScrollTrigger | null>(null);

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

    const heroEl = document.querySelector(".pc-hero");
    const io = heroEl ? new IntersectionObserver(([e]) => root.current?.classList.toggle("hero-in", e.isIntersecting), { threshold: 0.1 }) : null;
    if (heroEl && io) io.observe(heroEl);

    const splits: SplitText[] = [];
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 60rem)" }, (mctx) => {
        const { motion: canMove, desktop } = mctx.conditions as { motion: boolean; desktop: boolean };
        if (!canMove) return;

        /* ================= 1. Pinned scenes, in page order ================= */

        // Hero: the rounded picture opens to the whole screen and holds while its facts arrive.
        gsap
          .timeline({
            scrollTrigger: { trigger: ".pc-reveal", start: "top top+=80", end: "+=120%", pin: ".pc-reveal-pin", scrub: 0.8, anticipatePin: 1 },
          })
          .fromTo(".pc-reveal-photo", { clipPath: "inset(0% 4% 0% 4% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 0.5 }, 0)
          .fromTo(".pc-reveal-photo img", { scale: 1.12 }, { scale: 1, ease: "none", duration: 1 }, 0)
          .fromTo(".pc-reveal-scrim", { opacity: 0 }, { opacity: 1, duration: 0.35 }, 0.3)
          .fromTo(".pc-reveal-cap", { y: 60, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out", duration: 0.35 }, 0.45)
          .fromTo(".pc-chips", { y: 0 }, { y: -20, ease: "none", duration: 0.5 }, 0.5);

        // The name opens.
        gsap
          .timeline({ scrollTrigger: { trigger: ".pc-zoom", start: "top top", end: "+=180%", pin: ".pc-zoom-pin", scrub: 1, anticipatePin: 1 } })
          .fromTo(".pc-zoom-mask", { scale: 1 }, { scale: 42, ease: "power2.in", duration: 1 }, 0)
          .fromTo(".pc-zoom-photo img", { scale: 1.35 }, { scale: 1, ease: "none", duration: 1 }, 0)
          .to(".pc-zoom-mask", { opacity: 0, duration: 0.15 }, 0.85)
          .fromTo(".pc-zoom-after", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.25 }, 0.9);

        // Six rooms: each full-screen picture wipes up over the last, its title rising with it.
        const layers = gsap.utils.toArray<HTMLElement>(".pc-room-layer");
        const rooms = gsap.timeline({
          scrollTrigger: {
            trigger: ".pc-rooms",
            start: "top top",
            end: () => `+=${window.innerHeight * (N - 0.4)}`,
            pin: ".pc-rooms-pin",
            scrub: 0.8,
            anticipatePin: 1,
            onUpdate: (self) => {
              const i = Math.min(N - 1, Math.round(self.progress * (N - 1)));
              setRoom((r) => (r === i ? r : i));
              const bar = document.querySelector<HTMLElement>(".pc-rooms-fill");
              if (bar) bar.style.transform = `scaleY(${self.progress})`;
            },
          },
        });
        roomsRef.current = rooms.scrollTrigger ?? null;
        layers.forEach((layer, i) => {
          const img = layer.querySelector("img");
          const text = layer.querySelectorAll(".pc-room-anim");
          if (i === 0) {
            if (img) rooms.fromTo(img, { scale: 1.15 }, { scale: 1, ease: "none", duration: 1 }, 0);
            return;
          }
          const at = i - 1 + 0.15;
          rooms.fromTo(layer, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 0.7 }, at);
          if (img) rooms.fromTo(img, { scale: 1.35, yPercent: 8 }, { scale: 1, yPercent: 0, ease: "power2.out", duration: 1 }, at);
          rooms.fromTo(text, { y: 80, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out", duration: 0.5, stagger: 0.06 }, at + 0.3);
          const prevText = layers[i - 1].querySelectorAll(".pc-room-anim");
          rooms.to(prevText, { y: -60, opacity: 0, ease: "power2.in", duration: 0.35 }, at);
        });

        // First visit: full-height panels run sideways.
        const track = document.querySelector<HTMLElement>(".pc-journey-track");
        if (desktop && track) {
          const dist = () => track.scrollWidth - window.innerWidth;
          const run = gsap.to(track, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: {
              trigger: ".pc-journey",
              start: "top top",
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
          gsap.utils.toArray<HTMLElement>(".pc-journey-panel").forEach((panel) => {
            const img = panel.querySelector("img");
            if (img) gsap.fromTo(img, { xPercent: -12, scale: 1.15 }, { xPercent: 12, scale: 1.15, ease: "none", scrollTrigger: { trigger: panel, containerAnimation: run, start: "left right", end: "right left", scrub: true } });
            gsap.from(panel.querySelectorAll(".pc-journey-anim"), {
              y: 70,
              opacity: 0,
              duration: 1,
              ease: "expo.out",
              stagger: 0.08,
              scrollTrigger: { trigger: panel, containerAnimation: run, start: "left 65%", toggleActions: "play none none reverse" },
            });
          });
        }

        /* ================= 2. Hero ================= */
        gsap.to(".pc-progress-top", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
        const h1 = SplitText.create(".pc-hero h1", { type: "words,lines", mask: "lines", linesClass: "pc-mask" });
        splits.push(h1);
        // Load: the light arrives, the words rise, the picture lifts into place.
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(".pc-aura span", { opacity: 0, scale: 0.6, duration: 2.4, stagger: 0.2 }, 0)
          .from(".pc-hero .pc-pill", { y: 18, opacity: 0, duration: 0.9 }, 0.1)
          .from(h1.words, { yPercent: 120, duration: 1.3, stagger: 0.05 }, 0.2)
          .from(".pc-hero .pc-lead, .pc-hero .pc-actions", { y: 24, opacity: 0, duration: 1, stagger: 0.1 }, 0.7)
          .from(".pc-reveal-photo", { y: 140, opacity: 0, duration: 1.6 }, 0.5)
          .from(".pc-chip", { y: 30, opacity: 0, duration: 1, stagger: 0.1 }, 1.1);
        // The words step back as the picture comes forward.
        gsap.to(".pc-hero-text", { y: -80, opacity: 0, ease: "none", scrollTrigger: { trigger: ".pc-hero", start: "top top", end: "35% top", scrub: 0.4 } });

        /* ================= 3. Scenes that play on arrival ================= */
        const enter = (trigger: Element | string, start = "top 80%") => ({ trigger, start, toggleActions: "play none none reverse" });

        const introSplit = SplitText.create(".pc-intro-text", { type: "words" });
        splits.push(introSplit);
        gsap.fromTo(introSplit.words, { opacity: 0.12 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: ".pc-intro", start: "top 70%", end: "center 45%", scrub: true } });
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const obj = { v: 0 };
          gsap.to(obj, {
            v: Number(el.dataset.count),
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = String(Math.round(obj.v));
            },
            scrollTrigger: enter(el, "top 92%"),
          });
        });
        gsap.from(".pc-treat-item", { y: 40, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.07, scrollTrigger: enter(".pc-treat", "top 92%") });
        gsap.from(".pc-figure", { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.1, scrollTrigger: enter(".pc-figures", "top 92%") });

        gsap.fromTo(".pc-strip-0", { xPercent: 0 }, { xPercent: -35, ease: "none", scrollTrigger: { trigger: ".pc-marquee", start: "top bottom", end: "bottom top", scrub: 0.6 } });
        gsap.fromTo(".pc-strip-1", { xPercent: -35 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: ".pc-marquee", start: "top bottom", end: "bottom top", scrub: 0.6 } });

        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          const sp = SplitText.create(el, { type: "lines,words", mask: "lines", linesClass: "pc-mask" });
          splits.push(sp);
          gsap.from(sp.words, { yPercent: 115, rotate: 3, duration: 1.2, ease: "expo.out", stagger: 0.05, scrollTrigger: enter(el, "top 88%") });
        });

        // Team: the picture opens to full bleed, the roles light up one by one.
        gsap.fromTo(".pc-team-photo", { clipPath: "inset(12% 18% 12% 18% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: ".pc-team", start: "top 85%", end: "top top", scrub: true } });
        gsap.fromTo(".pc-team-photo img", { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".pc-team", start: "top bottom", end: "bottom top", scrub: true } });
        gsap.utils.toArray<HTMLElement>(".pc-role").forEach((li) => {
          gsap.fromTo(li, { opacity: 0.25, x: 40 }, { opacity: 1, x: 0, ease: "none", scrollTrigger: { trigger: li, start: "top 85%", end: "top 55%", scrub: true } });
        });

        // Patient words: each quote fills in as it is read.
        gsap.utils.toArray<HTMLElement>(".pc-quote-text").forEach((el) => {
          const sp = SplitText.create(el, { type: "words" });
          splits.push(sp);
          gsap.fromTo(sp.words, { opacity: 0.12 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true } });
        });
        gsap.utils.toArray<HTMLElement>(".pc-quote").forEach((q) => {
          gsap.from(q.querySelector(".pc-quote-mark"), { scale: 0.4, opacity: 0, rotate: -12, duration: 1.2, ease: "expo.out", scrollTrigger: enter(q, "top 75%") });
        });

        gsap.from(".pc-faq-item", { y: 30, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.06, scrollTrigger: enter(".pc-faq-list", "top 88%") });

        // The close: Savannah opens behind the booking card.
        gsap.from(".pc-book-card", { y: 120, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: enter(".pc-book", "top 60%") });
        gsap.from(".pc-form > *", { y: 24, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.05, scrollTrigger: enter(".pc-form", "top 92%") });

        gsap.utils.toArray<HTMLElement>("[data-sec]").forEach((sec) => {
          const items = sec.querySelectorAll("[data-r]");
          if (items.length) gsap.from(items, { y: 36, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08, scrollTrigger: enter(sec, "top 82%") });
        });
        gsap.from(".pc-foot-logo", { y: 80, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: enter(".pc-foot", "top 92%") });

        const re = () => ScrollTrigger.refresh();
        document.fonts?.ready.then(re);
        window.addEventListener("load", re, { once: true });

        return () => {
          roomsRef.current = null;
        };
      });
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

  const scrollTo = (id: string) => {
    const el = document.querySelector<HTMLElement>(id);
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -80, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(id);
  };
  const toRoom = (i: number) => {
    const st = roomsRef.current;
    if (!st) return;
    const y = st.start + (i / (N - 1)) * (st.end - st.start);
    if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

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
            <a href="#first-visit" onClick={go("#first-visit")}>First visit</a>
            <a href="#team" onClick={go("#team")}>Care team</a>
            <a href="#questions" onClick={go("#questions")}>Insurance</a>
          </nav>
          <div className="pc-nav-act">
            <a href={PHONE_TEL} className="pc-nav-tel">
              <PhoneIcon size={18} />
              <span>{PHONE_DISPLAY}</span>
            </a>
            <a href="#book" onClick={go("#book")} className="pc-btn pc-btn-primary pc-btn-sm">
              Book a visit
            </a>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        {/* ===== 1. Hero: calm centred, then the picture opens to the whole screen ===== */}
        <section className="pc-hero" id="top" aria-labelledby="pc-h1">
          <div className="pc-aura" aria-hidden="true">
            <span className="pc-aura-a" />
            <span className="pc-aura-b" />
          </div>
          <div className="container pc-hero-text">
            <p className="pc-pill" data-r data-open={status?.open ?? false}>
              <span className="pc-live-dot" aria-hidden="true" />
              {status ? status.text : "Open Monday to Thursday"}
              <span className="pc-pill-sep" aria-hidden="true" />
              <span className="pc-pill-place">Savannah, Georgia</span>
            </p>
            <h1 id="pc-h1">Specialist care for pain, nerves and wounds, without surgery.</h1>
            <p className="pc-lead" data-r>
              Six specialties and one experienced team, under one roof in Savannah.
            </p>
            <div className="pc-actions" data-r>
              <motion.a href="#book" onClick={go("#book")} className="pc-btn pc-btn-ink pc-btn-lg" whileTap={{ scale: 0.98 }}>
                Book a consultation <Arrow />
              </motion.a>
              <a href={PHONE_TEL} className="pc-btn pc-btn-quiet pc-btn-lg">
                <PhoneIcon />
                <span>Call {PHONE_DISPLAY}</span>
              </a>
            </div>
          </div>

          <div className="pc-reveal">
            <div className="pc-reveal-pin">
              <figure className="pc-reveal-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${BP}/c1/consult.jpg`} alt="A bright, calm clinic lounge with a palm and green armchairs" width={2000} height={1348} fetchPriority="high" />
              </figure>
              <div className="pc-reveal-scrim" aria-hidden="true" />
              <p className="pc-reveal-cap">
                Every specialist you need,
                <br />
                under one roof.
              </p>
              <ul className="pc-chips" aria-label="Good to know">
                <li className="pc-chip">
                  <strong>Same-day</strong>
                  <span>urgent appointments</span>
                </li>
                <li className="pc-chip">
                  <strong>Insurance</strong>
                  <span>verified at your first visit</span>
                </li>
                <li className="pc-chip">
                  <strong>Building 500</strong>
                  <a href={MAPS_URL} target="_blank" rel="noreferrer">
                    {ADDRESS_LINE_1.replace(", Building 500", "")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ===== 2. The name opens ===== */}
        <section className="pc-zoom" aria-labelledby="pc-zoom-h">
          <div className="pc-zoom-pin">
            <div className="pc-zoom-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BP}/c1/forsyth.jpg`} alt="" width={3840} height={2923} loading="lazy" />
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
            <div className="pc-zoom-after">
              <div className="container">
                <h2 id="pc-zoom-h">Every specialist you need, in one Savannah building.</h2>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 3. What ProCare does ===== */}
        <section className="pc-intro" aria-labelledby="pc-intro-h">
          <div className="pc-glow" aria-hidden="true" />
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
            <div className="pc-treat">
              <p className="pc-treat-label">What we treat</p>
              <ul className="pc-treat-list">
                {SPECIALTIES.map((s, i) => (
                  <li key={s.id} className="pc-treat-item">
                    <button type="button" onClick={() => (roomsRef.current ? toRoom(i) : scrollTo("#specialties"))}>
                      <span className="pc-treat-img">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.image} alt="" width={160} height={160} loading="lazy" />
                      </span>
                      <span className="pc-treat-name">{s.name}</span>
                      <Arrow size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ===== 4. Six rooms, one after another, full screen ===== */}
        <section className="pc-rooms" id="specialties" aria-labelledby="pc-rooms-h">
          <div className="pc-rooms-pin">
            <h2 id="pc-rooms-h" className="visually-hidden">
              Six specialties
            </h2>
            {SPECIALTIES.map((s, i) => (
              <article key={s.id} className="pc-room-layer" style={{ zIndex: i + 1 }} aria-labelledby={`room-${s.id}`}>
                <figure className="pc-room-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image} alt={s.alt} width={1600} height={1000} loading="lazy" />
                </figure>
                <div className="pc-room-scrim" aria-hidden="true" />
                <div className="container pc-room-text">
                  <p className="pc-room-kicker pc-room-anim">
                    Specialty {i + 1} of {N}
                  </p>
                  <h3 id={`room-${s.id}`} className="pc-room-title pc-room-anim">
                    {s.name}
                  </h3>
                  <p className="pc-room-sum pc-room-anim">{s.summary}</p>
                  <ul className="pc-room-tags pc-room-anim">
                    {s.conditions.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                  <p className="pc-room-tr pc-room-anim">{s.treatments}</p>
                  {s.confirm && <p className="pc-room-confirm pc-room-anim">{s.confirm}</p>}
                  <a href={s.href} className="pc-btn pc-btn-glass pc-room-anim" target="_blank" rel="noreferrer">
                    Read about {s.short.toLowerCase()} <Arrow />
                  </a>
                </div>
              </article>
            ))}
            <nav className="pc-rooms-nav" aria-label="Specialties">
              <span className="pc-rooms-bar" aria-hidden="true">
                <span className="pc-rooms-fill" />
              </span>
              <ul>
                {SPECIALTIES.map((s, i) => (
                  <li key={s.id}>
                    <button type="button" aria-current={room === i ? "true" : undefined} onClick={() => toRoom(i)}>
                      {s.short}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="container pc-also" data-sec>
            <p data-r>Also in Building 500</p>
            <ul data-r>
              {ALSO.map((a) => (
                <li key={a.label}>
                  <a href={a.href} target="_blank" rel="noreferrer">
                    {a.label} <Arrow size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ===== 5. Conditions strips ===== */}
        <section className="pc-marquee" aria-label="Conditions ProCare treats">
          <div className="pc-strips">
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

        {/* ===== 6. First visit: full-height panels running sideways ===== */}
        <section className="pc-journey" id="first-visit" aria-labelledby="pc-journey-h">
          <ol className="pc-journey-track">
            <li className="pc-journey-intro">
              <h2 id="pc-journey-h" className="pc-journey-anim">
                Your first visit, in four steps
              </h2>
              <p className="pc-journey-anim">From the first call to the plan you leave with. No surprises.</p>
              <a href="https://pcw.health/patient-info/patient-info-forms/" className="pc-btn pc-btn-glass pc-journey-anim" target="_blank" rel="noreferrer">
                Download patient forms <Arrow />
              </a>
            </li>
            {JOURNEY.map((j, i) => (
              <li key={j.title} className="pc-journey-panel">
                {j.image ? (
                  <figure className="pc-journey-photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={j.image} alt={j.alt} width={1600} height={1100} loading="lazy" />
                  </figure>
                ) : (
                  <div className="pc-journey-photo pc-journey-call-bg" aria-hidden="true" />
                )}
                <div className="pc-journey-scrim" aria-hidden="true" />
                <div className="pc-journey-text">
                  <span className="pc-journey-num num pc-journey-anim" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3 className="pc-journey-anim">{j.title}</h3>
                  <p className="pc-journey-anim">{j.line}</p>
                  {!j.image && (
                    <a href={PHONE_TEL} className="pc-journey-tel pc-journey-anim">
                      <PhoneIcon size={28} />
                      {PHONE_DISPLAY}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <div className="pc-journey-bar" aria-hidden="true">
            <span className="pc-journey-fill" />
          </div>
        </section>

        {/* ===== 7. Care team ===== */}
        <section className="pc-team" id="team" aria-labelledby="pc-team-h">
          <figure className="pc-team-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${BP}/c1/team.jpg`} alt="Two clinicians reviewing a patient's imaging together on a screen" width={2000} height={1333} loading="lazy" />
          </figure>
          <div className="pc-team-scrim" aria-hidden="true" />
          <div className="container pc-team-grid">
            <div className="pc-team-head">
              <h2 id="pc-team-h" data-split>
                One team, every discipline
              </h2>
              <p className="pc-team-lead">Your plan is made by people who work side by side in Building 500.</p>
              <p>
                <span className="fill" data-fill="providers">Provider names, photographs and credentials, from ProCare</span>
              </p>
            </div>
            <ul className="pc-roles">
              {TEAM.map((t) => (
                <li key={t.role} className="pc-role">
                  <span className="pc-role-name">{t.role}</span>
                  <span className="pc-role-line">{t.line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ===== 8. Patient words, one full screen each ===== */}
        <section className="pc-words" aria-labelledby="pc-words-h">
          <h2 id="pc-words-h" className="visually-hidden">
            In our patients’ words
          </h2>
          {[QUOTES.main, ...QUOTES.more].map((q, i) => (
            <figure key={q.name} className={`pc-quote pc-quote-${i}`}>
              <div className="container">
                <span className="pc-quote-mark" aria-hidden="true">
                  “
                </span>
                <blockquote>
                  <p className="pc-quote-text">{q.text}</p>
                </blockquote>
                <figcaption>{q.name}, ProCare patient</figcaption>
              </div>
            </figure>
          ))}
          <div className="container pc-words-more">
            <a href="https://pcw.health/testimonials/" className="pc-btn pc-btn-glass" target="_blank" rel="noreferrer">
              Read every review on pcw.health <Arrow />
            </a>
          </div>
        </section>

        {/* ===== 9. Questions ===== */}
        <section className="pc-faq" id="questions" aria-labelledby="pc-faq-h">
          <div className="container pc-faq-grid">
            <div>
              <h2 id="pc-faq-h" data-split>
                Insurance, costs and care
              </h2>
              <p className="pc-faq-lead">Straight answers to what patients ask most.</p>
            </div>
            <div className="pc-faq-list">
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

        {/* ===== 10. The close: Savannah behind the booking ===== */}
        <section className="pc-book" id="book" aria-labelledby="pc-book-h">
          <div className="pc-aura pc-aura-book" aria-hidden="true">
            <span className="pc-aura-a" />
          </div>
          <div className="container pc-book-in">
            <div className="pc-book-card">
              <div className="pc-book-form">
                <h2 id="pc-book-h">Book a consultation</h2>
                <p className="pc-book-lead">Tell us what is going on. The front desk calls you back to find a time and check your insurance.</p>
                <form
                  className="pc-form"
                  data-endpoint=""
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
                  <button type="submit" className="pc-btn pc-btn-primary pc-btn-lg pc-form-wide">
                    Request a call back
                  </button>
                  <p className="pc-form-note pc-form-wide" role="status">
                    {note ? "This prototype is not connected yet, so nothing was sent. Please call the office instead." : "Prototype form: please do not enter medical details."}
                  </p>
                </form>
              </div>
              <div className="pc-book-info">
                <p className="pc-hero-status" data-open={status?.open ?? false}>
                  <span className="pc-live-dot" aria-hidden="true" />
                  {status ? status.text : "Open Monday to Thursday"}
                </p>
                <table className="pc-hours">
                  <tbody>
                    {HOURS.map((d) => (
                      <tr key={d.day} data-today={status?.today === d.idx}>
                        <th scope="row">{d.day}</th>
                        <td className="num">{d.open ? `${d.open[0]} am to ${d.open[1] - 12} pm` : "Closed"}</td>
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
            <p className="pc-book-cap">
              Patients come from {AREAS.slice(0, -1).join(", ")} and {AREAS[AREAS.length - 1]}.
            </p>
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
                <li><a href="#first-visit" onClick={go("#first-visit")}>First visit</a></li>
                <li><a href="#team" onClick={go("#team")}>Care team</a></li>
                <li><a href="#questions" onClick={go("#questions")}>Insurance</a></li>
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
          <p className="pc-legal">© 2026 ProCare Wellness Institute, Savannah. Information on this site is for education and is not a diagnosis. Homepage concept for discussion.</p>
          <p className="pc-legal" data-credits>
            {CREDITS}
          </p>
        </div>
      </footer>

      <div className="pc-mobilebar">
        <a href={PHONE_TEL} className="pc-btn pc-btn-glass">
          <PhoneIcon size={18} />
          <span>Call</span>
        </a>
        <a href="#book" onClick={go("#book")} className="pc-btn pc-btn-primary">
          Book a consultation
        </a>
      </div>
    </div>
  );
}
