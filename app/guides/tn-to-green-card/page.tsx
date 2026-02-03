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
          return (
            <div key={i} className={`text-center ${step.color === "orange" ? "text-orange-600" : ""}`}
              style={{ width: `${Math.max(width, 8)}%`, minWidth: "45px" }}>
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

  const permMonths = processingTimes?.perm.months ?? 17;
  const i140Months = 1;
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
        <p className="text-gray-600 mb-4">Canadian and Mexican professionals under NAFTA/USMCA</p>
        
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
            TN is a non-immigrant visa, meaning you&apos;re technically supposed to go home 
            eventually. The tricky part is that applying for a green card signals you 
            want to stay permanently—that&apos;s called &quot;immigrant intent,&quot; and it 
            conflicts with TN&apos;s requirements.
          </p>
          
          {!loading && selectedCountry === "other" && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-sm text-emerald-800">
                <strong>If you were born in Canada or Mexico</strong> (not just a citizen), 
                you fall under &quot;All Other Countries&quot; in the visa bulletin. Unlike India 
                or China (where waits can be 10+ years), the backlog is typically 1-2 years 
                at most.
              </p>
            </div>
          )}

          {/* Dual Intent */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">The dual intent problem</h2>
            
            <p className="mb-4">
              The risk shows up in two places: when you renew your TN at the border, and 
              when you travel internationally during the green card process. A border officer 
              who sees pending immigrant paperwork might question your non-immigrant intent.
            </p>
            
            <p className="mb-4 text-sm text-gray-600">
              That said, thousands of people successfully get green cards from TN status every 
              year. The key is understanding when immigrant intent matters and when it doesn&apos;t.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Stay on TN</h3>
                <p className="text-sm text-gray-600">
                  Start the green card process while on TN. Works well if you can avoid 
                  international travel or renewing at the border. Many people do this successfully.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50">
                <h3 className="font-semibold text-gray-900 mb-2">Switch to H-1B first</h3>
                <p className="text-sm text-gray-600">
                  H-1B explicitly allows dual intent. If you can get one (lottery or cap-exempt), 
                  it removes the travel risk entirely. Adds a few months but gives peace of mind.
                </p>
              </div>
            </div>
          </section>

          {/* When does intent matter */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">When intent actually matters</h2>
            
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">Filing PERM and I-140:</strong> Doesn&apos;t 
                  automatically create intent problems. These are employer filings, and having 
                  them pending doesn&apos;t mean you&apos;ve abandoned your TN status.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">Filing I-485:</strong> This is when you&apos;re 
                  clearly declaring intent to stay. Once filed, you&apos;ll need Advance Parole 
                  to travel.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">Border crossings:</strong> The risk point 
                  for TN holders. An officer might deny entry if they believe you&apos;ve 
                  abandoned non-immigrant intent, though this is relatively rare.
                </span>
              </li>
            </ul>
          </section>

          {/* The actual process */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">The process</h2>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">PERM</strong>
                  <span className="text-gray-500 ml-2">~{permMonths} months</span>
                  <p className="text-sm text-gray-600">
                    Identical to any other employer-sponsored case. Your employer files it; 
                    you wait.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">I-140</strong>
                  <span className="text-gray-500 ml-2">{processingTimes?.i140.premium ?? 15} days with premium</span>
                  <p className="text-sm text-gray-600">Almost everyone uses premium processing.</p>
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
                      You&apos;ll wait for your date to become current. During this time, 
                      your TN status continues as normal.
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
                    File when your priority date is current. {!loading && selectedCountry === "other" && "Wait times for Canada/Mexico are much shorter than India or China."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Travel considerations */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Traveling during the process</h2>
            <p className="mb-3">
              Once you file I-485, don&apos;t leave the US without Advance Parole (AP). 
              If you travel and return using AP, you&apos;re no longer in TN status—you&apos;re 
              considered a &quot;parolee&quot; waiting for your green card.
            </p>
            <p className="text-sm text-gray-500">
              Your TD dependents follow the same rules. They should also apply for AP 
              if they want to travel after I-485 is filed.
            </p>
          </section>

          {/* CTA */}
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
