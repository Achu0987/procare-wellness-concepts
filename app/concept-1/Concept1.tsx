"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { ADDRESS_LINE_1, ADDRESS_LINE_2, ALSO, AREAS, BP, FAQ, FIGURES, HOURS, MAPS_URL, PHONE_DISPLAY, PHONE_TEL, QUOTES, SPECIALTIES, TEAM } from "./content";

const IMG = (n: string) => `${BP}/c2img/${n}`;

// The six specialties, told as what each one is for (aims, not promises).
const CARE = [
  { id: "joint", label: "Joint and orthopedic pain", title: "Ease knee, hip and shoulder pain without surgery.", img: IMG("physio-knee.jpg"), alt: "A physical therapist working on a patient's knee" },
  { id: "neuropathy", label: "Neuropathy and nerve pain", title: "Calm the numbness and burning in hands and feet.", img: `${BP}/c1/neuropathy.webp`, alt: "An older woman smiling as she shapes a ceramic bowl" },
  { id: "wound", label: "Advanced wound care", title: "A clear plan for wounds that will not heal.", img: `${BP}/c1/wound.jpg`, alt: "A clinician's gloved hands, ready to dress a wound" },
  { id: "spine", label: "Spine and chronic pain", title: "Options for back pain, sciatica and stiffness.", img: IMG("shoulder.jpg"), alt: "A therapist stretching a patient's shoulder and back" },
  { id: "vascular", label: "Vascular and circulation", title: "Circulation care for tired, swollen legs and feet.", img: IMG("checkup.jpg"), alt: "A physician checking an older man's blood pressure" },
  { id: "regenerative", label: "Regenerative recovery", title: "Heal well after an injury or surgery.", img: IMG("strength.jpg"), alt: "A therapist guiding a patient through a strength exercise" },
];

const STEPS = [
  { n: "01", title: "Call or request a visit", line: "Same-day urgent appointments are available.", img: "" },
  { n: "02", title: "Arrive 15 minutes early", line: "Bring medical records, your insurance card and loose clothing.", img: IMG("clinic-care.jpg") },
  { n: "03", title: "Meet your provider", line: "40 to 60 minutes: an assessment and your non-surgical options.", img: IMG("clinic-talk.jpg") },
  { n: "04", title: "Leave with a plan", line: "Insurance checked, costs explained, your next visit booked.", img: IMG("garden.jpg") },
];

function useOpenStatus() {
  const [state, setState] = useState<{ text: string; open: boolean; today: number } | null>(null);
  useEffect(() => {
    const calc = () => {
      const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
      const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
      const dayIdx = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
      const now = (Number(get("hour")) % 24) + Number(get("minute")) / 60;
      const fmt = (x: number) => `${x > 12 ? x - 12 : x} ${x >= 12 ? "pm" : "am"}`;
      const today = HOURS.find((d) => d.idx === dayIdx);
      if (today?.open && now >= today.open[0] && now < today.open[1]) return setState({ text: `Open now until ${fmt(today.open[1])}`, open: true, today: dayIdx });
      for (let k = 0; k < 7; k++) {
        const idx = (dayIdx + k) % 7;
        const d = HOURS.find((x) => x.idx === idx);
        if (!d?.open || (k === 0 && now >= d.open[0])) continue;
        return setState({ text: `Opens ${k === 0 ? "today" : k === 1 ? "tomorrow" : d.day} at ${fmt(d.open[0])}`, open: false, today: dayIdx });
      }
    };
    calc();
    const t = setInterval(calc, 60_000);
    return () => clearInterval(t);
  }, []);
  return state;
}

function Arrow({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="pc-icon">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
function Cross() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" className="pc-cross">
      <path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7z" fill="currentColor" />
    </svg>
  );
}

export default function Concept1() {
  const [care, setCare] = useState(0);
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
      const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      lenisRef.current = lenis;
    }
    const splits: SplitText[] = [];
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 60rem)" }, (mctx) => {
        const { motion: canMove, desktop } = mctx.conditions as { motion: boolean; desktop: boolean };
        if (!canMove) return;
        const enter = (trigger: Element | string, start = "top 82%") => ({ trigger, start, toggleActions: "play none none reverse" });

        /* ===== Pinned scenes first, in page order ===== */

        // Hero: the fan of five pictures opens; the centre one becomes the whole screen.
        if (desktop) {
          gsap
            .timeline({ scrollTrigger: { trigger: ".pc-fan", start: "top top", end: "+=140%", pin: ".pc-fan-pin", scrub: 0.9, anticipatePin: 1 } })
            .to(".pc-fan-side-l", { xPercent: -140, rotate: -10, opacity: 0, ease: "power2.in", duration: 0.5 }, 0)
            .to(".pc-fan-side-r", { xPercent: 140, rotate: 10, opacity: 0, ease: "power2.in", duration: 0.5 }, 0)
            .to(".pc-fan-center", { width: "100vw", height: "100svh", borderRadius: 0, ease: "power2.inOut", duration: 0.7 }, 0.1)
            .fromTo(".pc-fan-center img", { scale: 1.15 }, { scale: 1, ease: "none", duration: 0.8 }, 0.1)
            .fromTo(".pc-fan-over", { opacity: 0, y: 50 }, { opacity: 1, y: 0, ease: "power3.out", duration: 0.3 }, 0.62)
            .fromTo(".pc-fan-chip", { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.25 }, 0.72);
        }

        // Specialties: the picture holds while the six stories pass; it changes with each.
        if (desktop) {
          gsap.utils.toArray<HTMLElement>(".pc-care-item").forEach((el, i) => {
            ScrollTrigger.create({ trigger: el, start: "top 55%", end: "bottom 55%", onToggle: (self) => self.isActive && setCare(i) });
          });
        }

        // First visit: four cards run sideways.
        const track = document.querySelector<HTMLElement>(".pc-steps-track");
        if (desktop && track) {
          const dist = () => track.scrollWidth - track.clientWidth + 0;
          gsap.to(track, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: { trigger: ".pc-steps", start: "top top+=60", end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
          });
        }

        /* ===== Hero load ===== */
        const h1 = SplitText.create(".pc-hero h1", { type: "words,lines", mask: "lines", linesClass: "pc-mask" });
        splits.push(h1);
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(".pc-aura i", { opacity: 0, scale: 0.6, duration: 2.6, stagger: 0.15 }, 0)
          .from(".pc-hero .pc-pill", { y: 16, opacity: 0, duration: 0.9 }, 0.1)
          .from(h1.words, { yPercent: 115, duration: 1.3, stagger: 0.05 }, 0.2)
          .from(".pc-hero-lead, .pc-hero .pc-actions", { y: 24, opacity: 0, duration: 1, stagger: 0.1 }, 0.65)
          .from(".pc-fan-card", { y: 160, opacity: 0, rotate: (i) => [-8, -4, 0, 4, 8][i] ?? 0, duration: 1.6, stagger: 0.08 }, 0.55);

        /* ===== Entrances and scrubs ===== */
        gsap.to(".pc-progress-top", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          const sp = SplitText.create(el, { type: "lines,words", mask: "lines", linesClass: "pc-mask" });
          splits.push(sp);
          gsap.from(sp.words, { yPercent: 115, duration: 1.15, ease: "expo.out", stagger: 0.04, scrollTrigger: enter(el, "top 88%") });
        });

        const fill = SplitText.create(".pc-intro-text", { type: "words" });
        splits.push(fill);
        gsap.fromTo(fill.words, { opacity: 0.14 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: ".pc-intro", start: "top 72%", end: "bottom 60%", scrub: true } });

        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const o = { v: 0 };
          gsap.to(o, { v: Number(el.dataset.count), duration: 1.8, ease: "power2.out", onUpdate: () => { el.textContent = String(Math.round(o.v)); }, scrollTrigger: enter(el, "top 92%") });
        });
        gsap.from(".pc-stat", { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.1, scrollTrigger: enter(".pc-stats", "top 88%") });

        gsap.from(".pc-care-media", { clipPath: "inset(12% 10% 12% 10% round 28px)", duration: 1.6, ease: "expo.out", scrollTrigger: enter(".pc-care", "top 70%") });
        gsap.utils.toArray<HTMLElement>(".pc-care-item").forEach((el) => {
          gsap.from(el.children, { y: 40, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.07, scrollTrigger: enter(el, "top 80%") });
        });

        // The venn: two circles meet in one plan.
        gsap.fromTo(".pc-venn-a", { xPercent: -40, opacity: 0 }, { xPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".pc-venn", start: "top 85%", end: "center 55%", scrub: true } });
        gsap.fromTo(".pc-venn-b", { xPercent: 40, opacity: 0 }, { xPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".pc-venn", start: "top 85%", end: "center 55%", scrub: true } });
        gsap.from(".pc-venn-core", { scale: 0.6, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: enter(".pc-venn", "top 45%") });
        gsap.from(".pc-role", { y: 30, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.06, scrollTrigger: enter(".pc-roles", "top 90%") });

        // Back to life: pictures drift at different depths.
        gsap.utils.toArray<HTMLElement>(".pc-life-img").forEach((el, i) => {
          gsap.fromTo(el, { yPercent: [18, -12, 26, -6][i % 4] }, { yPercent: [-18, 12, -26, 6][i % 4], ease: "none", scrollTrigger: { trigger: ".pc-life", start: "top bottom", end: "bottom top", scrub: true } });
        });

        gsap.from(".pc-quote", { y: 80, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.12, scrollTrigger: enter(".pc-quotes", "top 85%") });
        gsap.from(".pc-faq-item", { y: 30, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.06, scrollTrigger: enter(".pc-faq-list", "top 90%") });
        gsap.from(".pc-book-card", { y: 100, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: enter(".pc-book-card", "top 92%") });
        gsap.from(".pc-foot-logo", { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: enter(".pc-foot", "top 92%") });

        const re = () => ScrollTrigger.refresh();
        document.fonts?.ready.then(re);
        window.addEventListener("load", re, { once: true });
      });
    }, root);
    return () => {
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
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -100, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(id);
  };
  const bookFor = (value: string) => {
    setConcern(value);
    scrollTo("#book");
  };

  return (
    <div className="pc" ref={root}>
      <a href="#main" className="pc-skip">Skip to content</a>
      <div className="pc-progress-top" aria-hidden="true" />

      <header className="pc-nav">
        <div className="pc-nav-bar">
          <a href="#top" className="pc-logo" aria-label="ProCare Wellness Institute, home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${BP}/c1/procare-logo-color.png`} alt="ProCare Wellness Institute, Regenerative and Aesthetic Medicine" width={480} height={135} />
          </a>
          <nav aria-label="Primary" className="pc-nav-links">
            <a href="#care" onClick={go("#care")}>What we treat</a>
            <a href="#first-visit" onClick={go("#first-visit")}>First visit</a>
            <a href="#team" onClick={go("#team")}>Our team</a>
            <a href="#questions" onClick={go("#questions")}>Insurance</a>
          </nav>
          <div className="pc-nav-act">
            <a href={PHONE_TEL} className="pc-nav-tel">{PHONE_DISPLAY}</a>
            <a href="#book" onClick={go("#book")} className="pc-btn pc-btn-primary pc-btn-sm">Book a visit</a>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        {/* ===== Hero ===== */}
        <section className="pc-hero" id="top" aria-labelledby="pc-h1">
          <div className="pc-aura" aria-hidden="true">
            <i className="pc-aura-1" />
            <i className="pc-aura-2" />
            <i className="pc-aura-3" />
          </div>
          <div className="pc-hero-text">
            <p className="pc-pill" data-open={status?.open ?? false}>
              <span className="pc-live-dot" aria-hidden="true" />
              {status ? status.text : "Monday to Thursday"}
              <span className="pc-pill-sep" aria-hidden="true" />
              Savannah, Georgia
            </p>
            <h1 id="pc-h1">A life with less pain starts here.</h1>
            <p className="pc-hero-lead">
              Non-surgical care for joint pain, neuropathy and wounds that won’t heal, from one specialist team in Savannah.
            </p>
            <div className="pc-actions">
              <motion.a href="#book" onClick={go("#book")} className="pc-btn pc-btn-primary pc-btn-lg" whileTap={{ scale: 0.98 }}>
                Book a consultation <Arrow />
              </motion.a>
              <a href="#care" onClick={go("#care")} className="pc-btn pc-btn-quiet pc-btn-lg">
                See what we treat
              </a>
            </div>
          </div>

          <div className="pc-fan">
            <div className="pc-fan-pin">
              <figure className="pc-fan-card pc-fan-side-l pc-fan-far">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG("garden.jpg")} alt="Two older women tending a flowering garden" width={2000} height={1333} />
              </figure>
              <figure className="pc-fan-card pc-fan-side-l">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG("couple-laugh.jpg")} alt="An older couple laughing together outdoors" width={2000} height={1333} />
              </figure>
              <figure className="pc-fan-card pc-fan-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG("marsh-walk.jpg")} alt="An older couple walking along a boardwalk through marsh grass" width={2000} height={1333} fetchPriority="high" />
                <div className="pc-fan-over">
                  <p className="pc-fan-big">Back on the boardwalk, back in the garden, back to you.</p>
                  <ul className="pc-fan-chips">
                    <li className="pc-fan-chip"><strong>Same-day</strong> urgent visits</li>
                    <li className="pc-fan-chip"><strong>Insurance</strong> checked at your first visit</li>
                    <li className="pc-fan-chip"><strong>Building 500</strong> {ADDRESS_LINE_1.replace(", Building 500", "")}</li>
                  </ul>
                </div>
              </figure>
              <figure className="pc-fan-card pc-fan-side-r">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG("physio-knee.jpg")} alt="A physical therapist working on a patient's knee" width={2000} height={1333} />
              </figure>
              <figure className="pc-fan-card pc-fan-side-r pc-fan-far">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG("coast.jpg")} alt="An older couple sharing a kiss on a windy beach" width={2000} height={1333} />
              </figure>
            </div>
          </div>
        </section>

        {/* ===== What ProCare does, in one sentence ===== */}
        <section className="pc-intro" aria-labelledby="pc-intro-h">
          <div className="container">
            <h2 id="pc-intro-h" className="pc-intro-text">
              ProCare brings physicians, nurse practitioners, wound care specialists and physical therapists together in one Savannah building, so your pain is treated as one plan, not three referrals.
            </h2>
            <ul className="pc-stats">
              {FIGURES.map((f) => (
                <li key={f.label} className="pc-stat">
                  <span className="pc-stat-num num">
                    {f.prefix}
                    <span data-count={f.value}>{f.value}</span>
                  </span>
                  <span className="pc-stat-label">{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ===== What we treat: a held picture, six stories ===== */}
        <section className="pc-care" id="care" aria-labelledby="pc-care-h">
          <div className="container">
            <div className="pc-head pc-head-center">
              <h2 id="pc-care-h" data-split>What we treat</h2>
              <p className="pc-head-lead">Six specialties under one roof. Find yours, then book for exactly that.</p>
            </div>
            <div className="pc-care-grid">
              <ol className="pc-care-list">
                {CARE.map((c, i) => {
                  const s = SPECIALTIES[i];
                  return (
                    <li key={c.id} className="pc-care-item" data-active={care === i}>
                      <p className="pc-care-label">
                        <Cross /> {c.label}
                      </p>
                      <h3 className="pc-care-title">{c.title}</h3>
                      <p className="pc-care-sum">{s.summary}</p>
                      <ul className="pc-tags">
                        {s.conditions.slice(0, 4).map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                      {s.confirm && <p className="pc-confirm">{s.confirm}</p>}
                      <figure className="pc-care-inline">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.img} alt={c.alt} width={1200} height={800} loading="lazy" />
                      </figure>
                      <div className="pc-care-links">
                        <button type="button" className="pc-btn pc-btn-primary pc-btn-sm" onClick={() => bookFor(s.name)}>
                          Book for this <Arrow size={16} />
                        </button>
                        <a href={s.href} target="_blank" rel="noreferrer" className="pc-link">
                          Learn more
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <div className="pc-care-sticky">
                <div className="pc-care-media">
                  {CARE.map((c, i) => (
                    <figure key={c.id} className="pc-care-img" data-on={care === i}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.img} alt={care === i ? c.alt : ""} width={1600} height={1100} loading={i === 0 ? "eager" : "lazy"} />
                    </figure>
                  ))}
                  <div className="pc-care-tab">
                    <span className="pc-care-count num">{String(care + 1).padStart(2, "0")} / 06</span>
                    <span>{CARE[care].label}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="pc-also">
              <p>Also in Building 500</p>
              <ul>
                {ALSO.map((a) => (
                  <li key={a.label}>
                    <a href={a.href} target="_blank" rel="noreferrer">{a.label} <Arrow size={14} /></a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ===== First visit, four cards running sideways ===== */}
        <section className="pc-steps" id="first-visit" aria-labelledby="pc-steps-h">
          <div className="container pc-steps-in">
            <div className="pc-head">
              <h2 id="pc-steps-h" data-split>Your first visit, in four steps</h2>
              <a href="https://pcw.health/patient-info/patient-info-forms/" className="pc-btn pc-btn-quiet" target="_blank" rel="noreferrer">
                Download patient forms <Arrow size={16} />
              </a>
            </div>
            <div className="pc-steps-view">
              <ol className="pc-steps-track">
                {STEPS.map((s) => (
                  <li key={s.n} className="pc-step">
                    {s.img ? (
                      <figure className="pc-step-img">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.img} alt="" width={1600} height={1100} loading="lazy" />
                      </figure>
                    ) : (
                      <a href={PHONE_TEL} className="pc-step-img pc-step-call">
                        <span className="pc-step-call-label">Call us</span>
                        <span className="pc-step-call-num">{PHONE_DISPLAY}</span>
                      </a>
                    )}
                    <div className="pc-step-body">
                      <span className="pc-step-n num">{s.n}</span>
                      <h3>{s.title}</h3>
                      <p>{s.line}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ===== One team, one plan ===== */}
        <section className="pc-team" id="team" aria-labelledby="pc-team-h">
          <div className="container">
            <div className="pc-head pc-head-center">
              <h2 id="pc-team-h" data-split>Your specialists, one plan</h2>
              <p className="pc-head-lead">Every discipline works side by side in Building 500, so nothing falls between appointments.</p>
            </div>
            <div className="pc-venn" aria-hidden="true">
              <div className="pc-venn-a">
                <span>Physicians and nurse practitioners</span>
              </div>
              <div className="pc-venn-b">
                <span>Therapists and wound care specialists</span>
              </div>
              <div className="pc-venn-core">
                <strong>Your plan</strong>
              </div>
            </div>
            <ul className="pc-roles">
              {TEAM.map((t) => (
                <li key={t.role} className="pc-role">
                  <strong>{t.role}</strong>
                  <span>{t.line}</span>
                </li>
              ))}
            </ul>
            <p className="pc-center">
              <span className="fill" data-fill="providers">Provider names, photographs and credentials, from ProCare</span>
            </p>
          </div>
        </section>

        {/* ===== Back to life: a drifting mosaic ===== */}
        <section className="pc-life" aria-labelledby="pc-life-h">
          <div className="pc-life-grid" aria-hidden="true">
            {["couple-dance.jpg", "boardwalk.jpg", "autumn-walk.jpg", "coast.jpg"].map((n) => (
              <figure key={n} className="pc-life-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG(n)} alt="" width={1200} height={800} loading="lazy" />
              </figure>
            ))}
          </div>
          <div className="pc-life-text">
            <h2 id="pc-life-h" data-split>Back to the things you love</h2>
            <p>The goal of every plan is simple: less pain, more of your life.</p>
          </div>
        </section>

        {/* ===== Patient words ===== */}
        <section className="pc-quotes" aria-labelledby="pc-quotes-h">
          <div className="container">
            <div className="pc-head pc-head-center">
              <h2 id="pc-quotes-h" data-split>In our patients’ words</h2>
            </div>
            <ul className="pc-quote-row">
              {[QUOTES.main, ...QUOTES.more].map((q) => (
                <li key={q.name} className="pc-quote">
                  <span className="pc-quote-mark" aria-hidden="true">“</span>
                  <blockquote>
                    <p>{q.text}</p>
                  </blockquote>
                  <p className="pc-quote-name">{q.name}, ProCare patient</p>
                </li>
              ))}
            </ul>
            <p className="pc-center">
              <a href="https://pcw.health/testimonials/" target="_blank" rel="noreferrer" className="pc-link">Read every review on pcw.health</a>
            </p>
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

        {/* ===== The close ===== */}
        <section className="pc-book" id="book" aria-labelledby="pc-book-h">
          <div className="pc-aura pc-aura-close" aria-hidden="true">
            <i className="pc-aura-1" />
            <i className="pc-aura-2" />
          </div>
          <div className="container">
            <div className="pc-head pc-head-center">
              <h2 id="pc-book-h" data-split>Your first step is a conversation.</h2>
              <p className="pc-head-lead">Tell us what is going on. Our front desk calls you back to find a time and check your insurance.</p>
            </div>
            <div className="pc-book-card">
              <form className="pc-form" data-endpoint="" onSubmit={(e) => { e.preventDefault(); setNote(true); }}>
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
                    <option value="" disabled>Choose one</option>
                    {SPECIALTIES.map((sp) => (<option key={sp.id} value={sp.name}>{sp.name}</option>))}
                    {ALSO.map((a) => (<option key={a.label} value={a.label}>{a.label}</option>))}
                    <option value="Not sure">I am not sure yet</option>
                  </select>
                </label>
                <button type="submit" className="pc-btn pc-btn-primary pc-btn-lg pc-form-wide">Request a call back</button>
                <p className="pc-form-note pc-form-wide" role="status">
                  {note ? "This prototype is not connected yet, so nothing was sent. Please call the office instead." : "Prototype form: please do not enter medical details."}
                </p>
              </form>
              <div className="pc-book-info">
                <p className="pc-pill" data-open={status?.open ?? false}>
                  <span className="pc-live-dot" aria-hidden="true" />
                  {status ? status.text : "Monday to Thursday"}
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
                <a href={PHONE_TEL} className="pc-bigtel">{PHONE_DISPLAY}</a>
                <a href={MAPS_URL} target="_blank" rel="noreferrer" className="pc-addr">
                  {ADDRESS_LINE_1}<br />{ADDRESS_LINE_2}
                </a>
              </div>
            </div>
            <p className="pc-areas">Serving {AREAS.slice(0, -1).join(", ")} and {AREAS[AREAS.length - 1]}.</p>
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
                <li><a href="#care" onClick={go("#care")}>What we treat</a></li>
                <li><a href="#first-visit" onClick={go("#first-visit")}>First visit</a></li>
                <li><a href="#team" onClick={go("#team")}>Our team</a></li>
                <li><a href="#questions" onClick={go("#questions")}>Insurance</a></li>
                <li><a href="#book" onClick={go("#book")}>Book</a></li>
              </ul>
            </nav>
            <p className="pc-foot-contact"><a href={PHONE_TEL}>{PHONE_DISPLAY}</a><br />{ADDRESS_LINE_1}<br />{ADDRESS_LINE_2}</p>
            <ul className="pc-foot-social">
              <li><a href="https://www.instagram.com/procarewellnessinstitute/" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href="https://www.facebook.com/profile.php?id=100091856139219" target="_blank" rel="noreferrer">Facebook</a></li>
              <li><a href="https://www.youtube.com/@ProCareWellnessInstitute" target="_blank" rel="noreferrer">YouTube</a></li>
            </ul>
          </div>
          <p className="pc-legal">© 2026 ProCare Wellness Institute, Savannah. Information on this site is for education and is not a diagnosis. Homepage concept for discussion.</p>
          <p className="pc-legal" data-credits>Photographs: Unsplash (Unsplash License), stand-ins for ProCare’s own photography; neuropathy and wound images from pcw.health and Unsplash.</p>
        </div>
      </footer>

      <div className="pc-mobilebar">
        <a href={PHONE_TEL} className="pc-btn pc-btn-quiet">Call</a>
        <a href="#book" onClick={go("#book")} className="pc-btn pc-btn-primary">Book a consultation</a>
      </div>
    </div>
  );
}
