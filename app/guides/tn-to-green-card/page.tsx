import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TN Visa to Green Card",
  description:
    "Guide for Canadian and Mexican TN visa holders seeking permanent residence. Understand dual intent concerns and the path to a green card.",
};

const steps = [
  { id: "tn", label: "TN Status", duration: "current", color: "brand" },
  { id: "perm", label: "PERM", duration: "12-18mo", color: "emerald" },
  { id: "i140", label: "I-140", duration: "15d", color: "emerald" },
  { id: "i485", label: "I-485", duration: "10-18mo", color: "amber" },
];

function TimelineNav({ activeStep }: { activeStep?: string }) {
  const colorMap: Record<string, { active: string; inactive: string }> = {
    brand: { active: "bg-brand-500 text-white", inactive: "bg-brand-50 text-brand-700 border-brand-200" },
    emerald: { active: "bg-emerald-500 text-white", inactive: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    amber: { active: "bg-amber-500 text-white", inactive: "bg-amber-50 text-amber-700 border-amber-200" },
  };
  
  return (
    <div className="flex items-center gap-1 py-3 overflow-x-auto">
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
              {step.duration !== "current" && (
                <span className={`ml-1.5 ${isActive ? "text-white/80" : "opacity-60"}`}>
                  {step.duration}
                </span>
              )}
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
  color: "brand" | "emerald" | "amber";
}) {
  const colorClasses = {
    brand: "bg-brand-500",
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

export default function TNToGreenCardGuide() {
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
          TN Visa to Green Card
        </h1>
        <p className="text-gray-600 mb-4">
          Canadian &amp; Mexican professionals
        </p>

        {/* Visual timeline nav */}
        <div className="border-b border-gray-200 mb-6">
          <TimelineNav />
        </div>

        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            TN status has no direct path to a green card—it&apos;s technically non-immigrant.
            The challenge is <strong className="text-gray-900">dual intent</strong>: TN requires
            you to maintain intent to return home, but green card filing shows immigrant intent.
          </p>
          <p>
            The good news: Canada and Mexico have <strong className="text-gray-900">no visa backlogs</strong>,
            so once you file I-485, approval typically takes only 10-18 months.
          </p>

          {/* TN Status Section */}
          <StepHeader
            id="tn"
            title="Managing TN Status"
            color="brand"
          />
          <p>
            The dual intent issue matters most at two points: when renewing TN at the border,
            and when traveling during the green card process. Two strategies:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-3">
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Direct Filing</h3>
              <p className="text-sm text-gray-600">
                Start PERM while on TN. Risk is at border crossings during the process.
                Works if you minimize travel.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-brand-50 border border-brand-100">
              <h3 className="font-semibold text-gray-900 mb-2">Switch to H-1B First</h3>
              <p className="text-sm text-gray-600">
                H-1B allows dual intent. Adds 2-6 months but eliminates travel concerns.
                Recommended if you travel frequently.
              </p>
            </div>
          </div>

          {/* PERM Section */}
          <StepHeader
            id="perm"
            title="PERM Labor Certification"
            duration="12-18 months"
            color="emerald"
          />
          <p>
            Same process as any employer-sponsored case. Your employer proves no qualified
            US workers are available. The I-140 filing alone doesn&apos;t create intent issues—
            the risk comes when you file I-485.
          </p>

          {/* I-140 Section */}
          <StepHeader
            id="i140"
            title="I-140 Petition"
            duration="15 days with premium"
            color="emerald"
          />
          <p>
            Most employers use premium processing. Once approved, you have flexibility:
            the I-140 approval can be used even if you change employers later.
          </p>

          {/* I-485 Section */}
          <StepHeader
            id="i485"
            title="I-485 Adjustment of Status"
            duration="10-18 months"
            color="amber"
          />
          <p>
            This is when you officially have immigrant intent. Because Canada/Mexico are
            current, you can typically file I-485 immediately after I-140 approval
            (or even concurrently).
          </p>
          <p>
            Once I-485 is filed, any travel requires <strong className="text-gray-900">Advance Parole</strong>.
            Returning on AP means you&apos;re no longer in TN status—you&apos;re a &quot;parolee&quot;
            waiting for green card approval.
          </p>

          {/* Key Points */}
          <h2 className="text-lg font-semibold text-gray-900 mt-10 mb-4">
            Key Points
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-gray-900">No backlog:</strong> Canada/Mexico priority
                dates are current. Total timeline is 2-3 years.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-gray-900">Travel risk:</strong> Avoid unnecessary
                travel during the process, especially after I-485 filing.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-gray-900">Spouse/dependents:</strong> TD status
                holders face the same dual intent considerations.
              </span>
            </li>
          </ul>

          {/* CTA */}
          <div className="mt-10 p-5 rounded-xl bg-brand-50 border border-brand-100">
            <h3 className="font-semibold text-gray-900 mb-2">
              See your TN to green card timeline
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter your details to see a personalized timeline with current processing
              times. Canada and Mexico typically have no wait for visa numbers.
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
