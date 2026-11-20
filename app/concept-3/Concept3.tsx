"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { ADDRESS_LINE_1, ADDRESS_LINE_2, BP, HOURS, MAPS_URL, PHONE_DISPLAY, PHONE_TEL, STEPS, TEAM } from "../concept-1/content";
import { CONDITIONS, type Condition } from "./data";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, SplitText);

const P = (f: string) => `${BP}/c3/${f}`;
const hr = (h: number) => `${h > 12 ? h - 12 : h} ${h >= 12 ? "pm" : "am"}`;

// one photograph per area of care, and one per step of the first visit (Unsplash stand-ins for ProCare's own photography)
const AREA: Record<string, { img: string; alt: string; pos: string }> = {
  joint: { img: "p-knee.jpg", alt: "A therapist treating a patient's knee", pos: "50% 50%" },
  neuropathy: { img: "p-foot.jpg", alt: "A clinician treating a patient's foot", pos: "50% 55%" },
  wound: { img: "wound.jpg", alt: "A nurse dressing a leg wound", pos: "50% 45%" },
  pain: { img: "p-spine.jpg", alt: "A clinician's hands on a patient's back", pos: "50% 40%" },
  vascular: { img: "vascular.jpg", alt: "A doctor examining a patient's feet and legs", pos: "50% 40%" },
};
const STEP_IMG = [
  { img: "p-care.jpg", alt: "A nurse holding a patient's hands" },
  { img: "consult.jpg", alt: "A bright, quiet clinic lounge with a palm and green armchairs" },
  { img: "team.jpg", alt: "A doctor going through a scan with a patient" },
  { img: "p-dance.jpg", alt: "Two older patients smiling and waving" },
];

// a heartbeat: two beats, the second stronger
const ECG = "M0 70 H210 L226 70 L238 58 L250 70 L268 70 L280 100 L300 10 L322 128 L338 70 L356 70 L370 60 L384 70 H600 L616 70 L628 56 L640 70 L660 70 L672 108 L700 -6 L726 138 L744 70 L764 70 L780 58 L796 70 H1000";
const ArrowUR = () => (<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M5 13L13 5M6.5 5H13v6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const ArrowR = () => (<svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true"><path d="M1 7h19M14 1l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const Tick = () => (<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const Phone = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>);
const Cross = () => (<svg viewBox="0 0 48 48" width="56" height="56" fill="currentColor" aria-hidden="true"><path d="M19 4h10a3 3 0 013 3v9h9a3 3 0 013 3v10a3 3 0 01-3 3h-9v9a3 3 0 01-3 3H19a3 3 0 01-3-3v-9H7a3 3 0 01-3-3V19a3 3 0 013-3h9V7a3 3 0 013-3z" /></svg>);

export default function Concept3() {
  const [menu, setMenu] = useState(false);
  const [step, setStep] = useState(0);
  const [area, setArea] = useState("");
  const [sent, setSent] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const stepRef = useRef(0);

  const scrollToY = useCallback((y: number) => {
    if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    else window.scrollTo({ top: y, behavior: "smooth" });
  }, []);
  const scrollToId = useCallback((id: string) => {
    const el = document.querySelector(id);
    if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY);
  }, [scrollToY]);
  const goId = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); setMenu(false); scrollToId(id); };
  const bookFor = (x: Condition) => (e: React.MouseEvent) => { e.preventDefault(); setArea(x.book); scrollToId("#book"); };

  useEffect(() => {
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = (t: number) => lenisRef.current?.raf(t * 1000);
    if (!noMotion) {
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      lenisRef.current = lenis;
      lenis.stop();
    }
    const splits: SplitText[] = [];
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const count = (el: HTMLElement) => {
        const end = Number(el.dataset.count);
        const o = { v: 0 };
        gsap.to(o, { v: end, duration: 2.2, ease: "power2.out", onUpdate: () => { el.textContent = String(Math.round(o.v)); } });
      };

      // opening: the photograph opens up, the headline rises, the numbers count
      if (noMotion) { gsap.set(".c3-load", { display: "none" }); lenisRef.current?.start(); }
      else {
        const h = SplitText.create(".c3-hero h1", { type: "lines", mask: "lines" });
        splits.push(h);
        gsap.set(".c3-hero-photo img", { scale: 1.35 });
        gsap.set(".c3-hero-photo", { clipPath: "circle(0% at 50% 50%)" });
        gsap.set(".c3-stats", { yPercent: 110 });
        gsap.set(".c3-ecg-top", { clipPath: "inset(0 100% 0 0)" });
        gsap.set(".c3-load-brand", { opacity: 0, y: 24 });
        const intro = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: () => lenisRef.current?.start() });
        intro
          .to(".c3-load-brand", { opacity: 1, y: 0, duration: 1.2 }, 0.2)
          .to(".c3-ecg-top", { clipPath: "inset(0 0% 0 0)", duration: 2.5, ease: "power1.inOut" }, 0.3)
          .to(".c3-load-brand img", { scale: 1.06, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 }, 1.1)
          .to(".c3-load-brand img", { scale: 1.1, duration: 0.2, ease: "power2.out", yoyo: true, repeat: 1 }, 2.0)
          .to(".c3-ecg", { opacity: 0, duration: 0.5, ease: "power2.in" }, 2.6)
          .fromTo(".c3-ripple", { scale: 0, opacity: 1 }, { scale: 22, opacity: 0, duration: 1.8, ease: "power3.out" }, 2.75)
          .to(".c3-hero-photo", { clipPath: "circle(78% at 50% 50%)", duration: 2.1, ease: "expo.inOut" }, 2.8)
          .to(".c3-hero-photo img", { scale: 1.05, duration: 2.6 }, 2.8)
          .to(".c3-load", { opacity: 0, duration: 0.6, ease: "power2.out", onComplete: () => { gsap.set(".c3-load", { display: "none" }); } }, 3.0)
          .from(".c3-nav", { yPercent: -150, opacity: 0, duration: 1 }, 3.9)
          .from(h.lines, { yPercent: 115, duration: 1.4, stagger: 0.12 }, 4.0)
          .from(".c3-hero-sub", { y: 20, opacity: 0, duration: 1 }, 4.4)
          .from(".c3-hero-cta", { y: 20, opacity: 0, duration: 1 }, 4.55)
          .to(".c3-stats", { yPercent: 0, duration: 1.2 }, 4.4)
          .add(() => gsap.utils.toArray<HTMLElement>(".c3-stat [data-count]").forEach(count), 4.7);
      }

      mm.add("(min-width: 64.0625rem) and (min-height: 560px)", () => {
        // hero: the headline grows, the photograph deepens, the numbers slide away
        const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: ".c3-hero-wrap", start: "top top", end: "+=140%", pin: true, scrub: 0.6, anticipatePin: 1 } });
        const ir = { immediateRender: false };
        tl.fromTo(".c3-hero h1", { scale: 1, yPercent: 0, opacity: 1 }, { scale: 1.5, yPercent: -20, opacity: 0, duration: 0.7, ...ir }, 0);
        tl.fromTo(".c3-hero-sub, .c3-hero-cta", { opacity: 1, y: 0 }, { opacity: 0, y: -40, duration: 0.3, ...ir }, 0);
        tl.fromTo(".c3-hero-photo img", { scale: 1.05 }, { scale: 1.3, duration: 1, ...ir }, 0);
        tl.fromTo(".c3-stats", { yPercent: 0 }, { yPercent: 120, duration: 0.5, ...ir }, 0);
        tl.fromTo(".c3-hero-dim", { opacity: 0 }, { opacity: 0.7, duration: 0.8, ...ir }, 0);
        tl.to({}, { duration: 0.15 });
      });

      // headings rise word by word
      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
        const sp = SplitText.create(el, { type: "lines", mask: "lines" });
        splits.push(sp);
        gsap.from(sp.lines, { yPercent: 115, duration: 1.2, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });

      // expert care: the photographs drift at different speeds
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        const s = Number(el.dataset.speed);
        gsap.fromTo(el, { y: 120 * s }, { y: -60 * s, ease: "none", scrollTrigger: { trigger: ".c3-xc-row", start: "top 95%", end: "bottom 10%", scrub: 0.6 } });
      });
      gsap.utils.toArray<HTMLElement>(".c3-xc-row img").forEach((img) => {
        gsap.fromTo(img, { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: img.closest("figure, article") || img, start: "top 100%", end: "bottom 30%", scrub: true } });
      });

      // the giant word and the clinician in the phone
      gsap.fromTo(".c3-giant", { xPercent: 8 }, { xPercent: -42, ease: "none", scrollTrigger: { trigger: ".c3-phone-sec", start: "top bottom", end: "bottom top", scrub: 0.6 } });
      gsap.fromTo(".c3-phone", { scale: 0.86, yPercent: 8 }, { scale: 1.04, yPercent: -4, ease: "none", scrollTrigger: { trigger: ".c3-phone-sec", start: "top 90%", end: "center 40%", scrub: 0.6 } });
      gsap.utils.toArray<HTMLElement>(".c3-chip").forEach((el, i) => {
        gsap.fromTo(el, { y: 80 + i * 30, opacity: 0 }, { y: -20 * (i % 2 ? 1 : -1), opacity: 1, ease: "none", scrollTrigger: { trigger: ".c3-phone-sec", start: "top 80%", end: "center 45%", scrub: 0.7 } });
      });

      // team list
      gsap.from(".c3-role", { y: 40, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ".c3-roles", start: "top 85%", once: true } });
      gsap.from(".c3-team-photo", { clipPath: "inset(0 0 100% 0 round 28px)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: ".c3-team-photo", start: "top 85%", once: true } });
      gsap.from(".c3-form-card", { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".c3-form-card", start: "top 92%", once: true } });
      gsap.from(".c3-book-photo", { clipPath: "inset(0 0 100% 0 round 28px)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: ".c3-book-photo", start: "top 90%", once: true } });
      gsap.to(".c3-progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });

      mm.add("(min-width: 64.0625rem) and (min-height: 560px)", () => {
        // the five areas, scrolled along
        const track = document.querySelector<HTMLElement>(".c3-atrack");
        if (track) {
          const dist = () => track.scrollWidth - window.innerWidth + 2 * 36;
          const at = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: ".c3-areas-wrap", start: "top top", end: () => "+=" + dist(), pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true } });
          at.to(track, { x: () => -dist() }, 0);
          at.fromTo(".c3-aprog i", { scaleX: 0.04 }, { scaleX: 1 }, 0);
        }
        // the first visit: the steps light up one by one while the photograph follows
        gsap.timeline({
          scrollTrigger: {
            trigger: ".c3-steps-wrap", start: "top top", end: "+=320%", pin: true, scrub: true, anticipatePin: 1,
            onUpdate: (s) => { const i = Math.min(3, Math.floor(s.progress * 4)); if (i !== stepRef.current) { stepRef.current = i; setStep(i); } },
          },
        }).fromTo(".c3-sprog i", { scaleY: 0.05 }, { scaleY: 1, ease: "none", transformOrigin: "50% 0" }, 0);
      });
    });

    const rf = () => ScrollTrigger.refresh();
    window.addEventListener("load", rf);
    return () => {
      window.removeEventListener("load", rf);
      splits.forEach((s) => s.revert());
      mm.revert();
      ctx.revert();
      lenisRef.current?.destroy();
      lenisRef.current = null;
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div className="c3">
      <a className="c3-skip" href="#main">Skip to content</a>
      <div className="c3-progress" aria-hidden="true" />
      <div className="c3-load" aria-hidden="true">
        <div className="c3-load-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={P("procare-logo-white.png")} alt="" width={480} height={135} />
        </div>
        <svg className="c3-ecg" viewBox="0 0 1000 140" preserveAspectRatio="none">
          <path className="c3-ecg-bg" d={ECG} />
        </svg>
        <svg className="c3-ecg c3-ecg-top" viewBox="0 0 1000 140" preserveAspectRatio="none">
          <path className="c3-ecg-fg" d={ECG} />
        </svg>
      </div>
      <noscript><style>{".c3-load{display:none}"}</style></noscript>

      <header className="c3-nav">
        <a href="#top" className="c3-logo" aria-label="ProCare Wellness Institute, home" onClick={goId("#top")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={P("procare-logo-color.png")} alt="ProCare Wellness Institute, Regenerative and Aesthetic Medicine" width={480} height={135} decoding="async" />
        </a>
        <nav aria-label="Primary" className="c3-links" data-open={menu}>
          <a href="#top" onClick={goId("#top")}>Home</a>
          <a href="#areas" onClick={goId("#areas")}>Areas of care</a>
          <a href="#visit" onClick={goId("#visit")}>First visit</a>
          <a href="#team" onClick={goId("#team")}>Your team</a>
          <a href="#book" onClick={goId("#book")}>Book</a>
        </nav>
        <div className="c3-nav-act">
          <a href={PHONE_TEL} className="c3-ph" aria-label={`Call ${PHONE_DISPLAY}`}><Phone /></a>
          <a href="#book" onClick={goId("#book")} className="c3-btn c3-btn-dark c3-btn-sm">Book a visit</a>
          <button type="button" className="c3-burger" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu((m) => !m)}><i /><i /></button>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        {/* 1 · hero */}
        <div className="c3-wrap c3-hero-wrap" id="top">
          <section className="c3-panel c3-dark c3-hero" aria-labelledby="c3-h1">
            <span className="c3-ripple" aria-hidden="true" />
            <figure className="c3-hero-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={P("p-marsh.jpg")} alt="Two older people walking together along a boardwalk through green marshland" width={1800} height={1200} fetchPriority="high" decoding="async" />
              <span className="c3-hero-dim" aria-hidden="true" />
            </figure>
            <div className="c3-hero-copy">
              <h1 id="c3-h1">Your Path Back to Moving Well</h1>
              <p className="c3-hero-sub">Non-surgical care for joint pain, nerve pain, wounds and more, in Savannah, Georgia.</p>
              <a href="#book" onClick={goId("#book")} className="c3-btn c3-btn-light c3-hero-cta">Book now</a>
            </div>
            <div className="c3-stats">
              <span className="c3-tab c3-tab-a">Non-surgical care</span><span className="c3-tab c3-tab-b">One team, one roof</span>
              <div className="c3-stats-in">
                <p className="c3-stats-l">Where care meets a plan made for you.</p>
                <ul>
                  <li className="c3-stat"><strong>40–60</strong><span>minute first visit with a provider</span></li>
                  <li className="c3-stat"><strong><span data-count="13">13</span></strong><span>Savannah-area communities served</span></li>
                  <li className="c3-stat"><strong><span data-count="6">6</span></strong><span>kinds of clinician on your team</span></li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* 2 · expert care */}
        <div className="c3-wrap">
          <section className="c3-panel c3-sage c3-expert" id="expert" aria-labelledby="c3-ex-h">
            <div className="c3-sechead">
              <h2 id="c3-ex-h" data-rise>Expert Care, Close to Home</h2>
              <div className="c3-sechead-r">
                <p>See a provider who has time for you: a 40 to 60 minute first visit, an assessment, and your non-surgical options.</p>
                <a href="#book" onClick={goId("#book")} className="c3-btn c3-btn-light">Get started</a>
              </div>
            </div>
            <div className="c3-xc-row">
              <figure className="c3-xc c3-xc1" data-speed="1.0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={P("p-laugh.jpg")} alt="A smiling older woman and a clinician laughing together" width={1200} height={1422} loading="eager" decoding="async" />
              </figure>
              <div className="c3-xc c3-xc2" data-speed="1.6">
                <div className="c3-xc-chip"><span className="c3-xc-ic"><Tick /></span><p>Insurance <br />checked first</p></div>
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={P("p-talk.jpg")} alt="A clinician explaining imaging to a patient" width={1400} height={933} loading="eager" decoding="async" />
                </figure>
              </div>
              <figure className="c3-xc c3-xc3" data-speed="0.7">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={P("p-checkup.jpg")} alt="A physician checking a patient's blood pressure" width={1400} height={788} loading="eager" decoding="async" />
              </figure>
              <a href={PHONE_TEL} className="c3-xc c3-xc4" data-speed="1.3" aria-label={`Call ${PHONE_DISPLAY}`}>
                <Cross />
                <strong>Same-day urgent appointments</strong>
                <span>{PHONE_DISPLAY}</span>
              </a>
            </div>
          </section>
        </div>

        {/* 3 · the giant word and the clinician */}
        <div className="c3-wrap">
          <section className="c3-panel c3-cream c3-phone-sec" aria-label="Non-surgical care, explained">
            <p className="c3-giant" aria-hidden="true">NON-SURGICAL CARE</p>
            <p className="c3-pl c3-pl-l">Costs are explained before you decide.</p>
            <p className="c3-pl c3-pl-r">Bring your records, your insurance card and loose clothing.</p>
            <div className="c3-phone">
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={P("pain.jpg")} alt="A physician talking with a patient in a consultation room" width={2000} height={1125} loading="eager" decoding="async" />
              </figure>
              <a href="#book" onClick={goId("#book")} className="c3-phone-btn">Book a visit <ArrowR /></a>
            </div>
            <div className="c3-chip c3-chip1"><span className="c3-xc-ic"><Phone /></span><p>Same-day urgent<br />appointments</p></div>
            <div className="c3-chip c3-chip2"><span className="c3-xc-ic"><Tick /></span><p>Six kinds of<br />clinicians</p></div>
            <div className="c3-chip c3-chip3"><span className="c3-xc-ic"><Tick /></span><p>40 to 60 minute<br />first visit</p></div>
          </section>
        </div>

        {/* 4 · five areas */}
        <div className="c3-wrap c3-areas-wrap" id="areas">
          <section className="c3-panel c3-dark c3-areas" aria-labelledby="c3-areas-h">
            <div className="c3-sechead c3-areas-head">
              <h2 id="c3-areas-h">Expertise Across Five Areas of Care</h2>
              <div className="c3-sechead-r">
                <p>Scroll along to see how ProCare treats each one, who you will see and what to expect.</p>
                <a href={PHONE_TEL} className="c3-btn c3-btn-light c3-btn-sm">Call now</a>
              </div>
            </div>
            <ul className="c3-atrack">
              {CONDITIONS.map((x) => (
                <li key={x.id} className="c3-acard">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={P(AREA[x.id].img)} alt={AREA[x.id].alt} width={1400} height={933} loading="eager" decoding="async" style={{ objectPosition: AREA[x.id].pos }} />
                  <span className="c3-atag">{x.short}</span>
                  <div className="c3-ainfo">
                    <h3>{x.short}</h3>
                    <p className="c3-aplain">{x.plain}</p>
                    <ul className="c3-atx">{x.treatments.slice(0, 3).map((t) => <li key={t.name}>{t.name}</li>)}</ul>
                    <p className="c3-awho">{x.team.join(", ")}</p>
                    {x.confirm && <p className="c3-fine">{x.confirm}</p>}
                    <div className="c3-acts">
                      <a href="#book" onClick={bookFor(x)} className="c3-btn c3-btn-light c3-btn-sm">Book for {x.short.toLowerCase()}</a>
                      <a href={x.href} target="_blank" rel="noreferrer" className="c3-circle" aria-label={`More about ${x.short.toLowerCase()} on pcw.health`}><ArrowUR /></a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="c3-aprog" aria-hidden="true"><i /></div>
          </section>
        </div>

        {/* 5 · first visit */}
        <div className="c3-wrap c3-steps-wrap" id="visit">
          <section className="c3-panel c3-cream c3-steps" aria-labelledby="c3-visit-h">
            <div className="c3-steps-l">
              <h2 id="c3-visit-h">Your First Visit, Step by Step</h2>
              <ol className="c3-steplist">
                {STEPS.map((s, i) => (
                  <li key={s.title} data-on={step === i}>
                    <span className="c3-sn" aria-hidden="true">{i + 1}</span>
                    <div><h3>{s.title}</h3><p>{s.line}</p></div>
                  </li>
                ))}
              </ol>
              <a href="#book" onClick={goId("#book")} className="c3-btn c3-btn-dark">Book your first visit</a>
            </div>
            <div className="c3-steps-r">
              <div className="c3-sprog" aria-hidden="true"><i /></div>
              <div className="c3-sphotos">
                {STEP_IMG.map((s, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={s.img} data-on={step === i} src={P(s.img)} alt={s.alt} width={1400} height={933} loading="eager" decoding="async" />
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* 6 · team */}
        <div className="c3-wrap">
          <section className="c3-panel c3-dark c3-team" id="team" aria-labelledby="c3-team-h">
            <div className="c3-team-l">
              <h2 id="c3-team-h" data-rise>The People Behind Your Plan</h2>
              <ul className="c3-roles">
                {TEAM.map((r) => (<li key={r.role} className="c3-role"><h3>{r.role}</h3><p>{r.line}</p></li>))}
              </ul>
              <a href="https://pcw.health/meet-the-team/" target="_blank" rel="noreferrer" className="c3-btn c3-btn-light">See everyone on pcw.health</a>
            </div>
            <figure className="c3-team-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={P("p-strength.jpg")} alt="A therapist guiding a patient through a strength exercise" width={1400} height={933} loading="eager" decoding="async" />
            </figure>
          </section>
        </div>

        {/* 7 · book */}
        <div className="c3-wrap">
          <section className="c3-panel c3-cream c3-book" id="book" aria-labelledby="c3-book-h">
            <div className="c3-book-head">
              <h2 id="c3-book-h">Book Your First Visit</h2>
              <p>Insurance is checked for you, and costs are explained before you decide.</p>
              <div className="c3-acts">
                <a href={PHONE_TEL} className="c3-btn c3-btn-dark">Call {PHONE_DISPLAY}</a>
                <a href={MAPS_URL} target="_blank" rel="noreferrer" className="c3-btn c3-btn-ghost">Find us on the map</a>
              </div>
            </div>
            <div className="c3-book-grid">
              <figure className="c3-book-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={P("p-autumn.jpg")} alt="An older couple standing together outdoors in autumn" width={1100} height={1540} loading="eager" decoding="async" />
                <figcaption>
                  <strong>Visit us</strong>
                  <span>{ADDRESS_LINE_1}, {ADDRESS_LINE_2}</span>
                </figcaption>
              </figure>
              <div className="c3-book-mid">
                <h3>Opening hours</h3>
                <table className="c3-hours">
                  <caption className="c3-sr">Opening hours</caption>
                  <tbody>{HOURS.map((x) => (<tr key={x.day}><th scope="row">{x.day}</th><td>{x.open ? `${hr(x.open[0])} to ${hr(x.open[1])}` : "Closed"}</td></tr>))}</tbody>
                </table>
              </div>
              <form className="c3-form-card" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <h3>Request a call back</h3>
                <label><span>Your name</span><input name="name" autoComplete="name" required /></label>
                <label><span>Phone number</span><input name="phone" type="tel" autoComplete="tel" required /></label>
                <label><span>What can we help with?</span>
                  <select name="area" value={area} onChange={(e) => setArea(e.target.value)}>
                    <option value="">Not sure yet</option>
                    {CONDITIONS.map((x) => <option key={x.id} value={x.book}>{x.name}</option>)}
                  </select>
                </label>
                <button type="submit" className="c3-btn c3-btn-dark c3-submit">Request a call back</button>
                <p className="c3-fine" role="status">{sent ? `Prototype: nothing was sent. Please call ${PHONE_DISPLAY}.` : "Prototype form, not connected yet. Please do not enter medical details."}</p>
              </form>
            </div>
          </section>
        </div>
      </main>

      <footer className="c3-wrap c3-footwrap">
        <div className="c3-panel c3-dark c3-foot">
          <div className="c3-foot-top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={P("procare-logo-white.png")} alt="ProCare Wellness Institute" width={480} height={135} className="c3-foot-logo" loading="lazy" />
            <nav aria-label="Areas of care"><h3>Areas of care</h3><ul>{CONDITIONS.map((x) => <li key={x.id}><a href="#areas" onClick={goId("#areas")}>{x.short}</a></li>)}</ul></nav>
            <div><h3>Visit</h3><p>{ADDRESS_LINE_1}<br />{ADDRESS_LINE_2}</p></div>
            <div><h3>Contact</h3><p><a href={PHONE_TEL}>{PHONE_DISPLAY}</a></p>
              <ul><li><a href="https://www.instagram.com/procarewellnessinstitute/" target="_blank" rel="noreferrer">Instagram</a></li><li><a href="https://www.facebook.com/profile.php?id=100091856139219" target="_blank" rel="noreferrer">Facebook</a></li><li><a href="https://www.youtube.com/@ProCareWellnessInstitute" target="_blank" rel="noreferrer">YouTube</a></li></ul></div>
          </div>
          <div className="c3-foot-legal">
            <p>© 2026 ProCare Wellness Institute, Savannah. Information on this site is for education and is not a diagnosis. Homepage concept for discussion.</p>
            <p>Photographs from Unsplash (Unsplash License) are stand-ins for ProCare’s own photography.</p>
          </div>
        </div>
      </footer>

      <div className="c3-mbar">
        <a href={PHONE_TEL} className="c3-btn c3-btn-soft">Call</a>
        <a href="#book" onClick={goId("#book")} className="c3-btn c3-btn-light">Book a visit</a>
      </div>
    </div>
  );
}
