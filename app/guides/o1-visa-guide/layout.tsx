import { Metadata } from "next";

export const metadata: Metadata = {
  title: "O-1 Visa Guide 2026: Extraordinary Ability Visa and Green Card Paths",
  description:
    "Complete guide to the O-1 extraordinary ability visa — eligibility criteria, application process, and paths to a US green card through EB-1A and EB-2 NIW.",
  keywords: [
    "O-1 visa guide 2026",
    "O-1A extraordinary ability",
    "O-1 visa requirements tech",
    "O-1 to green card EB-1A",
    "O-1 vs H-1B comparison",
  ],
  alternates: {
    canonical: "/guides/o1-visa-guide",
  },
  openGraph: {
    title: "O-1 Visa Guide 2026: Extraordinary Ability Visa and Green Card Paths",
    description:
      "Complete guide to the O-1 extraordinary ability visa — eligibility criteria, application process, and paths to a US green card through EB-1A and EB-2 NIW.",
    url: "https://stateside.app/guides/o1-visa-guide",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
