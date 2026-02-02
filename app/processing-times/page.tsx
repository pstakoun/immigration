"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ProcessingData {
  lastUpdated: string;
  processingTimes: {
    i140: { min: number; max: number; premiumDays?: number };
    i485: { min: number; max: number };
    i765: { min: number; max: number };
    i130: { min: number; max: number };
    i129: { min: number; max: number; premiumDays?: number };
    pwd: { months: number; currentlyProcessing: string };
    perm: { months: number; currentlyProcessing: string };
    permAudit: { months: number; currentlyProcessing: string };
  };
  priorityDates: {
    eb1: { india: string; china: string; allOther: string };
    eb2: { india: string; china: string; allOther: string };
    eb3: { india: string; china: string; allOther: string };
  };
  datesForFiling: {
    eb1: { india: string; china: string; allOther: string };
    eb2: { india: string; china: string; allOther: string };
    eb3: { india: string; china: string; allOther: string };
  };
}

function formatRange(min: number, max: number) {
  if (min === max) return `${min} mo`;
  return `${min}–${max} mo`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProcessingTimesPage() {
  const [data, setData] = useState<ProcessingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/processing-times");
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setData(result.data);
          }
        }
      } catch (err) {
        // Silent fail - will show loading state
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-100 rounded w-64"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <h1 className="text-2xl font-semibold text-gray-900">Processing Times</h1>
          <p className="mt-2 text-gray-500">Unable to load data. Try refreshing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Processing Times</h1>
          <span className="text-sm text-gray-400">
            Updated {formatDate(data.lastUpdated)}
          </span>
        </div>

        {/* USCIS Forms */}
        <section className="mt-10">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide">USCIS Forms</h2>
          <div className="mt-3 divide-y divide-gray-100">
            <div className="py-3 flex justify-between">
              <div>
                <span className="font-medium text-gray-900">I-140</span>
                <span className="text-gray-500 ml-2">Immigrant Petition</span>
              </div>
              <div className="text-right">
                <span className="text-gray-900">{formatRange(data.processingTimes.i140.min, data.processingTimes.i140.max)}</span>
                {data.processingTimes.i140.premiumDays && (
                  <span className="text-green-600 ml-2 text-sm">({data.processingTimes.i140.premiumDays}d premium)</span>
                )}
              </div>
            </div>
            <div className="py-3 flex justify-between">
              <div>
                <span className="font-medium text-gray-900">I-485</span>
                <span className="text-gray-500 ml-2">Adjustment of Status</span>
              </div>
              <span className="text-gray-900">{formatRange(data.processingTimes.i485.min, data.processingTimes.i485.max)}</span>
            </div>
            <div className="py-3 flex justify-between">
              <div>
                <span className="font-medium text-gray-900">I-765</span>
                <span className="text-gray-500 ml-2">EAD</span>
              </div>
              <span className="text-gray-900">{formatRange(data.processingTimes.i765.min, data.processingTimes.i765.max)}</span>
            </div>
            <div className="py-3 flex justify-between">
              <div>
                <span className="font-medium text-gray-900">I-129</span>
                <span className="text-gray-500 ml-2">H-1B / L-1 / O-1</span>
              </div>
              <div className="text-right">
                <span className="text-gray-900">{formatRange(data.processingTimes.i129.min, data.processingTimes.i129.max)}</span>
                {data.processingTimes.i129.premiumDays && (
                  <span className="text-green-600 ml-2 text-sm">({data.processingTimes.i129.premiumDays}d premium)</span>
                )}
              </div>
            </div>
            <div className="py-3 flex justify-between">
              <div>
                <span className="font-medium text-gray-900">I-130</span>
                <span className="text-gray-500 ml-2">Family Petition</span>
              </div>
              <span className="text-gray-900">{formatRange(data.processingTimes.i130.min, data.processingTimes.i130.max)}</span>
            </div>
          </div>
        </section>

        {/* DOL */}
        <section className="mt-10">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Department of Labor</h2>
          <div className="mt-3 divide-y divide-gray-100">
            <div className="py-3 flex justify-between">
              <div>
                <span className="font-medium text-gray-900">Prevailing Wage</span>
                <span className="text-gray-400 ml-2 text-sm">processing {data.processingTimes.pwd.currentlyProcessing}</span>
              </div>
              <span className="text-gray-900">{data.processingTimes.pwd.months} mo</span>
            </div>
            <div className="py-3 flex justify-between">
              <div>
                <span className="font-medium text-gray-900">PERM</span>
                <span className="text-gray-400 ml-2 text-sm">processing {data.processingTimes.perm.currentlyProcessing}</span>
              </div>
              <span className="text-gray-900">{data.processingTimes.perm.months} mo</span>
            </div>
            <div className="py-3 flex justify-between">
              <div>
                <span className="font-medium text-gray-900">PERM Audit</span>
                <span className="text-gray-400 ml-2 text-sm">processing {data.processingTimes.permAudit.currentlyProcessing}</span>
              </div>
              <span className="text-amber-600">{data.processingTimes.permAudit.months} mo</span>
            </div>
          </div>
        </section>

        {/* Visa Bulletin */}
        <section className="mt-10">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Visa Bulletin – Final Action Dates</h2>
          <p className="text-xs text-gray-400 mt-1">When your green card can be approved</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2 font-medium"></th>
                  <th className="py-2 font-medium">India</th>
                  <th className="py-2 font-medium">China</th>
                  <th className="py-2 font-medium">Other</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 font-medium text-gray-900">EB-1</td>
                  <td className={`py-2 ${data.priorityDates.eb1.india === "Current" ? "text-green-600" : "text-gray-900"}`}>
                    {data.priorityDates.eb1.india}
                  </td>
                  <td className={`py-2 ${data.priorityDates.eb1.china === "Current" ? "text-green-600" : "text-gray-900"}`}>
                    {data.priorityDates.eb1.china}
                  </td>
                  <td className="py-2 text-green-600">{data.priorityDates.eb1.allOther}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-gray-900">EB-2</td>
                  <td className="py-2 text-gray-900">{data.priorityDates.eb2.india}</td>
                  <td className="py-2 text-gray-900">{data.priorityDates.eb2.china}</td>
                  <td className="py-2 text-green-600">{data.priorityDates.eb2.allOther}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-gray-900">EB-3</td>
                  <td className="py-2 text-gray-900">{data.priorityDates.eb3.india}</td>
                  <td className="py-2 text-gray-900">{data.priorityDates.eb3.china}</td>
                  <td className="py-2 text-green-600">{data.priorityDates.eb3.allOther}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Dates for Filing */}
        <section className="mt-10">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Visa Bulletin – Dates for Filing</h2>
          <p className="text-xs text-gray-400 mt-1">When you can submit I-485</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2 font-medium"></th>
                  <th className="py-2 font-medium">India</th>
                  <th className="py-2 font-medium">China</th>
                  <th className="py-2 font-medium">Other</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 font-medium text-gray-900">EB-1</td>
                  <td className={`py-2 ${data.datesForFiling.eb1.india === "Current" ? "text-green-600" : "text-gray-900"}`}>
                    {data.datesForFiling.eb1.india}
                  </td>
                  <td className={`py-2 ${data.datesForFiling.eb1.china === "Current" ? "text-green-600" : "text-gray-900"}`}>
                    {data.datesForFiling.eb1.china}
                  </td>
                  <td className="py-2 text-green-600">{data.datesForFiling.eb1.allOther}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-gray-900">EB-2</td>
                  <td className="py-2 text-gray-900">{data.datesForFiling.eb2.india}</td>
                  <td className="py-2 text-gray-900">{data.datesForFiling.eb2.china}</td>
                  <td className="py-2 text-green-600">{data.datesForFiling.eb2.allOther}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-gray-900">EB-3</td>
                  <td className="py-2 text-gray-900">{data.datesForFiling.eb3.india}</td>
                  <td className="py-2 text-gray-900">{data.datesForFiling.eb3.china}</td>
                  <td className="py-2 text-green-600">{data.datesForFiling.eb3.allOther}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-10 text-xs text-gray-400">
          Data sourced from USCIS, DOL, and State Department. Updates automatically.
        </p>
      </div>
    </div>
  );
}
