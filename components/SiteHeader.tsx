"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { name: "Timeline Tool", href: "/" },
  { name: "Guides", href: "/guides" },
  { name: "Processing Times", href: "/processing-times" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
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
            <span className="text-xl font-semibold text-gray-900 tracking-tight">
              Stateside
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/"
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Plan My Path
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? (
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg text-center transition-colors"
              >
                Plan My Path
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
