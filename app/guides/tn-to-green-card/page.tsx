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
              style={{ width: `${Math.max(width, 8)}%`, minWidth: "45px" }}
            >
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>
      <div className="flex mt-1.5 text-xs text-gray-500">
        {steps.map((step, i) => {
          const width = (step.months / totalMonths) * 100;
          const formatTime = (m: number) => {
            if (m < 1) return `${Math.round(m * 30)}d`;
            if (m >= 12) return `${(m / 12).toFixed(m >= 24 ? 0 : 1)} yr`;
            return `${Math.round(m)} mo`;
          };
          return (
            <div key={i} className={`text-center ${step.color === "orange" ? "text-orange-600" : ""}`}
              style={{ width: `${Math.max(width, 8)}%`, minWidth: "45px" }}>
              {formatTime(step.months)}
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

export default function TNToGreenCardGuide() {
  const [selectedCountry, setSelectedCountry] = useState<CountryOfBirth>("other");
  const [processingTimes, setProcessingTimes] = useState<{
    perm: { months: number };
    i140: { premium: number };
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
            perm: { months: pt.perm.months },
            i140: { premium: pt.i140.premiumDays },
            i485: { min: pt.i485.min, max: pt.i485.max },
          });
          if (data.data.priorityDates) setPriorityDates(data.data.priorityDates);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Full PERM timeline: PWD (~6mo) + Recruitment (~3mo) + DOL Review
  const dolReviewMonths = processingTimes?.perm.months ?? 17;
  const permMonths = 6 + 3 + dolReviewMonths; // ~26 months total
  const i140Months = 0.5; // Premium processing (15 days)
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
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">TN to Green Card</h1>
        <p className="text-gray-600 mb-4">Canadian and Mexican professionals under USMCA</p>
        
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

        {loading ? <TimelineBarSkeleton /> : <TimelineBar steps={timelineSteps} />}

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            TN is a non-immigrant visa. You&apos;re supposed to maintain ties to your home 
            country and have no intent to stay permanently. Applying for a green card 
            shows permanent intent, which creates a conflict.
          </p>
          
          <p>
            This conflict is called &quot;dual intent&quot; and it&apos;s the main complication 
            for TN holders pursuing green cards. The good news: thousands of people do it 
            successfully every year.
          </p>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Why dual intent matters</h2>
            
            <p className="mb-4">
              CBP officers at the border have discretion. If they see evidence of immigrant 
              intent (pending green card paperwork), they might question whether you still 
              qualify for TN status. This matters when:
            </p>
            
            <ul className="space-y-2 text-sm text-gray-600 mb-4">
              <li>• Renewing TN at a port of entry or consulate</li>
              <li>• Re-entering the US after international travel</li>
              <li>• Applying for TN extension within the US (lower risk, but still possible)</li>
            </ul>
            
            <p className="text-sm text-gray-600">
              The legal standard is whether you have <em>present intent</em> to abandon 
              your TN status. Having a green card application in progress doesn&apos;t 
              automatically disqualify you, but it can raise questions.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Two approaches</h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Stay on TN</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Start the green card process while on TN. Minimize border crossings until 
                  you file I-485 and get Advance Parole.
                </p>
                <p className="text-sm text-gray-500">
                  Works well for people who rarely travel internationally.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50">
                <h3 className="font-semibold text-gray-900 mb-2">Switch to H-1B</h3>
                <p className="text-sm text-gray-600 mb-2">
                  H-1B allows dual intent explicitly. No conflict with green card applications.
                </p>
                <p className="text-sm text-gray-500">
                  Requires lottery win or cap-exempt employer (universities, research).
                </p>
              </div>
            </div>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Intent at each stage</h2>
            
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">PERM and I-140:</strong> These are 
                  employer filings. Having them pending or approved doesn&apos;t mean 
                  you&apos;ve committed to staying. Lower risk.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">I-485:</strong> Filing adjustment of 
                  status is a clear statement of immigrant intent. After this point, 
                  get Advance Parole before any international travel.
                </span>
              </li>
            </ul>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">The process</h2>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">PERM</strong>
                  <span className="text-gray-500 ml-2">~{permMonths} months</span>
                  <p className="text-sm text-gray-600">
                    Same process as any employer-sponsored case. Your employer handles 
                    the labor certification.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">I-140</strong>
                  <span className="text-gray-500 ml-2">{processingTimes?.i140.premium ?? 15} days with premium</span>
                  <p className="text-sm text-gray-600">
                    Most employers pay for premium processing.
                  </p>
                </div>
              </div>
              
              {!loading && pdWaitMonths > 6 && (
                <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Priority date wait</strong>
                    <span className="text-orange-600 ml-2">
                      ~{pdWaitMonths >= 12 ? `${Math.round(pdWaitMonths / 12)} years` : `${pdWaitMonths} months`}
                    </span>
                    <p className="text-sm text-gray-600">
                      Wait for your date to become current. Your TN status continues 
                      as normal during this time.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">I-485</strong>
                  <span className="text-gray-500 ml-2">
                    {processingTimes ? `${processingTimes.i485.min}-${processingTimes.i485.max}` : "10-18"} months
                  </span>
                  <p className="text-sm text-gray-600">
                    File when your priority date is current.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Travel after I-485</h2>
            <p className="mb-3">
              Once you file I-485, don&apos;t leave the US without Advance Parole (AP). 
              Returning on AP abandons your TN status. You become a &quot;parolee&quot; 
              for the duration of your adjustment application.
            </p>
            <p className="text-sm text-gray-600 mb-3">
              This is different from H-1B holders, who can choose to re-enter on their 
              H-1B or AP. TN holders don&apos;t have that option.
            </p>
            <p className="text-sm text-gray-500">
              TD dependents face the same situation. They should also apply for AP 
              if they need to travel.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">If something goes wrong</h2>
            <p className="mb-3">
              If your TN renewal is denied at the border due to suspected immigrant intent, 
              you may be able to apply for TN extension from within the US using Form I-129. 
              This avoids the border crossing issue.
            </p>
            <p className="text-sm text-gray-500">
              If your green card is denied while you&apos;re on AP (not TN), you&apos;ll 
              need to leave the US or find another status.
            </p>
          </section>

          <section className="pt-6 mt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-4">Build a timeline based on your situation.</p>
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
