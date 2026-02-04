"use client";

import { useMemo, useState } from "react";

interface SparklineDataPoint {
  label: string;  // e.g., "Jan 2023"
  value: number;  // months from epoch (2000) - null values become 0
}

interface TrendSparklineProps {
  data: SparklineDataPoint[];
  width?: number;
  height?: number;
  strokeColor?: string;
  fillColor?: string;
  className?: string;
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

// Format months since 2000 back to "Mon YYYY" format
export function formatMonthsSinceEpoch(months: number): string {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const year = Math.floor(months / 12) + 2000;
  const month = months % 12;
  return `${monthNames[month]} ${year}`;
}

// Parse bulletin month like "January 2023" to sortable value
export function parseBulletinMonth(dateStr: string): number {
  const months: Record<string, number> = {
    january: 0, february: 1, march: 2, april: 3, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
    jan: 0, feb: 1, mar: 2, apr: 3, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    may: 4,  // May is same for full and abbrev
  };
  
  const match = dateStr.match(/([a-z]+)\s*(\d{4})/i);
  if (!match) return 0;
  
  const monthNum = months[match[1].toLowerCase()];
  const year = parseInt(match[2], 10);
  
  if (monthNum === undefined || isNaN(year)) return 0;
  
  return year * 12 + monthNum;
}

export default function TrendSparkline({
  data,
  width = 100,
  height = 28,
  strokeColor = "#3b82f6",
  fillColor = "#dbeafe",
  className = "",
}: TrendSparklineProps) {
  const { path, areaPath, trend } = useMemo(() => {
    if (data.length < 2) {
      return { path: "", areaPath: "", trend: "flat" as const };
    }

    // Filter out null values (Current = very high value for visualization)
    const validData = data.map(d => ({
      ...d,
      value: d.value === null || d.value === 0 ? null : d.value
    }));
    
    // Find min/max of non-null values
    const nonNullValues = validData.filter(d => d.value !== null).map(d => d.value as number);
    if (nonNullValues.length < 2) {
      return { path: "", areaPath: "", trend: "flat" as const };
    }

    const min = Math.min(...nonNullValues);
    const max = Math.max(...nonNullValues);
    const range = max - min || 1;

    // Add padding
    const padding = 3;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Calculate points (skip nulls - "Current" values)
    const pts: { x: number; y: number }[] = [];
    let pointIndex = 0;
    const totalPoints = validData.filter(d => d.value !== null).length;
    
    validData.forEach((d) => {
      if (d.value !== null) {
        const x = padding + (pointIndex / (totalPoints - 1)) * chartWidth;
        const y = padding + chartHeight - ((d.value - min) / range) * chartHeight;
        pts.push({ x, y });
        pointIndex++;
      }
    });

    if (pts.length < 2) {
      return { path: "", areaPath: "", trend: "flat" as const };
    }

    // Create SVG path
    const pathStr = pts.map((p, i) => 
      i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
    ).join(" ");

    // Create area path (for fill under curve)
    const areaPathStr = [
      `M ${pts[0].x} ${height - padding}`,
      ...pts.map(p => `L ${p.x} ${p.y}`),
      `L ${pts[pts.length - 1].x} ${height - padding}`,
      "Z"
    ].join(" ");

    // Calculate trend (compare recent to older)
    const recentValues = nonNullValues.slice(-4);
    const olderValues = nonNullValues.slice(0, 4);
    const recentAvg = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
    const olderAvg = olderValues.reduce((a, b) => a + b, 0) / olderValues.length;
    
    // Positive change = dates moving forward = improving
    const change = recentAvg - olderAvg;
    const trendDir = change > 6 ? "improving" : change < -6 ? "worsening" : "flat";

    return { 
      path: pathStr, 
      areaPath: areaPathStr, 
      trend: trendDir,
    };
  }, [data, width, height]);

  if (!path) {
    return <div className={`text-gray-400 text-xs ${className}`}>—</div>;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Fill under curve */}
        <path
          d={areaPath}
          fill={fillColor}
          opacity={0.5}
        />
        {/* Line */}
        <path
          d={path}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* Trend indicator */}
      {trend === "improving" && (
        <svg width="10" height="10" viewBox="0 0 10 10" className="text-green-600">
          <path d="M5 1L9 6H1L5 1Z" fill="currentColor" />
        </svg>
      )}
      {trend === "worsening" && (
        <svg width="10" height="10" viewBox="0 0 10 10" className="text-red-600">
          <path d="M5 9L1 4H9L5 9Z" fill="currentColor" />
        </svg>
      )}
    </div>
  );
}

// Velocity badge component
interface VelocityBadgeProps {
  monthsPerYear: number;
  className?: string;
}

export function VelocityBadge({ monthsPerYear, className = "" }: VelocityBadgeProps) {
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

// Unified Historical Trends Chart - shows all data in one interactive view
interface HistoricalTrendsChartProps {
  data: {
    eb1: { india: SparklineDataPoint[]; china: SparklineDataPoint[]; other: SparklineDataPoint[] };
    eb2: { india: SparklineDataPoint[]; china: SparklineDataPoint[]; other: SparklineDataPoint[] };
    eb3: { india: SparklineDataPoint[]; china: SparklineDataPoint[]; other: SparklineDataPoint[] };
  };
  className?: string;
}

type Category = "eb1" | "eb2" | "eb3";
type Country = "india" | "china" | "other";

const CATEGORY_LABELS: Record<Category, string> = {
  eb1: "EB-1",
  eb2: "EB-2", 
  eb3: "EB-3",
};

const COUNTRY_LABELS: Record<Country, string> = {
  india: "India",
  china: "China",
  other: "ROW",
};

const COUNTRY_COLORS: Record<Country, { stroke: string; fill: string }> = {
  india: { stroke: "#ef4444", fill: "#fee2e2" },
  china: { stroke: "#3b82f6", fill: "#dbeafe" },
  other: { stroke: "#22c55e", fill: "#dcfce7" },
};

export function HistoricalTrendsChart({ data, className = "" }: HistoricalTrendsChartProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("eb2");
  const [hoveredPoint, setHoveredPoint] = useState<{ country: Country; index: number; x: number; y: number; label: string; value: string } | null>(null);

  const chartData = useMemo(() => {
    const categoryData = data[selectedCategory];
    
    // Get all bulletin months for x-axis (sorted)
    const allLabels = new Set<string>();
    (["india", "china", "other"] as Country[]).forEach(country => {
      categoryData[country].forEach(d => allLabels.add(d.label));
    });
    const sortedLabels = Array.from(allLabels).sort((a, b) => 
      parseBulletinMonth(a) - parseBulletinMonth(b)
    );

    // Get min/max values across all countries for this category
    let minVal = Infinity;
    let maxVal = -Infinity;
    (["india", "china", "other"] as Country[]).forEach(country => {
      categoryData[country].forEach(d => {
        if (d.value !== null && d.value !== 0) {
          minVal = Math.min(minVal, d.value);
          maxVal = Math.max(maxVal, d.value);
        }
      });
    });

    // Add some padding to the range
    const range = maxVal - minVal;
    minVal -= range * 0.05;
    maxVal += range * 0.05;

    return { labels: sortedLabels, minVal, maxVal, categoryData };
  }, [data, selectedCategory]);

  const padding = { top: 24, right: 16, bottom: 32, left: 60 };
  const width = 700;
  const height = 240;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Generate paths for each country
  const countryPaths = useMemo(() => {
    const paths: Record<Country, { path: string; points: { x: number; y: number; label: string; value: number }[] }> = {
      india: { path: "", points: [] },
      china: { path: "", points: [] },
      other: { path: "", points: [] },
    };

    (["india", "china", "other"] as Country[]).forEach(country => {
      const entries = chartData.categoryData[country];
      const points: { x: number; y: number; label: string; value: number }[] = [];

      chartData.labels.forEach((label, i) => {
        const entry = entries.find(e => e.label === label);
        if (entry && entry.value !== null && entry.value !== 0) {
          const x = padding.left + (i / (chartData.labels.length - 1)) * chartWidth;
          const ratio = (entry.value - chartData.minVal) / (chartData.maxVal - chartData.minVal);
          const y = padding.top + chartHeight * (1 - ratio);
          points.push({ x, y, label, value: entry.value });
        }
      });

      if (points.length >= 2) {
        paths[country].path = points.map((p, i) => 
          i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
        ).join(" ");
        paths[country].points = points;
      }
    });

    return paths;
  }, [chartData, chartWidth, chartHeight, padding.left, padding.top]);

  // Generate y-axis labels
  const yAxisLabels = useMemo(() => {
    const labels: { y: number; text: string }[] = [];
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      const y = padding.top + chartHeight * (1 - ratio);
      const val = chartData.minVal + (chartData.maxVal - chartData.minVal) * ratio;
      labels.push({ y, text: formatMonthsSinceEpoch(Math.round(val)) });
    }
    return labels;
  }, [chartData, chartHeight, padding.top]);

  // Generate x-axis labels (show every 4th label to avoid crowding)
  const xAxisLabels = useMemo(() => {
    return chartData.labels.filter((_, i) => i % 4 === 0 || i === chartData.labels.length - 1).map((label, i, arr) => {
      const originalIndex = chartData.labels.indexOf(label);
      const x = padding.left + (originalIndex / (chartData.labels.length - 1)) * chartWidth;
      // Shorten label: "January 2023" -> "Jan '23"
      const short = label.replace(/(\w{3})\w*\s*(\d{2})(\d{2})/, "$1 '$3");
      return { x, text: short };
    });
  }, [chartData.labels, chartWidth, padding.left]);

  return (
    <div className={`${className}`}>
      {/* Category selector tabs */}
      <div className="flex items-center gap-1 mb-4">
        <span className="text-sm text-gray-600 mr-2">Category:</span>
        {(["eb1", "eb2", "eb3"] as Category[]).map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              selectedCategory === cat 
                ? "bg-brand-500 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-3">
        {(["india", "china", "other"] as Country[]).map(country => (
          <div key={country} className="flex items-center gap-1.5">
            <div 
              className="w-3 h-0.5 rounded" 
              style={{ backgroundColor: COUNTRY_COLORS[country].stroke }}
            />
            <span className="text-xs text-gray-600">{COUNTRY_LABELS[country]}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="relative">
        <svg width={width} height={height} className="overflow-visible">
          {/* Grid lines */}
          {yAxisLabels.map((label, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={label.y}
                y2={label.y}
                stroke="#e5e7eb"
                strokeWidth={1}
                strokeDasharray={i === 0 || i === yAxisLabels.length - 1 ? "0" : "4 2"}
              />
              <text
                x={padding.left - 8}
                y={label.y}
                textAnchor="end"
                dominantBaseline="middle"
                className="text-[10px] fill-gray-500"
              >
                {label.text}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {xAxisLabels.map((label, i) => (
            <text
              key={i}
              x={label.x}
              y={height - 8}
              textAnchor="middle"
              className="text-[10px] fill-gray-500"
            >
              {label.text}
            </text>
          ))}

          {/* Data lines */}
          {(["other", "china", "india"] as Country[]).map(country => (
            <g key={country}>
              {countryPaths[country].path && (
                <path
                  d={countryPaths[country].path}
                  fill="none"
                  stroke={COUNTRY_COLORS[country].stroke}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {/* Interactive points */}
              {countryPaths[country].points.map((point, i) => (
                <circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r={hoveredPoint?.country === country && hoveredPoint?.index === i ? 5 : 3}
                  fill={COUNTRY_COLORS[country].stroke}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredPoint({ 
                    country, 
                    index: i, 
                    x: point.x, 
                    y: point.y,
                    label: point.label,
                    value: formatMonthsSinceEpoch(point.value)
                  })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </g>
          ))}

          {/* Tooltip */}
          {hoveredPoint && (
            <g>
              <rect
                x={hoveredPoint.x - 50}
                y={hoveredPoint.y - 45}
                width={100}
                height={36}
                rx={4}
                fill="#1f2937"
                opacity={0.95}
              />
              <text
                x={hoveredPoint.x}
                y={hoveredPoint.y - 32}
                textAnchor="middle"
                className="text-[10px] fill-gray-300"
              >
                {hoveredPoint.label}
              </text>
              <text
                x={hoveredPoint.x}
                y={hoveredPoint.y - 18}
                textAnchor="middle"
                className="text-[11px] fill-white font-medium"
              >
                {COUNTRY_LABELS[hoveredPoint.country]}: {hoveredPoint.value}
              </text>
            </g>
          )}
        </svg>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Shows Final Action Date movement over time. Higher = more recent priority dates = shorter backlog.
      </p>
    </div>
  );
}
