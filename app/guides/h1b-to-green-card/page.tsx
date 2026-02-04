"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DynamicData } from "@/lib/dynamic-data";
import { calculateNewFilerWait } from "@/lib/processing-times";
import { CountryTabs, TimelineBar, TimelineBarSkeleton, LiveTime, useCountrySelection } from "@/components/GuideComponents";

export default function H1BToGreenCardGuide() {
  const { selectedCountry, setCountry, isLoaded } = useCountrySelection("other");
  const [processingTimes, setProcessingTimes] = useState<{
    perm: { months: number; processing: string };
    permAudit: { months: number; processing: string };
    pwd: { months: number; processing: string };
    i140: { min: number; max: number; premium: number };
    i485: { min: number; max: number };
  } | null>(null);
  const [priorityDates, setPriorityDates] = useState<DynamicData["priorityDates"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/processing-times")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const pt = data.data.processingTimes;
          setProcessingTimes({
            perm: { months: pt.perm.months, processing: pt.perm.currentlyProcessing },
            permAudit: { months: pt.permAudit.months, processing: pt.permAudit.currentlyProcessing },
            pwd: { months: pt.pwd.months, processing: pt.pwd.currentlyProcessing },
            i140: { min: pt.i140.min, max: pt.i140.max, premium: pt.i140.premiumDays },
            i485: { min: pt.i485.min, max: pt.i485.max },
          });
          if (data.data.priorityDates) setPriorityDates(data.data.priorityDates);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Full PERM timeline: PWD + Recruitment (3mo) + DOL Review
  const pwdMonths = processingTimes?.pwd.months ?? 6;
  const dolReviewMonths = processingTimes?.perm.months ?? 17;
  const permMonths = pwdMonths + 3 + dolReviewMonths; // ~26 months total
  const i140Months = 0.5; // Premium processing (15 days) - most employers use this
  const i485Months = processingTimes?.i485.max ?? 18;

  const pdWaitMonths = useMemo(() => {
    if (!priorityDates) return 0;
    const pdStr = priorityDates.eb2?.[
      selectedCountry === "india" ? "india" : selectedCountry === "china" ? "china" : "allOther"
    ] || "Current";
    return Math.round(calculateNewFilerWait(pdStr, selectedCountry, "eb2").estimatedMonths);
  }, [priorityDates, selectedCountry]);

  const timelineSteps = useMemo(() => {
    const steps: { label: string; months: number; color: string }[] = [
      { label: "PERM", months: permMonths, color: "emerald" },
      { label: "I-140", months: i140Months, color: "emerald" },
    ];
    if (pdWaitMonths > 0) steps.push({ label: "PD Wait", months: pdWaitMonths, color: "orange" });
    steps.push({ label: "I-485", months: i485Months, color: "amber" });
    return steps;
  }, [permMonths, i140Months, pdWaitMonths, i485Months]);

  const totalMonths = timelineSteps.reduce((sum, s) => sum + s.months, 0);

  const formatTotalTime = (months: number) => {
    if (months < 24) return `${Math.round(months / 12 * 2) / 2}–${Math.round(months / 12 * 2 + 1) / 2} years`;
    return `~${Math.round(months / 12)} years`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      <Link href="/guides" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Guides
      </Link>

      <article className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">H-1B to Green Card</h1>
        <p className="text-gray-600 mb-4">Employer-sponsored EB-2 or EB-3</p>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <span className="text-sm text-gray-500">Your country of birth:</span>
          <CountryTabs selected={selectedCountry} onChange={setCountry} isLoading={!isLoaded} />
        </div>
        
        <div className="flex items-baseline gap-3 mb-2">
          {loading ? (
            <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
          ) : (
            <span className="text-3xl font-semibold text-gray-900">{formatTotalTime(totalMonths)}</span>
          )}
          <span className="text-gray-500">total timeline</span>
        </div>

        {loading ? <TimelineBarSkeleton /> : <TimelineBar steps={timelineSteps} />}

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            The employer-sponsored green card has three steps: PERM labor certification, 
            I-140 petition, and I-485 adjustment of status. Your <strong className="text-gray-900">priority date</strong> is 
            when DOL receives your PERM application. This date determines your place in the 
            visa queue.
          </p>

          <section id="perm" className="pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <h2 className="text-lg font-semibold text-gray-900">PERM Labor Certification</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">DOL processing cases from:</span>
                  <div className="font-medium text-gray-900">{processingTimes?.perm.processing ?? "Loading..."}</div>
                </div>
                <div>
                  <span className="text-gray-500">Current wait:</span>
                  <div className="font-medium text-gray-900">
                    ~{permMonths} months
                    <Link href="/processing-times" className="text-gray-400 hover:text-gray-600 ml-1">↗</Link>
                  </div>
                </div>
              </div>
            </div>

            <p className="mb-3">
              Your employer proves no qualified US workers are available for the position.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 mb-3">
              <li><strong className="text-gray-900">Prevailing wage:</strong> DOL sets minimum salary 
                ({processingTimes ? `~${processingTimes.pwd.months} months` : "~6 months"})</li>
              <li><strong className="text-gray-900">Recruitment:</strong> Job postings and ads, then 
                a 30-day quiet period (2-3 months)</li>
              <li><strong className="text-gray-900">DOL review:</strong> They check recruitment was done 
                properly</li>
            </ul>
            <p className="text-sm text-gray-500">
              DOL audits 20-30% of cases. If audited, add 6-12 months.
            </p>
          </section>

          <section id="i140" className="pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <h2 className="text-lg font-semibold text-gray-900">I-140 Immigrant Petition</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-sm">
                <LiveTime label="Regular" time={processingTimes ? `${processingTimes.i140.min}-${processingTimes.i140.max} months` : "6-9 months"} />
                <span className="mx-3 text-gray-300">|</span>
                <LiveTime label="Premium" time={processingTimes ? `${processingTimes.i140.premium} days` : "15 days"} />
                <Link href="/processing-times" className="text-gray-400 hover:text-gray-600 ml-2">↗</Link>
              </div>
            </div>

            <p className="mb-3">
              Your employer files I-140 to prove you have the qualifications. Most 
              employers use premium processing for a 15-day decision.
            </p>
            <p className="text-sm text-gray-600">
              <strong className="text-gray-900">Portability:</strong> Once your I-140 
              is approved, you can change employers and port your priority date to a 
              new petition. After 180 days of approval, your priority date is protected 
              even if the original employer withdraws the I-140.
            </p>
          </section>

          {!loading && pdWaitMonths > 6 && (
            <section id="pd-wait" className="pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <h2 className="text-lg font-semibold text-gray-900">Priority Date Wait</h2>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4 mb-4 border border-orange-100">
                <div className="text-sm">
                  <span className="text-orange-800 font-medium">
                    ~{pdWaitMonths >= 12 ? `${Math.round(pdWaitMonths / 12)} years` : `${pdWaitMonths} months`}
                  </span>
                  <span className="text-orange-700 ml-2">
                    estimated for {selectedCountry === "india" ? "India" : selectedCountry === "china" ? "China" : "your country"}
                  </span>
                  <Link href="/processing-times" className="text-orange-400 hover:text-orange-600 ml-2">↗</Link>
                </div>
              </div>

              <p className="mb-3">
                With an approved I-140, you wait for your priority date to become 
                &quot;current&quot; in the monthly visa bulletin. Only then can you 
                file I-485.
              </p>
              <p className="text-sm text-gray-600">
                <strong className="text-gray-900">While waiting:</strong> Your H-1B 
                can be extended past 6 years. You can change jobs and keep your priority 
                date. Some people file EB-1 or NIW petitions in parallel.
              </p>
            </section>
          )}

          <section id="i485" className="pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <h2 className="text-lg font-semibold text-gray-900">I-485 Adjustment of Status</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-sm">
                <LiveTime label="Processing" time={processingTimes ? `${processingTimes.i485.min}-${processingTimes.i485.max} months` : "10-18 months"} />
                <Link href="/processing-times" className="text-gray-400 hover:text-gray-600 ml-2">↗</Link>
              </div>
            </div>

            <p className="mb-3">
              File I-485 with I-765 (work permit) and I-131 (travel permit). The combo 
              EAD/AP card arrives in a few months, which lets you work for any employer 
              and travel while the green card is pending.
            </p>
            <p className="text-sm text-gray-600">
              Most cases include an interview at your local USCIS office.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">EB-2 vs EB-3</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">EB-2</h3>
                <p className="text-sm text-gray-600">
                  Master&apos;s degree or higher. Or bachelor&apos;s plus 5 years 
                  progressive experience.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">EB-3</h3>
                <p className="text-sm text-gray-600">
                  Bachelor&apos;s degree. Or 2+ years training/experience for 
                  skilled positions.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              <strong className="text-gray-900">Downgrade:</strong> If EB-2 has a 
              longer wait than EB-3, you can downgrade and keep your priority date.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">H-4 dependents</h2>
            <p className="mb-3">
              Your spouse and children under 21 can file I-485 with you if your 
              priority date is current. They get their own EAD and AP while waiting.
            </p>
            <p className="text-sm text-gray-500">
              Separately, if your I-140 is approved and you&apos;ve been granted 
              H-1B extensions beyond 6 years (because of a visa backlog), your H-4 
              spouse can get an EAD even before you file I-485.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Key rules</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">H-1B extensions:</strong> Normally 
                  capped at 6 years. You get 1-year extensions if PERM has been pending 
                  365+ days. You get 3-year extensions if I-140 is approved and your 
                  priority date is not yet current.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">Concurrent filing:</strong> If your 
                  priority date is already current when I-140 is filed, submit I-485 
                  at the same time.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">Job changes:</strong> After I-485 
                  has been pending for 180 days, you can switch employers if the new 
                  job is similar to the original.
                </span>
              </li>
            </ul>
          </section>

          <section className="pt-6 mt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              Enter your details for a timeline specific to your situation.
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
  );
}
