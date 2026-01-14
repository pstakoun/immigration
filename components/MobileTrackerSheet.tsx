"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { ComposedPath, ComposedStage } from "@/lib/path-composer";
import { GlobalProgress, StageProgress } from "@/app/page";
import visaData from "@/data/visa-paths.json";
import { 
  canEstablishPriorityDate, 
  PRIORITY_DATE_STAGES,
  isStatusVisa,
  STATUS_VISA_VALIDITY_MONTHS,
  STATUS_VISA_PROCESSING_MONTHS,
} from "@/lib/constants";

interface MobileTrackerSheetProps {
  path: ComposedPath;
  progress: GlobalProgress;
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

// Parse YYYY-MM-DD to Date
function parseDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  } catch {
    return null;
  }
}

// Format date for display
function formatDateDisplay(dateStr?: string): string {
  if (!dateStr) return "";
  const date = parseDate(dateStr);
  if (!date) return dateStr;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Calculate time elapsed since a date
function timeElapsed(dateStr?: string): string {
  const date = parseDate(dateStr);
  if (!date) return "";
  
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
}

// Calculate months between two dates
function monthsBetween(date1: Date, date2: Date): number {
  return (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24 * 30);
}

// Format months for display
function formatMonthsRemaining(months: number): string {
  if (months <= 0) return "any day now";
  if (months < 1) return "< 1 month";
  if (months < 12) return `~${Math.round(months)} month${Math.round(months) !== 1 ? "s" : ""}`;
  const years = months / 12;
  if (years < 2) return `~${Math.round(months)} months`;
  return `~${years.toFixed(1)} years`;
}

// Stage Editor Component
function StageEditor({
  stage,
  stageProgress,
  onUpdate,
  onClose,
}: {
  stage: ComposedStage;
  stageProgress: StageProgress;
  onUpdate: (update: Partial<StageProgress>) => void;
  onClose: () => void;
}) {
  const node = getNode(stage.nodeId);
  const nodeName = node?.name || stage.nodeId;
  const canHavePriorityDateVal = canEstablishPriorityDate(stage.nodeId);
  const stageMaxMonths = (stage.durationYears?.max || 0) * 12;

  // Calculate remaining time for filed stages
  const remainingTime = useMemo(() => {
    if (stageProgress.status !== "filed" || !stageProgress.filedDate) return null;
    
    const filedDate = parseDate(stageProgress.filedDate);
    if (!filedDate) return null;
    
    const now = new Date();
    const monthsElapsed = monthsBetween(filedDate, now);
    
    if (isStatusVisa(stage.nodeId)) {
      const processingMonths = STATUS_VISA_PROCESSING_MONTHS[stage.nodeId] || 3;
      const remaining = Math.max(0, processingMonths - monthsElapsed);
      return {
        elapsed: monthsElapsed,
        remaining,
        typical: { min: processingMonths * 0.5, max: processingMonths * 1.5 },
      };
    }
    
    if (stageMaxMonths === 0) return null;
    
    const remaining = Math.max(0, stageMaxMonths - monthsElapsed);
    
    return {
      elapsed: monthsElapsed,
      remaining,
      typical: { min: stageMaxMonths * 0.7, max: stageMaxMonths },
    };
  }, [stageProgress.status, stageProgress.filedDate, stage.nodeId, stageMaxMonths]);

  const statusColors = {
    not_started: "bg-gray-100 text-gray-700 border-gray-300",
    filed: "bg-blue-100 text-blue-700 border-blue-300",
    approved: "bg-green-100 text-green-700 border-green-300",
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{nodeName}</h3>
          {stage.durationYears && (
            <p className="text-sm text-gray-500 mt-0.5">
              Typical duration: {stage.durationYears.display}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 -m-2 text-gray-400 hover:text-gray-600"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Status buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <div className="grid grid-cols-3 gap-2">
          {(["not_started", "filed", "approved"] as const).map((status) => (
            <button
              key={status}
              onClick={() => onUpdate({ status })}
              className={`py-3 px-2 text-sm font-medium rounded-xl border-2 transition-all ${
                stageProgress.status === status
                  ? statusColors[status]
                  : "bg-white text-gray-500 border-gray-200"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Filed Date</label>
          <input
            type="date"
            value={stageProgress.filedDate || ""}
            onChange={(e) => onUpdate({ filedDate: e.target.value || undefined })}
            className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
          {remainingTime && stageProgress.status === "filed" && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-medium">{Math.round(remainingTime.elapsed)} months</span> elapsed
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Est. {formatMonthsRemaining(remainingTime.remaining)} remaining
              </p>
            </div>
          )}
        </div>
      )}

      {/* Approved date */}
      {stageProgress.status === "approved" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Approved Date</label>
          <input
            type="date"
            value={stageProgress.approvedDate || ""}
            onChange={(e) => onUpdate({ approvedDate: e.target.value || undefined })}
            className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
      )}

      {/* Receipt number */}
      {(stageProgress.status === "filed" || stageProgress.status === "approved") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Receipt Number
            <span className="text-gray-400 font-normal ml-1 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            value={stageProgress.receiptNumber || ""}
            onChange={(e) => onUpdate({ receiptNumber: e.target.value || undefined })}
            placeholder="e.g., EAC2490012345"
            className="w-full px-4 py-3 text-base font-mono border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
      )}

      {/* Priority date for I-140, PERM, etc. */}
      {canHavePriorityDateVal && stageProgress.status === "approved" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority Date
            <span className="text-gray-400 font-normal ml-1 text-xs">(from approval notice)</span>
          </label>
          <input
            type="date"
            value={stageProgress.priorityDate || ""}
            onChange={(e) => onUpdate({ priorityDate: e.target.value || undefined })}
            className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
          <p className="text-xs text-gray-500 mt-2">
            This establishes when you entered the queue for a green card.
          </p>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
        <textarea
          value={stageProgress.notes || ""}
          onChange={(e) => onUpdate({ notes: e.target.value || undefined })}
          placeholder="Any additional notes..."
          rows={3}
          className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
        />
      </div>
    </div>
  );
}

export default function MobileTrackerSheet({
  path,
  progress,
  onUpdateStage,
  onUpdatePortedPD,
  onClose,
  expandedStageId,
  onExpandStage,
}: MobileTrackerSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [showPortedPD, setShowPortedPD] = useState(false);

  // Find the stage being edited
  const editingStage = useMemo(() => {
    if (!expandedStageId) return null;
    return path.stages.find(s => s.nodeId === expandedStageId) || null;
  }, [expandedStageId, path.stages]);

  // Get progress for the editing stage
  const editingStageProgress = useMemo(() => {
    if (!expandedStageId) return { status: "not_started" as const };
    return progress.stages[expandedStageId] || { status: "not_started" as const };
  }, [expandedStageId, progress.stages]);

  // Filter trackable stages
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

  // Find effective priority date
  const effectivePD = useMemo(() => {
    let currentPathPD: { date: string; source: string } | null = null;
    
    for (const nodeId of Array.from(PRIORITY_DATE_STAGES)) {
      const stageProgress = progress.stages[nodeId];
      if (stageProgress?.status === "approved" && stageProgress.priorityDate) {
        currentPathPD = { date: stageProgress.priorityDate, source: getNode(nodeId)?.name || nodeId };
        break;
      }
    }

    if (progress.portedPriorityDate && currentPathPD?.date) {
      return progress.portedPriorityDate < currentPathPD.date 
        ? { date: progress.portedPriorityDate, source: "Ported from previous case" }
        : currentPathPD;
    }
    if (progress.portedPriorityDate) {
      return { date: progress.portedPriorityDate, source: "Ported from previous case" };
    }
    return currentPathPD;
  }, [progress.portedPriorityDate, progress.stages]);

  // Estimated completion
  const estimatedCompletion = useMemo(() => {
    const now = new Date();
    const gcStages = path.stages.filter(s => s.track === "gc" && s.nodeId !== "gc" && !s.isPriorityWait);
    
    let remainingMonths = 0;
    
    for (const stage of gcStages) {
      const sp = progress.stages[stage.nodeId] || { status: "not_started" };
      const stageMaxMonths = (stage.durationYears?.max || 0) * 12;
      
      if (sp.status === "approved") continue;
      
      if (sp.status === "filed" && sp.filedDate) {
        const filedDate = parseDate(sp.filedDate);
        if (filedDate) {
          const elapsedMonths = monthsBetween(filedDate, now);
          remainingMonths += Math.max(0, stageMaxMonths - elapsedMonths);
        }
      } else {
        remainingMonths += stageMaxMonths;
      }
    }
    
    // Add PD wait time
    const pdWaitStage = path.stages.find(s => s.isPriorityWait);
    if (pdWaitStage) {
      remainingMonths += (pdWaitStage.durationYears?.max || 0) * 12;
    }
    
    const estimatedDate = new Date(now);
    estimatedDate.setMonth(estimatedDate.getMonth() + Math.round(remainingMonths));

    return {
      date: estimatedDate,
      months: remainingMonths,
      hasUncertainty: !!pdWaitStage,
    };
  }, [path.stages, progress.stages]);

  // Handle update
  const handleUpdateStage = (update: Partial<StageProgress>) => {
    if (expandedStageId) {
      onUpdateStage(expandedStageId, update);
    }
  };

  // If editing a stage, show the editor
  if (editingStage) {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
          onClick={() => onExpandStage(null)}
        />
        
        {/* Sheet */}
        <div 
          ref={sheetRef}
          className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl z-50 max-h-[85vh] overflow-y-auto shadow-xl animate-slide-up"
        >
          {/* Drag handle */}
          <div className="sticky top-0 bg-white pt-3 pb-2 border-b border-gray-100">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />
          </div>
          
          <StageEditor
            stage={editingStage}
            stageProgress={editingStageProgress}
            onUpdate={handleUpdateStage}
            onClose={() => onExpandStage(null)}
          />
          
          {/* Safe area padding */}
          <div className="h-8" />
        </div>
      </>
    );
  }

  // Show summary sheet when not editing
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div 
        ref={sheetRef}
        className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl z-50 max-h-[75vh] overflow-y-auto shadow-xl animate-slide-up safe-bottom"
      >
        {/* Drag handle */}
        <div className="sticky top-0 bg-white pt-3 pb-2 z-10">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />
        </div>
        
        <div className="px-4 pb-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">{path.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {path.totalYears.display} • ${path.estimatedCost.toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 -m-2 text-gray-400"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Estimated Completion */}
          <div className="bg-brand-50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Est. Green Card
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-0.5">
                  {estimatedCompletion.date.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Remaining</div>
                <div className="text-lg font-semibold text-brand-700">
                  {formatMonthsRemaining(estimatedCompletion.months)}
                </div>
              </div>
            </div>
            {estimatedCompletion.hasUncertainty && (
              <p className="text-[10px] text-gray-500 mt-2">
                * Includes uncertain factors like visa bulletin wait
              </p>
            )}
          </div>
          
          {/* Progress summary */}
          <div className="flex items-center gap-4 text-sm mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500" />
              <span className="text-gray-700">{stageSummary.approved} done</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500" />
              <span className="text-gray-700">{stageSummary.filed} pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
              <span className="text-gray-700">{stageSummary.notStarted} to go</span>
            </div>
          </div>
          
          {/* Priority Date */}
          <div className="bg-amber-50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-700">Priority Date</h3>
              {effectivePD && (
                <span className="text-sm text-amber-700 font-medium">
                  {formatDateDisplay(effectivePD.date)}
                </span>
              )}
            </div>
            {effectivePD ? (
              <p className="text-xs text-gray-600">
                {effectivePD.source} • {timeElapsed(effectivePD.date)}
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                No priority date yet. Established when I-140 is approved.
              </p>
            )}
            
            {/* Ported PD */}
            <button
              onClick={() => setShowPortedPD(!showPortedPD)}
              className="text-xs text-brand-600 mt-2 font-medium"
            >
              {progress.portedPriorityDate ? "Edit ported PD ↓" : "Have a PD from previous employer? ↓"}
            </button>
            
            {showPortedPD && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200 space-y-3">
                <p className="text-xs text-gray-500">
                  If you have an approved I-140 from a previous employer, you can port that priority date.
                </p>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Priority Date</label>
                  <input
                    type="date"
                    value={progress.portedPriorityDate || ""}
                    onChange={(e) => onUpdatePortedPD(e.target.value || null, progress.portedPriorityDateCategory || null)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                  <select
                    value={progress.portedPriorityDateCategory || ""}
                    onChange={(e) => onUpdatePortedPD(progress.portedPriorityDate || null, e.target.value || null)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
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
                    className="text-xs text-red-600"
                  >
                    Remove ported PD
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Stage List */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Stages</h3>
            {trackableStages.map((stage) => {
              const node = getNode(stage.nodeId);
              const sp = progress.stages[stage.nodeId] || { status: "not_started" };
              
              return (
                <button
                  key={stage.nodeId}
                  onClick={() => onExpandStage(stage.nodeId)}
                  className="w-full flex items-center gap-3 p-3 -mx-1 rounded-xl active:bg-gray-50 text-left"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    sp.status === "approved" 
                      ? "bg-green-500 text-white"
                      : sp.status === "filed"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                  }`}>
                    {sp.status === "approved" ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : sp.status === "filed" ? (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    ) : null}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm">
                      {node?.name || stage.nodeId}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {sp.status === "approved" 
                        ? `✓ Done ${sp.approvedDate ? formatDateDisplay(sp.approvedDate) : ""}`
                        : sp.status === "filed"
                          ? `Pending ${sp.filedDate ? `since ${formatDateDisplay(sp.filedDate)}` : ""}`
                          : stage.durationYears.display
                      }
                    </div>
                  </div>
                  
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 flex-shrink-0">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
