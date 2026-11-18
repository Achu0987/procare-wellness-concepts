"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ADDRESS_LINE_1, BP, HOURS, PHONE_DISPLAY, PHONE_TEL, SPECIALTIES } from "../concept-1/content";

function useOpen() {
  const [s, setS] = useState<{ text: string; open: boolean } | null>(null);
  useEffect(() => {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "numeric", hour12: false }).formatToParts(new Date());
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.find((p) => p.type === "weekday")?.value ?? "");
    const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
    const today = HOURS.find((d) => d.idx === day);
    if (today?.open && h >= today.open[0] && h < today.open[1]) setS({ text: `Open today until ${today.open[1] - 12} pm`, open: true });
    else setS({ text: "Mon to Thu, 9 am to 5 pm (Tue to 7 pm)", open: false });
  }, []);
  return s;
}

const rise = (d = 0) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay: d, ease: [0.16, 1, 0.3, 1] as const } });

function Nav({ dark = false }: { dark?: boolean }) {
  return (
    <div className="ho-nav" data-dark={dark}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${BP}/c1/procare-logo-color.png`} alt="ProCare Wellness Institute" width={480} height={135} className="ho-logo" />
      <nav className="ho-links" aria-label="Sample navigation">
        <a href="#a">Specialties</a>
        <a href="#a">Your first visit</a>
        <a href="#a">Patients</a>
        <a href="#a">About</a>
      </nav>
      <div className="ho-nav-act">
        <a href={PHONE_TEL} className="ho-tel">
          {PHONE_DISPLAY}
        </a>
        <a href="#a" className="ho-btn ho-btn-primary ho-btn-sm">
          Book a visit
        </a>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function HeroOptions() {
  const open = useOpen();
  const [find, setFind] = useState("");

  return (
    <div className="ho">
      <header className="ho-intro">
        <h1>ProCare homepage: three hero options</h1>
        <p>Each option is a complete first screen. Pick the one that feels right, and the whole site will be built in that style.</p>
        <ul>
          <li><a href="#a">A. Calm centred</a></li>
          <li><a href="#b">B. Medical premium split</a></li>
          <li><a href="#c">C. Photograph with a care card</a></li>
        </ul>
      </header>

      {/* ================= Option A: calm, centred, Apple-like ================= */}
      <section className="ho-opt" id="a" aria-labelledby="ha">
        <p className="ho-tag">Option A · Calm centred</p>
        <div className="ho-frame ho-a">
          <Nav />
          <div className="ho-a-text">
            <motion.p className="ho-pill" {...rise(0)}>
              <span className="ho-dot" data-open={open?.open ?? false} aria-hidden="true" />
              {open?.text ?? "Savannah, Georgia"}
            </motion.p>
            <motion.h2 id="ha" className="ho-a-h" {...rise(0.1)}>
              Specialist care for pain, nerves and wounds, without surgery.
            </motion.h2>
            <motion.p className="ho-a-lead" {...rise(0.2)}>
              Six specialties and one experienced team, under one roof in Savannah.
            </motion.p>
            <motion.div className="ho-actions ho-center" {...rise(0.3)}>
              <a href="#a" className="ho-btn ho-btn-primary">
                Book a consultation <Arrow />
              </a>
              <a href={PHONE_TEL} className="ho-btn ho-btn-quiet">
                Call {PHONE_DISPLAY}
              </a>
            </motion.div>
          </div>
          <motion.figure
            className="ho-a-photo"
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${BP}/c1/consult.jpg`} alt="A bright, calm clinic lounge with a palm and green armchairs" width={2000} height={1348} />
            <div className="ho-chip ho-chip-1">
              <strong>Same-day</strong>
              <span>urgent appointments</span>
            </div>
            <div className="ho-chip ho-chip-2">
              <strong>Insurance</strong>
              <span>verified at your first visit</span>
            </div>
            <div className="ho-chip ho-chip-3">
              <strong>Building 500</strong>
              <span>{ADDRESS_LINE_1.replace(", Building 500", "")}</span>
            </div>
          </motion.figure>
        </div>
      </section>

      {/* ================= Option B: medical premium split ================= */}
      <section className="ho-opt" id="b" aria-labelledby="hb">
        <p className="ho-tag">Option B · Medical premium split</p>
        <div className="ho-frame ho-b">
          <Nav />
          <div className="ho-b-grid">
            <div className="ho-b-text">
              <motion.p className="ho-pill" {...rise(0)}>
                <span className="ho-dot" data-open={open?.open ?? false} aria-hidden="true" />
                {open?.text ?? "Savannah, Georgia"}
              </motion.p>
              <motion.h2 id="hb" className="ho-b-h" {...rise(0.1)}>
                Get back to the life you love, without surgery.
              </motion.h2>
              <motion.p className="ho-b-lead" {...rise(0.2)}>
                ProCare treats joint pain, neuropathy and wounds that won’t heal, with physicians, nurse practitioners and
                wound care specialists in one Savannah practice.
              </motion.p>
              <motion.div className="ho-actions" {...rise(0.3)}>
                <a href="#b" className="ho-btn ho-btn-primary">
                  Book a consultation <Arrow />
                </a>
                <a href={PHONE_TEL} className="ho-btn ho-btn-quiet">
                  {PHONE_DISPLAY}
                </a>
              </motion.div>
              <motion.ul className="ho-b-facts" {...rise(0.4)}>
                <li><strong>40–60 min</strong> first visit</li>
                <li><strong>Same-day</strong> urgent care</li>
                <li><strong>Payment plans</strong> available</li>
              </motion.ul>
            </div>
            <motion.figure
              className="ho-b-photo"
              initial={{ opacity: 0, clipPath: "inset(8% 8% 8% 8% round 28px)" }}
              animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 28px)" }}
              transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BP}/c1/golf.jpg`} alt="A man swinging a golf club on a green course" width={1600} height={1067} />
            </motion.figure>
          </div>
          <motion.ul className="ho-b-spec" {...rise(0.5)}>
            {SPECIALTIES.map((s) => (
              <li key={s.id}>
                <a href="#b">
                  <span>{s.name}</span>
                  <Arrow />
                </a>
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ================= Option C: photograph with a care card ================= */}
      <section className="ho-opt" id="c" aria-labelledby="hc">
        <p className="ho-tag">Option C · Photograph with a care card</p>
        <div className="ho-frame ho-c">
          <Nav />
          <div className="ho-c-stage">
            <motion.figure className="ho-c-photo" initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BP}/c1/team.jpg`} alt="A clinician explaining imaging results to a colleague" width={2000} height={1333} />
            </motion.figure>
            <motion.div
              className="ho-c-card"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="ho-pill ho-pill-plain">
                <span className="ho-dot" data-open={open?.open ?? false} aria-hidden="true" />
                {open?.text ?? "Savannah, Georgia"}
              </p>
              <h2 id="hc" className="ho-c-h">Relief starts with the right specialist.</h2>
              <p className="ho-c-lead">Non-surgical care for joint pain, neuropathy and hard-to-heal wounds in Savannah.</p>
              <form
                className="ho-find"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <label htmlFor="ho-find">What do you need help with?</label>
                <div className="ho-find-row">
                  <select id="ho-find" value={find} onChange={(e) => setFind(e.target.value)}>
                    <option value="" disabled>
                      Choose a concern
                    </option>
                    {SPECIALTIES.map((s) => (
                      <option key={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <button type="submit" className="ho-btn ho-btn-primary">
                    Find care
                  </button>
                </div>
              </form>
              <p className="ho-c-call">
                Prefer to talk? <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="ho-foot">
        <p>Photographs are stand-ins for ProCare’s own photography. Design options for discussion.</p>
      </footer>
    </div>
  );
}
