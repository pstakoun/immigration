"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { DynamicData } from "@/lib/dynamic-data";
import { 
  HISTORICAL_BULLETIN_DATA,
  getAdvancementRates,
} from "@/lib/perm-velocity";
import TrendSparkline, { 
  VelocityBadge, 
  parseVisaBulletinDate,
  formatMonthsSinceEpoch,
  HistoricalChart 
} from "@/components/TrendSparkline";

interface ProcessingData {
  success: boolean;
  data: DynamicData;
}

type EBCategory = "eb1" | "eb2" | "eb3";
type Country = "india" | "china" | "other";

// Calculate estimated wait time for a new filer (someone applying today)
function calculateNewFilerWait(
  currentCutoff: string,
  monthsPerYear: number
): { years: number; rangeMin: number; rangeMax: number } {
  if (currentCutoff.toLowerCase() === "current") {
    return { years: 0, rangeMin: 0, rangeMax: 0 };
  }
  
  const cutoffMonths = parseVisaBulletinDate(currentCutoff);
  if (cutoffMonths === null) {
    return { years: 0, rangeMin: 0, rangeMax: 0 };
  }
  
  // Today's date in months since 2000
  const today = new Date();
  const todayMonths = (today.getFullYear() - 2000) * 12 + today.getMonth();
  
  // Months between today and cutoff (the backlog)
  const backlogMonths = todayMonths - cutoffMonths;
  
  if (backlogMonths <= 0) {
    return { years: 0, rangeMin: 0, rangeMax: 0 };
  }
  
  // Estimated wait = backlog / velocity
  const waitMonths = monthsPerYear > 0 ? (backlogMonths / monthsPerYear) * 12 : 600;
  const years = Math.round(waitMonths / 12);
  
  // Range based on uncertainty (±20%)
  const rangeMin = Math.round(years * 0.8);
  const rangeMax = Math.round(years * 1.2);
  
  return { years, rangeMin, rangeMax };
}

// Get color class based on wait time
function getWaitTimeColor(years: number): { bg: string; text: string; border: string } {
  if (years === 0) {
    return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" };
  }
  if (years <= 2) {
    return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" };
  }
  if (years <= 5) {
    return { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" };
  }
  if (years <= 10) {
    return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" };
  }
  return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" };
}

// Format wait time for display
function formatWaitTime(years: number, rangeMin: number, rangeMax: number): string {
  if (years === 0) {
    return "Current";
  }
  if (rangeMin === rangeMax || years < 2) {
    return `~${years} year${years !== 1 ? "s" : ""}`;
  }
  return `${rangeMin}-${rangeMax} years`;
}

// Convert historical bulletin data to sparkline format
function getSparklineData(category: EBCategory, country: Country) {
  const countryKey = country === "other" ? "other" : country;
  const entries = HISTORICAL_BULLETIN_DATA[category][countryKey];
  
  return entries.map(entry => ({
    label: entry.bulletinMonth,
    value: parseVisaBulletinDate(entry.finalActionDate) || 0
  }));
}

// Calculate trend direction and magnitude
function getTrendInfo(sparklineData: { label: string; value: number }[]): {
  direction: "improving" | "worsening" | "flat";
  description: string;
} {
  if (sparklineData.length < 2) {
    return { direction: "flat", description: "Insufficient data" };
  }
  
  // Compare recent values to older values
  const recentValues = sparklineData.slice(-2).filter(d => d.value > 0);
  const olderValues = sparklineData.slice(0, 2).filter(d => d.value > 0);
  
  if (recentValues.length === 0 || olderValues.length === 0) {
    return { direction: "flat", description: "Category fluctuating" };
  }
  
  const recentAvg = recentValues.reduce((a, b) => a + b.value, 0) / recentValues.length;
  const olderAvg = olderValues.reduce((a, b) => a + b.value, 0) / olderValues.length;
  
  const monthsAdvanced = recentAvg - olderAvg;
  const yearsAdvanced = monthsAdvanced / 12;
  const yearsOfData = sparklineData.length - 1; // Assuming yearly data points
  
  if (monthsAdvanced > 12) {
    const avgPerYear = Math.round(monthsAdvanced / yearsOfData);
    return { 
      direction: "improving", 
      description: `Advancing ~${avgPerYear} months/year` 
    };
  }
  if (monthsAdvanced < -6) {
    return { direction: "worsening", description: "Retrogressing" };
  }
  return { direction: "flat", description: "Relatively stable" };
}

export default function ProcessingTimesPage() {
  const [data, setData] = useState<DynamicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHistoricalChart, setShowHistoricalChart] = useState<EBCategory | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/processing-times");
        const result: ProcessingData = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError("Failed to load processing times");
        }
      } catch {
        setError("Failed to load processing times");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Get advancement rates from velocity calculations
  const advancementRates = useMemo(() => getAdvancementRates(), []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatMonths = (min: number, max: number, premiumDays?: number) => {
    let timeStr: string;
    if (min < 1 && max < 1) {
      const minDays = Math.round(min * 30);
      const maxDays = Math.round(max * 30);
      timeStr = `${minDays}-${maxDays} days`;
    } else {
      timeStr = `${Math.round(min)}-${Math.round(max)} months`;
    }

    if (premiumDays && premiumDays > 0) {
      return (
        <>
          {timeStr}{" "}
          <span className="text-green-600">({premiumDays}d premium)</span>
        </>
      );
    }
    return timeStr;
  };

  const isPriorityDateCurrent = (dateStr: string) => {
    return dateStr.toLowerCase() === "current";
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Processing Times
        </h1>
        <p className="text-red-600">{error || "Unable to load data"}</p>
      </div>
    );
  }

  const { processingTimes, priorityDates, datesForFiling } = data;

  // Prepare wait time estimates for all category/country combinations
  const waitTimeEstimates = {
    eb1: {
      india: calculateNewFilerWait(priorityDates.eb1.india, advancementRates.eb1.india),
      china: calculateNewFilerWait(priorityDates.eb1.china, advancementRates.eb1.china),
      other: calculateNewFilerWait(priorityDates.eb1.allOther, advancementRates.eb1.other),
    },
    eb2: {
      india: calculateNewFilerWait(priorityDates.eb2.india, advancementRates.eb2.india),
      china: calculateNewFilerWait(priorityDates.eb2.china, advancementRates.eb2.china),
      other: calculateNewFilerWait(priorityDates.eb2.allOther, advancementRates.eb2.other),
    },
    eb3: {
      india: calculateNewFilerWait(priorityDates.eb3.india, advancementRates.eb3.india),
      china: calculateNewFilerWait(priorityDates.eb3.china, advancementRates.eb3.china),
      other: calculateNewFilerWait(priorityDates.eb3.allOther, advancementRates.eb3.other),
    },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Immigration Processing Times
        </h1>
        <p className="text-gray-600 mb-1">
          Live data from USCIS, Department of Labor, and State Department.
        </p>
        <p className="text-sm text-gray-500">
          Updated {formatDate(data.lastUpdated)}
        </p>
      </div>

      {/* NEW: Wait Time Estimates Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Estimated Wait Times
            </h2>
            <p className="text-sm text-gray-600">
              Approximate wait for the visa bulletin if you filed today
            </p>
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Based on historical velocity
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {(["eb1", "eb2", "eb3"] as EBCategory[]).map((category) => (
            <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">{category.toUpperCase()}</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {(["india", "china", "other"] as Country[]).map((country) => {
                  const wait = waitTimeEstimates[category][country];
                  const colors = getWaitTimeColor(wait.years);
                  const sparklineData = getSparklineData(category, country);
                  const trend = getTrendInfo(sparklineData);
                  
                  return (
                    <div 
                      key={country} 
                      className={`px-4 py-3 ${colors.bg} flex items-center justify-between`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700 w-16">
                            {country === "other" ? "ROW" : country.charAt(0).toUpperCase() + country.slice(1)}
                          </span>
                          <span className={`font-semibold ${colors.text}`}>
                            {formatWaitTime(wait.years, wait.rangeMin, wait.rangeMax)}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
                          <VelocityBadge monthsPerYear={advancementRates[category][country]} />
                          <span 
                            className={`text-xs ${
                              trend.direction === "improving" ? "text-green-600" : 
                              trend.direction === "worsening" ? "text-red-600" : 
                              "text-gray-500"
                            }`}
                          >
                            {trend.description}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        <TrendSparkline 
                          data={sparklineData}
                          width={80}
                          height={28}
                          strokeColor={
                            trend.direction === "improving" ? "#22c55e" : 
                            trend.direction === "worsening" ? "#ef4444" : 
                            "#6b7280"
                          }
                          fillColor={
                            trend.direction === "improving" ? "#dcfce7" : 
                            trend.direction === "worsening" ? "#fee2e2" : 
                            "#f3f4f6"
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setShowHistoricalChart(showHistoricalChart === category ? null : category)}
                className="w-full px-4 py-2 text-xs text-brand-600 hover:bg-brand-50 transition-colors border-t border-gray-200 flex items-center justify-center gap-1"
              >
                {showHistoricalChart === category ? "Hide" : "Show"} historical trends
                <svg 
                  className={`w-3 h-3 transition-transform ${showHistoricalChart === category ? "rotate-180" : ""}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Expanded historical chart */}
              {showHistoricalChart === category && (
                <div className="px-4 py-4 border-t border-gray-200 bg-white">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    {category.toUpperCase()} Visa Bulletin Movement (2020-2025)
                  </h4>
                  <HistoricalChart
                    data={[
                      { category, country: "India", entries: getSparklineData(category, "india") },
                      { category, country: "China", entries: getSparklineData(category, "china") },
                      { category, country: "ROW", entries: getSparklineData(category, "other") },
                    ]}
                    height={180}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Chart shows Final Action Date movement. Higher = more recent dates = faster processing.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium">How to read these estimates</p>
              <p className="mt-1 text-blue-700">
                These estimates are for new filers starting today. If you already have an approved I-140, 
                your actual wait depends on your priority date. The velocity (months/year) shows how fast 
                the visa bulletin is advancing. A velocity of 12 mo/yr means the queue moves at real-time speed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* USCIS Forms */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          USCIS Forms
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 pr-4 font-medium text-gray-700">
                  Form
                </th>
                <th className="text-left py-3 pr-4 font-medium text-gray-700">
                  Purpose
                </th>
                <th className="text-left py-3 font-medium text-gray-700">
                  Processing Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">I-140</td>
                <td className="py-3 pr-4 text-gray-600">
                  Immigrant Petition (EB-1, EB-2, EB-3)
                </td>
                <td className="py-3 text-gray-900">
                  {formatMonths(
                    processingTimes.i140.min,
                    processingTimes.i140.max,
                    processingTimes.i140.premiumDays
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">I-485</td>
                <td className="py-3 pr-4 text-gray-600">
                  Adjustment of Status (Green Card)
                </td>
                <td className="py-3 text-gray-900">
                  {formatMonths(
                    processingTimes.i485.min,
                    processingTimes.i485.max,
                    processingTimes.i485.premiumDays
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">I-765</td>
                <td className="py-3 pr-4 text-gray-600">
                  Employment Authorization (EAD)
                </td>
                <td className="py-3 text-gray-900">
                  {formatMonths(
                    processingTimes.i765.min,
                    processingTimes.i765.max,
                    processingTimes.i765.premiumDays
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">I-130</td>
                <td className="py-3 pr-4 text-gray-600">
                  Petition for Alien Relative
                </td>
                <td className="py-3 text-gray-900">
                  {formatMonths(
                    processingTimes.i130.min,
                    processingTimes.i130.max,
                    processingTimes.i130.premiumDays
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">I-129</td>
                <td className="py-3 pr-4 text-gray-600">
                  Work Visa (H-1B, L-1, O-1)
                </td>
                <td className="py-3 text-gray-900">
                  {formatMonths(
                    processingTimes.i129.min,
                    processingTimes.i129.max,
                    processingTimes.i129.premiumDays
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Department of Labor */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Department of Labor
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 pr-4 font-medium text-gray-700">
                  Process
                </th>
                <th className="text-left py-3 pr-4 font-medium text-gray-700">
                  Currently Processing
                </th>
                <th className="text-left py-3 font-medium text-gray-700">
                  Wait Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">
                  Prevailing Wage (PWD)
                </td>
                <td className="py-3 pr-4 text-gray-600">
                  {processingTimes.pwd.currentlyProcessing}
                </td>
                <td className="py-3 text-gray-900">
                  ~{processingTimes.pwd.months} months
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">
                  PERM (Analyst Review)
                </td>
                <td className="py-3 pr-4 text-gray-600">
                  {processingTimes.perm.currentlyProcessing}
                </td>
                <td className="py-3 text-gray-900">
                  ~{processingTimes.perm.months} months
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">
                  PERM (Audit Review)
                </td>
                <td className="py-3 pr-4 text-gray-600">
                  {processingTimes.permAudit.currentlyProcessing}
                </td>
                <td className="py-3 text-gray-900">
                  ~{processingTimes.permAudit.months} months
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Audit Review shows when DOL processes audit responses. Total time for audited cases is typically 6-12 months longer than non-audited cases.
        </p>
      </section>

      {/* Visa Bulletin Section Header */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Visa Bulletin
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          The Visa Bulletin has two charts: <span className="font-medium">Dates for Filing</span> determines when you can submit your I-485, while <span className="font-medium">Final Action Dates</span> determines when your green card can be approved.
        </p>

        {/* Final Action Dates */}
        <h3 className="text-base font-medium text-gray-900 mb-3">
          Final Action Dates
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          When your priority date is current here, your I-485 can be approved and green card issued.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 pr-4 font-medium text-gray-700">
                  Category
                </th>
                <th className="text-left py-3 pr-4 font-medium text-gray-700">
                  All Other Countries
                </th>
                <th className="text-left py-3 pr-4 font-medium text-gray-700">
                  China
                </th>
                <th className="text-left py-3 font-medium text-gray-700">
                  India
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">EB-1</td>
                <td
                  className={`py-3 pr-4 ${isPriorityDateCurrent(priorityDates.eb1.allOther) ? "text-green-600 font-medium" : "text-gray-900"}`}
                >
                  {priorityDates.eb1.allOther}
                </td>
                <td
                  className={`py-3 pr-4 ${isPriorityDateCurrent(priorityDates.eb1.china) ? "text-green-600 font-medium" : "text-gray-900"}`}
                >
                  {priorityDates.eb1.china}
                </td>
                <td
                  className={`py-3 ${isPriorityDateCurrent(priorityDates.eb1.india) ? "text-green-600 font-medium" : "text-gray-900"}`}
                >
                  {priorityDates.eb1.india}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">EB-2</td>
                <td
                  className={`py-3 pr-4 ${isPriorityDateCurrent(priorityDates.eb2.allOther) ? "text-green-600 font-medium" : "text-gray-900"}`}
                >
                  {priorityDates.eb2.allOther}
                </td>
                <td
                  className={`py-3 pr-4 ${isPriorityDateCurrent(priorityDates.eb2.china) ? "text-green-600 font-medium" : "text-gray-900"}`}
                >
                  {priorityDates.eb2.china}
                </td>
                <td
                  className={`py-3 ${isPriorityDateCurrent(priorityDates.eb2.india) ? "text-green-600 font-medium" : "text-gray-900"}`}
                >
                  {priorityDates.eb2.india}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">EB-3</td>
                <td
                  className={`py-3 pr-4 ${isPriorityDateCurrent(priorityDates.eb3.allOther) ? "text-green-600 font-medium" : "text-gray-900"}`}
                >
                  {priorityDates.eb3.allOther}
                </td>
                <td
                  className={`py-3 pr-4 ${isPriorityDateCurrent(priorityDates.eb3.china) ? "text-green-600 font-medium" : "text-gray-900"}`}
                >
                  {priorityDates.eb3.china}
                </td>
                <td
                  className={`py-3 ${isPriorityDateCurrent(priorityDates.eb3.india) ? "text-green-600 font-medium" : "text-gray-900"}`}
                >
                  {priorityDates.eb3.india}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Dates for Filing */}
        <h3 className="text-base font-medium text-gray-900 mb-3 mt-8">
          Dates for Filing
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          When your priority date is current here, you can file I-485 and get work/travel authorization while waiting for approval.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 pr-4 font-medium text-gray-700">
                  Category
                </th>
                <th className="text-left py-3 pr-4 font-medium text-gray-700">
                  All Other Countries
                </th>
                <th className="text-left py-3 pr-4 font-medium text-gray-700">
                  China
                </th>
                <th className="text-left py-3 font-medium text-gray-700">
                  India
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">EB-1</td>
                <td
                  className={`py-3 pr-4 ${isPriorityDateCurrent(datesForFiling.eb1.allOther) ? "text-green-600 font-medium" : "text-gray-900"}`}
                >
                  {datesForFiling.eb1.allOther}
                </td>
                <td
                  className={`py-3 pr-4 ${isPriorityDateCurrent(datesForFiling.eb1.china) ? "text-green-600 font-medium" : "text-gray-900"}`}
                >
                  {datesForFiling.eb1.china}
                </td>
                <td
                  className={`py-3 ${isPriorityDateCurrent(datesForFiling.eb1.india) ? "text-green-600 font-medium" : "text-gray-900"}`}
                >
                  {datesForFiling.eb1.india}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">EB-2</td>
                <td
                  className={`py-3 pr-4 ${isPriorityDateCurrent(datesForFiling.eb2.allOther) ? "text-green-600 font-medium" : "text-gray-900"}`}
                >
                  {datesForFiling.eb2.allOther}
                </td>
                <td
                  className={`py-3 pr-4 ${isPriorityDateCurrent(datesForFiling.eb2.china) ? "text-green-600 font-medium" : "text-gray-900"}`}
                >
                  {datesForFiling.eb2.china}
                </td>
                <td
                  className={`py-3 ${isPriorityDateCurrent(datesForFiling.eb2.india) ? "text-green-600 font-medium" : "text-gray-900"}`}
                >
                  {datesForFiling.eb2.india}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">EB-3</td>
                <td
                  className={`py-3 pr-4 ${isPriorityDateCurrent(datesForFiling.eb3.allOther) ? "text-green-600 font-medium" : "text-gray-900"}`}
                >
                  {datesForFiling.eb3.allOther}
                </td>
                <td
                  className={`py-3 pr-4 ${isPriorityDateCurrent(datesForFiling.eb3.china) ? "text-green-600 font-medium" : "text-gray-900"}`}
                >
                  {datesForFiling.eb3.china}
                </td>
                <td
                  className={`py-3 ${isPriorityDateCurrent(datesForFiling.eb3.india) ? "text-green-600 font-medium" : "text-gray-900"}`}
                >
                  {datesForFiling.eb3.india}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          USCIS authorizes I-485 filing based on these dates for employment-based categories. Filing early gets you EAD (work permit) and Advance Parole (travel document) while waiting for Final Action Date to become current.
        </p>
      </section>

      {/* Understanding Wait Times Section */}
      <section className="mb-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Understanding Wait Times
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">What is Velocity?</h3>
            <p className="text-sm text-gray-600">
              Velocity measures how fast the visa bulletin advances. For example, a velocity of 
              <strong> 12 months/year</strong> means the bulletin moves forward one month for each 
              real month that passes (real-time). A velocity of <strong>6 months/year</strong> means 
              it takes 2 real years to advance 1 year in the queue.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Why Estimates Vary</h3>
            <p className="text-sm text-gray-600">
              Wait times depend on many factors: PERM filing volume, visa availability, legislative 
              changes, and spillover from other categories. Historical patterns suggest these estimates 
              are reasonably accurate, but actual wait times may vary.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">India &amp; China Backlogs</h3>
            <p className="text-sm text-gray-600">
              Due to the 7% per-country cap and high demand, India and China face significant backlogs. 
              EB-2 India, for example, has a backlog of 10+ years. The velocity is low because demand 
              far exceeds the annual allocation.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">ROW (Rest of World)</h3>
            <p className="text-sm text-gray-600">
              Applicants from countries other than India and China typically face shorter waits. 
              Categories may be &quot;Current&quot; (no wait) or have short backlogs that clear quickly. 
              However, retrogression can occur if demand increases.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-gray-600">
            See how these times affect your specific immigration path.
          </p>
          <Link
            href="/"
            className="flex-shrink-0 inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors"
          >
            See your timeline
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
