import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">Stateside</Link>
            <span className="text-gray-300">·</span>
            <Link href="/guides" className="hover:text-gray-900">Guides</Link>
            <span className="text-gray-300">·</span>
            <Link href="/processing-times" className="hover:text-gray-900">Processing Times</Link>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-400 max-w-2xl">
          Timelines are estimates based on USCIS, DOL, and State Department data. 
          This is not legal advice—consult an immigration attorney for your specific situation.
        </p>
      </div>
    </footer>
  );
}
