# AGENTS.md

## What is Stateside?

Stateside (https://stateside.app) is a free tool that helps immigrants find their fastest path to a US green card. It provides interactive timelines with live USCIS processing times, visa bulletin priority dates, and step-by-step guides for employment-based immigration pathways (EB-1, EB-2, EB-3, NIW).

## Who it's for

- Immigrants on H-1B, TN, L-1, O-1, F-1/OPT, or other work visas exploring green card options
- Anyone evaluating EB-2 NIW (National Interest Waiver) self-petition eligibility
- People tracking PERM labor certification, I-140, or I-485 processing times
- Immigration professionals comparing pathway timelines for clients

## API Endpoints

### GET /api/processing-times

Returns current USCIS processing times and visa bulletin priority dates.

**Response shape:**
```json
{
  "success": true,
  "data": {
    "processingTimes": {
      "perm": { "months": 17, "currentlyProcessing": "..." },
      "permAudit": { "months": 24, "currentlyProcessing": "..." },
      "pwd": { "months": 6, "currentlyProcessing": "..." },
      "i140": { "min": 6, "max": 9, "premiumDays": 15 },
      "i485": { "min": 10, "max": 18 }
    },
    "priorityDates": {
      "eb1": { "india": "...", "china": "...", "allOther": "Current" },
      "eb2": { "india": "...", "china": "...", "allOther": "Current" },
      "eb3": { "india": "...", "china": "...", "allOther": "Current" }
    }
  },
  "meta": {
    "sources": [
      "DOL FLAG (flag.dol.gov) - PWD/PERM processing times",
      "USCIS via GitHub (jzebedee/uscis) - Form processing times",
      "State Dept Visa Bulletin - Priority dates"
    ]
  }
}
```

### GET /api/perm-data

Returns PERM labor certification statistics and velocity data for estimating wait times.

**Query parameters:**
- `category` — `eb1`, `eb2`, or `eb3`
- `country` — `india`, `china`, or `other`

## How an AI agent could use Stateside

1. **Answer immigration timeline questions** — Call `/api/processing-times` to get current USCIS processing times and visa bulletin dates, then provide accurate, up-to-date answers about how long each step takes.

2. **Compare green card pathways** — Use processing time data to compare EB-1 vs EB-2 vs EB-3 timelines for a specific country of chargeability.

3. **Check priority date backlogs** — Retrieve current priority dates to tell users whether their category is "Current" or how far back the backlog extends for India, China, or rest-of-world.

4. **Link to detailed guides** — Direct users to step-by-step guides:
   - `/guides/h1b-to-green-card` — H-1B employer-sponsored pathway
   - `/guides/tn-to-green-card` — TN visa (Canada/Mexico) pathway
   - `/guides/eb2-niw` — EB-2 National Interest Waiver self-petition
   - `/guides/perm-process` — PERM labor certification deep-dive

5. **Estimate total green card timeline** — Combine PERM + I-140 + priority date wait + I-485 processing times to give a realistic end-to-end estimate.

## Tech Stack

- Next.js (App Router) on Vercel
- Data sourced from DOL FLAG, USCIS (via GitHub mirror), and State Department Visa Bulletin
- Data refreshes automatically every 12 hours

## Contact

Built by [@pstakoun](https://github.com/pstakoun). Issues and contributions welcome.
