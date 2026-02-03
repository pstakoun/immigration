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

// Timeline bar - correct order: PERM → I-140 → PD Wait → I-485
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

// Loading skeleton for timeline
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

// Live processing time display
function LiveTime({
  label,
  time,
  premium,
}: {
  label: string;
  time: string;
  premium?: string;
}) {
  return (
    <div className="inline-flex items-baseline gap-1.5 text-sm">
      <span className="text-gray-500">{label}:</span>
      <span className="font-medium text-gray-900">{time}</span>
      {premium && (
        <span className="text-emerald-600">({premium} premium)</span>
      )}
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

  // Build timeline steps in correct order: PERM → I-140 → PD Wait → I-485
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
          H-1B to Green Card
        </h1>
        <p className="text-gray-600 mb-4">
          Employer-sponsored EB-2 or EB-3
        </p>
        
        {/* Country selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <span className="text-sm text-gray-500">Your country of birth:</span>
          <CountryTabs selected={selectedCountry} onChange={setSelectedCountry} />
        </div>
        
        {/* Total timeline summary */}
        <div className="flex items-baseline gap-3 mb-2">
          {loading ? (
            <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
          ) : (
            <span className="text-3xl font-semibold text-gray-900">
              {formatTotalTime(totalMonths)}
            </span>
          )}
          <span className="text-gray-500">
            total timeline
          </span>
        </div>

        {/* Visual timeline - correct order: PERM → I-140 → PD Wait → I-485 */}
        {loading ? <TimelineBarSkeleton /> : <TimelineBar steps={timelineSteps} />}

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            Your employer sponsors you through three steps: PERM labor certification, 
            I-140 immigrant petition, and I-485 adjustment of status. The PERM filing date
            becomes your <strong className="text-gray-900">priority date</strong>—where
            you stand in line for a visa number.
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
                  <span className="text-gray-500">DOL currently processing:</span>
                  <div className="font-medium text-gray-900">
                    {processingTimes?.perm.processing ?? "Loading..."}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Estimated wait:</span>
                  <div className="font-medium text-gray-900">
                    ~{permMonths} months
                    <Link href="/processing-times" className="text-gray-400 hover:text-gray-600 ml-1">↗</Link>
                  </div>
                </div>
              </div>
            </div>

            <p className="mb-3">
              Your employer proves no qualified US workers are available. This involves:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 mb-3">
              <li><strong className="text-gray-900">Prevailing wage</strong> — DOL sets minimum salary ({processingTimes ? `~${processingTimes.pwd.months} mo` : "5-7 mo"})</li>
              <li><strong className="text-gray-900">Recruitment</strong> — job postings and ads (2-3 mo)</li>
              <li><strong className="text-gray-900">Filing + review</strong> — DOL processes the application</li>
            </ol>
            <p className="text-sm text-gray-500">
              ~30% of cases get audited, adding {processingTimes ? `~${processingTimes.permAudit.months - processingTimes.perm.months}` : "6-12"} more months.
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
                <LiveTime
                  label="Regular"
                  time={processingTimes ? `${processingTimes.i140.min}-${processingTimes.i140.max} months` : "6-9 months"}
                />
                <span className="mx-3 text-gray-300">|</span>
                <LiveTime
                  label="Premium"
                  time={processingTimes ? `${processingTimes.i140.premium} days` : "15 days"}
                />
                <Link href="/processing-times" className="text-gray-400 hover:text-gray-600 ml-2">↗</Link>
              </div>
            </div>

            <p className="mb-3">
              Once PERM is approved, your employer files I-140 with USCIS. Most use 
              premium processing for the 15-day guarantee.
            </p>
            <p className="text-sm text-gray-600">
              <strong className="text-gray-900">Key milestone:</strong> Once I-140 is approved for 180 days, 
              you can change employers and keep your priority date.
            </p>
          </section>

          {/* Priority Date Wait Section - only show if significant and data loaded */}
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
                After I-140 approval, you wait for your priority date to become current in the 
                visa bulletin before you can file I-485.
              </p>
              <p className="text-sm text-gray-600">
                <strong className="text-gray-900">While waiting:</strong> You can change employers 
                (after 180 days), your H-1B can be extended beyond 6 years, and your priority date 
                is portable.
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
                <LiveTime
                  label="Processing"
                  time={processingTimes ? `${processingTimes.i485.min}-${processingTimes.i485.max} months` : "10-18 months"}
                />
                <Link href="/processing-times" className="text-gray-400 hover:text-gray-600 ml-2">↗</Link>
              </div>
            </div>

            <p className="mb-3">
              The final step—you can only file when your priority date is current.
              Along with I-485, you file I-765 (work permit) and I-131 (travel document).
            </p>
            <p className="text-sm text-gray-600">
              The EAD/AP combo card arrives in 3-5 months, freeing you from H-1B restrictions.
            </p>
          </section>

          {/* EB-2 vs EB-3 */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">EB-2 vs EB-3</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">EB-2</h3>
                <p className="text-sm text-gray-600">
                  Master&apos;s degree or bachelor&apos;s + 5 years experience
                </p>
              </div>
              <div className="p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">EB-3</h3>
                <p className="text-sm text-gray-600">
                  Bachelor&apos;s degree or 2 years skilled experience
                </p>
              </div>
            </div>
          </section>

          {/* Key points */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Key points</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">H-1B 6-year limit:</strong> Extend beyond
                  6 years with approved I-140 or PERM pending 365+ days
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">Concurrent filing:</strong> If priority date 
                  is current when I-140 is filed, file I-485 at the same time
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">Priority date portability:</strong> Keep your
                  place in line when changing employers
                </span>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <section className="pt-6 mt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              Get a personalized timeline based on your specific situation.
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
