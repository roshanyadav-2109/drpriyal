import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Creates a Razorpay order server-side. The key SECRET never reaches the client.
 * Returns 501 if Razorpay isn't configured yet, so the UI falls back gracefully.
 */
export async function POST(req: Request) {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 501 });
  }

  let body: { amount?: number; ref?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const amount = Math.round(Number(body.amount));
  if (!Number.isFinite(amount) || amount < 100) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const receipt = (body.ref || "rcpt").slice(0, 38);

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency: "INR",
      receipt,
      notes: { ref: body.ref ?? "" },
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Order creation failed" }, { status: 502 });
  }

  const order = (await res.json()) as { id: string; amount: number; currency: string };
  // crypto import kept for parity with verify route / future signature needs.
  void crypto;
  return NextResponse.json({ id: order.id, amount: order.amount, currency: order.currency });
}
