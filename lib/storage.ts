import { FilterState, defaultFilters } from "./filter-paths";
import { CaseProgress, FiledCase, generateCaseId } from "./case-progress";

const STORAGE_KEY = "stateside_user_profile";
const CASE_PROGRESS_KEY = "stateside_case_progress";

export interface UserProfile {
  filters: FilterState;
  completedOnboarding: boolean;
  createdAt: string;
  updatedAt: string;
}

export function saveUserProfile(filters: FilterState): void {
  const profile: UserProfile = {
    filters,
    completedOnboarding: true,
    createdAt: getStoredProfile()?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn("Failed to save user profile to localStorage:", e);
  }
}

export function getStoredProfile(): UserProfile | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const profile = JSON.parse(stored) as UserProfile;

    // Validate the profile has expected structure
    if (!profile.filters || typeof profile.completedOnboarding !== "boolean") {
      return null;
    }

    // Migration: add countryOfBirth for existing users
    if (!profile.filters.countryOfBirth) {
      profile.filters.countryOfBirth = "other";
    }

    // Migration: add isCanadianOrMexicanCitizen for existing users
    if (profile.filters.isCanadianOrMexicanCitizen === undefined) {
      profile.filters.isCanadianOrMexicanCitizen = false;
    }

    // Migration: add priority date fields for existing users
    if (profile.filters.hasApprovedI140 === undefined) {
      profile.filters.hasApprovedI140 = false;
    }
    if (profile.filters.existingPriorityDate === undefined) {
      profile.filters.existingPriorityDate = null;
    }
    if (profile.filters.existingPriorityDateCategory === undefined) {
      profile.filters.existingPriorityDateCategory = null;
    }
    
    // Migration: add needsNewPerm field
    if (profile.filters.needsNewPerm === undefined) {
      profile.filters.needsNewPerm = undefined;
    }

    return profile;
  } catch (e) {
    console.warn("Failed to read user profile from localStorage:", e);
    return null;
  }
}

export function hasCompletedOnboarding(): boolean {
  const profile = getStoredProfile();
  return profile?.completedOnboarding ?? false;
}

export function getStoredFilters(): FilterState {
  const profile = getStoredProfile();
  return profile?.filters ?? defaultFilters;
}

export function clearUserProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("Failed to clear user profile from localStorage:", e);
  }
}

// ============== CASE PROGRESS STORAGE ==============

// Initialize empty case progress
export function createEmptyCaseProgress(): CaseProgress {
  const now = new Date().toISOString();
  return {
    gcProcess: {},
    createdAt: now,
    updatedAt: now,
  };
}

// Save case progress
export function saveCaseProgress(progress: CaseProgress): void {
  try {
    const updated = {
      ...progress,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CASE_PROGRESS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to save case progress to localStorage:", e);
  }
}

// Get stored case progress
export function getStoredCaseProgress(): CaseProgress | null {
  try {
    const stored = localStorage.getItem(CASE_PROGRESS_KEY);
    if (!stored) return null;

    const progress = JSON.parse(stored) as CaseProgress;
    
    // Validate structure
    if (!progress.gcProcess) {
      return null;
    }

    return progress;
  } catch (e) {
    console.warn("Failed to read case progress from localStorage:", e);
    return null;
  }
}

// Get case progress or create empty
export function getCaseProgressOrCreate(): CaseProgress {
  const stored = getStoredCaseProgress();
  if (stored) return stored;
  return createEmptyCaseProgress();
}

// Clear case progress
export function clearCaseProgress(): void {
  try {
    localStorage.removeItem(CASE_PROGRESS_KEY);
  } catch (e) {
    console.warn("Failed to clear case progress from localStorage:", e);
  }
}

// Add or update a filed case in the progress
export function addOrUpdateFiledCase(
  progress: CaseProgress,
  filedCase: FiledCase,
  location: "primaryI140" | "additionalI140" | "pwd" | "perm" | "i485" | "ead" | "advanceParole"
): CaseProgress {
  const updated = { ...progress };
  
  switch (location) {
    case "primaryI140":
      updated.gcProcess = {
        ...updated.gcProcess,
        primaryI140: filedCase,
      };
      break;
      
    case "additionalI140":
      const existing = updated.gcProcess.additionalI140s || [];
      const existingIndex = existing.findIndex(c => c.id === filedCase.id);
      if (existingIndex >= 0) {
        existing[existingIndex] = filedCase;
      } else {
        existing.push(filedCase);
      }
      updated.gcProcess = {
        ...updated.gcProcess,
        additionalI140s: existing,
      };
      break;
      
    case "pwd":
      updated.gcProcess = {
        ...updated.gcProcess,
        permProcess: {
          ...updated.gcProcess.permProcess,
          pwd: filedCase,
        },
      };
      break;
      
    case "perm":
      updated.gcProcess = {
        ...updated.gcProcess,
        permProcess: {
          ...updated.gcProcess.permProcess,
          perm: filedCase,
        },
      };
      break;
      
    case "i485":
      updated.gcProcess = {
        ...updated.gcProcess,
        i485: filedCase,
      };
      break;
      
    case "ead":
      updated.gcProcess = {
        ...updated.gcProcess,
        ead: filedCase,
      };
      break;
      
    case "advanceParole":
      updated.gcProcess = {
        ...updated.gcProcess,
        advanceParole: filedCase,
      };
      break;
  }
  
  updated.updatedAt = new Date().toISOString();
  return updated;
}
