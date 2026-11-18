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

// Quick picks in the hero: the three things most patients come in for.
const QUICK = [
  { label: "Joint or back pain", value: "Joint and orthopedic pain" },
  { label: "Numb, tingling feet", value: "Neuropathy and nerve pain" },
  { label: "A wound that won’t heal", value: "Advanced wound care" },
];

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
      const fmt = (x: number) => `${x > 12 ? x - 12 : x} ${x >= 12 ? "pm" : "am"}`;
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
        setState({ text: `Opens ${label} at ${fmt(d.open[0])}`, open: false, today: dayIdx });
        return;
      }
    };
    calc();
    const t = setInterval(calc, 60_000);
    return () => clearInterval(t);
  }, []);
  return state;
}

/* ---------- icons, one stroke family ---------- */
const Icon = {
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  shield: <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z M9 12l2 2 4-4" />,
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
    </>
  ),
};
function I({ name, size = 20 }: { name: keyof typeof Icon; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="pc-icon" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {Icon[name]}
    </svg>
  );
}

export default function Concept1() {
  const [concern, setConcern] = useState("");
  const [note, setNote] = useState(false);
  const status = useOpenStatus();
  const root = useRef<HTMLDivElement>(null);
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

    // Phone action bar waits until the hero (with its own actions) has gone.
    const heroEl = document.querySelector(".pc-hero");
    const io = heroEl ? new IntersectionObserver(([e]) => root.current?.classList.toggle("hero-in", e.isIntersecting), { threshold: 0.1 }) : null;
    if (heroEl && io) io.observe(heroEl);

    const splits: SplitText[] = [];
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 60rem)" }, (mctx) => {
        const { motion: canMove, desktop } = mctx.conditions as { motion: boolean; desktop: boolean };
        if (!canMove) return;

        /* ---------- 1. Pinned scenes first, in page order ---------- */
        const zoom = gsap.timeline({
          scrollTrigger: { trigger: ".pc-zoom", start: "top top", end: "+=180%", pin: ".pc-zoom-pin", scrub: 1, anticipatePin: 1 },
        });
        zoom
          .fromTo(".pc-zoom-mask", { scale: 1 }, { scale: 42, ease: "power2.in", duration: 1 }, 0)
          .fromTo(".pc-zoom-photo img", { scale: 1.35 }, { scale: 1, ease: "none", duration: 1 }, 0)
          .to(".pc-zoom-mask", { opacity: 0, duration: 0.15 }, 0.85)
          .fromTo(".pc-zoom-after", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.25 }, 0.9);

        const track = document.querySelector<HTMLElement>(".pc-journey-track");
        if (desktop && track) {
          const dist = () => track.scrollWidth - window.innerWidth + 64;
          const run = gsap.to(track, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: {
              trigger: ".pc-journey",
              start: "top top+=80",
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
            if (img) gsap.fromTo(img, { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: { trigger: card, containerAnimation: run, start: "left right", end: "right left", scrub: true } });
          });
        }

        /* ---------- 2. Hero ---------- */
        gsap.to(".pc-progress-top", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
        const h1 = SplitText.create(".pc-hero h1", { type: "words,lines", mask: "lines", linesClass: "pc-mask" });
        splits.push(h1);
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(".pc-glow", { opacity: 0, scale: 0.6, duration: 2.2, stagger: 0.2 }, 0)
          .from(".pc-pill-live", { y: 16, opacity: 0, duration: 0.8 }, 0.1)
          .from(h1.words, { yPercent: 120, duration: 1.2, stagger: 0.06 }, 0.2)
          .from(".pc-hero-lead, .pc-hero .pc-actions, .pc-trust li", { y: 24, opacity: 0, duration: 0.9, stagger: 0.07 }, 0.6)
          .from(".pc-col-main", { clipPath: "inset(100% 0% 0% 0% round 28px)", duration: 1.5, ease: "expo.inOut" }, 0.15)
          .from(".pc-col-main img", { scale: 1.35, duration: 2, ease: "expo.out" }, 0.4)
          .from(".pc-col-side", { clipPath: "inset(0% 0% 100% 0% round 24px)", duration: 1.3, ease: "expo.inOut" }, 0.5)
          .from(".pc-float", { y: 40, opacity: 0, scale: 0.92, duration: 1, stagger: 0.12 }, 1.0);

        // Scrolling away: the collage drifts at different depths.
        gsap.to(".pc-col-main", { yPercent: -10, ease: "none", scrollTrigger: { trigger: ".pc-hero", start: "top top", end: "bottom top", scrub: 0.5 } });
        gsap.to(".pc-col-side", { yPercent: -35, ease: "none", scrollTrigger: { trigger: ".pc-hero", start: "top top", end: "bottom top", scrub: 0.5 } });
        gsap.to(".pc-float-a", { yPercent: -80, ease: "none", scrollTrigger: { trigger: ".pc-hero", start: "top top", end: "bottom top", scrub: 0.5 } });
        gsap.to(".pc-float-b", { yPercent: -140, ease: "none", scrollTrigger: { trigger: ".pc-hero", start: "top top", end: "bottom top", scrub: 0.5 } });

        /* ---------- 3. Entrances that play on arrival ---------- */
        const enter = (trigger: Element | string, start = "top 82%") => ({ trigger, start, toggleActions: "play none none reverse" });

        const introSplit = SplitText.create(".pc-intro-text", { type: "words" });
        splits.push(introSplit);
        gsap.fromTo(introSplit.words, { opacity: 0.15 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: ".pc-intro", start: "top 70%", end: "center 45%", scrub: true } });

        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const obj = { v: 0 };
          gsap.to(obj, {
            v: Number(el.dataset.count),
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = String(Math.round(obj.v));
            },
            scrollTrigger: enter(el, "top 90%"),
          });
        });
        gsap.from(".pc-figure", { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.1, scrollTrigger: enter(".pc-figures", "top 90%") });

        gsap.fromTo(".pc-strip-0", { xPercent: 0 }, { xPercent: -35, ease: "none", scrollTrigger: { trigger: ".pc-marquee", start: "top bottom", end: "bottom top", scrub: 0.6 } });
        gsap.fromTo(".pc-strip-1", { xPercent: -35 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: ".pc-marquee", start: "top bottom", end: "bottom top", scrub: 0.6 } });

        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          const sp = SplitText.create(el, { type: "lines,words", mask: "lines", linesClass: "pc-mask" });
          splits.push(sp);
          gsap.from(sp.words, { yPercent: 115, duration: 1.1, ease: "expo.out", stagger: 0.045, scrollTrigger: enter(el, "top 88%") });
        });

        // Specialty tiles open one after another, each picture settling inside its frame.
        gsap.utils.toArray<HTMLElement>(".pc-tile").forEach((tile, i) => {
          gsap.from(tile, { clipPath: "inset(30% 0% 0% 0% round 24px)", y: 80, opacity: 0, duration: 1.3, ease: "expo.out", delay: (i % 3) * 0.08, scrollTrigger: enter(tile, "top 92%") });
          const img = tile.querySelector("img");
          if (img) gsap.fromTo(img, { scale: 1.25, yPercent: -6 }, { scale: 1.05, yPercent: 6, ease: "none", scrollTrigger: { trigger: tile, start: "top bottom", end: "bottom top", scrub: true } });
        });

        gsap.utils.toArray<HTMLElement>("[data-unveil]").forEach((el) => {
          gsap.fromTo(el, { clipPath: "inset(14% 10% 14% 10% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", ease: "none", scrollTrigger: { trigger: el, start: "top 92%", end: "top 35%", scrub: true } });
          const img = el.querySelector("img");
          if (img) gsap.fromTo(img, { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        });

        gsap.from(".pc-chip-role", { y: 30, opacity: 0, scale: 0.9, duration: 0.8, ease: "expo.out", stagger: 0.06, scrollTrigger: enter(".pc-roles", "top 88%") });

        gsap.utils.toArray<HTMLElement>(".pc-card").forEach((card, i, all) => {
          gsap.from(card.querySelector("blockquote"), { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: enter(card, "top 80%") });
          if (i < all.length - 1) gsap.to(card, { scale: 0.93, ease: "none", scrollTrigger: { trigger: all[i + 1], start: "top bottom", end: "top 25%", scrub: true } });
        });

        gsap.from(".pc-faq-item", { y: 30, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.06, scrollTrigger: enter(".pc-faq-list", "top 88%") });
        gsap.from(".pc-book-card", { y: 100, opacity: 0, scale: 0.96, duration: 1.3, ease: "expo.out", scrollTrigger: enter(".pc-book", "top 80%") });
        gsap.from(".pc-form > *", { y: 24, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.05, scrollTrigger: enter(".pc-form", "top 90%") });

        gsap.utils.toArray<HTMLElement>("[data-sec]").forEach((sec) => {
          const items = sec.querySelectorAll("[data-r]");
          if (items.length) gsap.from(items, { y: 36, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08, scrollTrigger: enter(sec, "top 82%") });
        });

        gsap.from(".pc-foot-logo", { y: 80, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: enter(".pc-foot", "top 92%") });

        const re = () => ScrollTrigger.refresh();
        document.fonts?.ready.then(re);
        window.addEventListener("load", re, { once: true });
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
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -90, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(id);
  };
  const pickConcern = (value: string) => {
    setConcern(value);
    scrollTo("#book");
  };

  const tiles = SPECIALTIES;

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
            <a href="#specialties" onClick={go("#specialties")}>What we treat</a>
            <a href="#first-visit" onClick={go("#first-visit")}>Your first visit</a>
            <a href="#team" onClick={go("#team")}>Care team</a>
            <a href="#questions" onClick={go("#questions")}>Insurance</a>
          </nav>
          <div className="pc-nav-act">
            <a href={PHONE_TEL} className="pc-nav-tel">
              <I name="phone" size={18} />
              <span>{PHONE_DISPLAY}</span>
            </a>
            <a href="#book" onClick={go("#book")} className="pc-btn pc-btn-primary pc-btn-sm">
              Book a visit
            </a>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        {/* ===== Hero ===== */}
        <section className="pc-hero" id="top" aria-labelledby="pc-h1">
          <div className="pc-glow pc-glow-a" aria-hidden="true" />
          <div className="pc-glow pc-glow-b" aria-hidden="true" />
          <div className="container pc-hero-grid">
            <div className="pc-hero-text">
              <p className="pc-pill-live" data-open={status?.open ?? false}>
                <span className="pc-live-dot" aria-hidden="true" />
                {status ? status.text : "Open Monday to Thursday"} <span className="pc-pill-sep">in Savannah, GA</span>
              </p>
              <h1 id="pc-h1">Care that gets you moving again.</h1>
              <p className="pc-hero-lead">
                Non-surgical treatment for joint pain, neuropathy and wounds that won’t heal, from one specialist team in
                Savannah.
              </p>
              <div className="pc-actions">
                <motion.a href="#book" onClick={go("#book")} className="pc-btn pc-btn-primary pc-btn-lg" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  Book a consultation
                  <span className="pc-btn-ico">
                    <I name="arrow" size={18} />
                  </span>
                </motion.a>
                <a href={PHONE_TEL} className="pc-btn pc-btn-ghost pc-btn-lg">
                  <I name="phone" size={18} />
                  {PHONE_DISPLAY}
                </a>
              </div>
              <ul className="pc-trust" aria-label="Good to know">
                <li>
                  <I name="clock" size={18} /> Same-day urgent visits
                </li>
                <li>
                  <I name="shield" size={18} /> Insurance checked at your first visit
                </li>
                <li>
                  <I name="card" size={18} /> Payment plans available
                </li>
              </ul>
            </div>

            <div className="pc-collage">
              <figure className="pc-col-main" data-slot="hero" data-alt="A ProCare patient back doing what they love">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${BP}/c1/golf.jpg`} alt="A man swinging a golf club on a green course under a cloudy sky" width={1600} height={1067} fetchPriority="high" />
              </figure>
              <figure className="pc-col-side">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${BP}/c1/neuropathy.webp`} alt="An older woman smiling as she shapes a ceramic bowl with her hands" width={600} height={900} />
              </figure>

              <div className="pc-float pc-float-a" role="group" aria-label="Book by concern">
                <p className="pc-float-title">What brings you in?</p>
                <div className="pc-quick">
                  {QUICK.map((q) => (
                    <button key={q.value} type="button" className="pc-quick-btn" onClick={() => pickConcern(q.value)}>
                      {q.label}
                      <I name="arrow" size={16} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pc-float pc-float-b">
                <span className="pc-float-num">6</span>
                <span className="pc-float-label">
                  specialties,
                  <br />
                  one building
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== The name opens ===== */}
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
            <div className="pc-zoom-after">
              <div className="container">
                <h2 id="pc-zoom-h">Every specialist you need, in one Savannah building.</h2>
              </div>
            </div>
          </div>
        </section>

        {/* ===== What ProCare does + real figures ===== */}
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

        {/* ===== Specialties as a bento of pictures ===== */}
        <section className="pc-spec" id="specialties" aria-labelledby="pc-spec-h">
          <div className="container">
            <div className="pc-head">
              <h2 id="pc-spec-h" data-split>Find care for what hurts</h2>
              <p className="pc-head-lead">Six clinical specialties, one team. Choose yours to see the conditions and treatments.</p>
            </div>
            <ul className="pc-bento">
              {tiles.map((s, i) => (
                <li key={s.id} className={`pc-tile pc-tile-${i}`}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="pc-tile-link">
                    <figure className="pc-tile-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.image} alt={s.alt} width={1200} height={900} loading="lazy" />
                    </figure>
                    <span className="pc-tile-body">
                      <span className="pc-tile-title">{s.name}</span>
                      <span className="pc-tile-sum">{s.summary}</span>
                      <span className="pc-tile-tags">
                        {s.conditions.slice(0, 3).map((c) => (
                          <span key={c} className="pc-tag">
                            {c}
                          </span>
                        ))}
                      </span>
                      {s.confirm && <span className="pc-tile-confirm">{s.confirm}</span>}
                    </span>
                    <span className="pc-tile-go" aria-hidden="true">
                      <I name="arrow" size={20} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="pc-also-band">
                <div className="pc-also-in">
                  <p className="pc-tile-title">Also in Building 500</p>
                  <ul>
                    {ALSO.map((a) => (
                      <li key={a.label}>
                        <a href={a.href} target="_blank" rel="noreferrer">
                          {a.label}
                          <I name="arrow" size={16} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
            </div>
          </div>
        </section>

        {/* ===== Conditions, as two strips that run with the scroll ===== */}
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

        {/* ===== First visit: a sideways run while the section holds ===== */}
        <section className="pc-journey" id="first-visit" aria-labelledby="pc-journey-h">
          <div className="container pc-journey-head">
            <h2 id="pc-journey-h" data-split>Your first visit, in four steps</h2>
            <a href="https://pcw.health/patient-info/patient-info-forms/" className="pc-btn pc-btn-light" target="_blank" rel="noreferrer">
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
                    <I name="phone" size={40} />
                    <span>{PHONE_DISPLAY}</span>
                  </a>
                )}
                <div className="pc-journey-text">
                  <span className="pc-journey-num num" aria-hidden="true">
                    0{i + 1}
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

        {/* ===== Care team ===== */}
        <section className="pc-team" id="team" aria-labelledby="pc-team-h" data-sec>
          <div className="container pc-team-grid">
            <figure className="pc-team-photo" data-unveil>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BP}/c1/physio.jpg`} alt="A therapist's hands working on a patient's leg" width={1400} height={933} loading="lazy" />
            </figure>
            <div className="pc-team-text">
              <h2 id="pc-team-h" data-split>One team, every discipline</h2>
              <p className="pc-head-lead" data-r>
                Physicians, nurse practitioners, wound care specialists and physical therapists work side by side, so your
                plan is made in one place.
              </p>
              <ul className="pc-roles">
                {TEAM.map((t) => (
                  <li key={t.role} className="pc-chip-role">
                    <span className="pc-chip-role-name">{t.role}</span>
                    <span className="pc-chip-role-line">{t.line}</span>
                  </li>
                ))}
              </ul>
              <p data-r>
                <span className="fill" data-fill="providers">Provider names, photographs and credentials, from ProCare</span>
              </p>
            </div>
          </div>
        </section>

        {/* ===== Patients' words, verbatim, stacked ===== */}
        <section className="pc-words" aria-labelledby="pc-words-h">
          <div className="container">
            <div className="pc-head">
              <h2 id="pc-words-h" data-split>In our patients’ words</h2>
              <a href="https://pcw.health/testimonials/" className="pc-btn pc-btn-ghost" target="_blank" rel="noreferrer">
                Read every review
              </a>
            </div>
            <ol className="pc-stack">
              {[QUOTES.main, ...QUOTES.more].map((q, i) => (
                <li key={q.name} className={`pc-card pc-card-${i}`}>
                  <span className="pc-card-mark" aria-hidden="true">
                    “
                  </span>
                  <blockquote>
                    <p>{q.text}</p>
                    <footer>{q.name}, ProCare patient</footer>
                  </blockquote>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ===== Questions ===== */}
        <section className="pc-faq" id="questions" aria-labelledby="pc-faq-h">
          <div className="container pc-faq-grid">
            <div>
              <h2 id="pc-faq-h" data-split>Insurance, costs and care</h2>
              <p className="pc-head-lead">Straight answers to what patients ask us most.</p>
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

        {/* ===== Booking: the close ===== */}
        <section className="pc-book" id="book" aria-labelledby="pc-book-h">
          <div className="container">
            <div className="pc-book-card">
              <div className="pc-glow pc-glow-c" aria-hidden="true" />
              <div className="pc-book-grid">
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
                      <select name="concern" value={concern} onChange={(e) => setConcern(e.target.value)}>
                        <option value="" disabled>
                          Choose one
                        </option>
                        {SPECIALTIES.map((sp) => (
                          <option key={sp.id} value={sp.name}>
                            {sp.name}
                          </option>
                        ))}
                        {ALSO.map((a) => (
                          <option key={a.label} value={a.label}>
                            {a.label}
                          </option>
                        ))}
                        <option value="Not sure">I am not sure yet</option>
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
                  <p className="pc-pill-live pc-pill-dark" data-open={status?.open ?? false}>
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
                    <I name="pin" size={18} />
                    <span>
                      {ADDRESS_LINE_1}
                      <br />
                      {ADDRESS_LINE_2}
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <figure className="pc-place">
              <div className="pc-place-frame" data-unveil>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${BP}/c1/forsyth.jpg`} alt="The white cast-iron fountain in Forsyth Park, Savannah, under a blue sky" width={3840} height={2923} loading="lazy" />
              </div>
              <figcaption>
                Forsyth Park, Savannah. Patients come from {AREAS.slice(0, -1).join(", ")} and {AREAS[AREAS.length - 1]}.
              </figcaption>
            </figure>
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
                <li><a href="#specialties" onClick={go("#specialties")}>What we treat</a></li>
                <li><a href="#first-visit" onClick={go("#first-visit")}>Your first visit</a></li>
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
        <a href={PHONE_TEL} className="pc-btn pc-btn-ghost">
          <I name="phone" size={18} />
          <span>Call</span>
        </a>
        <a href="#book" onClick={go("#book")} className="pc-btn pc-btn-primary">
          Book a consultation
        </a>
      </div>
    </div>
  );
}
