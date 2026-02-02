import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PERM Labor Certification Guide: Timeline, Steps & Tips | 2025",
  description:
    "Complete guide to PERM labor certification for green card. Learn the step-by-step process, current processing times, audit risks, and how to avoid common mistakes.",
  keywords: [
    "PERM labor certification",
    "PERM process",
    "PERM timeline",
    "PERM processing time",
    "ETA-9089",
    "prevailing wage",
    "PERM recruitment",
    "PERM audit",
    "labor certification green card",
    "DOL PERM",
  ],
  openGraph: {
    title: "PERM Labor Certification Guide | Stateside",
    description:
      "Step-by-step guide to PERM labor certification for employment-based green cards.",
    type: "article",
  },
  alternates: {
    canonical: "https://stateside.app/guides/perm-process",
  },
};

const steps = [
  {
    number: 1,
    title: "Prevailing Wage Determination (PWD)",
    duration: "5-7 months",
    agency: "Department of Labor",
    description:
      "DOL determines the minimum wage your employer must offer for the position based on job duties, requirements, and work location.",
    details: [
      "Employer files ETA-9141 form with DOL",
      "Job description must accurately reflect actual duties",
      "DOL assigns a wage level (1-4) based on requirements",
      "PWD valid for specific job and location only",
      "Can request redetermination if wage seems too high",
    ],
    tips: [
      "Start PWD early—it's often the longest step",
      "Keep job requirements realistic (don't inflate)",
      "Higher wage levels = higher salary requirements",
    ],
  },
  {
    number: 2,
    title: "Recruitment Campaign",
    duration: "2-3 months",
    agency: "Employer",
    description:
      "Employer conducts a labor market test to demonstrate that no qualified, willing, and able US workers are available for the position.",
    details: [
      "30-day job posting on employer's website",
      "State Workforce Agency (SWA) job order for 30 days",
      "Two Sunday newspaper advertisements",
      "Three additional recruitment steps (for professional positions)",
      "30-day quiet period after last ad before filing",
    ],
    tips: [
      "Document EVERYTHING—every ad, every applicant, every interview",
      "Rejection reasons must be lawful and job-related",
      "Cannot reject applicants for being 'overqualified'",
    ],
  },
  {
    number: 3,
    title: "PERM Application Filing",
    duration: "12-18 months processing",
    agency: "Department of Labor",
    description:
      "File ETA-9089 with DOL certifying the recruitment results and that hiring the foreign worker won't adversely affect US workers.",
    details: [
      "Must file within 180 days of recruitment completion",
      "Application filed electronically via FLAG system",
      "Priority date established on filing date",
      "DOL reviews for compliance and completeness",
      "May be selected for audit (random or triggered)",
    ],
    tips: [
      "Double-check every detail—errors can cause denial",
      "Priority date is crucial for backlogged countries",
      "Keep recruitment file for 5 years after filing",
    ],
  },
  {
    number: 4,
    title: "DOL Review & Decision",
    duration: "Included in step 3 timeline",
    agency: "Department of Labor",
    description:
      "DOL reviews the application and issues a certification, denial, or audit request.",
    details: [
      "Certified: Move to I-140 within 180 days",
      "Audit: Provide additional documentation (adds 6+ months)",
      "Denial: Can request reconsideration or appeal",
      "Supervised recruitment: Rare, DOL oversees new recruitment",
    ],
    tips: [
      "Respond to audits thoroughly and promptly",
      "Audit doesn't mean denial—many audited cases are certified",
      "Consider audit risk when planning timeline",
    ],
  },
];

const recruitmentSteps = [
  {
    type: "Mandatory for All Positions",
    items: [
      { name: "Employer Website Posting", duration: "30 days minimum", notes: "Must include job title, duties, requirements, and application instructions" },
      { name: "State Workforce Agency Job Order", duration: "30 days minimum", notes: "Filed in state where job is located" },
      { name: "Two Sunday Newspaper Ads", duration: "2 consecutive Sundays", notes: "In newspaper of general circulation in area of employment" },
    ],
  },
  {
    type: "Additional Steps for Professional Positions",
    description: "Pick 3 of the following:",
    items: [
      { name: "Job Fairs", duration: "N/A", notes: "Within 6 months prior to filing" },
      { name: "Employer's Website", duration: "30 days", notes: "If separate from mandatory posting" },
      { name: "Job Search Website", duration: "30 days", notes: "Indeed, LinkedIn, etc." },
      { name: "On-Campus Recruiting", duration: "N/A", notes: "If position requires degree" },
      { name: "Trade or Professional Organization", duration: "N/A", notes: "Relevant to the field" },
      { name: "Private Employment Firm", duration: "N/A", notes: "Headhunter or recruiter" },
      { name: "Employee Referral Program", duration: "N/A", notes: "With incentives" },
      { name: "Campus Placement Office", duration: "N/A", notes: "Local college/university" },
      { name: "Local/Ethnic Newspaper", duration: "N/A", notes: "If appropriate for occupation" },
      { name: "Radio/TV Ads", duration: "N/A", notes: "Documented broadcast" },
    ],
  },
];

const auditTriggers = [
  "Job requirements that seem tailored to the foreign worker",
  "Foreign language requirements without business necessity",
  "Unusual combination of job duties",
  "Layoffs in the same occupation within past 6 months",
  "Previous PERM denials or withdrawals",
  "Random selection (approximately 30% of cases)",
  "H-1B dependent employer issues",
  "Job location in certain metropolitan areas",
];

const commonMistakes = [
  {
    mistake: "Inflating job requirements",
    consequence: "Audit or denial",
    prevention: "Requirements must match actual job needs and what employee was doing",
  },
  {
    mistake: "Inadequate recruitment documentation",
    consequence: "Audit failure",
    prevention: "Keep copies of all ads, applications, interview notes, rejection reasons",
  },
  {
    mistake: "Employee didn't meet requirements when hired",
    consequence: "Denial",
    prevention: "Ensure employee met all requirements at time of hire or will meet them by green card",
  },
  {
    mistake: "Missing the 180-day filing deadline",
    consequence: "Must redo recruitment",
    prevention: "File promptly after recruitment quiet period ends",
  },
  {
    mistake: "Salary below prevailing wage",
    consequence: "Denial",
    prevention: "Verify employer can and will pay at least the PWD amount",
  },
];

const faqs = [
  {
    question: "What is PERM and why is it required?",
    answer:
      "PERM (Program Electronic Review Management) is the DOL's labor certification process proving that hiring a foreign worker won't negatively impact US workers. It's required for most EB-2 and EB-3 green cards to demonstrate no qualified US workers are available for the position at the prevailing wage.",
  },
  {
    question: "How long does PERM take in 2025?",
    answer:
      "Current PERM processing times are approximately 12-18 months from filing to decision. Including the PWD (5-7 months) and recruitment (2-3 months), the total PERM process takes about 19-28 months. Audits can add an additional 6-12 months.",
  },
  {
    question: "Can I change jobs during PERM?",
    answer:
      "Changing jobs during PERM typically means restarting the process with the new employer. PERM is employer and position-specific. However, you can change jobs after I-140 approval and retain your priority date for a new PERM case.",
  },
  {
    question: "What happens if PERM is audited?",
    answer:
      "An audit requires submitting additional documentation (recruitment records, advertisements, applicant info) to DOL. While it adds 6-12 months to processing, many audited cases are ultimately certified. The key is having thorough documentation from the start.",
  },
  {
    question: "What is the priority date and when is it set?",
    answer:
      "Your priority date is the date your PERM application is filed with DOL. This date determines your place in line for a green card if there's a visa backlog for your country. For India/China, this date is crucial as it affects wait times of 10+ years.",
  },
  {
    question: "Does PERM expire?",
    answer:
      "Yes, an approved PERM is valid for 180 days. You must file the I-140 within this window. If the I-140 isn't filed in time, you'll need to restart the entire PERM process (though you can retain the priority date with a new PERM).",
  },
];

export default function PERMProcessGuide() {
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
            <span className="text-4xl">📋</span>
            <span className="text-sm font-medium text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              Process Guide
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            PERM Labor Certification Guide
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Everything you need to know about the PERM labor certification process—the 
            first major step toward employer-sponsored green cards.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span>Updated January 2025</span>
            <span>•</span>
            <span>14 min read</span>
            <span>•</span>
            <span>Based on DOL regulations</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">PERM at a Glance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-brand-600">12-18 mo</div>
              <div className="text-sm text-gray-500">Processing time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-600">~89%</div>
              <div className="text-sm text-gray-500">Approval rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">~30%</div>
              <div className="text-sm text-gray-500">Audit rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-600">$5-10k</div>
              <div className="text-sm text-gray-500">Employer cost</div>
            </div>
          </div>
        </div>

        {/* Overview */}
        <section className="prose prose-lg max-w-none mb-12">
          <h2 className="text-2xl font-bold text-gray-900">What is PERM?</h2>
          <p>
            PERM (Program Electronic Review Management) is the Department of Labor&apos;s 
            process for labor certification. It&apos;s required for most EB-2 and EB-3 
            employment-based green cards.
          </p>
          <p>
            The purpose of PERM is to ensure that:
          </p>
          <ul>
            <li>There are no qualified, willing, and able US workers available for the position</li>
            <li>Hiring a foreign worker won&apos;t adversely affect wages and working conditions of US workers</li>
            <li>The employer will pay at least the prevailing wage for the occupation</li>
          </ul>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 not-prose">
            <div className="flex gap-3">
              <span className="text-blue-500">💡</span>
              <p className="text-sm text-blue-800">
                <strong>Not all green card paths require PERM.</strong> EB-1 categories 
                (EB-1A, EB-1B, EB-1C), EB-2 NIW (National Interest Waiver), and family-based 
                green cards do not require labor certification.
              </p>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">PERM Process Step by Step</h2>
          <div className="space-y-6">
            {steps.map((step) => (
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
                        <span className="text-xs text-gray-500">
                          {step.agency}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Key Details:</h4>
                          <ul className="space-y-1">
                            {step.details.map((detail, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="text-brand-500">•</span>
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-3">
                          <h4 className="text-sm font-medium text-amber-800 mb-2">Tips:</h4>
                          <ul className="space-y-1">
                            {step.tips.map((tip, i) => (
                              <li key={i} className="text-sm text-amber-700">
                                💡 {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recruitment Requirements */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recruitment Requirements</h2>
          {recruitmentSteps.map((section, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
              <h3 className="font-semibold text-gray-900 mb-1">{section.type}</h3>
              {section.description && (
                <p className="text-sm text-gray-500 mb-4">{section.description}</p>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-medium text-gray-700">Method</th>
                      <th className="text-left py-2 font-medium text-gray-700">Duration</th>
                      <th className="text-left py-2 font-medium text-gray-700">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.items.map((item, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-0">
                        <td className="py-2 text-gray-900">{item.name}</td>
                        <td className="py-2 text-gray-600">{item.duration}</td>
                        <td className="py-2 text-gray-500">{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>

        {/* Audit Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Understanding PERM Audits</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
            <div className="flex gap-4">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-amber-900">Audit Rate: ~30%</h3>
                <p className="text-amber-800 mt-2">
                  Approximately 30% of PERM applications are audited. An audit doesn&apos;t mean 
                  denial—many audited cases are ultimately certified. The key is having thorough 
                  documentation from the start.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Common Audit Triggers</h3>
            <ul className="grid md:grid-cols-2 gap-2">
              {auditTriggers.map((trigger, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-amber-500">!</span>
                  {trigger}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Common Mistakes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Mistakes to Avoid</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Mistake</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Consequence</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Prevention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {commonMistakes.map((row, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 font-medium text-red-700">{row.mistake}</td>
                    <td className="px-6 py-4 text-gray-600">{row.consequence}</td>
                    <td className="px-6 py-4 text-gray-600">{row.prevention}</td>
                  </tr>
                ))}
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
            Track Your PERM Progress
          </h2>
          <p className="mt-3 text-brand-100 max-w-xl mx-auto">
            Use our timeline tool to visualize your complete green card journey 
            from PERM through to permanent residence.
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
