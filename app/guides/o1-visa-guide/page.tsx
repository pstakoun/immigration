"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DynamicData } from "@/lib/dynamic-data";
import { calculateNewFilerWait } from "@/lib/processing-times";
import { CountryTabs, TimelineBar, TimelineBarSkeleton, LiveTime, useCountrySelection } from "@/components/GuideComponents";
import JsonLd from "@/components/JsonLd";

export default function O1VisaGuide() {
  const { selectedCountry, setCountry, isLoaded } = useCountrySelection("other");
  const [processingTimes, setProcessingTimes] = useState<{
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
            i140: { min: pt.i140.min, max: pt.i140.max, premium: pt.i140.premiumDays },
            i485: { min: pt.i485.min, max: pt.i485.max },
          });
          if (data.data.priorityDates) setPriorityDates(data.data.priorityDates);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const i140Months = 0.5; // Premium processing
  const i485Months = processingTimes?.i485.max ?? 18;

  // O-1 holders typically pursue EB-1A (extraordinary ability) or EB-2 NIW
  const pdWaitMonthsEb1 = useMemo(() => {
    if (!priorityDates) return 0;
    const pdStr = priorityDates.eb1?.[
      selectedCountry === "india" ? "india" : selectedCountry === "china" ? "china" : "allOther"
    ] || "Current";
    return Math.round(calculateNewFilerWait(pdStr, selectedCountry, "eb1").estimatedMonths);
  }, [priorityDates, selectedCountry]);

  const pdWaitMonthsEb2 = useMemo(() => {
    if (!priorityDates) return 0;
    const pdStr = priorityDates.eb2?.[
      selectedCountry === "india" ? "india" : selectedCountry === "china" ? "china" : "allOther"
    ] || "Current";
    return Math.round(calculateNewFilerWait(pdStr, selectedCountry, "eb2").estimatedMonths);
  }, [priorityDates, selectedCountry]);

  // EB-1A path (no PERM)
  const eb1aSteps = useMemo(() => {
    const steps: { label: string; months: number; color: string }[] = [
      { label: "I-140", months: i140Months, color: "emerald" },
    ];
    if (pdWaitMonthsEb1 > 0) steps.push({ label: "PD Wait", months: pdWaitMonthsEb1, color: "orange" });
    steps.push({ label: "I-485", months: i485Months, color: "amber" });
    return steps;
  }, [i140Months, pdWaitMonthsEb1, i485Months]);

  // EB-2 NIW path (no PERM)
  const niwSteps = useMemo(() => {
    const steps: { label: string; months: number; color: string }[] = [
      { label: "I-140 NIW", months: i140Months, color: "emerald" },
    ];
    if (pdWaitMonthsEb2 > 0) steps.push({ label: "PD Wait", months: pdWaitMonthsEb2, color: "orange" });
    steps.push({ label: "I-485", months: i485Months, color: "amber" });
    return steps;
  }, [i140Months, pdWaitMonthsEb2, i485Months]);

  const eb1aTotal = eb1aSteps.reduce((sum, s) => sum + s.months, 0);
  const niwTotal = niwSteps.reduce((sum, s) => sum + s.months, 0);

  const formatTotalTime = (months: number) => {
    if (months < 24) return `${Math.round(months / 12 * 2) / 2}–${Math.round(months / 12 * 2 + 1) / 2} years`;
    return `~${Math.round(months / 12)} years`;
  };

  return (
    <>
      <JsonLd
        data={{
          "@type": "Article",
          headline: "O-1 Visa Guide: Extraordinary Ability Visa for the US",
          description:
            "Complete guide to the O-1 extraordinary ability visa — eligibility criteria, application process, and paths to a US green card through EB-1A and EB-2 NIW.",
          url: "https://stateside.app/guides/o1-visa-guide",
          publisher: { "@type": "Organization", name: "Stateside", url: "https://stateside.app" },
          mainEntityOfPage: "https://stateside.app/guides/o1-visa-guide",
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
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">O-1 Visa Guide</h1>
        <p className="text-gray-600 mb-4">Extraordinary ability or achievement</p>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <span className="text-sm text-gray-500">Your country of birth:</span>
          <CountryTabs selected={selectedCountry} onChange={setCountry} isLoading={!isLoaded} />
        </div>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            The O-1 visa is for individuals with extraordinary ability in sciences, arts, 
            education, business, or athletics (O-1A), or extraordinary achievement in the 
            motion picture or television industry (O-1B). It&apos;s become increasingly 
            popular in tech and AI as an alternative to the H-1B lottery.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-1">O-1A</h3>
              <p className="text-sm text-gray-600">
                Sciences, education, business, athletics. Most tech workers use this.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-1">O-1B</h3>
              <p className="text-sm text-gray-600">
                Arts, motion picture, television. Different (generally lower) evidentiary standard.
              </p>
            </div>
          </div>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">O-1A eligibility criteria</h2>
            
            <p className="mb-3">
              You must show &quot;extraordinary ability&quot; — sustained national or international 
              acclaim. In practice, USCIS wants evidence of at least 3 of these 8 criteria:
            </p>
            
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm">
                  <strong className="text-gray-900">1. Awards or prizes</strong> for excellence 
                  in your field (nationally or internationally recognized)
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm">
                  <strong className="text-gray-900">2. Membership in associations</strong> that 
                  require outstanding achievement (selective, not pay-to-join)
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm">
                  <strong className="text-gray-900">3. Published material about you</strong> in 
                  major media, trade publications, or professional journals
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm">
                  <strong className="text-gray-900">4. Judging the work of others</strong> — 
                  peer reviewer, competition judge, editorial board member
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm">
                  <strong className="text-gray-900">5. Original contributions</strong> of major 
                  significance — patents, open-source projects, novel research
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm">
                  <strong className="text-gray-900">6. Scholarly articles</strong> authored 
                  in professional journals or major media
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm">
                  <strong className="text-gray-900">7. Employment in a critical or essential 
                  capacity</strong> at organizations with a distinguished reputation
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm">
                  <strong className="text-gray-900">8. High salary</strong> or remuneration 
                  compared to others in the field
                </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              Meeting 3 criteria is the minimum threshold. USCIS then does a &quot;final merits 
              determination&quot; — looking at the totality of evidence to decide if you truly 
              have extraordinary ability. Quality of evidence matters more than quantity.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">O-1 for tech workers</h2>
            
            <p className="mb-3">
              The O-1 has become a popular path in tech, especially for founders, senior 
              engineers, AI/ML researchers, and product leaders. Common evidence includes:
            </p>
            
            <ul className="space-y-2 text-sm text-gray-600 mb-4">
              <li>• <strong className="text-gray-900">High salary:</strong> Compensation in top percentile for your role (Levels.fyi, H1BGrader data helps)</li>
              <li>• <strong className="text-gray-900">Original contributions:</strong> Open-source projects with significant adoption, patents, products with major user bases</li>
              <li>• <strong className="text-gray-900">Judging:</strong> Code review at scale, hackathon judging, conference program committees</li>
              <li>• <strong className="text-gray-900">Published material about you:</strong> TechCrunch, press coverage of your startup or project</li>
              <li>• <strong className="text-gray-900">Critical role:</strong> Key engineer/PM at a well-known company (FAANG, funded startup)</li>
              <li>• <strong className="text-gray-900">Scholarly articles:</strong> Blog posts with significant readership, conference talks, technical papers</li>
            </ul>
            
            <p className="text-sm text-gray-500">
              Tip: Start building your O-1 evidence portfolio early, even if you&apos;re 
              currently on H-1B. Speak at conferences, publish, contribute to open source.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">The O-1 application process</h2>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">Peer advisory opinion</strong>
                  <p className="text-sm text-gray-600 mt-1">
                    A peer group or union in your field reviews your case and provides a 
                    recommendation letter. For tech workers, IEEE or a relevant professional 
                    body works. Some lawyers use custom peer groups.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">File I-129 (O-1 petition)</strong>
                  <p className="text-sm text-gray-600 mt-1">
                    Your employer (or agent) files the petition with USCIS. Include all evidence 
                    and recommendation letters. Regular processing takes 1-3 months; premium 
                    processing gives a 15 business day decision.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">Approval and validity</strong>
                  <p className="text-sm text-gray-600 mt-1">
                    O-1 is approved for the duration of the &quot;event&quot; or activity, typically 
                    up to 3 years. Extensions are filed in 1-year increments — there&apos;s no 
                    maximum limit on renewals, unlike H-1B&apos;s 6-year cap.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">O-1 vs H-1B</h2>
            
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="grid grid-cols-3 text-sm">
                <div className="p-3 bg-gray-50 font-medium text-gray-900"></div>
                <div className="p-3 bg-gray-50 font-medium text-gray-900">O-1</div>
                <div className="p-3 bg-gray-50 font-medium text-gray-900">H-1B</div>
                
                <div className="p-3 border-t border-gray-200 text-gray-600">Lottery</div>
                <div className="p-3 border-t border-gray-200 text-emerald-700">No lottery</div>
                <div className="p-3 border-t border-gray-200 text-gray-600">Required (unless exempt)</div>
                
                <div className="p-3 border-t border-gray-200 text-gray-600">Duration</div>
                <div className="p-3 border-t border-gray-200 text-emerald-700">No max (renewable)</div>
                <div className="p-3 border-t border-gray-200 text-gray-600">6 years max</div>
                
                <div className="p-3 border-t border-gray-200 text-gray-600">Dual intent</div>
                <div className="p-3 border-t border-gray-200 text-gray-600">Not explicit*</div>
                <div className="p-3 border-t border-gray-200 text-emerald-700">Yes</div>
                
                <div className="p-3 border-t border-gray-200 text-gray-600">Employer change</div>
                <div className="p-3 border-t border-gray-200 text-gray-600">New petition needed</div>
                <div className="p-3 border-t border-gray-200 text-gray-600">Transfer (can start work on receipt)</div>
                
                <div className="p-3 border-t border-gray-200 text-gray-600">Evidence bar</div>
                <div className="p-3 border-t border-gray-200 text-amber-700">Higher</div>
                <div className="p-3 border-t border-gray-200 text-emerald-700">Specialty occupation</div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-3">
              *O-1 doesn&apos;t have statutory dual intent, but USCIS generally doesn&apos;t 
              deny O-1 renewals solely because of a pending green card application. It&apos;s 
              a gray area — less clean than H-1B but workable in practice.
            </p>
          </section>

          {/* Green card paths */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">O-1 to green card</h2>
            
            <p className="mb-4">
              O-1 holders have strong green card options because the evidence standard overlaps 
              significantly with EB-1A and{" "}
              <Link href="/guides/eb2-niw" className="text-brand-600 hover:text-brand-700">
                EB-2 NIW
              </Link>.
            </p>

            <div className="space-y-6">
              {/* EB-1A */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Best path
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">EB-1A (Extraordinary Ability)</h3>
                
                <div className="flex items-baseline gap-3 mb-2">
                  {loading ? <div className="h-7 w-24 bg-gray-200 rounded animate-pulse" /> : (
                    <span className="text-2xl font-semibold text-gray-900">{formatTotalTime(eb1aTotal)}</span>
                  )}
                  <span className="text-gray-500 text-sm">total timeline</span>
                </div>

                {loading ? <TimelineBarSkeleton /> : <TimelineBar steps={eb1aSteps} />}

                <p className="text-sm text-gray-600 mt-3">
                  EB-1A uses the same &quot;extraordinary ability&quot; standard as O-1A. If 
                  you were approved for O-1, you likely have much of the evidence needed. 
                  No PERM required, no employer sponsorship needed — you can self-petition.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-3 mt-3">
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-900">Key difference:</strong> EB-1A requires 
                    meeting 3 of 10 criteria (similar but not identical to O-1A&apos;s 8 criteria), 
                    plus a &quot;final merits&quot; analysis. The bar is generally considered 
                    slightly higher than O-1.
                  </p>
                </div>
              </div>

              {/* EB-2 NIW */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">EB-2 NIW (National Interest Waiver)</h3>
                
                <div className="flex items-baseline gap-3 mb-2">
                  {loading ? <div className="h-7 w-24 bg-gray-200 rounded animate-pulse" /> : (
                    <span className="text-2xl font-semibold text-gray-900">{formatTotalTime(niwTotal)}</span>
                  )}
                  <span className="text-gray-500 text-sm">total timeline</span>
                </div>

                {loading ? <TimelineBarSkeleton /> : <TimelineBar steps={niwSteps} />}

                <p className="text-sm text-gray-600 mt-3">
                  <Link href="/guides/eb2-niw" className="text-brand-600 hover:text-brand-700">
                    EB-2 NIW
                  </Link>{" "}
                  is another self-petition option with a lower evidence bar than EB-1A. 
                  Many O-1 holders file both EB-1A and NIW simultaneously for maximum coverage.
                </p>
              </div>
            </div>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Priority dates for O-1 holders</h2>
            <p className="mb-3">
              Both EB-1A and EB-2 NIW skip the{" "}
              <Link href="/guides/perm-process" className="text-brand-600 hover:text-brand-700">
                PERM process
              </Link>. Your priority date is set when USCIS receives your I-140 petition.
            </p>
            <p className="text-sm text-gray-600">
              EB-1 priority dates are current for most countries. For India and China, 
              check the{" "}
              <Link href="/guides/visa-bulletin-explained" className="text-brand-600 hover:text-brand-700">
                visa bulletin
              </Link>{" "}
              — EB-1 waits are significantly shorter than EB-2/EB-3.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">O-3 dependents</h2>
            <p className="mb-3">
              Your spouse and children under 21 get O-3 status. O-3 dependents can 
              study but cannot work — there&apos;s no EAD available for O-3 (unlike L-2 
              or H-4 with approved I-140).
            </p>
            <p className="text-sm text-gray-500">
              When you file I-485, dependents can file their own and receive combo EAD/AP cards.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Common questions</h2>
            
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">Can I start a company on O-1?</strong> Yes, 
                  but you need an employer or agent to file the petition. Some founders use an 
                  agent who sponsors the O-1 while they run their own company.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">How many recommendation letters?</strong> Typically 
                  5-8 strong letters from recognized experts. Include people who don&apos;t know 
                  you personally — &quot;independent&quot; letters carry more weight.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-gray-900">What if I&apos;m denied?</strong> O-1 
                  denials can be appealed, or you can refile with additional evidence. Many 
                  successful O-1 holders were denied on their first attempt.
                </span>
              </li>
            </ul>
          </section>

          <section className="pt-6 mt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              See how the O-1 path compares to other options for your situation.
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
