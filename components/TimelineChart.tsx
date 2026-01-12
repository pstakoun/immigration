"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import visaData from "@/data/visa-paths.json";
import { FilterState, statusToNodeId } from "@/lib/filter-paths";
import { generatePaths, ComposedStage, setProcessingTimes } from "@/lib/path-composer";
import { adaptDynamicData, ProcessingTimes } from "@/lib/processing-times";
import { DynamicData } from "@/lib/dynamic-data";
import { trackStageClick, trackPathsGenerated } from "@/lib/analytics";
import { TrackedCase } from "@/lib/case-types";
import { buildTrackedCasePath } from "@/lib/case-timeline";

const PIXELS_PER_YEAR = 160;
const MAX_YEARS = 8;
const TRACK_HEIGHT = 32;
const TRACK_GAP = 6;
const CONCURRENT_OFFSET = 36;

interface TimelineChartProps {
  onStageClick: (nodeId: string) => void;
  filters: FilterState;
  onMatchingCountChange: (count: number) => void;
  trackedCase?: TrackedCase | null;
  onTrackedCaseUpdate?: (nextCase: TrackedCase) => void;
}

const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  entry: { bg: "bg-brand-600", border: "border-brand-700", text: "text-white" },
  work: { bg: "bg-emerald-500", border: "border-emerald-600", text: "text-white" },
  greencard: { bg: "bg-amber-500", border: "border-amber-600", text: "text-white" },
  citizenship: { bg: "bg-purple-500", border: "border-purple-600", text: "text-white" },
};

const trackLabels: Record<string, string> = {
  status: "Status",
  gc: "GC Process",
};


export default function TimelineChart({
  onStageClick,
  filters,
  onMatchingCountChange,
  trackedCase,
  onTrackedCaseUpdate,
}: TimelineChartProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [processingTimesLoaded, setProcessingTimesLoaded] = useState(false);
  const [processingTimes, setProcessingTimesState] = useState<ProcessingTimes | null>(null);
  const [priorityDates, setPriorityDates] = useState<DynamicData["priorityDates"] | undefined>(undefined);
  const [datesForFiling, setDatesForFiling] = useState<DynamicData["datesForFiling"] | undefined>(undefined);

  // Fetch processing times on mount
  useEffect(() => {
    async function fetchTimes() {
      try {
        const response = await fetch("/api/processing-times");
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const adapted = adaptDynamicData(result.data);
            setProcessingTimes(adapted);
            setProcessingTimesState(adapted);
            // Final Action Dates - for determining when case will be approved
            setPriorityDates(result.data.priorityDates);
            // Dates for Filing - for determining when you can submit I-485
            setDatesForFiling(result.data.datesForFiling);
            setProcessingTimesLoaded(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch processing times:", error);
      }
    }
    fetchTimes();
  }, []);

  const years = Array.from({ length: MAX_YEARS + 1 }, (_, i) => i);

  // Get current status node for "you are here" highlighting
  const currentNodeId = statusToNodeId[filters.currentStatus];

  // Generate paths dynamically using the composer
  // Re-generate when processing times or priority dates are updated
  const paths = useMemo(() => {
    const generatedPaths = generatePaths(filters, priorityDates, datesForFiling);
    onMatchingCountChange(generatedPaths.length);
    return generatedPaths;
  }, [filters, onMatchingCountChange, priorityDates, datesForFiling]);

  const trackedPath = useMemo(() => {
    if (!trackedCase || !processingTimes) return null;
    try {
      return buildTrackedCasePath({
        trackedCase,
        processingTimes,
        finalActionDates: priorityDates,
        datesForFiling,
      });
    } catch (e) {
      console.error("Failed to build tracked case path:", e);
      return null;
    }
  }, [trackedCase, processingTimes, priorityDates, datesForFiling]);

  const plannedPathId = trackedCase?.plannedPathId ?? null;

  // If a plan is set, auto-select it for clarity.
  useEffect(() => {
    if (plannedPathId) setSelectedPath(plannedPathId);
  }, [plannedPathId]);

  const plannedPath = useMemo(() => {
    if (!plannedPathId) return null;
    return paths.find((p) => p.id === plannedPathId) ?? null;
  }, [plannedPathId, paths]);

  const getNextStepLabel = useCallback((): string | null => {
    if (!trackedCase) return null;
    if (trackedCase.i485ApprovedDate) return "Done (green card approved)";
    if (!trackedCase.i485FiledDate) {
      if (!trackedCase.i140FiledDate) {
        if (trackedCase.route === "perm") {
          if (!trackedCase.permFiledDate) return "Start/finish PERM prep (PWD + recruitment → file PERM)";
          if (!trackedCase.permApprovedDate) return "Wait for PERM decision";
          return "File I-140";
        }
        return "File I-140";
      }
      if (!trackedCase.i140ApprovedDate) return "Wait for I-140 decision";
      return "File I-485 when Dates for Filing is current";
    }
    return "Wait for I-485 approval (and Final Action date, if backlogged)";
  }, [trackedCase]);

  function getStageProgress(nodeId: string): "done" | "in_progress" | null {
    if (!trackedCase) return null;
    const isDone = (done?: string) => !!done;
    const isStarted = (start?: string) => !!start;

    switch (nodeId) {
      case "pwd":
        return isDone(trackedCase.pwdIssuedDate) ? "done" : isStarted(trackedCase.pwdFiledDate) ? "in_progress" : null;
      case "recruit":
        // Consider "done" when PERM filed, "in progress" when recruitment started.
        return isDone(trackedCase.permFiledDate) ? "done" : isStarted(trackedCase.recruitmentStartDate) ? "in_progress" : null;
      case "perm":
        return isDone(trackedCase.permApprovedDate) ? "done" : isStarted(trackedCase.permFiledDate) ? "in_progress" : null;
      case "i140":
      case "eb1":
      case "eb2niw":
        return isDone(trackedCase.i140ApprovedDate) ? "done" : isStarted(trackedCase.i140FiledDate) ? "in_progress" : null;
      case "i485":
        return isDone(trackedCase.i485ApprovedDate) ? "done" : isStarted(trackedCase.i485FiledDate) ? "in_progress" : null;
      default:
        return null;
    }
  }

  // Track paths generated for analytics (debounced to avoid duplicate events)
  const lastTrackedFilters = useRef<string>("");
  useEffect(() => {
    if (paths.length > 0) {
      // Create a simple hash of filter values to detect actual changes
      const filterHash = `${filters.education}-${filters.experience}-${filters.countryOfBirth}-${paths.length}`;
      if (filterHash !== lastTrackedFilters.current) {
        lastTrackedFilters.current = filterHash;
        trackPathsGenerated(paths.length, filters);
      }
    }
  }, [paths.length, filters]);

  // Handle stage click with analytics tracking
  const handleStageClick = useCallback(
    (nodeId: string) => {
      const node = getNode(nodeId);
      const nodeName = node?.name || nodeId;
      trackStageClick(nodeId, nodeName);
      onStageClick(nodeId);
    },
    [onStageClick]
  );

  // Check if a path has multiple tracks
  const hasMultipleTracks = (stages: ComposedStage[]) => {
    const tracks = new Set(stages.map((s) => s.track));
    return tracks.size > 1;
  };

  // Check if a path has concurrent GC stages (for extra height)
  const hasConcurrentStages = (stages: ComposedStage[]) => {
    return stages.some((s) => s.isConcurrent);
  };

  // Get node info from visa data
  const getNode = (nodeId: string) => {
    return visaData.nodes[nodeId as keyof typeof visaData.nodes];
  };

  return (
    <div className="w-full h-full overflow-x-auto overflow-y-auto bg-gray-50">
      <div className="min-w-[1200px] p-6">
        {/* Year markers */}
        <div className="flex mb-2" style={{ marginLeft: "220px" }}>
          {years.map((year) => (
            <div
              key={year}
              className="text-xs text-gray-500 font-medium"
              style={{ width: PIXELS_PER_YEAR, flexShrink: 0 }}
            >
              {year === 0 ? "Start" : `Year ${year}`}
            </div>
          ))}
        </div>

        {/* Grid lines */}
        <div
          className="relative border-l border-gray-300"
          style={{ marginLeft: "220px" }}
        >
          <div className="absolute inset-0 flex pointer-events-none">
            {years.map((year) => (
              <div
                key={year}
                className="border-l border-gray-200"
                style={{ width: PIXELS_PER_YEAR, flexShrink: 0 }}
              />
            ))}
          </div>

          {/* Path lanes */}
          <div className="relative py-4">
            {trackedPath && (
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div className="text-sm font-semibold text-gray-900">
                    Your case: {trackedPath.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    Estimated remaining: {trackedPath.totalYears.display}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-xs text-gray-600">
                    {plannedPath ? (
                      <span>
                        My plan: <span className="font-semibold text-gray-900">{plannedPath.name}</span>
                      </span>
                    ) : (
                      <span>
                        Pick a path below and pin it as <span className="font-semibold text-gray-900">My plan</span> for clearer “what’s next”.
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600">
                    Next: <span className="font-semibold text-gray-900">{getNextStepLabel() ?? "—"}</span>
                  </div>
                </div>
              </div>
            )}
            {paths.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                <p className="text-lg font-medium">No matching paths</p>
                <p className="text-sm mt-1">
                  Try adjusting your criteria to see available immigration paths.
                </p>
              </div>
            )}
            {(() => {
              const base = [...paths];
              if (plannedPathId) {
                base.sort((a, b) => (a.id === plannedPathId ? -1 : b.id === plannedPathId ? 1 : 0));
              }
              const all = [...(trackedPath ? [trackedPath] : []), ...base];
              return all;
            })().map((path) => {
              const isSelected = selectedPath === path.id;
              const isDimmed = selectedPath !== null && !isSelected;
              const multiTrack = hasMultipleTracks(path.stages);
              const hasConcurrent = hasConcurrentStages(path.stages);
              const isPlanned = plannedPathId !== null && path.id === plannedPathId;
              const canPin = !!trackedCase && path.id !== trackedPath?.id;
              // Add extra height if we have concurrent stages that need offset
              const pathHeight = multiTrack
                ? TRACK_HEIGHT * 2 + TRACK_GAP + (hasConcurrent ? CONCURRENT_OFFSET : 0)
                : TRACK_HEIGHT;

              return (
                <div
                  key={path.id}
                  className={`relative transition-opacity duration-200 mb-6 ${
                    isDimmed ? "opacity-40" : "opacity-100"
                  }`}
                  style={{ height: pathHeight + 24 }}
                >
                  {/* Path header - positioned to the left */}
                  <div
                    className="absolute right-full mr-4 top-0 w-[200px] text-right cursor-pointer"
                    onClick={() =>
                      setSelectedPath(selectedPath === path.id ? null : path.id)
                    }
                  >
                    <div className="font-semibold text-gray-900 text-sm">
                      {path.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {path.totalYears.display}
                      {path.estimatedCost > 0 ? ` · $${path.estimatedCost.toLocaleString()}` : ""}
                    </div>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                      <span className="text-[10px] text-brand-600 font-medium">
                        {path.gcCategory}
                      </span>
                      {canPin && onTrackedCaseUpdate && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTrackedCaseUpdate({
                              ...trackedCase!,
                              plannedPathId: isPlanned ? null : path.id,
                            });
                          }}
                          className={`text-[9px] px-1 rounded border ${
                            isPlanned
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {isPlanned ? "my plan" : "set plan"}
                        </button>
                      )}
                      {path.hasLottery && (
                        <span className="text-[9px] bg-amber-100 text-amber-700 px-1 rounded">
                          lottery
                        </span>
                      )}
                      {path.isSelfPetition && (
                        <span className="text-[9px] bg-green-100 text-green-700 px-1 rounded">
                          self-file
                        </span>
                      )}
                    </div>
                    {multiTrack && (
                      <div className="mt-1 text-[10px] text-gray-400 space-y-0.5">
                        <div>{trackLabels.status}</div>
                        <div>{trackLabels.gc}</div>
                      </div>
                    )}
                  </div>

                  {/* Track backgrounds */}
                  {multiTrack && (
                    <>
                      <div
                        className="absolute left-0 right-0 bg-emerald-50/50 rounded"
                        style={{ height: TRACK_HEIGHT, top: 0 }}
                      />
                      <div
                        className="absolute left-0 right-0 bg-amber-50/50 rounded"
                        style={{
                          height: TRACK_HEIGHT + (hasConcurrent ? CONCURRENT_OFFSET : 0),
                          top: TRACK_HEIGHT + TRACK_GAP,
                        }}
                      />
                    </>
                  )}

                  {/* Stages */}
                  {path.stages.map((stage, idx) => {
                    // Special rendering for priority date wait stages
                    if (stage.isPriorityWait) {
                      const startYear = stage.startYear;
                      const duration = stage.durationYears.max || 0.5;
                      const left = startYear * PIXELS_PER_YEAR;
                      const naturalWidth = duration * PIXELS_PER_YEAR - 2;
                      const width = Math.max(naturalWidth, 60);
                      const isHovered = hoveredStage === `${path.id}-${idx}`;

                      // Calculate top position (GC track)
                      let top = multiTrack ? TRACK_HEIGHT + TRACK_GAP : 0;

                      // Color based on wait length
                      const waitYears = duration;
                      let bgColor = "bg-orange-500";
                      let borderColor = "border-orange-600";
                      if (waitYears >= 10) {
                        bgColor = "bg-red-600";
                        borderColor = "border-red-700";
                      } else if (waitYears >= 5) {
                        bgColor = "bg-red-500";
                        borderColor = "border-red-600";
                      }

                      return (
                        <div
                          key={`${stage.nodeId}-${idx}`}
                          className={`absolute rounded cursor-pointer transition-all duration-150 border text-white
                            ${bgColor} ${borderColor}
                            ${isHovered ? "ring-2 ring-offset-1 ring-red-400 scale-105 z-30" : "z-10"}
                          `}
                          style={{
                            left: `${left}px`,
                            width: `${width}px`,
                            height: TRACK_HEIGHT,
                            top: `${top}px`,
                          }}
                          onClick={() => handleStageClick(stage.nodeId)}
                          onMouseEnter={() => setHoveredStage(`${path.id}-${idx}`)}
                          onMouseLeave={() => setHoveredStage(null)}
                        >
                          <div className="h-full px-1.5 flex flex-col justify-center overflow-hidden">
                            <div className="font-semibold text-[10px] leading-tight truncate">
                              PD Wait
                            </div>
                            <div className="text-[9px] opacity-90 leading-tight truncate">
                              {stage.durationYears.display}
                            </div>
                          </div>

                          {/* Tooltip on hover */}
                          {isHovered && (
                            <div className="absolute top-full left-0 mt-1 bg-gray-900 text-white text-xs px-2 py-1.5 rounded shadow-lg z-40 max-w-sm">
                              {/* Determine if this is filing or approval wait based on note */}
                              {stage.note?.includes("Filing") || stage.note?.includes("Dates for Filing") ? (
                                <>
                                  <div className="font-semibold text-blue-400">📝 Filing Wait</div>
                                  <div className="text-gray-400 text-[10px] mb-1">
                                    Wait until you can FILE I-485
                                  </div>
                                </>
                              ) : stage.note?.includes("Final Action") || stage.note?.includes("approval") ? (
                                <>
                                  <div className="font-semibold text-green-400">✅ Approval Wait</div>
                                  <div className="text-gray-400 text-[10px] mb-1">
                                    I-485 pending. EAD/AP valid. Waiting for visa availability.
                                  </div>
                                </>
                              ) : (
                                <div className="font-semibold">Priority Date Wait</div>
                              )}
                              <div className="text-gray-300">
                                Estimated: {stage.durationYears.display}
                                {stage.velocityInfo && stage.velocityInfo.rangeMin !== stage.velocityInfo.rangeMax && (
                                  <span className="text-gray-400 text-[10px] ml-1">
                                    (range: {Math.round(stage.velocityInfo.rangeMin / 12)}-{Math.round(stage.velocityInfo.rangeMax / 12)} yr)
                                  </span>
                                )}
                              </div>
                              {stage.priorityDateStr && (
                                <div className="text-gray-400 text-[10px] mt-0.5">
                                  Visa bulletin cutoff: {stage.priorityDateStr}
                                </div>
                              )}
                              {stage.velocityInfo && (
                                <>
                                  <div className="text-amber-400 text-[10px] mt-1.5 leading-relaxed whitespace-normal">
                                    {stage.velocityInfo.explanation}
                                  </div>
                                  <div className="text-gray-500 text-[9px] mt-1 flex items-center gap-1">
                                    <span>📊</span>
                                    <span>Based on historical visa bulletin movement</span>
                                  </div>
                                  {stage.velocityInfo.confidence < 0.7 && (
                                    <div className="text-gray-500 text-[9px] italic">
                                      Estimate confidence: {Math.round(stage.velocityInfo.confidence * 100)}%
                                    </div>
                                  )}
                                </>
                              )}
                              {/* Benefits note for approval wait */}
                              {(stage.note?.includes("Final Action") || stage.note?.includes("EAD")) && (
                                <div className="text-green-400 text-[9px] mt-1.5 border-t border-gray-700 pt-1">
                                  ✓ EAD (work permit) • ✓ Advance Parole (travel) • ✓ AC21 portability
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }

                    const node = getNode(stage.nodeId);
                    if (!node) return null;

                    const startYear = stage.startYear;
                    const duration = stage.durationYears.max || 0.5;
                    const track = stage.track;

                    const left = startYear * PIXELS_PER_YEAR;
                    // No minimum width - use actual duration
                    const naturalWidth = duration * PIXELS_PER_YEAR - 2;
                    const width = Math.max(naturalWidth, 24); // Just enough for a small marker
                    const isCompact = naturalWidth < 50; // Compact mode for small stages

                    // Calculate vertical position based on track
                    let top = 0;
                    if (multiTrack) {
                      top = track === "gc" ? TRACK_HEIGHT + TRACK_GAP : 0;
                      // Offset concurrent stages down so they don't hide previous stages
                      if (stage.isConcurrent) {
                        top += CONCURRENT_OFFSET;
                      }
                    }

                    const colors = categoryColors[node.category] || categoryColors.work;
                    const isHovered = hoveredStage === `${path.id}-${idx}`;
                    const isCurrentStatus = stage.nodeId === currentNodeId;
                    const isFinalGC = stage.nodeId === "gc";
                    const progress = plannedPathId !== null && path.id === plannedPathId ? getStageProgress(stage.nodeId) : null;

                    // Short name for compact stages - use shortName if available, otherwise truncate
                    const shortName = ("shortName" in node && node.shortName)
                      ? (node.shortName as string)
                      : (node.name.length > 8 ? node.name.substring(0, 6) + "…" : node.name);

                    // Special rendering for the final Green Card destination
                    if (isFinalGC) {
                      return (
                        <div
                          key={`${stage.nodeId}-${idx}`}
                          className={`absolute cursor-pointer transition-all duration-150
                            ${isHovered ? "scale-105 z-30" : "z-10"}
                          `}
                          style={{
                            left: `${left}px`,
                            top: `${top}px`,
                          }}
                          onClick={() => handleStageClick(stage.nodeId)}
                          onMouseEnter={() => setHoveredStage(`${path.id}-${idx}`)}
                          onMouseLeave={() => setHoveredStage(null)}
                        >
                          {/* Clean finish marker */}
                          <div
                            className="h-8 px-3 rounded-full bg-green-600 border-2 border-green-700 text-white font-semibold text-xs flex items-center justify-center shadow-sm"
                          >
                            Green Card
                          </div>

                          {/* Tooltip on hover */}
                          {isHovered && (
                            <div className="absolute top-full left-0 mt-2 bg-gray-900 text-white text-xs px-2 py-1.5 rounded shadow-lg whitespace-nowrap z-40">
                              <div className="font-semibold">Permanent Resident</div>
                              <div className="text-gray-400 text-[10px]">No expiration</div>
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={`${stage.nodeId}-${idx}`}
                        className={`absolute rounded cursor-pointer transition-all duration-150 border
                          ${colors.bg} ${colors.border} ${colors.text}
                          ${isHovered ? "ring-2 ring-offset-1 ring-brand-400 scale-105 z-30" : "z-10"}
                          ${isCurrentStatus ? "ring-2 ring-offset-1 ring-red-500" : ""}
                          ${progress === "done" ? "opacity-80" : ""}
                          ${progress === "in_progress" ? "ring-2 ring-offset-1 ring-emerald-400" : ""}
                        `}
                        style={{
                          left: `${left}px`,
                          width: `${width}px`,
                          height: TRACK_HEIGHT,
                          top: `${top}px`,
                        }}
                        onClick={() => handleStageClick(stage.nodeId)}
                        onMouseEnter={() => setHoveredStage(`${path.id}-${idx}`)}
                        onMouseLeave={() => setHoveredStage(null)}
                      >
                        <div className="h-full px-1 flex flex-col justify-center overflow-hidden relative">
                          {progress === "done" && (
                            <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-[9px] leading-none">
                              ✓
                            </div>
                          )}
                          {isCurrentStatus && (
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
                              YOU ARE HERE
                            </div>
                          )}
                          {isCompact ? (
                            // Compact: just show abbreviated name
                            <div className="font-semibold text-[9px] leading-none text-center truncate">
                              {shortName}
                            </div>
                          ) : (
                            // Full: show name and duration
                            <>
                              <div className="font-semibold text-[10px] leading-tight truncate">
                                {node.name}
                              </div>
                              <div className="text-[9px] opacity-90 leading-tight truncate">
                                {stage.durationYears.display}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Tooltip on hover */}
                        {isHovered && (
                          <div className="absolute top-full left-0 mt-1 bg-gray-900 text-white text-xs px-2 py-1.5 rounded shadow-lg whitespace-nowrap z-40">
                            <div className="font-semibold">{node.name}</div>
                            <div className="text-gray-300">{stage.durationYears.display}</div>
                            {stage.note && <div className="text-gray-400 text-[10px] mt-0.5">{stage.note}</div>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-6 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-500" />
            <span className="text-sm text-gray-600">Work Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500" />
            <span className="text-sm text-gray-600">GC Process</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500" />
            <span className="text-sm text-gray-600">Priority Date Wait</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-brand-600" />
            <span className="text-sm text-gray-600">Entry Visa</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-600" />
            <span className="text-sm text-gray-600">Green Card</span>
          </div>
        </div>

      </div>
    </div>
  );
}
