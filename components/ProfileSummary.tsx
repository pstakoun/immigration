"use client";

import {
  FilterState,
  educationLabels,
  experienceLabels,
  statusLabels,
  countryLabels,
  ebCategoryLabels,
  formatPriorityDateShort,
} from "@/lib/filter-paths";

interface ProfileSummaryProps {
  filters: FilterState;
  matchingCount: number;
  onEdit: () => void;
  onTrackCases?: () => void;
}

export default function ProfileSummary({
  filters,
  matchingCount,
  onEdit,
  onTrackCases,
}: ProfileSummaryProps) {
  const tags: string[] = [
    statusLabels[filters.currentStatus],
    educationLabels[filters.education],
    experienceLabels[filters.experience],
  ];

  // Show country of birth for relevant countries (TN-eligible or backlogged)
  if (filters.countryOfBirth !== "other") {
    tags.push(`Born in ${countryLabels[filters.countryOfBirth]}`);
  }

  // Show citizenship if Canadian/Mexican but born elsewhere
  if (filters.isCanadianOrMexicanCitizen) {
    tags.push("CA/MX citizen");
  }

  if (filters.isStem) tags.push("STEM");
  if (filters.hasExtraordinaryAbility) tags.push("Extraordinary ability");
  if (filters.isOutstandingResearcher) tags.push("Outstanding researcher");
  if (filters.isExecutive) tags.push("Executive");
  if (filters.isMarriedToUSCitizen) tags.push("Married to US citizen");
  if (filters.hasInvestmentCapital) tags.push("EB-5 investor");

  // Show existing priority date
  if (filters.hasApprovedI140 && filters.existingPriorityDate) {
    const pdStr = formatPriorityDateShort(filters.existingPriorityDate);
    const category = filters.existingPriorityDateCategory
      ? ebCategoryLabels[filters.existingPriorityDateCategory]
      : "";
    tags.push(`PD: ${pdStr}${category ? ` (${category})` : ""}`);
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
            {filters.userCases && filters.userCases.length > 0 && (
                 <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full whitespace-nowrap">
                    {filters.userCases.length} active case{filters.userCases.length !== 1 ? 's' : ''}
                 </span>
            )}
          </div>
          <button
            onClick={onEdit}
            className="text-sm text-gray-500 hover:text-gray-900 font-medium whitespace-nowrap"
          >
            Edit Profile
          </button>
          {onTrackCases && (
            <>
                <span className="text-gray-300">|</span>
                <button
                    onClick={onTrackCases}
                    className="text-sm text-brand-600 hover:text-brand-700 font-medium whitespace-nowrap"
                >
                    Track Cases
                </button>
            </>
          )}
        </div>

        <div className="text-sm text-gray-600 whitespace-nowrap">
          <span className="font-semibold text-brand-600">{matchingCount}</span>{" "}
          {matchingCount === 1 ? "path" : "paths"}
        </div>
      </div>
    </div>
  );
}
