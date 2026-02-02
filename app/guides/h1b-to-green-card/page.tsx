import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "H-1B to Green Card: Complete 2025 Guide | Timeline & Process",
  description:
    "Learn how to transition from H-1B visa to green card through EB-2 or EB-3. Understand PERM, I-140, I-485 processing times, and strategies to minimize wait time.",
  keywords: [
    "H-1B to green card",
    "H-1B green card timeline",
    "H-1B to permanent residence",
    "EB-2 green card",
    "EB-3 green card",
    "PERM process H-1B",
    "I-140 H-1B",
    "H-1B 6 year limit",
    "H-1B extension beyond 6 years",
    "green card sponsorship",
  ],
  openGraph: {
    title: "H-1B to Green Card: Complete 2025 Guide | Stateside",
    description:
      "Step-by-step guide to transitioning from H-1B visa to green card through employment-based immigration.",
    type: "article",
  },
  alternates: {
    canonical: "https://stateside.app/guides/h1b-to-green-card",
  },
};

const steps = [
  {
    number: 1,
    title: "Prevailing Wage Determination (PWD)",
    duration: "5-7 months",
    description:
      "Your employer requests a wage determination from the Department of Labor for your job position and location.",
    details: [
      "Employer files ETA-9141 with DOL",
      "DOL determines minimum salary requirement",
      "Valid for specific job duties and work location",
      "Can request redetermination if wage seems incorrect",
    ],
  },
  {
    number: 2,
    title: "PERM Recruitment",
    duration: "2-3 months",
    description:
      "Employer conducts a labor market test to prove no qualified US workers are available for the position.",
    details: [
      "30-day job posting on employer website",
      "Two Sunday newspaper advertisements",
      "State Workforce Agency job order",
      "Three additional recruitment methods required",
      "Must document and reject unqualified US applicants",
    ],
  },
  {
    number: 3,
    title: "PERM Labor Certification",
    duration: "12-18 months",
    description:
      "File ETA-9089 with DOL to certify that hiring you won't adversely affect US workers.",
    details: [
      "File within 180 days of recruitment completion",
      "DOL reviews application for compliance",
      "May be selected for audit (adds 6+ months)",
      "Approved PERM valid for 180 days",
      "Priority date established when PERM is filed",
    ],
  },
  {
    number: 4,
    title: "I-140 Immigrant Petition",
    duration: "6-9 months (or 15 days with premium)",
    description:
      "Employer files petition proving you qualify for EB-2 or EB-3 category and can pay the offered wage.",
    details: [
      "Must file within 180 days of PERM approval",
      "Premium processing available ($2,805 for 15-day decision)",
      "Locks in your priority date permanently",
      "I-140 remains valid even if you change employers (after 180 days)",
    ],
  },
  {
    number: 5,
    title: "Priority Date Wait (if applicable)",
    duration: "Varies by country",
    description:
      "Wait for your priority date to become current according to the monthly Visa Bulletin.",
    details: [
      "No wait for most countries (dates are current)",
      "India EB-2: ~10+ years backlog",
      "India EB-3: ~10+ years backlog", 
      "China EB-2/EB-3: 2-4 years backlog",
      "Can use H-1B extensions beyond 6 years while waiting",
    ],
  },
  {
    number: 6,
    title: "I-485 Adjustment of Status",
    duration: "10-18 months",
    description:
      "File your green card application once your priority date is current (or file concurrently if current).",
    details: [
      "Can file I-485, I-765 (EAD), and I-131 (AP) together",
      "EAD allows work for any employer",
      "Advance Parole allows international travel",
      "AC21 portability after 180 days pending",
      "Interview may be required at local USCIS office",
    ],
  },
];

const faqs = [
  {
    question: "Can I change employers during the green card process?",
    answer:
      "Yes, but timing matters. Before I-140 approval, you generally need to restart the process. After I-140 approval and 180 days, your priority date is portable. After I-485 pending for 180 days, you can change to a 'same or similar' job under AC21 portability.",
  },
  {
    question: "What happens if my H-1B reaches the 6-year limit?",
    answer:
      "If you have an approved I-140 or a PERM pending for over 365 days, you can extend H-1B beyond 6 years in 1 or 3-year increments until your green card is approved.",
  },
  {
    question: "Should I choose EB-2 or EB-3?",
    answer:
      "EB-2 requires a Master's degree (or Bachelor's + 5 years experience) and is typically faster for most countries. EB-3 has lower requirements but similar wait times for backlogged countries. Some people file both ('downgrade') to hedge their bets.",
  },
  {
    question: "Can my spouse work while my green card is pending?",
    answer:
      "Yes, H-4 spouses can apply for an EAD if you (the H-1B holder) have an approved I-140 or are in H-1B status beyond 6 years. Once I-485 is filed, both you and your spouse can get EADs.",
  },
  {
    question: "What is concurrent filing?",
    answer:
      "If your priority date is already current when your I-140 is ready, you can file I-140 and I-485 together. This is common for applicants from countries without backlogs and can save months.",
  },
];

export default function H1BToGreenCardGuide() {
  return (
    <article className="bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Link 
            href="/guides" 
            className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 mb-4"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            All Guides
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🎯</span>
            <span className="text-sm font-medium text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              Visa Pathways
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            H-1B to Green Card: Complete Guide
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Everything you need to know about transitioning from H-1B specialty occupation 
            visa to permanent residence through employer sponsorship.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span>Updated January 2025</span>
            <span>•</span>
            <span>12 min read</span>
            <span>•</span>
            <span>Based on USCIS & DOL data</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-brand-600">2-3 years</div>
              <div className="text-sm text-gray-500">Typical timeline*</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-600">$10-15k</div>
              <div className="text-sm text-gray-500">Total cost</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-600">EB-2/EB-3</div>
              <div className="text-sm text-gray-500">GC category</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-600">6 steps</div>
              <div className="text-sm text-gray-500">Major milestones</div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            *For countries without significant backlogs. India/China nationals face longer waits.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-gray-100 rounded-xl p-6 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">In This Guide</h2>
          <ul className="space-y-2">
            <li>
              <a href="#overview" className="text-brand-600 hover:text-brand-700">
                Overview: H-1B to Green Card Process
              </a>
            </li>
            <li>
              <a href="#steps" className="text-brand-600 hover:text-brand-700">
                Step-by-Step Process
              </a>
            </li>
            <li>
              <a href="#eb2-vs-eb3" className="text-brand-600 hover:text-brand-700">
                EB-2 vs EB-3: Which Should You Choose?
              </a>
            </li>
            <li>
              <a href="#timeline" className="text-brand-600 hover:text-brand-700">
                Timeline by Country
              </a>
            </li>
            <li>
              <a href="#h1b-extensions" className="text-brand-600 hover:text-brand-700">
                H-1B Extensions Beyond 6 Years
              </a>
            </li>
            <li>
              <a href="#faq" className="text-brand-600 hover:text-brand-700">
                Frequently Asked Questions
              </a>
            </li>
          </ul>
        </div>

        {/* Overview */}
        <section id="overview" className="prose prose-lg max-w-none mb-12">
          <h2 className="text-2xl font-bold text-gray-900">Overview: H-1B to Green Card Process</h2>
          <p>
            The H-1B to green card journey is the most common path for skilled workers to become 
            permanent residents of the United States. This employment-based immigration process 
            requires your employer to sponsor you and involves several government agencies: 
            the Department of Labor (DOL) and US Citizenship and Immigration Services (USCIS).
          </p>
          <p>
            The process consists of three main phases:
          </p>
          <ol>
            <li>
              <strong>PERM Labor Certification</strong> – Your employer proves to DOL that no 
              qualified US workers are available for your position.
            </li>
            <li>
              <strong>I-140 Immigrant Petition</strong> – Your employer petitions USCIS to 
              classify you as an eligible immigrant worker.
            </li>
            <li>
              <strong>I-485 Adjustment of Status</strong> – You apply for permanent residence 
              and receive your green card.
            </li>
          </ol>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 not-prose">
            <div className="flex gap-3">
              <span className="text-amber-500">⚠️</span>
              <div>
                <p className="font-medium text-amber-800">Important Note for India & China</p>
                <p className="text-sm text-amber-700 mt-1">
                  Due to per-country limits, nationals of India and China face significant backlogs 
                  in the EB-2 and EB-3 categories. The total wait can exceed 10 years. Consider 
                  exploring EB-1 or EB-2 NIW options if you qualify.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section id="steps" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Process</h2>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {step.title}
                        </h3>
                        <span className="text-sm font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <svg
                              className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="px-6 pb-4">
                    <div className="h-8 w-0.5 bg-gray-200 ml-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* EB-2 vs EB-3 */}
        <section id="eb2-vs-eb3" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">EB-2 vs EB-3: Which Should You Choose?</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Criteria</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">EB-2</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">EB-3</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Education Required</td>
                    <td className="px-6 py-4 text-gray-600">Master&apos;s degree OR Bachelor&apos;s + 5 years experience</td>
                    <td className="px-6 py-4 text-gray-600">Bachelor&apos;s degree (or 2+ years skilled work)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Current Wait (Non-backlogged)</td>
                    <td className="px-6 py-4 text-gray-600">Current (no wait)</td>
                    <td className="px-6 py-4 text-gray-600">Current (no wait)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Current Wait (India)</td>
                    <td className="px-6 py-4 text-gray-600">10+ years</td>
                    <td className="px-6 py-4 text-gray-600">10+ years</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Current Wait (China)</td>
                    <td className="px-6 py-4 text-gray-600">3-4 years</td>
                    <td className="px-6 py-4 text-gray-600">2-3 years</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">NIW Option</td>
                    <td className="px-6 py-4 text-gray-600">Yes (self-petition, no PERM)</td>
                    <td className="px-6 py-4 text-gray-600">No</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            <strong>Pro tip:</strong> Some applicants file both EB-2 and EB-3 simultaneously 
            (called &quot;downgrading&quot;) to have flexibility depending on which category moves faster 
            in the visa bulletin.
          </p>
        </section>

        {/* Timeline by Country */}
        <section id="timeline" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Timeline by Country of Birth</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-2xl mb-2">🌍</div>
              <h3 className="font-semibold text-gray-900">Most Countries</h3>
              <p className="text-sm text-gray-500 mt-1">ROW (Rest of World)</p>
              <div className="mt-4 text-3xl font-bold text-green-600">2-3 years</div>
              <p className="text-sm text-gray-500 mt-1">No priority date backlog</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-2xl mb-2">🇨🇳</div>
              <h3 className="font-semibold text-gray-900">China</h3>
              <p className="text-sm text-gray-500 mt-1">Mainland China born</p>
              <div className="mt-4 text-3xl font-bold text-amber-600">4-6 years</div>
              <p className="text-sm text-gray-500 mt-1">Moderate backlog</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-2xl mb-2">🇮🇳</div>
              <h3 className="font-semibold text-gray-900">India</h3>
              <p className="text-sm text-gray-500 mt-1">India born</p>
              <div className="mt-4 text-3xl font-bold text-red-600">10+ years</div>
              <p className="text-sm text-gray-500 mt-1">Significant backlog</p>
            </div>
          </div>
        </section>

        {/* H-1B Extensions */}
        <section id="h1b-extensions" className="mb-12 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900">H-1B Extensions Beyond 6 Years</h2>
          <p>
            The standard H-1B visa has a 6-year maximum stay. However, if you&apos;re in the green card 
            process, you can extend beyond this limit under the American Competitiveness in the 
            Twenty-First Century Act (AC21):
          </p>
          <div className="bg-white rounded-xl border border-gray-200 p-6 not-prose">
            <h3 className="font-semibold text-gray-900 mb-4">Extension Options</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">3-Year Extensions (AC21 §106(a))</p>
                  <p className="text-sm text-gray-600 mt-1">
                    If you have an approved I-140, you can get 3-year H-1B extensions 
                    until your green card is approved.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">1-Year Extensions (AC21 §104(c))</p>
                  <p className="text-sm text-gray-600 mt-1">
                    If your PERM has been pending for over 365 days (even without I-140), 
                    you can get 1-year H-1B extensions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-brand-500 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white">
            Visualize Your H-1B to Green Card Timeline
          </h2>
          <p className="mt-3 text-brand-100 max-w-xl mx-auto">
            Use our interactive tool to see a personalized timeline based on your 
            education, experience, and country of birth.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-600 font-semibold rounded-lg hover:bg-brand-50 transition-colors"
          >
            Plan My Path
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
