"use client";

import { useMemo } from "react";

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
  showTooltip?: boolean;
  className?: string;
}

// Parse date string like "Jul 2013" or "Current" to months since 2000
export function parseVisaBulletinDate(dateStr: string): number | null {
  if (!dateStr || dateStr.toLowerCase() === "current") return null;
  
  const months: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  };
  
  const match = dateStr.match(/([a-z]{3})\s*(\d{4})/i);
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

export default function TrendSparkline({
  data,
  width = 120,
  height = 32,
  strokeColor = "#3b82f6",
  fillColor = "#dbeafe",
  className = "",
}: TrendSparklineProps) {
  const { path, areaPath, points, minVal, maxVal, trend, trendPercent } = useMemo(() => {
    if (data.length < 2) {
      return { path: "", areaPath: "", points: [], minVal: 0, maxVal: 1, trend: "flat" as const, trendPercent: 0 };
    }

    // Filter out null values and get min/max
    const validData = data.filter(d => d.value !== null && d.value !== 0);
    if (validData.length < 2) {
      return { path: "", areaPath: "", points: [], minVal: 0, maxVal: 1, trend: "flat" as const, trendPercent: 0 };
    }

    const values = validData.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    // Add padding
    const padding = 4;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Calculate points
    const pts: { x: number; y: number; label: string; value: number }[] = [];
    validData.forEach((d, i) => {
      const x = padding + (i / (validData.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((d.value - min) / range) * chartHeight;
      pts.push({ x, y, label: d.label, value: d.value });
    });

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

    // Calculate trend (compare last 2 years to first 2 years if enough data)
    const recentAvg = values.slice(-2).reduce((a, b) => a + b, 0) / Math.min(2, values.length);
    const olderAvg = values.slice(0, 2).reduce((a, b) => a + b, 0) / Math.min(2, values.length);
    const trendPct = olderAvg ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;
    
    // Positive trend = dates moving forward = improving (getting more current)
    const trendDir = trendPct > 5 ? "improving" : trendPct < -5 ? "worsening" : "flat";

    return { 
      path: pathStr, 
      areaPath: areaPathStr, 
      points: pts, 
      minVal: min, 
      maxVal: max, 
      trend: trendDir,
      trendPercent: Math.abs(trendPct)
    };
  }, [data, width, height]);

  if (!path) {
    return <div className={`text-gray-400 text-xs ${className}`}>No data</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Fill under curve */}
        <path
          d={areaPath}
          fill={fillColor}
          opacity={0.4}
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
        {/* Start and end dots */}
        {points.length > 0 && (
          <>
            <circle cx={points[0].x} cy={points[0].y} r={2} fill={strokeColor} />
            <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={3} fill={strokeColor} />
          </>
        )}
      </svg>
      {/* Trend indicator */}
      <div className="flex items-center gap-1">
        {trend === "improving" && (
          <span className="text-green-600 text-xs font-medium flex items-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 2L10 7H2L6 2Z" />
            </svg>
          </span>
        )}
        {trend === "worsening" && (
          <span className="text-red-600 text-xs font-medium flex items-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 10L2 5H10L6 10Z" />
            </svg>
          </span>
        )}
        {trend === "flat" && (
          <span className="text-gray-500 text-xs font-medium">→</span>
        )}
      </div>
    </div>
  );
}

// Helper component for showing velocity metrics
interface VelocityBadgeProps {
  monthsPerYear: number;
  className?: string;
}

export function VelocityBadge({ monthsPerYear, className = "" }: VelocityBadgeProps) {
  // Color based on velocity
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
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${colorClass} ${className}`}>
      <span>{Math.round(monthsPerYear)} mo/yr</span>
      <span className="opacity-70">·</span>
      <span>{label}</span>
    </span>
  );
}

// Historical line chart component for more detailed view
interface HistoricalChartProps {
  data: { category: string; country: string; entries: SparklineDataPoint[] }[];
  height?: number;
  className?: string;
}

export function HistoricalChart({ data, height = 200, className = "" }: HistoricalChartProps) {
  const chartData = useMemo(() => {
    // Get all unique labels (bulletin months) for x-axis
    const allLabels = new Set<string>();
    data.forEach(series => {
      series.entries.forEach(e => allLabels.add(e.label));
    });
    const sortedLabels = Array.from(allLabels).sort((a, b) => {
      const aDate = parseVisaBulletinDate(a.replace("January ", "Jan ")) || 0;
      const bDate = parseVisaBulletinDate(b.replace("January ", "Jan ")) || 0;
      return aDate - bDate;
    });

    // Get min/max values across all series
    let minVal = Infinity;
    let maxVal = -Infinity;
    data.forEach(series => {
      series.entries.forEach(e => {
        if (e.value !== null && e.value !== 0) {
          minVal = Math.min(minVal, e.value);
          maxVal = Math.max(maxVal, e.value);
        }
      });
    });

    if (minVal === Infinity) {
      minVal = 0;
      maxVal = 300; // ~25 years
    }

    return { labels: sortedLabels, minVal, maxVal };
  }, [data]);

  const colors = [
    { stroke: "#ef4444", fill: "#fee2e2", name: "India" },
    { stroke: "#3b82f6", fill: "#dbeafe", name: "China" },
    { stroke: "#22c55e", fill: "#dcfce7", name: "ROW" },
  ];

  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = 600;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  return (
    <div className={`overflow-x-auto ${className}`}>
      <svg width={width} height={height} className="min-w-full">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding.top + chartHeight * (1 - ratio);
          const val = chartData.minVal + (chartData.maxVal - chartData.minVal) * ratio;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth={1}
              />
              <text
                x={padding.left - 8}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="text-[10px] fill-gray-500"
              >
                {formatMonthsSinceEpoch(Math.round(val))}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {chartData.labels.map((label, i) => {
          const x = padding.left + (i / (chartData.labels.length - 1)) * chartWidth;
          return (
            <text
              key={label}
              x={x}
              y={height - 8}
              textAnchor="middle"
              className="text-[9px] fill-gray-500"
            >
              {label.replace("January ", "").slice(-4)}
            </text>
          );
        })}

        {/* Data series */}
        {data.map((series, seriesIdx) => {
          const color = colors[seriesIdx % colors.length];
          const points: { x: number; y: number }[] = [];
          
          chartData.labels.forEach((label, i) => {
            const entry = series.entries.find(e => e.label === label);
            if (entry && entry.value !== null && entry.value !== 0) {
              const x = padding.left + (i / (chartData.labels.length - 1)) * chartWidth;
              const ratio = (entry.value - chartData.minVal) / (chartData.maxVal - chartData.minVal);
              const y = padding.top + chartHeight * (1 - ratio);
              points.push({ x, y });
            }
          });

          if (points.length < 2) return null;

          const pathStr = points.map((p, i) => 
            i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
          ).join(" ");

          return (
            <g key={`${series.category}-${series.country}`}>
              <path
                d={pathStr}
                fill="none"
                stroke={color.stroke}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={3} fill={color.stroke} />
              ))}
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${padding.left}, ${padding.top - 10})`}>
          {data.map((series, i) => {
            const color = colors[i % colors.length];
            return (
              <g key={i} transform={`translate(${i * 80}, 0)`}>
                <line x1={0} y1={0} x2={16} y2={0} stroke={color.stroke} strokeWidth={2} />
                <text x={20} y={0} dominantBaseline="middle" className="text-[10px] fill-gray-700">
                  {series.country}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
