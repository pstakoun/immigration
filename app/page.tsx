"use client";

import { useState, useCallback } from "react";
import TimelineChart from "@/components/TimelineChart";
import PathDetail from "@/components/PathDetail";
import FilterPanel from "@/components/FilterPanel";
import { FilterState, defaultFilters } from "@/lib/filter-paths";

export default function Home() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [matchingCount, setMatchingCount] = useState(0);

  const handleMatchingCountChange = useCallback((count: number) => {
    setMatchingCount(count);
  }, []);

  return (
    <main className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-brand-800 to-brand-700 px-6 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          {/* Logo */}
          <svg
            width="36"
            height="36"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path
              d="M75 28c0-7.7-6.3-14-14-14H42c-7.7 0-14 6.3-14 14s6.3 14 14 14h19c7.7 0 14 6.3 14 14s-6.3 14-14 14H47"
              stroke="white"
              strokeWidth="13"
              strokeLinecap="round"
            />
            <path
              d="M56 70l-12 12M56 70l-12-12"
              stroke="#fbbf24"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Stateside
            </h1>
            <p className="text-brand-200 text-sm">
              Your path to US immigration
            </p>
          </div>
        </div>
      </header>

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onChange={setFilters}
        matchingCount={matchingCount}
      />

      {/* Timeline area */}
      <div className="flex-1 relative overflow-hidden">
        <TimelineChart
          onStageClick={setSelectedNode}
          filters={filters}
          onMatchingCountChange={handleMatchingCountChange}
        />

        {/* Slide-out detail panel */}
        {selectedNode && (
          <>
            <div
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setSelectedNode(null)}
            />
            <PathDetail nodeId={selectedNode} onClose={() => setSelectedNode(null)} />
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-brand-900 px-6 py-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto text-xs text-brand-300 text-center">
          Live data from DOL, USCIS, and State Dept. Timelines are estimates. Always consult an immigration attorney.
        </div>
      </footer>
    </main>
  );
}
