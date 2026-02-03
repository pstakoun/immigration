"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isGuides = pathname.startsWith("/guides");
  const isProcessingTimes = pathname === "/processing-times";

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xl font-semibold text-gray-900 tracking-tight hidden sm:inline">
              Stateside
            </span>
          </Link>
          <span className="text-sm text-gray-300">|</span>
          <Link
            href="/guides"
            className={`text-sm transition-colors ${
              isGuides 
                ? "text-gray-900 font-medium" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Guides
          </Link>
          <Link
            href="/processing-times"
            className={`text-sm transition-colors ${
              isProcessingTimes 
                ? "text-gray-900 font-medium" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <span className="hidden sm:inline">Processing Times</span>
            <span className="sm:hidden">Times</span>
          </Link>
        </div>

        {/* CTA link - only show on non-home pages */}
        {!isHome && (
          <Link
            href="/"
            className="text-sm text-brand-500 hover:text-brand-600 font-medium transition-colors"
          >
            <span className="hidden sm:inline">See your timeline →</span>
            <span className="sm:hidden">Timeline →</span>
          </Link>
        )}
      </div>
    </header>
  );
}
