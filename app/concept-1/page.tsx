import type { Metadata } from "next";
import Concept1 from "./Concept1";
import "./c1.css";

export const metadata: Metadata = {
  title: "ProCare Wellness Institute | Non-surgical specialty care in Savannah, GA",
  description:
    "Joint pain, neuropathy, advanced wound care and chronic pain, treated without surgery by one multidisciplinary team at 340 Eisenhower Drive, Savannah.",
};

export default function Page() {
  return <Concept1 />;
}
