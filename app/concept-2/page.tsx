import type { Metadata } from "next";
import Concept2 from "./Concept2";
import "./c2.css";

export const metadata: Metadata = {
  title: "ProCare Wellness Institute | Find the right care for what you are feeling",
  description:
    "Joint pain, nerve pain, non-healing wounds, back pain and circulation concerns: find your condition, see how ProCare treats it and book in Savannah, GA.",
};

export default function Page() {
  return <Concept2 />;
}
