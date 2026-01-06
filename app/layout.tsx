import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://stateside.app"),
  title: {
    default: "Stateside - Your Path to US Immigration",
    template: "%s | Stateside",
  },
  description:
    "Interactive guide to US immigration. Explore visa pathways, green card timelines, and citizenship options with live USCIS data.",
  keywords: [
    "US immigration",
    "green card",
    "H-1B visa",
    "TN visa",
    "USCIS",
    "visa timeline",
    "immigration pathways",
    "work visa",
    "EB-1",
    "EB-2",
    "EB-3",
  ],
  authors: [{ name: "Stateside" }],
  creator: "Stateside",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stateside.app",
    siteName: "Stateside",
    title: "Stateside - Your Path to US Immigration",
    description:
      "Interactive guide to US immigration. Explore visa pathways, green card timelines, and citizenship options with live USCIS data.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stateside - Your Path to US Immigration",
    description:
      "Interactive guide to US immigration. Explore visa pathways, green card timelines, and citizenship options with live USCIS data.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
