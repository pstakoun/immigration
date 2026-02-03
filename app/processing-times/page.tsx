"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DynamicData } from "@/lib/dynamic-data";

interface ProcessingData {
  success: boolean;
  data: DynamicData;
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
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
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
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Processing Times
        </h1>
        <p className="text-red-600">{error || "Unable to load data"}</p>
      </div>
    );
  }

  const { processingTimes, priorityDates } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
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
                <td className="py-3 text-amber-600 font-medium">
                  ~{processingTimes.permAudit.months} months
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Visa Bulletin */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Visa Bulletin (Final Action Dates)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Priority dates that are currently being approved for green cards.
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
