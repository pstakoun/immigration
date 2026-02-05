"use client";

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

/**
 * Get text color based on velocity (months advanced per year)
 * green (fast) → teal → amber → orange → red (slow)
 */
function getVelocityColor(monthsPerYear: number): string {
  if (monthsPerYear >= 10) return "text-green-600";
  if (monthsPerYear >= 6) return "text-teal-600";
  if (monthsPerYear >= 4) return "text-amber-600";
  if (monthsPerYear >= 2) return "text-orange-600";
  return "text-red-600";
}

/**
 * VelocitySparkline - Displays velocity as colored text
 */
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
  const displayVelocity = velocity || (data.length > 0 
    ? data.slice(-3).reduce((sum, d) => sum + d.monthsPerYear, 0) / Math.min(3, data.length)
    : 0);
  
  // Current - no backlog
  if (currentIsCurrent || displayVelocity >= 12) {
    return (
      <span className={`text-sm font-medium text-green-600 ${className}`}>
        Current
      </span>
    );
  }
  
  const color = getVelocityColor(displayVelocity);
  const rounded = Math.round(displayVelocity);
  
  return (
    <span className={`text-sm font-medium ${color} ${className}`}>
      {rounded} mo/yr
    </span>
  );
}
