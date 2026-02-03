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
              style={{ width: `${Math.max(width, 8)}%`, minWidth: "40px" }}
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
              style={{ width: `${Math.max(width, 8)}%`, minWidth: "40px" }}
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

export default function PERMProcessGuide() {
  const [selectedCountry, setSelectedCountry] = useState<CountryOfBirth>("other");
  const [processingTimes, setProcessingTimes] = useState<{
    pwd: { months: number; processing: string };
    perm: { months: number; processing: string };
    permAudit: { months: number; processing: string };
  } | null>(null);
  const [priorityDates, setPriorityDates] = useState<DynamicData["priorityDates"] | null>(null);

  useEffect(() => {
    fetch("/api/processing-times")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const pt = data.data.processingTimes;
          setProcessingTimes({
            pwd: { months: pt.pwd.months, processing: pt.pwd.currentlyProcessing },
            perm: { months: pt.perm.months, processing: pt.perm.currentlyProcessing },
            permAudit: { months: pt.permAudit.months, processing: pt.permAudit.currentlyProcessing },
          });
          if (data.data.priorityDates) {
            setPriorityDates(data.data.priorityDates);
          }
        }
      })
      .catch(() => {});
  }, []);

  const pwdMonths = processingTimes?.pwd.months ?? 6;
  const recruitMonths = 3;
  const permMonths = processingTimes?.perm.months ?? 17;
  const auditMonths = processingTimes?.permAudit.months ?? 22;
  const processMonths = pwdMonths + recruitMonths + permMonths;

  // Calculate PD wait based on selected country (EB-2)
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
          PERM Labor Certification
        </h1>
        <p className="text-gray-600 mb-4">
          Department of Labor process for employer-sponsored green cards
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
            total timeline (PERM + wait)
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
        
        <p className="text-sm text-amber-600 mb-4">
          Add 6–12 months if audited
        </p>

        <TimelineBar
          steps={[
            { label: "PWD", months: pwdMonths, color: "emerald" },
            { label: "Recruit", months: recruitMonths, color: "emerald" },
            { label: "DOL", months: permMonths, color: "emerald" },
          ]}
          pdWaitMonths={pdWaitMonths}
        />

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            PERM proves no qualified US workers are available for your position. Your filing date 
            becomes your <strong className="text-gray-900">priority date</strong>—where you stand
            in line for a visa number.
          </p>

          {/* Live processing times */}
          <section className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Current DOL processing</h3>
              <Link href="/processing-times" className="text-sm text-gray-500 hover:text-gray-700">
                View all times ↗
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Prevailing Wage</div>
                <div className="font-medium text-gray-900">
                  {processingTimes?.pwd.processing ?? "Loading..."}
                </div>
                <div className="text-gray-500">~{pwdMonths} mo wait</div>
              </div>
              <div>
                <div className="text-gray-500">PERM (no audit)</div>
                <div className="font-medium text-gray-900">
                  {processingTimes?.perm.processing ?? "Loading..."}
                </div>
                <div className="text-gray-500">~{permMonths} mo wait</div>
              </div>
              <div>
                <div className="text-gray-500">PERM (audited)</div>
                <div className="font-medium text-amber-600">
                  {processingTimes?.permAudit.processing ?? "Loading..."}
                </div>
                <div className="text-amber-600">~{auditMonths} mo wait</div>
              </div>
            </div>
          </section>

          {/* PWD Section */}
          <section className="pt-6 border-t border-gray-100">
            <div className="flex gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Prevailing Wage Determination</h2>
                <span className="text-sm text-gray-500">~{pwdMonths} months</span>
              </div>
            </div>
            <p>
              DOL determines the minimum salary for your position based on job duties,
              requirements, and location.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              <strong className="text-gray-700">Wage levels 1-4:</strong> Higher level = higher
              salary requirement but fewer qualified US applicants.
            </p>
          </section>

          {/* Recruitment Section */}
          <section className="pt-6 border-t border-gray-100">
            <div className="flex gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recruitment</h2>
                <span className="text-sm text-gray-500">2-3 months</span>
              </div>
            </div>
            <p className="mb-3">Your employer tests the labor market:</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• State workforce agency job order (30+ days)</li>
              <li>• Two Sunday newspaper ads</li>
              <li>• Three additional recruitment steps</li>
              <li>• Internal company posting (10 business days)</li>
            </ul>
            <p className="text-sm text-gray-500 mt-3">
              Then a mandatory 30-day quiet period before filing.
            </p>
          </section>

          {/* DOL Review Section */}
          <section className="pt-6 border-t border-gray-100">
            <div className="flex gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">DOL Review</h2>
                <span className="text-sm text-gray-500">~{permMonths} months (non-audit)</span>
              </div>
            </div>
            <p>
              Your employer files the ETA-9089 form. DOL reviews and either approves,
              denies, or selects for audit.
            </p>
          </section>

          {/* Priority Date Wait Section */}
          {pdWaitMonths > 6 && (
            <section className="pt-6 border-t border-gray-100">
              <div className="flex gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Priority Date Wait</h2>
                  <span className="text-sm text-orange-600">~{pdWaitMonths >= 12 ? `${Math.round(pdWaitMonths / 12)} years` : `${pdWaitMonths} months`}</span>
                </div>
              </div>
              <p>
                After PERM + I-140 approval, wait for your priority date to become current.
                For {selectedCountry === "india" ? "India" : selectedCountry === "china" ? "China" : "your country"}, 
                this is the longest part of the process.
              </p>
            </section>
          )}

          {/* Audits */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Audit risk</h2>
            <p className="mb-3">
              About <strong className="text-gray-900">30% of cases</strong> get audited.
              Common triggers:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                Random selection
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                Requirements that seem tailored to you
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                Foreign language requirements without business necessity
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                Travel requirements
              </li>
            </ul>
            <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-100 text-sm">
              <strong className="text-amber-800">If audited:</strong>
              <span className="text-amber-700"> Add ~{auditMonths - permMonths} more months</span>
            </div>
          </section>

          {/* After approval */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">After PERM approval</h2>
            <p>
              The certification is valid for <strong className="text-gray-900">180 days</strong>.
              Your employer must file I-140 within this window. The priority date is locked to when PERM was filed.
            </p>
          </section>

          {/* CTA */}
          <section className="pt-6 mt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              See how PERM fits into your overall green card timeline.
            </p>
            <div className="flex gap-3">
              <Link
                href="/processing-times"
                className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                All processing times
              </Link>
              <Link
                href="/"
                className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
              >
                See your timeline
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
