import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PERM Labor Certification | Stateside",
  description:
    "How PERM works: prevailing wage, recruitment, filing, and what to expect from the DOL process.",
  openGraph: {
    title: "PERM Labor Certification | Stateside",
    description: "Step-by-step guide to PERM for employer-sponsored green cards.",
  },
};

export default function PERMProcessGuide() {
  return (
    <article className="bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
        <Link 
          href="/guides" 
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Guides
        </Link>
        
        <h1 className="mt-6 text-2xl font-semibold text-gray-900">
          PERM Labor Certification
        </h1>
        <p className="mt-2 text-gray-600">
          The first major step in employer-sponsored green cards.
        </p>

        <div className="mt-8 prose prose-gray max-w-none">
          <p>
            PERM is the Department of Labor&apos;s process for proving that hiring you 
            won&apos;t take a job from a qualified US worker. It&apos;s required for most 
            EB-2 and EB-3 green cards.
          </p>

          <p>
            Total time from start to approval: <strong>18–24 months</strong>. 
            This is often the longest part of the green card process.
          </p>

          <h2>The steps</h2>

          <h3>1. Prevailing Wage Determination</h3>
          <p className="text-sm text-gray-500 -mt-2 mb-3">5–7 months</p>
          <p>
            Your employer submits ETA-9141 to DOL with the job description, duties, 
            requirements, and work location. DOL determines the minimum salary 
            they must pay—this becomes the &quot;prevailing wage.&quot;
          </p>

          <h3>2. Recruitment</h3>
          <p className="text-sm text-gray-500 -mt-2 mb-3">2–3 months</p>
          <p>
            Your employer advertises the position and interviews any US applicants 
            who respond. The goal is to document that no qualified US workers are 
            available.
          </p>
          <p>Required recruitment:</p>
          <ul>
            <li>30-day job posting on employer&apos;s website</li>
            <li>30-day State Workforce Agency job order</li>
            <li>Two Sunday newspaper ads</li>
            <li>Three additional methods (job sites, campus recruiting, trade publications, etc.)</li>
          </ul>

          <h3>3. PERM Filing</h3>
          <p className="text-sm text-gray-500 -mt-2 mb-3">12–18 months processing</p>
          <p>
            File ETA-9089 electronically. This is when your <strong>priority date</strong> is 
            established—the date that determines your place in line if there&apos;s a backlog.
          </p>

          <h2>Audits</h2>
          <p>
            About 30% of PERM applications get audited. DOL asks for documentation 
            of the recruitment process, applicant evaluations, etc. An audit adds 
            6–12 months but doesn&apos;t mean denial—most audited cases are eventually certified.
          </p>

          <h2>Common problems</h2>
          <ul>
            <li><strong>Inflated requirements:</strong> Job requirements must match what&apos;s actually needed, not be tailored to your specific background</li>
            <li><strong>Poor documentation:</strong> Keep copies of every ad, every application, every interview note</li>
            <li><strong>Missing the 180-day deadline:</strong> PERM expires 180 days after approval—file I-140 before then</li>
          </ul>

          <h2>After PERM</h2>
          <p>
            Once PERM is approved, your employer has 180 days to file I-140. 
            The priority date from your PERM carries forward—this is crucial 
            for India/China where you&apos;ll be waiting years for that date to become current.
          </p>

          <h2>Changing jobs during PERM</h2>
          <p>
            PERM is employer and position-specific. If you change jobs before 
            I-140 approval, you generally need to start over with the new employer. 
            However, after I-140 is approved for 180 days, your priority date 
            becomes portable.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link 
            href="/" 
            className="text-brand-600 hover:text-brand-700 font-medium"
          >
            See your timeline →
          </Link>
        </div>
      </div>
    </article>
  );
}
