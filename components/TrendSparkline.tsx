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
// VELOCITY COLOR SCALE (Heatmap)
// =============================================================================

/**
 * Get color classes based on velocity (months advanced per year)
 * Heatmap scale: green (fast) → teal → yellow → orange → red (slow)
 */
function getVelocityColors(monthsPerYear: number): { bg: string; text: string } {
  if (monthsPerYear >= 10) {
    return { bg: "bg-green-100", text: "text-green-700" };
  }
  if (monthsPerYear >= 6) {
    return { bg: "bg-teal-50", text: "text-teal-700" };
  }
  if (monthsPerYear >= 4) {
    return { bg: "bg-amber-50", text: "text-amber-700" };
  }
  if (monthsPerYear >= 2) {
    return { bg: "bg-orange-100", text: "text-orange-700" };
  }
  return { bg: "bg-red-100", text: "text-red-700" };
}

// =============================================================================
// TREND CALCULATION
// =============================================================================

export interface TrendInfo {
  direction: "improving" | "worsening" | "stable" | "current";
  change: number; // Absolute change in mo/yr (positive = faster)
  currentVelocity: number;
  previousVelocity: number;
}

/**
 * Calculate the trend comparing current year to 1 year ago
 */
export function calculateTrend(data: VelocityDataPoint[]): TrendInfo {
  if (data.length < 2) {
    const velocity = data.length > 0 ? data[0].monthsPerYear : 0;
    return { 
      direction: "stable", 
      change: 0, 
      currentVelocity: velocity,
      previousVelocity: velocity 
    };
  }

  // Check if mostly current
  const currentCount = data.filter(d => d.monthsPerYear >= 12).length;
  if (currentCount >= data.length * 0.7) {
    return { 
      direction: "current", 
      change: 0, 
      currentVelocity: 12,
      previousVelocity: 12 
    };
  }

  // Get current (most recent) and 1 year ago
  const currentVelocity = data[data.length - 1].monthsPerYear;
  const oneYearAgoIndex = Math.max(0, data.length - 2);
  const previousVelocity = data[oneYearAgoIndex].monthsPerYear;
  
  const change = currentVelocity - previousVelocity;
  
  let direction: TrendInfo["direction"];
  if (change > 1) {
    direction = "improving";
  } else if (change < -1) {
    direction = "worsening";
  } else {
    direction = "stable";
  }
  
  return {
    direction,
    change,
    currentVelocity,
    previousVelocity
  };
}

// =============================================================================
// COMPONENTS
// =============================================================================

interface MovementBadgeProps {
  velocity: number;
  data: VelocityDataPoint[];
  isCurrent?: boolean;
  className?: string;
}

/**
 * MovementBadge - Clean heatmap-style velocity badge
 * 
 * Design:
 * - Single compact badge with color = speed (heatmap)
 * - Small arrow inside badge shows trend direction
 * - No extra text, numbers for change, or clutter
 * 
 * Examples: [8 ↑] green, [3 ↓] orange, [5] yellow
 */
export function MovementBadge({ 
  velocity,
  data,
  isCurrent = false,
  className = "" 
}: MovementBadgeProps) {
  const trend = useMemo(() => calculateTrend(data), [data]);
  
  // Current - no backlog
  if (isCurrent || velocity >= 12) {
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-green-100 text-green-700 ${className}`}>
        Current
      </span>
    );
  }
  
  const colors = getVelocityColors(velocity);
  const roundedVelocity = Math.round(velocity);
  
  // Determine arrow
  let arrow = "";
  if (trend.direction === "improving") {
    arrow = " ↑";
  } else if (trend.direction === "worsening") {
    arrow = " ↓";
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium ${colors.bg} ${colors.text} ${className}`}>
      {roundedVelocity}{arrow}
    </span>
  );
}

// =============================================================================
// LEGACY EXPORTS - For backward compatibility
// =============================================================================

// VelocitySparkline now shows MovementBadge
export function VelocitySparkline({ 
  data, 
  velocity = 0,
  currentIsCurrent = false,
  className = "" 
}: { 
  data: VelocityDataPoint[]; 
  velocity?: number;
  currentIsCurrent?: boolean;
  className?: string;
}) {
  const calculatedVelocity = velocity || (data.length > 0 
    ? data.slice(-3).reduce((sum, d) => sum + d.monthsPerYear, 0) / Math.min(3, data.length)
    : 0);
  
  return (
    <MovementBadge 
      data={data} 
      velocity={calculatedVelocity}
      isCurrent={currentIsCurrent}
      className={className} 
    />
  );
}

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
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-green-100 text-green-700 ${className}`}>
        Current
      </span>
    );
  }
  
  const colors = getVelocityColors(monthsPerYear);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium ${colors.bg} ${colors.text} ${className}`}>
      {Math.round(monthsPerYear)}
    </span>
  );
}

// Simplified exports for any remaining usage
export function TrendBadge({ 
  data, 
  velocity,
  isCurrent = false,
  className = "" 
}: { 
  data: VelocityDataPoint[];
  velocity: number;
  isCurrent?: boolean;
  className?: string;
}) {
  return (
    <MovementBadge 
      data={data} 
      velocity={velocity}
      isCurrent={isCurrent}
      className={className} 
    />
  );
}

export function SimpleTrendIndicator({
  data,
  isCurrent = false,
  className = ""
}: {
  data: VelocityDataPoint[];
  isCurrent?: boolean;
  className?: string;
}) {
  const trend = calculateTrend(data);
  const velocity = trend.currentVelocity;
  
  return (
    <MovementBadge 
      data={data} 
      velocity={velocity}
      isCurrent={isCurrent}
      className={className} 
    />
  );
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
  return <SimpleTrendIndicator data={velocityData} isCurrent={currentIsCurrent} className={className} />;
}

export function calculateVelocityTrend(data: VelocityDataPoint[]) {
  return calculateTrend(data);
}

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
    <MovementBadge 
      data={data} 
      velocity={calculatedVelocity}
      isCurrent={isCurrent}
      className={className} 
    />
  );
}
