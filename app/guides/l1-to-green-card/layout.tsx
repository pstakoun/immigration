import { Metadata } from "next";

export const metadata: Metadata = {
  title: "L-1 Visa to Green Card Timeline 2026: EB-1C and PERM Guide",
  description:
    "Step-by-step guide for L-1A and L-1B visa holders to get a US green card, including the EB-1C multinational manager pathway and PERM-based EB-2/EB-3 routes.",
  keywords: [
    "L-1 to green card timeline 2026",
    "L1A EB-1C multinational manager",
    "L1B PERM green card",
    "intracompany transferee green card",
    "EB-1C requirements",
  ],
  alternates: {
    canonical: "/guides/l1-to-green-card",
  },
  openGraph: {
    title: "L-1 Visa to Green Card Timeline 2026: EB-1C and PERM Guide",
    description:
      "Step-by-step guide for L-1A and L-1B visa holders to get a US green card, including the EB-1C multinational manager pathway and PERM-based EB-2/EB-3 routes.",
    url: "https://stateside.app/guides/l1-to-green-card",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
