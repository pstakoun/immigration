import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PERM Labor Certification",
  description:
    "Deep dive into PERM labor certification. Understand prevailing wage, recruitment requirements, audit risks, and realistic processing timelines.",
};

const steps = [
  { id: "pwd", label: "PWD", duration: "5-7mo", color: "emerald" },
  { id: "recruit", label: "Recruit", duration: "2-3mo", color: "emerald" },
  { id: "dol", label: "DOL Review", duration: "12-17mo", color: "emerald" },
];

function TimelineNav({ activeStep }: { activeStep?: string }) {
  return (
    <div className="flex items-center gap-1 py-3 overflow-x-auto">
      {steps.map((step, index) => {
        const isActive = activeStep === step.id;
        
        return (
          <div key={step.id} className="flex items-center">
            <a
              href={`#${step.id}`}
              className={`
                px-3 py-1.5 rounded border text-sm font-medium transition-colors
                ${isActive
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"}
                hover:opacity-80
              `}
            >
              {step.label}
              <span className={`ml-1.5 ${isActive ? "text-white/80" : "opacity-60"}`}>
                {step.duration}
              </span>
            </a>
            {index < steps.length - 1 && (
              <svg className="w-4 h-4 mx-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        );
      })}
      <span className="ml-3 text-sm text-gray-500">→ I-140 → I-485</span>
    </div>
  );
}

function StepHeader({
  id,
  title,
  duration,
}: {
  id: string;
  title: string;
  duration?: string;
}) {
  return (
    <div id={id} className="flex items-center gap-3 mt-10 mb-4 scroll-mt-6">
      <div className="w-1 h-8 rounded-full bg-emerald-500" />
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {duration && <p className="text-sm text-gray-500">{duration}</p>}
      </div>
    </div>
  );
}

export default function PERMProcessGuide() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      {/* Breadcrumb */}
      <Link
        href="/guides"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Guides
      </Link>

      <article className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          PERM Labor Certification
        </h1>
        <p className="text-gray-600 mb-4">
          Department of Labor process — required for most employer-sponsored green cards
        </p>

        {/* Visual timeline nav */}
        <div className="border-b border-gray-200 mb-6">
          <TimelineNav />
        </div>

        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            PERM proves no qualified US workers are available for your position. It&apos;s
            typically the longest single step in employer-sponsored green cards:
            <strong className="text-gray-900"> 18-24 months</strong> total.
          </p>
          <p>
            Your PERM filing date becomes your <strong className="text-gray-900">priority date</strong>—the
            date that matters for visa bulletin queues.
          </p>

          {/* PWD Section */}
          <StepHeader
            id="pwd"
            title="Prevailing Wage Determination"
            duration="5-7 months"
          />
          <p>
            DOL determines the minimum salary for your position based on job duties,
            requirements, and location. This sets the wage your employer must offer.
          </p>
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 mt-3">
            <p className="text-sm">
              <strong className="text-gray-900">Wage levels 1-4:</strong> Higher levels mean
              higher minimum salary but fewer qualified US applicants—a strategic consideration.
            </p>
          </div>

          {/* Recruitment Section */}
          <StepHeader
            id="recruit"
            title="Recruitment"
            duration="2-3 months"
          />
          <p>
            Your employer tests the labor market by advertising the position:
          </p>
          <ul className="space-y-2 text-sm mt-2">
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span>Job order with state workforce agency (30 days minimum)</span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span>Two Sunday newspaper advertisements</span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span>Three additional steps (job fairs, professional orgs, etc.)</span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span>Internal company posting (10 business days)</span>
            </li>
          </ul>
          <p className="text-sm text-gray-600 mt-3">
            If a qualified US worker applies and wants the job, the PERM case fails.
            After recruitment, there&apos;s a mandatory 30-day quiet period before filing.
          </p>

          {/* DOL Review Section */}
          <StepHeader
            id="dol"
            title="DOL Review"
            duration="12-17 months (non-audit)"
          />
          <p>
            Your employer files the ETA-9089 form. DOL reviews and either approves,
            denies, or audits. Current processing times from flag.dol.gov:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <p className="text-sm font-medium text-emerald-800">Analyst Review</p>
              <p className="text-sm text-emerald-700">12-17 months</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
              <p className="text-sm font-medium text-amber-800">Audit Review</p>
              <p className="text-sm text-amber-700">+6-12 months</p>
            </div>
          </div>

          {/* Audit Risks */}
          <h2 className="text-lg font-semibold text-gray-900 mt-10 mb-4">
            Audit Risks
          </h2>
          <p>
            About 30% of cases get audited. Common triggers:
          </p>
          <ul className="space-y-2 text-sm mt-2">
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span>Random selection (some percentage always audited)</span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span>Requirements that seem tailored to you specifically</span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span>Foreign language requirements without business necessity</span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span>Travel requirements</span>
            </li>
          </ul>

          {/* After Approval */}
          <h2 className="text-lg font-semibold text-gray-900 mt-10 mb-4">
            After PERM Approval
          </h2>
          <p>
            The PERM certification is valid for <strong className="text-gray-900">180 days</strong>.
            Your employer must file I-140 within this window. The priority date is locked
            to when PERM was filed, not when I-140 is filed.
          </p>

          {/* Key Points */}
          <h2 className="text-lg font-semibold text-gray-900 mt-10 mb-4">
            Key Points
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-gray-900">Job changes:</strong> If your duties change
                significantly during PERM, it may need to be refiled.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-gray-900">Multiple PERMs:</strong> You can have PERMs
                with different employers simultaneously.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-gray-900">Documentation:</strong> Keep everything—
                screenshots, ads, interview notes. Audits request extensive records.
              </span>
            </li>
          </ul>

          {/* CTA */}
          <div className="mt-10 p-5 rounded-xl bg-brand-50 border border-brand-100">
            <h3 className="font-semibold text-gray-900 mb-2">
              See current PERM processing times
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              View live DOL processing times and see how PERM fits into your overall
              green card timeline.
            </p>
            <div className="flex gap-3">
              <Link
                href="/processing-times"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Processing Times
              </Link>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors"
              >
                Open Timeline Tool
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
