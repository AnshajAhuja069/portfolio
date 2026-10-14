import type { Metadata } from "next";
import { ResumePage } from "@/components/resume/ResumePage";

export const metadata: Metadata = {
  title: "Resume",
  alternates: { canonical: "/resume" },
  description:
    "Anshaj Ahuja’s journey from Christ University to Chief Product Officer at Gamersberg: product, UX and frontend engineering, with the full resume as a PDF.",
};

export default function Resume() {
  return <ResumePage />;
}
