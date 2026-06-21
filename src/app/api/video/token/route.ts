import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Issues a short-lived 100ms video room JOIN token for a participant.
 * Management keys stay server-side; only the ephemeral token reaches the client.
 * Returns 501 until 100ms is configured.
 *
 * NOTE: For production, prefer creating rooms via the 100ms API and minting
 * per-room tokens. This issues an app token (role-scoped) as a starting point.
 */
function base64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export async function POST(req: Request) {
  const accessKey = process.env.HMS_ACCESS_KEY;
  const secret = process.env.HMS_SECRET;
  if (!accessKey || !secret) {
    return NextResponse.json({ error: "Video not configured" }, { status: 501 });
  }

  let body: { roomId?: string; userId?: string; role?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const roomId = body.roomId?.trim();
  const role = body.role === "host" ? "host" : "guest";
  const userId = body.userId?.slice(0, 64) || `user-${Date.now().toString(36)}`;
  if (!roomId) {
    return NextResponse.json({ error: "Missing roomId" }, { status: 400 });
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    access_key: accessKey,
    room_id: roomId,
    user_id: userId,
    role,
    type: "app",
    version: 2,
    iat: now,
    nbf: now,
    exp: now + 60 * 60, // 1 hour
    jti: crypto.randomUUID(),
  };

  const encHeader = base64url(JSON.stringify(header));
  const encPayload = base64url(JSON.stringify(payload));
  const signature = base64url(
    crypto.createHmac("sha256", secret).update(`${encHeader}.${encPayload}`).digest(),
  );

  return NextResponse.json({ token: `${encHeader}.${encPayload}.${signature}` });
}
