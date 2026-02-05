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
 * TrendBadge - Shows the trend clearly without creating urgency
 * 
 * Focus: Information and understanding, not pressure to act
 * 
 * Shows:
 * - Current velocity (how fast the line moves)
 * - Whether it's trending faster, slower, or steady
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
  
  // Build the display
  const speedLabel = velocity >= 6 ? "Fast" : velocity >= 3 ? "Moderate" : "Slow";
  
  // Determine trend indicator
  let trendIcon: React.ReactNode;
  let trendLabel: string;
  let trendColor: string;
  
  if (trend.direction === "improving") {
    trendIcon = (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    );
    trendLabel = "speeding up";
    trendColor = "text-green-600";
  } else if (trend.direction === "worsening") {
    trendIcon = (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    );
    trendLabel = "slowing";
    trendColor = "text-amber-600";
  } else {
    trendIcon = (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    );
    trendLabel = "steady";
    trendColor = "text-gray-500";
  }
  
  return (
    <div className={`inline-flex flex-col gap-0.5 ${className}`}>
      <span className="text-sm text-gray-700">
        <span className="font-medium">{velocity.toFixed(0)} mo/yr</span>
        <span className="text-gray-400 ml-1">({speedLabel})</span>
      </span>
      <span className={`inline-flex items-center gap-1 text-xs ${trendColor}`}>
        {trendIcon}
        <span>{trendLabel}</span>
      </span>
    </div>
  );
}

/**
 * SimpleTrendIndicator - Even simpler version showing just the trend
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
  
  if (trend.direction === "improving") {
    return (
      <span className={`inline-flex items-center gap-1.5 text-green-600 ${className}`}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        <span className="text-sm font-medium">Speeding up</span>
      </span>
    );
  }
  
  if (trend.direction === "worsening") {
    return (
      <span className={`inline-flex items-center gap-1.5 text-amber-600 ${className}`}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
        <span className="text-sm font-medium">Slowing</span>
      </span>
    );
  }
  
  return (
    <span className={`inline-flex items-center gap-1.5 text-gray-500 ${className}`}>
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
      <span className="text-sm font-medium">Steady</span>
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
  
  const speedLabel = monthsPerYear >= 6 ? "Fast" : monthsPerYear >= 3 ? "Moderate" : "Slow";
  
  return (
    <span className={`text-sm text-gray-700 ${className}`}>
      <span className="font-medium">{monthsPerYear.toFixed(0)} mo/yr</span>
      <span className="text-gray-400 ml-1">({speedLabel})</span>
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
