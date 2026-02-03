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
    brand: "bg-brand-500 text-white",
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
              style={{ width: `${Math.max(width, 8)}%`, minWidth: "50px" }}
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
              style={{ width: `${Math.max(width, 8)}%`, minWidth: "50px" }}
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

export default function TNToGreenCardGuide() {
  const [selectedCountry, setSelectedCountry] = useState<CountryOfBirth>("other");
  const [processingTimes, setProcessingTimes] = useState<{
    perm: { months: number };
    i140: { premium: number };
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
            perm: { months: pt.perm.months },
            i140: { premium: pt.i140.premiumDays },
            i485: { min: pt.i485.min, max: pt.i485.max },
          });
          if (data.data.priorityDates) {
            setPriorityDates(data.data.priorityDates);
          }
        }
      })
      .catch(() => {});
  }, []);

  const permMonths = processingTimes?.perm.months ?? 17;
  const i140Months = 1; // Premium processing
  const i485Months = processingTimes?.i485.max ?? 18;
  const processMonths = permMonths + i140Months + i485Months;

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
          TN to Green Card
        </h1>
        <p className="text-gray-600 mb-4">
          Canadian &amp; Mexican professionals
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

        <TimelineBar
          steps={[
            { label: "PERM", months: permMonths, color: "emerald" },
            { label: "I-140", months: i140Months, color: "emerald" },
            { label: "I-485", months: i485Months, color: "amber" },
          ]}
          pdWaitMonths={pdWaitMonths}
        />

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            TN status has no direct path to a green card—it&apos;s technically a non-immigrant visa.
            The challenge is <strong className="text-gray-900">dual intent</strong>: TN requires
            you to maintain intent to return home, but filing for a green card shows immigrant intent.
          </p>
          
          {selectedCountry === "other" && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-sm text-emerald-800">
                <strong>Good news:</strong> If you were born in Canada or Mexico (not just a citizen), 
                there&apos;s typically no visa backlog—your priority date is usually current.
              </p>
            </div>
          )}

          {/* Dual Intent Section */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Managing dual intent</h2>
            
            <p className="mb-4">
              The risk is at two points: renewing TN at the border, and traveling during
              the green card process. Two strategies:
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Direct filing</h3>
                <p className="text-sm text-gray-600">
                  Start PERM while on TN. Risk is at border crossings. Works if you minimize travel.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50">
                <h3 className="font-semibold text-gray-900 mb-2">Switch to H-1B first</h3>
                <p className="text-sm text-gray-600">
                  H-1B allows dual intent. Adds 2-6 months but removes travel risk.
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
                  <strong className="text-gray-900">PERM</strong>
                  <span className="text-gray-500 ml-2">~{permMonths} months</span>
                  <p className="text-sm text-gray-600">
                    Same as any employer-sponsored case. The I-140 filing alone doesn&apos;t 
                    create intent issues.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">I-140</strong>
                  <span className="text-gray-500 ml-2">{processingTimes?.i140.premium ?? 15} days with premium</span>
                  <p className="text-sm text-gray-600">
                    Most employers use premium processing.
                  </p>
                </div>
              </div>
              
              {pdWaitMonths > 6 && (
                <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Priority Date Wait</strong>
                    <span className="text-orange-600 ml-2">~{pdWaitMonths >= 12 ? `${Math.round(pdWaitMonths / 12)} years` : `${pdWaitMonths} months`}</span>
                    <p className="text-sm text-gray-600">
                      Wait for your priority date to become current in the visa bulletin.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">I-485</strong>
                  <span className="text-gray-500 ml-2">{processingTimes ? `${processingTimes.i485.min}-${processingTimes.i485.max}` : "10-18"} months</span>
                  <p className="text-sm text-gray-600">
                    This is when you officially have immigrant intent. 
                    {selectedCountry === "other" && " Because Canada/Mexico are usually current, you can often file immediately or concurrently with I-140."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Travel */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Travel during the process</h2>
            <p>
              Once I-485 is filed, any travel requires <strong className="text-gray-900">Advance Parole</strong>.
              Returning on AP means you&apos;re no longer in TN status—you&apos;re a &quot;parolee&quot;
              waiting for green card approval.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              TD dependents face the same considerations.
            </p>
          </section>

          {/* CTA */}
          <section className="pt-6 mt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              Get a personalized timeline for your situation.
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
