import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Immigration Guides",
  description:
    "Practical guides for US immigration pathways. Learn about H-1B to green card, TN visa, EB-2 NIW, and PERM labor certification processes.",
};

const guides = [
  {
    slug: "h1b-to-green-card",
    title: "H-1B to Green Card",
    description:
      "The most common employment-based path. Understand PERM, I-140, and the I-485 adjustment process.",
    tag: "Most common",
    timeEstimate: "2-4 years",
  },
  {
    slug: "tn-to-green-card",
    title: "TN Visa to Green Card",
    description:
      "Options for Canadian and Mexican professionals to transition from TN status to permanent residence.",
    tag: null,
    timeEstimate: "2-3 years",
  },
  {
    slug: "eb2-niw",
    title: "EB-2 NIW (National Interest Waiver)",
    description:
      "Self-petition path without employer sponsorship. Requirements, evidence, and realistic timelines.",
    tag: "Self-petition",
    timeEstimate: "1-3 years",
  },
  {
    slug: "perm-process",
    title: "PERM Labor Certification",
    description:
      "Deep dive into the DOL labor certification process. Recruitment, prevailing wage, and audit risks.",
    tag: null,
    timeEstimate: "12-24 months",
  },
];

export default function GuidesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      {/* Header section */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          Immigration Guides
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Practical, no-nonsense guides for employment-based immigration. Each guide covers 
          timelines, requirements, and what to expect at each step.
        </p>
      </div>

      {/* Guides list */}
      <div className="border-t border-gray-200">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group flex items-start gap-4 py-6 border-b border-gray-100 hover:bg-gray-50 -mx-4 px-4 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <h2 className="text-lg font-medium text-gray-900 group-hover:text-brand-600 transition-colors">
                  {guide.title}
                </h2>
                {guide.tag && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-medium">
                    {guide.tag}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                {guide.description}
              </p>
              <span className="text-xs text-gray-400">
                Typical timeline: {guide.timeEstimate}
              </span>
            </div>
            <svg
              className="w-5 h-5 text-gray-300 group-hover:text-brand-500 flex-shrink-0 mt-1.5 transition-colors"
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
        ))}
      </div>

      {/* CTA section */}
      <div className="mt-10 pt-8 border-t border-gray-200">
        <p className="text-gray-600 mb-3">
          Already know your path? See how long it will take based on your specific situation.
        </p>
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
  );
}
