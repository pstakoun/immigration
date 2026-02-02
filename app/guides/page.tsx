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
  },
  {
    slug: "tn-to-green-card",
    title: "TN Visa to Green Card",
    description:
      "Options for Canadian and Mexican professionals to transition from TN status to permanent residence.",
    tag: null,
  },
  {
    slug: "eb2-niw",
    title: "EB-2 NIW (National Interest Waiver)",
    description:
      "Self-petition path without employer sponsorship. Requirements, evidence, and realistic timelines.",
    tag: "Self-petition",
  },
  {
    slug: "perm-process",
    title: "PERM Labor Certification",
    description:
      "Deep dive into the DOL labor certification process. Recruitment, prevailing wage, and audit risks.",
    tag: null,
  },
];

export default function GuidesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        Immigration Guides
      </h1>
      <p className="text-gray-600 mb-8">
        Practical information for navigating US employment-based immigration.
      </p>

      <div className="divide-y divide-gray-100">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group flex items-start gap-4 py-5 -mx-2 px-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-medium text-gray-900 group-hover:text-brand-600 transition-colors">
                  {guide.title}
                </h2>
                {guide.tag && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {guide.tag}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {guide.description}
              </p>
            </div>
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-brand-500 flex-shrink-0 mt-1 transition-colors"
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
    </div>
  );
}
