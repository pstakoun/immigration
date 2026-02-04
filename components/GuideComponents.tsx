"use client";

import { useState, useEffect, useCallback } from "react";
import { CountryOfBirth } from "@/lib/filter-paths";

// Storage key for persisting country selection across guides
const GUIDE_COUNTRY_KEY = "stateside_guide_country";

// Hook to persist country selection in localStorage
export function useCountrySelection(defaultCountry: CountryOfBirth = "other") {
  const [selectedCountry, setSelectedCountry] = useState<CountryOfBirth>(defaultCountry);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(GUIDE_COUNTRY_KEY);
      if (stored && ["other", "india", "china"].includes(stored)) {
        setSelectedCountry(stored as CountryOfBirth);
      }
    } catch (e) {
      // localStorage not available
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when changed
  const setCountry = useCallback((country: CountryOfBirth) => {
    setSelectedCountry(country);
    try {
      localStorage.setItem(GUIDE_COUNTRY_KEY, country);
    } catch (e) {
      // localStorage not available
    }
  }, []);

  return { selectedCountry, setCountry, isLoaded };
}

// Country selector tabs - compact with w-fit to prevent full-width on mobile
export function CountryTabs({
  selected,
  onChange,
  isLoading = false,
}: {
  selected: CountryOfBirth;
  onChange: (country: CountryOfBirth) => void;
  isLoading?: boolean;
}) {
  const countries: { id: CountryOfBirth; label: string }[] = [
    { id: "other", label: "Most countries" },
    { id: "india", label: "India" },
    { id: "china", label: "China" },
  ];

  // Show skeleton while loading to prevent flicker
  if (isLoading) {
    return (
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        {countries.map((c) => (
          <div
            key={c.id}
            className="px-3 py-1.5 text-sm font-medium rounded-md text-transparent bg-gray-100"
          >
            {c.label}
          </div>
        ))}
      </div>
    );
  }

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

// Timeline bar showing processing steps
export function TimelineBar({
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
          const formatTime = (m: number) => {
            if (m < 1) return `${Math.round(m * 30)}d`;
            if (m >= 12) return `${(m / 12).toFixed(m >= 24 ? 0 : 1)} yr`;
            return `${Math.round(m)} mo`;
          };
          return (
            <div
              key={i}
              className={`text-center ${step.color === "orange" ? "text-orange-600" : ""}`}
              style={{ width: `${Math.max(width, 8)}%`, minWidth: "45px" }}
            >
              {formatTime(step.months)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Skeleton loader for timeline bar
export function TimelineBarSkeleton() {
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

// Live processing time display component
export function LiveTime({
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
      {premium && <span className="text-emerald-600">({premium} premium)</span>}
    </div>
  );
}
