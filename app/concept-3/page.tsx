import type { Metadata } from "next";
import Concept3 from "./Concept3";
import "./c3.css";

export const metadata: Metadata = {
  title: "ProCare Wellness Institute | Tap where it hurts",
  description:
    "Explore joint, nerve, wound, back and circulation care on an interactive body map, see how ProCare treats each one without surgery, and book a visit in Savannah, GA.",
};

export default function Page() {
  return <Concept3 />;
}
