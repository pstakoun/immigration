import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "China Green Card Backlog: EB-2/EB-3 Wait Times & Strategies | 2025",
  description:
    "Guide to the China green card backlog. Learn current EB-2 and EB-3 wait times for Chinese nationals, visa bulletin analysis, and strategies to reduce your wait.",
  keywords: [
    "China green card backlog",
    "China EB-2 backlog",
    "China EB-3 backlog",
    "Chinese green card wait time",
    "China visa bulletin",
    "EB-2 China wait time",
    "EB-3 China wait time",
    "China immigration backlog",
    "green card for Chinese",
  ],
  openGraph: {
    title: "China Green Card Backlog Guide | Stateside",
    description:
      "Navigate the employment-based green card backlog for Chinese nationals.",
    type: "article",
  },
  alternates: {
    canonical: "https://stateside.app/guides/china-green-card-backlog",
  },
};

const currentWaitTimes = [
  { category: "EB-1", estimate: "Current - 1 year", notes: "Generally current or short wait" },
  { category: "EB-2", estimate: "3-5 years", notes: "Priority dates from ~2020-2021 processing" },
  { category: "EB-3", estimate: "2-4 years", notes: "Sometimes moves faster than EB-2" },
  { category: "EB-5 (TEA)", estimate: "2-3 years", notes: "Reserved visas for TEA investments" },
];

const strategies = [
  {
    title: "EB-1A: Extraordinary Ability",
    timeline: "1-2 years",
    description: "Self-petition without employer for individuals with extraordinary ability.",
    advantage: "Often current—minimal to no backlog wait",
  },
  {
    title: "EB-1B: Outstanding Researcher",
    timeline: "1-2 years",
    description: "For professors and researchers with international recognition.",
    advantage: "No PERM required, often current",
  },
  {
    title: "EB-2 NIW",
    timeline: "Process time + EB-2 backlog",
    description: "Self-petition without PERM, but still subject to EB-2 China backlog.",
    advantage: "No employer dependency, faster than PERM route",
  },
  {
    title: "EB-2 vs EB-3 Strategy",
    timeline: "Varies",
    description: "File both and use whichever becomes current first.",
    advantage: "Flexibility to switch between categories",
  },
  {
    title: "EB-5 TEA Investment",
    timeline: "2-3 years",
    description: "Reserved visas for TEA investments can bypass the regular backlog.",
    advantage: "Separate visa pool with shorter wait",
  },
];

const faqs = [
  {
    question: "How long is the China green card backlog?",
    answer:
      "The China EB-2 backlog is currently 3-5 years, with priority dates from around 2020-2021 being processed. EB-3 China is similar at 2-4 years. This is significantly shorter than India's backlog but still represents a multi-year wait for most applicants.",
  },
  {
    question: "Is the China backlog getting better or worse?",
    answer:
      "The China backlog fluctuates. It improved somewhat during COVID when fewer applications were filed, but has stabilized. Movement varies month to month based on visa availability and demand. EB-1 categories are often current for China, making them attractive alternatives.",
  },
  {
    question: "Should I file EB-2 or EB-3 as a Chinese national?",
    answer:
      "Unlike India where both are similarly backlogged, China EB-2 and EB-3 can move at different speeds. Many Chinese applicants file both to have flexibility. Your attorney can help you decide based on current visa bulletin trends and your qualifications.",
  },
  {
    question: "Can I use my spouse's country of birth if they're not from China?",
    answer:
      "Yes, cross-chargeability allows you to use your spouse's country of chargeability if they were born in a non-backlogged country. This can significantly reduce or eliminate your wait time. This is a legal and well-established practice.",
  },
  {
    question: "What about Hong Kong, Macau, or Taiwan?",
    answer:
      "Those born in Hong Kong, Macau, or Taiwan are NOT subject to the mainland China backlog. They are charged to their specific birthplace, which typically has no employment-based backlog. Only those born in mainland China face the EB backlog.",
  },
];

export default function ChinaBacklogGuide() {
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
            <span className="text-4xl">🇨🇳</span>
            <span className="text-sm font-medium text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              Country-Specific
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            China Green Card Backlog Guide
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Navigate the employment-based green card backlog for Chinese nationals with 
            practical strategies and timeline estimates.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span>Updated January 2025</span>
            <span>•</span>
            <span>10 min read</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Key Insight */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12">
          <div className="flex gap-4">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-semibold text-amber-900">Good News Relative to India</h3>
              <p className="text-amber-800 mt-2">
                While China does have an employment-based green card backlog, it&apos;s significantly 
                shorter than India&apos;s. Chinese nationals typically wait <strong>3-5 years</strong> for 
                EB-2 compared to 10+ years for Indians. EB-1 categories are often current with 
                minimal wait.
              </p>
            </div>
          </div>
        </div>

        {/* Current Wait Times */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Estimated Wait Times (China Mainland)</h2>
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
                      row.estimate.includes("Current") ? "text-green-600" : "text-amber-600"
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
            Wait times are estimates based on current visa bulletin. Hong Kong, Macau, and Taiwan are NOT subject to China backlog.
          </p>
        </div>

        {/* Strategies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Strategies to Optimize Your Timeline</h2>
          <div className="grid gap-4">
            {strategies.map((strategy, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{strategy.title}</h3>
                  <span className="text-sm font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                    {strategy.timeline}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{strategy.description}</p>
                <p className="text-sm text-green-700">
                  <strong>Advantage:</strong> {strategy.advantage}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Hong Kong / Macau / Taiwan Note */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-12">
          <div className="flex gap-4">
            <span className="text-2xl">🎉</span>
            <div>
              <h3 className="font-semibold text-green-900">Born in Hong Kong, Macau, or Taiwan?</h3>
              <p className="text-green-800 mt-2">
                If you were born in Hong Kong, Macau, or Taiwan, you are <strong>NOT</strong> subject 
                to the mainland China backlog. Your country of chargeability is your specific 
                birthplace, which typically has <strong>no employment-based visa backlog</strong>. 
                Your green card timeline would be similar to &quot;rest of world&quot; applicants.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison with India */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">China vs India Backlog Comparison</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Factor</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">China 🇨🇳</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">India 🇮🇳</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 font-medium">EB-1 Wait</td>
                  <td className="px-6 py-4 text-green-600">Often current</td>
                  <td className="px-6 py-4 text-amber-600">1-2 years</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">EB-2 Wait</td>
                  <td className="px-6 py-4 text-amber-600">3-5 years</td>
                  <td className="px-6 py-4 text-red-600">10-15+ years</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">EB-3 Wait</td>
                  <td className="px-6 py-4 text-amber-600">2-4 years</td>
                  <td className="px-6 py-4 text-red-600">10-15+ years</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Total Queue</td>
                  <td className="px-6 py-4 text-gray-600">~50,000</td>
                  <td className="px-6 py-4 text-gray-600">~800,000</td>
                </tr>
              </tbody>
            </table>
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
            Compare Your Green Card Options
          </h2>
          <p className="mt-3 text-brand-100 max-w-xl mx-auto">
            Use our interactive timeline tool to see personalized estimates for EB-1, 
            EB-2, EB-3, and NIW paths based on your profile.
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
