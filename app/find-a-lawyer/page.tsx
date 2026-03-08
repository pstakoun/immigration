"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

const VISA_TYPES = [
  "H-1B",
  "L-1",
  "O-1",
  "EB-2 NIW",
  "EB-1",
  "PERM",
  "TN",
  "Other",
] as const;

const CURRENT_STATUSES = [
  "F-1 / OPT",
  "H-1B",
  "H-4",
  "L-1",
  "L-2",
  "O-1",
  "TN",
  "Green Card Holder",
  "US Citizen",
  "Outside the US",
  "Other",
] as const;

const URGENCY_OPTIONS = [
  "Urgent — need help this month",
  "Soon — within 3 months",
  "Planning ahead — 3–6 months",
  "Just exploring options",
] as const;

interface FormData {
  name: string;
  email: string;
  visaType: string;
  currentStatus: string;
  urgency: string;
  description: string;
}

export default function FindALawyerPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    visaType: "",
    currentStatus: "",
    urgency: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setIsSubmitted(true);
    } catch {
      setError("Failed to submit. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-brand-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Thank you, {formData.name}!
          </h1>
          <p className="text-gray-600 mb-8">
            We&apos;ve received your information and will connect you with an
            immigration attorney who specializes in{" "}
            <span className="font-medium">{formData.visaType}</span> cases.
            Expect to hear back within 1–2 business days.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors"
          >
            Back to Stateside
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Stateside
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Find an Immigration Lawyer
        </h1>
        <p className="text-gray-600 mb-8">
          Tell us about your situation and we&apos;ll connect you with an
          attorney who can help.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
              placeholder="jane@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="visaType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Visa Type
            </label>
            <select
              id="visaType"
              required
              value={formData.visaType}
              onChange={(e) => updateField("visaType", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors bg-white"
            >
              <option value="">Select visa type</option>
              {VISA_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="currentStatus"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Current Immigration Status
            </label>
            <select
              id="currentStatus"
              required
              value={formData.currentStatus}
              onChange={(e) => updateField("currentStatus", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors bg-white"
            >
              <option value="">Select current status</option>
              {CURRENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="urgency"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Timeline
            </label>
            <select
              id="urgency"
              required
              value={formData.urgency}
              onChange={(e) => updateField("urgency", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors bg-white"
            >
              <option value="">How soon do you need help?</option>
              {URGENCY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Brief Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors resize-none"
              placeholder="Tell us about your situation — current visa, goals, any deadlines..."
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-5 py-3 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Get Connected"}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Your information is kept confidential and only shared with vetted
            immigration attorneys.
          </p>
        </form>
      </div>
    </div>
  );
}
