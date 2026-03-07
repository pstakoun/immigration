import type { Metadata } from "next";
import Link from "next/link";
import { H1BGuideInteractive } from "@/components/GuideInteractiveWidgets";

const pageTitle = "H-1B to Green Card Timeline 2026: Step-by-Step EB-2/EB-3 Guide";
const pageDescription = "Comprehensive H-1B to green card guide covering PERM, I-140, priority date wait, and I-485 filing strategy with live timeline estimates by country.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      "H-1B to green card timeline 2026",
      "H1B green card process",
      "EB2 vs EB3 H1B",
      "PERM timeline H1B",
      "I-140 premium processing",
      "priority date backlog India",
      "I-485 adjustment of status",
    ],
    alternates: {
      canonical: "/guides/h1b-to-green-card",
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: "https://stateside.app/guides/h1b-to-green-card",
      type: "article",
    },
  };
}

export default function H1BToGreenCardGuide() {
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
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">H-1B to Green Card Timeline (2026 Guide)</h1>
          <p className="text-gray-700 leading-relaxed mb-3">
            The H-1B to green card path is still the most common employment-based route to permanent residence,
            but planning matters more than ever in 2026 because PERM and I-485 processing remain slow and
            priority date backlogs vary by country. This guide explains the exact sequence from labor certification
            through adjustment of status so you can estimate realistic timing and avoid preventable delays.
          </p>
          <p className="text-gray-700 leading-relaxed">
            In most cases, you will move through PERM, I-140, and then a priority date wait before filing I-485.
            Your employer drives the first stages, but your personal strategy around job changes, travel,
            dependents, and status extensions can significantly affect risk.
          </p>
        </header>

        <H1BGuideInteractive />

        <section className="space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-semibold text-gray-900">Step-by-Step H-1B Green Card Process</h2>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 1: PERM Labor Certification</h3>
            <p>
              PERM is the labor market test where your employer proves there are no able, willing, and qualified
              U.S. workers available for the offered role at the prevailing wage. Before filing PERM, employers
              usually complete prevailing wage determination and regulated recruitment steps. This stage often takes
              the longest in employer-sponsored cases and sets the foundation for everything that follows.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 2: I-140 Immigrant Petition</h3>
            <p>
              After PERM approval, the employer files Form I-140 to classify the role under EB-2 or EB-3 and confirm
              ability to pay. Premium processing usually compresses this stage to about 15 calendar days. Your
              priority date is tied to the PERM filing date, and preserving that date becomes critical if you change
              employers later.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 3: Priority Date Wait</h3>
            <p>
              If your category is not current, you wait until the visa bulletin advances to your priority date.
              This wait is the biggest reason two people with the same job can have very different green card
              timelines. For many applicants born in India or China, this stage can be longer than PERM and I-140
              combined.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 4: I-485 Adjustment of Status</h3>
            <p>
              Once your date is current, you file I-485 (and typically I-765/I-131 together). During pending I-485,
              you may gain work/travel flexibility through EAD/AP, and portability rules can help with qualifying job
              changes after 180 days of pendency. Final approval leads to permanent resident status.
            </p>
          </div>
        </section>

        <section className="space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-semibold text-gray-900">Common Questions (Answered Clearly)</h2>
          <p>
            <strong className="text-gray-900">Can I extend H-1B beyond six years?</strong> Usually yes, if your case
            reaches key milestones. Pending PERM/I-140 timing rules and approved I-140 provisions can allow 1-year or
            3-year extensions depending on your backlog situation.
          </p>
          <p>
            <strong className="text-gray-900">Should I file EB-2 or EB-3?</strong> It depends on job requirements and
            monthly visa bulletin movement. Some applicants move from EB-2 to EB-3 (or back) to take advantage of a
            better cutoff date while keeping an earlier priority date.
          </p>
          <p>
            <strong className="text-gray-900">What happens if I change jobs?</strong> Early moves generally require a
            new PERM and I-140. After I-485 is pending 180+ days, AC21 portability can allow a move to a same or
            similar role without restarting from zero.
          </p>
          <p>
            <strong className="text-gray-900">Can my spouse and children file with me?</strong> Yes. Eligible
            dependents can file as derivatives when your priority date is current, and they can usually request EAD/AP
            while I-485 remains pending.
          </p>
        </section>

        <section className="space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-semibold text-gray-900">Practical Tips and Risk Management</h2>
          <ul className="space-y-2">
            <li>Start employer conversations early; PERM preparation alone can take months before filing.</li>
            <li>Keep clean records of job descriptions, promotion history, and prior immigration filings.</li>
            <li>Track visa bulletin movement monthly rather than assuming linear advancement.</li>
            <li>Coordinate international travel carefully once I-485 or consular strategy is in motion.</li>
            <li>Evaluate parallel options such as <Link href="/guides/eb2-niw" className="text-brand-600 hover:text-brand-700">EB-2 NIW</Link> if you need flexibility independent of employer sponsorship.</li>
          </ul>
        </section>

        <section className="pt-6 border-t border-gray-200 space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Related Guides</h2>
          <p className="text-gray-700">
            Compare this route with alternatives if your employer timeline is uncertain or your travel needs are high:
          </p>
          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <Link href="/guides/tn-to-green-card" className="rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">TN to Green Card Strategy</Link>
            <Link href="/guides/eb2-niw" className="rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">EB-2 NIW Self-Petition Guide</Link>
            <Link href="/guides/perm-process" className="rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">PERM Labor Certification Deep Dive</Link>
            <Link href="/processing-times" className="rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">Current Processing Times & Visa Bulletin</Link>
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
