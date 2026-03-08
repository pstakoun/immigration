import Link from "next/link";

interface LawyerCTAProps {
  visaType: string;
}

export function LawyerCTA({ visaType }: LawyerCTAProps) {
  return (
    <section className="mt-12 mb-8 rounded-xl border border-brand-200 bg-brand-50/50 p-6 sm:p-8 text-center">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Need help with your case?
      </h3>
      <p className="text-gray-600 mb-5 max-w-md mx-auto">
        Connect with an immigration attorney who specializes in{" "}
        <span className="font-medium text-gray-800">{visaType}</span> cases.
      </p>
      <Link
        href="/find-a-lawyer"
        className="inline-flex items-center px-6 py-3 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors"
      >
        Find a Lawyer
        <svg
          className="ml-2 w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </section>
  );
}
