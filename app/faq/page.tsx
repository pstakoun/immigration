import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Immigration FAQ - Common US Visa & Green Card Questions",
  description:
    "Answers to frequently asked questions about US immigration, green cards, H-1B visas, PERM, I-140, I-485, and more. Get clarity on your immigration journey.",
  keywords: [
    "immigration FAQ",
    "green card FAQ",
    "H-1B FAQ",
    "PERM FAQ",
    "I-140 FAQ",
    "I-485 FAQ",
    "US immigration questions",
    "visa questions",
    "priority date FAQ",
  ],
  openGraph: {
    title: "Immigration FAQ | Stateside",
    description: "Answers to common US immigration and green card questions.",
  },
};

const faqCategories = [
  {
    title: "General Immigration",
    faqs: [
      {
        question: "What is a green card?",
        answer:
          "A green card (officially called a Permanent Resident Card) grants you the right to live and work permanently in the United States. Green card holders can work for any employer, travel freely, and after 3-5 years, apply for US citizenship.",
      },
      {
        question: "What's the difference between a visa and a green card?",
        answer:
          "A visa is temporary permission to enter or stay in the US for a specific purpose (work, study, visit). A green card grants permanent residence—you can stay indefinitely, work for any employer, and eventually become a citizen. Visas expire and have restrictions; green cards are permanent (though the card itself needs renewal every 10 years).",
      },
      {
        question: "How long does it take to get a green card?",
        answer:
          "It depends on your pathway and country of birth. For most countries through employer sponsorship: 2-3 years. For India: 10-15+ years due to backlogs. For China: 3-5 years. Marriage to a US citizen: 1-2 years. EB-1 and NIW paths can be faster for those who qualify.",
      },
      {
        question: "Do I need a lawyer for immigration?",
        answer:
          "While not legally required, immigration law is complex and mistakes can be costly. For straightforward cases like TN visas, some people self-file successfully. For green cards, PERM, or complex situations, working with an experienced immigration attorney is highly recommended.",
      },
    ],
  },
  {
    title: "Work Visas",
    faqs: [
      {
        question: "What is the H-1B visa?",
        answer:
          "The H-1B is a nonimmigrant visa for specialty occupations requiring at least a bachelor's degree. It's employer-sponsored, valid for up to 6 years (extendable if green card pending), and subject to an annual lottery with ~25% selection rate. The $100k proclamation fee only applies to petitions from outside the US—most change of status filings are exempt.",
      },
      {
        question: "What is the TN visa?",
        answer:
          "The TN visa is for Canadian and Mexican professionals in 63 specific occupations under USMCA (formerly NAFTA). It's faster than H-1B (often same-day at the border for Canadians), has no annual cap or lottery, and is renewable indefinitely. It can lead to a green card, though requires careful planning around dual intent.",
      },
      {
        question: "Can I change employers on H-1B?",
        answer:
          "Yes! H-1B is portable. Your new employer files a new H-1B petition, and you can start working for them as soon as USCIS receives the petition (don't have to wait for approval). Your green card process timing depends on which stage you're at—priority dates are portable after I-140 approval.",
      },
      {
        question: "What happens when my H-1B reaches 6 years?",
        answer:
          "If you have an approved I-140 or PERM pending for over 365 days, you can extend H-1B beyond 6 years in 1-year or 3-year increments until your green card is approved. Without either, you'd need to leave the US for a year before getting a new H-1B.",
      },
    ],
  },
  {
    title: "Green Card Process",
    faqs: [
      {
        question: "What is PERM?",
        answer:
          "PERM (Program Electronic Review Management) is the DOL's labor certification process required for most EB-2 and EB-3 green cards. It proves no qualified US workers are available for your position. The process takes 18-24 months total (including prevailing wage and recruitment) and establishes your priority date.",
      },
      {
        question: "What is the I-140?",
        answer:
          "Form I-140 is the Immigrant Petition filed with USCIS after PERM approval. Your employer petitions USCIS to classify you as an eligible immigrant worker. It locks in your priority date permanently. Premium processing is available ($2,805 for 15-day decision). After 180 days approved, your priority date is portable.",
      },
      {
        question: "What is the I-485?",
        answer:
          "Form I-485 is the Adjustment of Status application—the final step to get your green card while in the US. You can file when your priority date is current. It includes biometrics, medical exam, and possibly an interview. Processing takes 10-18 months. You can get an EAD (work permit) and Advance Parole (travel document) while it's pending.",
      },
      {
        question: "What is a priority date?",
        answer:
          "Your priority date is the date your PERM was filed with DOL (or I-140 for categories without PERM). It determines your place in line for a green card. Due to annual limits, some countries have backlogs—you wait until your priority date becomes 'current' in the Visa Bulletin before your green card can be approved.",
      },
      {
        question: "What is concurrent filing?",
        answer:
          "Concurrent filing means filing I-140 and I-485 at the same time. This is possible when your priority date is already current (no backlog). It can significantly speed up your timeline and gets you EAD/AP sooner. Common for applicants from countries without backlogs.",
      },
    ],
  },
  {
    title: "EB Categories",
    faqs: [
      {
        question: "What's the difference between EB-1, EB-2, and EB-3?",
        answer:
          "EB-1 is for priority workers (extraordinary ability, outstanding researchers, multinational executives)—no PERM required. EB-2 is for advanced degree professionals or exceptional ability—requires PERM unless using NIW. EB-3 is for skilled workers and professionals—requires PERM. EB-1 typically has shorter backlogs.",
      },
      {
        question: "What is EB-2 NIW?",
        answer:
          "EB-2 NIW (National Interest Waiver) lets you self-petition for a green card without employer sponsorship or PERM. You must show your work benefits the US national interest, meet the 3-prong Dhanasar test, and have an advanced degree or exceptional ability. Great for researchers, STEM professionals, and entrepreneurs.",
      },
      {
        question: "Can I file both EB-2 and EB-3?",
        answer:
          "Yes! Many people file both (called 'downgrading' to EB-3) to have flexibility. Sometimes EB-3 moves faster than EB-2 in the visa bulletin. Having both approved I-140s lets you use whichever becomes current first. Each requires a separate PERM and I-140.",
      },
    ],
  },
  {
    title: "Backlogs & Wait Times",
    faqs: [
      {
        question: "Why is the India green card backlog so long?",
        answer:
          "US law limits each country to 7% of annual employment-based green cards (~9,800 visas). With far more Indian applicants than available visas, a massive backlog has built up—currently 800,000+ people waiting. At current rates, the backlog would take 80+ years to clear without legislative reform.",
      },
      {
        question: "How can I reduce my green card wait time?",
        answer:
          "Options include: (1) Qualify for EB-1 which has shorter backlogs, (2) File EB-2 NIW for independence from employer, (3) Use spouse's country of chargeability if they're from a non-backlogged country, (4) EB-5 investment which has reserved visa numbers, (5) File both EB-2 and EB-3 to use whichever moves faster.",
      },
      {
        question: "What is the Visa Bulletin?",
        answer:
          "The Visa Bulletin is published monthly by the State Department. It shows which priority dates are currently being processed ('current') for each employment-based category and country. There are two charts: Final Action Dates (for approval) and Dates for Filing (for I-485 submission when USCIS allows).",
      },
    ],
  },
  {
    title: "During the Process",
    faqs: [
      {
        question: "Can I travel while my green card is pending?",
        answer:
          "Yes, but carefully. Before I-485 filing, travel on your current visa. After I-485 filing, get Advance Parole (I-131) before traveling internationally. Leaving the US without AP can abandon your I-485 application. Once you have AP, you can travel freely while the green card is pending.",
      },
      {
        question: "Can I change jobs during the green card process?",
        answer:
          "It depends on the stage. During PERM/I-140: generally need to restart. After I-140 approval (180 days): priority date is portable—you keep your place in line but need new PERM. After I-485 pending 180 days: can change to 'same or similar' job under AC21 portability.",
      },
      {
        question: "Can my spouse work while my green card is pending?",
        answer:
          "H-4 spouses can get EAD if the H-1B holder has approved I-140 or is in H-1B status beyond 6 years. Once I-485 is filed, your spouse can file their own I-765 for EAD regardless of your status. EAD lets them work for any employer.",
      },
      {
        question: "What if my employer withdraws the green card petition?",
        answer:
          "If I-140 was approved for less than 180 days, withdrawal cancels it and you lose the priority date. If approved for 180+ days, your priority date is preserved even after withdrawal—you can use it with a new employer's petition. I-485 pending 180+ days has additional protections under AC21.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Answers to common questions about US immigration, visas, and green cards.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Links */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-12">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Jump to Section
          </h2>
          <div className="flex flex-wrap gap-2">
            {faqCategories.map((category) => (
              <a
                key={category.title}
                href={`#${category.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="px-3 py-1.5 bg-gray-100 hover:bg-brand-50 text-gray-700 hover:text-brand-700 text-sm rounded-lg transition-colors"
              >
                {category.title}
              </a>
            ))}
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {faqCategories.map((category) => (
            <section
              key={category.title}
              id={category.title.toLowerCase().replace(/\s+/g, "-")}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {category.title}
              </h2>
              <div className="space-y-4">
                {category.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                  >
                    <h3 className="font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-brand-500 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white">
            Still Have Questions?
          </h2>
          <p className="mt-3 text-brand-100 max-w-xl mx-auto">
            Use our interactive timeline tool to explore your specific immigration 
            options and see personalized estimates.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-600 font-semibold rounded-lg hover:bg-brand-50 transition-colors"
            >
              Plan My Path
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-400 text-white font-semibold rounded-lg hover:bg-brand-300 transition-colors"
            >
              Read Guides
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex gap-3">
            <span className="text-amber-500">⚠️</span>
            <div>
              <p className="font-medium text-amber-900">Important Disclaimer</p>
              <p className="text-sm text-amber-800 mt-1">
                The information on this page is for general educational purposes only and does not 
                constitute legal advice. Immigration law is complex and changes frequently. Always 
                consult with a qualified immigration attorney for advice specific to your situation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
