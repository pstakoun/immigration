"use client";

import { useEffect, useRef } from "react";
import { ComposedPath, ComposedStage } from "@/lib/path-composer";
import { TrackedPathProgress, StageProgress } from "@/app/page";
import visaData from "@/data/visa-paths.json";

interface TrackerPanelProps {
  path: ComposedPath;
  progress: TrackedPathProgress;
  onUpdateStage: (nodeId: string, update: Partial<StageProgress>) => void;
  onUpdatePortedPD: (date: string | null, category: string | null) => void;
  onClose: () => void;
  expandedStageId: string | null;
  onExpandStage: (nodeId: string | null) => void;
}

// Get node info from visa data
function getNode(nodeId: string) {
  return visaData.nodes[nodeId as keyof typeof visaData.nodes];
}

// Format date for display (input is YYYY-MM-DD string)
function formatDateDisplay(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    // Parse as local date (YYYY-MM-DD)
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

// Calculate time elapsed since a date (input is YYYY-MM-DD string)
function timeElapsed(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "in the future";
    if (diffDays === 0) return "today";
    if (diffDays === 1) return "yesterday";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? "s" : ""} ago`;
    }
    const years = (diffDays / 365).toFixed(1);
    return `${years} years ago`;
  } catch {
    return "";
  }
}

// Stages that can establish priority dates
const PRIORITY_DATE_STAGES = ["i140", "perm", "eb2niw", "eb1a", "eb1b", "eb1c"];

// Stage item component
function StageItem({
  stage,
  stageProgress,
  onUpdate,
  isExpanded,
  onToggleExpand,
  stageRef,
}: {
  stage: ComposedStage;
  stageProgress: StageProgress;
  onUpdate: (update: Partial<StageProgress>) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  stageRef: React.RefObject<HTMLDivElement>;
}) {
  const node = getNode(stage.nodeId);
  const nodeName = node?.name || stage.nodeId;
  const canHavePriorityDate = PRIORITY_DATE_STAGES.includes(stage.nodeId);
  
  // Skip the final green card stage - it's implied
  if (stage.nodeId === "gc") return null;
  
  // Skip PD wait stages - they're informational
  if (stage.isPriorityWait) return null;

  const statusColors = {
    not_started: "bg-gray-100 text-gray-600 border-gray-200",
    filed: "bg-blue-100 text-blue-700 border-blue-200",
    approved: "bg-green-100 text-green-700 border-green-200",
  };

  const statusIcons = {
    not_started: (
      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
    ),
    filed: (
      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
          <path d="M5 12h14" />
        </svg>
      </div>
    ),
    approved: (
      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
    ),
  };

  return (
    <div 
      ref={stageRef}
      className={`border-b border-gray-100 last:border-0 ${isExpanded ? "bg-brand-50/30" : ""}`}
      id={`stage-${stage.nodeId}`}
    >
      {/* Stage header - always visible */}
      <button
        onClick={onToggleExpand}
        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
          isExpanded ? "bg-gray-50" : ""
        }`}
      >
        {statusIcons[stageProgress.status]}
        
        <div className="flex-1 text-left min-w-0">
          <div className="font-medium text-gray-900 text-sm">{nodeName}</div>
          {stageProgress.status !== "not_started" && (
            <div className="text-xs text-gray-500 truncate">
              {stageProgress.status === "filed" && stageProgress.filedDate && (
                <>Filed {formatDateDisplay(stageProgress.filedDate)} ({timeElapsed(stageProgress.filedDate)})</>
              )}
              {stageProgress.status === "approved" && stageProgress.approvedDate && (
                <>Approved {formatDateDisplay(stageProgress.approvedDate)}</>
              )}
              {stageProgress.receiptNumber && (
                <span className="ml-2 font-mono text-gray-600">{stageProgress.receiptNumber}</span>
              )}
            </div>
          )}
        </div>

        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 bg-gray-50">
          {/* Status selector */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
            <div className="flex gap-2">
              {(["not_started", "filed", "approved"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdate({ status })}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    stageProgress.status === status
                      ? statusColors[status]
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {status === "not_started" ? "Not Started" : status === "filed" ? "Filed" : "Approved"}
                </button>
              ))}
            </div>
          </div>

          {/* Filed date */}
          {(stageProgress.status === "filed" || stageProgress.status === "approved") && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Filed Date</label>
              <input
                type="date"
                value={stageProgress.filedDate || ""}
                onChange={(e) => onUpdate({ filedDate: e.target.value || undefined })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          )}

          {/* Approved date */}
          {stageProgress.status === "approved" && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Approved Date</label>
              <input
                type="date"
                value={stageProgress.approvedDate || ""}
                onChange={(e) => onUpdate({ approvedDate: e.target.value || undefined })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          )}

          {/* Receipt number */}
          {(stageProgress.status === "filed" || stageProgress.status === "approved") && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Receipt Number
                <span className="text-gray-400 font-normal ml-1">(e.g., EAC2490012345)</span>
              </label>
              <input
                type="text"
                value={stageProgress.receiptNumber || ""}
                onChange={(e) => onUpdate({ receiptNumber: e.target.value || undefined })}
                placeholder="Enter receipt number"
                className="w-full px-3 py-2 text-sm font-mono border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          )}

          {/* Priority date (for I-140, PERM, etc.) */}
          {canHavePriorityDate && stageProgress.status === "approved" && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Priority Date
                <span className="text-gray-400 font-normal ml-1">(from approval notice)</span>
              </label>
              <input
                type="date"
                value={stageProgress.priorityDate || ""}
                onChange={(e) => onUpdate({ priorityDate: e.target.value || undefined })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                This establishes when you entered the queue for a green card.
              </p>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Notes</label>
            <textarea
              value={stageProgress.notes || ""}
              onChange={(e) => onUpdate({ notes: e.target.value || undefined })}
              placeholder="Any additional notes..."
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackerPanel({
  path,
  progress,
  onUpdateStage,
  onUpdatePortedPD,
  onClose,
  expandedStageId,
  onExpandStage,
}: TrackerPanelProps) {
  const stageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to expanded stage when it changes
  useEffect(() => {
    if (expandedStageId && stageRefs.current[expandedStageId] && scrollContainerRef.current) {
      const element = stageRefs.current[expandedStageId];
      if (element) {
        // Small delay to allow expansion animation
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 50);
      }
    }
  }, [expandedStageId]);

  // Filter out PD wait and GC stages
  const trackableStages = path.stages.filter(
    (s) => !s.isPriorityWait && s.nodeId !== "gc"
  );

  // Calculate summary
  const stageSummary = trackableStages.reduce(
    (acc, stage) => {
      const stageProgress = progress.stages[stage.nodeId] || { status: "not_started" };
      if (stageProgress.status === "approved") acc.approved++;
      else if (stageProgress.status === "filed") acc.filed++;
      else acc.notStarted++;
      return acc;
    },
    { notStarted: 0, filed: 0, approved: 0 }
  );

  // Find priority date from current path's approved I-140 or equivalent
  const currentPathPD = (() => {
    for (const nodeId of PRIORITY_DATE_STAGES) {
      const stageProgress = progress.stages[nodeId];
      if (stageProgress?.status === "approved" && stageProgress.priorityDate) {
        return { date: stageProgress.priorityDate, source: getNode(nodeId)?.name || nodeId };
      }
    }
    return null;
  })();

  // Effective priority date (ported takes precedence if earlier, otherwise current)
  const effectivePD = (() => {
    if (progress.portedPriorityDate && currentPathPD?.date) {
      // Use the earlier one
      return progress.portedPriorityDate < currentPathPD.date 
        ? { date: progress.portedPriorityDate, source: "Ported from previous case" }
        : currentPathPD;
    }
    if (progress.portedPriorityDate) {
      return { date: progress.portedPriorityDate, source: "Ported from previous case" };
    }
    return currentPathPD;
  })();

  return (
    <div className="w-[380px] bg-white border-l border-gray-200 flex flex-col overflow-hidden flex-shrink-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div>
          <h2 className="font-semibold text-gray-900">Track Progress</h2>
          <p className="text-xs text-gray-500">{path.name}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Priority Date Section */}
      <div className="px-4 py-3 border-b border-gray-200 bg-amber-50/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Priority Date</h3>
          {effectivePD && (
            <span className="text-xs text-amber-700 font-medium">
              {formatDateDisplay(effectivePD.date)}
            </span>
          )}
        </div>
        
        {effectivePD ? (
          <div className="text-xs text-gray-600">
            <span className="text-amber-800 font-medium">{effectivePD.source}</span>
            {effectivePD.date && (
              <span className="text-gray-500 ml-1">({timeElapsed(effectivePD.date)})</span>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-500">
            No priority date yet. It will be established when your I-140 (or equivalent) is approved.
          </p>
        )}

        {/* Ported PD input */}
        <details className="mt-2">
          <summary className="text-xs text-brand-600 cursor-pointer hover:text-brand-700">
            {progress.portedPriorityDate ? "Edit ported priority date" : "Have a PD from a previous case?"}
          </summary>
          <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200 space-y-2">
            <p className="text-[10px] text-gray-500">
              If you have an approved I-140 from a previous employer, you can port that priority date to your new case.
            </p>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Ported Priority Date</label>
              <input
                type="date"
                value={progress.portedPriorityDate || ""}
                onChange={(e) => onUpdatePortedPD(e.target.value || null, progress.portedPriorityDateCategory || null)}
                className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select
                value={progress.portedPriorityDateCategory || ""}
                onChange={(e) => onUpdatePortedPD(progress.portedPriorityDate || null, e.target.value || null)}
                className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="">Select category</option>
                <option value="eb1">EB-1</option>
                <option value="eb2">EB-2</option>
                <option value="eb3">EB-3</option>
              </select>
            </div>
            {progress.portedPriorityDate && (
              <button
                onClick={() => onUpdatePortedPD(null, null)}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Remove ported PD
              </button>
            )}
          </div>
        </details>
      </div>

      {/* Summary bar */}
      <div className="px-4 py-2 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-600">{stageSummary.approved} approved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-gray-600">{stageSummary.filed} filed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full border-2 border-gray-300" />
            <span className="text-gray-600">{stageSummary.notStarted} pending</span>
          </div>
        </div>
      </div>

      {/* Stage list */}
      <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
        {trackableStages.map((stage) => {
          const stageProgress = progress.stages[stage.nodeId] || { status: "not_started" };
          return (
            <StageItem
              key={stage.nodeId}
              stage={stage}
              stageProgress={stageProgress}
              onUpdate={(update) => onUpdateStage(stage.nodeId, update)}
              isExpanded={expandedStageId === stage.nodeId}
              onToggleExpand={() => onExpandStage(
                expandedStageId === stage.nodeId ? null : stage.nodeId
              )}
              stageRef={{ current: null } as React.RefObject<HTMLDivElement>}
            />
          );
        })}
      </div>

      {/* Footer with tips */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <p className="text-[11px] text-gray-500">
          💡 Click stages in the timeline to jump here. Enter dates to update your timeline.
        </p>
      </div>
    </div>
  );
}
