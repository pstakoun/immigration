import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EB-2 NIW Guide: Self-Petition Green Card Without Employer | 2025",
  description:
    "Complete guide to EB-2 NIW (National Interest Waiver) green card. Learn requirements, evidence needed, approval rates, and how to self-petition without employer sponsorship.",
  keywords: [
    "EB-2 NIW",
    "National Interest Waiver",
    "self-petition green card",
    "NIW requirements",
    "NIW evidence",
    "green card without employer",
    "NIW approval rate",
    "Matter of Dhanasar",
    "NIW for engineers",
    "NIW for researchers",
  ],
  openGraph: {
    title: "EB-2 NIW: Self-Petition Green Card Guide | Stateside",
    description:
      "How to get a green card without employer sponsorship through EB-2 National Interest Waiver.",
    type: "article",
  },
  alternates: {
    canonical: "https://stateside.app/guides/eb2-niw",
  },
};

const criteria = [
  {
    number: 1,
    title: "Substantial Merit and National Importance",
    description:
      "Your proposed endeavor must have substantial merit and national importance to the United States.",
    examples: [
      "Research in STEM fields with broad applications",
      "Entrepreneurship creating jobs or economic value",
      "Healthcare improvements or medical research",
      "Technology development with national security implications",
      "Education initiatives with wide-reaching impact",
    ],
    tips: [
      "\"National\" doesn't require nationwide impact—significance in a specific region or industry qualifies",
      "Commercial endeavors count if they provide broader societal benefit",
      "Focus on why your work matters beyond your personal advancement",
    ],
  },
  {
    number: 2,
    title: "Well Positioned to Advance the Endeavor",
    description:
      "You must demonstrate you are well positioned to advance your proposed endeavor based on your background and resources.",
    examples: [
      "Advanced degrees in the relevant field",
      "Publications, patents, or research contributions",
      "Track record of success in the field",
      "Specific plans, partnerships, or resources",
      "Letters from experts acknowledging your qualifications",
    ],
    tips: [
      "Show concrete steps you've already taken toward your endeavor",
      "Explain why your specific background makes you uniquely qualified",
      "Include future plans and how you'll execute them",
    ],
  },
  {
    number: 3,
    title: "Beneficial to Waive Job Offer Requirement",
    description:
      "On balance, it would be beneficial to the US to waive the job offer and labor certification requirements.",
    examples: [
      "Your work benefits the US even without a specific employer",
      "Labor certification would be impractical for your endeavor",
      "Your contributions have urgency or time-sensitivity",
      "US interest outweighs the interest in protecting US workers",
    ],
    tips: [
      "Argue that requiring PERM would delay important work",
      "Explain why employer-sponsored path doesn't fit your contributions",
      "Show that your flexibility benefits the national interest",
    ],
  },
];

const evidenceTypes = [
  {
    category: "Education & Credentials",
    items: [
      "Advanced degree (Master's or PhD) transcripts and diplomas",
      "Degree evaluation if foreign-educated",
      "Professional licenses or certifications",
      "Continuing education or specialized training",
    ],
  },
  {
    category: "Professional Achievements",
    items: [
      "Publications in peer-reviewed journals (with citation counts)",
      "Patents granted or pending",
      "Awards and recognition in your field",
      "Media coverage of your work",
      "Conference presentations and invited talks",
    ],
  },
  {
    category: "Expert Letters",
    items: [
      "Letters from independent experts in your field",
      "Letters from employers or collaborators",
      "Letters from industry leaders or academics",
      "Each letter should specifically address the 3 prongs",
    ],
  },
  {
    category: "Evidence of Impact",
    items: [
      "Documentation of how your work has been applied",
      "Economic impact data (jobs created, revenue generated)",
      "Evidence of adoption of your methods or research",
      "Testimonials from those who've benefited from your work",
    ],
  },
];

const commonFields = [
  { field: "Software Engineering", strength: "Strong", notes: "Focus on innovative projects, patents, or widely-used contributions" },
  { field: "Data Science / AI / ML", strength: "Very Strong", notes: "High demand field with clear national importance" },
  { field: "Healthcare / Medicine", strength: "Very Strong", notes: "Public health impact is compelling" },
  { field: "Academic Research", strength: "Very Strong", notes: "Publications and citations are strong evidence" },
  { field: "Entrepreneurship", strength: "Strong", notes: "Job creation and economic development arguments" },
  { field: "Finance / Business", strength: "Moderate", notes: "Needs clear public benefit beyond personal profit" },
  { field: "Arts / Entertainment", strength: "Moderate", notes: "Cultural contributions can qualify" },
];

const faqs = [
  {
    question: "Do I need a PhD for EB-2 NIW?",
    answer:
      "No. EB-2 NIW requires either: (1) an advanced degree (Master's or higher), OR (2) a Bachelor's degree plus 5+ years of progressive experience, OR (3) exceptional ability (meeting 3 of 6 regulatory criteria). Many successful NIW petitioners have Master's degrees, and some have only Bachelor's with strong experience.",
  },
  {
    question: "Can I apply for NIW while on H-1B/TN/F-1?",
    answer:
      "Yes! NIW is commonly filed by people on H-1B, TN, L-1, O-1, and even F-1 OPT. Since NIW doesn't require employer sponsorship, you don't need your employer's involvement. However, note that filing I-485 signals immigrant intent, which may affect non-immigrant status renewals.",
  },
  {
    question: "What is the NIW approval rate?",
    answer:
      "The overall EB-2 NIW approval rate is approximately 85-90%. However, this varies significantly based on the strength of your petition. Well-prepared cases with strong evidence have much higher approval rates. RFE (Request for Evidence) rates are around 30%, so thorough initial preparation is important.",
  },
  {
    question: "How long does EB-2 NIW take?",
    answer:
      "Processing times vary: I-140 takes 6-9 months (or ~45 business days with premium processing). I-485 takes 10-18 months. For countries without backlogs (most countries except India and China), total time is typically 1.5-2.5 years. India/China face the same EB-2 backlog as employer-sponsored EB-2.",
  },
  {
    question: "Do I need a lawyer for NIW?",
    answer:
      "While not legally required, NIW is one of the more complex immigration categories where legal help is highly recommended. The three-prong Dhanasar test requires careful argumentation, and weak petitions often receive RFEs or denials. A good immigration attorney experienced in NIW can significantly improve your chances.",
  },
  {
    question: "Can I change jobs while NIW is pending?",
    answer:
      "Yes—this is one of the major benefits of NIW! Since there's no employer sponsor, you can change jobs freely. Your new job should still be in the same field as your proposed endeavor, but you have much more flexibility than employer-sponsored green cards.",
  },
];

export default function EB2NIWGuide() {
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
            <span className="text-4xl">⭐</span>
            <span className="text-sm font-medium text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              Self-Petition
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            EB-2 NIW: National Interest Waiver Guide
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Get a green card without employer sponsorship by demonstrating your work 
            benefits the United States national interest.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span>Updated January 2025</span>
            <span>•</span>
            <span>15 min read</span>
            <span>•</span>
            <span>Based on Matter of Dhanasar</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-green-600">~87%</div>
              <div className="text-sm text-gray-500">Approval rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-600">1.5-2.5 yrs</div>
              <div className="text-sm text-gray-500">Typical timeline*</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-600">$5-10k</div>
              <div className="text-sm text-gray-500">Total cost</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">Self-file</div>
              <div className="text-sm text-gray-500">No employer needed</div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            *For countries without EB-2 backlogs. India/China face longer waits.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-12">
          <h2 className="text-lg font-semibold text-green-900 mb-4">Why Choose EB-2 NIW?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <span className="text-green-600">✓</span>
              <div>
                <p className="font-medium text-green-900">No employer sponsor required</p>
                <p className="text-sm text-green-700">Self-petition and maintain job flexibility</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600">✓</span>
              <div>
                <p className="font-medium text-green-900">No PERM labor certification</p>
                <p className="text-sm text-green-700">Skip 12-18 months of PERM process</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600">✓</span>
              <div>
                <p className="font-medium text-green-900">Change jobs freely</p>
                <p className="text-sm text-green-700">No AC21 restrictions during process</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600">✓</span>
              <div>
                <p className="font-medium text-green-900">File alongside employer GC</p>
                <p className="text-sm text-green-700">Hedge your bets with parallel paths</p>
              </div>
            </div>
          </div>
        </div>

        {/* The Three-Prong Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">The Three-Prong Dhanasar Test</h2>
          <p className="text-gray-600 mb-6">
            Since the 2016 <em>Matter of Dhanasar</em> decision, NIW petitions are evaluated against 
            three criteria. You must satisfy all three to qualify:
          </p>
          <div className="space-y-6">
            {criteria.map((criterion) => (
              <div
                key={criterion.number}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                      {criterion.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {criterion.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{criterion.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Examples:</h4>
                        <ul className="space-y-1">
                          {criterion.examples.map((example, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-brand-500">•</span>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-blue-800 mb-1">Pro Tips:</h4>
                        <ul className="space-y-1">
                          {criterion.tips.map((tip, i) => (
                            <li key={i} className="text-sm text-blue-700">
                              💡 {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Evidence Types */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Building Your Evidence Package</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {evidenceTypes.map((type, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-3">{type.category}</h3>
                <ul className="space-y-2">
                  {type.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg
                        className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-3">
              <span className="text-amber-500">💡</span>
              <p className="text-sm text-amber-800">
                <strong>Quality over quantity:</strong> A few strong, well-documented achievements 
                are more compelling than many weak ones. Focus on evidence that directly supports 
                the three Dhanasar prongs.
              </p>
            </div>
          </div>
        </section>

        {/* By Field */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">NIW by Professional Field</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Field</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">NIW Strength</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {commonFields.map((row, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 font-medium text-gray-900">{row.field}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          row.strength === "Very Strong" 
                            ? "bg-green-100 text-green-700" 
                            : row.strength === "Strong"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {row.strength}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Process Timeline */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">EB-2 NIW Process Timeline</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-20 text-right text-sm font-medium text-gray-500">Prep</div>
                <div className="flex-1 pb-6 border-l-2 border-brand-200 pl-6 relative">
                  <div className="absolute w-4 h-4 rounded-full bg-brand-500 -left-[9px] top-0"></div>
                  <h4 className="font-semibold text-gray-900">Prepare Petition</h4>
                  <p className="text-sm text-gray-600">Gather evidence, draft personal statement, obtain expert letters (1-3 months)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-20 text-right text-sm font-medium text-gray-500">File</div>
                <div className="flex-1 pb-6 border-l-2 border-brand-200 pl-6 relative">
                  <div className="absolute w-4 h-4 rounded-full bg-brand-500 -left-[9px] top-0"></div>
                  <h4 className="font-semibold text-gray-900">File I-140 (with I-485 if current)</h4>
                  <p className="text-sm text-gray-600">Submit petition to USCIS, pay fees (~$4,000 total)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-20 text-right text-sm font-medium text-gray-500">6-9 mo</div>
                <div className="flex-1 pb-6 border-l-2 border-brand-200 pl-6 relative">
                  <div className="absolute w-4 h-4 rounded-full bg-brand-500 -left-[9px] top-0"></div>
                  <h4 className="font-semibold text-gray-900">I-140 Processing</h4>
                  <p className="text-sm text-gray-600">Or ~45 business days with premium processing ($2,805)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-20 text-right text-sm font-medium text-gray-500">3-5 mo</div>
                <div className="flex-1 pb-6 border-l-2 border-brand-200 pl-6 relative">
                  <div className="absolute w-4 h-4 rounded-full bg-blue-500 -left-[9px] top-0"></div>
                  <h4 className="font-semibold text-gray-900">Receive EAD/AP Combo Card</h4>
                  <p className="text-sm text-gray-600">Work and travel flexibility while I-485 pending</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-20 text-right text-sm font-medium text-gray-500">10-18 mo</div>
                <div className="flex-1 pl-6 relative">
                  <div className="absolute w-4 h-4 rounded-full bg-purple-500 -left-[9px] top-0"></div>
                  <h4 className="font-semibold text-gray-900">Green Card Approved! 🎉</h4>
                  <p className="text-sm text-gray-600">I-485 adjudicated, become permanent resident</p>
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
            See If NIW Fits Your Timeline
          </h2>
          <p className="mt-3 text-brand-100 max-w-xl mx-auto">
            Compare EB-2 NIW with other paths using our interactive timeline tool 
            to find the fastest route to your green card.
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
