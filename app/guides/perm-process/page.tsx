"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function TimelineBar({ steps }: { steps: { label: string; months: number; color: string }[] }) {
  const totalMonths = steps.reduce((sum, s) => sum + s.months, 0);
  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-500 text-white",
    amber: "bg-amber-500 text-white",
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
              style={{ width: `${Math.max(width, 12)}%`, minWidth: "50px" }}
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
            <div key={i} className="text-center" style={{ width: `${Math.max(width, 12)}%`, minWidth: "50px" }}>
              {step.months >= 12 ? `${(step.months / 12).toFixed(1)} yr` : `${step.months} mo`}
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

export default function PERMProcessGuide() {
  const [processingTimes, setProcessingTimes] = useState<{
    pwd: { months: number; processing: string };
    perm: { months: number; processing: string };
    permAudit: { months: number; processing: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);

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
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pwdMonths = processingTimes?.pwd.months ?? 6;
  const recruitMonths = 3;
  const permMonths = processingTimes?.perm.months ?? 17;
  const auditMonths = processingTimes?.permAudit.months ?? 22;
  const totalMonths = pwdMonths + recruitMonths + permMonths;

  const formatTotalTime = (months: number) => {
    if (months < 12) return `~${months} months`;
    return `${Math.round(months / 12 * 2) / 2}–${Math.round(months / 12 * 2 + 1) / 2} years`;
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
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">PERM Labor Certification</h1>
        <p className="text-gray-600 mb-4">First step in employer-sponsored green cards</p>
        
        <div className="flex items-baseline gap-3 mb-2">
          {loading ? <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" /> : (
            <span className="text-3xl font-semibold text-gray-900">{formatTotalTime(totalMonths)}</span>
          )}
          <span className="text-gray-500">typical duration</span>
        </div>
        
        <p className="text-sm text-amber-600 mb-4">Add 6-12 months if audited (20-30% of cases)</p>

        {loading ? (
          <TimelineBarSkeleton />
        ) : (
          <TimelineBar steps={[
            { label: "PWD", months: pwdMonths, color: "emerald" },
            { label: "Recruit", months: recruitMonths, color: "emerald" },
            { label: "DOL Review", months: permMonths, color: "emerald" },
          ]} />
        )}

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            PERM proves that no qualified US workers are available for your position. 
            Your employer runs recruitment, documents the results, and files with the 
            Department of Labor.
          </p>
          
          <p>
            The filing date becomes your <strong className="text-gray-900">priority date</strong>. 
            This determines your place in the green card queue.
          </p>

          <section className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Current DOL processing</h3>
              <Link href="/processing-times" className="text-sm text-gray-500 hover:text-gray-700">View all ↗</Link>
            </div>
            {loading ? (
              <div className="grid sm:grid-cols-3 gap-4 animate-pulse">
                <div><div className="h-4 bg-gray-200 rounded w-24 mb-2" /><div className="h-5 bg-gray-200 rounded w-20" /></div>
                <div><div className="h-4 bg-gray-200 rounded w-24 mb-2" /><div className="h-5 bg-gray-200 rounded w-20" /></div>
                <div><div className="h-4 bg-gray-200 rounded w-24 mb-2" /><div className="h-5 bg-gray-200 rounded w-20" /></div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Prevailing Wage</div>
                  <div className="font-medium text-gray-900">{processingTimes?.pwd.processing}</div>
                  <div className="text-gray-500">~{pwdMonths} mo</div>
                </div>
                <div>
                  <div className="text-gray-500">PERM (no audit)</div>
                  <div className="font-medium text-gray-900">{processingTimes?.perm.processing}</div>
                  <div className="text-gray-500">~{permMonths} mo</div>
                </div>
                <div>
                  <div className="text-gray-500">PERM (audited)</div>
                  <div className="font-medium text-amber-600">{processingTimes?.permAudit.processing}</div>
                  <div className="text-amber-600">~{auditMonths} mo</div>
                </div>
              </div>
            )}
          </section>

          <section className="pt-6 border-t border-gray-100">
            <div className="flex gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Prevailing Wage</h2>
                <span className="text-sm text-gray-500">~{pwdMonths} months</span>
              </div>
            </div>
            <p className="mb-3">
              DOL determines the minimum salary for your position based on job title, 
              duties, requirements, and location.
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Wage levels range from 1-4. Higher levels mean higher salaries but 
              also fewer US workers who qualify. Most PERM applications use level 2 or 3.
            </p>
            <p className="text-sm text-gray-500">
              Your employer commits to paying the prevailing wage when you get the 
              green card, not immediately.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <div className="flex gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recruitment</h2>
                <span className="text-sm text-gray-500">2-3 months</span>
              </div>
            </div>
            <p className="mb-3">Your employer posts the job through several channels:</p>
            <ul className="space-y-1 text-sm text-gray-600 mb-3">
              <li>• State workforce agency: at least 30 days</li>
              <li>• Internal posting: at least 10 business days</li>
              <li>• Two newspaper ads (Sunday editions for professional positions)</li>
              <li>• Three additional methods for professional positions</li>
            </ul>
            <p className="text-sm text-gray-500">
              After recruitment, there&apos;s a mandatory 30-day quiet period before filing.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <div className="flex gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">DOL Review</h2>
                <span className="text-sm text-gray-500">~{permMonths} months (no audit)</span>
              </div>
            </div>
            <p className="mb-3">
              Your employer files Form ETA-9089. DOL reviews it and either approves, 
              denies, or selects for audit.
            </p>
            <p className="text-sm text-gray-500">
              The review is largely automated. Standard cases often go through without 
              issues. Red flags trigger audits.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Audits</h2>
            <p className="mb-3">
              DOL audits 20-30% of cases. Some are random. Some are triggered by:
            </p>
            <ul className="space-y-2 text-sm mb-4">
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                Job requirements that seem tailored to a specific person
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                Foreign language requirements without clear business need
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                Travel requirements to specific countries
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                Unusual skill combinations for the job title
              </li>
            </ul>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 text-sm">
              <strong className="text-amber-800">If audited:</strong>{" "}
              <span className="text-amber-700">Submit documentation (recruitment evidence, 
                resumes received) and wait for a second review. Adds 6-12 months.</span>
            </div>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">After approval</h2>
            <p className="mb-3">
              The certification is valid for <strong className="text-gray-900">180 days</strong>. 
              Your employer must file I-140 within that window.
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Your priority date is the day DOL received the PERM application, not the 
              approval date.
            </p>
            <p className="text-sm text-gray-500">
              If PERM is denied, you can appeal or refile with adjustments. Refiling 
              means a new priority date.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Rules</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">Cost:</strong> Your employer pays 
                  for PERM. You cannot pay any part of it.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">H-1B extensions:</strong> Once PERM 
                  has been pending for 365+ days, you can extend H-1B beyond 6 years 
                  in 1-year increments.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">Job changes:</strong> Changing 
                  employers during PERM means starting over with a new filing and 
                  new priority date.
                </span>
              </li>
            </ul>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">If a US worker applies</h2>
            <p className="mb-3">
              If a qualified US worker applies during recruitment and your employer 
              cannot reject them for a lawful reason, the PERM fails. Your employer 
              either hires that person or cancels the PERM.
            </p>
            <p className="text-sm text-gray-500">
              This is why job requirements matter. Requirements that are too narrow 
              get flagged as tailored. Requirements that are too broad mean more 
              qualified applicants.
            </p>
          </section>

          <section className="pt-6 mt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-4">See how PERM fits into your complete green card timeline.</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/processing-times"
                className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                All processing times
              </Link>
              <Link
                href="/"
                className="inline-flex items-center px-5 py-2.5 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors"
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
