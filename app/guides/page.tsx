import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Immigration Guides",
  description:
    "Practical guides for US immigration pathways. Learn about H-1B to green card, TN visa, EB-2 NIW, and PERM labor certification processes.",
};

// Timeline step definitions for each guide
const guides = [
  {
    slug: "h1b-to-green-card",
    title: "H-1B to Green Card",
    subtitle: "Employer-sponsored EB-2/EB-3",
    description: "PERM labor certification, I-140 petition, and I-485 adjustment of status.",
    steps: [
      { id: "perm", label: "PERM", duration: "12-18mo", color: "emerald" as const },
      { id: "i140", label: "I-140", duration: "15d-9mo", color: "emerald" as const },
      { id: "i485", label: "I-485", duration: "10-18mo", color: "amber" as const },
    ],
    totalTime: "2-4 years",
    note: "Longer for India/China",
  },
  {
    slug: "tn-to-green-card",
    title: "TN to Green Card",
    subtitle: "Canadian & Mexican professionals",
    description: "Transition from TN status while managing dual intent considerations.",
    steps: [
      { id: "h1b", label: "H-1B", duration: "optional", color: "brand" as const },
      { id: "perm", label: "PERM", duration: "12-18mo", color: "emerald" as const },
      { id: "i140", label: "I-140", duration: "15d", color: "emerald" as const },
      { id: "i485", label: "I-485", duration: "10-18mo", color: "amber" as const },
    ],
    totalTime: "2-3 years",
    note: "No backlog for Canada/Mexico",
  },
  {
    slug: "eb2-niw",
    title: "EB-2 NIW",
    subtitle: "National Interest Waiver",
    description: "Self-petition without employer sponsorship or labor certification.",
    steps: [
      { id: "i140", label: "I-140 NIW", duration: "6-12mo", color: "emerald" as const },
      { id: "i485", label: "I-485", duration: "10-18mo", color: "amber" as const },
    ],
    totalTime: "1-3 years",
    note: "No PERM required",
  },
  {
    slug: "perm-process",
    title: "PERM Process",
    subtitle: "Labor certification deep-dive",
    description: "Prevailing wage, recruitment, and DOL processing timelines.",
    steps: [
      { id: "pwd", label: "PWD", duration: "5-7mo", color: "emerald" as const },
      { id: "recruit", label: "Recruit", duration: "2-3mo", color: "emerald" as const },
      { id: "filing", label: "DOL Review", duration: "12-17mo", color: "emerald" as const },
    ],
    totalTime: "18-24 months",
    note: "Add 6-12mo if audited",
  },
];

export default function GuidesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          Immigration Guides
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Visual breakdowns of employment-based immigration paths. See where each step fits
          in the overall timeline.
        </p>
      </div>

      {/* Guides */}
      <div className="space-y-4">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group block p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white transition-all"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                  {guide.title}
                </h2>
                <p className="text-sm text-gray-500">{guide.subtitle}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-medium text-gray-900">{guide.totalTime}</div>
                <div className="text-xs text-gray-500">{guide.note}</div>
              </div>
            </div>

            {/* Visual timeline */}
            <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1">
              {guide.steps.map((step, index) => {
                const colorClasses = {
                  emerald: "bg-emerald-500",
                  amber: "bg-amber-500",
                  brand: "bg-brand-500",
                };
                const bgColorClasses = {
                  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
                  amber: "bg-amber-50 text-amber-700 border-amber-200",
                  brand: "bg-brand-50 text-brand-700 border-brand-200",
                };
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`
                      px-2.5 py-1 rounded border text-xs font-medium
                      ${bgColorClasses[step.color]}
                    `}>
                      <span>{step.label}</span>
                      <span className="ml-1 opacity-60">{step.duration}</span>
                    </div>
                    {index < guide.steps.length - 1 && (
                      <svg className="w-4 h-4 mx-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-sm text-gray-600">{guide.description}</p>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 p-6 rounded-xl bg-gray-50 border border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">See your personalized timeline</h3>
            <p className="text-sm text-gray-600">
              Enter your details to see exactly how long your path will take.
            </p>
          </div>
          <Link
            href="/"
            className="flex-shrink-0 px-4 py-2 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors"
          >
            Open App
          </Link>
        </div>
      </div>
    </div>
  );
}
