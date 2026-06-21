import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Razorpay webhook — the AUTHORITATIVE source of payment status (handles the
 * browser-closed case). Verifies the webhook signature before trusting the body.
 * Configure the same secret in the Razorpay dashboard and RAZORPAY_WEBHOOK_SECRET.
 */
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 501 });
  }

  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const raw = await req.text();

  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  const valid =
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(raw) as { event: string; payload?: unknown };

  // TODO(server): with Supabase configured, upsert payment status idempotently
  // by razorpay_payment_id and confirm/refund the linked booking here.
  switch (event.event) {
    case "payment.captured":
    case "payment.failed":
    case "refund.processed":
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
