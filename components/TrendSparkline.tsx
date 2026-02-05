"use client";

import { useMemo } from "react";

// Velocity data point - tracks advancement rate at each bulletin period
export interface VelocityDataPoint {
  label: string;        // Period label (e.g., "2023")
  monthsPerYear: number; // How many months the cutoff advanced per year
}

// Parse date string like "Jul 2013" or "Current" to months since 2000
export function parseVisaBulletinDate(dateStr: string): number | null {
  if (!dateStr || dateStr.toLowerCase() === "current") return null;
  
  const months: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  };
  
  const match = dateStr.match(/([a-z]{3})\w*\s*(\d{4})/i);
  if (!match) return null;
  
  const monthNum = months[match[1].toLowerCase()];
  const year = parseInt(match[2], 10);
  
  if (monthNum === undefined || isNaN(year)) return null;
  
  return (year - 2000) * 12 + monthNum;
}

// Parse bulletin month like "January 2023" to months since 2000
export function parseBulletinMonth(dateStr: string): number {
  const months: Record<string, number> = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
    jan: 0, feb: 1, mar: 2, apr: 3, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  };
  
  const match = dateStr.match(/([a-z]+)\s*(\d{4})/i);
  if (!match) return 0;
  
  const monthNum = months[match[1].toLowerCase()];
  const year = parseInt(match[2], 10);
  
  if (monthNum === undefined || isNaN(year)) return 0;
  
  return year * 12 + monthNum;
}

// =============================================================================
// DELAY COST CALCULATION
// =============================================================================

/**
 * Calculate the "delay cost" - how much longer you'll wait if you delay filing by 1 year
 * 
 * Formula: If velocity = V months/year, and you wait 1 year:
 * - The cutoff advances by V months
 * - But you age by 12 months  
 * - Net: you fall behind by (12 - V) months
 * - Additional wait = (12 - V) / V years
 * 
 * Examples:
 * - Velocity 3 mo/yr: delay 1yr = add 3 years to wait
 * - Velocity 6 mo/yr: delay 1yr = add 1 year to wait
 * - Velocity 12 mo/yr: delay 1yr = add 0 years (current)
 */
export function calculateDelayCost(velocity: number): number {
  if (velocity >= 12) return 0; // Current - no penalty
  if (velocity <= 0) return 99; // Completely stuck
  
  // Cost = (12 - velocity) / velocity
  // This is how many years get added to your wait for each year you delay
  const cost = (12 - velocity) / velocity;
  return Math.round(cost * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate how wait time has changed compared to 1 year ago
 * Uses historical velocity data to estimate
 */
export function calculateYearOverYearChange(
  data: VelocityDataPoint[],
  currentVelocity: number
): { change: number; direction: "better" | "worse" | "same" } {
  if (data.length < 2) {
    return { change: 0, direction: "same" };
  }
  
  // Get velocity from ~1 year ago (look at older entries)
  const olderEntries = data.slice(0, Math.ceil(data.length / 2));
  const recentEntries = data.slice(-Math.ceil(data.length / 2));
  
  const olderAvg = olderEntries.reduce((sum, d) => sum + d.monthsPerYear, 0) / olderEntries.length;
  const recentAvg = recentEntries.reduce((sum, d) => sum + d.monthsPerYear, 0) / recentEntries.length;
  
  // Calculate delay cost then vs now
  const oldDelayCost = calculateDelayCost(olderAvg);
  const newDelayCost = calculateDelayCost(recentAvg);
  
  const change = newDelayCost - oldDelayCost;
  
  if (change > 0.5) {
    return { change, direction: "worse" }; // Delay cost increased
  } else if (change < -0.5) {
    return { change: Math.abs(change), direction: "better" }; // Delay cost decreased
  }
  return { change: 0, direction: "same" };
}

// =============================================================================
// COMPONENTS
// =============================================================================

interface DelayCostBadgeProps {
  velocity: number;
  isCurrent?: boolean;
  showTrend?: boolean;
  data?: VelocityDataPoint[];
  className?: string;
}

/**
 * DelayCostBadge - Shows the cost of waiting 1 year to file
 * 
 * This answers: "If I wait 1 year to file, how much longer will I wait?"
 * 
 * Examples:
 * - "No penalty" (green) - Category is current
 * - "+1 yr" (yellow) - Waiting 1 year adds 1 year to your wait
 * - "+3 yr" (red) - Waiting 1 year adds 3 years to your wait
 */
export function DelayCostBadge({ 
  velocity, 
  isCurrent = false,
  showTrend = false,
  data = [],
  className = "" 
}: DelayCostBadgeProps) {
  const delayCost = calculateDelayCost(velocity);
  const trend = useMemo(() => 
    showTrend && data.length > 0 ? calculateYearOverYearChange(data, velocity) : null,
  [showTrend, data, velocity]);
  
  // Current - no delay penalty
  if (isCurrent || velocity >= 12) {
    return (
      <div className={`inline-flex flex-col ${className}`}>
        <span className="inline-flex items-center gap-1.5 text-green-600">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-sm font-medium">No penalty</span>
        </span>
        <span className="text-xs text-gray-400 mt-0.5">File anytime</span>
      </div>
    );
  }
  
  // Determine color based on severity
  let colorClass: string;
  let bgClass: string;
  let urgencyText: string;
  
  if (delayCost <= 1) {
    colorClass = "text-yellow-700";
    bgClass = "bg-yellow-50 border-yellow-200";
    urgencyText = "Low urgency";
  } else if (delayCost <= 2) {
    colorClass = "text-orange-700";
    bgClass = "bg-orange-50 border-orange-200";
    urgencyText = "Moderate urgency";
  } else if (delayCost <= 4) {
    colorClass = "text-red-600";
    bgClass = "bg-red-50 border-red-200";
    urgencyText = "High urgency";
  } else {
    colorClass = "text-red-700";
    bgClass = "bg-red-100 border-red-300";
    urgencyText = "Critical";
  }
  
  return (
    <div className={`inline-flex flex-col ${className}`}>
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-sm font-semibold ${colorClass} ${bgClass}`}>
        +{delayCost.toFixed(0)} yr
        {trend && trend.direction !== "same" && (
          <span className={`text-xs ${trend.direction === "worse" ? "text-red-500" : "text-green-500"}`}>
            {trend.direction === "worse" ? "↑" : "↓"}
          </span>
        )}
      </span>
      <span className="text-xs text-gray-500 mt-0.5">{urgencyText}</span>
    </div>
  );
}

/**
 * WaitTimeComparison - Shows wait time with year-over-year context
 */
export function WaitTimeComparison({
  currentWait,
  velocity,
  data,
  isCurrent = false,
  className = ""
}: {
  currentWait: { years: number; rangeMin: number; rangeMax: number };
  velocity: number;
  data: VelocityDataPoint[];
  isCurrent?: boolean;
  className?: string;
}) {
  if (isCurrent || currentWait.years === 0) {
    return <span className={`font-medium text-green-600 ${className}`}>Current</span>;
  }
  
  // Estimate what wait time was 1 year ago based on historical velocity
  // This is approximate but gives users context
  const yoyChange = calculateYearOverYearChange(data, velocity);
  
  // Color based on wait time
  let colorClass: string;
  if (currentWait.years <= 2) {
    colorClass = "text-green-600";
  } else if (currentWait.years <= 5) {
    colorClass = "text-yellow-600";
  } else if (currentWait.years <= 10) {
    colorClass = "text-orange-500";
  } else if (currentWait.years <= 20) {
    colorClass = "text-orange-600";
  } else {
    colorClass = "text-red-600";
  }
  
  // Format the wait time
  let waitText: string;
  if (currentWait.rangeMin !== currentWait.rangeMax && currentWait.years >= 2) {
    waitText = `${currentWait.rangeMin}-${currentWait.rangeMax} yr`;
  } else if (currentWait.years >= 50) {
    waitText = "50+ yr";
  } else {
    waitText = `~${currentWait.years} yr`;
  }
  
  return (
    <div className={`inline-flex flex-col ${className}`}>
      <span className={`font-semibold ${colorClass}`}>{waitText}</span>
      {yoyChange.direction !== "same" && (
        <span className={`text-xs ${yoyChange.direction === "worse" ? "text-red-500" : "text-green-500"}`}>
          {yoyChange.direction === "worse" ? "↑" : "↓"} vs last year
        </span>
      )}
    </div>
  );
}

/**
 * VelocityIndicator - Shows how fast the line is moving with context
 */
export function VelocityIndicator({
  velocity,
  isCurrent = false,
  className = ""
}: {
  velocity: number;
  isCurrent?: boolean;
  className?: string;
}) {
  if (isCurrent || velocity >= 12) {
    return <span className={`text-sm text-green-600 font-medium ${className}`}>Current</span>;
  }
  
  // Categorize the velocity
  let description: string;
  let colorClass: string;
  
  if (velocity >= 6) {
    description = "Fast";
    colorClass = "text-green-600";
  } else if (velocity >= 4) {
    description = "Moderate";
    colorClass = "text-yellow-600";
  } else if (velocity >= 2) {
    description = "Slow";
    colorClass = "text-orange-500";
  } else {
    description = "Very slow";
    colorClass = "text-red-600";
  }
  
  return (
    <span className={`text-sm ${colorClass} ${className}`}>
      <span className="font-medium">{velocity.toFixed(0)} mo/yr</span>
      <span className="text-gray-400 ml-1">({description})</span>
    </span>
  );
}

// =============================================================================
// LEGACY EXPORTS - Keep for backward compatibility
// =============================================================================

export function calculateVelocityTrend(data: VelocityDataPoint[]): {
  direction: "improving" | "worsening" | "stable" | "current";
  change: number;
  recentVelocity: number;
  olderVelocity: number;
} {
  if (data.length < 2) {
    const velocity = data.length > 0 ? data[0].monthsPerYear : 0;
    return { direction: "stable", change: 0, recentVelocity: velocity, olderVelocity: velocity };
  }

  const currentCount = data.filter(d => d.monthsPerYear >= 12).length;
  if (currentCount >= data.length * 0.7) {
    return { direction: "current", change: 0, recentVelocity: 12, olderVelocity: 12 };
  }

  const recentValues = data.slice(-3).map(d => d.monthsPerYear);
  const olderValues = data.slice(0, 3).map(d => d.monthsPerYear);
  
  const recentAvg = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
  const olderAvg = olderValues.reduce((a, b) => a + b, 0) / olderValues.length;
  
  const change = recentAvg - olderAvg;
  
  if (change > 1) {
    return { direction: "improving", change, recentVelocity: recentAvg, olderVelocity: olderAvg };
  } else if (change < -1) {
    return { direction: "worsening", change, recentVelocity: recentAvg, olderVelocity: olderAvg };
  }
  return { direction: "stable", change: 0, recentVelocity: recentAvg, olderVelocity: olderAvg };
}

// Legacy VelocitySparkline - now renders DelayCostBadge
export function VelocitySparkline({ 
  data, 
  currentIsCurrent = false,
  velocity = 0,
  className = "" 
}: { 
  data: VelocityDataPoint[]; 
  currentIsCurrent?: boolean;
  velocity?: number;
  className?: string;
}) {
  // Calculate velocity from data if not provided
  const calculatedVelocity = velocity || (data.length > 0 
    ? data.slice(-3).reduce((sum, d) => sum + d.monthsPerYear, 0) / Math.min(3, data.length)
    : 0);
  
  return (
    <DelayCostBadge 
      velocity={calculatedVelocity} 
      isCurrent={currentIsCurrent}
      showTrend={true}
      data={data}
      className={className} 
    />
  );
}

// Legacy exports
export function VelocityBadge({ 
  monthsPerYear, 
  isCurrent = false,
  className = "" 
}: { 
  monthsPerYear: number; 
  isCurrent?: boolean;
  className?: string;
}) {
  return <VelocityIndicator velocity={monthsPerYear} isCurrent={isCurrent} className={className} />;
}

export interface WaitTimeDataPoint {
  label: string;
  waitMonths: number;
}

export function calculateWaitTimeMonths(bulletinMonth: string, priorityDate: string): number {
  if (!priorityDate || priorityDate.toLowerCase() === "current") {
    return 0;
  }
  
  const bulletinMonths = parseBulletinMonth(bulletinMonth);
  const priorityMonths = parseVisaBulletinDate(priorityDate);
  
  if (priorityMonths === null) return 0;
  
  return Math.max(0, bulletinMonths - priorityMonths);
}

export function SparklineCell({ data, currentIsCurrent = false, className = "" }: { 
  data: WaitTimeDataPoint[] | VelocityDataPoint[]; 
  currentIsCurrent?: boolean;
  className?: string;
}) {
  const velocityData = data as VelocityDataPoint[];
  return <VelocitySparkline data={velocityData} currentIsCurrent={currentIsCurrent} className={className} />;
}

// New named export for OutlookBadge (legacy compatibility)
export function OutlookBadge({ 
  data, 
  isCurrent = false,
  velocity = 0,
  className = "" 
}: { 
  data: VelocityDataPoint[]; 
  isCurrent?: boolean;
  velocity?: number;
  className?: string;
}) {
  const calculatedVelocity = velocity || (data.length > 0 
    ? data.slice(-3).reduce((sum, d) => sum + d.monthsPerYear, 0) / Math.min(3, data.length)
    : 0);
  
  return (
    <DelayCostBadge 
      velocity={calculatedVelocity} 
      isCurrent={isCurrent}
      showTrend={true}
      data={data}
      className={className} 
    />
  );
}
