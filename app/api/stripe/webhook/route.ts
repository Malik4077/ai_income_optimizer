import { NextRequest, NextResponse } from "next/server";
import { handleWebhook } from "@/lib/stripe/subscription";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  try {
    await handleWebhook(payload, signature);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}

// Stripe requires raw body
export const config = { api: { bodyParser: false } };
