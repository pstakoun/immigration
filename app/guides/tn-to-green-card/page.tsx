import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TN to Green Card",
  description:
    "How Canadian and Mexican TN visa holders can get a green card while managing dual intent.",
  openGraph: {
    title: "TN to Green Card",
    description: "The path from TN status to permanent residence.",
  },
};

export default function TNToGreenCardGuide() {
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
          TN to Green Card
        </h1>
        <p className="mt-2 text-gray-600">
          For Canadian and Mexican professionals.
        </p>

        <div className="mt-8 prose prose-gray max-w-none">
          <p>
            TN visa holders can absolutely get green cards. The &quot;dual intent&quot; concern 
            is largely historical—thousands of TN holders successfully transition to 
            permanent residence every year.
          </p>

          <p>
            Since Canada and Mexico have <strong>no employment-based visa backlog</strong>, 
            your timeline is typically <strong>2–3 years</strong>. You can often file I-140 and 
            I-485 concurrently.
          </p>

          <h2>The dual intent question</h2>
          <p>
            TN is technically a non-immigrant visa requiring non-immigrant intent. 
            But USCIS has clarified that having a pending green card application 
            doesn&apos;t automatically disqualify you from TN status.
          </p>
          <p>
            The test is whether you intend to maintain your TN status while it&apos;s valid—not 
            whether you might eventually want to stay permanently.
          </p>

          <h2>Your options</h2>
          
          <h3>Direct from TN</h3>
          <p>
            File for a green card while on TN status. This is the most common approach now. 
            Your employer files PERM and I-140, then you file I-485 when your priority 
            date is current (which is immediately for Canadians/Mexicans).
          </p>
          <p>
            Once you file I-485, get Advance Parole before any international travel. 
            This protects your application if there are any border issues.
          </p>

          <h3>TN → H-1B → Green Card</h3>
          <p>
            Some people switch to H-1B first because it has clear dual intent. 
            The downsides: H-1B lottery has only ~25% selection rate, and it adds 
            a year or more to your timeline.
          </p>

          <h3>EB-2 NIW</h3>
          <p>
            Self-petition without employer sponsorship. No PERM required. 
            Good if you qualify and want independence from your employer.
          </p>

          <h2>Timeline</h2>
          <p>
            Prevailing Wage (5–7 mo) → Recruitment (2–3 mo) → PERM (12–18 mo) → 
            I-140 + I-485 concurrent → EAD/AP (3–5 mo) → Green Card (10–18 mo after I-485)
          </p>
          <p>
            Total: approximately 2.5–3.5 years.
          </p>

          <h2>Tips</h2>
          <ul>
            <li>Get Advance Parole before traveling internationally after filing I-485</li>
            <li>Your spouse gets an EAD once I-485 is filed (TD status doesn&apos;t allow work)</li>
            <li>Consider renewing your TN before filing I-485 for extra runway</li>
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
