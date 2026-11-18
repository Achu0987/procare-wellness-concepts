import type { Metadata } from "next";
import HeroOptions from "./HeroOptions";
import "./ho.css";

export const metadata: Metadata = {
  title: "ProCare Wellness Institute | Hero options",
  description: "Three hero designs for the ProCare Wellness Institute homepage, to choose one direction.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <HeroOptions />;
}
