import { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Immigration Guides",
  description:
    "Practical guides for US immigration pathways including H-1B, L-1, O-1, and TN visa to green card, EB-2 NIW, PERM labor certification, and visa bulletin priority dates.",
};

export default function GuidesLayout({
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
