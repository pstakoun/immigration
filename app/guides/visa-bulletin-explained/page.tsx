"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DynamicData } from "@/lib/dynamic-data";
import { CountryTabs, useCountrySelection } from "@/components/GuideComponents";
import JsonLd from "@/components/JsonLd";

export default function VisaBulletinExplainedGuide() {
  const { selectedCountry, setCountry, isLoaded } = useCountrySelection("other");
  const [priorityDates, setPriorityDates] = useState<DynamicData["priorityDates"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/processing-times")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.priorityDates) {
          setPriorityDates(data.data.priorityDates);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const countryKey = selectedCountry === "india" ? "india" : selectedCountry === "china" ? "china" : "allOther";

  // Get current priority dates for display
  const currentDates = useMemo(() => {
    if (!priorityDates) return null;
    return {
      eb1: priorityDates.eb1?.[countryKey] || "Current",
      eb2: priorityDates.eb2?.[countryKey] || "Current",
      eb3: priorityDates.eb3?.[countryKey] || "Current",
    };
  }, [priorityDates, countryKey]);

  const countryLabel = selectedCountry === "india" ? "India" : selectedCountry === "china" ? "China" : "All other countries";

  return (
    <>
      <JsonLd
        data={{
          "@type": "Article",
          headline: "Visa Bulletin Explained: Priority Dates, Categories & How to Read It",
          description:
            "Learn how to read the monthly visa bulletin from the Department of State. Understand priority dates, Final Action Dates vs Dates for Filing, what 'Current' means, and how it affects your green card timeline.",
          url: "https://stateside.app/guides/visa-bulletin-explained",
          publisher: { "@type": "Organization", name: "Stateside", url: "https://stateside.app" },
          mainEntityOfPage: "https://stateside.app/guides/visa-bulletin-explained",
        }}
      />
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      <Link href="/guides" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Guides
      </Link>

      <article className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Visa Bulletin Explained</h1>
        <p className="text-gray-600 mb-4">Priority dates, categories, and how to read the monthly bulletin</p>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <span className="text-sm text-gray-500">Show dates for:</span>
          <CountryTabs selected={selectedCountry} onChange={setCountry} isLoading={!isLoaded} />
        </div>

        {/* Live priority dates */}
        {!loading && currentDates && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900 text-sm">Current Priority Dates — {countryLabel}</h2>
              <Link href="/processing-times" className="text-sm text-brand-600 hover:text-brand-700">
                Full details ↗
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-xs text-gray-500 mb-1">EB-1</div>
                <div className={`font-semibold text-sm ${currentDates.eb1 === "Current" ? "text-emerald-700" : "text-gray-900"}`}>
                  {currentDates.eb1}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">EB-2</div>
                <div className={`font-semibold text-sm ${currentDates.eb2 === "Current" ? "text-emerald-700" : "text-gray-900"}`}>
                  {currentDates.eb2}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">EB-3</div>
                <div className={`font-semibold text-sm ${currentDates.eb3 === "Current" ? "text-emerald-700" : "text-gray-900"}`}>
                  {currentDates.eb3}
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        )}

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            The visa bulletin is a monthly document published by the Department of State. 
            It tells you whether immigrant visa numbers are available for your category 
            and country of birth. If you&apos;re pursuing an employment-based green card, 
            this bulletin controls when you can file your final application (I-485).
          </p>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What is a priority date?</h2>
            
            <p className="mb-3">
              Your priority date is essentially your place in line. It&apos;s the date 
              that marks when you entered the green card queue. How it&apos;s set depends 
              on your pathway:
            </p>
            
            <div className="space-y-3 mb-4">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm">
                  <strong className="text-gray-900">PERM-based (EB-2/EB-3 employer-sponsored):</strong>{" "}
                  Your priority date is when DOL receives your{" "}
                  <Link href="/guides/perm-process" className="text-brand-600 hover:text-brand-700">
                    PERM labor certification
                  </Link>{" "}
                  application.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm">
                  <strong className="text-gray-900">Self-petitioned (EB-1A, EB-1B, EB-2 NIW):</strong>{" "}
                  Your priority date is when USCIS receives your I-140 petition.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm">
                  <strong className="text-gray-900">EB-1C (multinational manager):</strong>{" "}
                  Same as self-petitioned — the I-140 receipt date.
                </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              <strong className="text-gray-900">Priority date portability:</strong> If your 
              I-140 is approved, you can &quot;port&quot; (carry over) your priority date to a 
              new petition — even with a different employer or category. This means if you 
              have an early EB-3 priority date and later file EB-2, you can use the EB-3 date.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What does &quot;Current&quot; mean?</h2>
            
            <p className="mb-3">
              When a category shows <strong className="text-emerald-700">&quot;C&quot; (Current)</strong>, 
              it means there&apos;s no backlog. All applicants in that category can file I-485 
              immediately, regardless of their priority date.
            </p>
            
            <p className="mb-3">
              When a category shows a <strong className="text-gray-900">date</strong> (like 
              &quot;01JAN22&quot;), it means only applicants with a priority date <em>before</em> that 
              date can proceed. Everyone else waits.
            </p>

            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <p className="text-sm text-amber-900">
                <strong>Example:</strong> If the bulletin shows EB-2 India as &quot;01JAN22&quot; 
                and your priority date is March 15, 2022 — you can&apos;t file I-485 yet. 
                You need to wait until the bulletin advances past your date.
              </p>
            </div>

            <p className="text-sm text-gray-500 mt-3">
              <strong className="text-gray-900">&quot;U&quot; (Unauthorized):</strong> Rarely 
              seen, this means no visas are available at all. The category is completely 
              backlogged.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Two charts: Final Action Date vs Date for Filing</h2>
            
            <p className="mb-4">
              Each visa bulletin has two charts. This confuses almost everyone:
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Final Action Dates</h3>
                <p className="text-sm text-gray-600">
                  This is the &quot;real&quot; chart. Your priority date must be before this 
                  date for USCIS to actually approve your green card and issue the visa.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50">
                <h3 className="font-semibold text-gray-900 mb-2">Dates for Filing</h3>
                <p className="text-sm text-gray-600">
                  An earlier, more generous date. If USCIS announces they&apos;re accepting 
                  the &quot;Dates for Filing&quot; chart, you can <em>file</em> I-485 when your 
                  priority date is before this date — even if your green card won&apos;t be 
                  approved yet.
                </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              <strong className="text-gray-900">Which chart applies?</strong> USCIS publishes 
              a separate announcement each month saying which chart to use for I-485 filing. 
              For most of recent history, USCIS has accepted the &quot;Dates for Filing&quot; chart 
              for employment-based categories.
            </p>
            
            <p className="text-sm text-gray-500">
              Filing earlier matters: once your I-485 is pending, you get a combo EAD/AP card, 
              can change employers after 180 days, and have protection against visa bulletin 
              retrogression.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Employment-based categories</h2>
            
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm">
                  <strong className="text-gray-900">EB-1:</strong> Priority workers — extraordinary 
                  ability (<Link href="/guides/o1-visa-guide" className="text-brand-600 hover:text-brand-700">EB-1A</Link>), 
                  outstanding professors/researchers (EB-1B), multinational managers 
                  (<Link href="/guides/l1-to-green-card" className="text-brand-600 hover:text-brand-700">EB-1C</Link>). 
                  Generally current except for India and China.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm">
                  <strong className="text-gray-900">EB-2:</strong> Advanced degree professionals 
                  and{" "}
                  <Link href="/guides/eb2-niw" className="text-brand-600 hover:text-brand-700">
                    National Interest Waiver
                  </Link>. Requires master&apos;s or bachelor&apos;s + 5 years experience. 
                  Significant backlogs for India.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm">
                  <strong className="text-gray-900">EB-3:</strong> Skilled workers with bachelor&apos;s 
                  degree. Similar or longer backlogs as EB-2 for India. Sometimes EB-3 moves 
                  faster than EB-2, which is why some people{" "}
                  <Link href="/guides/h1b-to-green-card" className="text-brand-600 hover:text-brand-700">
                    downgrade from EB-2 to EB-3
                  </Link>.
                </p>
              </div>
            </div>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Why some countries have backlogs</h2>
            
            <p className="mb-3">
              US immigration law limits each country to 7% of the total employment-based 
              green cards per year (~9,800 visas). Countries with high demand — mainly 
              India and China — have more applicants than available visas, creating backlogs 
              that can stretch years or decades.
            </p>
            
            <p className="mb-3">
              This per-country limit is why an EB-2 applicant from Canada might file I-485 
              immediately, while an EB-2 applicant from India with the same qualifications 
              and priority date waits years.
            </p>
            
            <p className="text-sm text-gray-500">
              Your country of <em>birth</em> determines your queue, not your citizenship. 
              A Canadian citizen born in India uses India&apos;s queue. Cross-chargeability 
              (using a spouse&apos;s country of birth) can sometimes help.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Retrogression</h2>
            
            <p className="mb-3">
              Sometimes the bulletin moves <em>backwards</em>. A date that was &quot;01MAR22&quot; 
              might go back to &quot;01JAN22&quot; the next month. This is called retrogression, and 
              it happens when USCIS receives more applications than expected.
            </p>
            
            <p className="mb-3">
              Retrogression typically happens in September/October (end of the federal fiscal 
              year) when USCIS tries to use up remaining visa numbers. The bulletin often 
              jumps forward in October (new fiscal year with fresh visa numbers), then 
              potentially retrogresses as the year progresses.
            </p>
            
            <p className="text-sm text-gray-600">
              <strong className="text-gray-900">If you&apos;ve already filed I-485:</strong> Retrogression 
              doesn&apos;t affect you. Your application stays pending. USCIS just can&apos;t 
              <em>approve</em> it until your date is current again. Your EAD and AP remain valid.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">How to check the bulletin</h2>
            
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">Official source:</strong> The Department of State 
                  publishes the bulletin mid-month for the following month at{" "}
                  <a href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700">
                    travel.state.gov
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">USCIS chart announcement:</strong> After the 
                  bulletin, USCIS announces which chart (Final Action or Dates for Filing) to use 
                  for I-485 submissions.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">Track it here:</strong> We pull the latest 
                  priority dates automatically.{" "}
                  <Link href="/processing-times" className="text-brand-600 hover:text-brand-700">
                    See current dates →
                  </Link>
                </span>
              </li>
            </ul>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Key terms</h2>
            
            <dl className="space-y-3 text-sm">
              <div className="flex gap-3">
                <dt className="font-semibold text-gray-900 min-w-[100px]">Priority date</dt>
                <dd className="text-gray-600">Your place in line — when your PERM was filed or I-140 was received</dd>
              </div>
              <div className="flex gap-3">
                <dt className="font-semibold text-gray-900 min-w-[100px]">Current</dt>
                <dd className="text-gray-600">No backlog — all applicants can proceed</dd>
              </div>
              <div className="flex gap-3">
                <dt className="font-semibold text-gray-900 min-w-[100px]">Retrogression</dt>
                <dd className="text-gray-600">Dates move backward — fewer people can file</dd>
              </div>
              <div className="flex gap-3">
                <dt className="font-semibold text-gray-900 min-w-[100px]">Chargeability</dt>
                <dd className="text-gray-600">Country of birth used for visa limits</dd>
              </div>
              <div className="flex gap-3">
                <dt className="font-semibold text-gray-900 min-w-[100px]">Per-country limit</dt>
                <dd className="text-gray-600">7% of total EB visas per country per year</dd>
              </div>
              <div className="flex gap-3">
                <dt className="font-semibold text-gray-900 min-w-[100px]">Fiscal year</dt>
                <dd className="text-gray-600">October 1 to September 30 — new visa numbers each October</dd>
              </div>
            </dl>
          </section>

          <section className="pt-6 mt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              See how the visa bulletin affects your specific green card timeline.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors"
            >
              See your timeline
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </section>
        </div>
      </article>
    </div>
    </>
  );
}
