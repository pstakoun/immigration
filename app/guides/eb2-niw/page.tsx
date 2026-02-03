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

// Timeline bar with PD wait
function TimelineBar({
  steps,
  pdWaitMonths,
}: {
  steps: { label: string; months: number; color: string }[];
  pdWaitMonths: number;
}) {
  const processMonths = steps.reduce((sum, s) => sum + s.months, 0);
  const totalMonths = processMonths + pdWaitMonths;
  
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
              style={{ width: `${Math.max(width, 10)}%`, minWidth: "60px" }}
            >
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
        {pdWaitMonths > 0 && (
          <div
            className="bg-orange-500 text-white flex items-center justify-center text-sm font-medium px-1 border-l border-white/20"
            style={{ width: `${Math.max((pdWaitMonths / totalMonths) * 100, 15)}%`, minWidth: "60px" }}
          >
            <span className="truncate">PD Wait</span>
          </div>
        )}
      </div>
      <div className="flex mt-1.5 text-xs text-gray-500">
        {steps.map((step, i) => {
          const width = (step.months / totalMonths) * 100;
          return (
            <div
              key={i}
              className="text-center"
              style={{ width: `${Math.max(width, 10)}%`, minWidth: "60px" }}
            >
              {step.months < 12 ? `${step.months} mo` : `${(step.months / 12).toFixed(1)} yr`}
            </div>
          );
        })}
        {pdWaitMonths > 0 && (
          <div
            className="text-center text-orange-600"
            style={{ width: `${Math.max((pdWaitMonths / totalMonths) * 100, 15)}%`, minWidth: "60px" }}
          >
            {pdWaitMonths >= 12 ? `~${Math.round(pdWaitMonths / 12)} yr` : `${pdWaitMonths} mo`}
          </div>
        )}
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
          if (data.data.priorityDates) {
            setPriorityDates(data.data.priorityDates);
          }
        }
      })
      .catch(() => {});
  }, []);

  const i140Months = processingTimes?.i140.max ?? 9;
  const i485Months = processingTimes?.i485.max ?? 18;
  const processMonths = i140Months + i485Months;

  // Calculate PD wait based on selected country
  const pdWaitMonths = useMemo(() => {
    if (!priorityDates) return 0;
    const pdStr = priorityDates.eb2?.[
      selectedCountry === "india" ? "india" : 
      selectedCountry === "china" ? "china" : "allOther"
    ] || "Current";
    const waitResult = calculateNewFilerWait(pdStr, selectedCountry, "eb2");
    return Math.round(waitResult.estimatedMonths);
  }, [priorityDates, selectedCountry]);

  const totalMonths = processMonths + pdWaitMonths;

  // Format total time
  const formatTotalTime = (months: number) => {
    if (months < 24) return `${Math.round(months / 12 * 2) / 2}–${Math.round(months / 12 * 2 + 1) / 2} years`;
    const years = Math.round(months / 12);
    return `~${years} years`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      <Link
        href="/guides"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Guides
      </Link>

      <article className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          EB-2 NIW
        </h1>
        <p className="text-gray-600 mb-4">
          National Interest Waiver — self-petition, no employer needed
        </p>
        
        {/* Country selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <span className="text-sm text-gray-500">Your country of birth:</span>
          <CountryTabs selected={selectedCountry} onChange={setSelectedCountry} />
        </div>
        
        {/* Total timeline summary */}
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-3xl font-semibold text-gray-900">
            {formatTotalTime(totalMonths)}
          </span>
          <span className="text-gray-500">
            total timeline
          </span>
        </div>
        
        {pdWaitMonths > 12 && (
          <p className="text-sm text-orange-600 mb-4">
            Includes ~{Math.round(pdWaitMonths / 12)} year priority date wait for {
              selectedCountry === "india" ? "India" : 
              selectedCountry === "china" ? "China" : "your country"
            }
          </p>
        )}
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          No PERM required
        </div>

        <TimelineBar
          steps={[
            { label: "I-140 NIW", months: i140Months, color: "emerald" },
            { label: "I-485", months: i485Months, color: "amber" },
          ]}
          pdWaitMonths={pdWaitMonths}
        />

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            NIW lets you skip PERM and petition for yourself. No employer sponsorship,
            no labor certification. You argue your work benefits the US enough to waive
            the normal requirements.
          </p>

          {/* Requirements */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
            
            <p className="mb-3">First, meet EB-2 qualifications:</p>
            <ul className="space-y-2 text-sm mb-4">
              <li className="flex gap-2">
                <span className="text-gray-400">•</span>
                Master&apos;s degree or higher, OR
              </li>
              <li className="flex gap-2">
                <span className="text-gray-400">•</span>
                Bachelor&apos;s + 5 years progressive experience
              </li>
            </ul>

            <p className="mb-3">Then prove the three-part Dhanasar test:</p>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm">
                  <strong className="text-gray-900">1.</strong> Your work has{" "}
                  <strong className="text-gray-900">substantial merit and national importance</strong>
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm">
                  <strong className="text-gray-900">2.</strong> You&apos;re{" "}
                  <strong className="text-gray-900">well positioned</strong> to advance it
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm">
                  <strong className="text-gray-900">3.</strong> It&apos;s{" "}
                  <strong className="text-gray-900">beneficial to waive</strong> the job offer requirement
                </p>
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">The process</h2>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-gray-900">I-140 NIW</strong>
                    <span className="text-gray-500 text-sm">
                      {processingTimes ? `${processingTimes.i140.min}-${processingTimes.i140.max} mo` : "6-9 mo"} regular ·{" "}
                      {processingTimes?.i140.premium ?? 15} days premium
                    </span>
                    <Link href="/processing-times" className="text-gray-400 hover:text-gray-600 text-sm">↗</Link>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    You file yourself (or with a lawyer). Priority date is when USCIS receives it.
                  </p>
                </div>
              </div>
              
              {pdWaitMonths > 6 && (
                <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="flex items-baseline gap-2">
                      <strong className="text-gray-900">Priority Date Wait</strong>
                      <span className="text-orange-600 text-sm">
                        ~{pdWaitMonths >= 12 ? `${Math.round(pdWaitMonths / 12)} years` : `${pdWaitMonths} months`}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Wait for your priority date to become current. This is the longest part for 
                      {selectedCountry === "india" ? " India" : selectedCountry === "china" ? " China" : " backlogged countries"}.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <div>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-gray-900">I-485</strong>
                    <span className="text-gray-500 text-sm">
                      {processingTimes ? `${processingTimes.i485.min}-${processingTimes.i485.max} mo` : "10-18 mo"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Same as employer-sponsored. {selectedCountry === "other" && "For most countries, file immediately or concurrently."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Evidence */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Evidence that works</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-emerald-500">•</span>
                Publications and citations
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">•</span>
                Patents (granted or pending)
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">•</span>
                5-8 recommendation letters from experts
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">•</span>
                Documented impact of your work
              </li>
            </ul>
          </section>

          {/* Strategy */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">NIW + PERM strategy</h2>
            <p>
              Many people file NIW while also having their employer file PERM. This gives you
              a backup if NIW is denied, and you can port an earlier PERM priority date to NIW.
            </p>
          </section>

          {/* CTA */}
          <section className="pt-6 mt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              Compare NIW to employer-sponsored paths for your situation.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
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
