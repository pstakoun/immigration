"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DynamicData } from "@/lib/dynamic-data";
import { CountryOfBirth, EBCategory } from "@/lib/filter-paths";
import { calculateNewFilerWait } from "@/lib/processing-times";
import {
  CountryTabs,
  LiveTime,
  TimelineBar,
  TimelineBarSkeleton,
  useCountrySelection,
} from "@/components/GuideComponents";

type ProcessingTimes = DynamicData["processingTimes"];
type PriorityDates = DynamicData["priorityDates"];

function useGuideApiData() {
  const [processingTimes, setProcessingTimes] = useState<ProcessingTimes | null>(null);
  const [priorityDates, setPriorityDates] = useState<PriorityDates | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch("/api/processing-times")
      .then((res) => res.json())
      .then((data) => {
        if (!active || !data.success) return;
        setProcessingTimes(data.data.processingTimes ?? null);
        setPriorityDates(data.data.priorityDates ?? null);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { processingTimes, priorityDates, loading };
}

function normalizeGuideCountry(country: CountryOfBirth): "other" | "india" | "china" {
  if (country === "india" || country === "china") return country;
  return "other";
}

function getPriorityDate(
  priorityDates: PriorityDates | null,
  category: EBCategory,
  country: CountryOfBirth
) {
  if (!priorityDates) return "Current";
  const normalized = normalizeGuideCountry(country);
  const key = normalized === "india" ? "india" : normalized === "china" ? "china" : "allOther";
  return priorityDates[category][key];
}

function formatTotalTimeline(months: number) {
  if (months < 12) return `~${Math.round(months)} months`;
  if (months < 24) return `~${(months / 12).toFixed(1)} years`;
  return `~${Math.round(months / 12)} years`;
}

function formatWait(months: number) {
  if (months <= 0) return "Current";
  if (months < 12) return `~${months} months`;
  return `~${Math.round(months / 12)} years`;
}

interface GuideTimelineStep {
  label: string;
  months: number;
  color: string;
}

interface GuideTimelineWidgetProps {
  title: string;
  subtitle: string;
  category: EBCategory;
  preWaitSteps: GuideTimelineStep[];
  postWaitSteps: GuideTimelineStep[];
  liveTimes: Array<{ label: string; time: string; premium?: string }>;
  loading: boolean;
  priorityDates: PriorityDates | null;
}

function GuideTimelineWidget({
  title,
  subtitle,
  category,
  preWaitSteps,
  postWaitSteps,
  liveTimes,
  loading,
  priorityDates,
}: GuideTimelineWidgetProps) {
  const { selectedCountry, setCountry, isLoaded } = useCountrySelection("other");

  const timeline = useMemo(() => {
    const pdDate = getPriorityDate(priorityDates, category, selectedCountry);
    const wait = Math.round(
      calculateNewFilerWait(pdDate, normalizeGuideCountry(selectedCountry), category).estimatedMonths
    );

    const steps: GuideTimelineStep[] = [...preWaitSteps];
    if (wait > 0 && postWaitSteps.length > 0) {
      steps.push({ label: "PD Wait", months: wait, color: "orange" });
    }
    steps.push(...postWaitSteps);

    const totalMonths = steps.reduce((sum, step) => sum + step.months, 0);

    return {
      steps,
      wait,
      totalMonths,
    };
  }, [category, postWaitSteps, preWaitSteps, priorityDates, selectedCountry]);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">{title}</h2>
      <p className="text-sm text-gray-600 mb-4">{subtitle}</p>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <span className="text-sm text-gray-500">Country of birth:</span>
        <CountryTabs selected={normalizeGuideCountry(selectedCountry)} onChange={setCountry} isLoading={!isLoaded} />
      </div>

      <div className="flex items-baseline gap-3 mb-2">
        {loading ? (
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        ) : (
          <span className="text-2xl font-semibold text-gray-900">{formatTotalTimeline(timeline.totalMonths)}</span>
        )}
        <span className="text-sm text-gray-500">estimated total timeline</span>
      </div>

      {loading ? <TimelineBarSkeleton /> : <TimelineBar steps={timeline.steps} />}

      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {liveTimes.map((item) => (
          <LiveTime key={item.label} label={item.label} time={item.time} premium={item.premium} />
        ))}
      </div>

      {!loading && timeline.wait > 0 && (
        <p className="mt-3 text-sm text-orange-700">
          Priority date wait for {normalizeGuideCountry(selectedCountry) === "other" ? "most countries" : normalizeGuideCountry(selectedCountry)}: {formatWait(timeline.wait)}.
        </p>
      )}
    </section>
  );
}

export function H1BGuideInteractive() {
  const { processingTimes, priorityDates, loading } = useGuideApiData();
  const pwdMonths = processingTimes?.pwd.months ?? 6;
  const permMonths = pwdMonths + 3 + (processingTimes?.perm.months ?? 17);
  const i140PremiumDays = processingTimes?.i140.premiumDays ?? 15;
  const i485Months = processingTimes?.i485.max ?? 18;

  return (
    <GuideTimelineWidget
      title="Live H-1B to Green Card Timeline"
      subtitle="Updates from DOL, USCIS, and the visa bulletin"
      category="eb2"
      preWaitSteps={[
        { label: "PERM", months: permMonths, color: "emerald" },
        { label: "I-140", months: 0.5, color: "emerald" },
      ]}
      postWaitSteps={[{ label: "I-485", months: i485Months, color: "amber" }]}
      liveTimes={[
        { label: "PERM", time: `${Math.round(permMonths)} mo` },
        { label: "I-140", time: `${i140PremiumDays} days`, premium: "premium" },
        { label: "I-485", time: `${processingTimes?.i485.min ?? 10}-${processingTimes?.i485.max ?? 18} mo` },
      ]}
      loading={loading}
      priorityDates={priorityDates}
    />
  );
}

export function TNGuideInteractive() {
  const { processingTimes, priorityDates, loading } = useGuideApiData();
  const permMonths = 6 + 3 + (processingTimes?.perm.months ?? 17);
  const i140PremiumDays = processingTimes?.i140.premiumDays ?? 15;
  const i485Months = processingTimes?.i485.max ?? 18;

  return (
    <GuideTimelineWidget
      title="Live TN to Green Card Timeline"
      subtitle="Use country tabs to compare visa bulletin delays"
      category="eb2"
      preWaitSteps={[
        { label: "PERM", months: permMonths, color: "emerald" },
        { label: "I-140", months: 0.5, color: "emerald" },
      ]}
      postWaitSteps={[{ label: "I-485", months: i485Months, color: "amber" }]}
      liveTimes={[
        { label: "PERM", time: `${Math.round(permMonths)} mo` },
        { label: "I-140", time: `${i140PremiumDays} days`, premium: "premium" },
        { label: "I-485", time: `${processingTimes?.i485.min ?? 10}-${processingTimes?.i485.max ?? 18} mo` },
      ]}
      loading={loading}
      priorityDates={priorityDates}
    />
  );
}

export function EB2NIWGuideInteractive() {
  const { processingTimes, priorityDates, loading } = useGuideApiData();
  const i140PremiumDays = processingTimes?.i140.premiumDays ?? 15;
  const i485Months = processingTimes?.i485.max ?? 18;

  return (
    <GuideTimelineWidget
      title="Live EB-2 NIW Timeline"
      subtitle="Self-petition route with country-specific priority date wait"
      category="eb2"
      preWaitSteps={[{ label: "I-140 NIW", months: 0.5, color: "emerald" }]}
      postWaitSteps={[{ label: "I-485", months: i485Months, color: "amber" }]}
      liveTimes={[
        { label: "I-140 NIW", time: `${processingTimes?.i140.min ?? 6}-${processingTimes?.i140.max ?? 9} mo`, premium: `${i140PremiumDays}d` },
        { label: "I-485", time: `${processingTimes?.i485.min ?? 10}-${processingTimes?.i485.max ?? 18} mo` },
      ]}
      loading={loading}
      priorityDates={priorityDates}
    />
  );
}

export function PERMGuideInteractive() {
  const { processingTimes, loading } = useGuideApiData();

  const pwdMonths = processingTimes?.pwd.months ?? 6;
  const recruitmentMonths = 3;
  const dolMonths = processingTimes?.perm.months ?? 17;
  const auditMonths = processingTimes?.permAudit.months ?? 22;
  const total = pwdMonths + recruitmentMonths + dolMonths;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Live PERM Process Timeline</h2>
      <p className="text-sm text-gray-600 mb-4">Labor certification timing before I-140 filing</p>

      <div className="flex items-baseline gap-3 mb-2">
        {loading ? (
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        ) : (
          <span className="text-2xl font-semibold text-gray-900">{formatTotalTimeline(total)}</span>
        )}
        <span className="text-sm text-gray-500">typical PERM duration</span>
      </div>

      {loading ? (
        <TimelineBarSkeleton />
      ) : (
        <TimelineBar
          steps={[
            { label: "PWD", months: pwdMonths, color: "emerald" },
            { label: "Recruit", months: recruitmentMonths, color: "emerald" },
            { label: "DOL", months: dolMonths, color: "emerald" },
          ]}
        />
      )}

      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <LiveTime label="PWD" time={`${Math.round(pwdMonths)} mo`} />
        <LiveTime label="DOL analyst review" time={`${Math.round(dolMonths)} mo`} />
        <LiveTime label="DOL audit review" time={`${Math.round(auditMonths)} mo`} />
      </div>

      <p className="mt-3 text-sm text-amber-700">Audit cases can add roughly 6-12 extra months.</p>
    </section>
  );
}

interface GuideCard {
  slug: string;
  title: string;
  subtitle: string;
  category: EBCategory;
  getSteps: (processingTimes: ProcessingTimes | null, pdWaitMonths: number) => GuideTimelineStep[];
}

const GUIDE_CARDS: GuideCard[] = [
  {
    slug: "h1b-to-green-card",
    title: "H-1B to Green Card",
    subtitle: "Employer-sponsored EB-2/EB-3",
    category: "eb2",
    getSteps: (processingTimes, pdWaitMonths) => {
      const permMonths = (processingTimes?.pwd.months ?? 6) + 3 + (processingTimes?.perm.months ?? 17);
      const i485Months = processingTimes?.i485.max ?? 18;
      const steps: GuideTimelineStep[] = [
        { label: "PERM", months: permMonths, color: "emerald" },
        { label: "I-140", months: 0.5, color: "emerald" },
      ];
      if (pdWaitMonths > 0) steps.push({ label: "PD Wait", months: pdWaitMonths, color: "orange" });
      steps.push({ label: "I-485", months: i485Months, color: "amber" });
      return steps;
    },
  },
  {
    slug: "tn-to-green-card",
    title: "TN to Green Card",
    subtitle: "Canadian and Mexican professionals",
    category: "eb2",
    getSteps: (processingTimes, pdWaitMonths) => {
      const permMonths = (processingTimes?.pwd.months ?? 6) + 3 + (processingTimes?.perm.months ?? 17);
      const i485Months = processingTimes?.i485.max ?? 18;
      const steps: GuideTimelineStep[] = [
        { label: "PERM", months: permMonths, color: "emerald" },
        { label: "I-140", months: 0.5, color: "emerald" },
      ];
      if (pdWaitMonths > 0) steps.push({ label: "PD Wait", months: pdWaitMonths, color: "orange" });
      steps.push({ label: "I-485", months: i485Months, color: "amber" });
      return steps;
    },
  },
  {
    slug: "eb2-niw",
    title: "EB-2 NIW",
    subtitle: "Self-petition, no employer sponsor",
    category: "eb2",
    getSteps: (processingTimes, pdWaitMonths) => {
      const i485Months = processingTimes?.i485.max ?? 18;
      const steps: GuideTimelineStep[] = [{ label: "I-140 NIW", months: 0.5, color: "emerald" }];
      if (pdWaitMonths > 0) steps.push({ label: "PD Wait", months: pdWaitMonths, color: "orange" });
      steps.push({ label: "I-485", months: i485Months, color: "amber" });
      return steps;
    },
  },
  {
    slug: "perm-process",
    title: "PERM Process",
    subtitle: "Labor certification deep dive",
    category: "eb2",
    getSteps: (processingTimes) => [
      { label: "PWD", months: processingTimes?.pwd.months ?? 6, color: "emerald" },
      { label: "Recruit", months: 3, color: "emerald" },
      { label: "DOL", months: processingTimes?.perm.months ?? 17, color: "emerald" },
    ],
  },
];

export function GuidesIndexInteractive() {
  const { selectedCountry, setCountry, isLoaded } = useCountrySelection("other");
  const { processingTimes, priorityDates, loading } = useGuideApiData();

  const cards = useMemo(() => {
    return GUIDE_CARDS.map((guide) => {
      const pdDate = getPriorityDate(priorityDates, guide.category, selectedCountry);
      const pdWait = guide.slug === "perm-process"
        ? 0
        : Math.round(calculateNewFilerWait(pdDate, normalizeGuideCountry(selectedCountry), guide.category).estimatedMonths);

      const steps = guide.getSteps(processingTimes, pdWait);
      const totalMonths = steps.reduce((sum, step) => sum + step.months, 0);
      return { ...guide, steps, totalMonths };
    });
  }, [priorityDates, processingTimes, selectedCountry]);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <span className="text-sm text-gray-500">Show timelines for:</span>
        <CountryTabs selected={normalizeGuideCountry(selectedCountry)} onChange={setCountry} isLoading={!isLoaded} />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="p-5 rounded-xl border border-gray-200 bg-white animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
              <div className="h-7 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {cards.map((card) => (
            <Link
              key={card.slug}
              href={`/guides/${card.slug}`}
              className="group block p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-500">{card.subtitle}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xl font-semibold text-gray-900">{formatTotalTimeline(card.totalMonths)}</div>
                  <div className="text-xs text-gray-500">total</div>
                </div>
              </div>

              <GuideCardTimeline steps={card.steps} />
            </Link>
          ))}
        </div>
      )}

      {!loading && normalizeGuideCountry(selectedCountry) !== "other" && (
        <p className="mt-5 text-sm text-gray-600">
          Backlog estimates are based on recent visa bulletin movement. <Link href="/processing-times" className="text-brand-600 hover:text-brand-700">See current data →</Link>
        </p>
      )}
    </section>
  );
}

function GuideCardTimeline({ steps }: { steps: GuideTimelineStep[] }) {
  const totalMonths = steps.reduce((sum, step) => sum + step.months, 0);
  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    orange: "bg-orange-500",
  };

  return (
    <div className="mt-4">
      <div className="flex items-stretch h-7 rounded-lg overflow-hidden">
        {steps.map((step, index) => {
          const width = (step.months / totalMonths) * 100;
          return (
            <div
              key={`${step.label}-${index}`}
              className={`${colorClasses[step.color]} flex items-center justify-center text-xs text-white font-medium ${index > 0 ? "border-l border-white/20" : ""}`}
              style={{ width: `${Math.max(width, 8)}%` }}
            >
              <span className="truncate px-1">{step.label}</span>
            </div>
          );
        })}
      </div>
      <div className="flex mt-1.5 text-[10px] text-gray-500">
        {steps.map((step, index) => {
          const width = (step.months / totalMonths) * 100;
          const label = step.months >= 12 ? `${(step.months / 12).toFixed(step.months >= 24 ? 0 : 1)} yr` : `${Math.round(step.months)} mo`;
          return (
            <div
              key={`${step.label}-duration-${index}`}
              className={`text-center ${step.color === "orange" ? "text-orange-600" : ""}`}
              style={{ width: `${Math.max(width, 8)}%` }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
