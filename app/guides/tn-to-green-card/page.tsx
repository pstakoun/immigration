import type { Metadata } from "next";
import Link from "next/link";
import { TNGuideInteractive } from "@/components/GuideInteractiveWidgets";

const pageTitle = "TN to Green Card Timeline 2026: Dual Intent and PERM Strategy";
const pageDescription = "Detailed TN to green card guide for Canadian and Mexican professionals, including dual intent risk, PERM workflow, I-140, visa bulletin wait, and I-485 timing.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      "TN to green card timeline 2026",
      "TN visa dual intent",
      "Canadian TN green card",
      "Mexican TN green card",
      "PERM for TN holders",
      "TN to H1B strategy",
      "I-485 travel advance parole",
    ],
    alternates: {
      canonical: "/guides/tn-to-green-card",
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: "https://stateside.app/guides/tn-to-green-card",
      type: "article",
    },
  };
}

export default function TNToGreenCardGuide() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      <Link href="/guides" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All guides
      </Link>

      <article className="max-w-3xl space-y-7">
        <header>
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">TN to Green Card Timeline (2026 Guide)</h1>
          <p className="text-gray-700 leading-relaxed mb-3">
            The TN to green card process is possible, but it needs careful sequencing because TN status does not
            formally provide dual intent the way H-1B does. Many Canadian and Mexican professionals transition
            successfully each year by planning timing, travel, and filing milestones before immigrant intent becomes
            visible.
          </p>
          <p className="text-gray-700 leading-relaxed">
            This guide explains the full TN-to-green-card pathway, including when to stay on TN, when to consider an
            H-1B bridge strategy, and how PERM, I-140, and I-485 timing decisions affect border risk.
          </p>
        </header>

        <TNGuideInteractive />

        <section className="space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-semibold text-gray-900">Step-by-Step TN Green Card Process</h2>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 1: Choose a Filing Strategy</h3>
            <p>
              Before paperwork starts, decide whether you will remain on TN through PERM/I-140 or first move to H-1B.
              Staying on TN can work if international travel is limited and case execution is disciplined. Switching to
              H-1B can reduce intent friction because H-1B explicitly allows immigrant intent.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 2: PERM Labor Certification</h3>
            <p>
              Your employer runs prevailing wage, recruitment, and PERM filing like any EB-2/EB-3 case. This stage can
              easily run beyond a year and may include audit delays. During this period, maintain clean TN renewals and
              avoid unnecessary signals that suggest immediate permanent intent at the border.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 3: I-140 and Priority Date Queue</h3>
            <p>
              After PERM approval, file I-140 quickly. Once approved, monitor visa bulletin movement for your category
              and country of birth. This waiting period can be short for many applicants and significantly longer for
              backlogged chargeability areas.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 4: I-485 Filing and Post-Filing Travel Rules</h3>
            <p>
              Filing I-485 marks explicit immigrant intent. After that point, travel should usually be coordinated via
              approved Advance Parole. TN holders should review post-filing entry options carefully because reentry on
              TN after intent has crystallized can be complex.
            </p>
          </div>
        </section>

        <section className="space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-semibold text-gray-900">Common Questions for TN Holders</h2>
          <p>
            <strong className="text-gray-900">Is TN to green card legal?</strong> Yes. The challenge is not legality,
            but timing and evidence of intent at specific moments such as border entry, renewal, or consular activity.
          </p>
          <p>
            <strong className="text-gray-900">Should I stop traveling internationally?</strong> Not always, but frequent
            border crossings during sensitive filing windows increase scrutiny risk. Many applicants deliberately reduce
            nonessential trips until filing strategy is stable.
          </p>
          <p>
            <strong className="text-gray-900">Can I stay on TN the whole time?</strong> Many people do, especially when
            timelines are manageable and case prep is strong. Others prefer H-1B for clearer dual intent treatment.
          </p>
          <p>
            <strong className="text-gray-900">What about dependents on TD?</strong> Dependents usually mirror the same
            strategic constraints; after I-485 filing, derivative planning around work/travel documents becomes critical.
          </p>
        </section>

        <section className="space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-semibold text-gray-900">Tips and Considerations</h2>
          <ul className="space-y-2">
            <li>Document job duties consistently across TN filings and permanent labor certification materials.</li>
            <li>Align filing windows with travel calendars to lower unexpected port-of-entry issues.</li>
            <li>Prepare employer HR teams for long-run case management; PERM timelines can drift.</li>
            <li>Consider a backup path like <Link href="/guides/eb2-niw" className="text-brand-600 hover:text-brand-700">EB-2 NIW</Link> if you have strong independent credentials.</li>
            <li>Check <Link href="/processing-times" className="text-brand-600 hover:text-brand-700">live processing data</Link> monthly instead of relying on old averages.</li>
          </ul>
        </section>

        <section className="pt-6 border-t border-gray-200 space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Related Guides</h2>
          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <Link href="/guides/h1b-to-green-card" className="rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">H-1B to Green Card Timeline</Link>
            <Link href="/guides/perm-process" className="rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">PERM Process Deep Dive</Link>
            <Link href="/guides/eb2-niw" className="rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">EB-2 NIW Alternative Route</Link>
            <Link href="/guides" className="rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">See All Immigration Guides</Link>
          </div>
        </section>

        <section className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors"
          >
            Build your personalized timeline →
          </Link>
        </section>
      </article>
    </div>
  );
}
