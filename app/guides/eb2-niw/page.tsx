import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EB-2 NIW | Stateside",
  description:
    "Self-petition for a green card without employer sponsorship through the National Interest Waiver.",
  openGraph: {
    title: "EB-2 NIW | Stateside",
    description: "Get a green card without employer sponsorship.",
  },
};

export default function EB2NIWGuide() {
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
          EB-2 NIW
        </h1>
        <p className="mt-2 text-gray-600">
          Self-petition without employer sponsorship.
        </p>

        <div className="mt-8 prose prose-gray max-w-none">
          <p>
            The National Interest Waiver lets you petition for a green card yourself—no 
            employer sponsor, no PERM labor certification. You argue that your work 
            benefits the US enough to waive the normal job offer requirement.
          </p>

          <p>
            Approval rate is around <strong>85–90%</strong> for well-prepared cases. 
            Timeline is <strong>1.5–2.5 years</strong> for most countries, but you&apos;re still 
            subject to the EB-2 backlog if you&apos;re from India or China.
          </p>

          <h2>Requirements</h2>
          <p>You need an advanced degree (Master&apos;s or higher) OR a Bachelor&apos;s plus 5 years 
          of progressive experience OR &quot;exceptional ability&quot; in your field.</p>

          <h2>The Dhanasar test</h2>
          <p>Since 2016, NIW petitions are evaluated on three criteria:</p>
          
          <h3>1. Substantial merit and national importance</h3>
          <p>
            Your proposed work must matter beyond just you or your employer. 
            &quot;National&quot; doesn&apos;t mean nationwide—significance in a specific industry 
            or region counts. Research, healthcare, STEM, entrepreneurship creating 
            jobs—all can qualify.
          </p>

          <h3>2. Well positioned to advance the endeavor</h3>
          <p>
            You have the background, skills, and resources to actually do this work. 
            Show your track record: publications, patents, prior success, concrete plans.
          </p>

          <h3>3. Beneficial to waive the job offer</h3>
          <p>
            Explain why requiring PERM would be impractical or why your flexibility 
            benefits the national interest. If your work isn&apos;t tied to one employer, 
            this is easier to argue.
          </p>

          <h2>Evidence that helps</h2>
          <ul>
            <li>Publications with citations</li>
            <li>Patents</li>
            <li>Letters from independent experts (not just your boss)</li>
            <li>Media coverage of your work</li>
            <li>Evidence of impact—how has your work been used or adopted?</li>
          </ul>

          <h2>Who this works well for</h2>
          <ul>
            <li>Researchers and academics with publications</li>
            <li>Engineers with patents or significant technical contributions</li>
            <li>Healthcare professionals, especially in underserved areas</li>
            <li>Entrepreneurs creating jobs</li>
            <li>Data scientists and AI/ML researchers</li>
          </ul>

          <h2>Process</h2>
          <p>
            Prepare petition (1–3 mo) → File I-140 (6–9 mo, or ~45 days with premium) → 
            File I-485 when current → EAD/AP (3–5 mo) → Green Card (10–18 mo)
          </p>

          <h2>Costs</h2>
          <p>
            Filing fees are around $4,000. Most people use an attorney ($5,000–10,000) 
            since the petition requires careful legal argumentation.
          </p>

          <h2>Advantages</h2>
          <ul>
            <li>No employer dependency—change jobs freely</li>
            <li>No PERM (saves 1.5+ years)</li>
            <li>Can file alongside an employer-sponsored case as a backup</li>
          </ul>
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
