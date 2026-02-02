import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "India Green Card Backlog: EB-2/EB-3 Wait Times & Strategies | 2025",
  description:
    "Complete guide to the India green card backlog. Learn current EB-2 and EB-3 wait times, visa bulletin analysis, and strategies to reduce your wait including EB-1, NIW, and EB-5.",
  keywords: [
    "India green card backlog",
    "India EB-2 backlog",
    "India EB-3 backlog",
    "Indian green card wait time",
    "India visa bulletin",
    "EB-2 India wait time",
    "EB-3 India wait time",
    "India immigration backlog",
    "green card for Indians",
    "H-1B India green card",
  ],
  openGraph: {
    title: "India Green Card Backlog Guide | Stateside",
    description:
      "Strategies for Indian nationals facing decades-long EB-2/EB-3 backlogs.",
    type: "article",
  },
  alternates: {
    canonical: "https://stateside.app/guides/india-green-card-backlog",
  },
};

const strategies = [
  {
    title: "EB-1A: Extraordinary Ability",
    timeline: "2-3 years",
    backlogImpact: "Minimal - often current",
    description:
      "Self-petition for individuals with extraordinary ability in sciences, arts, education, business, or athletics.",
    requirements: [
      "Major international award, OR",
      "Meet 3 of 10 evidence criteria",
      "No employer sponsorship required",
    ],
    pros: ["No PERM required", "Self-petition option", "Shorter backlog than EB-2/EB-3"],
    cons: ["High evidentiary bar", "Not everyone qualifies"],
    bestFor: "Researchers, scientists, senior engineers with publications/patents, artists with recognition",
  },
  {
    title: "EB-1B: Outstanding Researcher",
    timeline: "2-3 years",
    backlogImpact: "Minimal - often current",
    description:
      "For outstanding professors and researchers with international recognition in their academic field.",
    requirements: [
      "3+ years of research or teaching experience",
      "International recognition in academic field",
      "Employer must offer permanent research position",
    ],
    pros: ["No PERM required", "Clear criteria for academics"],
    cons: ["Requires employer sponsorship", "Limited to academic/research roles"],
    bestFor: "University professors, research scientists, R&D researchers",
  },
  {
    title: "EB-2 NIW: National Interest Waiver",
    timeline: "2-3 years (processing) + EB-2 India backlog",
    backlogImpact: "Same as EB-2 (significant)",
    description:
      "Self-petition without employer or PERM, but still subject to EB-2 India backlog.",
    requirements: [
      "Advanced degree or exceptional ability",
      "Work benefits US national interest",
      "Meet 3-prong Dhanasar test",
    ],
    pros: ["No employer dependency", "No PERM (saves 1.5 years)", "Job flexibility"],
    cons: ["Still subject to EB-2 backlog", "Requires strong evidence"],
    bestFor: "Anyone who qualifies for EB-2 but wants employer independence",
  },
  {
    title: "EB-5: Investor Visa",
    timeline: "2-4 years",
    backlogImpact: "Reserved visas available for TEA investments",
    description:
      "Green card through $800k+ investment. TEA (Targeted Employment Area) investments have reserved visa numbers.",
    requirements: [
      "$800,000 investment in TEA, or $1,050,000 standard",
      "Create 10 full-time US jobs",
      "Prove lawful source of funds",
    ],
    pros: ["Reserved visa numbers (no backlog for TEA)", "No employer needed", "Family included"],
    cons: ["High capital requirement", "Investment risk", "Complex compliance"],
    bestFor: "Those with significant capital who want to skip the EB backlog entirely",
  },
  {
    title: "Country of Chargeability Change",
    timeline: "Varies",
    backlogImpact: "Potentially eliminates backlog",
    description:
      "If your spouse was born in a non-backlogged country, you may be able to use their chargeability.",
    requirements: [
      "Spouse born in non-backlogged country",
      "Filing together for green cards",
      "Cross-chargeability rules apply",
    ],
    pros: ["Can completely eliminate backlog", "Legal and well-established"],
    cons: ["Depends on spouse's birthplace", "Not applicable to everyone"],
    bestFor: "Those married to spouse born outside India/China",
  },
];

const currentWaitTimes = [
  { category: "EB-1", estimate: "1-2 years", notes: "Occasionally current, short backlog" },
  { category: "EB-2", estimate: "10-15+ years", notes: "Priority dates from ~2012 currently processing" },
  { category: "EB-3", estimate: "10-15+ years", notes: "Similar to EB-2, sometimes slightly different movement" },
  { category: "EB-5 (TEA)", estimate: "2-4 years", notes: "Reserved visas, shorter wait" },
];

const faqs = [
  {
    question: "Why is the India green card backlog so long?",
    answer:
      "US immigration law limits each country to 7% of total employment-based green cards annually (~9,800 visas). With far more Indian applicants than available visas, a massive backlog has built up. The current queue is estimated at 800,000+ Indians waiting for EB-2/EB-3 green cards.",
  },
  {
    question: "How long is the current wait for EB-2 India?",
    answer:
      "As of 2025, the EB-2 India backlog means priority dates from approximately 2012-2013 are currently being processed. New applicants filing today face an estimated 10-15+ year wait, though this is difficult to predict precisely due to visa bulletin fluctuations and legislative uncertainty.",
  },
  {
    question: "Should I file EB-2 or EB-3?",
    answer:
      "Many Indians file both (EB-2 and EB-3 'downgrade') to have options. Sometimes EB-3 moves faster than EB-2, allowing people to switch. Having both approved I-140s gives flexibility. Your attorney can help determine if this strategy makes sense for your situation.",
  },
  {
    question: "Can I keep my priority date if I change employers?",
    answer:
      "Yes! After your I-140 is approved for 180 days (or if your employer doesn't revoke it), your priority date is portable. You can use it with a new employer's PERM and I-140. This is crucial for Indians given the long wait—you can change jobs without losing your place in line.",
  },
  {
    question: "What happens to my kids who turn 21 during the wait?",
    answer:
      "Children who 'age out' (turn 21) while waiting can lose their derivative status. The Child Status Protection Act (CSPA) provides some relief by subtracting time the I-140 was pending from their age. This is a complex area—consult an attorney for your specific situation.",
  },
  {
    question: "Is there any hope for immigration reform?",
    answer:
      "Various bills have been proposed (like eliminating per-country caps) but none have passed. While there's ongoing advocacy, predicting legislative outcomes is unreliable. Most Indians in the queue focus on strategies within the current system rather than waiting for reform.",
  },
];

export default function IndiaBacklogGuide() {
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
            <span className="text-4xl">🇮🇳</span>
            <span className="text-sm font-medium text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              Country-Specific
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            India Green Card Backlog Guide
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Strategies and options for Indian nationals facing decades-long employment-based 
            green card backlogs.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span>Updated January 2025</span>
            <span>•</span>
            <span>11 min read</span>
            <span>•</span>
            <span>Based on visa bulletin data</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Current Wait Times */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Estimated Wait Times (India)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-semibold text-gray-900">Category</th>
                  <th className="text-left py-3 font-semibold text-gray-900">Estimated Wait</th>
                  <th className="text-left py-3 font-semibold text-gray-900">Notes</th>
                </tr>
              </thead>
              <tbody>
                {currentWaitTimes.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 font-medium text-gray-900">{row.category}</td>
                    <td className={`py-3 font-bold ${
                      row.estimate.includes("10") ? "text-red-600" : "text-amber-600"
                    }`}>
                      {row.estimate}
                    </td>
                    <td className="py-3 text-gray-500">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Wait times are estimates based on current visa bulletin movement. Actual times may vary.
          </p>
        </div>

        {/* The Reality */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-12">
          <div className="flex gap-4">
            <span className="text-2xl">📊</span>
            <div>
              <h3 className="font-semibold text-red-900">The Numbers</h3>
              <p className="text-red-800 mt-2">
                As of 2025, approximately <strong>800,000+ Indians</strong> are waiting for 
                employment-based green cards. With only ~9,800 visas available per country 
                annually, the math is sobering. At current rates, the backlog would take 
                <strong> 80+ years</strong> to clear without legislative reform.
              </p>
            </div>
          </div>
        </div>

        {/* Strategies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Strategies to Reduce Your Wait</h2>
          <div className="space-y-6">
            {strategies.map((strategy, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{strategy.title}</h3>
                    <span className="text-sm font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                      {strategy.timeline}
                    </span>
                    <span className={`text-sm font-medium px-2 py-0.5 rounded ${
                      strategy.backlogImpact.includes("Minimal") || strategy.backlogImpact.includes("eliminates")
                        ? "bg-green-50 text-green-700"
                        : strategy.backlogImpact.includes("significant")
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      Backlog: {strategy.backlogImpact}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{strategy.description}</p>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
                      <ul className="space-y-1">
                        {strategy.requirements.map((req, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-1">
                            <span className="text-gray-400">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-green-700 mb-2">Pros:</h4>
                      <ul className="space-y-1">
                        {strategy.pros.map((pro, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-1">
                            <span className="text-green-500">+</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-red-700 mb-2">Cons:</h4>
                      <ul className="space-y-1">
                        {strategy.cons.map((con, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-1">
                            <span className="text-red-500">-</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-3">
                    <span className="text-sm text-blue-800">
                      <strong>Best for:</strong> {strategy.bestFor}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* While You Wait */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Managing Life During the Wait</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">H-1B Extensions</h3>
              <p className="text-sm text-gray-600">
                With an approved I-140, you can extend H-1B indefinitely beyond the 6-year 
                limit in 3-year increments until your green card is approved.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">H-4 EAD for Spouse</h3>
              <p className="text-sm text-gray-600">
                Your H-4 spouse can get work authorization (EAD) once you have an approved 
                I-140 or are in H-1B status beyond 6 years.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Priority Date Portability</h3>
              <p className="text-sm text-gray-600">
                Your priority date is portable after I-140 approval (180 days). Change 
                employers without losing your place in line.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Multiple I-140s</h3>
              <p className="text-sm text-gray-600">
                File EB-2 and EB-3 simultaneously to have options. When one category moves 
                faster, you can use that approved I-140.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
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
            Explore All Your Options
          </h2>
          <p className="mt-3 text-brand-100 max-w-xl mx-auto">
            Use our interactive timeline tool to compare EB-1, EB-2 NIW, and other paths 
            side-by-side to find the fastest route to your green card.
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
