import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EB-2 NIW (National Interest Waiver)",
  description:
    "Complete guide to EB-2 NIW self-petition. Learn the requirements, evidence needed, and realistic timelines for this employer-independent green card path.",
};

export default function EB2NIWGuide() {
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
          EB-2 NIW (National Interest Waiver)
        </h1>

        <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          The National Interest Waiver is an exception to the usual EB-2 requirement of
          employer sponsorship and labor certification. You petition for yourself, arguing
          that your work benefits the United States enough to waive the normal process.
        </p>

        <p>
          NIW is attractive because you control the timeline—no waiting for your employer
          to start PERM, no risk of the process restarting if you change jobs. The downside
          is a higher evidence burden and the same priority date backlogs as regular EB-2.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          The Three-Part Test (Matter of Dhanasar)
        </h2>
        <p>
          Since 2016, USCIS uses the Dhanasar framework. You must show:
        </p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>
            <strong className="text-gray-900">Substantial merit and national importance:</strong>{" "}
            Your proposed endeavor has significant value. &quot;National&quot; doesn&apos;t mean
            government work—it means impact beyond a single state or employer.
          </li>
          <li>
            <strong className="text-gray-900">Well positioned to advance the endeavor:</strong>{" "}
            Your education, skills, experience, and track record show you can actually deliver
            on what you&apos;re proposing.
          </li>
          <li>
            <strong className="text-gray-900">Beneficial to waive the job offer requirement:</strong>{" "}
            On balance, the US benefits more from letting you self-petition than from requiring
            PERM labor certification.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          Who Qualifies
        </h2>
        <p>
          You need to meet EB-2 requirements first: either a <strong className="text-gray-900">
          master&apos;s degree</strong> or a bachelor&apos;s plus 5 years of progressive experience
          in your field.
        </p>
        <p>
          Common successful NIW petitioners include researchers with publications, engineers
          working on significant projects, entrepreneurs in high-impact fields, healthcare
          professionals in underserved areas, and STEM professionals with demonstrable contributions.
        </p>
        <p>
          You don&apos;t need to be famous or have Nobel-level achievements. The standard is
          whether your continued work in the US serves the national interest.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          Evidence That Works
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-900">Publications and citations:</strong> Research
            papers, especially if cited by others in the field
          </li>
          <li>
            <strong className="text-gray-900">Patents:</strong> Granted or pending, showing
            innovation
          </li>
          <li>
            <strong className="text-gray-900">Recommendation letters:</strong> 5-8 letters
            from experts who can speak to the importance of your work (not just personal
            references)
          </li>
          <li>
            <strong className="text-gray-900">Media coverage or awards:</strong> Recognition
            of your contributions
          </li>
          <li>
            <strong className="text-gray-900">Impact documentation:</strong> How your work
            has been used, implemented, or influenced the field
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          Timeline
        </h2>
        <p className="text-sm text-gray-500 mb-2">I-140: 6-9 months (or 15 days with premium)</p>
        <p>
          Unlike PERM-based EB-2, you skip directly to filing I-140. Your priority date is
          the date USCIS receives your I-140. Premium processing is available for the 15-day
          decision.
        </p>
        <p>
          For I-485, the same country-based backlogs apply. If you&apos;re from India or China,
          your NIW approval just means you have an approved I-140 waiting for a visa number—
          which could take years.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          NIW + PERM Strategy
        </h2>
        <p>
          Many people file NIW while also having their employer file PERM/I-140. If the PERM
          priority date is earlier (because you started that process first), you can use
          it for your NIW case through <strong className="text-gray-900">priority date porting</strong>.
        </p>
        <p>
          This hedge gives you two shots: if NIW is denied, you still have the employer-sponsored
          path. If you leave your employer, you still have the NIW.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          Key Considerations
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-900">RFE rate:</strong> NIW cases have higher
            Request for Evidence rates than regular EB-2. Budget time for a potential
            RFE response.
          </li>
          <li>
            <strong className="text-gray-900">Proposed endeavor:</strong> You need a clear
            description of what you plan to do in the US, not just your past achievements.
          </li>
          <li>
            <strong className="text-gray-900">Job flexibility:</strong> Once I-140 is approved
            (even if I-485 is pending), you can change jobs as long as the new position is
            in the same or similar field.
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
