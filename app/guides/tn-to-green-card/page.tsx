import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TN Visa to Green Card: 2025 Guide for Canadians & Mexicans",
  description:
    "Complete guide for Canadian and Mexican TN visa holders on getting a green card. Learn about dual intent issues, timing strategies, and the fastest paths to permanent residence.",
  keywords: [
    "TN visa to green card",
    "TN to green card",
    "Canadian green card",
    "Mexican green card",
    "TN visa dual intent",
    "USMCA green card",
    "TN to H-1B",
    "Canadian immigration USA",
    "TN visa permanent residence",
  ],
  openGraph: {
    title: "TN Visa to Green Card: Guide for Canadians & Mexicans | Stateside",
    description:
      "How to transition from TN visa to green card while managing dual intent concerns.",
    type: "article",
  },
  alternates: {
    canonical: "https://stateside.app/guides/tn-to-green-card",
  },
};

const pathOptions = [
  {
    title: "Direct from TN (Recommended)",
    timeline: "2-3 years",
    risk: "Low",
    description:
      "File for green card directly while on TN status. Modern USCIS interpretation allows this.",
    pros: [
      "Fastest path to green card",
      "No lottery risk",
      "No need to change status",
      "Lower total cost",
    ],
    cons: [
      "Some border crossing risk during process",
      "Less established than H-1B route",
    ],
  },
  {
    title: "TN → H-1B → Green Card",
    timeline: "3-4+ years",
    risk: "Medium",
    description:
      "Switch to H-1B first (lottery required), then pursue green card from H-1B status.",
    pros: [
      "H-1B has clear dual intent",
      "More established path",
      "Spouse can work on H-4 EAD (after I-140)",
    ],
    cons: [
      "Subject to H-1B lottery (~25% selection)",
      "Adds 1+ year to timeline",
      "Higher total cost",
    ],
  },
  {
    title: "EB-2 NIW (Self-Petition)",
    timeline: "2-3 years",
    risk: "Low",
    description:
      "Self-petition for green card without employer sponsorship if you qualify.",
    pros: [
      "No employer dependency",
      "No PERM required",
      "Can change jobs freely",
      "Good for researchers/entrepreneurs",
    ],
    cons: [
      "Must meet NIW criteria",
      "Requires strong evidence package",
      "Higher attorney costs",
    ],
  },
];

const strategies = [
  {
    title: "Manage Border Crossings Carefully",
    description:
      "While your green card is pending, border officers may question your intent. Have documentation ready showing you're maintaining TN status properly.",
    tips: [
      "Carry I-140 receipt/approval notice",
      "Have valid TN status documentation",
      "Be prepared to explain dual intent is now accepted",
      "Consider applying for Advance Parole before traveling",
    ],
  },
  {
    title: "Time Your I-485 Filing Strategically",
    description:
      "Filing I-485 is a clear statement of immigrant intent. Plan your travel and TN renewals around this milestone.",
    tips: [
      "Get Advance Parole before international travel",
      "Using AP preserves your application even if TN is questioned",
      "Consider renewing TN before filing I-485",
    ],
  },
  {
    title: "Consider Concurrent Filing",
    description:
      "Since Canadians/Mexicans have no visa backlog, you can often file I-140 and I-485 together.",
    tips: [
      "Reduces total timeline significantly",
      "Get EAD/AP combo card for work/travel flexibility",
      "Spouse also gets EAD for work authorization",
    ],
  },
];

const faqs = [
  {
    question: "Is TN visa a dual intent visa?",
    answer:
      "Technically no—TN is a non-immigrant visa requiring non-immigrant intent. However, USCIS has clarified that having a pending green card application doesn't automatically disqualify you from TN status. The key is that you don't intend to abandon your TN status before it expires. This interpretation has made TN to green card transitions much more common and accepted.",
  },
  {
    question: "Can I get a green card while on TN status?",
    answer:
      "Yes! Despite the dual intent concern, thousands of TN holders successfully obtain green cards each year. The process is: (1) Employer files PERM and I-140, (2) Once priority date is current, file I-485 and apply for Advance Parole, (3) Use Advance Parole for any international travel, (4) Receive green card.",
  },
  {
    question: "Should I switch to H-1B before applying for a green card?",
    answer:
      "It's not necessary for most people. Switching to H-1B adds time (lottery, processing) and uncertainty (only ~25% lottery selection). The main benefits are: H-1B clearly allows dual intent, H-4 spouse can get work authorization after I-140 approval, and it's a more established path. For most Canadians/Mexicans, going directly from TN is faster and equally viable.",
  },
  {
    question: "What happens to my TN status when I file I-485?",
    answer:
      "Your TN status remains valid until its expiration date. However, once I-485 is pending, you should apply for Advance Parole (I-131) before any international travel. If you travel on TN and re-enter using your TN status (rather than AP), there's a theoretical risk of I-485 abandonment, though this is rarely enforced for TN holders.",
  },
  {
    question: "Can my spouse work while my green card is pending?",
    answer:
      "TD (TN dependent) status doesn't allow work authorization. However, once you file I-485, your spouse can file I-765 and get an EAD (Employment Authorization Document), allowing them to work for any employer. This is often 3-5 months after I-485 filing.",
  },
  {
    question: "How long does the green card process take for Canadians/Mexicans?",
    answer:
      "Since there's no visa backlog for Canada/Mexico, the timeline is typically: PERM (12-18 months) + I-140 (15 days with premium) + I-485 (10-18 months) = approximately 2-3 years total. With concurrent filing, this can be even shorter.",
  },
];

export default function TNToGreenCardGuide() {
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
            <span className="text-4xl">🍁</span>
            <span className="text-sm font-medium text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              Visa Pathways
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            TN Visa to Green Card: Complete Guide
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            How Canadian and Mexican professionals can navigate from TN visa to permanent 
            residence while managing the &quot;dual intent&quot; question.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span>Updated January 2025</span>
            <span>•</span>
            <span>10 min read</span>
            <span>•</span>
            <span>For Canadians & Mexicans</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-green-600">2-3 years</div>
              <div className="text-sm text-gray-500">Typical timeline</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">No backlog</div>
              <div className="text-sm text-gray-500">Priority date current</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-600">$10-15k</div>
              <div className="text-sm text-gray-500">Total cost</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-600">Multiple</div>
              <div className="text-sm text-gray-500">Path options</div>
            </div>
          </div>
        </div>

        {/* Key Insight */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-12">
          <div className="flex gap-4">
            <span className="text-2xl">🎉</span>
            <div>
              <h3 className="font-semibold text-green-900">Good News for Canadians & Mexicans</h3>
              <p className="text-green-800 mt-2">
                Unlike many other countries, Canada and Mexico have <strong>no employment-based green card backlog</strong>. 
                Your priority date is immediately current, which means you can file for adjustment of status (I-485) 
                as soon as your I-140 is approved—often the same day through concurrent filing.
              </p>
            </div>
          </div>
        </div>

        {/* Dual Intent Explanation */}
        <section className="mb-12 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900">Understanding the Dual Intent Question</h2>
          <p>
            The TN visa is classified as a &quot;non-immigrant&quot; visa, which historically meant holders 
            needed to demonstrate intent to return to their home country. This created concern about 
            pursuing permanent residence while on TN status.
          </p>
          <p>
            <strong>The modern interpretation is more nuanced.</strong> USCIS recognizes that:
          </p>
          <ul>
            <li>Having a pending or approved I-140 doesn&apos;t automatically mean you&apos;ve abandoned non-immigrant status</li>
            <li>Intent can change over time—starting as a temporary worker and later deciding to stay permanently is normal</li>
            <li>The test is whether you intend to maintain your TN status while it&apos;s valid, not whether you might want to stay permanently someday</li>
          </ul>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 not-prose">
            <div className="flex gap-3">
              <span className="text-blue-500">💡</span>
              <div>
                <p className="font-medium text-blue-900">Bottom Line</p>
                <p className="text-sm text-blue-800 mt-1">
                  Thousands of TN holders successfully obtain green cards each year. 
                  The dual intent concern is largely theoretical at this point. 
                  The key is proper planning and documentation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Path Options */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Path Options Compared</h2>
          <div className="space-y-6">
            {pathOptions.map((option, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{option.title}</h3>
                    <span className="text-sm font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                      {option.timeline}
                    </span>
                    <span className={`text-sm font-medium px-2 py-0.5 rounded ${
                      option.risk === "Low" 
                        ? "bg-green-50 text-green-700" 
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {option.risk} risk
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-green-700 mb-2">✓ Pros</h4>
                      <ul className="space-y-1">
                        {option.pros.map((pro, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-green-500">+</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-red-700 mb-2">✗ Cons</h4>
                      <ul className="space-y-1">
                        {option.cons.map((con, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-red-500">-</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Strategies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Strategies for Success</h2>
          <div className="space-y-6">
            {strategies.map((strategy, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{strategy.title}</h3>
                <p className="text-gray-600 mb-4">{strategy.description}</p>
                <ul className="space-y-2">
                  {strategy.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg
                        className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Typical Timeline: TN Direct to Green Card</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-16 text-right text-sm font-medium text-gray-500">Months 1-7</div>
                <div className="flex-1 pb-6 border-l-2 border-brand-200 pl-6 relative">
                  <div className="absolute w-4 h-4 rounded-full bg-brand-500 -left-[9px] top-0"></div>
                  <h4 className="font-semibold text-gray-900">Prevailing Wage Determination</h4>
                  <p className="text-sm text-gray-600">DOL determines minimum salary for your position</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-16 text-right text-sm font-medium text-gray-500">Months 7-10</div>
                <div className="flex-1 pb-6 border-l-2 border-brand-200 pl-6 relative">
                  <div className="absolute w-4 h-4 rounded-full bg-brand-500 -left-[9px] top-0"></div>
                  <h4 className="font-semibold text-gray-900">PERM Recruitment</h4>
                  <p className="text-sm text-gray-600">Employer conducts labor market test</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-16 text-right text-sm font-medium text-gray-500">Months 10-22</div>
                <div className="flex-1 pb-6 border-l-2 border-brand-200 pl-6 relative">
                  <div className="absolute w-4 h-4 rounded-full bg-brand-500 -left-[9px] top-0"></div>
                  <h4 className="font-semibold text-gray-900">PERM Labor Certification</h4>
                  <p className="text-sm text-gray-600">DOL reviews and approves labor certification</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-16 text-right text-sm font-medium text-gray-500">Month 22</div>
                <div className="flex-1 pb-6 border-l-2 border-brand-200 pl-6 relative">
                  <div className="absolute w-4 h-4 rounded-full bg-green-500 -left-[9px] top-0"></div>
                  <h4 className="font-semibold text-gray-900">I-140 + I-485 Concurrent Filing</h4>
                  <p className="text-sm text-gray-600">File immigrant petition and adjustment together (no backlog!)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-16 text-right text-sm font-medium text-gray-500">Months 25-27</div>
                <div className="flex-1 pb-6 border-l-2 border-brand-200 pl-6 relative">
                  <div className="absolute w-4 h-4 rounded-full bg-blue-500 -left-[9px] top-0"></div>
                  <h4 className="font-semibold text-gray-900">Receive EAD/Advance Parole</h4>
                  <p className="text-sm text-gray-600">Work authorization and travel document combo card</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-16 text-right text-sm font-medium text-gray-500">Months 32-40</div>
                <div className="flex-1 pl-6 relative">
                  <div className="absolute w-4 h-4 rounded-full bg-purple-500 -left-[9px] top-0"></div>
                  <h4 className="font-semibold text-gray-900">Green Card Approved! 🎉</h4>
                  <p className="text-sm text-gray-600">Permanent residence granted</p>
                </div>
              </div>
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
            See Your TN to Green Card Timeline
          </h2>
          <p className="mt-3 text-brand-100 max-w-xl mx-auto">
            Use our interactive tool to visualize your path from TN visa to green card 
            with personalized timeline estimates.
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
