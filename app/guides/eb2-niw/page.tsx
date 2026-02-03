"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { DynamicData } from "@/lib/dynamic-data";
import { calculateNewFilerWait } from "@/lib/processing-times";
import { CountryOfBirth } from "@/lib/filter-paths";

function CountryTabs({ selected, onChange }: { selected: CountryOfBirth; onChange: (country: CountryOfBirth) => void }) {
  const countries: { id: CountryOfBirth; label: string }[] = [
    { id: "other", label: "Most countries" },
    { id: "india", label: "India" },
    { id: "china", label: "China" },
  ];
  
  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
      {countries.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            selected === c.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

function TimelineBar({ steps }: { steps: { label: string; months: number; color: string }[] }) {
  const totalMonths = steps.reduce((sum, s) => sum + s.months, 0);
  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-500 text-white",
    amber: "bg-amber-500 text-white",
    orange: "bg-orange-500 text-white",
  };
  
  return (
    <div className="my-6">
      <div className="flex items-stretch h-10 rounded-lg overflow-hidden border border-gray-200">
        {steps.map((step, i) => {
          const width = (step.months / totalMonths) * 100;
          return (
            <div
              key={i}
              className={`${colorClasses[step.color]} flex items-center justify-center text-sm font-medium px-1 ${i > 0 ? "border-l border-white/20" : ""}`}
              style={{ width: `${Math.max(width, 10)}%`, minWidth: "55px" }}
            >
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>
      <div className="flex mt-1.5 text-xs text-gray-500">
        {steps.map((step, i) => {
          const width = (step.months / totalMonths) * 100;
          return (
            <div key={i} className={`text-center ${step.color === "orange" ? "text-orange-600" : ""}`}
              style={{ width: `${Math.max(width, 10)}%`, minWidth: "55px" }}>
              {step.months >= 12 ? `${(step.months / 12).toFixed(step.months >= 24 ? 0 : 1)} yr` : `${step.months} mo`}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimelineBarSkeleton() {
  return (
    <div className="my-6 animate-pulse">
      <div className="h-10 rounded-lg bg-gray-200" />
      <div className="flex mt-1.5 gap-2">
        <div className="h-3 bg-gray-100 rounded flex-1" />
        <div className="h-3 bg-gray-100 rounded flex-1" />
        <div className="h-3 bg-gray-100 rounded flex-1" />
      </div>
    </div>
  );
}

export default function EB2NIWGuide() {
  const [selectedCountry, setSelectedCountry] = useState<CountryOfBirth>("other");
  const [processingTimes, setProcessingTimes] = useState<{
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
            i140: { min: pt.i140.min, max: pt.i140.max, premium: pt.i140.premiumDays },
            i485: { min: pt.i485.min, max: pt.i485.max },
          });
          if (data.data.priorityDates) setPriorityDates(data.data.priorityDates);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const i140Months = processingTimes?.i140.max ?? 9;
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
      { label: "I-140 NIW", months: i140Months, color: "emerald" },
    ];
    if (pdWaitMonths > 0) steps.push({ label: "PD Wait", months: pdWaitMonths, color: "orange" });
    steps.push({ label: "I-485", months: i485Months, color: "amber" });
    return steps;
  }, [i140Months, pdWaitMonths, i485Months]);

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
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">EB-2 NIW</h1>
        <p className="text-gray-600 mb-4">National Interest Waiver</p>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <span className="text-sm text-gray-500">Your country of birth:</span>
          <CountryTabs selected={selectedCountry} onChange={setSelectedCountry} />
        </div>
        
        <div className="flex items-baseline gap-3 mb-2">
          {loading ? <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" /> : (
            <span className="text-3xl font-semibold text-gray-900">{formatTotalTime(totalMonths)}</span>
          )}
          <span className="text-gray-500">total timeline</span>
        </div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          No employer needed
        </div>

        {loading ? <TimelineBarSkeleton /> : <TimelineBar steps={timelineSteps} />}

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            NIW lets you petition for yourself. No employer sponsor, no PERM labor 
            certification. You argue that your work benefits the US enough that they 
            should waive the normal job offer requirement.
          </p>
          
          <p>
            This works well for researchers, engineers, entrepreneurs, and others 
            with a track record of impact. Not everyone qualifies. You need demonstrable 
            achievements and a plan for future work.
          </p>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
            
            <p className="mb-3">You need to meet EB-2 education requirements:</p>
            <ul className="space-y-2 text-sm mb-4">
              <li className="flex gap-2">
                <span className="text-gray-400">•</span>
                Master&apos;s degree or PhD, OR
              </li>
              <li className="flex gap-2">
                <span className="text-gray-400">•</span>
                Bachelor&apos;s plus 5 years progressive experience
              </li>
            </ul>

            <p className="mb-3">
              Then prove the three-prong Dhanasar test (from a 2016 AAO decision):
            </p>
            
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm">
                  <strong className="text-gray-900">1. Substantial merit and national importance.</strong> Your 
                  work matters beyond a single employer or locality. &quot;National importance&quot; is 
                  interpreted broadly: tech, healthcare, education, and business all count.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm">
                  <strong className="text-gray-900">2. Well positioned to advance the endeavor.</strong> You 
                  have the skills, background, and plan to make progress. Education, achievements, 
                  and future commitments help here.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm">
                  <strong className="text-gray-900">3. Beneficial to waive the job offer.</strong> Would 
                  requiring a labor certification be a net negative? For entrepreneurs 
                  and people in fast-moving fields, this is often easy to show.
                </p>
              </div>
            </div>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">The process</h2>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div>
                  <div className="flex items-baseline flex-wrap gap-x-2">
                    <strong className="text-gray-900">File I-140 (NIW)</strong>
                    <span className="text-gray-500 text-sm">
                      {processingTimes ? `${processingTimes.i140.min}-${processingTimes.i140.max} mo` : "6-9 mo"} regular, {processingTimes?.i140.premium ?? 15} days premium
                    </span>
                    <Link href="/processing-times" className="text-gray-400 hover:text-gray-600 text-sm">↗</Link>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    You file this yourself or with a lawyer. Your priority date is when USCIS 
                    receives the petition. Most of the work is preparing your evidence and 
                    argument.
                  </p>
                </div>
              </div>
              
              {!loading && pdWaitMonths > 6 && (
                <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="flex items-baseline gap-2">
                      <strong className="text-gray-900">Wait for priority date</strong>
                      <span className="text-orange-600 text-sm">
                        ~{pdWaitMonths >= 12 ? `${Math.round(pdWaitMonths / 12)} years` : `${pdWaitMonths} months`}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      NIW uses the EB-2 queue. India and China have waits.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <div>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-gray-900">File I-485</strong>
                    <span className="text-gray-500 text-sm">
                      {processingTimes ? `${processingTimes.i485.min}-${processingTimes.i485.max} mo` : "10-18 mo"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    File when your date is current.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Evidence that helps</h2>
            
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-emerald-500">•</span>
                <strong className="text-gray-900">Recommendation letters</strong> from 
                experts in your field (5-8 is typical), especially from people who 
                don&apos;t know you directly
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">•</span>
                <strong className="text-gray-900">Publications and citations</strong> showing 
                your work is used by others
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">•</span>
                <strong className="text-gray-900">Patents</strong> (granted or pending)
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">•</span>
                <strong className="text-gray-900">Media coverage or awards</strong>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">•</span>
                <strong className="text-gray-900">Business impact</strong> like revenue, 
                users, contracts
              </li>
            </ul>
            
            <p className="text-sm text-gray-500 mt-4">
              The petition letter matters. It needs to connect your evidence to the 
              three Dhanasar prongs clearly.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Common fields</h2>
            <p className="mb-3">
              NIW works across many fields: STEM research, medicine, business, 
              education, arts. Recent years have seen more approvals for entrepreneurs 
              and people in AI/ML, biotech, and clean energy.
            </p>
            <p className="text-sm text-gray-500">
              The key is demonstrating that your work has impact beyond a single employer.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">NIW + PERM strategy</h2>
            <p className="mb-3">
              Many people file NIW while their employer files PERM in parallel. This 
              gives you two paths to approval. If the PERM-based I-140 is approved 
              first with an earlier priority date, you can use that date for NIW.
            </p>
            <p className="text-sm text-gray-500">
              Useful if you want the flexibility of self-sponsorship but also want 
              the earliest possible priority date.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">RFEs</h2>
            <p>
              Requests for Evidence are common. USCIS may want more documentation or 
              clarification. You get about 87 days to respond. Address exactly what 
              they asked for with clear evidence.
            </p>
          </section>

          <section className="pt-6 mt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              Compare NIW to employer-sponsored routes for your situation.
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
