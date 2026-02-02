import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Guides on US immigration pathways: H-1B to green card, TN visa, EB-2 NIW, and PERM labor certification.",
  openGraph: {
    title: "Guides",
    description:
      "Guides on US immigration pathways: H-1B, TN visa, EB-2 NIW, and PERM.",
  },
};

const guides = [
  {
    title: "H-1B to Green Card",
    description:
      "The standard path from H-1B to permanent residence through employer sponsorship.",
    href: "/guides/h1b-to-green-card",
    tag: "Most common",
  },
  {
    title: "TN to Green Card",
    description:
      "How Canadians and Mexicans can go from TN status to a green card.",
    href: "/guides/tn-to-green-card",
  },
  {
    title: "EB-2 NIW",
    description:
      "Self-petition for a green card without employer sponsorship or PERM.",
    href: "/guides/eb2-niw",
    tag: "Self-petition",
  },
  {
    title: "PERM Labor Certification",
    description:
      "Step-by-step breakdown of the PERM process, timelines, and what to expect.",
    href: "/guides/perm-process",
  },
];

export default function GuidesPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-2xl font-semibold text-gray-900">Guides</h1>
        <p className="mt-2 text-gray-600">
          Deep dives into specific immigration pathways.
        </p>

        <div className="mt-8 space-y-1">
          {guides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="block py-4 -mx-4 px-4 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors">
                      {guide.title}
                    </h2>
                    {guide.tag && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {guide.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {guide.description}
                  </p>
                </div>
                <svg 
                  className="w-5 h-5 text-gray-400 group-hover:text-brand-500 transition-colors flex-shrink-0 mt-0.5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
