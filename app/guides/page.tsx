"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { DynamicData } from "@/lib/dynamic-data";
import { calculateNewFilerWait } from "@/lib/processing-times";
import { CountryOfBirth, EBCategory } from "@/lib/filter-paths";

// Timeline bar for guide cards - shows processing steps with PD wait in correct order
// Order: PERM → I-140 → PD Wait → I-485
function GuideTimeline({
  steps,
}: {
  steps: { label: string; months: number; color: string }[];
}) {
  const totalMonths = steps.reduce((sum, s) => sum + s.months, 0);
  
  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    orange: "bg-orange-500",
  };
  
  return (
    <div className="mt-4">
      <div className="flex items-stretch h-7 rounded-lg overflow-hidden">
        {steps.map((step, i) => {
          const width = (step.months / totalMonths) * 100;
          return (
            <div
              key={i}
              className={`${colorClasses[step.color]} flex items-center justify-center text-xs text-white font-medium ${i > 0 ? "border-l border-white/20" : ""}`}
              style={{ width: `${Math.max(width, 8)}%` }}
            >
              <span className="truncate px-1">{step.label}</span>
            </div>
          );
        })}
      </div>
      <div className="flex mt-1.5 text-[10px] text-gray-500">
        {steps.map((step, i) => {
          const width = (step.months / totalMonths) * 100;
          const formatTime = (m: number) => {
            if (m < 1) return `${Math.round(m * 30)}d`;
            if (m >= 12) return `${(m / 12).toFixed(m >= 24 ? 0 : 1)} yr`;
            return `${Math.round(m)} mo`;
          };
          return (
            <div
              key={i}
              className={`text-center ${step.color === "orange" ? "text-orange-600" : ""}`}
              style={{ width: `${Math.max(width, 8)}%` }}
            >
              {formatTime(step.months)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
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

// Guide data - steps will be built dynamically with PD wait in correct position
interface GuideData {
  slug: string;
  title: string;
  subtitle: string;
  category: EBCategory;
  // Base processing steps (before PD wait)
  preWaitSteps: { label: string; months: number; color: string }[];
  // Steps after PD wait (I-485)
  postWaitSteps: { label: string; months: number; color: string }[];
}

const guides: GuideData[] = [
  {
    slug: "h1b-to-green-card",
    title: "H-1B to Green Card",
    subtitle: "Employer-sponsored EB-2/EB-3",
    category: "eb2",
    preWaitSteps: [
      { label: "PERM", months: 17, color: "emerald" },
      { label: "I-140", months: 0.5, color: "emerald" },
    ],
    postWaitSteps: [
      { label: "I-485", months: 18, color: "amber" },
    ],
  },
  {
    slug: "tn-to-green-card",
    title: "TN to Green Card",
    subtitle: "Canadian & Mexican professionals",
    category: "eb2",
    preWaitSteps: [
      { label: "PERM", months: 17, color: "emerald" },
      { label: "I-140", months: 0.5, color: "emerald" },
    ],
    postWaitSteps: [
      { label: "I-485", months: 18, color: "amber" },
    ],
  },
  {
    slug: "eb2-niw",
    title: "EB-2 NIW",
    subtitle: "Self-petition, no employer needed",
    category: "eb2",
    preWaitSteps: [
      { label: "I-140 NIW", months: 0.5, color: "emerald" },
    ],
    postWaitSteps: [
      { label: "I-485", months: 18, color: "amber" },
    ],
  },
  {
    slug: "perm-process",
    title: "PERM Process",
    subtitle: "Labor certification deep-dive",
    category: "eb2",
    preWaitSteps: [
      { label: "PWD", months: 6, color: "emerald" },
      { label: "Recruit", months: 3, color: "emerald" },
      { label: "DOL", months: 17, color: "emerald" },
    ],
    postWaitSteps: [], // PERM guide doesn't show full GC timeline
  },
];

export default function GuidesPage() {
  const [selectedCountry, setSelectedCountry] = useState<CountryOfBirth>("other");
  const [priorityDates, setPriorityDates] = useState<DynamicData["priorityDates"] | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch priority dates on mount
  useEffect(() => {
    fetch("/api/processing-times")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.priorityDates) {
          setPriorityDates(data.data.priorityDates);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Calculate PD wait and build complete timeline for each guide
  const guidesWithTimeline = useMemo(() => {
    return guides.map((guide) => {
      // Calculate PD wait
      let pdWaitMonths = 0;
      if (priorityDates && guide.postWaitSteps.length > 0) {
        const pdStr = priorityDates[guide.category]?.[
          selectedCountry === "india" ? "india" : 
          selectedCountry === "china" ? "china" : "allOther"
        ] || "Current";
        const waitResult = calculateNewFilerWait(pdStr, selectedCountry, guide.category);
        pdWaitMonths = Math.round(waitResult.estimatedMonths);
      }
      
      // Build complete timeline: preWait → PD Wait (if any) → postWait
      const steps: { label: string; months: number; color: string }[] = [
        ...guide.preWaitSteps,
      ];
      
      if (pdWaitMonths > 0 && guide.postWaitSteps.length > 0) {
        steps.push({ label: "PD Wait", months: pdWaitMonths, color: "orange" });
      }
      
      steps.push(...guide.postWaitSteps);
      
      const totalMonths = steps.reduce((sum, s) => sum + s.months, 0);
      
      return {
        ...guide,
        steps,
        pdWaitMonths,
        totalMonths,
      };
    });
  }, [priorityDates, selectedCountry]);

  // Format total time
  const formatTotalTime = (months: number) => {
    if (months < 12) return `~${months} mo`;
    const years = months / 12;
    if (years < 2) return `~${years.toFixed(1)} yr`;
    return `~${Math.round(years)} yr`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          Immigration Guides
        </h1>
        <p className="text-gray-600 max-w-xl mb-6">
          Step-by-step breakdowns with current processing times and priority date estimates.
        </p>
        
        {/* Country selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-sm text-gray-500">Show timelines for:</span>
          <CountryTabs selected={selectedCountry} onChange={setSelectedCountry} />
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 rounded-xl border border-gray-200 bg-white animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
              <div className="h-7 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Guides list */}
      {!loading && (
        <div className="space-y-4">
          {guidesWithTimeline.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group block p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                    {guide.title}
                  </h2>
                  <p className="text-sm text-gray-500">{guide.subtitle}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xl font-semibold text-gray-900">
                    {formatTotalTime(guide.totalMonths)}
                  </div>
                  <div className="text-xs text-gray-500">
                    total
                  </div>
                </div>
              </div>
              
              <GuideTimeline steps={guide.steps} />
            </Link>
          ))}
        </div>
      )}

      {/* Country-specific note - only for backlogged countries */}
      {!loading && selectedCountry !== "other" && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            Priority date wait estimates are based on historical visa bulletin movement.{" "}
            <Link href="/processing-times" className="text-brand-600 hover:text-brand-700">
              See current bulletin →
            </Link>
          </p>
        </div>
      )}

      {/* Bottom section */}
      <div className="mt-10 pt-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-gray-600">
            Enter your details for a personalized timeline.
          </p>
          <Link
            href="/"
            className="flex-shrink-0 px-4 py-2 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors text-center"
          >
            See your timeline →
          </Link>
        </div>
      </div>
    </div>
  );
}
