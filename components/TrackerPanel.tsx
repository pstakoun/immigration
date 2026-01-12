"use client";

import { useState } from "react";
import { ComposedPath, ComposedStage } from "@/lib/path-composer";
import { TrackedPathProgress, StageProgress } from "@/app/page";
import visaData from "@/data/visa-paths.json";

interface TrackerPanelProps {
  path: ComposedPath;
  progress: TrackedPathProgress;
  onUpdateStage: (nodeId: string, update: Partial<StageProgress>) => void;
  onClose: () => void;
}

// Get node info from visa data
function getNode(nodeId: string) {
  return visaData.nodes[nodeId as keyof typeof visaData.nodes];
}

// Format date for display
function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// Calculate time elapsed since a date
function timeElapsed(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${(diffDays / 365).toFixed(1)} years ago`;
  } catch {
    return "";
  }
}

// Stages that can have priority dates
const PRIORITY_DATE_STAGES = ["i140", "perm", "eb2niw", "eb1a", "eb1b", "eb1c"];

// Stage item component
function StageItem({
  stage,
  stageProgress,
  onUpdate,
  isExpanded,
  onToggleExpand,
}: {
  stage: ComposedStage;
  stageProgress: StageProgress;
  onUpdate: (update: Partial<StageProgress>) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
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
      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
    ),
    filed: (
      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
          <path d="M5 12h14" />
        </svg>
      </div>
    ),
    approved: (
      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
    ),
  };

  return (
    <div className="border-b border-gray-100 last:border-0">
      {/* Stage header - always visible */}
      <button
        onClick={onToggleExpand}
        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
          isExpanded ? "bg-gray-50" : ""
        }`}
      >
        {statusIcons[stageProgress.status]}
        
        <div className="flex-1 text-left">
          <div className="font-medium text-gray-900 text-sm">{nodeName}</div>
          {stageProgress.status !== "not_started" && (
            <div className="text-xs text-gray-500">
              {stageProgress.status === "filed" && stageProgress.filedDate && (
                <>Filed {formatDate(stageProgress.filedDate)} ({timeElapsed(stageProgress.filedDate)})</>
              )}
              {stageProgress.status === "approved" && stageProgress.approvedDate && (
                <>Approved {formatDate(stageProgress.approvedDate)}</>
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
          className={`text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
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
                value={stageProgress.filedDate?.split("T")[0] || ""}
                onChange={(e) => onUpdate({ filedDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
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
                value={stageProgress.approvedDate?.split("T")[0] || ""}
                onChange={(e) => onUpdate({ approvedDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
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
                value={stageProgress.priorityDate?.split("T")[0] || ""}
                onChange={(e) => onUpdate({ priorityDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
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
  onClose,
}: TrackerPanelProps) {
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

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

  // Find priority date from approved I-140 or equivalent
  const priorityDate = (() => {
    for (const nodeId of PRIORITY_DATE_STAGES) {
      const stageProgress = progress.stages[nodeId];
      if (stageProgress?.status === "approved" && stageProgress.priorityDate) {
        return stageProgress.priorityDate;
      }
    }
    return null;
  })();

  return (
    <div className="w-[360px] bg-white border-l border-gray-200 flex flex-col overflow-hidden">
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

      {/* Summary bar */}
      <div className="px-4 py-3 border-b border-gray-100 bg-white">
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
        
        {/* Priority date display */}
        {priorityDate && (
          <div className="mt-2 px-2 py-1.5 bg-amber-50 border border-amber-200 rounded text-xs">
            <span className="font-medium text-amber-800">Priority Date:</span>{" "}
            <span className="text-amber-700">{formatDate(priorityDate)}</span>
          </div>
        )}
      </div>

      {/* Stage list */}
      <div className="flex-1 overflow-y-auto">
        {trackableStages.map((stage) => {
          const stageProgress = progress.stages[stage.nodeId] || { status: "not_started" };
          return (
            <StageItem
              key={stage.nodeId}
              stage={stage}
              stageProgress={stageProgress}
              onUpdate={(update) => onUpdateStage(stage.nodeId, update)}
              isExpanded={expandedStage === stage.nodeId}
              onToggleExpand={() => setExpandedStage(
                expandedStage === stage.nodeId ? null : stage.nodeId
              )}
            />
          );
        })}
      </div>

      {/* Footer with tips */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <p className="text-[11px] text-gray-500">
          💡 Enter your filed dates and receipt numbers to see accurate timeline updates.
        </p>
      </div>
    </div>
  );
}
