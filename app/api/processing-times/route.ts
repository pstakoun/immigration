// API route for dynamic immigration data
// Fetches from: DOL FLAG, USCIS (via GitHub), Visa Bulletin
import { NextResponse } from "next/server";
import { getDynamicData, DynamicImmigrationData } from "@/lib/dynamic-data";

export const dynamic = "force-dynamic"; // Don't cache this route

// GET: Return all dynamic immigration data
export async function GET() {
  try {
    const data = await getDynamicData();

    return NextResponse.json({
      success: true,
      data,
      meta: {
        cacheInfo: "Data refreshed every 12 hours automatically",
        sources: [
          "DOL FLAG (flag.dol.gov) - PWD/PERM processing times",
          "USCIS via GitHub (jzebedee/uscis) - Form processing times",
          "State Dept Visa Bulletin - Priority dates",
        ],
      },
    });
  } catch (error) {
    console.error("Error fetching dynamic data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch immigration data" },
      { status: 500 }
    );
  }
}

// POST: Force refresh the cache
export async function POST() {
  try {
    const data = await getDynamicData(true); // Force refresh

    return NextResponse.json({
      success: true,
      data,
      meta: {
        refreshed: true,
        refreshedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error refreshing data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to refresh data" },
      { status: 500 }
    );
  }
}
