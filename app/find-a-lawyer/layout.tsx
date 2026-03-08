import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find an Immigration Lawyer",
  description:
    "Connect with an immigration attorney who specializes in your visa type. Get personalized help with H-1B, TN, O-1, EB-2 NIW, PERM, and other US immigration cases.",
  alternates: {
    canonical: "https://stateside.app/find-a-lawyer",
  },
  openGraph: {
    title: "Find an Immigration Lawyer | Stateside",
    description:
      "Connect with an immigration attorney who specializes in your visa type. Get personalized help with your US immigration case.",
    url: "https://stateside.app/find-a-lawyer",
  },
};

export default function FindALawyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
