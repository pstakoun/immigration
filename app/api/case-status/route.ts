// API route for USCIS case status lookup
// This uses the public USCIS case status endpoint
// Note: USCIS may rate-limit or change their API - this is best-effort

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Parse USCIS case status response
interface CaseStatusResult {
  receiptNumber: string;
  status: string;
  statusDescription: string;
  lastUpdated?: string;
  formType?: string;
  processedAt?: string;
}

// Known USCIS case statuses and their meanings
const STATUS_MAPPING: Record<string, { 
  status: "pending" | "approved" | "denied" | "rfe_issued" | "rfe_response_filed" | "other";
  description: string;
}> = {
  "Case Was Received": { status: "pending", description: "Your case has been received and is being processed." },
  "Case Was Approved": { status: "approved", description: "Your case has been approved." },
  "Case Was Denied": { status: "denied", description: "Your case has been denied." },
  "Request for Evidence Was Sent": { status: "rfe_issued", description: "USCIS needs more evidence. Check your mail for details." },
  "Response To USCIS' Request For Evidence Was Received": { status: "rfe_response_filed", description: "Your RFE response has been received." },
  "Card Is Being Produced": { status: "approved", description: "Your card is being produced!" },
  "Card Was Delivered To Me By The Post Office": { status: "approved", description: "Your card has been delivered." },
  "Card Was Mailed To Me": { status: "approved", description: "Your card was mailed to you." },
  "Fingerprint Fee Was Received": { status: "pending", description: "Your fingerprint fee was received." },
  "Case Is Ready To Be Scheduled For An Interview": { status: "pending", description: "Your case will be scheduled for an interview." },
  "Interview Was Scheduled": { status: "pending", description: "Your interview has been scheduled. Check your mail for the date." },
  "Interview Was Completed And My Case Must Be Reviewed": { status: "pending", description: "Your interview is complete. Case under review." },
  "Decision": { status: "other", description: "A decision has been made on your case." },
};

// Fetch case status from USCIS
async function fetchUSCISStatus(receiptNumber: string): Promise<CaseStatusResult | null> {
  try {
    // USCIS case status URL
    // Note: This is a public endpoint but may change
    const url = `https://egov.uscis.gov/casestatus/mycasestatus.do?appReceiptNum=${receiptNumber}`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Stateside/1.0)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`USCIS fetch failed: ${response.status}`);
      return null;
    }

    const html = await response.text();

    // Parse the response HTML to extract status
    // USCIS returns status in an h1 tag with class "appointment-sec-head"
    // and description in a paragraph below it
    
    // Look for the status text
    // Using [\s\S] instead of . with 's' flag for cross-line matching (ES5 compatible)
    const statusMatch = html.match(/<h1[^>]*class="[^"]*appointment-sec-head[^"]*"[^>]*>([\s\S]*?)<\/h1>/i);
    const descMatch = html.match(/<p[^>]*class="[^"]*appointment-sec-content[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
    
    if (!statusMatch) {
      // Alternative parsing - look for the case status text
      const altMatch = html.match(/<div class="text-center">\s*<h1>([\s\S]*?)<\/h1>/i);
      if (altMatch) {
        const status = altMatch[1].trim();
        return {
          receiptNumber,
          status: STATUS_MAPPING[status]?.status || "other",
          statusDescription: STATUS_MAPPING[status]?.description || status,
        };
      }
      return null;
    }

    const statusText = statusMatch[1].replace(/<[^>]*>/g, "").trim();
    const description = descMatch ? descMatch[1].replace(/<[^>]*>/g, "").trim() : "";

    // Try to extract the form type from the description
    let formType: string | undefined;
    const formMatch = description.match(/Form\s+(I-\d+\w*)/i);
    if (formMatch) {
      formType = formMatch[1];
    }

    // Try to extract dates from the description
    let lastUpdated: string | undefined;
    const dateMatch = description.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d+,\s+\d{4}/i);
    if (dateMatch) {
      lastUpdated = dateMatch[0];
    }

    const mappedStatus = STATUS_MAPPING[statusText];

    return {
      receiptNumber,
      status: mappedStatus?.status || "other",
      statusDescription: description || mappedStatus?.description || statusText,
      lastUpdated,
      formType,
    };
  } catch (error) {
    console.error("USCIS status fetch error:", error);
    return null;
  }
}

// Validate receipt number format
function isValidReceiptNumber(receipt: string): boolean {
  // Format: 3 letters + 10 digits (e.g., SRC2412345678)
  return /^[A-Z]{3}\d{10}$/i.test(receipt);
}

// GET: Look up case status
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const receiptNumber = searchParams.get("receiptNumber")?.toUpperCase();

  if (!receiptNumber) {
    return NextResponse.json(
      { success: false, error: "Receipt number is required" },
      { status: 400 }
    );
  }

  if (!isValidReceiptNumber(receiptNumber)) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Invalid receipt number format. Expected format: ABC1234567890 (3 letters + 10 digits)" 
      },
      { status: 400 }
    );
  }

  const result = await fetchUSCISStatus(receiptNumber);

  if (!result) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Could not retrieve case status. Please try again later or check USCIS website directly.",
        uscisUrl: `https://egov.uscis.gov/casestatus/mycasestatus.do?appReceiptNum=${receiptNumber}`,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    success: true,
    data: result,
    meta: {
      checkedAt: new Date().toISOString(),
      source: "USCIS Case Status Online",
      directUrl: `https://egov.uscis.gov/casestatus/mycasestatus.do?appReceiptNum=${receiptNumber}`,
    },
  });
}

// POST: Bulk lookup (for multiple cases)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const receiptNumbers: string[] = body.receiptNumbers || [];

    if (!Array.isArray(receiptNumbers) || receiptNumbers.length === 0) {
      return NextResponse.json(
        { success: false, error: "receiptNumbers array is required" },
        { status: 400 }
      );
    }

    // Limit to 5 cases to avoid rate limiting
    if (receiptNumbers.length > 5) {
      return NextResponse.json(
        { success: false, error: "Maximum 5 receipt numbers per request" },
        { status: 400 }
      );
    }

    // Validate all receipt numbers
    const invalidNumbers = receiptNumbers.filter(r => !isValidReceiptNumber(r.toUpperCase()));
    if (invalidNumbers.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid receipt numbers: ${invalidNumbers.join(", ")}` 
        },
        { status: 400 }
      );
    }

    // Fetch all statuses (with small delay between each to avoid rate limiting)
    const results: (CaseStatusResult | null)[] = [];
    for (const receipt of receiptNumbers) {
      const result = await fetchUSCISStatus(receipt.toUpperCase());
      results.push(result);
      
      // Small delay between requests
      if (receiptNumbers.indexOf(receipt) < receiptNumbers.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      meta: {
        checkedAt: new Date().toISOString(),
        source: "USCIS Case Status Online",
      },
    });
  } catch (error) {
    console.error("Bulk case status error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
