import { NextRequest, NextResponse } from "next/server";

interface LeadData {
  name: string;
  email: string;
  visaType: string;
  currentStatus: string;
  urgency: string;
  description: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadData = await request.json();

    // Validate required fields
    const { name, email, visaType, currentStatus, urgency } = body;

    if (!name || !email || !visaType || !currentStatus || !urgency) {
      return NextResponse.json(
        { error: "All required fields must be filled out." },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Log the lead for monitoring
    console.log("[LEAD]", JSON.stringify({
      timestamp: new Date().toISOString(),
      name,
      email,
      visaType,
      currentStatus,
      urgency,
      description: body.description || "",
    }));

    // Send email notification if configured
    const leadsEmail = process.env.LEADS_EMAIL;
    if (leadsEmail) {
      // For now, log the intended notification.
      // In production, integrate with an email service (Resend, SendGrid, etc.)
      console.log(`[LEAD_NOTIFY] Would send notification to ${leadsEmail}`, {
        subject: `New Lead: ${visaType} — ${name}`,
        body: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Visa Type: ${visaType}`,
          `Current Status: ${currentStatus}`,
          `Urgency: ${urgency}`,
          `Description: ${body.description || "N/A"}`,
        ].join("\n"),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    console.error("[LEAD_ERROR] Failed to process lead submission");
    return NextResponse.json(
      { error: "Failed to process your submission. Please try again." },
      { status: 500 }
    );
  }
}
