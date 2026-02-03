import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "H-1B to Green Card",
  description:
    "Complete guide to getting a green card from H-1B status. Learn about PERM labor certification, I-140, and I-485 adjustment of status timelines.",
};

// Timeline steps for this guide
const steps = [
  { id: "perm", label: "PERM", duration: "12-18mo", color: "emerald" },
  { id: "i140", label: "I-140", duration: "15d-9mo", color: "emerald" },
  { id: "i485", label: "I-485", duration: "10-18mo", color: "amber" },
];

function TimelineNav({ activeStep }: { activeStep?: string }) {
  return (
    <div className="flex items-center gap-1 py-3 overflow-x-auto">
      {steps.map((step, index) => {
        const isActive = activeStep === step.id;
        const colorClasses = {
          emerald: isActive
            ? "bg-emerald-500 text-white"
            : "bg-emerald-50 text-emerald-700 border-emerald-200",
          amber: isActive
            ? "bg-amber-500 text-white"
            : "bg-amber-50 text-amber-700 border-amber-200",
        };
        
        return (
          <div key={step.id} className="flex items-center">
            <a
              href={`#${step.id}`}
              className={`
                px-3 py-1.5 rounded border text-sm font-medium transition-colors
                ${colorClasses[step.color as keyof typeof colorClasses]}
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
  duration: string;
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
        <p className="text-sm text-gray-500">{duration}</p>
      </div>
    </div>
  );
}

export default function H1BToGreenCardGuide() {
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
          H-1B to Green Card
        </h1>
        <p className="text-gray-600 mb-4">
          Employer-sponsored EB-2/EB-3 path
        </p>

        {/* Visual timeline nav */}
        <div className="border-b border-gray-200 mb-6">
          <TimelineNav />
        </div>

        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Your employer sponsors you through a three-step process. Total timeline is{" "}
            <strong className="text-gray-900">2-4 years</strong> for most countries.
            India and China face significant backlogs that add years of waiting.
          </p>

          {/* PERM Section */}
          <StepHeader
            id="perm"
            title="PERM Labor Certification"
            duration="12-18 months"
            color="emerald"
          />
          <p>
            Your employer must prove no qualified US workers are available for your position.
            This involves:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm ml-2">
            <li><strong className="text-gray-900">Prevailing wage</strong> determination from DOL (5-7 months)</li>
            <li><strong className="text-gray-900">Recruitment</strong> — job postings and advertising (2-3 months)</li>
            <li><strong className="text-gray-900">DOL review</strong> of PERM application (12-17 months)</li>
          </ol>
          <p className="text-sm text-gray-600 mt-2">
            If audited, add another 6-12 months. About 30% of cases get audited.
          </p>

          {/* I-140 Section */}
          <StepHeader
            id="i140"
            title="I-140 Immigrant Petition"
            duration="15 days – 9 months"
            color="emerald"
          />
          <p>
            Once PERM is approved, your employer files I-140 with USCIS. This establishes
            your eligibility under EB-2 or EB-3. Your <strong className="text-gray-900">priority date</strong>{" "}
            is set to when PERM was filed.
          </p>
          <p>
            Most employers use premium processing for the 15-day guarantee. Once approved
            for 180 days, you can change employers and keep your priority date.
          </p>

          {/* I-485 Section */}
          <StepHeader
            id="i485"
            title="I-485 Adjustment of Status"
            duration="10-18 months"
            color="amber"
          />
          <p>
            The final step where you actually apply for the green card. You can only file
            when your priority date is current according to the visa bulletin.
          </p>
          <p>
            Along with I-485, you file I-765 (work permit) and I-131 (travel document).
            The EAD/AP combo card typically arrives in 3-5 months, freeing you from H-1B
            restrictions while you wait.
          </p>

          {/* EB-2 vs EB-3 */}
          <h2 className="text-lg font-semibold text-gray-900 mt-10 mb-4">
            EB-2 vs EB-3
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">EB-2</h3>
              <p className="text-sm text-gray-600">
                Master&apos;s degree or bachelor&apos;s + 5 years experience. Shorter backlogs for India/China.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">EB-3</h3>
              <p className="text-sm text-gray-600">
                Bachelor&apos;s degree or 2 years experience. More accessible but longer backlogs.
              </p>
            </div>
          </div>

          {/* Key Considerations */}
          <h2 className="text-lg font-semibold text-gray-900 mt-10 mb-4">
            Key Points
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-gray-900">H-1B 6-year limit:</strong> Extend beyond
                6 years with an approved I-140 or PERM pending 365+ days.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-gray-900">Concurrent filing:</strong> If your priority
                date is current when I-140 is filed, file I-485 simultaneously.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-gray-900">Priority date portability:</strong> An approved
                I-140&apos;s priority date can transfer to a new employer&apos;s case.
              </span>
            </li>
          </ul>

          {/* CTA */}
          <div className="mt-10 p-5 rounded-xl bg-brand-50 border border-brand-100">
            <h3 className="font-semibold text-gray-900 mb-2">
              See your H-1B to green card timeline
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter your country and current status to see a personalized timeline with
              current processing times and visa bulletin dates.
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
