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
 * Uses neutral gray tones - purely informational, no judgment implied
 */
function getVelocityColor(monthsPerYear: number): string {
  // Neutral gray - darker for faster (more visible), lighter for slower
  if (monthsPerYear >= 11) return "text-gray-700";    // Fast: 11-12 mo/yr
  if (monthsPerYear >= 10) return "text-gray-600";    // Good: 10 mo/yr
  if (monthsPerYear >= 9) return "text-gray-600";     // Moderate: 9 mo/yr
  if (monthsPerYear >= 6) return "text-gray-500";     // Slow: 6-8 mo/yr
  return "text-gray-500";                              // Very slow: <6 mo/yr
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
  
  // Current - no backlog (use green to match wait time "Current" color)
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
