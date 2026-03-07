import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visa Bulletin Explained 2026: Priority Dates, Categories & How to Read It",
  description:
    "Learn how to read the monthly visa bulletin. Understand priority dates, Final Action Dates vs Dates for Filing, what Current means, and how it affects your green card timeline.",
  keywords: [
    "visa bulletin explained",
    "priority date immigration",
    "Final Action Date vs Dates for Filing",
    "visa bulletin retrogression",
    "EB-2 EB-3 priority date backlog",
  ],
  alternates: {
    canonical: "/guides/visa-bulletin-explained",
  },
  openGraph: {
    title: "Visa Bulletin Explained 2026: Priority Dates, Categories & How to Read It",
    description:
      "Learn how to read the monthly visa bulletin. Understand priority dates, Final Action Dates vs Dates for Filing, what Current means, and how it affects your green card timeline.",
    url: "https://stateside.app/guides/visa-bulletin-explained",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
