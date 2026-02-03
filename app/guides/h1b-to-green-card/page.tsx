"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Metadata } from "next";

// Timeline bar component matching the app's visual style
function TimelineBar({
  steps,
}: {
  steps: { label: string; duration: string; months: number; color: string }[];
}) {
  const totalMonths = steps.reduce((sum, s) => sum + s.months, 0);
  
  return (
    <div className="my-6">
      <div className="flex items-stretch h-10 rounded-lg overflow-hidden border border-gray-200">
        {steps.map((step, i) => {
          const width = (step.months / totalMonths) * 100;
          const colorClasses: Record<string, string> = {
            emerald: "bg-emerald-500 text-white",
            amber: "bg-amber-500 text-white",
          };
          
          return (
            <div
              key={i}
              className={`${colorClasses[step.color]} flex items-center justify-center text-sm font-medium px-2 ${i > 0 ? "border-l border-white/20" : ""}`}
              style={{ width: `${width}%`, minWidth: "60px" }}
            >
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>
      <div className="flex mt-1">
        {steps.map((step, i) => {
          const width = (step.months / totalMonths) * 100;
          return (
            <div
              key={i}
              className="text-xs text-gray-500 text-center"
              style={{ width: `${width}%`, minWidth: "60px" }}
            >
              {step.duration}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Live processing time display
function LiveTime({
  label,
  time,
  premium,
  source,
}: {
  label: string;
  time: string;
  premium?: string;
  source?: string;
}) {
  return (
    <div className="inline-flex items-baseline gap-1.5 text-sm">
      <span className="text-gray-500">{label}:</span>
      <span className="font-medium text-gray-900">{time}</span>
      {premium && (
        <span className="text-emerald-600">({premium} premium)</span>
      )}
      {source && (
        <Link href="/processing-times" className="text-gray-400 hover:text-gray-600">
          ↗
        </Link>
      )}
    </div>
  );
}

export default function H1BToGreenCardGuide() {
  const [processingTimes, setProcessingTimes] = useState<{
    perm: { months: number; processing: string };
    permAudit: { months: number; processing: string };
    pwd: { months: number; processing: string };
    i140: { min: number; max: number; premium: number };
    i485: { min: number; max: number };
  } | null>(null);

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
        }
      })
      .catch(() => {});
  }, []);

  const permMonths = processingTimes?.perm.months ?? 15;
  const i140Months = processingTimes?.i140.max ?? 9;
  const i485Months = processingTimes?.i485.max ?? 18;

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
        <p className="text-gray-600 mb-2">
          Employer-sponsored EB-2 or EB-3
        </p>
        
        {/* Total timeline summary */}
        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-3xl font-semibold text-gray-900">
            2–4 years
          </span>
          <span className="text-gray-500">
            for most countries · longer for India/China
          </span>
        </div>

        {/* Visual timeline */}
        <TimelineBar
          steps={[
            { label: "PERM", duration: `~${permMonths} mo`, months: permMonths, color: "emerald" },
            { label: "I-140", duration: `${i140Months} mo`, months: i140Months, color: "emerald" },
            { label: "I-485", duration: `${i485Months} mo`, months: i485Months, color: "amber" },
          ]}
        />

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
                  source="/processing-times"
                />
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
                <p className="text-sm text-gray-600 mb-2">
                  Master&apos;s degree or bachelor&apos;s + 5 years experience
                </p>
                <p className="text-xs text-emerald-600">Shorter backlog for India/China</p>
              </div>
              <div className="p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">EB-3</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Bachelor&apos;s degree or 2 years skilled experience
                </p>
                <p className="text-xs text-gray-500">Longer backlog</p>
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
              These timelines vary based on your country of birth and current status.
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
