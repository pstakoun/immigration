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
  onOpenChecklist?: () => void; // Open the TrackerPanel
}

const categoryColors: Record<string, { bg: string; border: string; text: string; light: string }> = {
  entry: { bg: "bg-brand-600", border: "border-brand-700", text: "text-white", light: "bg-brand-50" },
  work: { bg: "bg-emerald-500", border: "border-emerald-600", text: "text-white", light: "bg-emerald-50" },
  greencard: { bg: "bg-amber-500", border: "border-amber-600", text: "text-white", light: "bg-amber-50" },
  citizenship: { bg: "bg-purple-500", border: "border-purple-600", text: "text-white", light: "bg-purple-50" },
};

// Format date for display (input is YYYY-MM-DD string)
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

// Get node info from visa data
function getNode(nodeId: string) {
  return visaData.nodes[nodeId as keyof typeof visaData.nodes];
}

// Parse YYYY-MM-DD to Date
function parseDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  if (isNaN(year) || isNaN(month)) return null;
  return new Date(year, month - 1, day || 1);
}

// Calculate months between two dates
function monthsBetween(date1: Date, date2: Date): number {
  return Math.max(0, (date2.getFullYear() - date1.getFullYear()) * 12 +
    (date2.getMonth() - date1.getMonth()));
}

// Calculate progress percentage for a filed stage
function getFiledProgress(filedDate: string | undefined, durationMonths: number): number {
  if (!filedDate) return 0;
  const filed = parseDate(filedDate);
  if (!filed) return 0;
  const now = new Date();
  const elapsed = monthsBetween(filed, now);
  return Math.min(100, Math.max(0, (elapsed / durationMonths) * 100));
}

// Mobile Stage Item Component
function MobileStageItem({
  stage,
  stageProgress,
  isExpanded,
  onToggle,
  isCurrentStage,
  isTracked,
  onStageClick,
}: {
  stage: ComposedStage;
  stageProgress: StageProgress | null;
  isExpanded: boolean;
  onToggle: () => void;
  isCurrentStage: boolean;
  isTracked: boolean;
  onStageClick: () => void;
}) {
  const node = getNode(stage.nodeId);
  if (!node) return null;
  
  // Skip the final green card stage - render as special marker
  if (stage.nodeId === "gc") {
    const isApproved = stageProgress?.status === "approved";
    return (
      <div className="flex items-center gap-3 py-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isApproved ? "bg-green-600" : "bg-green-500"
        }`}>
          {isApproved ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <div className="font-bold text-green-700 text-base">Green Card</div>
          <div className="text-xs text-green-600">
            {isApproved ? "Permanent Resident! 🎉" : "Permanent Resident status"}
          </div>
        </div>
      </div>
    );
  }

  const isApproved = stageProgress?.status === "approved";
  const isFiled = stageProgress?.status === "filed";
  const hasProgress = isApproved || isFiled;
  const colors = categoryColors[node.category] || categoryColors.work;
  
  // Calculate progress for filed stages
  const durationMonths = (stage.durationYears?.max || 0.5) * 12;
  const progressPercent = isFiled && !isApproved 
    ? getFiledProgress(stageProgress?.filedDate, durationMonths)
    : 0;

  // Special rendering for priority date wait stages
  if (stage.isPriorityWait) {
    return (
      <div className="py-2">
        <div 
          className={`rounded-xl border-2 transition-all ${
            isApproved 
              ? "bg-gray-100 border-gray-300" 
              : "bg-orange-50 border-orange-300"
          }`}
          onClick={onStageClick}
        >
          <div className="px-4 py-3 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              isApproved ? "bg-gray-400" : "bg-orange-500"
            }`}>
              {isApproved ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-semibold ${isApproved ? "text-gray-500 line-through" : "text-orange-800"}`}>
                Priority Date Wait
              </div>
              <div className={`text-sm ${isApproved ? "text-gray-400" : "text-orange-600"}`}>
                {stage.durationYears.display}
              </div>
            </div>
            {isTracked && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-400">
                <path d="M9 18l6-6-6-6" />
              </svg>
            )}
          </div>
          {/* Velocity info */}
          {stage.velocityInfo && !isApproved && (
            <div className="px-4 pb-3 text-xs text-orange-700">
              {stage.velocityInfo.explanation}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div 
        className={`rounded-xl border-2 transition-all overflow-hidden ${
          isApproved 
            ? "bg-green-50 border-green-300"
            : isFiled
            ? "bg-blue-50 border-blue-300"
            : isCurrentStage
            ? `${colors.light} border-brand-400 ring-2 ring-brand-300`
            : `${colors.light} border-gray-200`
        }`}
        onClick={isTracked ? onStageClick : onToggle}
      >
        {/* Current stage indicator */}
        {isCurrentStage && !hasProgress && (
          <div className="bg-brand-500 text-white text-[10px] font-bold px-3 py-1 text-center">
            → NEXT STEP
          </div>
        )}
        
        {/* Progress bar for filed stages */}
        {isFiled && !isApproved && progressPercent > 0 && (
          <div className="h-1 bg-blue-100">
            <div 
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        <div className="px-4 py-3 flex items-center gap-3">
          {/* Status indicator */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isApproved 
              ? "bg-green-500"
              : isFiled
              ? "bg-blue-500"
              : colors.bg
          }`}>
            {isApproved ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : isFiled ? (
              <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
            ) : (
              <span className="text-white text-xs font-bold">
                {stage.track === "status" ? "S" : "GC"}
              </span>
            )}
          </div>

          {/* Stage info */}
          <div className="flex-1 min-w-0">
            <div className={`font-semibold ${isApproved ? "text-green-700" : isFiled ? "text-blue-700" : "text-gray-900"}`}>
              {node.name}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {isApproved && stageProgress?.approvedDate ? (
                <span className="text-xs text-green-600">
                  ✓ Done {formatDateShort(stageProgress.approvedDate)}
                </span>
              ) : isFiled && stageProgress?.filedDate ? (
                <span className="text-xs text-blue-600">
                  Filed {formatDateShort(stageProgress.filedDate)} • {Math.round(progressPercent)}%
                </span>
              ) : (
                <span className="text-xs text-gray-500">{stage.durationYears.display}</span>
              )}
              {stageProgress?.receiptNumber && (
                <span className="text-[10px] font-mono text-gray-400">
                  {stageProgress.receiptNumber}
                </span>
              )}
            </div>
          </div>

          {/* Expand/Edit indicator */}
          <div className="flex-shrink-0">
            {isTracked ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                <path d="M9 18l6-6-6-6" />
              </svg>
            ) : (
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                className={`text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            )}
          </div>
        </div>

        {/* Expanded details (only when not tracking) */}
        {isExpanded && !isTracked && (
          <div className="px-4 pb-4 pt-1 border-t border-gray-200 bg-white/50">
            <p className="text-sm text-gray-600 mb-2">{node.description}</p>
            {stage.note && (
              <p className="text-xs text-gray-500 italic">{stage.note}</p>
            )}
            {"filings" in node && (node.filings as Array<{form: string; name: string; fee: number | string}>)?.length > 0 && (
              <div className="mt-2 space-y-1">
                {(node.filings as Array<{form: string; name: string; fee: number | string}>).slice(0, 2).map((filing, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="font-mono text-brand-700">{filing.form}</span>
                    <span className="text-gray-600">
                      {typeof filing.fee === "number" && filing.fee > 0 
                        ? `$${filing.fee.toLocaleString()}` 
                        : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Mini Timeline Component - Birds-eye view of the path
function MiniTimeline({
  stages,
  globalProgress,
  totalYears,
}: {
  stages: ComposedStage[];
  globalProgress: GlobalProgress | null | undefined;
  totalYears: number;
}) {
  // Filter out the final GC marker for the bars
  const visibleStages = stages.filter(s => s.nodeId !== "gc");
  const gcMarker = stages.find(s => s.nodeId === "gc");
  const gcApproved = gcMarker && globalProgress?.stages["gc"]?.status === "approved";
  
  // Group stages by track
  const statusStages = visibleStages.filter(s => s.track === "status");
  const gcStages = visibleStages.filter(s => s.track === "gc");
  const hasMultipleTracks = statusStages.length > 0 && gcStages.length > 0;
  
  // Calculate total duration for scaling (add a bit for the GC marker)
  const maxYear = (totalYears || Math.max(...visibleStages.map(s => s.startYear + s.durationYears.max), 1)) * 1.05;
  
  // Get color for a stage based on its state and type
  const getStageColor = (stage: ComposedStage): string => {
    const progress = globalProgress?.stages[stage.nodeId];
    
    if (progress?.status === "approved") {
      return "bg-green-500";
    }
    if (progress?.status === "filed") {
      return "bg-blue-500";
    }
    if (stage.isPriorityWait) {
      return "bg-orange-400";
    }
    if (stage.track === "status") {
      return "bg-emerald-400";
    }
    return "bg-amber-400";
  };
  
  // Get border color for stage (darker version)
  const getStageBorder = (stage: ComposedStage): string => {
    const progress = globalProgress?.stages[stage.nodeId];
    
    if (progress?.status === "approved") {
      return "border-green-600";
    }
    if (progress?.status === "filed") {
      return "border-blue-600";
    }
    if (stage.isPriorityWait) {
      return "border-orange-500";
    }
    if (stage.track === "status") {
      return "border-emerald-500";
    }
    return "border-amber-500";
  };
  
  // Render a track of stages
  const renderTrack = (trackStages: ComposedStage[], isTop: boolean) => {
    if (trackStages.length === 0) return null;
    
    return (
      <div className={`relative h-2.5 bg-gray-100 rounded-sm overflow-visible ${isTop ? "" : ""}`}>
        {trackStages.map((stage, idx) => {
          const left = (stage.startYear / maxYear) * 100;
          const width = Math.max(3, (stage.durationYears.max / maxYear) * 100);
          const color = getStageColor(stage);
          const border = getStageBorder(stage);
          
          return (
            <div
              key={`${stage.nodeId}-${idx}`}
              className={`absolute h-full rounded-sm ${color} border ${border} ${
                stage.isConcurrent ? "opacity-80 z-10" : ""
              }`}
              style={{
                left: `${Math.min(left, 97)}%`,
                width: `${Math.min(width, 100 - left)}%`,
                // Offset concurrent stages
                ...(stage.isConcurrent ? { 
                  marginTop: "2px",
                  height: "8px",
                  zIndex: 5,
                } : {}),
              }}
            />
          );
        })}
      </div>
    );
  };
  
  // Render GC marker at the end
  const renderGCMarker = () => (
    <div 
      className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center ${
        gcApproved ? "bg-green-500" : "bg-green-400"
      } border-2 ${gcApproved ? "border-green-600" : "border-green-500"} shadow-sm`}
    >
      {gcApproved ? (
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
        </svg>
      )}
    </div>
  );
  
  // If only one track, render all stages in a single bar
  if (!hasMultipleTracks) {
    return (
      <div className="mt-3 relative pr-5">
        {renderTrack(visibleStages, true)}
        {renderGCMarker()}
      </div>
    );
  }
  
  // Two tracks: status on top, GC on bottom
  return (
    <div className="mt-3 relative pr-5">
      <div className="space-y-0.5">
        {renderTrack(statusStages, true)}
        {renderTrack(gcStages, false)}
      </div>
      {renderGCMarker()}
    </div>
  );
}

// Mobile Path Card Component
function MobilePathCard({
  path,
  isSelected,
  isTracked,
  onToggleExpand,
  onTrack,
  onStageClick,
  globalProgress,
}: {
  path: ComposedPath;
  isSelected: boolean;
  isTracked: boolean;
  onToggleExpand: () => void;
  onTrack: () => void;
  onStageClick: (nodeId: string) => void;
  globalProgress: GlobalProgress | null | undefined;
}) {
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  
  // Helper to get stage progress
  const getStageProgress = (nodeId: string): StageProgress | null => {
    return globalProgress?.stages[nodeId] || null;
  };

  // Calculate progress summary for this path
  const progressSummary = useMemo(() => {
    if (!globalProgress) return { total: 0, filed: 0, approved: 0 };
    
    let total = 0;
    let filed = 0;
    let approved = 0;
    
    for (const stage of path.stages) {
      if (stage.isPriorityWait || stage.nodeId === "gc") continue;
      total++;
      const sp = globalProgress.stages[stage.nodeId];
      if (sp?.status === "filed") filed++;
      if (sp?.status === "approved") approved++;
    }
    
    return { total, filed, approved };
  }, [path.stages, globalProgress]);

  // Find current stage (first non-approved)
  const currentStageIdx = useMemo(() => {
    return path.stages.findIndex(s => {
      if (s.isPriorityWait || s.nodeId === "gc") return false;
      const sp = globalProgress?.stages[s.nodeId] || null;
      return !sp || sp.status !== "approved";
    });
  }, [path.stages, globalProgress]);

  // Filter out stages we want to show
  const visibleStages = path.stages.filter(s => s.nodeId !== "gc" || isSelected);

  return (
    <div 
      className={`rounded-2xl border-2 transition-all overflow-hidden ${
        isTracked 
          ? "border-brand-500 bg-white shadow-lg shadow-brand-100" 
          : isSelected
          ? "border-gray-300 bg-white shadow-md"
          : "border-gray-200 bg-white"
      }`}
    >
      {/* Path header */}
      <div 
        className={`px-4 py-3 ${isTracked ? "bg-brand-50" : "bg-gray-50"} cursor-pointer`}
        onClick={onToggleExpand}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {isTracked && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
                  TRACKING
                </span>
              )}
              <span className="text-[10px] font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                {path.gcCategory}
              </span>
              {path.hasLottery && (
                <span className="text-[10px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  lottery
                </span>
              )}
              {path.isSelfPetition && (
                <span className="text-[10px] font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  self-file
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">{path.name}</h3>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-gray-900">{path.totalYears.display}</div>
            <div className="text-xs text-gray-500">${path.estimatedCost.toLocaleString()}</div>
          </div>
        </div>

        {/* Mini Timeline - Visual representation of the path */}
        <MiniTimeline
          stages={path.stages}
          globalProgress={globalProgress}
          totalYears={path.totalYears.max}
        />

        {/* Progress bar (if tracking or has progress) */}
        {globalProgress && progressSummary.total > 0 && (progressSummary.approved > 0 || progressSummary.filed > 0) && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">
                {progressSummary.approved}/{progressSummary.total} complete
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-green-500 transition-all"
                style={{ width: `${(progressSummary.approved / progressSummary.total) * 100}%` }}
              />
              <div 
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${(progressSummary.filed / progressSummary.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Expand/Collapse indicator */}
        <div className="flex items-center justify-center mt-2">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className={`text-gray-400 transition-transform ${isSelected ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Expanded stages */}
      {isSelected && (
        <div className="px-4 py-2 border-t border-gray-100">
          {/* Track labels */}
          <div className="flex items-center gap-4 mb-2 text-[10px]">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-gray-600">Work Status</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-amber-500" />
              <span className="text-gray-600">GC Process</span>
            </div>
          </div>

          {/* Timeline connector */}
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
            
            {visibleStages.map((stage, idx) => (
              <MobileStageItem
                key={`${stage.nodeId}-${idx}`}
                stage={stage}
                stageProgress={getStageProgress(stage.nodeId)}
                isExpanded={expandedStage === `${stage.nodeId}-${idx}`}
                onToggle={() => setExpandedStage(
                  expandedStage === `${stage.nodeId}-${idx}` ? null : `${stage.nodeId}-${idx}`
                )}
                isCurrentStage={idx === currentStageIdx}
                isTracked={isTracked}
                onStageClick={() => onStageClick(stage.nodeId)}
              />
            ))}
          </div>

          {/* Track/Select button */}
          {!isTracked ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTrack();
              }}
              className="w-full mt-2 py-2.5 bg-brand-500 text-white font-semibold rounded-xl active:bg-brand-600 transition-colors"
            >
              Track This Path
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTrack(); // Re-opens the TrackerPanel
              }}
              className="w-full mt-2 py-2.5 bg-brand-600 text-white font-semibold rounded-xl active:bg-brand-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Progress
            </button>
          )}
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
  onOpenChecklist,
}: MobileTimelineProps) {
  const [expandedPathId, setExpandedPathId] = useState<string | null>(null);
  const [processingTimesLoaded, setProcessingTimesLoaded] = useState(false);
  const [priorityDates, setPriorityDates] = useState<DynamicData["priorityDates"]>(DEFAULT_PRIORITY_DATES);
  const [datesForFiling, setDatesForFiling] = useState<DynamicData["datesForFiling"]>(DEFAULT_DATES_FOR_FILING);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  // Generate paths dynamically
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

  // Track paths generated for analytics
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

  // Handle path expand/collapse (header tap)
  const handleToggleExpand = useCallback((path: ComposedPath) => {
    // Simply toggle expansion - tracking is done via the "Track This Path" button
    if (expandedPathId === path.id) {
      setExpandedPathId(null);
    } else {
      setExpandedPathId(path.id);
    }
  }, [expandedPathId]);

  // Handle explicit track button click
  const handleTrackPath = useCallback((path: ComposedPath) => {
    onSelectPath?.(path);
  }, [onSelectPath]);

  // Handle stage click
  const handleStageClick = useCallback((nodeId: string, path: ComposedPath) => {
    const node = getNode(nodeId);
    const nodeName = node?.name || nodeId;
    trackStageClick(nodeId, nodeName);
    
    // If this path isn't currently tracked, start tracking it
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
    <div className="h-full overflow-y-auto bg-gray-50" ref={scrollRef}>
      <div className="p-4 pb-20 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {sortedPaths.length} Path{sortedPaths.length !== 1 ? "s" : ""} Found
          </h2>
          {selectedPathId && (
            <span className="text-xs font-medium text-brand-700 bg-brand-100 px-2 py-1 rounded-full">
              Tracking active
            </span>
          )}
        </div>

        {/* Instructions */}
        {!selectedPathId && (
          <div className="bg-brand-50 border border-brand-200 rounded-xl p-3 text-sm text-brand-800">
            <strong>Tap a path</strong> to see details, then tap <strong>&ldquo;Track This Path&rdquo;</strong> to monitor your progress.
          </div>
        )}

        {/* Empty state */}
        {sortedPaths.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-gray-400 mb-2">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-600">No matching paths</p>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your profile to see available immigration paths.
            </p>
          </div>
        )}

        {/* Path cards */}
        {sortedPaths.map((path) => (
          <MobilePathCard
            key={path.id}
            path={path}
            isSelected={expandedPathId === path.id}
            isTracked={selectedPathId === path.id}
            onToggleExpand={() => handleToggleExpand(path)}
            onTrack={() => handleTrackPath(path)}
            onStageClick={(nodeId) => handleStageClick(nodeId, path)}
            globalProgress={globalProgress}
          />
        ))}

        {/* Legend */}
        {sortedPaths.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-3 justify-center mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <span className="text-xs text-gray-600">Approved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-blue-500" />
                <span className="text-xs text-gray-600">Filed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-orange-500" />
                <span className="text-xs text-gray-600">PD Wait</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 text-center">
              Live data from DOL, USCIS, and State Dept. Consult an immigration attorney for your situation.
            </p>
          </div>
        )}
      </div>

      {/* Floating Action Button - Open Checklist when tracking */}
      {selectedPathId && onOpenChecklist && (
        <button
          onClick={onOpenChecklist}
          className="fixed bottom-6 right-4 bg-brand-500 text-white px-4 py-3 rounded-full shadow-lg shadow-brand-500/30 flex items-center gap-2 active:bg-brand-600 transition-all z-30"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <span className="font-semibold text-sm">Checklist</span>
        </button>
      )}
    </div>
  );
}
