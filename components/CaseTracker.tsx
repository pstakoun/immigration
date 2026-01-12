"use client";

import { useState, useEffect } from "react";
import {
  CaseProgress,
  FiledCase,
  FormType,
  CaseStatus,
  formTypeLabels,
  caseStatusLabels,
  caseStatusColors,
  generateCaseId,
  isValidReceiptNumber,
  parseReceiptNumber,
  calculateEffectivePriorityDate,
  calculateRemainingSteps,
  RemainingStep,
} from "@/lib/case-progress";
import {
  PriorityDate,
  EBCategory,
  formatPriorityDateShort,
  ebCategoryLabels,
} from "@/lib/filter-paths";
import {
  getCaseProgressOrCreate,
  saveCaseProgress,
} from "@/lib/storage";

interface CaseTrackerProps {
  onClose: () => void;
  onUpdate: (progress: CaseProgress) => void;
  initialProgress?: CaseProgress;
}

// Months for date pickers
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Years for date pickers (2000 to current year + 1)
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1999 + 1 }, (_, i) => currentYear + 1 - i);

// Path types
const PATH_TYPE_OPTIONS: { value: CaseProgress["gcProcess"]["pathType"]; label: string; description: string }[] = [
  { value: "perm_eb2", label: "EB-2 (PERM)", description: "Employer-sponsored with advanced degree" },
  { value: "perm_eb3", label: "EB-3 (PERM)", description: "Employer-sponsored skilled worker" },
  { value: "eb1a", label: "EB-1A", description: "Extraordinary Ability (self-petition)" },
  { value: "eb1b", label: "EB-1B", description: "Outstanding Researcher" },
  { value: "eb1c", label: "EB-1C", description: "Multinational Executive/Manager" },
  { value: "eb2niw", label: "EB-2 NIW", description: "National Interest Waiver (self-petition)" },
  { value: "marriage", label: "Marriage-based", description: "Marriage to US citizen" },
  { value: "eb5", label: "EB-5", description: "Investor visa" },
  { value: "none", label: "Not started yet", description: "Haven't begun GC process" },
];

// Case status options
const STATUS_OPTIONS: { value: CaseStatus; label: string }[] = [
  { value: "not_started", label: "Not Started" },
  { value: "pending", label: "Pending / Filed" },
  { value: "rfe_issued", label: "RFE Issued" },
  { value: "rfe_response_filed", label: "RFE Response Filed" },
  { value: "approved", label: "Approved" },
  { value: "denied", label: "Denied" },
  { value: "withdrawn", label: "Withdrawn" },
];

// EB Category options
const EB_OPTIONS: { value: EBCategory; label: string }[] = [
  { value: "eb1", label: "EB-1" },
  { value: "eb2", label: "EB-2" },
  { value: "eb3", label: "EB-3" },
];

export default function CaseTracker({ onClose, onUpdate, initialProgress }: CaseTrackerProps) {
  const [progress, setProgress] = useState<CaseProgress>(() => initialProgress || getCaseProgressOrCreate());
  const [activeTab, setActiveTab] = useState<"overview" | "i140" | "perm" | "i485" | "lookup">("overview");
  const [lookupReceipt, setLookupReceipt] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<{ status: string; description: string } | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Calculate remaining steps whenever progress changes
  const remainingSteps = calculateRemainingSteps(progress);
  const effectivePD = calculateEffectivePriorityDate(progress.gcProcess);

  // Update effective priority date in progress
  useEffect(() => {
    if (effectivePD) {
      setProgress(prev => ({
        ...prev,
        effectivePriorityDate: effectivePD.date,
        effectiveEBCategory: effectivePD.category,
      }));
    }
  }, [effectivePD?.date.month, effectivePD?.date.year, effectivePD?.category]);

  const handleSave = () => {
    saveCaseProgress(progress);
    onUpdate(progress);
    onClose();
  };

  const updatePathType = (pathType: CaseProgress["gcProcess"]["pathType"]) => {
    setProgress(prev => ({
      ...prev,
      gcProcess: { ...prev.gcProcess, pathType },
    }));
  };

  // I-140 handlers
  const updatePrimaryI140 = (updates: Partial<FiledCase>) => {
    setProgress(prev => {
      const existingI140 = prev.gcProcess.primaryI140 || {
        id: generateCaseId(),
        formType: "i140_eb2" as FormType,
        status: "not_started" as CaseStatus,
      };
      
      return {
        ...prev,
        gcProcess: {
          ...prev.gcProcess,
          primaryI140: { ...existingI140, ...updates },
        },
      };
    });
  };

  // PERM handlers
  const updatePWD = (updates: Partial<FiledCase>) => {
    setProgress(prev => {
      const existing = prev.gcProcess.permProcess?.pwd || {
        id: generateCaseId(),
        formType: "eta9141" as FormType,
        status: "not_started" as CaseStatus,
      };
      
      return {
        ...prev,
        gcProcess: {
          ...prev.gcProcess,
          permProcess: {
            ...prev.gcProcess.permProcess,
            pwd: { ...existing, ...updates },
          },
        },
      };
    });
  };

  const updatePERM = (updates: Partial<FiledCase>) => {
    setProgress(prev => {
      const existing = prev.gcProcess.permProcess?.perm || {
        id: generateCaseId(),
        formType: "eta9089" as FormType,
        status: "not_started" as CaseStatus,
      };
      
      return {
        ...prev,
        gcProcess: {
          ...prev.gcProcess,
          permProcess: {
            ...prev.gcProcess.permProcess,
            perm: { ...existing, ...updates },
          },
        },
      };
    });
  };

  // I-485 handlers
  const updateI485 = (updates: Partial<FiledCase>) => {
    setProgress(prev => {
      const existing = prev.gcProcess.i485 || {
        id: generateCaseId(),
        formType: "i485" as FormType,
        status: "not_started" as CaseStatus,
      };
      
      return {
        ...prev,
        gcProcess: {
          ...prev.gcProcess,
          i485: { ...existing, ...updates },
        },
      };
    });
  };

  // Case lookup
  const handleCaseLookup = async () => {
    if (!lookupReceipt) return;
    
    setLookupLoading(true);
    setLookupResult(null);
    setLookupError(null);

    try {
      const response = await fetch(`/api/case-status?receiptNumber=${lookupReceipt.toUpperCase()}`);
      const data = await response.json();

      if (data.success) {
        setLookupResult({
          status: data.data.status,
          description: data.data.statusDescription,
        });
      } else {
        setLookupError(data.error || "Failed to look up case status");
      }
    } catch (error) {
      setLookupError("Network error. Please try again.");
    } finally {
      setLookupLoading(false);
    }
  };

  // Date picker component
  const DatePicker = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string; 
    value?: string; 
    onChange: (date: string | undefined) => void;
  }) => {
    const [month, setMonth] = useState(() => {
      if (!value) return "";
      const d = new Date(value);
      return String(d.getMonth() + 1);
    });
    const [year, setYear] = useState(() => {
      if (!value) return "";
      const d = new Date(value);
      return String(d.getFullYear());
    });

    const handleChange = (m: string, y: string) => {
      if (m && y) {
        const date = new Date(parseInt(y), parseInt(m) - 1, 1);
        onChange(date.toISOString());
      } else if (!m && !y) {
        onChange(undefined);
      }
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex gap-2">
          <select
            value={month}
            onChange={(e) => { setMonth(e.target.value); handleChange(e.target.value, year); }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="">Month</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => { setYear(e.target.value); handleChange(month, e.target.value); }}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="">Year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  // Priority date picker
  const PriorityDatePicker = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value?: PriorityDate;
    onChange: (pd: PriorityDate | undefined) => void;
  }) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex gap-2">
          <select
            value={value?.month || ""}
            onChange={(e) => {
              const month = parseInt(e.target.value);
              if (month && value?.year) {
                onChange({ month, year: value.year });
              } else if (month) {
                onChange({ month, year: currentYear });
              } else {
                onChange(undefined);
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="">Month</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={value?.year || ""}
            onChange={(e) => {
              const year = parseInt(e.target.value);
              if (year && value?.month) {
                onChange({ month: value.month, year });
              } else if (year) {
                onChange({ month: 1, year });
              } else {
                onChange(undefined);
              }
            }}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="">Year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  // Receipt number input with validation
  const ReceiptNumberInput = ({
    label,
    value,
    onChange,
    placeholder = "e.g., SRC2412345678",
  }: {
    label: string;
    value?: string;
    onChange: (value: string | undefined) => void;
    placeholder?: string;
  }) => {
    const [inputValue, setInputValue] = useState(value || "");
    const isValid = !inputValue || isValidReceiptNumber(inputValue);
    const parsed = inputValue ? parseReceiptNumber(inputValue) : null;

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            const val = e.target.value.toUpperCase();
            setInputValue(val);
            onChange(val || undefined);
          }}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500 ${
            inputValue && !isValid ? "border-red-300 bg-red-50" : "border-gray-300"
          }`}
        />
        {inputValue && !isValid && (
          <p className="text-xs text-red-600 mt-1">Invalid format. Expected: ABC1234567890</p>
        )}
        {parsed?.isValid && (
          <p className="text-xs text-gray-500 mt-1">{parsed.serviceCenter}</p>
        )}
      </div>
    );
  };

  // Status selector
  const StatusSelector = ({
    value,
    onChange,
  }: {
    value: CaseStatus;
    onChange: (status: CaseStatus) => void;
  }) => {
    return (
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((option) => {
          const colors = caseStatusColors[option.value];
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? `${colors.bg} ${colors.text} ring-2 ring-offset-1 ring-brand-400`
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Track Your Immigration Case</h2>
            <p className="text-sm text-gray-500">Enter your filed cases to see accurate timelines</p>
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

        {/* Tabs */}
        <div className="px-6 py-2 border-b border-gray-100 flex gap-1 overflow-x-auto">
          {[
            { id: "overview", label: "Overview" },
            { id: "i140", label: "I-140" },
            ...(progress.gcProcess.pathType === "perm_eb2" || progress.gcProcess.pathType === "perm_eb3"
              ? [{ id: "perm", label: "PERM" }]
              : []),
            { id: "i485", label: "I-485" },
            { id: "lookup", label: "Case Lookup" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-brand-100 text-brand-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Path Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Which green card path are you on?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PATH_TYPE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updatePathType(option.value)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        progress.gcProcess.pathType === option.value
                          ? "border-brand-500 bg-brand-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className={`font-medium text-sm ${
                        progress.gcProcess.pathType === option.value ? "text-brand-700" : "text-gray-900"
                      }`}>
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Summary */}
              {remainingSteps.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Your Progress</h3>
                  <div className="space-y-2">
                    {remainingSteps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          step.status === "complete"
                            ? "bg-green-50"
                            : step.status === "pending"
                            ? "bg-blue-50"
                            : "bg-gray-50"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          step.status === "complete"
                            ? "bg-green-500 text-white"
                            : step.status === "pending"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}>
                          {step.status === "complete" ? "✓" : index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">{step.name}</div>
                          {step.note && (
                            <div className="text-xs text-gray-500">{step.note}</div>
                          )}
                        </div>
                        {step.estimatedMonths && step.status === "not_started" && (
                          <div className="text-xs text-gray-500">~{step.estimatedMonths}mo</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Effective Priority Date */}
              {effectivePD && (
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 text-lg">📅</span>
                    <div>
                      <div className="font-medium text-green-800">
                        Your Priority Date: {formatPriorityDateShort(effectivePD.date)}
                      </div>
                      <div className="text-xs text-green-600">
                        Category: {ebCategoryLabels[effectivePD.category]} • This date is portable to new petitions
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* I-140 Tab */}
          {activeTab === "i140" && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-800">
                  <strong>I-140 Immigrant Petition</strong> is the key filing that establishes your priority date.
                  An approved I-140 locks in your place in line for a green card.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <StatusSelector
                    value={progress.gcProcess.primaryI140?.status || "not_started"}
                    onChange={(status) => updatePrimaryI140({ status })}
                  />
                </div>

                <ReceiptNumberInput
                  label="Receipt Number"
                  value={progress.gcProcess.primaryI140?.receiptNumber}
                  onChange={(receiptNumber) => updatePrimaryI140({ receiptNumber })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">EB Category</label>
                    <div className="flex gap-2">
                      {EB_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => updatePrimaryI140({ ebCategory: option.value })}
                          className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            progress.gcProcess.primaryI140?.ebCategory === option.value
                              ? "border-brand-500 bg-brand-50 text-brand-700"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <PriorityDatePicker
                    label="Priority Date"
                    value={progress.gcProcess.primaryI140?.priorityDate}
                    onChange={(priorityDate) => updatePrimaryI140({ priorityDate })}
                  />
                </div>

                <DatePicker
                  label="Filed Date"
                  value={progress.gcProcess.primaryI140?.filedDate}
                  onChange={(filedDate) => updatePrimaryI140({ filedDate })}
                />

                {progress.gcProcess.primaryI140?.status === "approved" && (
                  <DatePicker
                    label="Approved Date"
                    value={progress.gcProcess.primaryI140?.approvedDate}
                    onChange={(approvedDate) => updatePrimaryI140({ approvedDate })}
                  />
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sponsoring Employer (optional)</label>
                  <input
                    type="text"
                    value={progress.gcProcess.primaryI140?.employer || ""}
                    onChange={(e) => updatePrimaryI140({ employer: e.target.value || undefined })}
                    placeholder="e.g., Google Inc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Tip about priority date */}
              {progress.gcProcess.primaryI140?.status === "approved" && (
                <div className="p-4 bg-amber-50 rounded-xl">
                  <p className="text-sm text-amber-800">
                    💡 <strong>Priority Date Portability:</strong> Your priority date can be used for any new I-140,
                    even with a different employer. You don&apos;t need to do PERM again unless switching employers.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* PERM Tab */}
          {activeTab === "perm" && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-50 rounded-xl">
                <p className="text-sm text-amber-800">
                  <strong>PERM Labor Certification</strong> is required for EB-2 and EB-3 employer-sponsored green cards.
                  While PERM is processing, your existing priority date (if any) continues to age!
                </p>
              </div>

              {/* PWD Section */}
              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-3">Prevailing Wage Determination (PWD)</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <StatusSelector
                      value={progress.gcProcess.permProcess?.pwd?.status || "not_started"}
                      onChange={(status) => updatePWD({ status })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">DOL Case Number (optional)</label>
                      <input
                        type="text"
                        value={progress.gcProcess.permProcess?.pwd?.dolCaseNumber || ""}
                        onChange={(e) => updatePWD({ dolCaseNumber: e.target.value || undefined })}
                        placeholder="e.g., P-XXX-XXXXX-XXXXXX"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <DatePicker
                      label="Filed Date"
                      value={progress.gcProcess.permProcess?.pwd?.filedDate}
                      onChange={(filedDate) => updatePWD({ filedDate })}
                    />
                  </div>
                </div>
              </div>

              {/* PERM Section */}
              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-3">PERM Labor Certification (ETA-9089)</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <StatusSelector
                      value={progress.gcProcess.permProcess?.perm?.status || "not_started"}
                      onChange={(status) => updatePERM({ status })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">DOL Case Number (optional)</label>
                      <input
                        type="text"
                        value={progress.gcProcess.permProcess?.perm?.dolCaseNumber || ""}
                        onChange={(e) => updatePERM({ dolCaseNumber: e.target.value || undefined })}
                        placeholder="e.g., A-XXX-XXXXX-XXXXXX"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <DatePicker
                      label="Filed Date"
                      value={progress.gcProcess.permProcess?.perm?.filedDate}
                      onChange={(filedDate) => updatePERM({ filedDate })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title (optional)</label>
                    <input
                      type="text"
                      value={progress.gcProcess.permProcess?.perm?.jobTitle || ""}
                      onChange={(e) => updatePERM({ jobTitle: e.target.value || undefined })}
                      placeholder="e.g., Software Engineer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* I-485 Tab */}
          {activeTab === "i485" && (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-sm text-green-800">
                  <strong>I-485 Adjustment of Status</strong> is the final step to get your green card.
                  While pending, you can get an EAD (work permit) and Advance Parole (travel document).
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <StatusSelector
                    value={progress.gcProcess.i485?.status || "not_started"}
                    onChange={(status) => updateI485({ status })}
                  />
                </div>

                <ReceiptNumberInput
                  label="Receipt Number"
                  value={progress.gcProcess.i485?.receiptNumber}
                  onChange={(receiptNumber) => updateI485({ receiptNumber })}
                />

                <DatePicker
                  label="Filed Date"
                  value={progress.gcProcess.i485?.filedDate}
                  onChange={(filedDate) => updateI485({ filedDate })}
                />

                {progress.gcProcess.i485?.status === "approved" && (
                  <DatePicker
                    label="Approved Date"
                    value={progress.gcProcess.i485?.approvedDate}
                    onChange={(approvedDate) => updateI485({ approvedDate })}
                  />
                )}
              </div>

              {/* Benefits while pending */}
              {progress.gcProcess.i485?.status === "pending" && (
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Benefits while I-485 is pending:</strong>
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>✓ EAD (work permit) - work for any employer</li>
                    <li>✓ Advance Parole - travel internationally</li>
                    <li>✓ AC21 portability (after 180 days) - change jobs freely</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Case Lookup Tab */}
          {activeTab === "lookup" && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-700">
                  Enter a USCIS receipt number to check the current case status.
                  Format: 3 letters + 10 digits (e.g., SRC2412345678)
                </p>
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={lookupReceipt}
                  onChange={(e) => setLookupReceipt(e.target.value.toUpperCase())}
                  placeholder="e.g., SRC2412345678"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500"
                />
                <button
                  onClick={handleCaseLookup}
                  disabled={lookupLoading || !lookupReceipt}
                  className="px-6 py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {lookupLoading ? "Checking..." : "Look Up"}
                </button>
              </div>

              {lookupError && (
                <div className="p-4 bg-red-50 rounded-xl">
                  <p className="text-sm text-red-700">{lookupError}</p>
                </div>
              )}

              {lookupResult && (
                <div className="p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      caseStatusColors[lookupResult.status as CaseStatus]?.bg || "bg-gray-100"
                    } ${caseStatusColors[lookupResult.status as CaseStatus]?.text || "text-gray-700"}`}>
                      {caseStatusLabels[lookupResult.status as CaseStatus] || lookupResult.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{lookupResult.description}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
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
