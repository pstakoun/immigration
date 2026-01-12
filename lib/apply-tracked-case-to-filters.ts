import { FilterState } from "@/lib/filter-paths";
import { TrackedCase } from "@/lib/case-types";

function priorityDateFromTrackedCase(c: TrackedCase): { month: number; year: number } | null {
  // For PERM cases, PD is usually the PERM filing date.
  // For NIW/EB-1, PD is the I-140 filing date.
  const candidate = c.permFiledDate || c.i140FiledDate;
  if (!candidate) return null;
  const d = new Date(candidate);
  if (!Number.isFinite(d.getTime())) return null;
  return { month: d.getMonth() + 1, year: d.getFullYear() };
}

/**
 * If a tracked case exists, use it as the source of truth for "existing I-140 + PD"
 * to avoid having two separate flows that get out of sync.
 */
export function applyTrackedCaseToFilters(
  base: FilterState,
  trackedCase: TrackedCase | null
): FilterState {
  if (!trackedCase) return base;

  const pd = priorityDateFromTrackedCase(trackedCase);
  const hasApprovedI140 = !!trackedCase.i140ApprovedDate;

  // Only project into filters when the I-140 is approved (matches current semantics).
  if (!hasApprovedI140 || !pd) {
    return {
      ...base,
      hasApprovedI140: false,
      existingPriorityDate: null,
      existingPriorityDateCategory: null,
    };
  }

  return {
    ...base,
    hasApprovedI140: true,
    existingPriorityDate: pd,
    existingPriorityDateCategory: trackedCase.route === "eb1" ? "eb1" : trackedCase.ebCategory,
  };
}

