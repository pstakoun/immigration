"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import TimelineChart from "@/components/TimelineChart";
import MobileTimelineView from "@/components/MobileTimelineView";
import PathDetail from "@/components/PathDetail";
import ProfileSummary from "@/components/ProfileSummary";
import OnboardingQuiz from "@/components/OnboardingQuiz";
import TrackerPanel from "@/components/TrackerPanel";
import { FilterState, defaultFilters, priorityDateToISOString, parsePriorityDateFromISO } from "@/lib/filter-paths";
import { ComposedPath } from "@/lib/path-composer";
import { getStoredProfile, saveUserProfile } from "@/lib/storage";

// Custom hook for responsive detection
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on mount
    checkMobile();
    
    // Listen for resize
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  return isMobile;
}

// Key for storing progress in localStorage
const PROGRESS_STORAGE_KEY = "stateside_progress_v2";

// Stage tracking data with dates and receipt numbers
export interface StageProgress {
  status: "not_started" | "filed" | "approved";
  filedDate?: string; // YYYY-MM-DD date string
  approvedDate?: string; // YYYY-MM-DD date string
  receiptNumber?: string; // e.g., "EAC2490012345"
  priorityDate?: string; // YYYY-MM-DD date string - for I-140 stage
  notes?: string;
}

// Global progress - stage data is shared across all paths
export interface GlobalProgress {
  selectedPathId: string | null; // Currently selected path to track
  stages: Record<string, StageProgress>; // Global stage progress, keyed by nodeId
  portedPriorityDate?: string | null; // YYYY-MM-DD - from a previous case
  portedPriorityDateCategory?: string | null; // eb1, eb2, eb3
  startedAt: string;
  updatedAt: string;
}

// Legacy type for migration
interface LegacyTrackedPathProgress {
  pathId: string;
  pathName: string;
  stages: Record<string, StageProgress>;
  portedPriorityDate?: string | null;
  portedPriorityDateCategory?: string | null;
  startedAt: string;
  updatedAt: string;
}

function loadProgress(): GlobalProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    
    // Migration from legacy format (had pathId/pathName at top level)
    if (parsed.pathId && parsed.pathName && !parsed.selectedPathId) {
      const legacy = parsed as LegacyTrackedPathProgress;
      return {
        selectedPathId: legacy.pathId,
        stages: legacy.stages,
        portedPriorityDate: legacy.portedPriorityDate,
        portedPriorityDateCategory: legacy.portedPriorityDateCategory,
        startedAt: legacy.startedAt,
        updatedAt: legacy.updatedAt,
      };
    }
    
    return parsed as GlobalProgress;
  } catch {
    return null;
  }
}

function saveProgressToStorage(progress: GlobalProgress | null) {
  if (typeof window === "undefined") return;
  try {
    if (progress) {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } else {
      localStorage.removeItem(PROGRESS_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

export default function Home() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [matchingCount, setMatchingCount] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();
  
  // Global progress state - shared across all paths
  const [globalProgress, setGlobalProgress] = useState<GlobalProgress | null>(null);
  const [selectedPath, setSelectedPath] = useState<ComposedPath | null>(null);
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);

  // Load stored profile and progress on mount
  useEffect(() => {
    const profile = getStoredProfile();
    const storedProgress = loadProgress();
    
    let loadedFilters = profile?.filters || defaultFilters;
    let updatedProgress = storedProgress;
    
    if (profile) {
      setShowOnboarding(false);
    } else {
      setShowOnboarding(true);
    }
    
    // Sync priority dates between profile and progress
    // Profile is the source of truth for priority dates set in onboarding
    const profilePD = loadedFilters.existingPriorityDate;
    const profilePDCategory = loadedFilters.existingPriorityDateCategory;
    const progressPD = storedProgress?.portedPriorityDate;
    
    if (profilePD && profilePDCategory) {
      // Profile has priority date - ensure progress is synced
      const profilePDStr = priorityDateToISOString(profilePD);
      if (storedProgress) {
        // Update progress to match profile if different
        if (progressPD !== profilePDStr || storedProgress.portedPriorityDateCategory !== profilePDCategory) {
          updatedProgress = {
            ...storedProgress,
            portedPriorityDate: profilePDStr,
            portedPriorityDateCategory: profilePDCategory,
            updatedAt: new Date().toISOString(),
          };
        }
      } else {
        // Create progress with the profile's priority date
        updatedProgress = {
          selectedPathId: null,
          stages: {},
          portedPriorityDate: profilePDStr,
          portedPriorityDateCategory: profilePDCategory,
          startedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
    } else if (progressPD && storedProgress?.portedPriorityDateCategory) {
      // Progress has priority date but profile doesn't - sync to profile (legacy data)
      const priorityDate = parsePriorityDateFromISO(progressPD);
      const category = storedProgress.portedPriorityDateCategory;
      if (priorityDate) {
        loadedFilters = {
          ...loadedFilters,
          existingPriorityDate: priorityDate,
          existingPriorityDateCategory: category === "eb1" ? "eb1" : 
                                        category === "eb2" ? "eb2" : 
                                        category === "eb3" ? "eb3" : null,
        };
        // Also save the updated filters to profile
        saveUserProfile(loadedFilters);
      }
    }
    
    if (updatedProgress) {
      setGlobalProgress(updatedProgress);
    }
    
    setFilters(loadedFilters);
    setIsLoaded(true);
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveProgressToStorage(globalProgress);
    }
  }, [globalProgress, isLoaded]);

  const handleMatchingCountChange = useCallback((count: number) => {
    setMatchingCount(count);
  }, []);

  // Update selected path when paths are regenerated (e.g., after filter/PD change)
  const handlePathsGenerated = useCallback((paths: ComposedPath[]) => {
    if (globalProgress?.selectedPathId) {
      // Find the updated version of the selected path
      const updatedPath = paths.find(p => p.id === globalProgress.selectedPathId);
      if (updatedPath) {
        // Always update to ensure we have the latest path data
        // (totalYears may have changed due to filter/PD changes)
        setSelectedPath(updatedPath);
      }
    }
  }, [globalProgress?.selectedPathId]);

  const handleOnboardingComplete = (newFilters: FilterState) => {
    setFilters(newFilters);
    saveUserProfile(newFilters);
    setShowOnboarding(false);
    
    // Sync priority date from onboarding to global progress
    // This ensures the TrackerPanel shows the same priority date
    if (newFilters.existingPriorityDate && newFilters.existingPriorityDateCategory) {
      const pdISOStr = priorityDateToISOString(newFilters.existingPriorityDate);
      setGlobalProgress(prev => {
        const now = new Date().toISOString();
        if (!prev) {
          return {
            selectedPathId: null,
            stages: {},
            portedPriorityDate: pdISOStr,
            portedPriorityDateCategory: newFilters.existingPriorityDateCategory,
            startedAt: now,
            updatedAt: now,
          };
        }
        return {
          ...prev,
          portedPriorityDate: pdISOStr,
          portedPriorityDateCategory: newFilters.existingPriorityDateCategory,
          updatedAt: now,
        };
      });
    } else {
      // User cleared the priority date during onboarding edit, also clear from progress
      // Use functional update to avoid stale closure
      setGlobalProgress(prev => {
        if (!prev || !prev.portedPriorityDate) return prev;
        return {
          ...prev,
          portedPriorityDate: null,
          portedPriorityDateCategory: null,
          updatedAt: new Date().toISOString(),
        };
      });
    }
  };

  const handleEditProfile = () => {
    setShowOnboarding(true);
  };

  // Handle selecting a path to track (or untrack if clicking same path)
  const handleSelectPath = (path: ComposedPath) => {
    // If clicking the currently tracked path, untrack it
    if (globalProgress?.selectedPathId === path.id) {
      setSelectedPath(null);
      setGlobalProgress(prev => prev ? { ...prev, selectedPathId: null } : null);
      setExpandedStageId(null);
      return;
    }
    
    setSelectedPath(path);
    
    // Update selected path in global progress (preserve stage data)
    setGlobalProgress(prev => {
      const now = new Date().toISOString();
      if (!prev) {
        // First time tracking - create new progress
        return {
          selectedPathId: path.id,
          stages: {},
          startedAt: now,
          updatedAt: now,
        };
      }
      // Just update selected path, keep all stage data
      return {
        ...prev,
        selectedPathId: path.id,
        updatedAt: now,
      };
    });
  };

  // Handle updating a stage's progress (global - applies to all paths with this stage)
  const handleUpdateStage = (nodeId: string, update: Partial<StageProgress>) => {
    setGlobalProgress(prev => {
      if (!prev) {
        // Create new progress if none exists
        return {
          selectedPathId: null,
          stages: { [nodeId]: { status: "not_started", ...update } },
          startedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      
      const currentStage = prev.stages[nodeId] || { status: "not_started" };
      const newStage = { ...currentStage, ...update };
      
      return {
        ...prev,
        stages: {
          ...prev.stages,
          [nodeId]: newStage,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  // Handle updating ported priority date (from previous employer's I-140)
  const handleUpdatePortedPD = (date: string | null, category: string | null) => {
    setGlobalProgress(prev => {
      const now = new Date().toISOString();
      if (!prev) {
        return {
          selectedPathId: null,
          stages: {},
          portedPriorityDate: date,
          portedPriorityDateCategory: category,
          startedAt: now,
          updatedAt: now,
        };
      }
      return {
        ...prev,
        portedPriorityDate: date,
        portedPriorityDateCategory: category,
        updatedAt: now,
      };
    });
    
    // Sync to filters for PD wait calculation
    syncPortedPDToFilters(date, category);
  };
  
  // Sync priority date to filters for timeline recalculation
  // IMPORTANT: Ported PD only affects the wait calculation, NOT whether PERM is needed
  // hasApprovedI140 should only be true if user has I-140 with CURRENT employer
  const syncPortedPDToFilters = (dateStr: string | null, category: string | null) => {
    if (!dateStr) {
      // Clear existing PD from filters (but don't change hasApprovedI140)
      const newFilters = {
        ...filters,
        existingPriorityDate: null,
        existingPriorityDateCategory: null,
      };
      setFilters(newFilters);
      saveUserProfile(newFilters);
      return;
    }
    
    // Parse YYYY-MM-DD to PriorityDate format (now includes day)
    const priorityDate = parsePriorityDateFromISO(dateStr);
    if (!priorityDate) {
      console.warn("Invalid priority date format:", dateStr);
      return;
    }
    
    // Map category string to EBCategory
    const ebCategory = category === "eb1" ? "eb1" : 
                       category === "eb2" ? "eb2" : 
                       category === "eb3" ? "eb3" : null;
    
    // NOTE: We set existingPriorityDate but NOT hasApprovedI140
    // This means: "I have a PD to use for wait calculation, but I still need new PERM"
    const newFilters = {
      ...filters,
      existingPriorityDate: priorityDate,
      existingPriorityDateCategory: ebCategory as "eb1" | "eb2" | "eb3" | null,
      // hasApprovedI140 stays unchanged - only set true if current employer I-140
    };
    setFilters(newFilters);
    saveUserProfile(newFilters);
  };

  // Handle stopping tracking (just deselect path, keep stage data)
  const handleStopTracking = () => {
    setGlobalProgress(prev => prev ? { ...prev, selectedPathId: null } : null);
    setSelectedPath(null);
    setExpandedStageId(null);
  };

  // Handle clicking a stage in the timeline
  const handleTimelineStageClick = (nodeId: string) => {
    if (globalProgress?.selectedPathId && selectedPath) {
      // If tracking, expand this stage in the panel/sheet
      setExpandedStageId(nodeId);
      // On mobile, the MobileTimelineView handles showing the editor directly
    } else {
      // Otherwise, show the info panel
      setSelectedNode(nodeId);
    }
  };

  // Calculate progress summary for selected path
  const getProgressSummary = () => {
    if (!globalProgress || !selectedPath) return null;
    
    let total = 0;
    let filed = 0;
    let approved = 0;
    
    for (const stage of selectedPath.stages) {
      if (stage.isPriorityWait || stage.nodeId === "gc") continue;
      total++;
      const sp = globalProgress.stages[stage.nodeId];
      if (sp?.status === "filed") filed++;
      if (sp?.status === "approved") approved++;
    }
    
    return { total, filed, approved, completed: approved };
  };

  const progressSummary = getProgressSummary();

  // Don't render until we've checked localStorage (prevents flash)
  if (!isLoaded) {
    return (
      <main className="h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 rounded-lg bg-brand-500 animate-pulse" />
      </main>
    );
  }

  return (
    <main className="h-screen flex flex-col">
      {/* Onboarding Quiz Modal */}
      {showOnboarding && (
        <OnboardingQuiz
          onComplete={handleOnboardingComplete}
          initialFilters={filters}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Logo */}
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xl font-semibold text-gray-900 tracking-tight">
              Stateside
            </span>
            <span className="text-sm text-gray-300 hidden sm:inline">|</span>
            <Link href="/guides" className="text-sm text-gray-500 hover:text-gray-900 hidden sm:inline transition-colors">Guides</Link>
            <Link href="/processing-times" className="text-sm text-gray-500 hover:text-gray-900 hidden sm:inline transition-colors">Processing Times</Link>
          </div>

          {/* Progress indicator - desktop only when tracking */}
          {globalProgress?.selectedPathId && selectedPath && !isMobile && (
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
                <span className="font-medium">{selectedPath.name}</span>
                {progressSummary && (
                  <span className="text-brand-600">
                    • {progressSummary.approved}/{progressSummary.total} complete
                  </span>
                )}
              </div>
              <button
                onClick={handleStopTracking}
                className="text-gray-400 hover:text-gray-600 p-1"
                title="Stop tracking"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Mobile: Show tracking indicator */}
          {globalProgress?.selectedPathId && selectedPath && isMobile && (
            <div className="flex items-center gap-2 text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg text-sm">
              <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
              <span className="font-medium">
                {progressSummary ? `${progressSummary.approved}/${progressSummary.total}` : "Tracking"}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Profile Summary Bar */}
      <ProfileSummary
        filters={filters}
        matchingCount={matchingCount}
        onEdit={handleEditProfile}
        selectedPathId={globalProgress?.selectedPathId || null}
        completedStagesCount={progressSummary?.approved || 0}
      />

      {/* Main content area with timeline and tracker panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile View */}
        {isMobile ? (
          <MobileTimelineView
            onStageClick={handleTimelineStageClick}
            filters={filters}
            onMatchingCountChange={handleMatchingCountChange}
            onSelectPath={handleSelectPath}
            onPathsGenerated={handlePathsGenerated}
            selectedPathId={globalProgress?.selectedPathId || null}
            globalProgress={globalProgress}
            onUpdateStage={handleUpdateStage}
            onUpdatePortedPD={handleUpdatePortedPD}
            expandedStageId={expandedStageId}
            onExpandStage={setExpandedStageId}
          />
        ) : (
          <>
            {/* Desktop Timeline */}
            <div className={`flex-1 relative overflow-hidden transition-all ${globalProgress?.selectedPathId ? "mr-0" : ""}`}>
              <TimelineChart
                onStageClick={handleTimelineStageClick}
                filters={filters}
                onMatchingCountChange={handleMatchingCountChange}
                onSelectPath={handleSelectPath}
                onPathsGenerated={handlePathsGenerated}
                selectedPathId={globalProgress?.selectedPathId || null}
                globalProgress={globalProgress}
              />
            </div>

            {/* Tracker Panel - shows when a path is selected (desktop only) */}
            {globalProgress && selectedPath && (
              <TrackerPanel
                path={selectedPath}
                progress={globalProgress}
                onUpdateStage={handleUpdateStage}
                onUpdatePortedPD={handleUpdatePortedPD}
                onClose={() => setSelectedPath(null)}
                expandedStageId={expandedStageId}
                onExpandStage={setExpandedStageId}
              />
            )}
          </>
        )}

        {/* Slide-out detail panel for stage info (only when not tracking) */}
        {selectedNode && !globalProgress?.selectedPathId && (
          <>
            <div
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setSelectedNode(null)}
            />
            <PathDetail nodeId={selectedNode} onClose={() => setSelectedNode(null)} />
          </>
        )}
      </div>

      {/* FAQ Section — targets featured snippets */}
      <JsonLd
        data={{
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How long does it take to get a green card from H-1B?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "For most countries, the H-1B to green card process takes about 3-4 years: ~2 years for PERM labor certification, 15 days for I-140 (premium processing), and 10-18 months for I-485 adjustment of status. For Indian nationals, add years of priority date wait due to visa backlogs.",
              },
            },
            {
              "@type": "Question",
              name: "What is a priority date for immigration?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Your priority date is your place in line for a green card. For employer-sponsored cases, it's the date the DOL receives your PERM application. For self-petitions (EB-1A, NIW), it's when USCIS receives your I-140. The visa bulletin shows which priority dates can currently file I-485.",
              },
            },
            {
              "@type": "Question",
              name: "Can I self-sponsor my own green card?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, through EB-2 National Interest Waiver (NIW) or EB-1A extraordinary ability. Both skip the PERM labor certification and don't require an employer sponsor. NIW requires a master's degree (or bachelor's + 5 years experience) and proof your work benefits the US.",
              },
            },
            {
              "@type": "Question",
              name: "What is the fastest way to get a US green card through employment?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "EB-1A (extraordinary ability) and EB-1C (multinational manager via L-1A) are the fastest employment-based paths — no PERM required, and EB-1 priority dates are usually current. EB-2 NIW is also fast since it skips PERM. For most countries, these can be completed in 1-2 years.",
              },
            },
            {
              "@type": "Question",
              name: "How do I read the visa bulletin?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The visa bulletin shows two charts: Final Action Dates and Dates for Filing. Find your employment category (EB-1, EB-2, EB-3) and country of birth. If it shows 'C' (Current), you can file immediately. If it shows a date, your priority date must be before that date to proceed.",
              },
            },
            {
              "@type": "Question",
              name: "What is the difference between EB-2 and EB-3?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "EB-2 requires a master's degree or bachelor's plus 5 years of progressive experience. EB-3 requires a bachelor's degree. Both go through the same PERM process. EB-2 historically has shorter backlogs, but sometimes EB-3 moves faster — you can downgrade from EB-2 to EB-3 and keep your priority date.",
              },
            },
          ],
        }}
      />
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-5">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">How long does it take to get a green card from H-1B?</h3>
              <p className="text-sm text-gray-600">
                For most countries, about 3-4 years: ~2 years for PERM, 15 days for I-140 (premium), and 10-18 months 
                for I-485. Indian nationals face additional years of{" "}
                <Link href="/guides/visa-bulletin-explained" className="text-brand-600 hover:text-brand-700">priority date wait</Link>.{" "}
                <Link href="/guides/h1b-to-green-card" className="text-brand-600 hover:text-brand-700">Read the full guide →</Link>
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">What is a priority date for immigration?</h3>
              <p className="text-sm text-gray-600">
                Your place in line for a green card. For PERM-based cases, it&apos;s when DOL receives your application. 
                For self-petitions (EB-1A, NIW), it&apos;s when USCIS receives your I-140.{" "}
                <Link href="/guides/visa-bulletin-explained" className="text-brand-600 hover:text-brand-700">How the visa bulletin works →</Link>
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Can I self-sponsor my own green card?</h3>
              <p className="text-sm text-gray-600">
                Yes — through{" "}
                <Link href="/guides/eb2-niw" className="text-brand-600 hover:text-brand-700">EB-2 NIW</Link> or{" "}
                <Link href="/guides/o1-visa-guide" className="text-brand-600 hover:text-brand-700">EB-1A extraordinary ability</Link>. 
                Both skip PERM and don&apos;t require an employer sponsor.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">What is the fastest employment-based green card path?</h3>
              <p className="text-sm text-gray-600">
                <Link href="/guides/o1-visa-guide" className="text-brand-600 hover:text-brand-700">EB-1A</Link> and{" "}
                <Link href="/guides/l1-to-green-card" className="text-brand-600 hover:text-brand-700">EB-1C (via L-1A)</Link>{" "}
                are fastest — no PERM, and EB-1 dates are usually current. Can be done in 1-2 years for most countries.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">How do I read the visa bulletin?</h3>
              <p className="text-sm text-gray-600">
                Find your category (EB-1/2/3) and country of birth. &quot;C&quot; means current — file immediately. 
                A date means your priority date must be earlier to proceed.{" "}
                <Link href="/guides/visa-bulletin-explained" className="text-brand-600 hover:text-brand-700">Full explanation →</Link>
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">What is the difference between EB-2 and EB-3?</h3>
              <p className="text-sm text-gray-600">
                EB-2 needs a master&apos;s (or bachelor&apos;s + 5 years experience). EB-3 needs a bachelor&apos;s. 
                Same PERM process. You can downgrade from EB-2 to EB-3 and keep your priority date if EB-3 is moving faster.{" "}
                <Link href="/guides/h1b-to-green-card" className="text-brand-600 hover:text-brand-700">Learn more →</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Screen reader only - detailed description for accessibility and AI crawlers */}
      <div className="sr-only" aria-label="About Stateside">
        <h2>What is Stateside?</h2>
        <p>
          Stateside is a free interactive tool that helps immigrants find their fastest path to a US green card.
          It shows personalized immigration pathways based on your current visa status, education, work experience,
          and country of birth.
        </p>
        <h3>Features</h3>
        <ul>
          <li>Live USCIS processing times updated daily</li>
          <li>Visa bulletin priority dates from the Department of State</li>
          <li>DOL PERM labor certification timelines</li>
          <li>H-1B, TN, L-1, O-1 work visa pathways</li>
          <li>EB-1, EB-2, EB-3 employment-based green card timelines</li>
          <li>EB-2 NIW (National Interest Waiver) eligibility</li>
          <li>Marriage-based green card timelines</li>
          <li>India and China green card backlog estimates</li>
          <li>Concurrent filing eligibility checker</li>
          <li>Priority date portability calculator</li>
        </ul>
        <h3>Who is this for?</h3>
        <p>
          Stateside is designed for professionals on H-1B, TN, L-1, O-1 visas, F-1 students on OPT,
          and anyone exploring US immigration options. It helps you understand your green card timeline
          before consulting with an immigration attorney.
        </p>
      </div>
    </main>
  );
}
