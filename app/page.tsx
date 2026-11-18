import Link from "next/link";

const concepts = [
  { href: "/concept-1/", name: "Concept 1", title: "Premium medical authority", note: "Cinematic scroll: the ProCare zoom, six specialties, the first visit.", ready: true },
  { href: "/hero-options/", name: "Hero options", title: "Three hero designs to choose from", note: "Calm centred, medical split, or photograph with a care card.", ready: true },
  { href: "", name: "Concept 2", title: "Patient-first, condition-based", note: "In progress", ready: false },
  { href: "", name: "Concept 3", title: "Interactive healthcare experience", note: "In progress", ready: false },
];

export default function Home() {
  return (
    <main className="min-h-svh bg-[#0a1d3a] px-6 py-16 text-[#f3f6f8] md:px-16 md:py-24">
      <h1 className="max-w-3xl text-4xl leading-tight font-medium md:text-6xl">ProCare Wellness Institute: homepage concepts</h1>
      <p className="mt-6 max-w-xl text-lg text-[#b9c7da]">Three directions for pcw.health, prepared for discussion.</p>
      <ul className="mt-16 grid gap-4 md:grid-cols-3">
        {concepts.map((c) => (
          <li key={c.name}>
            {c.ready ? (
              <Link
                href={c.href}
                className="block bg-[#132a4f] p-8 transition-colors hover:bg-[#1b3863] focus-visible:outline-3 focus-visible:outline-[#39b7b0]"
              >
                <span className="text-[#39b7b0]">{c.name}</span>
                <span className="mt-3 block text-2xl font-medium">{c.title}</span>
                <span className="mt-3 block text-[#b9c7da]">{c.note}</span>
              </Link>
            ) : (
              <div className="block bg-[#10223f] p-8 text-[#b9c7da]">
                <span>{c.name}</span>
                <span className="mt-3 block text-2xl font-medium text-[#f3f6f8]">{c.title}</span>
                <span className="mt-3 block">{c.note}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
