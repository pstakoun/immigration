import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Immigration Guides",
  description:
    "Practical guides for US immigration pathways. Learn about H-1B to green card, TN visa, EB-2 NIW, and PERM labor certification processes.",
};

// Visual timeline bar for index page
function MiniTimeline({
  steps,
}: {
  steps: { label: string; width: number; color: string }[];
}) {
  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    brand: "bg-brand-500",
  };
  
  return (
    <div className="flex items-stretch h-6 rounded overflow-hidden mt-3">
      {steps.map((step, i) => (
        <div
          key={i}
          className={`${colorClasses[step.color]} flex items-center justify-center text-xs text-white font-medium ${i > 0 ? "border-l border-white/20" : ""}`}
          style={{ width: `${step.width}%` }}
        >
          {step.label}
        </div>
      ))}
    </div>
  );
}

const guides = [
  {
    slug: "h1b-to-green-card",
    title: "H-1B to Green Card",
    subtitle: "Employer-sponsored EB-2/EB-3",
    totalTime: "2–4 years",
    note: "longer for India/China",
    steps: [
      { label: "PERM", width: 45, color: "emerald" },
      { label: "I-140", width: 20, color: "emerald" },
      { label: "I-485", width: 35, color: "amber" },
    ],
  },
  {
    slug: "tn-to-green-card",
    title: "TN to Green Card",
    subtitle: "Canadian & Mexican professionals",
    totalTime: "2–3 years",
    note: "no backlog",
    steps: [
      { label: "PERM", width: 40, color: "emerald" },
      { label: "I-140", width: 15, color: "emerald" },
      { label: "I-485", width: 45, color: "amber" },
    ],
  },
  {
    slug: "eb2-niw",
    title: "EB-2 NIW",
    subtitle: "Self-petition, no employer needed",
    totalTime: "1–3 years",
    note: "skip PERM",
    steps: [
      { label: "I-140 NIW", width: 40, color: "emerald" },
      { label: "I-485", width: 60, color: "amber" },
    ],
  },
  {
    slug: "perm-process",
    title: "PERM Process",
    subtitle: "Labor certification deep-dive",
    totalTime: "18–24 mo",
    note: "add 6–12 mo if audited",
    steps: [
      { label: "PWD", width: 25, color: "emerald" },
      { label: "Recruit", width: 15, color: "emerald" },
      { label: "DOL", width: 60, color: "emerald" },
    ],
  },
];

export default function GuidesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          Immigration Guides
        </h1>
        <p className="text-gray-600 max-w-xl">
          Step-by-step breakdowns with current processing times.
        </p>
      </div>

      <div className="space-y-4">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group block p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                  {guide.title}
                </h2>
                <p className="text-sm text-gray-500">{guide.subtitle}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xl font-semibold text-gray-900">{guide.totalTime}</div>
                <div className="text-xs text-gray-500">{guide.note}</div>
              </div>
            </div>
            <MiniTimeline steps={guide.steps} />
          </Link>
        ))}
      </div>

      {/* Bottom section */}
      <div className="mt-10 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <p className="text-gray-600">
            Enter your details to see personalized timelines.
          </p>
          <Link
            href="/"
            className="flex-shrink-0 px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
          >
            See your timeline →
          </Link>
        </div>
      </div>
    </div>
  );
}
