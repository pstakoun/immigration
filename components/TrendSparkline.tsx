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
  direction: "improving" | "worsening" | "stable" | "current";
  changePerYear: number;
} {
  if (data.length < 2) {
    return { direction: "stable", changePerYear: 0 };
  }

  // Check if mostly current (0 wait)
  const currentCount = data.filter(d => d.waitMonths === 0).length;
  if (currentCount >= data.length * 0.7) {
    return { direction: "current", changePerYear: 0 };
  }

  // Filter out zeros for trend calculation
  const validData = data.filter(d => d.waitMonths > 0);
  if (validData.length < 2) {
    return { direction: "current", changePerYear: 0 };
  }

  // Compare recent to older wait times
  const recentValues = validData.slice(-4).map(d => d.waitMonths);
  const olderValues = validData.slice(0, 4).map(d => d.waitMonths);
  
  const recentAvg = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
  const olderAvg = olderValues.reduce((a, b) => a + b, 0) / olderValues.length;
  
  // Change in wait time (positive = wait increasing = BAD)
  const totalChange = recentAvg - olderAvg;
  const yearsOfData = Math.max(1, (validData.length - 1) / 4);
  const changePerYear = totalChange / yearsOfData;
  
  // Any measurable change in wait time matters to people waiting
  // Even 1 month/year increase over 5 years = 5 more months of waiting
  if (changePerYear < -1) {
    return { direction: "improving", changePerYear }; // Wait decreasing at all
  } else if (changePerYear > 1) {
    return { direction: "worsening", changePerYear }; // Wait increasing at all
  }
  return { direction: "stable", changePerYear };
}

// Sparkline showing wait times over time
// Visual: UP = longer wait (bad), DOWN = shorter wait (good)
interface SparklineCellProps {
  data: WaitTimeDataPoint[];
  className?: string;
}

export function SparklineCell({ data, className = "" }: SparklineCellProps) {
  const { path, trend, color } = useMemo(() => {
    const trend = calculateWaitTrend(data);
    
    if (data.length < 2) {
      return { path: "", trend, color: "#9ca3af" };
    }

    // Check if mostly current
    const currentCount = data.filter(d => d.waitMonths === 0).length;
    if (currentCount >= data.length * 0.7) {
      return { path: "", trend: { direction: "current" as const, changePerYear: 0 }, color: "#22c55e" };
    }

    const validData = data.filter(d => d.waitMonths > 0);
    if (validData.length < 2) {
      return { path: "", trend: { direction: "current" as const, changePerYear: 0 }, color: "#22c55e" };
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
      // In SVG, y=0 is top. High wait should be at top (low y), low wait at bottom (high y)
      const normalizedWait = (d.waitMonths - min) / range; // 0 to 1
      const y = padding + (1 - normalizedWait) * chartHeight; // Flip so high=top
      pts.push({ x, y });
    });

    const pathStr = pts.map((p, i) => 
      i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
    ).join(" ");

    // Color: improving (wait going down) = green, worsening (wait going up) = red
    const color = trend.direction === "improving" ? "#22c55e" : 
                  trend.direction === "worsening" ? "#ef4444" : 
                  trend.direction === "current" ? "#22c55e" : "#6b7280";

    return { path: pathStr, trend, color };
  }, [data]);

  // For "current" categories
  if (trend.direction === "current") {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <span className="text-green-600 text-xs font-medium">●</span>
        <span className="text-green-600 text-xs">Current</span>
      </span>
    );
  }

  if (!path) {
    return <span className={`text-gray-400 ${className}`}>—</span>;
  }

  // Trend indicator
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
