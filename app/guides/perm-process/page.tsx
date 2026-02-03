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
        <p className="text-gray-600 mb-4">The first step in employer-sponsored green cards</p>
        
        <div className="flex items-baseline gap-3 mb-2">
          {loading ? <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" /> : (
            <span className="text-3xl font-semibold text-gray-900">{formatTotalTime(totalMonths)}</span>
          )}
          <span className="text-gray-500">typical duration</span>
        </div>
        
        <p className="text-sm text-amber-600 mb-4">Add 6-12 months if audited (affects 20-30% of cases)</p>

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
            PERM is the Department of Labor&apos;s way of making sure employers aren&apos;t 
            hiring foreign workers when qualified Americans are available. Your employer has 
            to demonstrate they tried to fill the position domestically and couldn&apos;t 
            find anyone.
          </p>
          
          <p>
            The date your PERM is filed becomes your <strong className="text-gray-900">priority 
            date</strong>—your place in the green card queue. That&apos;s why PERM timing 
            matters, especially for people from India and China with long backlogs.
          </p>

          {/* Live processing times */}
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
                  <div className="text-gray-500">~{pwdMonths} mo wait</div>
                </div>
                <div>
                  <div className="text-gray-500">PERM (no audit)</div>
                  <div className="font-medium text-gray-900">{processingTimes?.perm.processing}</div>
                  <div className="text-gray-500">~{permMonths} mo wait</div>
                </div>
                <div>
                  <div className="text-gray-500">PERM (audited)</div>
                  <div className="font-medium text-amber-600">{processingTimes?.permAudit.processing}</div>
                  <div className="text-amber-600">~{auditMonths} mo wait</div>
                </div>
              </div>
            )}
          </section>

          {/* PWD */}
          <section className="pt-6 border-t border-gray-100">
            <div className="flex gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Prevailing Wage Determination</h2>
                <span className="text-sm text-gray-500">~{pwdMonths} months</span>
              </div>
            </div>
            <p className="mb-3">
              Before anything else, DOL determines the minimum salary for your position. 
              This is based on your job title, duties, requirements, and work location.
            </p>
            <p className="text-sm text-gray-600 mb-3">
              The determination comes with a wage level (1-4). Higher levels mean higher 
              salary requirements, but they also make it harder for US workers to qualify—which 
              actually helps your case. Most PERM applications use level 2 or 3.
            </p>
            <p className="text-sm text-gray-500">
              Your employer doesn&apos;t have to pay the prevailing wage immediately—just 
              commit to paying it once you get the green card and the position becomes permanent.
            </p>
          </section>

          {/* Recruitment */}
          <section className="pt-6 border-t border-gray-100">
            <div className="flex gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recruitment</h2>
                <span className="text-sm text-gray-500">2-3 months</span>
              </div>
            </div>
            <p className="mb-3">Your employer runs a series of job postings:</p>
            <ul className="space-y-1 text-sm text-gray-600 mb-3">
              <li><strong className="text-gray-900">State workforce agency posting</strong> — at least 30 days</li>
              <li><strong className="text-gray-900">Internal posting</strong> — at least 10 consecutive business days</li>
              <li><strong className="text-gray-900">Two print advertisements</strong> — in a newspaper of general 
                circulation (Sunday editions for professional positions requiring a degree)</li>
              <li><strong className="text-gray-900">For professional positions:</strong> three additional recruitment 
                methods (job fairs, employer website, professional organizations, etc.)</li>
            </ul>
            <p className="text-sm text-gray-500">
              After recruitment ends, there&apos;s a mandatory 30-day &quot;quiet period&quot; 
              before filing. This gives DOL time to ensure no late applicants emerge.
            </p>
          </section>

          {/* DOL Review */}
          <section className="pt-6 border-t border-gray-100">
            <div className="flex gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">DOL Review</h2>
                <span className="text-sm text-gray-500">~{permMonths} months (if no audit)</span>
              </div>
            </div>
            <p className="mb-3">
              Your employer files the ETA-9089 form electronically. DOL reviews it and 
              either approves, denies, or selects for audit.
            </p>
            <p className="text-sm text-gray-500">
              The review is mostly automated. If everything looks normal and matches 
              standard patterns, it often goes through without issue. Red flags trigger 
              audits.
            </p>
          </section>

          {/* Audits */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Audit risk</h2>
            <p className="mb-3">
              DOL audits 20-30% of cases depending on the year. Some are random, but 
              certain factors increase your odds:
            </p>
            <ul className="space-y-2 text-sm mb-4">
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span><strong className="text-gray-900">Tailored requirements</strong> — job requirements 
                  that seem designed for a specific person (you) rather than the role itself</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span><strong className="text-gray-900">Foreign language requirements</strong> — unless 
                  there&apos;s a clear business need, this raises questions</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span><strong className="text-gray-900">Travel requirements</strong> — especially 
                  to specific countries</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span><strong className="text-gray-900">Unusual combinations</strong> — requirements 
                  that don&apos;t typically go together for the job title</span>
              </li>
            </ul>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 text-sm">
              <strong className="text-amber-800">If audited:</strong>
              <span className="text-amber-700"> You&apos;ll need to submit documentation 
                (recruitment evidence, resumes received, etc.) and wait for a second review. 
                This typically adds {auditMonths - permMonths} more months.</span>
            </div>
          </section>

          {/* What happens after */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">After PERM is approved</h2>
            <p className="mb-3">
              The certification is valid for <strong className="text-gray-900">180 days</strong>. 
              Your employer needs to file the I-140 petition within that window—no extensions.
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Your priority date is locked in from the day DOL received the PERM application, 
              not the approval date. This matters because that&apos;s your place in the 
              green card queue.
            </p>
            <p className="text-sm text-gray-500">
              If PERM is denied, you can appeal, but many employers choose to refile with 
              adjustments instead. A new filing means a new priority date, though.
            </p>
          </section>

          {/* Tips */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Things to know</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">You can&apos;t pay for PERM</strong> — the 
                  employer is required to cover all costs. You paying would suggest the job 
                  isn&apos;t a genuine opening.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">H-1B extensions</strong> — once PERM has 
                  been pending for over 365 days, you can extend your H-1B beyond the normal 
                  6-year limit in 1-year increments.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">Job changes</strong> — changing employers 
                  during PERM means starting over. The new company files a new PERM, new 
                  priority date.
                </span>
              </li>
            </ul>
          </section>

          {/* CTA */}
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
