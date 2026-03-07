"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DynamicData } from "@/lib/dynamic-data";
import { calculateNewFilerWait } from "@/lib/processing-times";
import { CountryTabs, TimelineBar, TimelineBarSkeleton, LiveTime, useCountrySelection } from "@/components/GuideComponents";
import JsonLd from "@/components/JsonLd";

export default function L1ToGreenCardGuide() {
  const { selectedCountry, setCountry, isLoaded } = useCountrySelection("other");
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
          if (data.data.priorityDates) setPriorityDates(data.data.priorityDates);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pwdMonths = processingTimes?.pwd.months ?? 6;
  const dolReviewMonths = processingTimes?.perm.months ?? 17;
  const permMonths = pwdMonths + 3 + dolReviewMonths;
  const i140Months = 0.5;
  const i485Months = processingTimes?.i485.max ?? 18;

  const pdWaitMonths = useMemo(() => {
    if (!priorityDates) return 0;
    const pdStr = priorityDates.eb1?.[
      selectedCountry === "india" ? "india" : selectedCountry === "china" ? "china" : "allOther"
    ] || "Current";
    return Math.round(calculateNewFilerWait(pdStr, selectedCountry, "eb1").estimatedMonths);
  }, [priorityDates, selectedCountry]);

  // L-1A (EB-1C) path — no PERM needed
  const eb1cSteps = useMemo(() => {
    const steps: { label: string; months: number; color: string }[] = [
      { label: "I-140", months: i140Months, color: "emerald" },
    ];
    if (pdWaitMonths > 0) steps.push({ label: "PD Wait", months: pdWaitMonths, color: "orange" });
    steps.push({ label: "I-485", months: i485Months, color: "amber" });
    return steps;
  }, [i140Months, pdWaitMonths, i485Months]);

  // L-1B (EB-2/EB-3 PERM) path
  const pdWaitMonthsEb2 = useMemo(() => {
    if (!priorityDates) return 0;
    const pdStr = priorityDates.eb2?.[
      selectedCountry === "india" ? "india" : selectedCountry === "china" ? "china" : "allOther"
    ] || "Current";
    return Math.round(calculateNewFilerWait(pdStr, selectedCountry, "eb2").estimatedMonths);
  }, [priorityDates, selectedCountry]);

  const permSteps = useMemo(() => {
    const steps: { label: string; months: number; color: string }[] = [
      { label: "PERM", months: permMonths, color: "emerald" },
      { label: "I-140", months: i140Months, color: "emerald" },
    ];
    if (pdWaitMonthsEb2 > 0) steps.push({ label: "PD Wait", months: pdWaitMonthsEb2, color: "orange" });
    steps.push({ label: "I-485", months: i485Months, color: "amber" });
    return steps;
  }, [permMonths, i140Months, pdWaitMonthsEb2, i485Months]);

  const eb1cTotal = eb1cSteps.reduce((sum, s) => sum + s.months, 0);
  const permTotal = permSteps.reduce((sum, s) => sum + s.months, 0);

  const formatTotalTime = (months: number) => {
    if (months < 24) return `${Math.round(months / 12 * 2) / 2}–${Math.round(months / 12 * 2 + 1) / 2} years`;
    return `~${Math.round(months / 12)} years`;
  };

  return (
    <>
      <JsonLd
        data={{
          "@type": "Article",
          headline: "L-1 Visa to Green Card: Complete Timeline Guide",
          description:
            "Step-by-step guide for L-1A and L-1B visa holders to get a US green card, including the EB-1C multinational manager pathway and PERM-based EB-2/EB-3 routes.",
          url: "https://stateside.app/guides/l1-to-green-card",
          publisher: { "@type": "Organization", name: "Stateside", url: "https://stateside.app" },
          mainEntityOfPage: "https://stateside.app/guides/l1-to-green-card",
        }}
      />
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      <Link href="/guides" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Guides
      </Link>

      <article className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">L-1 Visa to Green Card</h1>
        <p className="text-gray-600 mb-4">Intracompany transferees — EB-1C and PERM paths</p>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <span className="text-sm text-gray-500">Your country of birth:</span>
          <CountryTabs selected={selectedCountry} onChange={setCountry} isLoading={!isLoaded} />
        </div>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            The L-1 visa is for employees transferred from a foreign office to a US office of the 
            same company. There are two types — L-1A for managers/executives and L-1B for 
            specialized knowledge workers — and each has a different green card path.
          </p>

          <p>
            L-1A holders have one of the fastest employer-sponsored routes to a green card. 
            L-1B holders follow the same PERM-based process as{" "}
            <Link href="/guides/h1b-to-green-card" className="text-brand-600 hover:text-brand-700">
              H-1B workers
            </Link>.
          </p>

          {/* EB-1C Path */}
          <section className="pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Fastest path
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">L-1A → EB-1C (Multinational Manager)</h2>
            
            <div className="flex items-baseline gap-3 mb-2">
              {loading ? <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" /> : (
                <span className="text-3xl font-semibold text-gray-900">{formatTotalTime(eb1cTotal)}</span>
              )}
              <span className="text-gray-500">total timeline</span>
            </div>

            {loading ? <TimelineBarSkeleton /> : <TimelineBar steps={eb1cSteps} />}

            <p className="mb-3">
              EB-1C is for multinational managers and executives. The big advantage: <strong className="text-gray-900">no 
              PERM labor certification required</strong>. Your employer files the I-140 directly, 
              which skips the longest step in most green card processes.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-2">EB-1C Requirements</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Employed abroad by the same company (or affiliate/subsidiary) for at least 1 year in the past 3 years</li>
                <li>• In a managerial or executive role both abroad and in the US</li>
                <li>• The US entity must have been doing business for at least 1 year</li>
              </ul>
            </div>

            <p className="text-sm text-gray-600 mb-3">
              <strong className="text-gray-900">&quot;Manager&quot; is defined broadly.</strong> You 
              don&apos;t need a huge team. &quot;Function managers&quot; who manage an essential 
              function of the organization can qualify, even without direct reports. But USCIS 
              scrutinizes these cases more closely.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">I-140 processing:</span>
                  <div className="font-medium text-gray-900">
                    <LiveTime label="Regular" time={processingTimes ? `${processingTimes.i140.min}-${processingTimes.i140.max} months` : "6-9 months"} />
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Premium processing:</span>
                  <div className="font-medium text-gray-900">
                    <LiveTime label="" time={processingTimes ? `${processingTimes.i140.premium} days` : "15 days"} />
                    <Link href="/processing-times" className="text-gray-400 hover:text-gray-600 ml-1">↗</Link>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              EB-1 priority dates are current for most countries. India and China may have short 
              waits. Check the{" "}
              <Link href="/guides/visa-bulletin-explained" className="text-brand-600 hover:text-brand-700">
                visa bulletin
              </Link>{" "}
              for current dates.
            </p>
          </section>

          {/* PERM Path */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">L-1B → PERM → EB-2/EB-3</h2>
            
            <div className="flex items-baseline gap-3 mb-2">
              {loading ? <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" /> : (
                <span className="text-3xl font-semibold text-gray-900">{formatTotalTime(permTotal)}</span>
              )}
              <span className="text-gray-500">total timeline</span>
            </div>

            {loading ? <TimelineBarSkeleton /> : <TimelineBar steps={permSteps} />}

            <p className="mb-3">
              L-1B holders with specialized knowledge don&apos;t qualify for EB-1C. Instead, they 
              go through the standard{" "}
              <Link href="/guides/perm-process" className="text-brand-600 hover:text-brand-700">
                PERM labor certification
              </Link>{" "}
              process, the same route as H-1B workers.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">PERM processing:</span>
                  <div className="font-medium text-gray-900">~{permMonths} months total</div>
                </div>
                <div>
                  <span className="text-gray-500">DOL currently processing:</span>
                  <div className="font-medium text-gray-900">
                    {processingTimes?.perm.processing ?? "Loading..."}
                    <Link href="/processing-times" className="text-gray-400 hover:text-gray-600 ml-1">↗</Link>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              The full PERM process includes prevailing wage determination (~{pwdMonths} months), 
              recruitment (~3 months), and DOL review (~{dolReviewMonths} months). See our{" "}
              <Link href="/guides/perm-process" className="text-brand-600 hover:text-brand-700">
                PERM deep-dive
              </Link>{" "}
              for details.
            </p>
          </section>

          {/* L-1 specific considerations */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">L-1 time limits</h2>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">L-1A</h3>
                <p className="text-sm text-gray-600">
                  7-year maximum. Initial stay up to 3 years, then 2-year extensions.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">L-1B</h3>
                <p className="text-sm text-gray-600">
                  5-year maximum. Initial stay up to 3 years, then 2-year extensions.
                </p>
              </div>
            </div>
            
            <p className="mb-3">
              These limits matter because they create a deadline. If your green card isn&apos;t 
              approved before your L-1 time runs out, you&apos;ll need to either:
            </p>
            <ul className="space-y-2 text-sm text-gray-600 mb-3">
              <li>• <strong className="text-gray-900">Switch to H-1B</strong> (requires lottery win or cap exemption)</li>
              <li>• <strong className="text-gray-900">Leave the US for a year</strong> to &quot;reset&quot; the L-1 clock</li>
              <li>• <strong className="text-gray-900">File I-485</strong> and use EAD/AP if your priority date is current</li>
            </ul>
            <p className="text-sm text-gray-500">
              Unlike H-1B, there&apos;s no automatic extension beyond the max for L-1 holders 
              with pending PERM or approved I-140. This makes timing critical for L-1B holders 
              on the PERM path.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">L-1A vs H-1B for green card</h2>
            
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">No PERM (L-1A/EB-1C):</strong> This saves 
                  2+ years compared to the PERM-based path that{" "}
                  <Link href="/guides/h1b-to-green-card" className="text-brand-600 hover:text-brand-700">
                    H-1B holders
                  </Link>{" "}
                  must follow.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">EB-1 priority dates:</strong> EB-1 usually 
                  has shorter or no visa backlogs compared to EB-2/EB-3, especially for India.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">Employer-tied:</strong> L-1 is tied to your 
                  specific employer. Changing jobs means losing your L-1 status. You can change 
                  after filing I-485 (after 180 days pending) or after getting a combo EAD/AP card.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">Higher scrutiny:</strong> USCIS closely examines 
                  EB-1C petitions, particularly for smaller companies and &quot;function manager&quot; 
                  roles. RFE rates are higher than for standard PERM-based cases.
                </span>
              </li>
            </ul>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Blanket vs individual L-1</h2>
            <p className="mb-3">
              Large companies with blanket L-1 petitions can transfer employees more quickly 
              (consular processing, no individual USCIS approval needed for each transfer). 
              This doesn&apos;t affect the green card process — the EB-1C or PERM path is 
              the same regardless of how you got your L-1.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">L-2 dependents</h2>
            <p className="mb-3">
              Your spouse and children under 21 on L-2 status can file I-485 with you when 
              your priority date is current. L-2 spouses are eligible for work authorization (EAD) 
              while in L-2 status, regardless of your green card process.
            </p>
            <p className="text-sm text-gray-500">
              This is an advantage over H-4, where EAD eligibility requires an approved I-140 
              and specific conditions.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Parallel strategies</h2>
            <p className="mb-3">
              Many L-1A holders file EB-1C while their employer simultaneously starts PERM as a 
              backup. If EB-1C is denied (common for borderline manager roles), the PERM case 
              provides an alternative path with its own priority date.
            </p>
            <p className="text-sm text-gray-600">
              You can also explore the{" "}
              <Link href="/guides/eb2-niw" className="text-brand-600 hover:text-brand-700">
                EB-2 NIW (self-petition)
              </Link>{" "}
              in parallel if you have strong credentials.
            </p>
          </section>

          <section className="pt-6 mt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              Enter your details for a timeline specific to your situation.
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
    </>
  );
}
