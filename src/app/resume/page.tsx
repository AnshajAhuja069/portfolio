import type { Metadata } from "next";
import { ResumePage } from "@/components/resume/ResumePage";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Anshaj Ahuja’s journey as a product designer and UX engineer, from Christ University to Gamersberg, with the full resume as a PDF.",
};

export default function Resume() {
  return <ResumePage />;
}
