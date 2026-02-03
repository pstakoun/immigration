import { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Immigration Processing Times",
  description:
    "Live USCIS and DOL processing times for I-140, I-485, PERM, and visa bulletin priority dates. Updated automatically from official sources.",
};

export default function ProcessingTimesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 bg-white">{children}</main>
      <SiteFooter />
    </div>
  );
}
