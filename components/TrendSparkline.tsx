"use client";

import { useMemo } from "react";

// Wait time data point - tracks wait time at each bulletin month
export interface WaitTimeDataPoint {
  label: string;      // Bulletin month (e.g., "January 2023")
  waitMonths: number; // Wait time in months at that point (0 = current)
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

// Calculate wait time: bulletin date - priority date cutoff
export function calculateWaitTimeMonths(bulletinMonth: string, priorityDate: string): number {
  if (!priorityDate || priorityDate.toLowerCase() === "current") {
    return 0; // Current = no wait
  }
  
  const bulletinMonths = parseBulletinMonth(bulletinMonth);
  const priorityMonths = parseVisaBulletinDate(priorityDate);
  
  if (priorityMonths === null) return 0;
  
  return Math.max(0, bulletinMonths - priorityMonths);
}

// Calculate trend from wait time data
// For wait times: INCREASING = worsening (bad), DECREASING = improving (good)
function calculateWaitTrend(data: WaitTimeDataPoint[]): {
  direction: "improving" | "worsening" | "stable";
  changePerYear: number;
} {
  if (data.length < 2) {
    return { direction: "stable", changePerYear: 0 };
  }

  // Filter out zeros for trend calculation (we'll handle "all current" separately)
  const validData = data.filter(d => d.waitMonths > 0);
  
  // If less than 2 non-zero data points, we can't calculate a meaningful trend
  if (validData.length < 2) {
    // Check if we're transitioning from current to having a wait
    const recentData = data.slice(-4);
    const olderData = data.slice(0, 4);
    const recentHasWait = recentData.some(d => d.waitMonths > 0);
    const olderMostlyCurrent = olderData.filter(d => d.waitMonths === 0).length >= olderData.length * 0.5;
    
    if (recentHasWait && olderMostlyCurrent) {
      // Transitioning from current to having wait = worsening
      const recentWait = recentData.filter(d => d.waitMonths > 0);
      const avgWait = recentWait.length > 0 
        ? recentWait.reduce((a, b) => a + b.waitMonths, 0) / recentWait.length 
        : 0;
      return { direction: "worsening", changePerYear: avgWait / 2 }; // Rough estimate
    }
    
    return { direction: "stable", changePerYear: 0 };
  }

  // Compare recent to older wait times
  const recentValues = validData.slice(-4).map(d => d.waitMonths);
  const olderValues = validData.slice(0, Math.min(4, validData.length - 1)).map(d => d.waitMonths);
  
  if (olderValues.length === 0) {
    return { direction: "stable", changePerYear: 0 };
  }
  
  const recentAvg = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
  const olderAvg = olderValues.reduce((a, b) => a + b, 0) / olderValues.length;
  
  // Change in wait time (positive = wait increasing = BAD)
  const totalChange = recentAvg - olderAvg;
  const yearsOfData = Math.max(1, (validData.length - 1) / 4);
  const changePerYear = totalChange / yearsOfData;
  
  // Any measurable change matters
  if (changePerYear < -1) {
    return { direction: "improving", changePerYear };
  } else if (changePerYear > 1) {
    return { direction: "worsening", changePerYear };
  }
  return { direction: "stable", changePerYear };
}

// Sparkline component - shows wait time trend over time
// Pass currentIsCurrent=true if the CURRENT priority date is "Current" (no wait)
interface SparklineCellProps {
  data: WaitTimeDataPoint[];
  currentIsCurrent?: boolean; // Is the current priority date "Current"?
  className?: string;
}

export function SparklineCell({ data, currentIsCurrent = false, className = "" }: SparklineCellProps) {
  const { path, trend, color } = useMemo(() => {
    // If currently current, show green indicator
    if (currentIsCurrent) {
      return { 
        path: "", 
        trend: { direction: "stable" as const, changePerYear: 0 }, 
        color: "#22c55e" 
      };
    }
    
    const trend = calculateWaitTrend(data);
    
    if (data.length < 2) {
      return { path: "", trend, color: "#9ca3af" };
    }

    // Get data points with actual wait times for the sparkline
    const validData = data.filter(d => d.waitMonths > 0);
    if (validData.length < 2) {
      // Not enough data for sparkline, but we might still have a trend
      const color = trend.direction === "improving" ? "#22c55e" : 
                    trend.direction === "worsening" ? "#ef4444" : "#6b7280";
      return { path: "", trend, color };
    }

    const waitValues = validData.map(d => d.waitMonths);
    const min = Math.min(...waitValues);
    const max = Math.max(...waitValues);
    const range = max - min || 1;

    const width = 44;
    const height = 14;
    const padding = 1;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Build path - HIGH wait = TOP (bad), LOW wait = BOTTOM (good)
    const pts: { x: number; y: number }[] = [];
    validData.forEach((d, i) => {
      const x = padding + (i / (validData.length - 1)) * chartWidth;
      const normalizedWait = (d.waitMonths - min) / range;
      const y = padding + (1 - normalizedWait) * chartHeight;
      pts.push({ x, y });
    });

    const pathStr = pts.map((p, i) => 
      i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
    ).join(" ");

    const color = trend.direction === "improving" ? "#22c55e" : 
                  trend.direction === "worsening" ? "#ef4444" : "#6b7280";

    return { path: pathStr, trend, color };
  }, [data, currentIsCurrent]);

  // If currently current, show simple green indicator
  if (currentIsCurrent) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <span className="text-green-600 text-xs font-medium">●</span>
        <span className="text-green-600 text-xs">Current</span>
      </span>
    );
  }

  // Trend indicator arrow
  const TrendArrow = () => {
    if (trend.direction === "improving") {
      return (
        <span className="inline-flex items-center text-green-600" title="Wait times decreasing">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M5 8L1 3h8L5 8Z" />
          </svg>
        </span>
      );
    }
    if (trend.direction === "worsening") {
      return (
        <span className="inline-flex items-center text-red-600" title="Wait times increasing">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M5 2L9 7H1L5 2Z" />
          </svg>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-gray-500" title="Stable">
        <span className="text-xs">→</span>
      </span>
    );
  };

  // If we have a sparkline path, show it with the trend arrow
  if (path) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <svg width={44} height={14} viewBox="0 0 44 14">
          <path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <TrendArrow />
      </span>
    );
  }

  // No sparkline but we have a trend direction
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <TrendArrow />
    </span>
  );
}

// Simple velocity badge
export function VelocityBadge({ monthsPerYear, className = "" }: { monthsPerYear: number; className?: string }) {
  let colorClass = "bg-red-100 text-red-700";
  let label = "Very Slow";
  
  if (monthsPerYear >= 12) {
    colorClass = "bg-green-100 text-green-700";
    label = "Current";
  } else if (monthsPerYear >= 9) {
    colorClass = "bg-green-100 text-green-700";
    label = "Fast";
  } else if (monthsPerYear >= 6) {
    colorClass = "bg-yellow-100 text-yellow-700";
    label = "Moderate";
  } else if (monthsPerYear >= 3) {
    colorClass = "bg-orange-100 text-orange-700";
    label = "Slow";
  }

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${colorClass} ${className}`}>
      {Math.round(monthsPerYear)} mo/yr
      <span className="opacity-70">·</span>
      {label}
    </span>
  );
}
