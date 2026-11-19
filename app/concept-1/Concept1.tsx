"use client";

import { memo, useCallback, useEffect, useRef, useState, type MutableRefObject } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import type { WalkDriver } from "./Walk3D";

const Walk3D = dynamic(() => import("./Walk3D"), { ssr: false });
import { ADDRESS_LINE_1, ADDRESS_LINE_2, ALSO, AREAS, BP, FAQ, FIGURES, FINDER, HOURS, MAPS_URL, PHONE_DISPLAY, PHONE_TEL, QUOTES, SPECIALTIES, TEAM } from "./content";

const IMG = (n: string) => `${BP}/c2img/${n}`;
// 200px versions for the little round thumbnails
const THUMB = (src: string) => src.replace(/\/(c1|c2img)\/([^/]+?)\.\w+$/, "/thumb/$1-$2.jpg");

// The six specialties, told as what each one is for (aims, not promises).
const CARE = [
  { id: "joint", label: "Joint and orthopedic pain", title: "Ease knee, hip and shoulder pain without surgery.", img: IMG("physio-knee.jpg"), alt: "A physical therapist working on a patient's knee" },
  { id: "neuropathy", label: "Neuropathy and nerve pain", title: "Calm the numbness and burning in hands and feet.", img: IMG("foot-care.jpg"), alt: "A clinician's hands treating a patient's foot on a clinic bed" },
  { id: "wound", label: "Advanced wound care", title: "A clear plan for wounds that will not heal.", img: `${BP}/c1/wound.jpg`, alt: "A clinician's gloved hands, ready to dress a wound" },
  { id: "spine", label: "Spine and chronic pain", title: "Options for back pain, sciatica and stiffness.", img: IMG("spine-care.jpg"), alt: "A clinician's hands treating a patient's upper back" },
  { id: "vascular", label: "Vascular and circulation", title: "Circulation care for tired, swollen legs and feet.", img: IMG("checkup.jpg"), alt: "A physician checking an older man's blood pressure" },
  { id: "regenerative", label: "Regenerative recovery", title: "Heal well after an injury or surgery.", img: IMG("strength.jpg"), alt: "A therapist guiding a patient through a strength exercise" },
];


// Three plain points per specialty: what it is, how ProCare treats it, what to expect.
const POINTS: [string, string][][] = [
  [["What we treat", "Knee, hip and shoulder pain, arthritis, tendon and ligament injuries"], ["How", "Hyaluronic acid injections, PRP and shockwave therapy"], ["The aim", "Guided imaging and bracing, without surgery"]],
  [["What we treat", "Numbness, tingling and burning in the hands and feet"], ["How", "Drug-free electroanalgesic therapy and neuromodulation"], ["The aim", "Calmer nerves for diabetic, peripheral and post-chemo neuropathy"]],
  [["What we treat", "Diabetic, pressure and venous ulcers, burns and surgical wounds"], ["How", "Amniotic membrane therapy and red light therapy"], ["The aim", "Lower infection risk, grow new tissue, close the wound"]],
  [["What we treat", "Back pain, sciatica, disc disease and spinal stenosis"], ["How", "Injections, regenerative therapies and physical therapy"], ["The aim", "Manage it without surgery wherever possible"]],
  [["What we treat", "Circulation problems that show up in the legs and feet"], ["How", "Assessed together with your wound and pain care"], ["The aim", "Care for venous and arterial ulcers in one plan"]],
  [["What we treat", "Recovery after an injury or surgery"], ["How", "Platelet-rich plasma and peptide therapy"], ["The aim", "Physical therapy on site and remotely to rebuild strength"]],
];

// The walk through Building 500: each room, what happens in it. Photographs are stand-ins for ProCare's own rooms.
const WALK = [
  { room: "Front desk", side: -1, img: `${BP}/c1/consult.jpg`, lead: "Check in, settle in. We take care of the paperwork.", points: ["Arrive 15 minutes early", "Bring your records, insurance card and loose clothing", "Insurance benefits checked for you"] },
  { room: "Consultation", side: 1, img: `${BP}/c1/team.jpg`, lead: "Your provider listens first, then examines.", points: ["A 40 to 60 minute assessment", "Imaging and records reviewed together", "Your non-surgical options explained"] },
  { room: "Treatment room", side: -1, img: IMG("spine-care.jpg"), lead: "Where joint, spine and nerve pain is treated.", points: ["Hyaluronic acid and PRP injections", "Shockwave therapy and guided imaging", "Electroanalgesic therapy for neuropathy"] },
  { room: "Wound care suite", side: 1, img: `${BP}/c1/wound.jpg`, lead: "A clear plan for wounds that will not heal.", points: ["Diabetic, pressure and venous ulcers", "Amniotic membrane therapy", "Red light therapy"] },
  { room: "Therapy and recovery", side: -1, img: IMG("strength.jpg"), lead: "Rebuild strength, here or from home.", points: ["Physical therapy, on site or remote", "Strength and mobility plans", "PRP and peptide therapy for recovery"] },
];

const WALK_END = IMG("garden.jpg");

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

// The care tabs keep their own state, so the pinned scroll only re-renders this block.
const CareTabs = memo(function CareTabs({ bus, bookFor }: { bus: MutableRefObject<(i: number, n: number) => void>; bookFor: (v: string) => void }) {
  const [care, setCare] = useState(0);
  const [pts, setPts] = useState(3);
  useEffect(() => {
    bus.current = (i, n) => { setCare(i); setPts(n); };
    return () => { bus.current = () => {}; };
  }, [bus]);
  return (
            <div className="container pc-tx">
              <div className="pc-tx-tabs" role="tablist" aria-label="Specialties">
                {CARE.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={care === i}
                    className="pc-tx-tab"
                    onClick={() => { setCare(i); setPts(3); }}
                  >
                    <span className="pc-tx-thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img decoding="async" src={THUMB(c.img)} alt="" width={96} height={96} loading="lazy" />
                    </span>
                    <span className="pc-tx-name">{SPECIALTIES[i].short}</span>
                  </button>
                ))}
                <span className="pc-tx-ind" aria-hidden="true" style={{ transform: `translateX(${care * 100}%)` }} />
              </div>

              <div className="pc-tx-panel" role="tabpanel" aria-label={CARE[care].label}>
                <div className="pc-tx-media">
                  {CARE.map((c, i) => (
                    <figure key={c.id} className="pc-tx-img" data-on={care === i}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img decoding="async" src={c.img} alt={care === i ? c.alt : ""} width={1600} height={1100} loading="lazy" />
                    </figure>
                  ))}
                  <span className="pc-tx-count num">{String(care + 1).padStart(2, "0")} / 06</span>
                </div>
                <div className="pc-tx-body" key={CARE[care].id}>
                  <p className="pc-care-label"><Cross /> {CARE[care].label}</p>
                  <h3 className="pc-tx-title">{CARE[care].title}</h3>
                  <ol className="pc-tx-points">
                    {POINTS[care].map(([k, v], j) => (
                      <li key={k} data-on={j < pts}>
                        <span className="pc-tx-check" aria-hidden="true">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                        </span>
                        <span className="pc-tx-k">{k}</span>
                        <span className="pc-tx-v">{v}</span>
                      </li>
                    ))}
                  </ol>
                  {SPECIALTIES[care].confirm && <p className="pc-confirm">{SPECIALTIES[care].confirm}</p>}
                  <div className="pc-care-links">
                    <button type="button" className="pc-btn pc-btn-primary" onClick={() => bookFor(SPECIALTIES[care].name)}>
                      Book for {SPECIALTIES[care].short.toLowerCase()} <Arrow size={16} />
                    </button>
                    <a href={SPECIALTIES[care].href} target="_blank" rel="noreferrer" className="pc-link">Learn more</a>
                  </div>
                </div>
              </div>
            </div>
  );
});

// The walk's room card and room map, re-rendered on their own as the camera moves.
const WalkHud = memo(function WalkHud({ bus, onJump }: { bus: MutableRefObject<(i: number) => void>; onJump: (i: number) => void }) {
  const [walk, setWalk] = useState(-1);
  useEffect(() => {
    bus.current = (i) => setWalk(i);
    return () => { bus.current = () => {}; };
  }, [bus]);
  return (
    <>
            {walk >= 0 && walk < WALK.length && (
              <div className="pc-walk-card" data-side={WALK[walk].side} key={walk}>
                <p className="pc-walk-card-n"><span className="num">{String(walk + 1).padStart(2, "0")}</span> / {String(WALK.length).padStart(2, "0")}</p>
                <h3>{WALK[walk].room}</h3>
                <p className="pc-walk-card-lead">{WALK[walk].lead}</p>
                <ul>
                  {WALK[walk].points.map((p) => (
                    <li key={p}>
                      <span aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg></span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <nav className="pc-walk-map" aria-label="Rooms in the walk-through">
              {WALK.map((r, i) => (
                <button
                  key={r.room}
                  type="button"
                  data-on={walk === i}
                  data-past={walk > i}
                  onClick={() => onJump(i)}
                >
                  <i />
                  <span>{r.room}</span>
                </button>
              ))}
            </nav>
    </>
  );
});

export default function Concept1() {
  const [concern, setConcern] = useState("");
  const [note, setNote] = useState(false);
  const [mega, setMega] = useState(false);
  const walkST = useRef<ScrollTrigger | null>(null);
  const walkDriver = useRef<WalkDriver>({ t: 0, kick: () => {} });
  const careBus = useRef<(i: number, n: number) => void>(() => {});
  const walkBus = useRef<(i: number) => void>(() => {});
  const bookRef = useRef<(v: string) => void>(() => {});
  const bookStable = useCallback((v: string) => bookRef.current(v), []);
  const walkJump = useCallback((i: number) => {
    const st = walkST.current;
    if (!st) return;
    const y = st.start + ((i + 1) / (WALK.length + 1)) * (st.end - st.start);
    if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  }, []);
  const status = useOpenStatus();
  const root = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    root.current?.classList.add("js");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = (t: number) => lenisRef.current?.raf(t * 1000);
    if (!reduce) {
      const lenis = new Lenis({ lerp: 0.12, smoothWheel: true, wheelMultiplier: 1 });
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
        // The centre card is laid out full-screen and scaled down (FLIP), so the opening is transform-only.
        const fan = document.querySelector<HTMLElement>(".pc-fan");
        const fanCard = document.querySelector<HTMLElement>(".pc-fan-center");
        const fanInner = document.querySelector<HTMLElement>(".pc-fan-inner");
        const fanSpacer = document.querySelector<HTMLElement>(".pc-fan-spacer");
        const fanPin = document.querySelector<HTMLElement>(".pc-fan-pin");
        const fanP = { v: 0 };
        let fsx = 0.3, fsy = 0.74, fdx = 0, fdy = 0;
        const fanMeasure = () => {
          if (!fanSpacer || !fanPin) return;
          const s = fanSpacer.getBoundingClientRect(), p = fanPin.getBoundingClientRect();
          fsx = s.width / p.width; fsy = s.height / p.height;
          fdx = s.left + s.width / 2 - (p.left + p.width / 2);
          fdy = s.top + s.height / 2 - (p.top + p.height / 2);
        };
        const fanApply = (v: number) => {
          if (!fanCard || !fanInner) return;
          const a = fsx + (1 - fsx) * v, b = fsy + (1 - fsy) * v;
          const net = (fsy + (1 - fsy) * v) * (1.15 - 0.15 * v);
          const r = 28 * (1 - v);
          fanCard.style.transform = `translate3d(${fdx * (1 - v)}px, ${fdy * (1 - v)}px, 0) scale(${a}, ${b})`;
          fanCard.style.borderRadius = `${r / a}px / ${r / b}px`;
          fanInner.style.transform = `scale(${net / a}, ${net / b})`;
        };
        const fanRefresh = () => { fanMeasure(); fanApply(fanP.v); };
        if (desktop && fan) {
          fan.classList.add("is-zoom");
          fanMeasure();
          fanApply(0);
          ScrollTrigger.addEventListener("refresh", fanRefresh);
        }
        if (desktop) {
          gsap
            .timeline({ scrollTrigger: { trigger: ".pc-fan", start: "top top", end: "+=140%", pin: ".pc-fan-pin", scrub: 0.4, anticipatePin: 1 } })
            .to(".pc-fan-side-l", { xPercent: -140, rotate: -10, opacity: 0, ease: "power2.in", duration: 0.5 }, 0)
            .to(".pc-fan-side-r", { xPercent: 140, rotate: 10, opacity: 0, ease: "power2.in", duration: 0.5 }, 0)
            .fromTo(fanP, { v: 0 }, { v: 1, ease: "power2.inOut", duration: 0.7, onUpdate: () => fanApply(fanP.v) }, 0.1)
            .fromTo(".pc-fan-over", { opacity: 0, y: 50 }, { opacity: 1, y: 0, ease: "power3.out", duration: 0.3 }, 0.62)
            .fromTo(".pc-fan-chip", { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.25 }, 0.72);
        }

        // Specialties: the section holds while each panel opens in turn.
        if (desktop) {
          ScrollTrigger.create({
            trigger: ".pc-acc-pin",
            start: "top top",
            end: () => "+=" + window.innerHeight * 0.85 * CARE.length,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const pos = self.progress * CARE.length;
              const i = Math.min(CARE.length - 1, Math.floor(pos));
              const local = Math.min(0.999, pos - i);
              const n = Math.min(3, 1 + Math.floor(local * 3.6));
              careBus.current(i, n);
            },
          });
        }

        // The walk: the camera moves down the corridor of Building 500, pausing at each room.
        // The 3D scene (Walk3D, WebGL) reads the progress; the timeline only moves the text overlays.
        if (desktop && document.querySelector(".pc-walk-stage")) {
          const segs = WALK.length + 1;
          const wt = gsap.timeline({
            scrollTrigger: {
              trigger: ".pc-walk",
              start: "top top",
              end: () => "+=" + window.innerHeight * 1.1 * segs,
              pin: ".pc-walk-stage",
              scrub: true,
              anticipatePin: 1,
              onUpdate: (self) => {
                const t = self.progress * segs;
                walkDriver.current.t = t;
                walkDriver.current.kick();
                const i = t < 0.5 ? -1 : Math.min(WALK.length, Math.round(t) - 1);
                walkBus.current(i);
              },
            },
          });
          walkST.current = wt.scrollTrigger ?? null;
          wt.to(".pc-walk-intro", { autoAlpha: 0, scale: 0.94, duration: 0.22, ease: "power2.in" }, 0);
          wt.to(".pc-walk-door-l", { xPercent: -102, duration: 0.5, ease: "power2.inOut" }, 0.08);
          wt.to(".pc-walk-door-r", { xPercent: 102, duration: 0.5, ease: "power2.inOut" }, 0.08);
          wt.set(".pc-walk-doors", { autoAlpha: 0 }, 0.6);
          wt.from(".pc-walk-map", { y: 40, opacity: 0, duration: 0.25, ease: "power2.out" }, 0.4);
          wt.fromTo(".pc-walk-end-in", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, WALK.length + 0.7);
          wt.to({}, { duration: 0.001 }, segs);
        }

        // First visit: four cards run sideways.
        const track = document.querySelector<HTMLElement>(".pc-steps-track");
        if (desktop && track) {
          const dist = () => track.scrollWidth - track.clientWidth + 0;
          gsap.to(track, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: { trigger: ".pc-steps", start: "top top+=60", end: () => `+=${dist()}`, pin: true, scrub: 0.4, invalidateOnRefresh: true },
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
          .from(desktop ? ".pc-fan-card:not(.pc-fan-center)" : ".pc-fan-card", { y: 160, opacity: 0, rotate: (i) => (desktop ? [-8, -4, 4, 8] : [-8, -4, 0, 4, 8])[i] ?? 0, duration: 1.6, stagger: 0.08 }, 0.55)
          .from(desktop ? ".pc-fan-center" : [], { opacity: 0, duration: 1.4 }, 0.7);

        /* ===== Entrances and scrubs ===== */
        gsap.to(".pc-progress-top", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          const sp = SplitText.create(el, { type: "lines,words", mask: "lines", linesClass: "pc-mask" });
          splits.push(sp);
          gsap.from(sp.words, { yPercent: 115, duration: 1.15, ease: "expo.out", stagger: 0.04, scrollTrigger: enter(el, "top 88%") });
        });

        const fill = SplitText.create(".pc-intro-text", { type: "words" });
        splits.push(fill);
        gsap.fromTo(fill.words, { opacity: 0.18 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: ".pc-intro-text", start: "top 80%", end: "bottom 55%", scrub: true } });

        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const o = { v: 0 };
          gsap.to(o, { v: Number(el.dataset.count), duration: 1.8, ease: "power2.out", onUpdate: () => { el.textContent = String(Math.round(o.v)); }, scrollTrigger: enter(el, "top 92%") });
        });
        // The bento: each tile tips up out of the page, its picture drifting inside.
        gsap.from(".pc-tile", { y: 120, rotateX: 18, opacity: 0, transformPerspective: 1200, transformOrigin: "50% 100%", duration: 1.3, ease: "expo.out", stagger: 0.09, scrollTrigger: enter(".pc-bento", "top 85%") });
        gsap.utils.toArray<HTMLElement>(".pc-tile-bg img, .pc-tile-thumb img").forEach((img) => {
          gsap.fromTo(img, { yPercent: -8, scale: 1.18 }, { yPercent: 8, scale: 1.18, ease: "none", scrollTrigger: { trigger: img.closest(".pc-tile"), start: "top bottom", end: "bottom top", scrub: true } });
        });
        gsap.from(".pc-tile-dots i", { scale: 0, opacity: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.06, scrollTrigger: enter(".pc-tile-e", "top 85%") });

        gsap.from(".pc-tx-tab", { y: 40, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.06, scrollTrigger: enter(".pc-tx", "top 92%") });
        gsap.from(".pc-tx-panel", { y: 100, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: enter(".pc-tx", "top 85%") });

        // The venn: two circles meet in one plan.
        gsap.fromTo(".pc-venn-a", { xPercent: -40, opacity: 0 }, { xPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".pc-venn", start: "top 85%", end: "center 55%", scrub: true } });
        gsap.fromTo(".pc-venn-b", { xPercent: 40, opacity: 0 }, { xPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".pc-venn", start: "top 85%", end: "center 55%", scrub: true } });
        gsap.from(".pc-venn-core", { scale: 0.6, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: enter(".pc-venn", "top 45%") });
        gsap.from(".pc-role", { y: 30, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.06, scrollTrigger: enter(".pc-roles", "top 90%") });

        // Back to life: pictures drift at different depths.
        gsap.utils.toArray<HTMLElement>(".pc-life-img").forEach((el, i) => {
          gsap.fromTo(el, { yPercent: [18, -12, 26, -6][i % 4] }, { yPercent: [-18, 12, -26, 6][i % 4], ease: "none", scrollTrigger: { trigger: ".pc-life", start: "top bottom", end: "bottom top", scrub: true } });
        });

        // The real-site layers: finder, directory, treatments, banners.
        gsap.from(".pc-finder-in > *", { y: 40, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, scrollTrigger: enter(".pc-finder", "top 92%") });
        gsap.from(".pc-finder-chip", { y: 24, opacity: 0, scale: 0.9, duration: 0.8, ease: "back.out(1.8)", stagger: 0.05, scrollTrigger: enter(".pc-finder", "top 88%") });
        gsap.utils.toArray<HTMLElement>(".pc-banner").forEach((el) => {
          const img = el.querySelector(".pc-banner-bg img");
          if (img) gsap.fromTo(img, { yPercent: -10, scale: 1.2 }, { yPercent: 10, scale: 1.2, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
          gsap.from(el.querySelectorAll(".pc-banner-in > *"), { y: 50, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.09, scrollTrigger: enter(el, "top 80%") });
          gsap.fromTo(el, { scale: 0.94 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 40%", scrub: true } });
        });

        gsap.from(".pc-area-chip", { y: 20, opacity: 0, duration: 0.7, ease: "expo.out", stagger: 0.035, scrollTrigger: enter(".pc-areas-chips", "top 90%") });

        gsap.from(".pc-quote", { y: 80, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.12, scrollTrigger: enter(".pc-quotes", "top 85%") });
        gsap.from(".pc-faq-item", { y: 30, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.06, scrollTrigger: enter(".pc-faq-list", "top 90%") });
        gsap.from(".pc-book-card", { y: 100, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: enter(".pc-book-card", "top 92%") });
        gsap.from(".pc-foot-logo", { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: enter(".pc-foot", "top 92%") });

        const re = () => ScrollTrigger.refresh();
        document.fonts?.ready.then(re);
        window.addEventListener("load", re, { once: true });
        return () => {
          ScrollTrigger.removeEventListener("refresh", fanRefresh);
          fan?.classList.remove("is-zoom");
          if (fanCard) { fanCard.style.transform = ""; fanCard.style.borderRadius = ""; }
          if (fanInner) fanInner.style.transform = "";
        };
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
    setMega(false);
    scrollTo("#book");
  };
  bookRef.current = bookFor;
  const goMega = (id: string) => (e: React.MouseEvent) => {
    setMega(false);
    go(id)(e);
  };
  useEffect(() => {
    if (!mega) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setMega(false); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [mega]);

  return (
    <div className="pc" ref={root}>
      <a href="#main" className="pc-skip">Skip to content</a>
      <div className="pc-progress-top" aria-hidden="true" />

      <div className="pc-topbar">
        <div className="pc-topbar-in">
          <a href={MAPS_URL} target="_blank" rel="noreferrer" className="pc-topbar-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
            {ADDRESS_LINE_1}, {ADDRESS_LINE_2}
          </a>
          <span className="pc-topbar-item pc-topbar-hours">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
            Mon, Wed, Thu 9 am to 5 pm, Tue 9 am to 7 pm
          </span>
          <span className="pc-topbar-item pc-topbar-hi">Same-day urgent appointments available</span>
          <a href={PHONE_TEL} className="pc-topbar-item pc-topbar-tel">Call {PHONE_DISPLAY}</a>
        </div>
      </div>

      <header className="pc-nav" onMouseLeave={() => setMega(false)}>
        <div className="pc-nav-bar">
          <a href="#top" className="pc-logo" aria-label="ProCare Wellness Institute, home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img decoding="async" src={`${BP}/c1/procare-logo-color.png`} alt="ProCare Wellness Institute, Regenerative and Aesthetic Medicine" width={480} height={135} />
          </a>
          <nav aria-label="Primary" className="pc-nav-links">
            <button
              type="button"
              className="pc-nav-mega-btn"
              aria-expanded={mega}
              aria-controls="pc-mega"
              onClick={() => setMega((m) => !m)}
              onMouseEnter={() => setMega(true)}
            >
              What we treat
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <a href="#first-visit" onClick={go("#first-visit")} onMouseEnter={() => setMega(false)}>First visit</a>
            <a href="#team" onClick={go("#team")} onMouseEnter={() => setMega(false)}>Our team</a>
            <a href="#insurance" onClick={go("#insurance")} onMouseEnter={() => setMega(false)}>Insurance</a>
          </nav>
          <div className="pc-nav-act">
            <a href={PHONE_TEL} className="pc-nav-tel">{PHONE_DISPLAY}</a>
            <a href="#book" onClick={go("#book")} className="pc-btn pc-btn-primary pc-btn-sm">Book a visit</a>
          </div>
        </div>

        <div className="pc-mega" id="pc-mega" data-open={mega} hidden={!mega}>
          <div className="pc-mega-grid">
            {SPECIALTIES.map((s, i) => (
              <div key={s.id} className="pc-mega-col">
                <a href="#care" className="pc-mega-head" onClick={(e) => { careBus.current(i, 3); goMega("#care")(e); }}>
                  <span className="pc-mega-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img decoding="async" src={THUMB(CARE[i].img)} alt="" width={96} height={96} loading="lazy" />
                  </span>
                  {s.short}
                </a>
                <ul>
                  {s.conditions.slice(0, 4).map((c) => (
                    <li key={c}><button type="button" onClick={() => bookFor(s.name)}>{c}</button></li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="pc-mega-side">
              <p className="pc-mega-side-h">Also in Building 500</p>
              <ul>
                {ALSO.map((a) => (
                  <li key={a.label}><a href={a.href} target="_blank" rel="noreferrer">{a.label}</a></li>
                ))}
              </ul>
              <a href={PHONE_TEL} className="pc-mega-call">
                <span>Not sure where you fit?</span>
                <strong>{PHONE_DISPLAY}</strong>
              </a>
            </div>
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
                <img decoding="async" src={IMG("garden.jpg")} alt="Two older women tending a flowering garden" width={2000} height={1333} />
              </figure>
              <figure className="pc-fan-card pc-fan-side-l">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img decoding="async" src={IMG("couple-laugh.jpg")} alt="An older couple laughing together outdoors" width={2000} height={1333} />
              </figure>
              <i className="pc-fan-spacer" aria-hidden="true" />
              <figure className="pc-fan-card pc-fan-center">
                <div className="pc-fan-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img decoding="async" src={IMG("marsh-walk.jpg")} alt="An older couple walking along a boardwalk through marsh grass" width={2000} height={1333} fetchPriority="high" />
                <div className="pc-fan-over">
                  <p className="pc-fan-big">Back on the boardwalk, back in the garden, back to you.</p>
                  <ul className="pc-fan-chips">
                    <li className="pc-fan-chip"><strong>Same-day</strong> urgent visits</li>
                    <li className="pc-fan-chip"><strong>Insurance</strong> checked at your first visit</li>
                    <li className="pc-fan-chip"><strong>Building 500</strong> {ADDRESS_LINE_1.replace(", Building 500", "")}</li>
                  </ul>
                </div>
                </div>
              </figure>
              <figure className="pc-fan-card pc-fan-side-r">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img decoding="async" src={IMG("physio-knee.jpg")} alt="A physical therapist working on a patient's knee" width={2000} height={1333} />
              </figure>
              <figure className="pc-fan-card pc-fan-side-r pc-fan-far">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img decoding="async" src={IMG("coast.jpg")} alt="An older couple sharing a kiss on a windy beach" width={2000} height={1333} />
              </figure>
            </div>
          </div>
        </section>

        {/* ===== Quick finder: say what hurts, get to the right team ===== */}
        <section className="pc-finder" aria-labelledby="pc-finder-h">
          <div className="pc-finder-in">
            <div className="pc-finder-text">
              <h2 id="pc-finder-h">What brings you in today?</h2>
              <p>Pick the closest match and we will route you to the right specialist.</p>
            </div>
            <ul className="pc-finder-chips">
              {FINDER.map((f) => (
                <li key={f.label}>
                  <button type="button" className="pc-finder-chip" onClick={() => bookFor(f.spec)}>
                    {f.label} <Arrow size={14} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="pc-finder-or">
              <span>Or talk to a person</span>
              <a href={PHONE_TEL} className="pc-finder-tel">{PHONE_DISPLAY}</a>
            </div>
          </div>
        </section>

        {/* ===== What ProCare does, in one sentence ===== */}
        <section className="pc-intro" aria-labelledby="pc-intro-h">
          <div className="container">
            <div className="pc-intro-head">
              <h2 id="pc-intro-h" data-split>One place for the care you need.</h2>
              <p className="pc-intro-text">
                Physicians, nurse practitioners, wound care specialists and physical therapists work together in one Savannah building, so your pain is treated as one plan, not three referrals.
              </p>
            </div>
            <ul className="pc-bento">
              <li className="pc-tile pc-tile-photo pc-tile-a">
                <figure className="pc-tile-bg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img decoding="async" src={IMG("physio-knee.jpg")} alt="" width={1600} height={1000} loading="lazy" />
                </figure>
                <span className="pc-tile-num num"><span data-count={6}>6</span></span>
                <span className="pc-tile-label">clinical specialties under one roof</span>
                <span className="pc-tile-list">Joint pain · Neuropathy · Wound care · Spine · Circulation · Recovery</span>
              </li>
              <li className="pc-tile pc-tile-photo pc-tile-b">
                <figure className="pc-tile-bg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img decoding="async" src={`${BP}/c1/forsyth.jpg`} alt="" width={1600} height={1200} loading="lazy" />
                </figure>
                <span className="pc-tile-num num"><span data-count={13}>13</span></span>
                <span className="pc-tile-label">Savannah-area communities served</span>
              </li>
              <li className="pc-tile pc-tile-teal pc-tile-c">
                <svg className="pc-tile-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                <span className="pc-tile-word">Same-day</span>
                <span className="pc-tile-label">urgent appointments available</span>
              </li>
              <li className="pc-tile pc-tile-white pc-tile-d">
                <figure className="pc-tile-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img decoding="async" src={IMG("clinic-talk.jpg")} alt="" width={800} height={600} loading="lazy" />
                </figure>
                <span className="pc-tile-num num">40–<span data-count={60}>60</span></span>
                <span className="pc-tile-label">minute first visit, from assessment to plan</span>
              </li>
              <li className="pc-tile pc-tile-lilac pc-tile-e">
                <span className="pc-tile-num num"><span data-count={6}>6</span></span>
                <span className="pc-tile-label">kinds of clinician on one team</span>
                <span className="pc-tile-dots" aria-hidden="true">
                  {["MD", "PA", "NP", "WC", "PT", "WL"].map((d) => (
                    <i key={d}>{d}</i>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* ===== What we treat: a held picture, six stories ===== */}
        <section className="pc-care" id="care" aria-labelledby="pc-care-h">
          <div className="pc-acc-pin">
            <div className="container pc-acc-head">
              <h2 id="pc-care-h" data-split>What we treat</h2>
              <p className="pc-head-lead">Six specialties under one roof. Open yours, then book for exactly that.</p>
            </div>
            <CareTabs bus={careBus} bookFor={bookStable} />
          </div>
          <div className="container">
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

        {/* ===== Walk through Building 500: a 3D corridor, room by room ===== */}
        <section className="pc-walk" id="inside" aria-labelledby="pc-walk-h">
          <div className="pc-walk-stage">
            <div className="pc-walk-view">
              <Walk3D rooms={WALK} endImg={WALK_END} driver={walkDriver} />
            </div>

            {/* the entrance: two glass doors that slide open as the visit begins */}
            <div className="pc-walk-doors" aria-hidden="true">
              <i className="pc-walk-door pc-walk-door-l"><b /></i>
              <i className="pc-walk-door pc-walk-door-r"><b /></i>
            </div>
            <div className="pc-walk-intro">
              <p className="pc-walk-kicker">340 Eisenhower Drive, Building 500</p>
              <h2 id="pc-walk-h">Step inside Building 500.</h2>
              <p className="pc-walk-sub">Take a 1-minute walk through your first visit, room by room.</p>
              <span className="pc-walk-cue"><span className="pc-walk-hint" aria-hidden="true"><i /></span> Scroll to open the doors</span>
            </div>

            <WalkHud bus={walkBus} onJump={walkJump} />

            <div className="pc-walk-end">
              <div className="pc-walk-end-in">
                <h3>And then, back to your life.</h3>
                <div className="pc-banner-act">
                  <a href="#book" onClick={go("#book")} className="pc-btn pc-btn-white pc-btn-lg">Book your first visit</a>
                  <a href={PHONE_TEL} className="pc-btn pc-btn-ghost pc-btn-lg">Call {PHONE_DISPLAY}</a>
                </div>
              </div>
            </div>

            <p className="pc-walk-note">Photographs are stand-ins for ProCare’s own rooms.</p>
          </div>

          {/* Phones, reduced motion and no script: the same rooms as a list */}
          <div className="container pc-walk-list">
            <h2 className="pc-walk-list-h">Step inside Building 500.</h2>
            <ol>
              {WALK.map((r, i) => (
                <li key={r.room}>
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img decoding="async" src={r.img} alt="" width={800} height={540} loading="lazy" />
                  </figure>
                  <div>
                    <p className="pc-walk-card-n"><span className="num">{String(i + 1).padStart(2, "0")}</span> {r.room}</p>
                    <p className="pc-walk-card-lead">{r.lead}</p>
                    <ul>
                      {r.points.map((p) => (<li key={p}>{p}</li>))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
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
                        <img decoding="async" src={s.img} alt="" width={1600} height={1100} loading="lazy" />
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

        {/* ===== Banner: same-day care ===== */}
        <section className="pc-banner pc-banner-urgent" aria-labelledby="pc-urgent-h">
          <figure className="pc-banner-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img decoding="async" src={IMG("clinic-care.jpg")} alt="" width={2000} height={1333} loading="lazy" />
          </figure>
          <div className="pc-banner-in">
            <p className="pc-banner-tag"><span className="pc-live-dot" aria-hidden="true" /> Same-day urgent appointments</p>
            <h2 id="pc-urgent-h">In pain today? Call us today.</h2>
            <p className="pc-banner-lead">A new wound, a flare of nerve pain or an injury that cannot wait. Call the front desk and we will find you a time.</p>
            <div className="pc-banner-act">
              <a href={PHONE_TEL} className="pc-btn pc-btn-white pc-btn-lg">Call {PHONE_DISPLAY}</a>
              <a href="#book" onClick={go("#book")} className="pc-btn pc-btn-ghost pc-btn-lg">Request a call back</a>
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
                <img decoding="async" src={IMG(n)} alt="" width={1200} height={800} loading="lazy" />
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

        {/* ===== Banner: insurance and costs ===== */}
        <section className="pc-ins" id="insurance" aria-labelledby="pc-ins-h">
          <div className="container pc-ins-grid">
            <div className="pc-banner pc-ins-photo">
              <figure className="pc-banner-bg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img decoding="async" src={IMG("consult.jpg")} alt="" width={1600} height={1100} loading="lazy" />
              </figure>
              <div className="pc-banner-in">
                <p className="pc-banner-tag">Insurance and costs</p>
                <h2 id="pc-ins-h">No surprises on cost.</h2>
              </div>
            </div>
            <ul className="pc-ins-cards">
              <li>
                <strong>Benefits checked first</strong>
                <span>Your coverage is verified at your first visit, before treatment starts.</span>
              </li>
              <li>
                <strong>Medicare and major insurers</strong>
                <span>Much of the non-surgical knee care is covered. We confirm what your plan pays.</span>
              </li>
              <li>
                <strong>Cash and payment plans</strong>
                <span>No insurance? Costs are explained up front, with payment plans available.</span>
              </li>
              <li>
                <strong>Telemedicine</strong>
                <span>Some follow-ups can happen from home. <a href="https://pcw.health/telemedicine/" target="_blank" rel="noreferrer" className="pc-link">How it works</a></span>
              </li>
            </ul>
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

        {/* ===== Banner: where we are, who we serve ===== */}
        <section className="pc-banner pc-areas-band" aria-labelledby="pc-areas-h">
          <figure className="pc-banner-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img decoding="async" src={`${BP}/c1/forsyth.jpg`} alt="" width={2000} height={1400} loading="lazy" />
          </figure>
          <div className="pc-banner-in pc-areas-in">
            <div>
              <p className="pc-banner-tag">Proudly Savannah</p>
              <h2 id="pc-areas-h">Care close to home, across the Coastal Empire.</h2>
              <a href={MAPS_URL} target="_blank" rel="noreferrer" className="pc-areas-addr">
                <strong>{ADDRESS_LINE_1}</strong>
                <span>{ADDRESS_LINE_2}</span>
                <span className="pc-areas-dir">Get directions <Arrow size={14} /></span>
              </a>
            </div>
            <ul className="pc-areas-chips" aria-label="Communities we serve">
              {AREAS.map((a) => (
                <li key={a} className="pc-area-chip">{a}</li>
              ))}
            </ul>
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
          </div>
        </section>
      </main>

      <footer className="pc-foot">
        <div className="container">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img decoding="async" src={`${BP}/c1/procare-logo-white.png`} alt="ProCare Wellness Institute" width={480} height={135} className="pc-foot-logo" />
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
