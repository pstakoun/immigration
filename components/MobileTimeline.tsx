"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import visaData from "@/data/visa-paths.json";
import { FilterState, statusToNodeId } from "@/lib/filter-paths";
import { generatePaths, ComposedStage, ComposedPath, setProcessingTimes } from "@/lib/path-composer";
import { adaptDynamicData } from "@/lib/processing-times";
import { DynamicData, DEFAULT_PRIORITY_DATES, DEFAULT_DATES_FOR_FILING } from "@/lib/dynamic-data";
import { trackStageClick, trackPathsGenerated } from "@/lib/analytics";
import { GlobalProgress, StageProgress } from "@/app/page";
import { 
  STATUS_VISA_NODES, 
  STATUS_VISA_VALIDITY_MONTHS,
  isStatusVisa,
} from "@/lib/constants";

interface MobileTimelineProps {
  onStageClick: (nodeId: string) => void;
  filters: FilterState;
  onMatchingCountChange: (count: number) => void;
  onSelectPath?: (path: ComposedPath) => void;
  onPathsGenerated?: (paths: ComposedPath[]) => void;
  selectedPathId?: string | null;
  globalProgress?: GlobalProgress | null;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  entry: { bg: "bg-brand-100", text: "text-brand-700", border: "border-brand-200" },
  work: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
  greencard: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
  citizenship: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
};

// Format date for display
function formatDateDisplay(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// Format date short
function formatDateShort(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

// Calculate months between two dates
function monthsBetween(date1: Date, date2: Date): number {
  const months = (date2.getFullYear() - date1.getFullYear()) * 12 +
    (date2.getMonth() - date1.getMonth());
  return Math.max(0, months);
}

// Parse date string
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  if (isNaN(year) || isNaN(month)) return null;
  return new Date(year, month - 1, day || 1);
}

// Calculate progress percentage
function getFiledProgress(filedDate: string | undefined, durationMonths: number): number {
  if (!filedDate) return 0;
  const filed = parseDate(filedDate);
  if (!filed) return 0;
  const now = new Date();
  const elapsed = monthsBetween(filed, now);
  return Math.min(100, Math.max(0, (elapsed / durationMonths) * 100));
}

// Get node info
function getNode(nodeId: string) {
  return visaData.nodes[nodeId as keyof typeof visaData.nodes];
}

// Stage status indicator component
function StageStatusIndicator({ status }: { status: "not_started" | "filed" | "approved" | "current" }) {
  if (status === "approved") {
    return (
      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
    );
  }
  if (status === "filed") {
    return (
      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
        <div className="w-2.5 h-2.5 bg-white rounded-full" />
      </div>
    );
  }
  if (status === "current") {
    return (
      <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0 animate-pulse">
        <div className="w-2.5 h-2.5 bg-white rounded-full" />
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0" />
  );
}

// Individual stage card within expanded path
function MobileStageCard({
  stage,
  stageProgress,
  isCurrentStage,
  isNextStep,
  onClick,
  isTracked,
}: {
  stage: ComposedStage;
  stageProgress: StageProgress | null;
  isCurrentStage: boolean;
  isNextStep: boolean;
  onClick: () => void;
  isTracked: boolean;
}) {
  const node = getNode(stage.nodeId);
  if (!node) return null;
  
  // Skip GC final marker in mobile view - we show it differently
  if (stage.nodeId === "gc") return null;

  const isApproved = stageProgress?.status === "approved";
  const isFiled = stageProgress?.status === "filed";
  const hasProgress = isApproved || isFiled;
  
  const colors = categoryColors[node.category] || categoryColors.work;
  const durationMonths = (stage.durationYears?.max || 0.5) * 12;
  const progressPercent = isFiled && !isApproved 
    ? getFiledProgress(stageProgress?.filedDate, durationMonths)
    : 0;

  const status = isApproved ? "approved" : isFiled ? "filed" : isNextStep ? "current" : "not_started";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left relative ${
        isNextStep && !hasProgress ? "ring-2 ring-brand-500 ring-offset-2 rounded-xl" : ""
      }`}
    >
      <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
        isApproved 
          ? "bg-green-50 border-green-200" 
          : isFiled 
          ? "bg-blue-50 border-blue-200" 
          : `${colors.bg} ${colors.border}`
      } ${isTracked ? "active:scale-[0.98]" : ""}`}>
        
        {/* Timeline connector line */}
        <div className="flex flex-col items-center">
          <StageStatusIndicator status={status} />
          <div className="w-0.5 h-full bg-gray-200 mt-2" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header with name and track badge */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className={`font-semibold text-sm ${
              isApproved ? "text-green-700" : isFiled ? "text-blue-700" : colors.text
            }`}>
              {node.name}
            </h4>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
              stage.track === "status" 
                ? "bg-emerald-200 text-emerald-800" 
                : "bg-amber-200 text-amber-800"
            }`}>
              {stage.track === "status" ? "STATUS" : "GC"}
            </span>
          </div>

          {/* Status info */}
          {isApproved && stageProgress?.approvedDate && (
            <p className="text-xs text-green-600 mb-1">
              ✓ Approved {formatDateDisplay(stageProgress.approvedDate)}
              {isStatusVisa(stage.nodeId) && (
                <span className="text-green-500 ml-1">
                  (valid {STATUS_VISA_VALIDITY_MONTHS[stage.nodeId] / 12} yrs)
                </span>
              )}
            </p>
          )}
          {isFiled && !isApproved && stageProgress?.filedDate && (
            <div className="mb-1">
              <p className="text-xs text-blue-600">
                Filed {formatDateDisplay(stageProgress.filedDate)}
              </p>
              {progressPercent > 0 && (
                <div className="mt-1 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              )}
            </div>
          )}
          
          {/* Duration and notes */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="font-medium">{stage.durationYears.display}</span>
            {stage.note && (
              <>
                <span className="text-gray-300">•</span>
                <span className="truncate text-gray-500">{stage.note}</span>
              </>
            )}
          </div>

          {/* Receipt number */}
          {stageProgress?.receiptNumber && (
            <p className="text-[10px] font-mono text-gray-400 mt-1">
              {stageProgress.receiptNumber}
            </p>
          )}

          {/* Next step indicator */}
          {isNextStep && !hasProgress && (
            <div className="mt-2 px-2 py-1 bg-brand-500 text-white text-[10px] font-bold rounded inline-block">
              → NEXT STEP
            </div>
          )}
          
          {/* Edit hint when tracking */}
          {isTracked && (
            <p className="text-[10px] text-brand-600 mt-1">
              Tap to {hasProgress ? "edit" : "add"} details
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

// PD Wait stage card
function MobilePDWaitCard({
  stage,
  stageProgress,
  onClick,
  isTracked,
}: {
  stage: ComposedStage;
  stageProgress: StageProgress | null;
  onClick: () => void;
  isTracked: boolean;
}) {
  const isApproved = stageProgress?.status === "approved";
  const waitYears = stage.durationYears.max;
  
  let bgColor = "bg-orange-100";
  let textColor = "text-orange-700";
  let borderColor = "border-orange-200";
  
  if (isApproved) {
    bgColor = "bg-gray-100";
    textColor = "text-gray-600";
    borderColor = "border-gray-200";
  } else if (waitYears >= 10) {
    bgColor = "bg-red-100";
    textColor = "text-red-700";
    borderColor = "border-red-200";
  } else if (waitYears >= 5) {
    bgColor = "bg-red-50";
    textColor = "text-red-600";
    borderColor = "border-red-200";
  }

  const status = isApproved ? "approved" : "not_started";

  return (
    <button onClick={onClick} className="w-full text-left">
      <div className={`flex items-start gap-3 p-3 rounded-xl border ${bgColor} ${borderColor} transition-all ${isTracked ? "active:scale-[0.98]" : ""}`}>
        <div className="flex flex-col items-center">
          <StageStatusIndicator status={status} />
          <div className="w-0.5 h-full bg-gray-200 mt-2" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className={`font-semibold text-sm ${textColor}`}>
              {isApproved ? "✓ PD Wait Complete" : "⏳ Priority Date Wait"}
            </h4>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-200 text-amber-800">
              GC
            </span>
          </div>

          <div className={`text-xs ${isApproved ? "text-gray-500 line-through" : textColor}`}>
            <span className="font-medium">{stage.durationYears.display}</span>
            {stage.priorityDateStr && (
              <span className="ml-2 text-gray-500">
                Cutoff: {stage.priorityDateStr}
              </span>
            )}
          </div>

          {/* Velocity explanation */}
          {stage.velocityInfo && !isApproved && (
            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
              {stage.velocityInfo.explanation}
            </p>
          )}

          {stage.note && (
            <p className="text-[10px] text-gray-500 mt-1">{stage.note}</p>
          )}
        </div>
      </div>
    </button>
  );
}

// Path card component
function MobilePathCard({
  path,
  isTracked,
  isExpanded,
  onToggleExpand,
  onSelectPath,
  onStageClick,
  globalProgress,
  currentNodeId,
}: {
  path: ComposedPath;
  isTracked: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSelectPath: () => void;
  onStageClick: (nodeId: string) => void;
  globalProgress: GlobalProgress | null | undefined;
  currentNodeId: string | null;
}) {
  // Get stage progress
  const getStageProgress = (nodeId: string): StageProgress | null => {
    return globalProgress?.stages[nodeId] || null;
  };

  // Calculate summary stats
  const trackableStages = path.stages.filter(s => !s.isPriorityWait && s.nodeId !== "gc");
  let completedCount = 0;
  let filedCount = 0;
  
  for (const stage of trackableStages) {
    const sp = getStageProgress(stage.nodeId);
    if (sp?.status === "approved") completedCount++;
    else if (sp?.status === "filed") filedCount++;
  }

  // Find current/next stage
  const currentStageIndex = trackableStages.findIndex(stage => {
    const sp = getStageProgress(stage.nodeId);
    return !sp || sp.status !== "approved";
  });

  const gcStage = path.stages.find(s => s.nodeId === "gc");
  const gcEnd = gcStage?.startYear || path.totalYears.max;

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all ${
      isTracked 
        ? "border-brand-300 ring-2 ring-brand-100 shadow-lg" 
        : "border-gray-200 shadow-sm"
    }`}>
      {/* Card Header - Always visible */}
      <div 
        className={`p-4 cursor-pointer active:bg-gray-50 ${isTracked ? "bg-brand-50" : ""}`}
        onClick={onToggleExpand}
      >
        {/* Top row: name and tracking badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base leading-tight">
              {path.name}
            </h3>
            {isTracked && (
              <span className="inline-flex items-center gap-1 text-[10px] text-brand-600 font-semibold mt-0.5">
                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
                TRACKING
              </span>
            )}
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>

        {/* Key stats row */}
        <div className="flex items-center flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg">
            {gcEnd.toFixed(1)} yr
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
            ${path.estimatedCost.toLocaleString()}
          </span>
          <span className="px-2 py-1 bg-brand-100 text-brand-700 text-xs font-medium rounded-lg">
            {path.gcCategory}
          </span>
          {path.hasLottery && (
            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-lg">
              🎲 Lottery
            </span>
          )}
          {path.isSelfPetition && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">
              ✓ Self-file
            </span>
          )}
        </div>

        {/* Progress bar (when tracking and has progress) */}
        {isTracked && (completedCount > 0 || filedCount > 0) && (
          <div className="mb-2">
            <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
              <span>{completedCount}/{trackableStages.length} complete</span>
              {filedCount > 0 && <span>{filedCount} pending</span>}
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-green-500"
                style={{ width: `${(completedCount / trackableStages.length) * 100}%` }}
              />
              <div 
                className="h-full bg-blue-500"
                style={{ width: `${(filedCount / trackableStages.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Track button or tap hint */}
        {!isTracked && !isExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectPath();
            }}
            className="w-full mt-1 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg active:bg-brand-600 transition-colors"
          >
            Track This Path
          </button>
        )}
      </div>

      {/* Expanded Content - Stage list */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-4">
          {/* Stages */}
          <div className="space-y-3">
            {path.stages.map((stage, idx) => {
              const stageProgress = getStageProgress(stage.nodeId);
              const isNextStep = isTracked && idx === currentStageIndex;
              const isCurrentStatus = stage.nodeId === currentNodeId;

              if (stage.isPriorityWait) {
                return (
                  <MobilePDWaitCard
                    key={`${stage.nodeId}-${idx}`}
                    stage={stage}
                    stageProgress={stageProgress}
                    onClick={() => onStageClick(stage.nodeId)}
                    isTracked={isTracked}
                  />
                );
              }

              if (stage.nodeId === "gc") {
                // Final GC marker
                const isGCApproved = stageProgress?.status === "approved";
                return (
                  <div key="gc-final" className="flex items-center gap-3 p-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isGCApproved 
                        ? "bg-green-500" 
                        : "bg-gradient-to-r from-green-400 to-emerald-500"
                    }`}>
                      {isGCApproved ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : (
                        <span className="text-white text-sm">🏆</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-green-700">
                        {isGCApproved ? "✓ Green Card Obtained!" : "Green Card"}
                      </h4>
                      <p className="text-xs text-green-600">
                        {isGCApproved ? "Permanent Resident" : "Permanent Resident - No renewal"}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <MobileStageCard
                  key={`${stage.nodeId}-${idx}`}
                  stage={stage}
                  stageProgress={stageProgress}
                  isCurrentStage={isCurrentStatus}
                  isNextStep={isNextStep}
                  onClick={() => onStageClick(stage.nodeId)}
                  isTracked={isTracked}
                />
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
            {isTracked ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPath(); // This will untrack
                }}
                className="flex-1 py-2.5 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg active:bg-gray-100 transition-colors"
              >
                Stop Tracking
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPath();
                }}
                className="flex-1 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg active:bg-brand-600 transition-colors"
              >
                Track This Path
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MobileTimeline({
  onStageClick,
  filters,
  onMatchingCountChange,
  onSelectPath,
  onPathsGenerated,
  selectedPathId,
  globalProgress,
}: MobileTimelineProps) {
  const [expandedPathId, setExpandedPathId] = useState<string | null>(null);
  const [processingTimesLoaded, setProcessingTimesLoaded] = useState(false);
  const [priorityDates, setPriorityDates] = useState<DynamicData["priorityDates"]>(DEFAULT_PRIORITY_DATES);
  const [datesForFiling, setDatesForFiling] = useState<DynamicData["datesForFiling"]>(DEFAULT_DATES_FOR_FILING);

  // Fetch processing times on mount
  useEffect(() => {
    async function fetchTimes() {
      try {
        const response = await fetch("/api/processing-times");
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const adapted = adaptDynamicData(result.data);
            setProcessingTimes(adapted);
            setPriorityDates(result.data.priorityDates);
            setDatesForFiling(result.data.datesForFiling);
            setProcessingTimesLoaded(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch processing times:", error);
      }
    }
    fetchTimes();
  }, []);

  // Get current status node
  const currentNodeId = statusToNodeId[filters.currentStatus];

  // Generate paths
  const paths = useMemo(() => {
    const generatedPaths = generatePaths(filters, priorityDates, datesForFiling);
    onMatchingCountChange(generatedPaths.length);
    return generatedPaths;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, onMatchingCountChange, processingTimesLoaded, priorityDates, datesForFiling]);

  // Notify parent when paths are regenerated
  useEffect(() => {
    if (paths.length > 0 && onPathsGenerated) {
      onPathsGenerated(paths);
    }
  }, [paths, onPathsGenerated]);

  // Sort paths with tracked path at top
  const sortedPaths = useMemo(() => {
    if (!selectedPathId) return paths;
    
    return [...paths].sort((a, b) => {
      if (a.id === selectedPathId) return -1;
      if (b.id === selectedPathId) return 1;
      return 0;
    });
  }, [paths, selectedPathId]);

  // Analytics tracking
  const lastTrackedFilters = useRef<string>("");
  useEffect(() => {
    if (paths.length > 0) {
      const filterHash = `${filters.education}-${filters.experience}-${filters.countryOfBirth}-${paths.length}`;
      if (filterHash !== lastTrackedFilters.current) {
        lastTrackedFilters.current = filterHash;
        trackPathsGenerated(paths.length, filters);
      }
    }
  }, [paths.length, filters]);

  // Handle path selection
  const handleSelectPath = useCallback((path: ComposedPath) => {
    // Expand the path
    setExpandedPathId(expandedPathId === path.id ? null : path.id);
    // Notify parent to track/untrack
    onSelectPath?.(path);
  }, [expandedPathId, onSelectPath]);

  // Handle stage click with analytics
  const handleStageClick = useCallback((nodeId: string, path: ComposedPath) => {
    const node = getNode(nodeId);
    const nodeName = node?.name || nodeId;
    trackStageClick(nodeId, nodeName);
    
    // If clicking a stage on a non-tracked path, select that path first
    if (selectedPathId !== path.id && onSelectPath) {
      onSelectPath(path);
    }
    
    onStageClick(nodeId);
  }, [onStageClick, selectedPathId, onSelectPath]);

  // Auto-expand tracked path
  useEffect(() => {
    if (selectedPathId) {
      setExpandedPathId(selectedPathId);
    }
  }, [selectedPathId]);

  return (
    <div className="h-full overflow-y-auto bg-gray-50 pb-20">
      {/* Header summary */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Immigration Paths</h2>
            <p className="text-xs text-gray-500">
              {sortedPaths.length} {sortedPaths.length === 1 ? "path" : "paths"} for your profile
            </p>
          </div>
          {selectedPathId && (
            <span className="flex items-center gap-1.5 text-xs text-brand-600 font-semibold bg-brand-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
              Tracking
            </span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-2 bg-white border-b border-gray-100">
        <div className="flex items-center justify-center gap-4 text-[10px]">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full border-2 border-gray-300" />
            <span className="text-gray-500">Not started</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-gray-500">Filed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-500">Approved</span>
          </div>
        </div>
      </div>

      {/* Path cards */}
      <div className="p-4 space-y-4">
        {sortedPaths.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium">No matching paths</p>
            <p className="text-sm mt-1">
              Try adjusting your profile to see available immigration paths.
            </p>
          </div>
        )}
        
        {sortedPaths.map((path) => (
          <MobilePathCard
            key={path.id}
            path={path}
            isTracked={selectedPathId === path.id}
            isExpanded={expandedPathId === path.id}
            onToggleExpand={() => setExpandedPathId(expandedPathId === path.id ? null : path.id)}
            onSelectPath={() => handleSelectPath(path)}
            onStageClick={(nodeId) => handleStageClick(nodeId, path)}
            globalProgress={globalProgress}
            currentNodeId={currentNodeId}
          />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="px-4 pb-6">
        <p className="text-[10px] text-gray-400 text-center">
          Live data from DOL, USCIS, and State Dept. Timelines are estimates. 
          Consult an immigration attorney for your situation.
        </p>
      </div>
    </div>
  );
}
