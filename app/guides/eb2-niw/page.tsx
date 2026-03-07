import type { Metadata } from "next";
import Link from "next/link";
import { EB2NIWGuideInteractive } from "@/components/GuideInteractiveWidgets";

const pageTitle = "EB-2 NIW Timeline 2026: Complete National Interest Waiver Guide";
const pageDescription = "In-depth EB-2 NIW guide with Dhanasar prongs, evidence strategy, I-140 and I-485 timeline planning, and country-specific backlog estimates.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      "EB2 NIW timeline 2026",
      "National Interest Waiver guide",
      "Dhanasar prongs",
      "self petition green card",
      "EB2 NIW evidence",
      "I-140 NIW processing time",
      "NIW priority date wait",
    ],
    alternates: {
      canonical: "/guides/eb2-niw",
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: "https://stateside.app/guides/eb2-niw",
      type: "article",
    },
  };
}

export default function EB2NIWGuide() {
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
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">EB-2 NIW Timeline (2026 Guide)</h1>
          <p className="text-gray-700 leading-relaxed mb-3">
            EB-2 NIW (National Interest Waiver) lets you self-petition for a green card without employer sponsorship
            and without PERM labor certification. For many researchers, engineers, physicians, founders, and other
            high-impact professionals, NIW offers flexibility that employer-sponsored paths cannot.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The core challenge is evidence quality: USCIS must be convinced your proposed work has substantial merit,
            national importance, and that waiving the job offer/labor certification requirement benefits the U.S.
            enough to justify approval.
          </p>
        </header>

        <EB2NIWGuideInteractive />

        <section className="space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-semibold text-gray-900">Step-by-Step EB-2 NIW Process</h2>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 1: Confirm Basic EB-2 Eligibility</h3>
            <p>
              You generally need either an advanced degree (or bachelor&apos;s plus progressive experience) or exceptional
              ability evidence. EB-2 classification is separate from the NIW analysis, so both layers must be covered
              in your petition package.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 2: Build the Dhanasar Argument</h3>
            <p>
              Most NIW cases are organized around three Dhanasar prongs: substantial merit/national importance,
              your positioning to advance the endeavor, and the national benefit of waiving a job offer and PERM.
              Winning cases connect evidence to each prong directly instead of relying on generic accomplishments.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 3: File I-140 NIW</h3>
            <p>
              File Form I-140 with a petition letter, exhibits, recommendation letters, and objective impact evidence.
              Premium processing can accelerate adjudication in many NIW cases, but timing should still include room
              for possible Requests for Evidence (RFEs).
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 4: Wait for Priority Date and File I-485</h3>
            <p>
              NIW is still in the EB-2 category, so visa bulletin backlogs can apply by country of chargeability. Once
              current, you file I-485 and related applications for work/travel authorization while final green card
              approval is pending.
            </p>
          </div>
        </section>

        <section className="space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-semibold text-gray-900">What Evidence Strengthens NIW Cases?</h2>
          <ul className="space-y-2">
            <li>Independent recommendation letters that explain impact beyond your direct employer.</li>
            <li>Publications, patents, product adoption metrics, or measurable policy/clinical outcomes.</li>
            <li>Media coverage, invited talks, judging/review activity, and awards tied to your field impact.</li>
            <li>Concrete future plan in the U.S., with realistic execution details and national-level relevance.</li>
          </ul>
          <p>
            Strong NIW packets tell a coherent story: your past record predicts future benefit, and that benefit is
            broad enough that requiring PERM would not serve U.S. interests.
          </p>
        </section>

        <section className="space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-semibold text-gray-900">Common Questions</h2>
          <p>
            <strong className="text-gray-900">Can I file NIW and employer PERM in parallel?</strong> Yes, many people
            run both strategies to hedge risk and preserve optionality.
          </p>
          <p>
            <strong className="text-gray-900">Is NIW only for academics?</strong> No. USCIS approves NIW across
            technology, healthcare, energy, manufacturing, business innovation, and other fields where national impact
            can be clearly documented.
          </p>
          <p>
            <strong className="text-gray-900">Do I need citations or publications?</strong> Not always, but objective,
            verifiable impact evidence is essential. The exact mix depends on your domain.
          </p>
          <p>
            <strong className="text-gray-900">What if I get an RFE?</strong> RFEs are common in NIW adjudications.
            Focus on direct, document-backed responses mapped to each requested point.
          </p>
        </section>

        <section className="space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-semibold text-gray-900">Tips and Considerations for 2026 Filers</h2>
          <ul className="space-y-2">
            <li>Lead with measurable outcomes, not only job title prestige or education level.</li>
            <li>Write a focused proposed endeavor section specific to U.S. impact and implementation.</li>
            <li>Maintain a clear document index so adjudicators can verify claims quickly.</li>
            <li>Track visa bulletin movement to decide when I-485 readiness becomes urgent.</li>
            <li>Compare NIW timing against employer-sponsored alternatives like <Link href="/guides/h1b-to-green-card" className="text-brand-600 hover:text-brand-700">H-1B to green card</Link>.</li>
          </ul>
        </section>

        <section className="pt-6 border-t border-gray-200 space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Related Guides</h2>
          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <Link href="/guides/h1b-to-green-card" className="rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">H-1B to Green Card Process</Link>
            <Link href="/guides/perm-process" className="rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">PERM Process (Employer Route)</Link>
            <Link href="/guides/tn-to-green-card" className="rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">TN to Green Card Strategy</Link>
            <Link href="/guides" className="rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">All Guides</Link>
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
