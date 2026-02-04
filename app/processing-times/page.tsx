"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { DynamicData } from "@/lib/dynamic-data";
import { 
  HISTORICAL_BULLETIN_DATA,
  HISTORICAL_FILING_DATES_DATA,
  getAdvancementRates,
} from "@/lib/perm-velocity";
import { 
  parseVisaBulletinDate,
  calculateWaitTimeMonths,
  SparklineCell,
  WaitTimeDataPoint,
} from "@/components/TrendSparkline";

interface ProcessingData {
  success: boolean;
  data: DynamicData;
}

type EBCategory = "eb1" | "eb2" | "eb3";
type Country = "india" | "china" | "other";

// Calculate estimated wait time for a new filer
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
  
  const today = new Date();
  const todayMonths = (today.getFullYear() - 2000) * 12 + today.getMonth();
  const backlogMonths = todayMonths - cutoffMonths;
  
  if (backlogMonths <= 0) {
    return { years: 0, rangeMin: 0, rangeMax: 0 };
  }
  
  const waitMonths = monthsPerYear > 0 ? (backlogMonths / monthsPerYear) * 12 : 600;
  const years = Math.round(waitMonths / 12);
  const rangeMin = Math.round(years * 0.8);
  const rangeMax = Math.round(years * 1.2);
  
  return { years, rangeMin, rangeMax };
}

// Get color class based on wait time
function getWaitTimeColor(years: number): string {
  if (years === 0) return "text-green-600";
  if (years <= 2) return "text-green-600";
  if (years <= 5) return "text-yellow-600";
  if (years <= 10) return "text-orange-600";
  return "text-red-600";
}

// Format wait time for display
function formatWaitTime(years: number, rangeMin: number, rangeMax: number): string {
  if (years === 0) return "Current";
  if (rangeMin === rangeMax || years < 2) return `~${years} yr`;
  return `${rangeMin}-${rangeMax} yr`;
}

// Convert historical bulletin data to WAIT TIME format
function getWaitTimeData(category: EBCategory, country: Country, source: "finalAction" | "filing" = "finalAction"): WaitTimeDataPoint[] {
  const countryKey = country === "other" ? "other" : country;
  const dataSource = source === "finalAction" ? HISTORICAL_BULLETIN_DATA : HISTORICAL_FILING_DATES_DATA;
  const entries = dataSource[category][countryKey];
  
  return entries.map(entry => ({
    label: entry.bulletinMonth,
    waitMonths: calculateWaitTimeMonths(entry.bulletinMonth, entry.finalActionDate)
  }));
}

export default function ProcessingTimesPage() {
  const [data, setData] = useState<DynamicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const advancementRates = useMemo(() => getAdvancementRates(), []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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
          {timeStr} <span className="text-green-600 text-xs">({premiumDays}d premium)</span>
        </>
      );
    }
    return timeStr;
  };

  const isPriorityDateCurrent = (dateStr: string) => dateStr.toLowerCase() === "current";

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
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Processing Times</h1>
        <p className="text-red-600">{error || "Unable to load data"}</p>
      </div>
    );
  }

  const { processingTimes, priorityDates, datesForFiling } = data;

  // Prepare wait time estimates
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

      {/* USCIS Forms */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">USCIS Forms</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 pr-4 font-medium text-gray-700">Form</th>
                <th className="text-left py-3 pr-4 font-medium text-gray-700">Purpose</th>
                <th className="text-left py-3 font-medium text-gray-700">Processing Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">I-140</td>
                <td className="py-3 pr-4 text-gray-600">Immigrant Petition (EB-1, EB-2, EB-3)</td>
                <td className="py-3 text-gray-900">{formatMonths(processingTimes.i140.min, processingTimes.i140.max, processingTimes.i140.premiumDays)}</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">I-485</td>
                <td className="py-3 pr-4 text-gray-600">Adjustment of Status (Green Card)</td>
                <td className="py-3 text-gray-900">{formatMonths(processingTimes.i485.min, processingTimes.i485.max, processingTimes.i485.premiumDays)}</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">I-765</td>
                <td className="py-3 pr-4 text-gray-600">Employment Authorization (EAD)</td>
                <td className="py-3 text-gray-900">{formatMonths(processingTimes.i765.min, processingTimes.i765.max, processingTimes.i765.premiumDays)}</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">I-130</td>
                <td className="py-3 pr-4 text-gray-600">Petition for Alien Relative</td>
                <td className="py-3 text-gray-900">{formatMonths(processingTimes.i130.min, processingTimes.i130.max, processingTimes.i130.premiumDays)}</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">I-129</td>
                <td className="py-3 pr-4 text-gray-600">Work Visa (H-1B, L-1, O-1)</td>
                <td className="py-3 text-gray-900">{formatMonths(processingTimes.i129.min, processingTimes.i129.max, processingTimes.i129.premiumDays)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Department of Labor */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Department of Labor</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 pr-4 font-medium text-gray-700">Process</th>
                <th className="text-left py-3 pr-4 font-medium text-gray-700">Currently Processing</th>
                <th className="text-left py-3 font-medium text-gray-700">Wait Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">Prevailing Wage (PWD)</td>
                <td className="py-3 pr-4 text-gray-600">{processingTimes.pwd.currentlyProcessing}</td>
                <td className="py-3 text-gray-900">~{processingTimes.pwd.months} months</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">PERM (Analyst Review)</td>
                <td className="py-3 pr-4 text-gray-600">{processingTimes.perm.currentlyProcessing}</td>
                <td className="py-3 text-gray-900">~{processingTimes.perm.months} months</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-900">PERM (Audit Review)</td>
                <td className="py-3 pr-4 text-gray-600">{processingTimes.permAudit.currentlyProcessing}</td>
                <td className="py-3 text-gray-900">~{processingTimes.permAudit.months} months</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Audit Review shows when DOL processes audit responses. Total time for audited cases is typically 6-12 months longer.
        </p>
      </section>

      {/* Visa Bulletin Section */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Visa Bulletin</h2>
        <p className="text-sm text-gray-600 mb-6">
          Visa availability determines when you can file I-485 and when your green card can be approved.
          Sparklines show 5-year wait time trends: <span className="text-green-600">▼</span> = wait decreasing (good), <span className="text-red-600">▲</span> = wait increasing (bad).
        </p>

        {/* Final Action Dates */}
        <div className="mb-8">
          <h3 className="text-base font-medium text-gray-900 mb-3">Final Action Dates</h3>
          <p className="text-sm text-gray-500 mb-4">When your priority date is current here, your green card can be approved.</p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 pr-3 font-medium text-gray-700 w-16">Category</th>
                  <th className="text-left py-3 pr-3 font-medium text-gray-700">Country</th>
                  <th className="text-left py-3 pr-3 font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 pr-3 font-medium text-gray-700">Est. Wait</th>
                  <th className="text-left py-3 font-medium text-gray-700">5yr Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(["eb1", "eb2", "eb3"] as const).map((cat) => (
                  <>
                    {(["other", "china", "india"] as const).map((country, countryIdx) => {
                      const countryLabel = country === "other" ? "ROW" : country.charAt(0).toUpperCase() + country.slice(1);
                      const priorityDate = country === "other" ? priorityDates[cat].allOther : priorityDates[cat][country];
                      const wait = waitTimeEstimates[cat][country];
                      const waitTimeData = getWaitTimeData(cat, country, "finalAction");
                      
                      return (
                        <tr key={`${cat}-${country}`} className={countryIdx === 0 ? "border-t-2 border-gray-200" : ""}>
                          {countryIdx === 0 && (
                            <td className="py-2.5 pr-3 font-semibold text-gray-900 align-top" rowSpan={3}>
                              {cat.toUpperCase().replace("EB", "EB-")}
                            </td>
                          )}
                          <td className="py-2.5 pr-3 text-gray-600">{countryLabel}</td>
                          <td className={`py-2.5 pr-3 ${isPriorityDateCurrent(priorityDate) ? "text-green-600 font-medium" : "text-gray-900"}`}>
                            {priorityDate}
                          </td>
                          <td className={`py-2.5 pr-3 font-medium ${getWaitTimeColor(wait.years)}`}>
                            {formatWaitTime(wait.years, wait.rangeMin, wait.rangeMax)}
                          </td>
                          <td className="py-2.5">
                            <SparklineCell data={waitTimeData} />
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dates for Filing */}
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-3">Dates for Filing</h3>
          <p className="text-sm text-gray-500 mb-4">When you can submit I-485 and get EAD/Advance Parole while waiting for approval.</p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 pr-3 font-medium text-gray-700 w-16">Category</th>
                  <th className="text-left py-3 pr-3 font-medium text-gray-700">Country</th>
                  <th className="text-left py-3 pr-3 font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 pr-3 font-medium text-gray-700">Est. Wait</th>
                  <th className="text-left py-3 font-medium text-gray-700">5yr Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(["eb1", "eb2", "eb3"] as const).map((cat) => (
                  <>
                    {(["other", "china", "india"] as const).map((country, countryIdx) => {
                      const countryLabel = country === "other" ? "ROW" : country.charAt(0).toUpperCase() + country.slice(1);
                      const filingDate = country === "other" ? datesForFiling[cat].allOther : datesForFiling[cat][country];
                      // Calculate filing wait estimate using same advancement rates
                      const filingWait = calculateNewFilerWait(filingDate, advancementRates[cat][country]);
                      const waitTimeData = getWaitTimeData(cat, country, "filing");
                      
                      return (
                        <tr key={`filing-${cat}-${country}`} className={countryIdx === 0 ? "border-t-2 border-gray-200" : ""}>
                          {countryIdx === 0 && (
                            <td className="py-2.5 pr-3 font-semibold text-gray-900 align-top" rowSpan={3}>
                              {cat.toUpperCase().replace("EB", "EB-")}
                            </td>
                          )}
                          <td className="py-2.5 pr-3 text-gray-600">{countryLabel}</td>
                          <td className={`py-2.5 pr-3 ${isPriorityDateCurrent(filingDate) ? "text-green-600 font-medium" : "text-gray-900"}`}>
                            {filingDate}
                          </td>
                          <td className={`py-2.5 pr-3 font-medium ${getWaitTimeColor(filingWait.years)}`}>
                            {formatWaitTime(filingWait.years, filingWait.rangeMin, filingWait.rangeMax)}
                          </td>
                          <td className="py-2.5">
                            <SparklineCell data={waitTimeData} />
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Understanding Section */}
      <section className="mb-10 p-5 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-3">Understanding the Data</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>Final Action Dates</strong> determine when your case can be approved. 
            <strong> Dates for Filing</strong> determine when you can submit I-485 and get work/travel permits.
          </p>
          <p>
            <strong>Wait time trends:</strong> Sparklines show how wait times have changed over 5 years. 
            <span className="text-green-600"> ▼ = wait times decreasing (good)</span>, 
            <span className="text-red-600"> ▲ = wait times increasing (bad)</span>.
          </p>
          <p>
            <strong>Wait estimates</strong> are for new filers starting today based on historical velocity.
            India &amp; China face long backlogs due to the 7% per-country cap.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-gray-600">See how these times affect your specific immigration path.</p>
          <Link
            href="/"
            className="flex-shrink-0 inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors"
          >
            See your timeline
            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
