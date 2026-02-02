import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TN Visa to Green Card",
  description:
    "Guide for Canadian and Mexican TN visa holders seeking permanent residence. Understand dual intent concerns and the path to a green card.",
};

export default function TNToGreenCardGuide() {
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
          TN Visa to Green Card
        </h1>

        <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          The TN visa under NAFTA/USMCA allows Canadian and Mexican professionals to work
          in the US, but it&apos;s technically a non-immigrant visa with no direct path to
          permanent residence. Getting a green card while on TN status requires navigating
          the <strong className="text-gray-900">dual intent</strong> issue carefully.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          The Dual Intent Problem
        </h2>
        <p>
          TN status requires you to maintain non-immigrant intent—meaning you plan to return
          to your home country eventually. Filing for a green card (which shows immigrant intent)
          can technically make you ineligible for TN renewals.
        </p>
        <p>
          In practice, this is a timing issue. The risk is primarily at the border when renewing
          TN status, or if you need to leave and re-enter the US during the green card process.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          Strategy 1: Direct Filing (Risky but Common)
        </h2>
        <p className="text-sm text-gray-500 mb-2">Works best for Canadians with low travel needs</p>
        <p>
          Many TN holders simply start the PERM and I-140 process while on TN status. The I-140
          alone doesn&apos;t trigger immigrant intent issues because you haven&apos;t yet &quot;applied&quot;
          for the green card.
        </p>
        <p>
          The risk point is when you file I-485 (adjustment of status). At that moment, you
          officially have immigrant intent. If you need to leave the US, you&apos;ll need to use
          Advance Parole—but returning on AP abandons your TN status.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          Strategy 2: Switch to H-1B First
        </h2>
        <p className="text-sm text-gray-500 mb-2">Safest approach, adds 6-12 months</p>
        <p>
          The cleaner approach is to switch from TN to H-1B before starting the green card
          process. H-1B is a <strong className="text-gray-900">dual intent visa</strong>—you
          can have immigrant intent and still maintain valid status.
        </p>
        <p>
          Your employer files a change of status I-129 petition. Once you&apos;re on H-1B, the
          green card process works exactly like the standard H-1B to green card path with no
          dual intent concerns.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          Canadian vs Mexican TN Holders
        </h2>
        <p>
          <strong className="text-gray-900">Canadians</strong> can get TN status at the border
          with just a job offer letter—no visa stamp needed. This makes it easy to renew but
          also easier to be questioned about intent.
        </p>
        <p>
          <strong className="text-gray-900">Mexicans</strong> must apply for a TN visa at a
          US consulate. The consular interview adds scrutiny but the stamped visa provides
          cleaner proof of status.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          Timeline Advantage
        </h2>
        <p>
          Since Canada and Mexico aren&apos;t backlogged countries, TN holders typically have{" "}
          <strong className="text-gray-900">&quot;current&quot; priority dates</strong> for EB-2 and EB-3.
          This means you can often file I-485 immediately after I-140 approval (or even
          concurrently), resulting in a total timeline of 2-3 years.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          Key Considerations
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-900">Travel during process:</strong> Once I-485 is
            pending, any travel requires Advance Parole. Returning on AP means you&apos;re
            no longer in TN status.
          </li>
          <li>
            <strong className="text-gray-900">Spouse and children:</strong> TD dependents face
            the same dual intent issues. Consider timing carefully if family members need to
            travel.
          </li>
          <li>
            <strong className="text-gray-900">EB-2 NIW option:</strong> If you qualify, NIW
            lets you self-petition without employer sponsorship—useful if your employer
            won&apos;t sponsor or you want more flexibility.
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
