import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 px-4 md:px-6 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Stateside
          </Link>
          <span className="text-gray-300">·</span>
          <Link href="/guides" className="hover:text-gray-900 transition-colors">
            Guides
          </Link>
          <span className="text-gray-300">·</span>
          <Link href="/processing-times" className="hover:text-gray-900 transition-colors">
            Processing Times
          </Link>
        </div>
      </div>
    </footer>
  );
}
