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
  selectedPathId?: string | null;
  completedStagesCount?: number;
}

export default function ProfileSummary({
  filters,
  matchingCount,
  onEdit,
  selectedPathId,
  completedStagesCount = 0,
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

  // Show existing priority date from filters
  const priorityDate = filters.existingPriorityDate;
  const priorityDateCategory = filters.existingPriorityDateCategory;
  
  if (priorityDate) {
    const pdStr = formatPriorityDateShort(priorityDate);
    const category = priorityDateCategory
      ? ebCategoryLabels[priorityDateCategory]
      : "";
    tags.push(`PD: ${pdStr}${category ? ` (${category})` : ""}`);
  }

  // Split tags into primary (always shown) and secondary (hidden on mobile)
  const primaryTags = tags.slice(0, 3);
  const secondaryTags = tags.slice(3);

  return (
    <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-2 md:py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1 overflow-hidden">
          <div className="flex items-center gap-1.5 md:gap-2 flex-wrap overflow-hidden">
            {/* Primary tags - always visible */}
            {primaryTags.map((tag, i) => (
              <span
                key={i}
                className="px-2 md:px-2.5 py-0.5 md:py-1 text-[10px] md:text-xs font-medium bg-gray-100 text-gray-700 rounded-full whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
            
            {/* Secondary tags - hidden on mobile */}
            {secondaryTags.map((tag, i) => (
              <span
                key={i + primaryTags.length}
                className="hidden md:inline-flex px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
            
            {/* Show count of hidden tags on mobile */}
            {secondaryTags.length > 0 && (
              <span className="md:hidden px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-500 rounded-full whitespace-nowrap">
                +{secondaryTags.length}
              </span>
            )}
            
            {/* Progress indicator when tracking a path */}
            {selectedPathId && completedStagesCount > 0 && (
              <span className="hidden sm:inline-flex px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full whitespace-nowrap items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {completedStagesCount} done
              </span>
            )}
          </div>
          <button
            onClick={onEdit}
            className="text-xs md:text-sm text-brand-600 hover:text-brand-700 font-medium whitespace-nowrap flex-shrink-0"
          >
            Edit
          </button>
        </div>

        <div className="text-xs md:text-sm text-gray-600 whitespace-nowrap flex-shrink-0">
          <span className="font-semibold text-brand-600">{matchingCount}</span>{" "}
          <span className="hidden sm:inline">{matchingCount === 1 ? "path" : "paths"}</span>
        </div>
      </div>
    </div>
  );
}
