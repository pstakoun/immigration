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

export default function ProcessingTimesPage() {
  const [data, setData] = useState<ProcessingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/processing-times");
        if (!response.ok) throw new Error("Failed to fetch");
        const result = await response.json();
        if (result.success && result.data) {
          setData(result.data);
        } else {
          throw new Error("Invalid response");
        }
      } catch (err) {
        setError("Unable to load processing times. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatMonths = (min: number, max: number) => {
    if (min === max) return `${min} months`;
    return `${min}-${max} months`;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            USCIS Processing Times
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Live processing times for immigration forms and current visa bulletin priority dates.
          </p>
          {data && (
            <p className="mt-2 text-sm text-gray-500">
              Last updated: {new Date(data.lastUpdated).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 rounded-lg bg-brand-500 animate-pulse" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700">{error}</p>
          </div>
        ) : data ? (
          <div className="space-y-12">
            {/* USCIS Forms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">USCIS Form Processing Times</h2>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Form</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Description</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Processing Time</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 font-mono font-medium text-brand-600">I-140</td>
                      <td className="px-6 py-4 text-gray-600">Immigrant Petition</td>
                      <td className="px-6 py-4 font-medium">{formatMonths(data.processingTimes.i140.min, data.processingTimes.i140.max)}</td>
                      <td className="px-6 py-4 text-green-600">{data.processingTimes.i140.premiumDays} days</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-mono font-medium text-brand-600">I-485</td>
                      <td className="px-6 py-4 text-gray-600">Adjustment of Status</td>
                      <td className="px-6 py-4 font-medium">{formatMonths(data.processingTimes.i485.min, data.processingTimes.i485.max)}</td>
                      <td className="px-6 py-4 text-gray-400">N/A</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-mono font-medium text-brand-600">I-765</td>
                      <td className="px-6 py-4 text-gray-600">Employment Authorization (EAD)</td>
                      <td className="px-6 py-4 font-medium">{formatMonths(data.processingTimes.i765.min, data.processingTimes.i765.max)}</td>
                      <td className="px-6 py-4 text-gray-400">N/A</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-mono font-medium text-brand-600">I-130</td>
                      <td className="px-6 py-4 text-gray-600">Petition for Alien Relative</td>
                      <td className="px-6 py-4 font-medium">{formatMonths(data.processingTimes.i130.min, data.processingTimes.i130.max)}</td>
                      <td className="px-6 py-4 text-gray-400">N/A</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-mono font-medium text-brand-600">I-129</td>
                      <td className="px-6 py-4 text-gray-600">Nonimmigrant Worker (H-1B, L-1, etc.)</td>
                      <td className="px-6 py-4 font-medium">{formatMonths(data.processingTimes.i129.min, data.processingTimes.i129.max)}</td>
                      <td className="px-6 py-4 text-green-600">{data.processingTimes.i129.premiumDays} days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* DOL Times */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Department of Labor Processing Times</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900">Prevailing Wage (PWD)</h3>
                  <p className="text-sm text-gray-500 mt-1">ETA-9141</p>
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-brand-600">{data.processingTimes.pwd.months} mo</div>
                    <p className="text-xs text-gray-500 mt-1">
                      Currently processing: {data.processingTimes.pwd.currentlyProcessing}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900">PERM (Standard)</h3>
                  <p className="text-sm text-gray-500 mt-1">ETA-9089</p>
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-brand-600">{data.processingTimes.perm.months} mo</div>
                    <p className="text-xs text-gray-500 mt-1">
                      Currently processing: {data.processingTimes.perm.currentlyProcessing}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900">PERM (Audit)</h3>
                  <p className="text-sm text-gray-500 mt-1">Cases selected for audit</p>
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-amber-600">{data.processingTimes.permAudit.months} mo</div>
                    <p className="text-xs text-gray-500 mt-1">
                      Currently processing: {data.processingTimes.permAudit.currentlyProcessing}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Visa Bulletin - Final Action Dates */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Visa Bulletin - Final Action Dates</h2>
              <p className="text-gray-600 mb-6">
                Priority dates that are currently being processed for final green card approval.
              </p>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Category</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">India 🇮🇳</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">China 🇨🇳</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">All Other</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">EB-1</td>
                      <td className={`px-6 py-4 font-medium ${data.priorityDates.eb1.india === "Current" ? "text-green-600" : "text-gray-900"}`}>
                        {data.priorityDates.eb1.india}
                      </td>
                      <td className={`px-6 py-4 font-medium ${data.priorityDates.eb1.china === "Current" ? "text-green-600" : "text-gray-900"}`}>
                        {data.priorityDates.eb1.china}
                      </td>
                      <td className="px-6 py-4 font-medium text-green-600">{data.priorityDates.eb1.allOther}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">EB-2</td>
                      <td className="px-6 py-4 font-medium text-red-600">{data.priorityDates.eb2.india}</td>
                      <td className="px-6 py-4 font-medium text-amber-600">{data.priorityDates.eb2.china}</td>
                      <td className="px-6 py-4 font-medium text-green-600">{data.priorityDates.eb2.allOther}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">EB-3</td>
                      <td className="px-6 py-4 font-medium text-red-600">{data.priorityDates.eb3.india}</td>
                      <td className="px-6 py-4 font-medium text-amber-600">{data.priorityDates.eb3.china}</td>
                      <td className="px-6 py-4 font-medium text-green-600">{data.priorityDates.eb3.allOther}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Dates for Filing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Visa Bulletin - Dates for Filing</h2>
              <p className="text-gray-600 mb-6">
                Priority dates eligible to file I-485 (if USCIS accepts Dates for Filing chart).
              </p>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Category</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">India 🇮🇳</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">China 🇨🇳</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">All Other</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">EB-1</td>
                      <td className={`px-6 py-4 font-medium ${data.datesForFiling.eb1.india === "Current" ? "text-green-600" : "text-gray-900"}`}>
                        {data.datesForFiling.eb1.india}
                      </td>
                      <td className={`px-6 py-4 font-medium ${data.datesForFiling.eb1.china === "Current" ? "text-green-600" : "text-gray-900"}`}>
                        {data.datesForFiling.eb1.china}
                      </td>
                      <td className="px-6 py-4 font-medium text-green-600">{data.datesForFiling.eb1.allOther}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">EB-2</td>
                      <td className="px-6 py-4 font-medium">{data.datesForFiling.eb2.india}</td>
                      <td className="px-6 py-4 font-medium">{data.datesForFiling.eb2.china}</td>
                      <td className="px-6 py-4 font-medium text-green-600">{data.datesForFiling.eb2.allOther}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">EB-3</td>
                      <td className="px-6 py-4 font-medium">{data.datesForFiling.eb3.india}</td>
                      <td className="px-6 py-4 font-medium">{data.datesForFiling.eb3.china}</td>
                      <td className="px-6 py-4 font-medium text-green-600">{data.datesForFiling.eb3.allOther}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Explanation */}
            <section className="prose prose-gray max-w-none">
              <h2 className="text-2xl font-bold text-gray-900">Understanding Processing Times</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 not-prose">
                <h3 className="font-semibold text-blue-900 mb-3">Key Terms</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="font-medium text-blue-800">Priority Date</dt>
                    <dd className="text-blue-700">The date your PERM was filed (or I-140 for EB-1). This determines your place in line.</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-blue-800">Final Action Date</dt>
                    <dd className="text-blue-700">Your priority date must be before this date for your green card to be approved.</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-blue-800">Dates for Filing</dt>
                    <dd className="text-blue-700">Your priority date must be before this date to file I-485 (when USCIS allows).</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-blue-800">Current</dt>
                    <dd className="text-blue-700">No backlog—you can file or be approved immediately.</dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* CTA */}
            <div className="bg-brand-500 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-white">
                See Your Personalized Timeline
              </h2>
              <p className="mt-3 text-brand-100 max-w-xl mx-auto">
                Use our interactive tool to visualize your complete green card journey 
                with these processing times factored in.
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-600 font-semibold rounded-lg hover:bg-brand-50 transition-colors"
              >
                Plan My Path
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
