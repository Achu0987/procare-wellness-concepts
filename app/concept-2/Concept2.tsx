"use client";

import { memo, useCallback, useEffect, useRef, useState, type MutableRefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { ADDRESS_LINE_1, ADDRESS_LINE_2, ALSO, BP, HOURS, PHONE_DISPLAY, PHONE_TEL, TEAM } from "../concept-1/content";
import { CONDITIONS, IMG, type Condition } from "./data";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, SplitText);

// What each condition gives back: a stand-in photograph for each (stock, labelled in the footer).
const SCENE: Record<string, { img: string; alt: string; goal: string; pos: string }> = {
  joint: { img: "c2/big-joint.jpg", alt: "A clinician examining a patient's knee", goal: "Knee and joint assessment", pos: "50% 62%" },
  neuropathy: { img: "c2/big-nerve.jpg", alt: "A nurse examining a patient's feet", goal: "Foot and nerve check", pos: "50% 55%" },
  wound: { img: "c2/big-wound.jpg", alt: "A nurse dressing a leg wound", goal: "Wound dressing", pos: "50% 45%" },
  pain: { img: "c2/big-pain.jpg", alt: "A doctor talking with a patient in a consultation room", goal: "Pain consultation", pos: "50% 40%" },
  vascular: { img: "c2/big-vascular.jpg", alt: "A doctor examining a patient's feet and legs", goal: "Leg and foot examination", pos: "50% 38%" },
};
const TILES = ["c2/life-1.jpg", "c2/life-2.jpg", "c2/life-3.jpg", "c2/life-4.jpg", "c2/life-5.jpg", "c2/life-6.jpg"];
const DAYS = HOURS.filter((d) => d.open);

function Arrow({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  );
}
function Tick({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>
  );
}
function Phone() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
  );
}
const initials = (s: string) => s.split(" ").map((w) => w[0]).join("");

/* ---------- 1 · a full-bleed photograph, a huge light headline, one photograph tile inside it ---------- */
const Hero = memo(function Hero({ onPick, goId }: { onPick: (i: number) => void; goId: (id: string) => (e: React.MouseEvent) => void }) {
  return (
    <section className="c2-hero" id="top" aria-labelledby="c2-h1">
      <div className="c2-hero-media">
        <div className="c2-hero-photo" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${BP}/c1/consult.jpg`} alt="" width={1600} height={1078} fetchPriority="high" decoding="async" />
        </div>
        <div className="c2-hero-in">
          <h1 id="c2-h1">
            <span className="c2-l1">What can we</span>
            <span className="c2-l2">help you <i className="c2-inline" aria-hidden="true">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={IMG("c2/life-4.jpg")} alt="" width={160} height={160} decoding="async" /></i> with?</span>
          </h1>
          <p className="c2-hero-lead">ProCare treats joint pain, nerve pain, wounds and more without surgery, with one team under one roof in Savannah, Georgia.</p>
          <div className="c2-hero-cta">
            <a href="#book" onClick={goId("#book")} className="c2-glass-pill">Book a visit</a>
          </div>
          <ul className="c2-hero-chips" aria-label="Jump to a condition">
            {CONDITIONS.map((c, i) => <li key={c.id}><button type="button" onClick={() => onPick(i)}>{c.short}</button></li>)}
          </ul>
        </div>
        <aside className="c2-hero-note c2-glass">
          <span className="c2-note-ic"><Phone /></span>
          <p>Same-day urgent appointments are available. Call {PHONE_DISPLAY}.</p>
          <a href={PHONE_TEL} className="c2-glass-pill c2-glass-pill-sm">Call now</a>
        </aside>
      </div>
    </section>
  );
});

/* ---------- 2 · a statement on soft blue; tiles fly in, two cards slide up ---------- */
function Intro() {
  return (
    <section className="c2-intro" id="intro" aria-labelledby="c2-intro-h">
      <div className="c2-intro-stage">
        <h2 id="c2-intro-h" className="c2-intro-h">One team and a plan for each patient.</h2>
        <ul className="c2-tiles" aria-hidden="true">
          {TILES.map((t, i) => (
            <li key={t} className={`c2-tile t${i + 1}`}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={IMG(t)} alt="" width={200} height={200} loading="lazy" decoding="async" /></li>
          ))}
        </ul>
        <div className="c2-intro-cards">
          <article className="c2-card c2-card-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${BP}/c1/consult.jpg`} alt="A bright, quiet clinic lounge with a palm and green armchairs" width={1600} height={1078} loading="lazy" decoding="async" />
            <div className="c2-card-text">
              <p className="c2-card-k">Your first visit</p>
              <h3>40 to 60 minutes, from assessment to plan.</h3>
              <p>Bring your records, your insurance card and loose clothing. Insurance is checked for you.</p>
            </div>
            <a href="#book" className="c2-card-btn">Book a visit <Arrow size={15} /></a>
          </article>
          <article className="c2-card c2-card-glass2">
            <p className="c2-card-k">Your care team</p>
            <h3>Six kinds of clinician, side by side.</h3>
            <ul className="c2-roles">
              {TEAM.map((t) => (
                <li key={t.role}><span aria-hidden="true">{initials(t.role)}</span><strong>{t.role}</strong></li>
              ))}
            </ul>
            <p className="c2-fine">Provider names and photographs, from ProCare.</p>
            <a href="https://pcw.health/meet-the-team/" target="_blank" rel="noreferrer" className="c2-card-btn c2-card-btn-ghost">See everyone <Arrow size={15} /></a>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3 · a full-bleed scene per condition, a glass panel that changes as you scroll ---------- */
const Plan = memo(function Plan({ bus, bookFor, jump }: { bus: MutableRefObject<(i: number) => void>; bookFor: (c: Condition) => void; jump: (i: number) => void }) {
  const [sel, setSel] = useState(0);
  const last = useRef(0);
  useEffect(() => { bus.current = (i) => setSel(i); return () => { bus.current = () => {}; }; }, [bus]);
  useEffect(() => { last.current = sel; }, [sel]);
  const c = CONDITIONS[sel];
  const s = SCENE[c.id];
  const prev = last.current;
  return (
    <section className="c2-plan" id="plan" aria-labelledby="c2-plan-h">
      <div className="c2-plan-stage">
        <div className="c2-plan-bg" aria-hidden="true">
          {CONDITIONS.map((x, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={x.id} data-s={sel === i ? "on" : prev === i ? "prev" : "off"} style={{ objectPosition: SCENE[x.id].pos }} src={IMG(SCENE[x.id].img)} alt="" width={2000} height={1333} loading="lazy" decoding="async" />
          ))}
        </div>
        <div className="c2-plan-shade" aria-hidden="true" />
        <div className="c2-plan-grid">
          <div className="c2-plan-index">
            <p className="c2-label">What can we help you with?</p>
            <div role="tablist" aria-label="Choose a condition" aria-orientation="vertical">
              {CONDITIONS.map((x, i) => (
                <button key={x.id} type="button" role="tab" aria-selected={sel === i} onClick={() => jump(i)}>
                  <span className="c2-pi-n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="c2-pi-t">{x.short}</span>
                </button>
              ))}
            </div>
            <div className="c2-plan-prog" aria-hidden="true"><i style={{ transform: `scaleX(${(sel + 1) / CONDITIONS.length})` }} /></div>
          </div>
          <article className="c2-plan-card c2-glass" key={c.id} aria-labelledby="c2-plan-h">
            <div className="c2-pc-top">
              <span className="c2-pc-goal">{s.goal}</span>
              <span className="c2-pc-count" aria-hidden="true">{String(sel + 1).padStart(2, "0")} / {String(CONDITIONS.length).padStart(2, "0")}</span>
            </div>
            <h2 id="c2-plan-h">{c.name}</h2>
            <p className="c2-plan-lead">{c.what}{c.confirm ? ` (${c.confirm})` : ""}</p>
            <div className="c2-plan-meta">
              <div><h3>Common signs</h3><ul>{c.symptoms.slice(0, 3).map((x) => <li key={x}><Tick size={12} /> {x}</li>)}</ul></div>
              <div><h3>How we treat it</h3><ul>{c.treatments.slice(0, 3).map((x) => <li key={x.name}><Tick size={12} /> {x.name}</li>)}</ul></div>
            </div>
            <div className="c2-pc-who"><h3>Who you will see</h3><ul>{c.team.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div className="c2-plan-act">
              <button type="button" className="c2-glass-pill c2-glass-pill-solid" onClick={() => bookFor(c)}>Book for {c.short.toLowerCase()}</button>
              <a href={c.href} target="_blank" rel="noreferrer" className="c2-glass-pill">More details</a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
});

/* ---------- 4 · a statement, photographs as little app tiles, one big photograph ---------- */
function Split() {
  return (
    <section className="c2-split" id="split" aria-labelledby="c2-split-h">
      <div className="c2-split-l">
        <ul className="c2-float" aria-hidden="true">
          {TILES.slice(0, 5).map((t, i) => (
            <li key={t} className={`f${i + 1}`}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={IMG(t)} alt="" width={120} height={120} loading="lazy" decoding="async" /></li>
          ))}
        </ul>
        <div className="c2-split-text">
          <p className="c2-label">Where an active life starts</p>
          <h2 id="c2-split-h" data-rise>Less pain is the basis for a long and active life.</h2>
          <a href="#book" className="c2-blue-pill">Start your plan</a>
        </div>
      </div>
      <div className="c2-split-r">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${BP}/c1/team.jpg`} alt="A doctor going through a scan with a patient" width={1600} height={1066} loading="lazy" decoding="async" />
        <aside className="c2-glass c2-split-card">
          <p>We will build your plan and choose the most effective, non-surgical treatment for you.</p>
          <a href="#book" className="c2-glass-pill c2-glass-pill-sm">Book a visit</a>
        </aside>
      </div>
    </section>
  );
}

/* ---------- 5 · saturated blue; real figures fly in as little widgets ---------- */
function Numbers({ onBook }: { onBook: (e: React.MouseEvent) => void }) {
  const [day, setDay] = useState(0);
  const d = DAYS[day];
  return (
    <section className="c2-num" id="numbers" aria-labelledby="c2-num-h">
      <div className="c2-num-stage">
        <div className="c2-num-head">
          <p className="c2-label">For your health</p>
          <h2 id="c2-num-h">ProCare in numbers, all in one place.</h2>
        </div>

        <div className="c2-w w-ring">
          <p>First visit</p>
          <div className="c2-ring-box">
            <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" className="c2-ring-bg" /><circle cx="50" cy="50" r="42" pathLength="1" className="c2-ring-fg" /></svg>
            <strong>40–60<small>minutes</small></strong>
          </div>
          <span>Assessment and plan</span>
        </div>
        <div className="c2-w w-wave" aria-hidden="true">
          <span>Same-day</span>
          <svg viewBox="0 0 120 40"><path pathLength="1" d="M0 24 H30 L36 24 L42 8 L50 34 L57 14 L62 24 H120" /></svg>
        </div>
        <div className="c2-w w-bars">
          <div><p>Clinicians</p><strong>6 kinds</strong></div>
          <div className="c2-bars" aria-hidden="true">{[36, 54, 44, 70, 52, 62].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
        </div>
        <div className="c2-w w-comm">
          <span className="c2-w-ic" aria-hidden="true">13</span>
          <div><p>Communities</p><strong>Savannah and 12 more</strong></div>
        </div>
        <div className="c2-w w-spec">
          <span className="c2-w-ic" aria-hidden="true">6</span>
          <div><p>Specialties</p><strong>One building</strong></div>
        </div>
        <div className="c2-w w-help">
          <p>How we help</p>
          <ul>
            <li><span>Same-day urgent appointments</span><i aria-hidden="true" /></li>
            <li><span>Insurance checked first</span><i aria-hidden="true" /></li>
            <li><span>Cash and payment plans</span><i aria-hidden="true" /></li>
          </ul>
        </div>
        <div className="c2-w w-hours">
          <div className="c2-hours-head"><p>Open hours</p><span>{ADDRESS_LINE_2.replace(", GA", "")}</span></div>
          <div className="c2-hours-tabs" role="tablist" aria-label="Day">
            {DAYS.map((x, i) => <button key={x.day} type="button" role="tab" aria-selected={day === i} onClick={() => setDay(i)}>{x.day.slice(0, 3)}</button>)}
          </div>
          <div className="c2-hours-card">
            <p>{d.day}</p>
            <strong>{d.open![0]} am to {d.open![1] - 12} pm</strong>
            <small>{ADDRESS_LINE_1}</small>
          </div>
          <a href="#book" onClick={onBook} className="c2-hours-btn">Book a visit <Arrow size={14} /></a>
        </div>
      </div>
    </section>
  );
}

/* ---------- 6 · book ---------- */
const Book = memo(function Book({ bus }: { bus: MutableRefObject<(v: string) => void> }) {
  const [concern, setConcern] = useState("");
  const [sent, setSent] = useState(false);
  useEffect(() => { bus.current = (v) => setConcern(v); return () => { bus.current = () => {}; }; }, [bus]);
  return (
    <section className="c2-book" id="book" aria-labelledby="c2-book-h">
      <div className="c2-book-in">
        <div className="c2-book-head">
          <p className="c2-label">Book</p>
          <h2 id="c2-book-h" data-rise>Ready when you are.</h2>
          <p className="c2-book-lead">Tell us what is going on. Our front desk calls you back to find a time and check your insurance.</p>
          <a href={PHONE_TEL} className="c2-bigtel">{PHONE_DISPLAY}</a>
        </div>
        <form className="c2-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <label><span>Full name</span><input name="name" autoComplete="name" required /></label>
          <label><span>Phone</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" required /></label>
          <label className="c2-wide">
            <span>What would you like help with?</span>
            <select value={concern} onChange={(e) => setConcern(e.target.value)}>
              <option value="" disabled>Choose one</option>
              {CONDITIONS.map((x) => <option key={x.id} value={x.book}>{x.name}</option>)}
              {ALSO.map((a) => <option key={a.label} value={a.label}>{a.label}</option>)}
              <option value="Not sure">I am not sure yet</option>
            </select>
          </label>
          <button type="submit" className="c2-wide c2-submit">Request a call back</button>
          <p className="c2-fine c2-wide" role="status">{sent ? "This prototype is not connected yet, so nothing was sent. Please call the office instead." : "Prototype form: please do not enter medical details."}</p>
        </form>
      </div>
    </section>
  );
});

export default function Concept2() {
  const root = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const bookBus = useRef<(v: string) => void>(() => {});
  const planBus = useRef<(i: number) => void>(() => {});
  const planST = useRef<ScrollTrigger | null>(null);
  const [menu, setMenu] = useState(false);

  const scrollToY = useCallback((y: number, d = 1.4) => {
    if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: d });
    else window.scrollTo({ top: y, behavior: "smooth" });
  }, []);
  const scrollToId = useCallback((id: string) => {
    const el = document.querySelector<HTMLElement>(id);
    if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY - 12);
  }, [scrollToY]);
  const goId = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); setMenu(false); if (id === "#plan") jumpPlan(0); else scrollToId(id); };
  const jumpPlan = useCallback((i: number) => {
    const st = planST.current;
    if (st) scrollToY(st.start + ((i + 0.5) / CONDITIONS.length) * (st.end - st.start));
    else { planBus.current(i); scrollToId("#plan"); }
  }, [scrollToY, scrollToId]);
  const bookFor = useCallback((c: Condition) => { bookBus.current(c.book); scrollToId("#book"); }, [scrollToId]);

  useEffect(() => {
    root.current?.classList.add("js");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = (t: number) => lenisRef.current?.raf(t * 1000);
    if (!reduce) {
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      lenisRef.current = lenis;
    }
    const splits: SplitText[] = [];
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      if (reduce) return;
      const enter = (trigger: Element | string, start = "top 82%") => ({ trigger, start, toggleActions: "play none none reverse" });

      // hero load
      const l1 = SplitText.create(".c2-l1", { type: "words,lines", mask: "lines" });
      const l2 = SplitText.create(".c2-l2", { type: "words,lines", mask: "lines" });
      splits.push(l1, l2);
      gsap.timeline({ defaults: { ease: "expo.out" } })
        .fromTo(".c2-hero-photo img", { scale: 1.18 }, { scale: 1, duration: 3 }, 0)
        .from([...l1.words, ...l2.words], { yPercent: 115, duration: 1.4, stagger: 0.08 }, 0.2)
        .from(".c2-inline", { scale: 0, rotate: -40, duration: 1.2, ease: "back.out(1.8)" }, 0.9)
        .from(".c2-hero-lead, .c2-hero-cta, .c2-hero-chips", { y: 24, opacity: 0, duration: 1, stagger: 0.12 }, 1)
        .from(".c2-hero-note", { x: 60, opacity: 0, duration: 1.2 }, 1.3);

      mm.add("(min-width: 64.0625rem) and (min-height: 600px)", () => {
        // the hero sinks into a rounded card as the blue section rises over it
        gsap.to(".c2-hero-media", { scale: 0.9, borderRadius: 48, ease: "none", scrollTrigger: { trigger: ".c2-intro", start: "top bottom", end: "top top", scrub: true } });
        gsap.to(".c2-hero-in", { yPercent: -8, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".c2-intro", start: "top bottom", end: "top 30%", scrub: true } });

        // intro: words fill, tiles fly in, two cards slide up
        const words = SplitText.create(".c2-intro-h", { type: "words" });
        splits.push(words);
        const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: ".c2-intro", start: "top top", end: "+=420%", pin: ".c2-intro-stage", scrub: 0.7, anticipatePin: 1 } });
        tl.fromTo(words.words, { opacity: 0.12 }, { opacity: 1, stagger: 0.08, duration: 0.5 }, 0);
        const from = [[-75, 0, -14], [75, 0, 14], [-75, 0, 10], [75, 0, -10], [-30, 70, -8], [30, 70, 8]];
        document.querySelectorAll<HTMLElement>(".c2-tile").forEach((el, i) => {
          tl.from(el, { x: `${from[i][0]}vw`, y: `${from[i][1]}vh`, rotate: from[i][2], scale: 0.7, opacity: 0, duration: 0.7, ease: "power2.out" }, 0.1 + i * 0.1);
        });
        // the people leave to the sides, then the heading goes, then the cards come up
        document.querySelectorAll<HTMLElement>(".c2-tile").forEach((el, i) => {
          tl.to(el, { x: `${from[i][0]}vw`, y: `${from[i][1]}vh`, opacity: 0, duration: 0.5, ease: "power2.in" }, 1.3 + i * 0.03);
        });
        tl.to(".c2-intro-h", { yPercent: -120, opacity: 0, duration: 0.45 }, 1.45);
        tl.fromTo(".c2-card-photo", { yPercent: 130, rotate: -6, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, duration: 0.55 }, 1.8);
        tl.fromTo(".c2-card-glass2", { yPercent: 150, rotate: 6, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, duration: 0.55 }, 1.9);
        tl.to({}, { duration: 0.45 }, 2.45);

        // plan: the scene arrives, the glass panel rises, the condition follows the scroll
        const N = CONDITIONS.length;
        const ptl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: ".c2-plan", start: "top top", end: () => "+=" + window.innerHeight * 0.7 * N, pin: ".c2-plan-stage", scrub: 0.6, anticipatePin: 1, onUpdate: (self) => { const i = Math.min(N - 1, Math.floor(self.progress * N)); planBus.current(i); } } });
        planST.current = ptl.scrollTrigger ?? null;
        ptl.fromTo(".c2-plan-bg", { scale: 1.2 }, { scale: 1, duration: 1 }, 0);
        ptl.fromTo(".c2-plan-card", { yPercent: 18, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.12, ease: "power2.out" }, 0);
        ptl.fromTo(".c2-plan-index [role=tablist]", { xPercent: -10, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.12, ease: "power2.out" }, 0);

        // the split: pinned. The clinic photograph wipes in from the right, the little photographs settle round the statement, the card follows
        const stl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: ".c2-split", start: "top top", end: "+=150%", pin: true, scrub: 0.7, anticipatePin: 1 } });
        stl.fromTo(".c2-split-r", { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: 0.8, ease: "power2.inOut" }, 0);
        stl.fromTo(".c2-split-r img", { scale: 1.4 }, { scale: 1, duration: 1.4 }, 0);
        stl.fromTo(".c2-split-text > *", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.12, ease: "power2.out" }, 0.15);
        const fl = [[-40, -30, -16], [40, -30, 14], [-40, 30, 12], [40, 30, -12], [0, 60, 10]];
        document.querySelectorAll<HTMLElement>(".c2-float li").forEach((el, i) => {
          stl.from(el, { x: `${fl[i][0]}vw`, y: `${fl[i][1]}vh`, rotate: fl[i][2], scale: 0.4, opacity: 0, duration: 0.7, ease: "power3.out" }, 0.1 + i * 0.1);
        });
        stl.fromTo(".c2-split-card", { y: 70, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" }, 0.8);
        stl.to({}, { duration: 0.5 }, 1.25);

        // numbers: the widgets fly in from the edges, the ring fills, the bars grow, the line draws
        const ntl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: ".c2-num", start: "top top", end: "+=190%", pin: ".c2-num-stage", scrub: 0.7, anticipatePin: 1 } });
        const fly: [string, number, number, number][] = [[".w-ring", -60, -40, -16], [".w-wave", 0, -70, 0], [".w-bars", 70, -45, 14], [".w-comm", -75, 10, -10], [".w-spec", 75, 15, 10], [".w-help", -60, 60, -8], [".w-hours", 60, 65, 8]];
        fly.forEach(([sel, x, y, r], i) => ntl.from(sel, { x: `${x}vw`, y: `${y}vh`, rotate: r, opacity: 0, scale: 0.7, duration: 0.5 }, i * 0.07));
        ntl.from(".c2-num-head", { y: 40, opacity: 0, duration: 0.4 }, 0);
        ntl.fromTo(".c2-ring-fg", { strokeDashoffset: 1 }, { strokeDashoffset: 0.12, duration: 0.6 }, 0.3);
        ntl.fromTo(".c2-bars i", { scaleY: 0 }, { scaleY: 1, transformOrigin: "50% 100%", stagger: 0.05, duration: 0.4 }, 0.35);
        ntl.fromTo(".w-wave path", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5 }, 0.25);
        ntl.fromTo(".w-help li i", { scale: 0 }, { scale: 1, stagger: 0.12, duration: 0.2 }, 0.55);
        ntl.to({}, { duration: 0.35 });
      });

      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
        const sp = SplitText.create(el, { type: "words,lines", mask: "lines" });
        splits.push(sp);
        gsap.from(sp.words, { yPercent: 115, duration: 1.1, ease: "expo.out", stagger: 0.05, scrollTrigger: enter(el, "top 88%") });
      });
      if (!window.matchMedia("(min-width: 64.0625rem) and (min-height: 600px)").matches) gsap.from(".c2-split-card", { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: enter(".c2-split-r", "top 60%") });
      gsap.from(".c2-form", { y: 80, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: enter(".c2-form", "top 90%") });
      gsap.from(".c2-foot-word", { yPercent: 40, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: enter(".c2-foot", "top 88%") });
      gsap.to(".c2-progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
      const re = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(re);
      window.addEventListener("load", re, { once: true });
    }, root);
    return () => {
      ctx.revert();
      mm.revert();
      splits.forEach((s) => s.revert());
      planST.current = null;
      gsap.ticker.remove(tick);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <div className="c2" ref={root}>
      <a href="#main" className="c2-skip">Skip to content</a>
      <div className="c2-progress" aria-hidden="true" />

      <header className="c2-nav">
        <div className="c2-nav-bar">
          <a href="#top" className="c2-logo" aria-label="ProCare Wellness Institute, home" onClick={goId("#top")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img decoding="async" src={`${BP}/c1/procare-logo-white.png`} alt="ProCare Wellness Institute, Regenerative and Aesthetic Medicine" width={480} height={135} />
          </a>
          <nav aria-label="Primary" className="c2-links" data-open={menu}>
            <a href="#plan" onClick={goId("#plan")}>Conditions</a>
            <a href="#intro" onClick={goId("#intro")}>Your team</a>
            <a href="#numbers" onClick={goId("#numbers")}>In numbers</a>
            <a href="#book" onClick={goId("#book")}>Book</a>
          </nav>
          <div className="c2-nav-act">
            <a href="#book" onClick={goId("#book")} className="c2-nav-cta">Book a visit</a>
            <a href={PHONE_TEL} className="c2-icon-btn" aria-label={`Call ${PHONE_DISPLAY}`}><Phone /></a>
            <button type="button" className="c2-icon-btn c2-burger" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu((m) => !m)}><i /><i /></button>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <Hero onPick={jumpPlan} goId={goId} />
        <Intro />
        <Plan bus={planBus} bookFor={bookFor} jump={jumpPlan} />
        <Split />
        <Numbers onBook={goId("#book")} />
        <Book bus={bookBus} />
      </main>

      <footer className="c2-foot">
        <div className="c2-foot-in">
          <div className="c2-foot-top">
            <div className="c2-foot-cta">
              <p className="c2-foot-ask">Ready to start your plan?</p>
              <div className="c2-foot-acts">
                <a href="#book" onClick={goId("#book")} className="c2-blue-pill">Book a visit</a>
                <a href={PHONE_TEL} className="c2-glass-pill">{PHONE_DISPLAY}</a>
              </div>
            </div>
            <div className="c2-foot-cols">
            <nav aria-label="Conditions"><h3>Conditions</h3><ul>{CONDITIONS.map((c, i) => <li key={c.id}><a href="#plan" onClick={(e) => { e.preventDefault(); jumpPlan(i); }}>{c.short}</a></li>)}</ul></nav>
            <div><h3>Visit</h3><p>{ADDRESS_LINE_1}<br />{ADDRESS_LINE_2}</p></div>
            <div><h3>Contact</h3><p><a href={PHONE_TEL}>{PHONE_DISPLAY}</a></p><ul><li><a href="https://www.instagram.com/procarewellnessinstitute/" target="_blank" rel="noreferrer">Instagram</a></li><li><a href="https://www.facebook.com/profile.php?id=100091856139219" target="_blank" rel="noreferrer">Facebook</a></li><li><a href="https://www.youtube.com/@ProCareWellnessInstitute" target="_blank" rel="noreferrer">YouTube</a></li></ul></div>
          </div>
          </div>
          <p className="c2-foot-word" aria-label="ProCare Wellness Institute">ProCare</p>
          <div className="c2-foot-legal">
            <p>© 2026 ProCare Wellness Institute, Savannah. Information on this site is for education and is not a diagnosis. Homepage concept for discussion.</p>
            <p>Photographs from Unsplash (Unsplash License) are stand-ins for ProCare’s own photography.</p>
          </div>
        </div>
      </footer>

      <div className="c2-mbar">
        <a href={PHONE_TEL} className="c2-glass-pill c2-mbar-call">Call</a>
        <a href="#book" onClick={goId("#book")} className="c2-blue-pill">Book a visit</a>
      </div>
    </div>
  );
}
