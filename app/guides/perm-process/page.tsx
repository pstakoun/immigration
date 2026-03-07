import type { Metadata } from "next";
import Link from "next/link";
import { PERMGuideInteractive } from "@/components/GuideInteractiveWidgets";

const pageTitle = "PERM Labor Certification Timeline 2026: Complete Employer Guide";
const pageDescription = "Comprehensive PERM process guide covering prevailing wage, recruitment, DOL adjudication, audits, denial risks, and next steps to I-140 filing.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      "PERM timeline 2026",
      "PERM labor certification process",
      "prevailing wage determination",
      "PERM recruitment requirements",
      "DOL PERM audit",
      "I-140 after PERM",
      "employer sponsored green card",
    ],
    alternates: {
      canonical: "/guides/perm-process",
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: "https://stateside.app/guides/perm-process",
      type: "article",
    },
  };
}

export default function PERMProcessGuide() {
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
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">PERM Labor Certification Timeline (2026 Guide)</h1>
          <p className="text-gray-700 leading-relaxed mb-3">
            PERM labor certification is the first major step in most employer-sponsored EB-2 and EB-3 green card
            cases. It is not a petition for a specific employee alone; it is a structured labor market test where the
            employer proves the offered role cannot be filled by qualified U.S. workers under regulatory requirements.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Because PERM can take years end-to-end when prevailing wage and audit risk are included, understanding this
            stage is one of the most important factors in forecasting a realistic green card timeline.
          </p>
        </header>

        <PERMGuideInteractive />

        <section className="space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-semibold text-gray-900">Step-by-Step PERM Process</h2>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 1: Role Definition and Prevailing Wage</h3>
            <p>
              The employer defines minimum requirements for the permanent role and requests a Prevailing Wage
              Determination (PWD) from DOL. Requirements must reflect true business necessity and align with normal
              industry standards. If requirements appear tailored too narrowly to one candidate, audit risk increases.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 2: Recruitment Campaign</h3>
            <p>
              Once wage guidance is set, the employer performs mandatory recruitment steps, including job postings and
              advertisement requirements tied to position type. The company reviews all applicants and documents lawful
              rejection reasons for each potentially qualified U.S. worker.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 3: ETA Form 9089 Filing and DOL Review</h3>
            <p>
              The employer files ETA-9089 with recruitment and role details. DOL then performs analyst review and may
              approve, deny, or select the case for audit. Accurate documentation is critical because inconsistencies
              between wage request, recruitment language, and form data are common denial triggers.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 4: Post-Approval I-140 Filing Window</h3>
            <p>
              Approved PERM certifications generally remain valid for 180 days. The employer must file I-140 inside
              that period to preserve the case and lock in the priority date from PERM filing.
            </p>
          </div>
        </section>

        <section className="space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-semibold text-gray-900">Common Questions About PERM</h2>
          <p>
            <strong className="text-gray-900">Who pays PERM costs?</strong> Employers. U.S. labor certification rules
            generally prohibit shifting PERM labor certification costs to the foreign national beneficiary.
          </p>
          <p>
            <strong className="text-gray-900">What if a qualified U.S. worker applies?</strong> The employer must
            evaluate fairly and cannot ignore qualified candidates. If the role can be filled by a qualified U.S.
            applicant, the PERM case may fail.
          </p>
          <p>
            <strong className="text-gray-900">How often do audits happen?</strong> Audit rates vary by profile and DOL
            focus, but audits are common enough that every case should be prepared as if evidence production will be
            requested.
          </p>
          <p>
            <strong className="text-gray-900">What if I change employers?</strong> PERM is employer- and role-specific.
            A move to a different sponsoring employer usually means starting a new PERM case.
          </p>
        </section>

        <section className="space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-semibold text-gray-900">Risk Reduction Tips for Employers and Beneficiaries</h2>
          <ul className="space-y-2">
            <li>Align job requirements with real business needs and consistent organizational documentation.</li>
            <li>Archive all recruitment evidence immediately; late reconstruction is a frequent audit problem.</li>
            <li>Coordinate legal, HR, and hiring manager input before filing to avoid contradictions.</li>
            <li>Monitor deadlines carefully, especially the 180-day post-approval I-140 filing period.</li>
            <li>If flexibility is needed, compare parallel routes like <Link href="/guides/eb2-niw" className="text-brand-600 hover:text-brand-700">EB-2 NIW</Link>.</li>
          </ul>
        </section>

        <section className="pt-6 border-t border-gray-200 space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Where PERM Fits in the Bigger Picture</h2>
          <p className="text-gray-700">
            PERM is one stage of a larger employment-based strategy. After PERM and I-140, most applicants still need
            to wait for a current priority date and then complete I-485 or consular processing.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <Link href="/guides/h1b-to-green-card" className="rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">H-1B to Green Card Guide</Link>
            <Link href="/guides/tn-to-green-card" className="rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">TN to Green Card Guide</Link>
            <Link href="/guides/eb2-niw" className="rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">EB-2 NIW Guide</Link>
            <Link href="/processing-times" className="rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">Current Processing Times</Link>
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
