// Base path for GitHub Pages (empty locally).
export const BP = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Every fact below comes from pcw.health (read Nov 18, 2026). Items marked `confirm` need ProCare's sign-off.

export const PHONE_DISPLAY = "(912) 303-8996";
export const PHONE_TEL = "tel:+19123038996";
export const ADDRESS_LINE_1 = "340 Eisenhower Drive, Building 500";
export const ADDRESS_LINE_2 = "Savannah, GA 31406";
export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=340+Eisenhower+Drive+Building+500+Savannah+GA+31406";

export type Specialty = {
  id: string;
  name: string;
  short: string;
  treatments: string;
  summary: string;
  conditions: string[];
  href: string;
  image: string;
  alt: string;
  confirm?: string;
};

// The six clinical specialties lead; wellness and aesthetics follow as a line of their own.
export const SPECIALTIES: Specialty[] = [
  {
    id: "joint",
    name: "Joint and orthopedic pain",
    short: "Joint pain",
    treatments: "Hyaluronic acid injections, PRP, shockwave therapy, guided imaging, bracing",
    summary: "Knee, hip and shoulder pain, arthritis, and tendon and ligament injuries, treated without surgery.",
    conditions: ["Knee pain", "Hip pain", "Osteoarthritis", "Rotator cuff", "ACL and MCL tears", "Plantar fasciitis"],
    href: "https://pcw.health/hyaluronic-acid-injections-for-knee-pain/",
    image: `${BP}/c1/joint.jpg`,
    alt: "A clinician fitting a wrist brace on a patient's arm",
  },
  {
    id: "neuropathy",
    name: "Neuropathy and nerve pain",
    short: "Neuropathy",
    treatments: "Electroanalgesic therapy, neuromodulation",
    summary: "Numbness, tingling and burning in the hands and feet, treated with drug-free electroanalgesic therapy.",
    conditions: ["Diabetic neuropathy", "Peripheral neuropathy", "Post-chemo neuropathy", "Sciatica"],
    href: "https://pcw.health/peripheral-neuropathy/",
    image: `${BP}/c1/neuropathy.webp`,
    alt: "An older woman smiling as she shapes a ceramic bowl with her hands",
  },
  {
    id: "wound",
    name: "Advanced wound care",
    short: "Wound care",
    treatments: "Amniotic membrane therapy, red light therapy",
    summary: "Ulcers, burns, surgical wounds and chronic wounds that will not heal, with a plan to close them.",
    conditions: ["Diabetic ulcers", "Pressure ulcers", "Venous stasis ulcers", "Post-surgical wounds"],
    href: "https://pcw.health/wound-care-services/",
    image: `${BP}/c1/wound.jpg`,
    alt: "A clinician's gloved hands, ready to dress a wound",
  },
  {
    id: "spine",
    name: "Spine and chronic pain",
    short: "Spine and back",
    treatments: "Injections, regenerative therapies, physical therapy",
    summary: "Back pain, sciatica, disc disease and spinal stenosis, managed without surgery wherever possible.",
    conditions: ["Back pain", "Degenerative disc disease", "Spinal stenosis", "Carpal tunnel"],
    href: "https://pcw.health/health-conditions/",
    image: `${BP}/c1/spine-duo.jpg`,
    alt: "An illustration of the spine and the nerves branching from it",
  },
  {
    id: "vascular",
    name: "Vascular and circulation",
    short: "Circulation",
    treatments: "Assessed with your wound and pain care",
    summary: "Circulation problems that show up in the legs and feet, including venous and arterial ulcers.",
    conditions: ["Venous ulcers", "Arterial ulcers", "Leg swelling"],
    href: "https://pcw.health/wound-care-services/",
    image: `${BP}/c1/vascular.jpg`,
    alt: "A clinician taking an older woman's blood pressure",
    confirm: "Vascular service line: scope to confirm with ProCare",
  },
  {
    id: "regenerative",
    name: "Regenerative recovery",
    short: "Recovery",
    treatments: "Platelet-rich plasma, peptide therapy",
    summary: "PRP and peptide therapy to support healing after injury or surgery.",
    conditions: ["Post-surgical recovery", "Sports injuries", "Tendonitis"],
    href: "https://pcw.health/pain-management-and-recovery/",
    image: `${BP}/c1/injection.jpg`,
    alt: "A clinician giving an older woman an injection in the upper arm",
  },
];

export const ALSO = [
  { label: "Wellness and hormones", href: "https://pcw.health/health-and-wellness-services/" },
  { label: "Medical weight loss", href: "https://pcw.health/medical-weight-loss/" },
  { label: "Aesthetics", href: "https://pcw.health/cosmetic-aesthetic-services/" },
  { label: "Telemedicine", href: "https://pcw.health/telemedicine/" },
];

export const STAGE_IMAGES = SPECIALTIES.map((s) => s.image);

// Roles as listed on pcw.health/meet-the-team. Lines describe the role, not a named person.
export const TEAM = [
  { role: "Physicians", line: "Diagnose your condition and lead your treatment plan." },
  { role: "Physician Assistants", line: "Examine, treat and follow up alongside the physicians." },
  { role: "Nurse Practitioners", line: "Assess, treat and manage your ongoing care." },
  { role: "Wound Care Specialists", line: "Care for ulcers, burns and wounds that will not heal." },
  { role: "Physical Therapists", line: "Rebuild strength, on site and remotely." },
  { role: "Wellness Coaches", line: "Guide the weekly wellness programs." },
];

// Real figures from pcw.health: six clinical specialties, six clinical roles, 13 communities served, a 40 to 60 minute first visit.
export const FIGURES = [
  { value: 6, label: "clinical specialties, one building" },
  { value: 6, label: "kinds of clinician on your team" },
  { value: 13, label: "Savannah-area communities served" },
  { value: 60, prefix: "40–", label: "minute first visit, start to plan" },
];

export const JOURNEY = [
  { title: "Call or request a visit", line: "Same-day urgent appointments are available.", image: "", alt: "" },
  { title: "Arrive 15 minutes early", line: "Bring medical records, your insurance card and loose clothing.", image: `${BP}/c1/consult.jpg`, alt: "A bright, quiet clinic lounge with a palm and green armchairs" },
  { title: "Meet your provider", line: "40 to 60 minutes: an assessment and your non-surgical options.", image: `${BP}/c1/team.jpg`, alt: "Two clinicians reviewing a patient's imaging together on a screen" },
  { title: "Leave with a plan", line: "Insurance checked, costs explained, the next visit booked.", image: `${BP}/c1/wellness.webp`, alt: "A smiling couple in workout clothes outdoors, holding a yoga mat" },
];

export const STEPS = [
  { title: "Call or request a visit", line: "Same-day urgent appointments are available." },
  { title: "Arrive 15 minutes early", line: "Bring medical records, your insurance card and loose clothing." },
  { title: "Meet your provider", line: "40 to 60 minutes: an assessment and your non-surgical options." },
  { title: "Leave with a plan", line: "Insurance checked, costs explained, the next visit booked." },
];

// Verbatim from pcw.health/testimonials.
export const QUOTES = {
  main: {
    text: "This treatment is already changing my life, I’m able to work out again and feel the strength in my shoulder and arm again.",
    name: "Tristen C.",
  },
  more: [
    {
      text: "The nurse was patient and answered all my questions and really took the time to explain everything in detail and give me options.",
      name: "Crystal",
    },
    {
      text: "Appoint[ment] was made within one week of calling. No wait time. The nurse practitioner was personable.",
      name: "Shannon",
    },
  ],
};

export const FAQ = [
  ["Will insurance cover my treatment?", "Coverage depends on your plan, so benefits are verified at your first visit. Medicare and major insurers cover much of the non-surgical knee care."],
  ["What if I don’t have insurance?", "Cash payment and payment plans are available, and the staff go through costs with you before treatment."],
  ["Do you treat my condition?", "ProCare treats musculoskeletal and nerve conditions, back, joint and sports injuries, and wounds. If you are unsure, call and ask."],
  ["Which wounds do you treat?", "Diabetic, pressure, venous stasis and arterial ulcers, burns, surgical wounds and chronic wounds that are not healing."],
  ["Are wound treatments painful?", "Most are minimally invasive and well tolerated. Some discomfort can occur, and the care team works to keep it low."],
  ["What if I need to cancel?", "Please let the office know at least 24 hours ahead if you are ill or have an emergency."],
];

export const HOURS: { day: string; idx: number; open?: [number, number] }[] = [
  { day: "Monday", idx: 1, open: [9, 17] },
  { day: "Tuesday", idx: 2, open: [9, 19] },
  { day: "Wednesday", idx: 3, open: [9, 17] },
  { day: "Thursday", idx: 4, open: [9, 17] },
  { day: "Friday", idx: 5 },
  { day: "Saturday", idx: 6 },
  { day: "Sunday", idx: 0 },
];

export const AREAS = [
  "Savannah", "Richmond Hill", "Pooler", "Garden City", "Port Wentworth", "Tybee Island", "Pembroke",
  "Bloomingdale", "Thunderbolt", "Vernonburg", "Springfield", "Rincon", "Guyton",
];

export const CREDITS =
  "Photographs: Fountain in Forsyth Park, Savannah, by Carol M. Highsmith, Library of Congress, public domain. Clinical and lifestyle photographs: Unsplash (Unsplash License), stand-ins for ProCare’s own photography. Neuropathy and spine images: pcw.health.";

// Conditions named on pcw.health, for the scroll-driven strips.
export const MARQUEE = [
  ["Knee pain", "Sciatica", "Diabetic neuropathy", "Rotator cuff", "Plantar fasciitis", "Arthritis", "Tennis elbow"],
  ["Pressure ulcers", "Spinal stenosis", "Carpal tunnel", "Venous ulcers", "Post-surgical wounds", "Hip pain", "Nerve pain"],
];
