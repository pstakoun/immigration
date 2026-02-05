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
// TREND CALCULATION - Focus on clarity, not urgency
// =============================================================================

export interface TrendInfo {
  direction: "improving" | "worsening" | "stable" | "current";
  velocityChange: number; // How much velocity changed (positive = faster)
  currentVelocity: number;
  previousVelocity: number;
}

/**
 * Calculate the trend - is the line moving faster, slower, or about the same?
 */
export function calculateTrend(data: VelocityDataPoint[]): TrendInfo {
  if (data.length < 2) {
    const velocity = data.length > 0 ? data[0].monthsPerYear : 0;
    return { 
      direction: "stable", 
      velocityChange: 0, 
      currentVelocity: velocity,
      previousVelocity: velocity 
    };
  }

  // Check if mostly current (high velocity = 12+ mo/yr)
  const currentCount = data.filter(d => d.monthsPerYear >= 12).length;
  if (currentCount >= data.length * 0.7) {
    return { 
      direction: "current", 
      velocityChange: 0, 
      currentVelocity: 12,
      previousVelocity: 12 
    };
  }

  // Compare recent (last ~2 years) to older (~2 years before that)
  const midpoint = Math.floor(data.length / 2);
  const recentData = data.slice(midpoint);
  const olderData = data.slice(0, midpoint);
  
  const recentAvg = recentData.reduce((sum, d) => sum + d.monthsPerYear, 0) / recentData.length;
  const olderAvg = olderData.reduce((sum, d) => sum + d.monthsPerYear, 0) / olderData.length;
  
  const velocityChange = recentAvg - olderAvg;
  
  // Determine direction based on velocity change
  // Positive change = velocity increasing = wait times improving
  // Negative change = velocity decreasing = wait times worsening
  let direction: TrendInfo["direction"];
  if (velocityChange > 1) {
    direction = "improving";
  } else if (velocityChange < -1) {
    direction = "worsening";
  } else {
    direction = "stable";
  }
  
  return {
    direction,
    velocityChange,
    currentVelocity: recentAvg,
    previousVelocity: olderAvg
  };
}

// =============================================================================
// COMPONENTS - Informational, not urgent
// =============================================================================

interface TrendBadgeProps {
  data: VelocityDataPoint[];
  velocity: number;
  isCurrent?: boolean;
  className?: string;
}

/**
 * TrendBadge - Shows velocity with concrete historical comparison
 * 
 * Focus: Clear, factual information
 * 
 * Shows:
 * - Current velocity
 * - What it was before (concrete comparison)
 * - Direction indicator
 */
export function TrendBadge({ 
  data, 
  velocity,
  isCurrent = false,
  className = "" 
}: TrendBadgeProps) {
  const trend = useMemo(() => calculateTrend(data), [data]);
  
  // Current - no backlog
  if (isCurrent || velocity >= 12) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <span className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-sm text-green-700 font-medium">Current</span>
      </span>
    );
  }
  
  // Format the previous velocity for comparison
  const prevVelocity = Math.round(trend.previousVelocity);
  const currVelocity = Math.round(velocity);
  const change = currVelocity - prevVelocity;
  
  // Determine color based on direction
  let changeColor: string;
  let arrow: string;
  
  if (trend.direction === "improving") {
    changeColor = "text-green-600";
    arrow = "↑";
  } else if (trend.direction === "worsening") {
    changeColor = "text-amber-600";
    arrow = "↓";
  } else {
    changeColor = "text-gray-500";
    arrow = "→";
  }
  
  // Show concrete comparison: "3 mo/yr (was 5)" or "3 mo/yr (steady)"
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm ${className}`}>
      <span className="font-medium text-gray-900">{currVelocity} mo/yr</span>
      {trend.direction === "stable" ? (
        <span className="text-gray-400">(steady)</span>
      ) : (
        <span className={changeColor}>
          {arrow} was {prevVelocity}
        </span>
      )}
    </span>
  );
}

/**
 * SimpleTrendIndicator - Shows trend with concrete numbers
 */
export function SimpleTrendIndicator({
  data,
  isCurrent = false,
  className = ""
}: {
  data: VelocityDataPoint[];
  isCurrent?: boolean;
  className?: string;
}) {
  const trend = useMemo(() => calculateTrend(data), [data]);
  
  if (isCurrent || trend.direction === "current") {
    return (
      <span className={`inline-flex items-center gap-1.5 text-green-600 ${className}`}>
        <span className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-sm font-medium">Current</span>
      </span>
    );
  }
  
  const curr = Math.round(trend.currentVelocity);
  const prev = Math.round(trend.previousVelocity);
  
  if (trend.direction === "improving") {
    return (
      <span className={`inline-flex items-center gap-1.5 text-sm ${className}`}>
        <span className="font-medium text-gray-900">{curr} mo/yr</span>
        <span className="text-green-600">↑ was {prev}</span>
      </span>
    );
  }
  
  if (trend.direction === "worsening") {
    return (
      <span className={`inline-flex items-center gap-1.5 text-sm ${className}`}>
        <span className="font-medium text-gray-900">{curr} mo/yr</span>
        <span className="text-amber-600">↓ was {prev}</span>
      </span>
    );
  }
  
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm ${className}`}>
      <span className="font-medium text-gray-900">{curr} mo/yr</span>
      <span className="text-gray-400">(steady)</span>
    </span>
  );
}

// =============================================================================
// LEGACY EXPORTS - For backward compatibility
// =============================================================================

// VelocitySparkline now shows TrendBadge
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
  // Calculate velocity from data if not provided
  const calculatedVelocity = velocity || (data.length > 0 
    ? data.slice(-3).reduce((sum, d) => sum + d.monthsPerYear, 0) / Math.min(3, data.length)
    : 0);
  
  return (
    <TrendBadge 
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
    return <span className={`text-sm text-green-600 font-medium ${className}`}>Current</span>;
  }
  
  return (
    <span className={`text-sm font-medium text-gray-900 ${className}`}>
      {monthsPerYear.toFixed(0)} mo/yr
    </span>
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

// Keep for any code still using these
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
    <TrendBadge 
      data={data} 
      velocity={calculatedVelocity}
      isCurrent={isCurrent}
      className={className} 
    />
  );
}
