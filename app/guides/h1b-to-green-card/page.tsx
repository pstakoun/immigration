import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "H-1B to Green Card",
  description:
    "Complete guide to getting a green card from H-1B status. Learn about PERM labor certification, I-140, and I-485 adjustment of status timelines.",
};

export default function H1BToGreenCardGuide() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      {/* Breadcrumb */}
      <Link
        href="/guides"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Guides
      </Link>

      <article className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          H-1B to Green Card
        </h1>

        <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          The H-1B to green card path is the most common route for employment-based
          immigration. Your employer sponsors you through a three-step process:
          PERM labor certification, I-140 petition, and I-485 adjustment of status.
        </p>

        <p>
          Total timeline depends heavily on your country of birth. For most countries,
          the entire process takes <strong className="text-gray-900">2-4 years</strong>.
          For India and China, significant backlogs add years or decades of waiting.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          Step 1: PERM Labor Certification
        </h2>
        <p className="text-sm text-gray-500 mb-2">6-18 months</p>
        <p>
          Your employer must prove no qualified US workers are available for your position.
          This involves getting a <strong className="text-gray-900">prevailing wage determination</strong> from
          the Department of Labor, then running recruitment (job postings, advertising) for 30-60 days.
        </p>
        <p>
          After recruitment closes and a 30-day quiet period passes, your employer files the
          PERM application. DOL currently takes 12-17 months to process non-audited cases.
          If audited, add another 6-12 months.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          Step 2: I-140 Immigrant Petition
        </h2>
        <p className="text-sm text-gray-500 mb-2">6-9 months (or 15 days with premium)</p>
        <p>
          Once PERM is approved, your employer files Form I-140 with USCIS. This petition
          establishes your eligibility under EB-2 or EB-3, and your{" "}
          <strong className="text-gray-900">priority date</strong> is set to when your PERM
          was filed.
        </p>
        <p>
          Most employers file with premium processing for the 15-day guarantee. The I-140
          approval is significant—once approved for 180 days, you can change employers and
          keep your priority date (portability).
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          Step 3: I-485 Adjustment of Status
        </h2>
        <p className="text-sm text-gray-500 mb-2">10-18 months (after priority date is current)</p>
        <p>
          This is the final step where you actually apply for the green card. You can only
          file when your priority date is &quot;current&quot; according to the visa bulletin.
        </p>
        <p>
          When you file I-485, you also file I-765 (work permit) and I-131 (travel document).
          The EAD/AP combo card typically arrives in 3-5 months, freeing you from H-1B
          status restrictions while you wait for the green card.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          EB-2 vs EB-3
        </h2>
        <p>
          <strong className="text-gray-900">EB-2</strong> requires a master&apos;s degree
          or bachelor&apos;s plus 5 years of progressive experience. It has shorter backlogs
          for India/China.
        </p>
        <p>
          <strong className="text-gray-900">EB-3</strong> requires a bachelor&apos;s degree
          or 2 years of experience for skilled workers. More accessible requirements but
          longer backlogs.
        </p>
        <p>
          Some people file both categories simultaneously (one with each employer) or do
          EB-3 to EB-2 &quot;downgrade&quot; strategies to optimize their wait time.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          Key Considerations
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-900">H-1B 6-year limit:</strong> You can extend
            beyond 6 years if you have an approved I-140 or a pending PERM filed more than
            365 days ago.
          </li>
          <li>
            <strong className="text-gray-900">Employer dependency:</strong> Until your I-140
            is approved for 180 days, changing employers restarts the process.
          </li>
          <li>
            <strong className="text-gray-900">Concurrent filing:</strong> If your priority
            date is current when I-140 is filed, you can file I-485 simultaneously.
          </li>
          <li>
            <strong className="text-gray-900">Priority date portability:</strong> An approved
            I-140&apos;s priority date can be used with a new employer&apos;s PERM/I-140.
          </li>
        </ul>

        <div className="border-t border-gray-200 pt-8 mt-8">
          <Link
            href="/"
            className="inline-flex items-center text-brand-600 hover:text-brand-700 font-medium transition-colors"
          >
            See your timeline
            <svg
              className="ml-1 w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
        </div>
      </article>
    </div>
  );
}
