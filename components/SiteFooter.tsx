import Link from "next/link";

const guides = [
  { name: "H-1B to Green Card", href: "/guides/h1b-to-green-card" },
  { name: "TN to Green Card", href: "/guides/tn-to-green-card" },
  { name: "EB-2 NIW Guide", href: "/guides/eb2-niw" },
  { name: "PERM Process", href: "/guides/perm-process" },
];

const resources = [
  { name: "Processing Times", href: "/processing-times" },
  { name: "Timeline Tool", href: "/" },
];

const legal = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-xl font-semibold text-white">Stateside</span>
            </Link>
            <p className="mt-3 text-sm text-gray-400">
              Find your fastest path to a US green card with live USCIS processing times and visa bulletin data.
            </p>
          </div>

          {/* Guides */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
              Guides
            </h3>
            <ul className="mt-4 space-y-2">
              {guides.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              {resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              {legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Stateside. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 max-w-xl text-center md:text-right">
              Disclaimer: This tool provides estimates based on publicly available data. 
              Immigration law is complex—always consult a qualified immigration attorney 
              for advice specific to your situation.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
