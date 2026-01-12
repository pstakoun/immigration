"use client";

import { useMemo, useState } from "react";
import { EBCategory, FilterState, ebCategoryLabels } from "@/lib/filter-paths";
import {
  CaseTrackerState,
  EmploymentImmigrationCase,
  MilestoneStatus,
  defaultCaseTrackerState,
} from "@/lib/case-tracker";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

const milestoneStatusOptions: { value: MilestoneStatus; label: string }[] = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "filed", label: "Filed / Submitted" },
  { value: "approved", label: "Approved" },
  { value: "denied", label: "Denied" },
];

function newEmploymentCase(initial?: Partial<EmploymentImmigrationCase>): EmploymentImmigrationCase {
  const now = new Date().toISOString();
  const id = `case_${Math.random().toString(16).slice(2)}_${Date.now()}`;
  return {
    id,
    type: "employment",
    title: initial?.title ?? "My employment case",
    category: initial?.category ?? null,
    priorityDate: initial?.priorityDate ?? null,
    milestones: {
      perm: { status: "not_started", sponsorshipIntent: "not_sure" },
      i140: { status: "not_started" },
      i485: { status: "not_started", ead: { status: "not_started" }, ap: { status: "not_started" } },
    },
    createdAt: now,
    updatedAt: now,
  };
}

function normalizeDateInput(value: string): string | undefined {
  const v = value.trim();
  if (!v) return undefined;
  return v;
}

function normalizeReceipt(value: string): string | undefined {
  const v = value.trim().toUpperCase();
  if (!v) return undefined;
  return v;
}

interface CaseTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  initialState: CaseTrackerState;
  onSave: (state: CaseTrackerState) => void;
}

export default function CaseTrackerModal({
  isOpen,
  onClose,
  filters,
  initialState,
  onSave,
}: CaseTrackerModalProps) {
  const [draft, setDraft] = useState<CaseTrackerState>(() => initialState ?? defaultCaseTrackerState);

  // Reset draft whenever it opens with a different initial state
  // (Modal is mounted conditionally in parent; but keep this safe.)
  const activeCase = useMemo(() => {
    if (!draft.activeCaseId) return null;
    return draft.cases.find((c) => c.id === draft.activeCaseId) ?? null;
  }, [draft.activeCaseId, draft.cases]);

  if (!isOpen) return null;

  const ensureActiveCase = () => {
    if (draft.activeCaseId && activeCase) return;
    const initialCategory = filters.existingPriorityDateCategory ?? null;
    const initialPD = filters.existingPriorityDate ?? null;
    const c = newEmploymentCase({ category: initialCategory, priorityDate: initialPD });
    setDraft((prev) => ({
      ...prev,
      enabled: true,
      activeCaseId: c.id,
      cases: [...prev.cases, c],
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateActiveCase = (patch: Partial<EmploymentImmigrationCase>) => {
    if (!draft.activeCaseId) return;
    setDraft((prev) => {
      const now = new Date().toISOString();
      return {
        ...prev,
        cases: prev.cases.map((c) =>
          c.id === prev.activeCaseId ? { ...c, ...patch, updatedAt: now } : c
        ),
        updatedAt: now,
      };
    });
  };

  const updateMilestone = (
    key: "perm" | "i140" | "i485",
    patch: Record<string, unknown>
  ) => {
    if (!activeCase) return;
    updateActiveCase({
      milestones: {
        ...activeCase.milestones,
        [key]: {
          ...(activeCase.milestones as any)[key],
          ...patch,
        },
      } as any,
    });
  };

  const updateNestedMilestone = (key: "ead" | "ap", patch: Record<string, unknown>) => {
    if (!activeCase) return;
    updateActiveCase({
      milestones: {
        ...activeCase.milestones,
        i485: {
          ...activeCase.milestones.i485,
          [key]: {
            ...(activeCase.milestones.i485 as any)[key],
            ...patch,
          },
        },
      },
    });
  };

  const handleSave = () => {
    const next: CaseTrackerState = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };
    onSave(next);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Case tracker</h2>
            <p className="text-sm text-gray-500">
              Tell Stateside what you’ve already filed. We’ll update timelines to show what’s left.
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={draft.enabled}
              onChange={(e) => {
                const enabled = e.target.checked;
                setDraft((prev) => ({
                  ...prev,
                  enabled,
                  updatedAt: new Date().toISOString(),
                }));
                if (enabled) ensureActiveCase();
              }}
              className="mt-0.5 w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
            />
            <div>
              <div className="font-medium text-sm text-gray-900">Enable case tracking</div>
              <div className="text-xs text-gray-500">
                This only affects your local device (stored in your browser).
              </div>
            </div>
          </label>

          {draft.enabled && (
            <>
              {!activeCase ? (
                <button
                  type="button"
                  onClick={ensureActiveCase}
                  className="w-full py-3 px-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Create my employment-based case
                </button>
              ) : (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between gap-3">
                      <input
                        value={activeCase.title}
                        onChange={(e) => updateActiveCase({ title: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500 bg-white"
                        placeholder="Case title"
                      />
                      <select
                        value={activeCase.category ?? ""}
                        onChange={(e) =>
                          updateActiveCase({
                            category: (e.target.value as EBCategory) || null,
                          })
                        }
                        className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500 bg-white"
                      >
                        <option value="">Category</option>
                        <option value="eb1">{ebCategoryLabels.eb1}</option>
                        <option value="eb2">{ebCategoryLabels.eb2}</option>
                        <option value="eb3">{ebCategoryLabels.eb3}</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 space-y-5">
                    {/* Priority date */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-900">Priority date (PD)</label>
                        <button
                          type="button"
                          onClick={() => updateActiveCase({ priorityDate: null })}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={activeCase.priorityDate?.month || ""}
                          onChange={(e) => {
                            const month = parseInt(e.target.value, 10);
                            const year = activeCase.priorityDate?.year || currentYear;
                            updateActiveCase({
                              priorityDate: month ? { month, year } : null,
                            });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500"
                        >
                          <option value="">Month</option>
                          {months.map((m, i) => (
                            <option key={m} value={i + 1}>
                              {m}
                            </option>
                          ))}
                        </select>
                        <select
                          value={activeCase.priorityDate?.year || ""}
                          onChange={(e) => {
                            const year = parseInt(e.target.value, 10);
                            const month = activeCase.priorityDate?.month || 1;
                            updateActiveCase({
                              priorityDate: year ? { month, year } : null,
                            });
                          }}
                          className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500"
                        >
                          <option value="">Year</option>
                          {years.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        We use your PD + category to estimate Visa Bulletin wait (Dates for Filing + Final Action).
                      </p>
                    </div>

                    {/* PERM */}
                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-gray-900">PERM (DOL)</div>
                          <div className="text-xs text-gray-500">PWD + recruitment + ETA-9089</div>
                        </div>
                        <select
                          value={activeCase.milestones.perm.status}
                          onChange={(e) => updateMilestone("perm", { status: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500 bg-white"
                        >
                          {milestoneStatusOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Filed date</label>
                          <input
                            value={activeCase.milestones.perm.filedDate ?? ""}
                            onChange={(e) =>
                              updateMilestone("perm", { filedDate: normalizeDateInput(e.target.value) })
                            }
                            placeholder="YYYY-MM-DD"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">If you switch employers</label>
                          <select
                            value={activeCase.milestones.perm.sponsorshipIntent ?? "not_sure"}
                            onChange={(e) => updateMilestone("perm", { sponsorshipIntent: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500 bg-white"
                          >
                            <option value="not_sure">Not sure</option>
                            <option value="staying_with_sponsor">Staying with sponsoring employer</option>
                            <option value="switching_employer">Switching employers</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* I-140 */}
                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-gray-900">I-140 (Immigrant Petition)</div>
                          <div className="text-xs text-gray-500">Receipt number optional</div>
                        </div>
                        <select
                          value={activeCase.milestones.i140.status}
                          onChange={(e) => updateMilestone("i140", { status: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500 bg-white"
                        >
                          {milestoneStatusOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Receipt number</label>
                          <input
                            value={activeCase.milestones.i140.receiptNumber ?? ""}
                            onChange={(e) =>
                              updateMilestone("i140", { receiptNumber: normalizeReceipt(e.target.value) })
                            }
                            placeholder="e.g., IOE123..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Filed date</label>
                          <input
                            value={activeCase.milestones.i140.filedDate ?? ""}
                            onChange={(e) =>
                              updateMilestone("i140", { filedDate: normalizeDateInput(e.target.value) })
                            }
                            placeholder="YYYY-MM-DD"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* I-485 */}
                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-gray-900">I-485 (Adjustment of Status)</div>
                          <div className="text-xs text-gray-500">If filed, we’ll treat earlier steps as completed.</div>
                        </div>
                        <select
                          value={activeCase.milestones.i485.status}
                          onChange={(e) => updateMilestone("i485", { status: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500 bg-white"
                        >
                          {milestoneStatusOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Receipt number</label>
                          <input
                            value={activeCase.milestones.i485.receiptNumber ?? ""}
                            onChange={(e) =>
                              updateMilestone("i485", { receiptNumber: normalizeReceipt(e.target.value) })
                            }
                            placeholder="e.g., MSC123..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Filed date</label>
                          <input
                            value={activeCase.milestones.i485.filedDate ?? ""}
                            onChange={(e) =>
                              updateMilestone("i485", { filedDate: normalizeDateInput(e.target.value) })
                            }
                            placeholder="YYYY-MM-DD"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500"
                          />
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-gray-900">EAD (I-765)</div>
                            <select
                              value={activeCase.milestones.i485.ead?.status ?? "not_started"}
                              onChange={(e) => updateNestedMilestone("ead", { status: e.target.value })}
                              className="px-2 py-1 border border-gray-300 rounded text-xs bg-white"
                            >
                              {milestoneStatusOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <input
                            value={activeCase.milestones.i485.ead?.receiptNumber ?? ""}
                            onChange={(e) => updateNestedMilestone("ead", { receiptNumber: normalizeReceipt(e.target.value) })}
                            placeholder="Receipt # (optional)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500"
                          />
                        </div>
                        <div className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-gray-900">Advance Parole (I-131)</div>
                            <select
                              value={activeCase.milestones.i485.ap?.status ?? "not_started"}
                              onChange={(e) => updateNestedMilestone("ap", { status: e.target.value })}
                              className="px-2 py-1 border border-gray-300 rounded text-xs bg-white"
                            >
                              {milestoneStatusOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <input
                            value={activeCase.milestones.i485.ap?.receiptNumber ?? ""}
                            onChange={(e) => updateNestedMilestone("ap", { receiptNumber: normalizeReceipt(e.target.value) })}
                            placeholder="Receipt # (optional)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500"
                          />
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded-xl">
                      Note: USCIS doesn’t provide a stable public API for case status. For now, receipt numbers are stored so we can
                      support one-click status checks in a later iteration.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

