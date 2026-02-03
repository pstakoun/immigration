import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EB-2 NIW (National Interest Waiver)",
  description:
    "Complete guide to EB-2 NIW self-petition. Learn the requirements, evidence needed, and realistic timelines for this employer-independent green card path.",
};

const steps = [
  { id: "i140", label: "I-140 NIW", duration: "6-12mo", color: "emerald" },
  { id: "i485", label: "I-485", duration: "10-18mo", color: "amber" },
];

function TimelineNav({ activeStep }: { activeStep?: string }) {
  const colorMap: Record<string, { active: string; inactive: string }> = {
    emerald: { active: "bg-emerald-500 text-white", inactive: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    amber: { active: "bg-amber-500 text-white", inactive: "bg-amber-50 text-amber-700 border-amber-200" },
  };
  
  return (
    <div className="flex items-center gap-1 py-3 overflow-x-auto">
      <div className="px-2 py-1 text-xs text-gray-400 border border-dashed border-gray-300 rounded">
        No PERM
      </div>
      <svg className="w-4 h-4 mx-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      {steps.map((step, index) => {
        const isActive = activeStep === step.id;
        const colors = colorMap[step.color];
        
        return (
          <div key={step.id} className="flex items-center">
            <a
              href={`#${step.id}`}
              className={`
                px-3 py-1.5 rounded border text-sm font-medium transition-colors
                ${isActive ? colors.active : colors.inactive}
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
      <span className="ml-3 text-sm text-gray-500">→ Green Card</span>
    </div>
  );
}

function StepHeader({
  id,
  title,
  duration,
  color,
}: {
  id: string;
  title: string;
  duration?: string;
  color: "emerald" | "amber";
}) {
  const colorClasses = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
  };
  
  return (
    <div id={id} className="flex items-center gap-3 mt-10 mb-4 scroll-mt-6">
      <div className={`w-1 h-8 rounded-full ${colorClasses[color]}`} />
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {duration && <p className="text-sm text-gray-500">{duration}</p>}
      </div>
    </div>
  );
}

export default function EB2NIWGuide() {
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
          EB-2 NIW
        </h1>
        <p className="text-gray-600 mb-4">
          National Interest Waiver — self-petition path
        </p>

        {/* Visual timeline nav */}
        <div className="border-b border-gray-200 mb-6">
          <TimelineNav />
        </div>

        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            NIW lets you skip PERM and petition for yourself. No employer sponsorship,
            no labor certification. You argue that your work benefits the US enough
            to waive the normal requirements.
          </p>
          <p>
            Timeline is <strong className="text-gray-900">1-3 years</strong> for most
            countries. India/China backlogs still apply—the NIW just gets you in line
            faster since there&apos;s no PERM wait.
          </p>

          {/* Requirements */}
          <h2 className="text-lg font-semibold text-gray-900 mt-10 mb-4">
            Requirements
          </h2>
          <p>You need to meet EB-2 qualifications first:</p>
          <ul className="space-y-2 text-sm mt-2">
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
              <span>Master&apos;s degree or higher, OR</span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
              <span>Bachelor&apos;s + 5 years of progressive experience</span>
            </li>
          </ul>
          
          <p className="mt-4">Then prove the NIW three-part test (Matter of Dhanasar):</p>
          <div className="space-y-3 mt-3">
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm">
                <strong className="text-gray-900">1. Substantial merit and national importance</strong>
                <br />
                Your work has significant value beyond a single employer or state.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm">
                <strong className="text-gray-900">2. Well positioned to advance the endeavor</strong>
                <br />
                Your education, experience, and track record show you can deliver.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm">
                <strong className="text-gray-900">3. Beneficial to waive job offer requirement</strong>
                <br />
                The US benefits more from letting you self-petition than requiring PERM.
              </p>
            </div>
          </div>

          {/* I-140 Section */}
          <StepHeader
            id="i140"
            title="I-140 NIW Petition"
            duration="6-12 months (or 15 days with premium)"
            color="emerald"
          />
          <p>
            You file I-140 yourself (or with a lawyer). Your priority date is when
            USCIS receives the petition. Premium processing is available for 15-day decisions.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <strong>Evidence that works:</strong> publications, citations, patents,
            5-8 recommendation letters from experts, media coverage, documented impact
            of your work.
          </p>

          {/* I-485 Section */}
          <StepHeader
            id="i485"
            title="I-485 Adjustment of Status"
            duration="10-18 months (when current)"
            color="amber"
          />
          <p>
            Same as employer-sponsored path—wait for your priority date to be current,
            then file I-485. For most countries, you can file immediately or concurrently
            with I-140.
          </p>

          {/* Strategy */}
          <h2 className="text-lg font-semibold text-gray-900 mt-10 mb-4">
            NIW + PERM Strategy
          </h2>
          <p>
            Many people file NIW while also having their employer file PERM. If PERM has
            an earlier priority date, you can port it to your NIW case. This gives you:
          </p>
          <ul className="space-y-2 text-sm mt-2">
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span>Backup if NIW is denied</span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span>Flexibility if you leave employer</span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span>Earlier priority date if PERM was filed first</span>
            </li>
          </ul>

          {/* CTA */}
          <div className="mt-10 p-5 rounded-xl bg-brand-50 border border-brand-100">
            <h3 className="font-semibold text-gray-900 mb-2">
              See your NIW timeline
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Compare the NIW path to employer-sponsored options. See how your country
              of birth affects the timeline.
            </p>
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
      </article>
    </div>
  );
}
