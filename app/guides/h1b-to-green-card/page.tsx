import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "H-1B to Green Card | Stateside",
  description:
    "How to get a green card from H-1B status through employer sponsorship. PERM, I-140, I-485 process explained.",
  openGraph: {
    title: "H-1B to Green Card | Stateside",
    description: "The employer-sponsored path from H-1B to permanent residence.",
  },
};

export default function H1BToGreenCardGuide() {
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
          H-1B to Green Card
        </h1>
        <p className="mt-2 text-gray-600">
          The standard employer-sponsored path to permanent residence.
        </p>

        <div className="mt-8 prose prose-gray max-w-none">
          <p>
            Most H-1B holders get green cards through their employer via the EB-2 or EB-3 
            categories. The process has three main phases: PERM labor certification, 
            I-140 immigrant petition, and I-485 adjustment of status.
          </p>

          <p>
            For most countries, this takes <strong>2–3 years</strong>. For India, expect <strong>10+ years</strong> due 
            to per-country visa limits. China is somewhere in between at 3–5 years.
          </p>

          <h2>The process</h2>

          <h3>1. Prevailing Wage Determination</h3>
          <p className="text-sm text-gray-500 -mt-2 mb-3">5–7 months</p>
          <p>
            Your employer requests a wage determination from the Department of Labor. 
            This sets the minimum salary they must pay for your position and location.
          </p>

          <h3>2. PERM Recruitment</h3>
          <p className="text-sm text-gray-500 -mt-2 mb-3">2–3 months</p>
          <p>
            Your employer advertises the position and interviews any US applicants. 
            This &quot;labor market test&quot; proves no qualified US workers are available.
            Required: 30-day website posting, state workforce agency listing, 
            two Sunday newspaper ads, plus three additional recruitment methods.
          </p>

          <h3>3. PERM Labor Certification</h3>
          <p className="text-sm text-gray-500 -mt-2 mb-3">12–18 months</p>
          <p>
            File ETA-9089 with DOL. This is when your <strong>priority date</strong> is established—the 
            date that determines your place in line for a green card.
            About 30% of cases get audited, which adds 6+ months.
          </p>

          <h3>4. I-140 Immigrant Petition</h3>
          <p className="text-sm text-gray-500 -mt-2 mb-3">6–9 months (or 15 days with premium processing)</p>
          <p>
            Your employer petitions USCIS to classify you as an immigrant worker. 
            Premium processing costs $2,805 but gets you a decision in 15 business days.
            Once approved for 180 days, your priority date is locked in permanently—even 
            if you change employers.
          </p>

          <h3>5. Priority Date Wait</h3>
          <p className="text-sm text-gray-500 -mt-2 mb-3">Varies by country</p>
          <p>
            If you&apos;re from India or China, you&apos;ll wait for your priority date to become 
            &quot;current&quot; in the monthly Visa Bulletin. Most other countries have no wait.
          </p>

          <h3>6. I-485 Adjustment of Status</h3>
          <p className="text-sm text-gray-500 -mt-2 mb-3">10–18 months</p>
          <p>
            File your green card application once your priority date is current. 
            You can file I-765 (EAD) and I-131 (Advance Parole) at the same time 
            to get work and travel authorization while waiting.
          </p>

          <h2>EB-2 vs EB-3</h2>
          <p>
            <strong>EB-2</strong> requires a Master&apos;s degree or Bachelor&apos;s + 5 years of experience.
            <strong> EB-3</strong> just needs a Bachelor&apos;s degree.
          </p>
          <p>
            For most countries, both are current (no wait). For India and China, 
            the backlogs are similar, so many people file both to have flexibility.
          </p>

          <h2>H-1B extensions beyond 6 years</h2>
          <p>
            H-1B normally maxes out at 6 years. But if you have an approved I-140 
            (or PERM pending for 365+ days), you can extend indefinitely until 
            your green card is approved.
          </p>

          <h2>Changing employers</h2>
          <p>
            <strong>During PERM:</strong> Generally need to restart with new employer.<br />
            <strong>After I-140 approved 180+ days:</strong> Priority date is portable—you keep your place in line.<br />
            <strong>After I-485 pending 180+ days:</strong> Can change to a &quot;same or similar&quot; job (AC21 portability).
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
