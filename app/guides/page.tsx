import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Immigration Guides - US Visa & Green Card Pathways",
  description:
    "Comprehensive guides on US immigration pathways including H-1B to Green Card, TN visa, EB-2 NIW, PERM process, and strategies for India and China backlogs.",
  keywords: [
    "US immigration guide",
    "green card guide",
    "H-1B to green card",
    "TN visa green card",
    "EB-2 NIW guide",
    "PERM process guide",
    "India green card backlog",
    "China green card backlog",
    "employment-based immigration",
  ],
  openGraph: {
    title: "Immigration Guides - US Visa & Green Card Pathways | Stateside",
    description:
      "Comprehensive guides on US immigration pathways including H-1B, TN visa, EB-2 NIW, and strategies for dealing with backlogs.",
  },
};

const guides = [
  {
    title: "H-1B to Green Card",
    description:
      "Complete guide to transitioning from H-1B specialty occupation visa to permanent residence through EB-2 or EB-3.",
    href: "/guides/h1b-to-green-card",
    category: "Visa Pathways",
    readTime: "12 min read",
    icon: "🎯",
  },
  {
    title: "TN to Green Card",
    description:
      "How Canadian and Mexican professionals can navigate from TN visa to green card while managing dual intent concerns.",
    href: "/guides/tn-to-green-card",
    category: "Visa Pathways",
    readTime: "10 min read",
    icon: "🍁",
  },
  {
    title: "EB-2 NIW (National Interest Waiver)",
    description:
      "Self-petition for a green card without employer sponsorship. Learn the requirements, evidence needed, and success strategies.",
    href: "/guides/eb2-niw",
    category: "Self-Petition",
    readTime: "15 min read",
    icon: "⭐",
  },
  {
    title: "PERM Labor Certification",
    description:
      "Step-by-step guide to the PERM process including prevailing wage, recruitment, and common pitfalls to avoid.",
    href: "/guides/perm-process",
    category: "Process Guide",
    readTime: "14 min read",
    icon: "📋",
  },
  {
    title: "India Green Card Backlog",
    description:
      "Strategies for Indian nationals facing decades-long EB-2/EB-3 backlogs. Explore EB-1, NIW, and other options.",
    href: "/guides/india-green-card-backlog",
    category: "Country-Specific",
    readTime: "11 min read",
    icon: "🇮🇳",
  },
  {
    title: "China Green Card Backlog",
    description:
      "Navigate the employment-based green card backlog for Chinese nationals with practical strategies and timeline estimates.",
    href: "/guides/china-green-card-backlog",
    category: "Country-Specific",
    readTime: "10 min read",
    icon: "🇨🇳",
  },
];

const categories = ["All", "Visa Pathways", "Self-Petition", "Process Guide", "Country-Specific"];

export default function GuidesPage() {
  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Immigration Guides
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Comprehensive, up-to-date guides on US immigration pathways. 
              Learn about visa options, green card processes, and strategies 
              for your specific situation.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                Updated regularly
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Based on official sources
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-brand-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{guide.icon}</span>
                <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded-full">
                  {guide.category}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                {guide.title}
              </h2>
              <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                {guide.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500">{guide.readTime}</span>
                <span className="text-brand-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Read guide
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-brand-500 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Ready to plan your immigration journey?
          </h2>
          <p className="mt-3 text-brand-100 max-w-2xl mx-auto">
            Use our interactive timeline tool to visualize your path to a green card 
            with personalized estimates based on your situation.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-600 font-semibold rounded-lg hover:bg-brand-50 transition-colors"
          >
            Try the Timeline Tool
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
