"use client";

import { useMemo } from "react";
import {
  CaseProgress,
  calculateRemainingSteps,
  calculateEffectivePriorityDate,
  calculateRemainingWait,
  RemainingStep,
  caseStatusLabels,
  caseStatusColors,
} from "@/lib/case-progress";
import {
  FilterState,
  EBCategory,
  formatPriorityDateShort,
  ebCategoryLabels,
  CountryOfBirth,
} from "@/lib/filter-paths";
import { calculateVelocity } from "@/lib/perm-velocity";
import { DynamicData } from "@/lib/dynamic-data";

interface ProgressDashboardProps {
  caseProgress: CaseProgress;
  filters: FilterState;
  priorityDates?: DynamicData["priorityDates"];
  datesForFiling?: DynamicData["datesForFiling"];
  onEditCase: () => void;
  compact?: boolean;
}

// Get the current cutoff date for a category/country from visa bulletin
function getCurrentCutoff(
  priorityDates: DynamicData["priorityDates"] | undefined,
  category: EBCategory,
  country: CountryOfBirth
): string {
  if (!priorityDates) return "Current";
  
  const categoryDates = priorityDates[category];
  if (!categoryDates) return "Current";
  
  switch (country) {
    case "india":
      return categoryDates.india;
    case "china":
      return categoryDates.china;
    default:
      return categoryDates.allOther;
  }
}

export default function ProgressDashboard({
  caseProgress,
  filters,
  priorityDates,
  datesForFiling,
  onEditCase,
  compact = false,
}: ProgressDashboardProps) {
  // Calculate progress data
  const remainingSteps = useMemo(
    () => calculateRemainingSteps(caseProgress),
    [caseProgress]
  );
  
  const effectivePD = useMemo(
    () => calculateEffectivePriorityDate(caseProgress.gcProcess),
    [caseProgress.gcProcess]
  );

  // Calculate wait times if we have a priority date
  const waitInfo = useMemo(() => {
    if (!effectivePD) return null;
    
    const category = caseProgress.effectiveEBCategory || effectivePD.category;
    const velocity = calculateVelocity(category, filters.countryOfBirth);
    
    // Get cutoffs from visa bulletin
    const finalActionCutoff = getCurrentCutoff(priorityDates, category, filters.countryOfBirth);
    const filingCutoff = getCurrentCutoff(datesForFiling, category, filters.countryOfBirth);
    
    // Calculate waits
    const filingWait = calculateRemainingWait(
      effectivePD.date,
      filingCutoff,
      velocity.bulletinAdvancementMonthsPerYear
    );
    
    const approvalWait = calculateRemainingWait(
      effectivePD.date,
      finalActionCutoff,
      velocity.bulletinAdvancementMonthsPerYear
    );
    
    return {
      category,
      velocity,
      filingCutoff,
      finalActionCutoff,
      filingWait,
      approvalWait,
      canFile: filingWait.isCurrent,
    };
  }, [effectivePD, caseProgress.effectiveEBCategory, filters.countryOfBirth, priorityDates, datesForFiling]);

  // Calculate overall progress percentage
  const progressPercent = useMemo(() => {
    if (remainingSteps.length === 0) return 0;
    const completed = remainingSteps.filter(s => s.status === "complete").length;
    return Math.round((completed / remainingSteps.length) * 100);
  }, [remainingSteps]);

  // Count completed steps
  const completedCount = remainingSteps.filter(s => s.status === "complete").length;
  const pendingCount = remainingSteps.filter(s => s.status === "pending").length;

  if (compact) {
    // Compact view for the profile summary bar
    return (
      <div className="flex items-center gap-3">
        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs text-gray-600">{progressPercent}%</span>
        </div>

        {/* Priority date and wait time */}
        {effectivePD && (
          <span className="text-xs text-gray-600">
            PD: {formatPriorityDateShort(effectivePD.date)}
            {waitInfo && !waitInfo.approvalWait.isCurrent && (
              <span className="text-amber-600 ml-1">
                ({waitInfo.approvalWait.display} wait)
              </span>
            )}
            {waitInfo?.approvalWait.isCurrent && (
              <span className="text-green-600 ml-1">✓ Current</span>
            )}
          </span>
        )}

        <button
          onClick={onEditCase}
          className="text-xs text-brand-600 hover:text-brand-700 font-medium"
        >
          Edit Case
        </button>
      </div>
    );
  }

  // Full dashboard view
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Your Immigration Progress</h3>
          <p className="text-sm text-gray-500">
            {completedCount} of {remainingSteps.length} steps complete
          </p>
        </div>
        <button
          onClick={onEditCase}
          className="px-3 py-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium border border-brand-200 rounded-lg hover:bg-brand-50 transition-colors"
        >
          Edit Case
        </button>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>{completedCount} complete</span>
          <span>{pendingCount} pending</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
          {pendingCount > 0 && (
            <div
              className="h-full bg-blue-400 transition-all animate-pulse"
              style={{ width: `${(pendingCount / remainingSteps.length) * 100}%` }}
            />
          )}
        </div>
      </div>

      {/* Priority Date & Wait Info */}
      {effectivePD && waitInfo && (
        <div className="grid grid-cols-2 gap-4">
          {/* Priority Date Card */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">Your Priority Date</div>
            <div className="text-xl font-bold text-gray-900">
              {formatPriorityDateShort(effectivePD.date)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {ebCategoryLabels[effectivePD.category]}
            </div>
          </div>

          {/* Wait Time Card */}
          <div className={`rounded-lg p-4 ${
            waitInfo.approvalWait.isCurrent
              ? "bg-green-50"
              : waitInfo.approvalWait.months <= 24
              ? "bg-amber-50"
              : "bg-red-50"
          }`}>
            <div className="text-xs text-gray-500 mb-1">Estimated Wait</div>
            {waitInfo.approvalWait.isCurrent ? (
              <>
                <div className="text-xl font-bold text-green-700">Current!</div>
                <div className="text-xs text-green-600 mt-1">
                  You can file I-485 now
                </div>
              </>
            ) : (
              <>
                <div className={`text-xl font-bold ${
                  waitInfo.approvalWait.months <= 24 ? "text-amber-700" : "text-red-700"
                }`}>
                  {waitInfo.approvalWait.display}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Bulletin: {waitInfo.velocity.bulletinAdvancementMonthsPerYear} mo/yr
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Filing Status */}
      {effectivePD && waitInfo && !waitInfo.approvalWait.isCurrent && (
        <div className={`p-4 rounded-lg ${waitInfo.canFile ? "bg-blue-50" : "bg-gray-50"}`}>
          {waitInfo.canFile ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-blue-600">📝</span>
                <span className="font-medium text-blue-800">You can file I-485 now!</span>
              </div>
              <p className="text-xs text-blue-700">
                Dates for Filing is current. You can file I-485 and get EAD/Advance Parole 
                while waiting for Final Action date.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-500">⏳</span>
                <span className="font-medium text-gray-700">Filing Wait: {waitInfo.filingWait.display}</span>
              </div>
              <p className="text-xs text-gray-600">
                Dates for Filing cutoff: {waitInfo.filingCutoff}. 
                You can file I-485 once your PD is current on this chart.
              </p>
            </>
          )}
        </div>
      )}

      {/* Steps Timeline */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Steps</h4>
        {remainingSteps.map((step, index) => (
          <StepRow key={step.id} step={step} index={index} isLast={index === remainingSteps.length - 1} />
        ))}
      </div>

      {/* Tips based on status */}
      {waitInfo && (
        <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
          💡 <strong>Tip:</strong>{" "}
          {waitInfo.approvalWait.isCurrent
            ? "Your priority date is current! Consider filing I-485 soon to start the final step."
            : waitInfo.canFile
            ? "While waiting for Final Action, your pending I-485 gives you EAD (work anywhere) and AP (travel freely)."
            : filters.hasApprovedI140
            ? "Your approved I-140 locks in your priority date. You don't need new PERM unless switching employers."
            : "Focus on getting I-140 approved to lock in your priority date."}
        </div>
      )}
    </div>
  );
}

// Individual step row component
function StepRow({ step, index, isLast }: { step: RemainingStep; index: number; isLast: boolean }) {
  const statusIcon = {
    complete: (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M5 12l5 5L20 7" />
        </svg>
      </div>
    ),
    pending: (
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
      </div>
    ),
    not_started: (
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium text-sm">
        {index + 1}
      </div>
    ),
    optional: (
      <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
        ?
      </div>
    ),
  };

  const statusColors = {
    complete: "border-green-200 bg-green-50",
    pending: "border-blue-200 bg-blue-50",
    not_started: "border-gray-200 bg-white",
    optional: "border-gray-200 bg-gray-50",
  };

  return (
    <div className="flex items-start gap-3">
      {/* Icon with connecting line */}
      <div className="flex flex-col items-center">
        {statusIcon[step.status]}
        {!isLast && (
          <div className={`w-0.5 h-8 ${
            step.status === "complete" ? "bg-green-300" : "bg-gray-200"
          }`} />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 p-3 rounded-lg border ${statusColors[step.status]} -mt-1`}>
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm text-gray-900">{step.name}</span>
          {step.estimatedMonths && step.status !== "complete" && (
            <span className="text-xs text-gray-500">~{step.estimatedMonths}mo</span>
          )}
        </div>
        {step.note && (
          <p className="text-xs text-gray-500 mt-0.5">{step.note}</p>
        )}
        {step.filedCase && (
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              caseStatusColors[step.filedCase.status].bg
            } ${caseStatusColors[step.filedCase.status].text}`}>
              {caseStatusLabels[step.filedCase.status]}
            </span>
            {step.filedCase.receiptNumber && (
              <span className="text-xs text-gray-400 font-mono">
                {step.filedCase.receiptNumber}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
