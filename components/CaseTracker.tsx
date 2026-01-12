"use client";

import { useState, useEffect, useMemo } from "react";
import {
  CaseProgress,
  FiledCase,
  CaseStatus,
  caseStatusLabels,
  caseStatusColors,
  generateCaseId,
  isValidReceiptNumber,
  parseReceiptNumber,
} from "@/lib/case-progress";
import {
  PriorityDate,
  EBCategory,
  formatPriorityDateShort,
  ebCategoryLabels,
} from "@/lib/filter-paths";
import { ComposedPath, ComposedStage } from "@/lib/path-composer";
import {
  getCaseProgressOrCreate,
  saveCaseProgress,
} from "@/lib/storage";
import visaData from "@/data/visa-paths.json";

interface CaseTrackerProps {
  onClose: () => void;
  onUpdate: (progress: CaseProgress) => void;
  initialProgress?: CaseProgress;
  selectedPath?: ComposedPath | null;
}

// Months for date pickers
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Years for date pickers
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1999 + 1 }, (_, i) => currentYear + 1 - i);

// Status options for each step
const STEP_STATUS_OPTIONS: { value: "not_started" | "pending" | "approved"; label: string; color: string }[] = [
  { value: "not_started", label: "Not started", color: "bg-gray-100 text-gray-600" },
  { value: "pending", label: "In progress", color: "bg-blue-100 text-blue-700" },
  { value: "approved", label: "Complete", color: "bg-green-100 text-green-700" },
];

// Map node IDs to display info
function getStepInfo(nodeId: string): { name: string; description: string; hasReceiptNumber: boolean; hasPriorityDate: boolean } {
  const node = visaData.nodes[nodeId as keyof typeof visaData.nodes];
  
  const stepConfig: Record<string, { description: string; hasReceiptNumber: boolean; hasPriorityDate: boolean }> = {
    pwd: { description: "DOL determines prevailing wage", hasReceiptNumber: false, hasPriorityDate: false },
    recruit: { description: "Job posting and applicant review", hasReceiptNumber: false, hasPriorityDate: false },
    perm: { description: "Labor certification application", hasReceiptNumber: false, hasPriorityDate: false },
    i140: { description: "Immigrant petition - locks in priority date", hasReceiptNumber: true, hasPriorityDate: true },
    eb1: { description: "EB-1 petition - locks in priority date", hasReceiptNumber: true, hasPriorityDate: true },
    eb2niw: { description: "NIW petition - locks in priority date", hasReceiptNumber: true, hasPriorityDate: true },
    i485: { description: "Adjustment of status - final step", hasReceiptNumber: true, hasPriorityDate: false },
    priority_wait: { description: "Waiting for priority date to be current", hasReceiptNumber: false, hasPriorityDate: false },
    gc: { description: "Green card approved!", hasReceiptNumber: false, hasPriorityDate: false },
    marriage: { description: "Marriage-based petition", hasReceiptNumber: true, hasPriorityDate: false },
    eb5: { description: "EB-5 investor petition", hasReceiptNumber: true, hasPriorityDate: false },
  };
  
  const config = stepConfig[nodeId] || { description: "", hasReceiptNumber: false, hasPriorityDate: false };
  
  return {
    name: node?.name || nodeId,
    ...config,
  };
}

// Tracked step data
interface TrackedStep {
  nodeId: string;
  status: "not_started" | "pending" | "approved";
  filedDate?: string;
  approvedDate?: string;
  receiptNumber?: string;
  priorityDate?: PriorityDate;
  notes?: string;
}

export default function CaseTracker({ onClose, onUpdate, initialProgress, selectedPath }: CaseTrackerProps) {
  const [progress, setProgress] = useState<CaseProgress>(() => initialProgress || getCaseProgressOrCreate());
  const [trackedSteps, setTrackedSteps] = useState<TrackedStep[]>([]);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [lookupReceipt, setLookupReceipt] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<{ status: string; description: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"steps" | "lookup">("steps");

  // Get unique GC-track steps from the selected path (exclude status track and duplicates)
  const pathSteps = useMemo(() => {
    if (!selectedPath) return [];
    
    const seen = new Set<string>();
    return selectedPath.stages
      .filter(stage => {
        // Only include GC track stages, skip status track (work visas)
        if (stage.track !== "gc") return false;
        // Skip duplicates
        if (seen.has(stage.nodeId)) return false;
        seen.add(stage.nodeId);
        // Skip the final "gc" marker
        if (stage.nodeId === "gc") return false;
        return true;
      })
      .map(stage => ({
        ...stage,
        ...getStepInfo(stage.nodeId),
      }));
  }, [selectedPath]);

  // Initialize tracked steps from path
  useEffect(() => {
    if (pathSteps.length > 0 && trackedSteps.length === 0) {
      setTrackedSteps(pathSteps.map(step => ({
        nodeId: step.nodeId,
        status: "not_started",
      })));
    }
  }, [pathSteps, trackedSteps.length]);

  // Update a tracked step
  const updateStep = (nodeId: string, updates: Partial<TrackedStep>) => {
    setTrackedSteps(prev => prev.map(step => 
      step.nodeId === nodeId ? { ...step, ...updates } : step
    ));
  };

  // Calculate completion percentage
  const completionPercent = useMemo(() => {
    if (trackedSteps.length === 0) return 0;
    const completed = trackedSteps.filter(s => s.status === "approved").length;
    return Math.round((completed / trackedSteps.length) * 100);
  }, [trackedSteps]);

  // Get effective priority date from tracked steps
  const effectivePriorityDate = useMemo(() => {
    const i140Step = trackedSteps.find(s => 
      (s.nodeId === "i140" || s.nodeId === "eb1" || s.nodeId === "eb2niw") && 
      s.status === "approved" && 
      s.priorityDate
    );
    return i140Step?.priorityDate;
  }, [trackedSteps]);

  // Save progress
  const handleSave = () => {
    // Convert tracked steps back to progress format
    const updatedProgress: CaseProgress = {
      ...progress,
      gcProcess: {
        ...progress.gcProcess,
        pathType: selectedPath?.id.includes("niw") ? "eb2niw" : 
                  selectedPath?.id.includes("eb1") ? "eb1a" :
                  selectedPath?.id.includes("perm") ? 
                    (selectedPath.gcCategory === "EB-3" ? "perm_eb3" : "perm_eb2") :
                  selectedPath?.id.includes("marriage") ? "marriage" : "none",
      },
      effectivePriorityDate,
      effectiveEBCategory: selectedPath?.gcCategory?.toLowerCase().replace("-", "") as EBCategory | undefined,
      updatedAt: new Date().toISOString(),
    };

    // Map tracked steps to filed cases
    const i140Step = trackedSteps.find(s => s.nodeId === "i140" || s.nodeId === "eb1" || s.nodeId === "eb2niw");
    if (i140Step && i140Step.status !== "not_started") {
      updatedProgress.gcProcess.primaryI140 = {
        id: generateCaseId(),
        formType: i140Step.nodeId === "eb2niw" ? "i140_eb2niw" : 
                  i140Step.nodeId === "eb1" ? "i140_eb1a" : "i140_eb2",
        status: i140Step.status === "approved" ? "approved" : "pending",
        receiptNumber: i140Step.receiptNumber,
        filedDate: i140Step.filedDate,
        approvedDate: i140Step.approvedDate,
        priorityDate: i140Step.priorityDate,
        ebCategory: selectedPath?.gcCategory?.toLowerCase().replace("-", "") as EBCategory,
      };
    }

    const i485Step = trackedSteps.find(s => s.nodeId === "i485");
    if (i485Step && i485Step.status !== "not_started") {
      updatedProgress.gcProcess.i485 = {
        id: generateCaseId(),
        formType: "i485",
        status: i485Step.status === "approved" ? "approved" : "pending",
        receiptNumber: i485Step.receiptNumber,
        filedDate: i485Step.filedDate,
        approvedDate: i485Step.approvedDate,
      };
    }

    saveCaseProgress(updatedProgress);
    onUpdate(updatedProgress);
    onClose();
  };

  // Case lookup
  const handleCaseLookup = async () => {
    if (!lookupReceipt) return;
    
    setLookupLoading(true);
    setLookupResult(null);

    try {
      const response = await fetch(`/api/case-status?receiptNumber=${lookupReceipt.toUpperCase()}`);
      const data = await response.json();

      if (data.success) {
        setLookupResult({
          status: data.data.status,
          description: data.data.statusDescription,
        });
      } else {
        setLookupResult({ status: "error", description: data.error || "Failed to look up case" });
      }
    } catch {
      setLookupResult({ status: "error", description: "Network error. Please try again." });
    } finally {
      setLookupLoading(false);
    }
  };

  // If no path selected, show a message
  if (!selectedPath) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-600">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Select a path to track</h2>
          <p className="text-sm text-gray-600 mb-4">
            Click &quot;Track this path →&quot; on any immigration path in the timeline to start tracking your progress.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Track: {selectedPath.name}</h2>
              <p className="text-sm text-gray-500">{selectedPath.totalYears.display} · {selectedPath.gcCategory}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>{trackedSteps.filter(s => s.status === "approved").length} of {trackedSteps.length} steps complete</span>
              <span>{completionPercent}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-2 border-b border-gray-100 flex gap-1">
          <button
            onClick={() => setActiveTab("steps")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "steps" ? "bg-brand-100 text-brand-700" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            My Progress
          </button>
          <button
            onClick={() => setActiveTab("lookup")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "lookup" ? "bg-brand-100 text-brand-700" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Case Lookup
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "steps" ? (
            <div className="space-y-3">
              {pathSteps.map((step, index) => {
                const tracked = trackedSteps.find(s => s.nodeId === step.nodeId);
                const isExpanded = expandedStep === step.nodeId;
                const stepInfo = getStepInfo(step.nodeId);
                
                return (
                  <div 
                    key={step.nodeId}
                    className={`border rounded-xl overflow-hidden transition-all ${
                      tracked?.status === "approved" ? "border-green-200 bg-green-50/50" :
                      tracked?.status === "pending" ? "border-blue-200 bg-blue-50/50" :
                      "border-gray-200"
                    }`}
                  >
                    {/* Step header */}
                    <div 
                      className="px-4 py-3 flex items-center gap-3 cursor-pointer"
                      onClick={() => setExpandedStep(isExpanded ? null : step.nodeId)}
                    >
                      {/* Step number/status indicator */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        tracked?.status === "approved" ? "bg-green-500 text-white" :
                        tracked?.status === "pending" ? "bg-blue-500 text-white" :
                        "bg-gray-200 text-gray-600"
                      }`}>
                        {tracked?.status === "approved" ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 12l5 5L20 7" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                      
                      {/* Step info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">{stepInfo.name}</div>
                        <div className="text-xs text-gray-500 truncate">{stepInfo.description}</div>
                      </div>
                      
                      {/* Duration */}
                      <div className="text-xs text-gray-400">
                        {step.durationYears.display}
                      </div>
                      
                      {/* Expand icon */}
                      <svg 
                        width="16" height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        className={`text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                    
                    {/* Expanded content */}
                    {isExpanded && tracked && (
                      <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-4">
                        {/* Status selector */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
                          <div className="flex gap-2">
                            {STEP_STATUS_OPTIONS.map(option => (
                              <button
                                key={option.value}
                                onClick={() => updateStep(step.nodeId, { status: option.value })}
                                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                  tracked.status === option.value
                                    ? `${option.color} ring-2 ring-offset-1 ring-brand-400`
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Filed date */}
                        {tracked.status !== "not_started" && (
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">Filed Date</label>
                            <div className="flex gap-2">
                              <select
                                value={tracked.filedDate ? new Date(tracked.filedDate).getMonth() + 1 : ""}
                                onChange={(e) => {
                                  const month = parseInt(e.target.value);
                                  const year = tracked.filedDate ? new Date(tracked.filedDate).getFullYear() : currentYear;
                                  if (month) {
                                    updateStep(step.nodeId, { filedDate: new Date(year, month - 1, 1).toISOString() });
                                  }
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              >
                                <option value="">Month</option>
                                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                              </select>
                              <select
                                value={tracked.filedDate ? new Date(tracked.filedDate).getFullYear() : ""}
                                onChange={(e) => {
                                  const year = parseInt(e.target.value);
                                  const month = tracked.filedDate ? new Date(tracked.filedDate).getMonth() : 0;
                                  if (year) {
                                    updateStep(step.nodeId, { filedDate: new Date(year, month, 1).toISOString() });
                                  }
                                }}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              >
                                <option value="">Year</option>
                                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                              </select>
                            </div>
                          </div>
                        )}
                        
                        {/* Receipt number */}
                        {stepInfo.hasReceiptNumber && tracked.status !== "not_started" && (
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">Receipt Number</label>
                            <input
                              type="text"
                              value={tracked.receiptNumber || ""}
                              onChange={(e) => updateStep(step.nodeId, { receiptNumber: e.target.value.toUpperCase() })}
                              placeholder="e.g., SRC2412345678"
                              className={`w-full px-3 py-2 border rounded-lg text-sm ${
                                tracked.receiptNumber && !isValidReceiptNumber(tracked.receiptNumber)
                                  ? "border-red-300 bg-red-50"
                                  : "border-gray-300"
                              }`}
                            />
                            {tracked.receiptNumber && isValidReceiptNumber(tracked.receiptNumber) && (
                              <p className="text-xs text-gray-500 mt-1">
                                {parseReceiptNumber(tracked.receiptNumber).serviceCenter}
                              </p>
                            )}
                          </div>
                        )}
                        
                        {/* Priority date (for I-140) */}
                        {stepInfo.hasPriorityDate && tracked.status === "approved" && (
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">Priority Date</label>
                            <div className="flex gap-2">
                              <select
                                value={tracked.priorityDate?.month || ""}
                                onChange={(e) => {
                                  const month = parseInt(e.target.value);
                                  const year = tracked.priorityDate?.year || currentYear;
                                  if (month) {
                                    updateStep(step.nodeId, { priorityDate: { month, year } });
                                  }
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              >
                                <option value="">Month</option>
                                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                              </select>
                              <select
                                value={tracked.priorityDate?.year || ""}
                                onChange={(e) => {
                                  const year = parseInt(e.target.value);
                                  const month = tracked.priorityDate?.month || 1;
                                  if (year) {
                                    updateStep(step.nodeId, { priorityDate: { month, year } });
                                  }
                                }}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              >
                                <option value="">Year</option>
                                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                              </select>
                            </div>
                            {tracked.priorityDate && (
                              <p className="text-xs text-green-600 mt-1">
                                ✓ Your priority date: {formatPriorityDateShort(tracked.priorityDate)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Final step indicator */}
              <div className="flex items-center gap-3 px-4 py-3 border border-dashed border-gray-300 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-lg">🎉</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Green Card</div>
                  <div className="text-xs text-gray-500">Permanent Resident status</div>
                </div>
              </div>
              
              {/* Priority date summary */}
              {effectivePriorityDate && (
                <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 text-green-800">
                    <span className="text-lg">📅</span>
                    <div>
                      <div className="font-medium">Your Priority Date: {formatPriorityDateShort(effectivePriorityDate)}</div>
                      <div className="text-xs text-green-600">This date is locked in and portable to new petitions</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Case Lookup Tab */
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter a USCIS receipt number to check the current case status.
              </p>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={lookupReceipt}
                  onChange={(e) => setLookupReceipt(e.target.value.toUpperCase())}
                  placeholder="e.g., SRC2412345678"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleCaseLookup}
                  disabled={lookupLoading || !lookupReceipt}
                  className="px-6 py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 disabled:opacity-50"
                >
                  {lookupLoading ? "..." : "Look Up"}
                </button>
              </div>

              {lookupResult && (
                <div className={`p-4 rounded-xl ${
                  lookupResult.status === "error" ? "bg-red-50" : "bg-white border border-gray-200"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      lookupResult.status === "error" ? "bg-red-100 text-red-700" :
                      lookupResult.status === "approved" ? "bg-green-100 text-green-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {lookupResult.status === "error" ? "Error" : 
                       caseStatusLabels[lookupResult.status as CaseStatus] || lookupResult.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{lookupResult.description}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600"
          >
            Save Progress
          </button>
        </div>
      </div>
    </div>
  );
}
