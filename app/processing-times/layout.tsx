import { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Processing Times",
  description:
    "Live USCIS processing times, DOL PERM timelines, and visa bulletin priority dates. Updated daily.",
  openGraph: {
    title: "Processing Times",
    description: "Live USCIS and DOL processing times, updated daily.",
  },
};

export default function ProcessingTimesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
