"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
            brand: "bg-brand-500 text-white",
          };
          
          return (
            <div
              key={i}
              className={`${colorClasses[step.color]} flex items-center justify-center text-sm font-medium px-2 ${i > 0 ? "border-l border-white/20" : ""}`}
              style={{ width: `${width}%`, minWidth: "50px" }}
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
              style={{ width: `${width}%`, minWidth: "50px" }}
            >
              {step.duration}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TNToGreenCardGuide() {
  const [processingTimes, setProcessingTimes] = useState<{
    perm: { months: number };
    i140: { premium: number };
    i485: { min: number; max: number };
  } | null>(null);

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
        }
      })
      .catch(() => {});
  }, []);

  const permMonths = processingTimes?.perm.months ?? 15;
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
          TN to Green Card
        </h1>
        <p className="text-gray-600 mb-2">
          Canadian &amp; Mexican professionals
        </p>
        
        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-3xl font-semibold text-gray-900">2–3 years</span>
          <span className="text-gray-500">processing time</span>
        </div>

        <TimelineBar
          steps={[
            { label: "PERM", duration: `~${permMonths} mo`, months: permMonths, color: "emerald" },
            { label: "I-140", duration: "15 days", months: 1, color: "emerald" },
            { label: "I-485", duration: `~${i485Months} mo`, months: i485Months, color: "amber" },
          ]}
        />

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            TN status has no direct path to a green card—it&apos;s technically a non-immigrant visa.
            The challenge is <strong className="text-gray-900">dual intent</strong>: TN requires
            you to maintain intent to return home, but filing for a green card shows immigrant intent.
          </p>
          
          <p>
            The good news: Canada and Mexico have <strong className="text-gray-900">no visa backlog</strong>.
            Once you reach I-485, approval typically takes only {i485Months} months.
          </p>

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
              
              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">I-485</strong>
                  <span className="text-gray-500 ml-2">{processingTimes ? `${processingTimes.i485.min}-${processingTimes.i485.max}` : "10-18"} months</span>
                  <p className="text-sm text-gray-600">
                    This is when you officially have immigrant intent. Because Canada/Mexico
                    are current, you can often file immediately or concurrently with I-140.
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
              See how the timeline looks for your specific situation.
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
