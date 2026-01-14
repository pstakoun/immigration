"use client";

import { useState, useEffect } from "react";
import TimelineChart from "./TimelineChart";
import MobileTimeline from "./MobileTimeline";
import { FilterState } from "@/lib/filter-paths";
import { ComposedPath } from "@/lib/path-composer";
import { GlobalProgress } from "@/app/page";

interface ResponsiveTimelineProps {
  onStageClick: (nodeId: string) => void;
  filters: FilterState;
  onMatchingCountChange: (count: number) => void;
  onSelectPath?: (path: ComposedPath) => void;
  onPathsGenerated?: (paths: ComposedPath[]) => void;
  selectedPathId?: string | null;
  globalProgress?: GlobalProgress | null;
}

// Breakpoint for mobile (tailwind md = 768px)
const MOBILE_BREAKPOINT = 768;

export default function ResponsiveTimeline(props: ResponsiveTimelineProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Check initial screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    setIsHydrated(true);

    // Add resize listener
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Server-side or before hydration: render mobile by default for better mobile-first experience
  // This prevents layout shift on mobile devices
  if (!isHydrated) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 rounded-lg bg-brand-500 animate-pulse" />
      </div>
    );
  }

  return isMobile ? <MobileTimeline {...props} /> : <TimelineChart {...props} />;
}
