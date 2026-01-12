// Case Progress Tracking System
// Tracks filed cases, receipt numbers, dates, and status for immigration processes
//
// This system addresses key pain points:
// 1. Users with approved I-140 don't need PERM again (unless switching employers)
// 2. Existing priority dates continue to "age" while new processes cook
// 3. Accurate timeline calculations based on actual case status
// 4. Support for USCIS case number tracking (G-numbers, receipt numbers)

import { EBCategory, PriorityDate, formatPriorityDateShort } from "./filter-paths";

// ============== CASE TYPES ==============

// USCIS Receipt Number format: ABC1234567890 (3 letters + 10 digits)
// Example: SRC2412345678 (Texas Service Center)
// IOE = online filing, SRC = Texas, LIN = Nebraska, NSC = Nebraska, etc.
export type ReceiptNumber = string;

// Case status based on USCIS case status terminology
export type CaseStatus =
  | "not_started"       // Haven't filed yet
  | "pending"           // Filed, waiting for decision
  | "rfe_issued"        // Request for Evidence issued
  | "rfe_response_filed" // RFE response submitted
  | "approved"          // Case approved
  | "denied"            // Case denied
  | "withdrawn";        // Case withdrawn

// Form types we track
export type FormType =
  // Work Authorization
  | "i129_h1b"      // H-1B petition
  | "i129_tn"       // TN petition (if filed via I-129, not at border)
  | "i129_l1"       // L-1 petition
  | "i129_o1"       // O-1 petition
  | "i765_opt"      // OPT EAD
  | "i765_aos"      // EAD based on pending I-485
  // Green Card Process (PERM)
  | "eta9141"       // Prevailing Wage Determination
  | "eta9089"       // PERM Labor Certification
  // Green Card Process (I-140)
  | "i140_eb1a"     // EB-1A Extraordinary Ability
  | "i140_eb1b"     // EB-1B Outstanding Researcher
  | "i140_eb1c"     // EB-1C Multinational Executive
  | "i140_eb2"      // EB-2 Advanced Degree
  | "i140_eb2niw"   // EB-2 NIW
  | "i140_eb3"      // EB-3 Skilled Worker
  // Green Card Process (Final)
  | "i485"          // Adjustment of Status
  | "i131"          // Advance Parole
  // Marriage-based
  | "i130"          // Petition for Alien Relative
  | "i751"          // Remove Conditions
  // EB-5
  | "i526"          // EB-5 Petition
  | "i829";         // Remove Conditions (EB-5)

// Individual filed case
export interface FiledCase {
  id: string;                    // Unique identifier (uuid)
  formType: FormType;
  receiptNumber?: ReceiptNumber; // USCIS receipt number (if applicable)
  dolCaseNumber?: string;        // DOL case number (for PERM, PWD)
  filedDate?: string;            // ISO date when filed
  approvedDate?: string;         // ISO date when approved
  status: CaseStatus;
  priorityDate?: PriorityDate;   // Priority date (for I-140s)
  ebCategory?: EBCategory;       // EB category (for I-140s)
  employer?: string;             // Sponsoring employer name
  notes?: string;                // User notes
  lastChecked?: string;          // Last time we checked status
  // For PERM: Track PWD wage level and job details
  wageLevel?: 1 | 2 | 3 | 4;
  jobTitle?: string;
}

// The complete user case portfolio
export interface CaseProgress {
  // Work authorization history
  currentWorkStatus?: {
    type: "f1" | "opt" | "h1b" | "tn" | "l1" | "o1" | "other";
    validUntil?: string;    // ISO date
    receiptNumber?: ReceiptNumber;
    extension?: {
      filedDate: string;
      receiptNumber?: ReceiptNumber;
      status: CaseStatus;
    };
  };

  // Green card process status
  gcProcess: {
    // Which path are they on?
    pathType?: "perm_eb2" | "perm_eb3" | "eb1a" | "eb1b" | "eb1c" | "eb2niw" | "marriage" | "eb5" | "none";
    
    // Primary I-140 (the one that gave them their priority date)
    primaryI140?: FiledCase;
    
    // Additional I-140s (for backup, category upgrade, etc.)
    additionalI140s?: FiledCase[];
    
    // PERM process
    permProcess?: {
      pwd?: FiledCase;
      recruitment?: {
        startDate?: string;
        endDate?: string;
        status: "not_started" | "in_progress" | "complete";
      };
      perm?: FiledCase;
    };
    
    // I-485 (Adjustment of Status)
    i485?: FiledCase;
    
    // Associated benefits while I-485 pending
    ead?: FiledCase;           // I-765 work permit
    advanceParole?: FiledCase; // I-131 travel permit
    
    // Concurrent filing indicator
    isConcurrentFiling?: boolean;
  };

  // Marriage-based specific
  marriageProcess?: {
    i130?: FiledCase;
    i485?: FiledCase;
    i751?: FiledCase;  // Remove conditions
  };

  // EB-5 specific
  eb5Process?: {
    i526?: FiledCase;
    i485?: FiledCase;
    i829?: FiledCase;
  };

  // User's "effective" priority date (the best one they have)
  effectivePriorityDate?: PriorityDate;
  effectiveEBCategory?: EBCategory;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ============== HELPER FUNCTIONS ==============

// Generate a unique ID for a filed case
export function generateCaseId(): string {
  return `case_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Validate USCIS receipt number format
export function isValidReceiptNumber(receipt: string): boolean {
  // Format: 3 letters (service center) + 10 digits
  // Common prefixes: SRC, LIN, NBC, IOE, WAC, EAC, MSC, YSC
  return /^[A-Z]{3}\d{10}$/i.test(receipt);
}

// Parse receipt number to extract service center
export function parseReceiptNumber(receipt: string): {
  serviceCenter: string;
  caseNumber: string;
  isValid: boolean;
} {
  const match = receipt.match(/^([A-Z]{3})(\d{10})$/i);
  if (!match) {
    return { serviceCenter: "", caseNumber: "", isValid: false };
  }
  
  const serviceCenters: Record<string, string> = {
    SRC: "Texas Service Center",
    LIN: "Nebraska Service Center",
    NSC: "Nebraska Service Center",
    NBC: "National Benefits Center",
    WAC: "California Service Center",
    EAC: "Vermont Service Center",
    IOE: "USCIS Online",
    MSC: "Missouri Service Center",
    YSC: "Potomac Service Center",
  };
  
  return {
    serviceCenter: serviceCenters[match[1].toUpperCase()] || match[1],
    caseNumber: match[2],
    isValid: true,
  };
}

// Calculate the "effective" priority date from all I-140s
// Rules:
// - The priority date is the EARLIEST approved I-140 filing date
// - A later I-140 in a higher category can use the earlier PD (portability)
// - Pending I-140s don't establish a PD until approved
export function calculateEffectivePriorityDate(
  gcProcess: CaseProgress["gcProcess"]
): { date: PriorityDate; category: EBCategory } | null {
  const approvedI140s: { date: PriorityDate; category: EBCategory }[] = [];

  // Check primary I-140
  if (gcProcess.primaryI140?.status === "approved" && gcProcess.primaryI140.priorityDate) {
    approvedI140s.push({
      date: gcProcess.primaryI140.priorityDate,
      category: gcProcess.primaryI140.ebCategory || "eb2",
    });
  }

  // Check additional I-140s
  if (gcProcess.additionalI140s) {
    for (const i140 of gcProcess.additionalI140s) {
      if (i140.status === "approved" && i140.priorityDate) {
        approvedI140s.push({
          date: i140.priorityDate,
          category: i140.ebCategory || "eb2",
        });
      }
    }
  }

  if (approvedI140s.length === 0) return null;

  // Find the earliest priority date
  approvedI140s.sort((a, b) => {
    const dateA = new Date(a.date.year, a.date.month - 1);
    const dateB = new Date(b.date.year, b.date.month - 1);
    return dateA.getTime() - dateB.getTime();
  });

  // Return the earliest date, but find the best category for it
  // (PD is portable to any category, so use the highest category if applicable)
  const earliestDate = approvedI140s[0].date;
  
  // Find the highest category (eb1 > eb2 > eb3)
  const categoryRank: Record<EBCategory, number> = { eb1: 3, eb2: 2, eb3: 1 };
  let bestCategory = approvedI140s[0].category;
  
  for (const i140 of approvedI140s) {
    if (categoryRank[i140.category] > categoryRank[bestCategory]) {
      bestCategory = i140.category;
    }
  }

  return { date: earliestDate, category: bestCategory };
}

// Calculate months until priority date becomes current
// This accounts for velocity - how fast the bulletin moves
export function calculateRemainingWait(
  priorityDate: PriorityDate,
  currentCutoff: string,
  velocityMonthsPerYear: number
): { months: number; display: string; isCurrent: boolean } {
  // Parse cutoff
  if (currentCutoff.toLowerCase() === "current") {
    return { months: 0, display: "Current", isCurrent: true };
  }

  const shortMonths: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  };

  const parts = currentCutoff.split(" ");
  if (parts.length !== 2) {
    return { months: 0, display: "Unknown", isCurrent: false };
  }

  const cutoffMonth = shortMonths[parts[0].toLowerCase().slice(0, 3)];
  const cutoffYear = parseInt(parts[1], 10);

  if (cutoffMonth === undefined || isNaN(cutoffYear)) {
    return { months: 0, display: "Unknown", isCurrent: false };
  }

  // Calculate months between PD and cutoff
  const pdDate = new Date(priorityDate.year, priorityDate.month - 1);
  const cutoffDate = new Date(cutoffYear, cutoffMonth);

  // If PD is on or before cutoff, we're current
  if (pdDate <= cutoffDate) {
    return { months: 0, display: "Current", isCurrent: true };
  }

  // Calculate months behind
  const monthsBehind = 
    (pdDate.getFullYear() - cutoffDate.getFullYear()) * 12 +
    (pdDate.getMonth() - cutoffDate.getMonth());

  // Apply velocity: if bulletin moves 8 months per year, 
  // wait = monthsBehind * (12 / 8)
  const waitMultiplier = 12 / velocityMonthsPerYear;
  const estimatedMonths = Math.round(monthsBehind * waitMultiplier);

  // Format display
  let display: string;
  if (estimatedMonths < 12) {
    display = `~${estimatedMonths} months`;
  } else {
    const years = Math.round(estimatedMonths / 12 * 10) / 10;
    display = `~${years} years`;
  }

  return { months: estimatedMonths, display, isCurrent: false };
}

// Determine what steps remain based on current case progress
export interface RemainingStep {
  id: string;
  name: string;
  status: "complete" | "pending" | "not_started" | "optional";
  estimatedMonths?: number;
  note?: string;
  filedCase?: FiledCase;
}

export function calculateRemainingSteps(progress: CaseProgress): RemainingStep[] {
  const steps: RemainingStep[] = [];
  const gc = progress.gcProcess;

  // If no GC process defined, return empty (they should set up their case first)
  if (!gc.pathType || gc.pathType === "none") {
    return [];
  }

  // PERM-based paths (EB-2, EB-3 with employer sponsorship)
  if (gc.pathType === "perm_eb2" || gc.pathType === "perm_eb3") {
    // PWD step
    if (gc.permProcess?.pwd) {
      steps.push({
        id: "pwd",
        name: "Prevailing Wage (PWD)",
        status: gc.permProcess.pwd.status === "approved" ? "complete" : "pending",
        filedCase: gc.permProcess.pwd,
      });
    } else {
      steps.push({
        id: "pwd",
        name: "Prevailing Wage (PWD)",
        status: "not_started",
        estimatedMonths: 6,
      });
    }

    // Recruitment step
    if (gc.permProcess?.recruitment) {
      const recruitStatus = gc.permProcess.recruitment.status;
      steps.push({
        id: "recruitment",
        name: "Recruitment (30+ days)",
        status: recruitStatus === "complete" ? "complete" : 
                recruitStatus === "in_progress" ? "pending" : "not_started",
        estimatedMonths: 3,
      });
    } else {
      steps.push({
        id: "recruitment",
        name: "Recruitment (30+ days)",
        status: "not_started",
        estimatedMonths: 3,
      });
    }

    // PERM step
    if (gc.permProcess?.perm) {
      steps.push({
        id: "perm",
        name: "PERM Labor Certification",
        status: gc.permProcess.perm.status === "approved" ? "complete" : "pending",
        filedCase: gc.permProcess.perm,
        estimatedMonths: 17,
      });
    } else {
      steps.push({
        id: "perm",
        name: "PERM Labor Certification",
        status: "not_started",
        estimatedMonths: 17,
      });
    }
  }

  // I-140 step
  if (gc.primaryI140) {
    const pd = gc.primaryI140.priorityDate;
    let note = "";
    if (pd) {
      note = `PD: ${formatPriorityDateShort(pd)}`;
    }
    
    steps.push({
      id: "i140",
      name: `I-140 (${gc.primaryI140.ebCategory?.toUpperCase() || "EB"})`,
      status: gc.primaryI140.status === "approved" ? "complete" : "pending",
      filedCase: gc.primaryI140,
      note,
    });
  } else if (gc.pathType !== "marriage") {
    // No I-140 filed yet (not applicable for marriage)
    const categoryMap: Record<string, string> = {
      perm_eb2: "EB-2",
      perm_eb3: "EB-3",
      eb1a: "EB-1A",
      eb1b: "EB-1B",
      eb1c: "EB-1C",
      eb2niw: "EB-2 NIW",
      eb5: "EB-5",
    };
    
    steps.push({
      id: "i140",
      name: `I-140 (${categoryMap[gc.pathType] || "EB"})`,
      status: "not_started",
      estimatedMonths: 1, // With premium processing
      note: "15 days with premium processing",
    });
  }

  // Priority Date Wait (only if I-140 approved and backlogged)
  if (gc.primaryI140?.status === "approved" && progress.effectivePriorityDate) {
    // This step is calculated dynamically based on visa bulletin
    steps.push({
      id: "pd_wait",
      name: "Priority Date Wait",
      status: "pending", // Will be updated based on actual bulletin
      note: `Your PD: ${formatPriorityDateShort(progress.effectivePriorityDate)}`,
    });
  }

  // I-485 step
  if (gc.i485) {
    let note = "";
    if (gc.i485.status === "pending") {
      note = "EAD/AP available while pending";
    }
    
    steps.push({
      id: "i485",
      name: "I-485 (Adjustment of Status)",
      status: gc.i485.status === "approved" ? "complete" : 
              gc.i485.status === "pending" ? "pending" : "not_started",
      filedCase: gc.i485,
      note,
    });
  } else {
    steps.push({
      id: "i485",
      name: "I-485 (Adjustment of Status)",
      status: "not_started",
      estimatedMonths: 14,
    });
  }

  // Green Card (final step)
  if (gc.i485?.status === "approved") {
    steps.push({
      id: "gc",
      name: "Green Card",
      status: "complete",
      note: "Congratulations!",
    });
  } else {
    steps.push({
      id: "gc",
      name: "Green Card",
      status: "not_started",
    });
  }

  return steps;
}

// Calculate how much your PD has "aged" (moved closer to current) over a time period
// This is for the scenario: "Your PD continues ticking while new PERM cooks"
export function calculatePDAging(
  priorityDate: PriorityDate,
  monthsElapsed: number,
  velocityMonthsPerYear: number
): number {
  // If bulletin moves at X months per year, then in Y months elapsed,
  // the cutoff moves forward by: Y * (X / 12) months
  const cutoffAdvancement = monthsElapsed * (velocityMonthsPerYear / 12);
  return Math.round(cutoffAdvancement);
}

// ============== FORM DISPLAY HELPERS ==============

export const formTypeLabels: Record<FormType, string> = {
  i129_h1b: "I-129 (H-1B)",
  i129_tn: "I-129 (TN)",
  i129_l1: "I-129 (L-1)",
  i129_o1: "I-129 (O-1)",
  i765_opt: "I-765 (OPT EAD)",
  i765_aos: "I-765 (AOS EAD)",
  eta9141: "ETA-9141 (PWD)",
  eta9089: "ETA-9089 (PERM)",
  i140_eb1a: "I-140 (EB-1A)",
  i140_eb1b: "I-140 (EB-1B)",
  i140_eb1c: "I-140 (EB-1C)",
  i140_eb2: "I-140 (EB-2)",
  i140_eb2niw: "I-140 (EB-2 NIW)",
  i140_eb3: "I-140 (EB-3)",
  i485: "I-485 (AOS)",
  i131: "I-131 (Advance Parole)",
  i130: "I-130 (Family Petition)",
  i751: "I-751 (Remove Conditions)",
  i526: "I-526 (EB-5 Petition)",
  i829: "I-829 (Remove Conditions)",
};

export const caseStatusLabels: Record<CaseStatus, string> = {
  not_started: "Not Started",
  pending: "Pending",
  rfe_issued: "RFE Issued",
  rfe_response_filed: "RFE Response Filed",
  approved: "Approved",
  denied: "Denied",
  withdrawn: "Withdrawn",
};

export const caseStatusColors: Record<CaseStatus, { bg: string; text: string }> = {
  not_started: { bg: "bg-gray-100", text: "text-gray-600" },
  pending: { bg: "bg-blue-100", text: "text-blue-700" },
  rfe_issued: { bg: "bg-amber-100", text: "text-amber-700" },
  rfe_response_filed: { bg: "bg-yellow-100", text: "text-yellow-700" },
  approved: { bg: "bg-green-100", text: "text-green-700" },
  denied: { bg: "bg-red-100", text: "text-red-700" },
  withdrawn: { bg: "bg-gray-100", text: "text-gray-500" },
};
