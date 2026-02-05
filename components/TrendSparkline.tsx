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
// For velocity: INCREASING = improving (good), DECREASING = worsening (bad)
function calculateVelocityTrend(data: VelocityDataPoint[]): {
  direction: "improving" | "worsening" | "stable" | "current";
  change: number;
} {
  if (data.length < 2) {
    return { direction: "stable", change: 0 };
  }

  // Check if mostly current (high velocity = 12+ mo/yr)
  const currentCount = data.filter(d => d.monthsPerYear >= 12).length;
  if (currentCount >= data.length * 0.7) {
    return { direction: "current", change: 0 };
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
    return { direction: "improving", change }; // Velocity increasing = good
  } else if (change < -1) {
    return { direction: "worsening", change }; // Velocity decreasing = bad
  }
  return { direction: "stable", change };
}

// Sparkline component showing velocity over time
// UP = faster (good), DOWN = slower (bad) - intuitive!
interface VelocitySparklineProps {
  data: VelocityDataPoint[];
  currentIsCurrent?: boolean;
  className?: string;
}

export function VelocitySparkline({ data, currentIsCurrent = false, className = "" }: VelocitySparklineProps) {
  const { path, trend, color } = useMemo(() => {
    // If currently current, show green indicator
    if (currentIsCurrent) {
      return { 
        path: "", 
        trend: { direction: "current" as const, change: 0 }, 
        color: "#22c55e" 
      };
    }
    
    const trend = calculateVelocityTrend(data);
    
    if (data.length < 2) {
      return { path: "", trend, color: "#9ca3af" };
    }

    // Check if mostly current
    const currentCount = data.filter(d => d.monthsPerYear >= 12).length;
    if (currentCount >= data.length * 0.7) {
      return { path: "", trend: { direction: "current" as const, change: 0 }, color: "#22c55e" };
    }

    const velocities = data.map(d => d.monthsPerYear);
    const min = Math.min(...velocities);
    const max = Math.max(...velocities);
    const range = max - min || 1;

    const width = 44;
    const height = 14;
    const padding = 1;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Build path - HIGH velocity = TOP (good), LOW velocity = BOTTOM (bad)
    // This is INTUITIVE: up = faster = better!
    const pts: { x: number; y: number }[] = [];
    data.forEach((d, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const normalizedVelocity = (d.monthsPerYear - min) / range;
      const y = padding + (1 - normalizedVelocity) * chartHeight; // High velocity = top
      pts.push({ x, y });
    });

    const pathStr = pts.map((p, i) => 
      i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
    ).join(" ");

    // Color: improving (velocity up) = green, worsening (velocity down) = red
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

  // Trend indicator arrow - UP = good (green), DOWN = bad (red)
  const TrendArrow = () => {
    if (trend.direction === "improving") {
      return (
        <span className="inline-flex items-center text-green-600" title="Velocity increasing (good)">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M5 2L9 7H1L5 2Z" />
          </svg>
        </span>
      );
    }
    if (trend.direction === "worsening") {
      return (
        <span className="inline-flex items-center text-red-600" title="Velocity decreasing (bad)">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M5 8L1 3h8L5 8Z" />
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
  // If the date is "Current", show that consistently
  if (isCurrent) {
    return <span className={`font-medium text-green-600 ${className}`}>Current</span>;
  }
  
  let colorClass: string;
  
  if (monthsPerYear >= 12) {
    colorClass = "text-green-600";
  } else if (monthsPerYear >= 6) {
    colorClass = "text-yellow-600";
  } else if (monthsPerYear >= 3) {
    colorClass = "text-orange-500";
  } else {
    colorClass = "text-red-600";
  }

  if (monthsPerYear >= 12) {
    return <span className={`font-medium ${colorClass} ${className}`}>Current</span>;
  }

  return (
    <span className={`font-medium ${colorClass} ${className}`}>
      {monthsPerYear.toFixed(0)} mo/yr
    </span>
  );
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

// Legacy SparklineCell - redirect to VelocitySparkline
export function SparklineCell({ data, currentIsCurrent = false, className = "" }: { 
  data: WaitTimeDataPoint[] | VelocityDataPoint[]; 
  currentIsCurrent?: boolean;
  className?: string;
}) {
  // Convert if needed
  const velocityData = data as VelocityDataPoint[];
  return <VelocitySparkline data={velocityData} currentIsCurrent={currentIsCurrent} className={className} />;
}
