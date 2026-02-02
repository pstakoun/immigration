import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PERM Labor Certification",
  description:
    "Deep dive into PERM labor certification. Understand prevailing wage, recruitment requirements, audit risks, and realistic processing timelines.",
};

export default function PERMProcessGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12">
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

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        PERM Labor Certification
      </h1>

      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          PERM (Program Electronic Review Management) is the Department of Labor process
          that verifies no qualified US workers are available for your position. It&apos;s
          the first and often longest step in employer-sponsored green cards.
        </p>

        <p>
          The entire PERM process typically takes{" "}
          <strong className="text-gray-900">12-24 months</strong> from start to approval,
          depending on whether you get audited.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          Step 1: Prevailing Wage Determination
        </h2>
        <p className="text-sm text-gray-500 mb-2">5-7 months</p>
        <p>
          Before recruitment can begin, your employer requests a{" "}
          <strong className="text-gray-900">prevailing wage determination (PWD)</strong>{" "}
          from DOL. This establishes the minimum salary for the position based on job duties,
          requirements, and location.
        </p>
        <p>
          The PWD request includes a detailed job description and requirements. DOL assigns
          a wage level (1-4) based on complexity. Higher levels mean higher minimum salaries
          but can also mean fewer qualified US applicants—a strategic consideration.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          Step 2: Recruitment
        </h2>
        <p className="text-sm text-gray-500 mb-2">2-3 months</p>
        <p>
          Once the PWD is received, your employer conducts recruitment to test the labor market.
          Required steps for professional positions:
        </p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>Job order with state workforce agency (30 days minimum)</li>
          <li>Two Sunday newspaper advertisements</li>
          <li>
            Three additional recruitment steps (job fairs, professional organizations,
            campus recruiting, etc.)
          </li>
          <li>Internal posting at the company (10 business days)</li>
        </ul>
        <p className="mt-4">
          If any US worker applies and is minimally qualified, your employer must interview
          them and document why they weren&apos;t hired (if rejected). A qualified US applicant
          who&apos;s offered the job kills the PERM case.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          Step 3: Quiet Period and Filing
        </h2>
        <p className="text-sm text-gray-500 mb-2">30 days + filing</p>
        <p>
          After recruitment ends, there&apos;s a mandatory 30-day waiting period. Then your
          employer files the ETA-9089 form electronically. The filing date becomes your{" "}
          <strong className="text-gray-900">priority date</strong>—crucial for the visa
          bulletin queue.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          Step 4: DOL Processing
        </h2>
        <p className="text-sm text-gray-500 mb-2">12-17 months (non-audit) / 18-24 months (audit)</p>
        <p>
          DOL reviews the application. Currently, they&apos;re processing cases from about{" "}
          <strong className="text-gray-900">12-17 months ago</strong> for analyst review.
          Cases are either approved, denied, or selected for audit.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          Audit Risk
        </h2>
        <p>
          About 30% of PERM cases get audited. DOL requests documentation proving the recruitment
          was conducted properly. Common audit triggers:
        </p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>Random selection (some percentage are randomly audited)</li>
          <li>Job requirements that seem tailored to the beneficiary</li>
          <li>Unusual combinations of requirements</li>
          <li>
            <strong className="text-gray-900">Foreign language requirements</strong>{" "}
            without business necessity
          </li>
          <li>Travel requirements</li>
          <li>Prior PERM denials at the company</li>
        </ul>
        <p className="mt-4">
          Audit review currently takes an additional{" "}
          <strong className="text-gray-900">6-12 months</strong> on top of regular processing.
          DOL is processing audited cases from significantly further back.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          Common PERM Mistakes
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-900">Overstating job requirements:</strong> Requiring
            skills beyond what the job actually needs triggers scrutiny and may result
            in denial.
          </li>
          <li>
            <strong className="text-gray-900">Recruitment timing errors:</strong> Ads must
            run on specific days, job orders for specific durations. Documentation must be precise.
          </li>
          <li>
            <strong className="text-gray-900">Salary below PWD:</strong> The offered salary
            must meet or exceed the prevailing wage at time of filing and hire.
          </li>
          <li>
            <strong className="text-gray-900">Poor documentation:</strong> Keep everything—
            screenshots of job postings, copies of ads, interview notes. Audits request
            extensive records.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          After PERM Approval
        </h2>
        <p>
          Once approved, the PERM certification is valid for{" "}
          <strong className="text-gray-900">180 days</strong>. Your employer must file I-140
          within this window. The I-140 filing date doesn&apos;t matter for your priority date—
          that&apos;s locked to the original PERM filing date.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
          Key Considerations
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-900">Job changes during PERM:</strong> If your
            duties change significantly, the PERM may need to be refiled.
          </li>
          <li>
            <strong className="text-gray-900">Employer ability to pay:</strong> The company
            must demonstrate financial ability to pay the offered wage, documented in
            the I-140 stage.
          </li>
          <li>
            <strong className="text-gray-900">Multiple PERMs:</strong> You can have PERMs
            filed by different employers simultaneously, or file for different positions.
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
    </div>
  );
}
