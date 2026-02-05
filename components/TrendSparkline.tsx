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

// Calculate velocity trend from velocity data
// Returns: direction, the actual change in mo/yr, and velocities for comparison
export function calculateVelocityTrend(data: VelocityDataPoint[]): {
  direction: "improving" | "worsening" | "stable" | "current";
  change: number; // Change in mo/yr (positive = speeding up)
  recentVelocity: number;
  olderVelocity: number;
} {
  if (data.length < 2) {
    const velocity = data.length > 0 ? data[0].monthsPerYear : 0;
    return { direction: "stable", change: 0, recentVelocity: velocity, olderVelocity: velocity };
  }

  // Check if mostly current (high velocity = 12+ mo/yr)
  const currentCount = data.filter(d => d.monthsPerYear >= 12).length;
  if (currentCount >= data.length * 0.7) {
    return { direction: "current", change: 0, recentVelocity: 12, olderVelocity: 12 };
  }

  // Compare recent to older velocities
  const recentValues = data.slice(-3).map(d => d.monthsPerYear);
  const olderValues = data.slice(0, 3).map(d => d.monthsPerYear);
  
  const recentAvg = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
  const olderAvg = olderValues.reduce((a, b) => a + b, 0) / olderValues.length;
  
  // Change in velocity (positive = speeding up = GOOD)
  const change = recentAvg - olderAvg;
  
  // Threshold: 1 month/year change is meaningful
  if (change > 1) {
    return { direction: "improving", change, recentVelocity: recentAvg, olderVelocity: olderAvg };
  } else if (change < -1) {
    return { direction: "worsening", change, recentVelocity: recentAvg, olderVelocity: olderAvg };
  }
  return { direction: "stable", change: 0, recentVelocity: recentAvg, olderVelocity: olderAvg };
}

// =============================================================================
// NEW SIMPLIFIED COMPONENTS - No sparklines, just clear indicators
// =============================================================================

interface ProgressIndicatorProps {
  velocity: number;      // Current velocity in mo/yr
  data: VelocityDataPoint[]; // Historical data for trend calculation
  isCurrent?: boolean;   // Is the category currently "Current"?
  className?: string;
}

/**
 * ProgressIndicator - Shows velocity and trend in a clear, scannable format
 * 
 * Examples:
 * - "Current" (green) - category is current
 * - "5 mo/yr ↑" (green) - speeding up
 * - "3 mo/yr →" (gray) - stable
 * - "2 mo/yr ↓" (red) - slowing down
 */
export function ProgressIndicator({ 
  velocity, 
  data, 
  isCurrent = false, 
  className = "" 
}: ProgressIndicatorProps) {
  const trend = useMemo(() => calculateVelocityTrend(data), [data]);
  
  // If category is current, show simple green indicator
  if (isCurrent || velocity >= 12) {
    return (
      <span className={`inline-flex items-center gap-1 ${className}`}>
        <span className="text-green-600 font-medium">Current</span>
      </span>
    );
  }
  
  // Determine colors and arrow based on trend
  let arrow: string;
  let colorClass: string;
  let bgClass: string;
  
  if (trend.direction === "improving") {
    arrow = "↑";
    colorClass = "text-green-700";
    bgClass = "bg-green-50";
  } else if (trend.direction === "worsening") {
    arrow = "↓";
    colorClass = "text-red-700";
    bgClass = "bg-red-50";
  } else {
    arrow = "→";
    colorClass = "text-gray-600";
    bgClass = "bg-gray-50";
  }
  
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-sm font-medium ${colorClass} ${bgClass}`}>
        <span>{velocity.toFixed(0)} mo/yr</span>
        <span>{arrow}</span>
      </span>
    </span>
  );
}

/**
 * OutlookBadge - Simple text indicator showing if conditions are improving/worsening
 * 
 * Uses neutral language to avoid being overly alarming while still informative
 */
export function OutlookBadge({ 
  data, 
  isCurrent = false,
  className = "" 
}: { 
  data: VelocityDataPoint[]; 
  isCurrent?: boolean;
  className?: string;
}) {
  const trend = useMemo(() => calculateVelocityTrend(data), [data]);
  
  if (isCurrent || trend.direction === "current") {
    return (
      <span className={`inline-flex items-center gap-1.5 text-green-600 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span className="text-sm font-medium">Current</span>
      </span>
    );
  }
  
  if (trend.direction === "improving") {
    return (
      <span className={`inline-flex items-center gap-1 text-green-600 ${className}`}>
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium">Faster</span>
      </span>
    );
  }
  
  if (trend.direction === "worsening") {
    return (
      <span className={`inline-flex items-center gap-1 text-amber-600 ${className}`}>
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium">Slower</span>
      </span>
    );
  }
  
  return (
    <span className={`inline-flex items-center gap-1 text-gray-500 ${className}`}>
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
      <span className="text-sm font-medium">Steady</span>
    </span>
  );
}

/**
 * WaitTimeCell - Shows estimated wait with color coding
 */
export function WaitTimeCell({
  years,
  rangeMin,
  rangeMax,
  isCurrent = false,
  className = ""
}: {
  years: number;
  rangeMin?: number;
  rangeMax?: number;
  isCurrent?: boolean;
  className?: string;
}) {
  if (isCurrent || years === 0) {
    return <span className={`font-medium text-green-600 ${className}`}>Current</span>;
  }
  
  // Color based on wait time
  let colorClass: string;
  if (years <= 2) {
    colorClass = "text-green-600";
  } else if (years <= 5) {
    colorClass = "text-yellow-600";
  } else if (years <= 10) {
    colorClass = "text-orange-500";
  } else if (years <= 20) {
    colorClass = "text-orange-600";
  } else {
    colorClass = "text-red-600";
  }
  
  // Format the wait time
  let text: string;
  if (rangeMin !== undefined && rangeMax !== undefined && rangeMin !== rangeMax) {
    text = `${rangeMin}-${rangeMax} yr`;
  } else if (years >= 50) {
    text = "50+ yr";
  } else {
    text = `~${years} yr`;
  }
  
  return <span className={`font-medium ${colorClass} ${className}`}>{text}</span>;
}

// =============================================================================
// LEGACY EXPORTS - Keep for backward compatibility during transition
// =============================================================================

// Velocity badge showing current speed
export function VelocityBadge({ 
  monthsPerYear, 
  isCurrent = false,
  className = "" 
}: { 
  monthsPerYear: number; 
  isCurrent?: boolean;
  className?: string;
}) {
  if (isCurrent || monthsPerYear >= 12) {
    return <span className={`font-medium text-green-600 ${className}`}>Current</span>;
  }
  
  let colorClass: string;
  if (monthsPerYear >= 6) {
    colorClass = "text-yellow-600";
  } else if (monthsPerYear >= 3) {
    colorClass = "text-orange-500";
  } else {
    colorClass = "text-red-600";
  }

  return (
    <span className={`font-medium ${colorClass} ${className}`}>
      {monthsPerYear.toFixed(0)} mo/yr
    </span>
  );
}

// Legacy VelocitySparkline - now just renders OutlookBadge
export function VelocitySparkline({ 
  data, 
  currentIsCurrent = false, 
  className = "" 
}: { 
  data: VelocityDataPoint[]; 
  currentIsCurrent?: boolean; 
  className?: string;
}) {
  return <OutlookBadge data={data} isCurrent={currentIsCurrent} className={className} />;
}

// Keep these exports for backward compatibility
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

// Legacy SparklineCell
export function SparklineCell({ data, currentIsCurrent = false, className = "" }: { 
  data: WaitTimeDataPoint[] | VelocityDataPoint[]; 
  currentIsCurrent?: boolean;
  className?: string;
}) {
  const velocityData = data as VelocityDataPoint[];
  return <OutlookBadge data={velocityData} isCurrent={currentIsCurrent} className={className} />;
}
