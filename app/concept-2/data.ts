import { BP } from "../concept-1/content";

// Facts come from pcw.health (read Nov 18, 2026). Symptom lines describe common signs in plain words;
// they are prompts for a conversation, not a diagnosis. Items marked `confirm` need ProCare's sign-off.

export const IMG = (p: string) => `${BP}/${p}`;
export const THUMB = (p: string) => `${BP}/thumb/${p.replace("/", "-").replace(/\.\w+$/, ".jpg")}`;

export type Condition = {
  id: string;
  name: string;
  short: string;
  plain: string;
  ask: string;
  pos: string;
  img: string;
  alt: string;
  keywords: string[];
  symptoms: string[];
  what: string;
  treatments: { name: string; line: string }[];
  team: string[];
  book: string;
  href: string;
  confirm?: string;
};

export const CONDITIONS: Condition[] = [
  {
    id: "joint",
    name: "Joint and orthopedic pain",
    short: "Joint pain",
    plain: "Knees, hips and shoulders that ache, stiffen or give way.",
    ask: "My knees, hips or shoulders hurt",
    pos: "50% 62%",
    img: "c2/joint.jpg",
    alt: "An older woman resting her hand on her knee",
    keywords: ["knee", "hip", "shoulder", "joint", "arthritis", "stiff", "acl", "mcl", "rotator", "tendon", "ligament", "plantar", "heel", "elbow", "sports"],
    symptoms: ["Knee pain on stairs or after sitting", "Stiff joints in the morning", "Hip or shoulder pain that wakes you", "An old sports injury that never settled", "You have been told surgery is the next step"],
    what: "Wear, injury or inflammation in a joint, its cartilage or the tendons and ligaments around it.",
    treatments: [
      { name: "Hyaluronic acid injections", line: "A gel that cushions the knee joint." },
      { name: "Platelet-rich plasma", line: "Your own platelets, placed where healing is needed." },
      { name: "Shockwave therapy", line: "Sound waves for tendon and heel pain." },
      { name: "Guided imaging and bracing", line: "Precise placement and support." },
    ],
    team: ["Physicians", "Physician Assistants", "Physical Therapists"],
    book: "Joint and orthopedic pain",
    href: "https://pcw.health/hyaluronic-acid-injections-for-knee-pain/",
  },
  {
    id: "neuropathy",
    name: "Neuropathy and nerve-related symptoms",
    short: "Nerve pain",
    plain: "Numbness, tingling or burning in the hands and feet.",
    ask: "My hands or feet are numb or burning",
    pos: "62% 50%",
    img: "c2/nerve.jpg",
    alt: "Bare feet in strong window light",
    keywords: ["numb", "tingl", "burn", "nerve", "neuropathy", "pins", "needles", "feet", "foot", "hands", "diabet", "chemo", "balance", "sciatica"],
    symptoms: ["Numbness in your feet or hands", "Pins and needles that come and go", "Burning feet, worse at night", "Feeling unsteady on your feet", "You live with diabetes"],
    what: "Damaged or irritated nerves, often linked to diabetes, chemotherapy or pressure on a nerve.",
    treatments: [
      { name: "Electroanalgesic therapy", line: "A drug-free electrical nerve treatment." },
      { name: "Neuromodulation", line: "Calming how the nerves send pain signals." },
    ],
    team: ["Physicians", "Nurse Practitioners"],
    book: "Neuropathy and nerve pain",
    href: "https://pcw.health/peripheral-neuropathy/",
  },
  {
    id: "wound",
    name: "Chronic or non-healing wounds",
    short: "Wounds",
    plain: "A sore, ulcer or surgical wound that will not close.",
    ask: "I have a wound that will not heal",
    pos: "50% 45%",
    img: "c2/wound.jpg",
    alt: "A hand wrapped in a white bandage",
    keywords: ["wound", "ulcer", "sore", "heal", "pressure", "bed sore", "burn", "surgical", "scar", "diabetic foot", "skin"],
    symptoms: ["A wound that has not healed in weeks", "A sore on the foot, with diabetes", "A pressure sore", "A surgical wound that is slow to close", "Redness, swelling or drainage around a wound"],
    what: "Wounds that stall in healing, often because of circulation, diabetes or pressure.",
    treatments: [
      { name: "Amniotic membrane therapy", line: "A thin graft that helps a wound close." },
      { name: "Red light therapy", line: "Light that supports tissue repair." },
      { name: "Wound care plan", line: "Dressings and visits, set out step by step." },
    ],
    team: ["Wound Care Specialists", "Nurse Practitioners", "Physicians"],
    book: "Advanced wound care",
    href: "https://pcw.health/wound-care-services/",
  },
  {
    id: "pain",
    name: "Pain management",
    short: "Back and chronic pain",
    plain: "Back, neck and long-lasting pain that limits your day.",
    ask: "My back or neck pain will not go away",
    pos: "50% 40%",
    img: "c2/pain.jpg",
    alt: "A woman in a park holding her lower back",
    keywords: ["back", "neck", "spine", "disc", "stenosis", "sciatica", "chronic", "pain", "carpal", "wrist", "recovery", "injury", "surgery"],
    symptoms: ["Lower back pain that keeps coming back", "Pain running down one leg", "Neck pain or stiffness", "Pain that stops you doing what you love", "Slow recovery after an injury or surgery"],
    what: "Pain from the spine, discs, nerves or soft tissue that has lasted for weeks or months.",
    treatments: [
      { name: "Targeted injections", line: "Relief placed at the source." },
      { name: "Regenerative therapies", line: "PRP and peptides to support healing." },
      { name: "Physical therapy", line: "On site, or remotely from home." },
    ],
    team: ["Physicians", "Physical Therapists", "Physician Assistants"],
    book: "Spine and chronic pain",
    href: "https://pcw.health/pain-management-and-recovery/",
  },
  {
    id: "vascular",
    name: "Vascular concerns",
    short: "Circulation",
    plain: "Swollen, heavy legs and circulation problems in the feet.",
    ask: "My legs are swollen or feel heavy",
    pos: "50% 55%",
    img: "c2/vascular.jpg",
    alt: "A person's bare legs resting on a wooden floor",
    keywords: ["swell", "swollen", "leg", "ankle", "vein", "vascular", "circulation", "heavy", "cold feet", "varicose", "venous", "arterial"],
    symptoms: ["Swollen legs or ankles", "Legs that feel heavy or tired", "Skin changes on the lower legs", "A sore near the ankle", "Cold feet or toes"],
    what: "Blood flow problems in the veins or arteries of the legs, which can slow healing.",
    treatments: [
      { name: "Circulation assessment", line: "Checked alongside your wound and pain care." },
      { name: "Venous and arterial ulcer care", line: "Treated by the wound care team." },
    ],
    team: ["Physicians", "Wound Care Specialists"],
    book: "Vascular and circulation",
    href: "https://pcw.health/wound-care-services/",
    confirm: "Vascular service line: scope to confirm with ProCare",
  },
];

// "Not sure?" guide: three plain questions, each answer nudges toward a condition.
export const GUIDE = [
  {
    q: "Where do you feel it most?",
    a: [
      { label: "Knee, hip or shoulder", w: { joint: 3 } },
      { label: "Feet or hands", w: { neuropathy: 3, vascular: 1 } },
      { label: "Back or neck", w: { pain: 3 } },
      { label: "Legs or ankles", w: { vascular: 3, wound: 1 } },
      { label: "On my skin, a wound", w: { wound: 4 } },
    ],
  },
  {
    q: "What does it feel like?",
    a: [
      { label: "Aching or stiff", w: { joint: 2, pain: 1 } },
      { label: "Numb, tingling or burning", w: { neuropathy: 3 } },
      { label: "Sharp or shooting", w: { pain: 2, neuropathy: 1 } },
      { label: "Swollen or heavy", w: { vascular: 3 } },
      { label: "Open, sore or not healing", w: { wound: 3 } },
    ],
  },
  {
    q: "How long has it been going on?",
    a: [
      { label: "A few weeks", w: {} },
      { label: "A few months", w: { pain: 1, joint: 1 } },
      { label: "More than a year", w: { pain: 1, neuropathy: 1 } },
    ],
  },
] as { q: string; a: { label: string; w: Record<string, number> }[] }[];
