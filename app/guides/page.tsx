import type { Metadata } from "next";
import Link from "next/link";
import { GuidesIndexInteractive } from "@/components/GuideInteractiveWidgets";

const title = "US Immigration Guides: Timelines for H-1B, TN, EB-2 NIW, and PERM";
const description = "Server-rendered immigration guides with detailed step-by-step explanations and live timeline widgets for H-1B to green card, TN to green card, EB-2 NIW, and PERM labor certification.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "immigration guides",
    "green card timeline 2026",
    "h1b to green card timeline",
    "tn to green card process",
    "eb2 niw timeline",
    "perm labor certification",
    "priority date backlog",
  ],
  openGraph: {
    title,
    description,
    url: "https://stateside.app/guides",
    type: "website",
  },
  alternates: {
    canonical: "/guides",
  },
};

export default function GuidesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">Immigration Guides</h1>
        <p className="text-gray-700 leading-relaxed mb-3">
          These employment-based immigration guides explain what happens at each stage of the process,
          what can slow a case down, and how to plan around visa bulletin backlogs. Because this page is
          server-rendered, search engines can read the full text immediately before JavaScript loads.
        </p>
        <p className="text-gray-700 leading-relaxed">
          If you are comparing the fastest path to a green card in 2026, start with the guide that matches your
          current status, then open the live timeline widget to estimate processing times by country of birth.
        </p>
      </header>

      <section className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-5">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">What You&apos;ll Find in These Guides</h2>
        <ul className="space-y-2 text-gray-700">
          <li>Detailed step-by-step breakdowns for PERM, I-140, priority date wait, and I-485.</li>
          <li>Country-specific timeline estimates for India, China, and most other countries.</li>
          <li>Practical planning notes for travel, job changes, dependents, and status extensions.</li>
          <li>Internal links between paths so you can compare tradeoffs quickly.</li>
        </ul>
      </section>

      <GuidesIndexInteractive />

      <section className="mt-10 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Popular Starting Points</h2>
        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          <Link href="/guides/h1b-to-green-card" className="rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">
            H-1B to Green Card Timeline Guide
          </Link>
          <Link href="/guides/tn-to-green-card" className="rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">
            TN to Green Card (Dual Intent Strategy)
          </Link>
          <Link href="/guides/eb2-niw" className="rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">
            EB-2 NIW Self-Petition Guide
          </Link>
          <Link href="/guides/perm-process" className="rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">
            PERM Labor Certification Deep Dive
          </Link>
        </div>
      </section>

      <section className="mt-8 text-gray-700 leading-relaxed">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Need a Personalized Estimate?</h2>
        <p className="mb-4">
          Use the calculator to match your education, work history, and visa status against all available paths.
          You can then compare those personalized results against the detailed explanations in each guide.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-5 py-2.5 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors"
        >
          See your timeline →
        </Link>
      </section>
    </div>
  );
}
