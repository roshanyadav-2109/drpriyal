import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Verifies a Razorpay payment signature server-side. Only a valid HMAC of
 * order_id|payment_id (signed with the key secret) is accepted as proof of
 * payment — the client can never forge a "paid" status.
 */
export async function POST(req: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 501 });
  }

  let body: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    ref?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const valid =
    expected.length === razorpay_signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature));

  if (!valid) {
    return NextResponse.json({ verified: false }, { status: 400 });
  }

  // TODO(server): when Supabase keys are set, persist the confirmed booking +
  // payment row here using the service-role client, then trigger WhatsApp/email.
  return NextResponse.json({ verified: true });
}
