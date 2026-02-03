"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { DynamicData } from "@/lib/dynamic-data";
import { calculateNewFilerWait } from "@/lib/processing-times";
import { CountryOfBirth } from "@/lib/filter-paths";

// Country selector tabs
function CountryTabs({
  selected,
  onChange,
}: {
  selected: CountryOfBirth;
  onChange: (country: CountryOfBirth) => void;
}) {
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
            selected === c.id
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

// Timeline bar
function TimelineBar({
  steps,
}: {
  steps: { label: string; months: number; color: string }[];
}) {
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
            <div
              key={i}
              className={`text-center ${step.color === "orange" ? "text-orange-600" : ""}`}
              style={{ width: `${Math.max(width, 8)}%`, minWidth: "45px" }}
            >
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

function LiveTime({ label, time, premium }: { label: string; time: string; premium?: string }) {
  return (
    <div className="inline-flex items-baseline gap-1.5 text-sm">
      <span className="text-gray-500">{label}:</span>
      <span className="font-medium text-gray-900">{time}</span>
      {premium && <span className="text-emerald-600">({premium} premium)</span>}
    </div>
  );
}

export default function H1BToGreenCardGuide() {
  const [selectedCountry, setSelectedCountry] = useState<CountryOfBirth>("other");
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
          if (data.data.priorityDates) {
            setPriorityDates(data.data.priorityDates);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const permMonths = processingTimes?.perm.months ?? 17;
  const i140Months = processingTimes?.i140.max ?? 9;
  const i485Months = processingTimes?.i485.max ?? 18;

  const pdWaitMonths = useMemo(() => {
    if (!priorityDates) return 0;
    const pdStr = priorityDates.eb2?.[
      selectedCountry === "india" ? "india" : 
      selectedCountry === "china" ? "china" : "allOther"
    ] || "Current";
    const waitResult = calculateNewFilerWait(pdStr, selectedCountry, "eb2");
    return Math.round(waitResult.estimatedMonths);
  }, [priorityDates, selectedCountry]);

  const timelineSteps = useMemo(() => {
    const steps: { label: string; months: number; color: string }[] = [
      { label: "PERM", months: permMonths, color: "emerald" },
      { label: "I-140", months: i140Months, color: "emerald" },
    ];
    if (pdWaitMonths > 0) {
      steps.push({ label: "PD Wait", months: pdWaitMonths, color: "orange" });
    }
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
          <CountryTabs selected={selectedCountry} onChange={setSelectedCountry} />
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
            The standard employer-sponsored green card has three main steps: PERM labor certification 
            (proving no Americans want the job), I-140 petition (proving you qualify), and I-485 
            adjustment (actually getting the green card). Your place in the visa queue is set by 
            your <strong className="text-gray-900">priority date</strong>, which is when DOL 
            receives your PERM application.
          </p>

          {/* PERM Section */}
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
              Before filing anything with USCIS, your employer has to prove they tried to hire 
              an American for the role. This takes a while:
            </p>
            <ul className="space-y-2 text-sm text-gray-600 mb-3">
              <li><strong className="text-gray-900">Prevailing wage request</strong> — DOL determines the minimum 
                salary for your job title and location ({processingTimes ? `${processingTimes.pwd.months} months right now` : "around 6 months"})</li>
              <li><strong className="text-gray-900">Recruitment</strong> — Job postings, ads, and a 30-day 
                &quot;quiet period&quot; afterward (2-3 months total)</li>
              <li><strong className="text-gray-900">DOL review</strong> — They check if recruitment was done 
                properly and nobody qualified applied</li>
            </ul>
            <p className="text-sm text-gray-500">
              DOL audits 20-30% of cases. If yours gets picked, expect an extra {processingTimes ? (processingTimes.permAudit.months - processingTimes.perm.months) : "6-8"} months 
              while they request and review documentation.
            </p>
          </section>

          {/* I-140 Section */}
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
              Once PERM clears, your employer files I-140 with USCIS. This proves you have the 
              qualifications for the job. Almost everyone pays extra for premium processing to 
              get a decision in 15 business days instead of waiting months.
            </p>
            <p className="text-sm text-gray-600">
              <strong className="text-gray-900">The 180-day rule:</strong> After your I-140 has been 
              approved for 180 days, you can switch jobs and keep your priority date. This is huge 
              for people with long waits—you&apos;re no longer tied to one employer.
            </p>
          </section>

          {/* Priority Date Wait Section */}
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
                With an approved I-140, you wait for your priority date to become &quot;current&quot; in 
                the monthly visa bulletin. Only then can you file I-485. The wait depends entirely 
                on your country of birth and how fast the dates move.
              </p>
              <p className="text-sm text-gray-600">
                <strong className="text-gray-900">While you wait:</strong> Your H-1B can be extended 
                past the normal 6-year limit. You can change jobs (keeping your priority date). Some 
                people file for EB-1 or NIW in parallel to potentially skip the line.
              </p>
            </section>
          )}

          {/* I-485 Section */}
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
              The home stretch. You file I-485 along with I-765 (work permit) and I-131 
              (travel permit). The combo EAD/AP card usually arrives within a few months, 
              which means you can work for any employer and travel freely while waiting 
              for the green card itself.
            </p>
            <p className="text-sm text-gray-600">
              Most cases include an interview at your local USCIS office. They verify your 
              documents and ask basic questions about your application.
            </p>
          </section>

          {/* EB-2 vs EB-3 */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">EB-2 vs EB-3: Which category?</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">EB-2</h3>
                <p className="text-sm text-gray-600">
                  Advanced degree (master&apos;s or higher) OR a bachelor&apos;s with 5+ years 
                  of progressive experience in the field
                </p>
              </div>
              <div className="p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">EB-3</h3>
                <p className="text-sm text-gray-600">
                  Bachelor&apos;s degree OR 2+ years of training/experience for skilled positions
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              <strong className="text-gray-900">Downgrade option:</strong> If EB-2 has a longer 
              wait than EB-3 for your country (it happens), you can &quot;downgrade&quot; your 
              case to EB-3 and keep your original priority date. Some people file both categories 
              simultaneously.
            </p>
          </section>

          {/* Tips */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Things to know</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">H-1B extensions:</strong> Normally capped 
                  at 6 years. You can extend in 1-year increments if your PERM has been 
                  pending for 365+ days. If your I-140 is approved and there&apos;s a visa 
                  backlog, you can get 3-year extensions.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">Concurrent filing:</strong> If your priority 
                  date is already current when I-140 is filed, submit I-485 at the same time. 
                  No need to wait for I-140 approval.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">Job changes:</strong> You can switch 
                  employers after I-485 has been pending for 180 days, as long as the new job 
                  is in a &quot;same or similar&quot; occupation.
                </span>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <section className="pt-6 mt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              Enter your details to see a timeline specific to your situation.
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
