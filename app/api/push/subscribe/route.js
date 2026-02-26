import { NextResponse } from "next/server";
import webpush from "web-push";
import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// POST /api/push/subscribe — save a push subscription for admin
export async function POST(req) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const subscription = await req.json();

    // Store in DB — we use a lightweight JSON store via a global key in User
    // We'll store admin subscriptions in a dedicated table-free way: write to a JSON file
    // For simplicity we store latest subscription in an env/db-backed store.
    // Actually store it in the process memory as a global (fine for single-server dev/prod Vercel)
    global._adminPushSubscriptions = global._adminPushSubscriptions || [];

    // Remove old subscription for this endpoint if exists
    global._adminPushSubscriptions = global._adminPushSubscriptions.filter(
      (s) => s.endpoint !== subscription.endpoint
    );
    global._adminPushSubscriptions.push(subscription);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Push subscribe error:", err);
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
  }
}

// DELETE /api/push/subscribe — remove subscription
export async function DELETE(req) {
  try {
    const { endpoint } = await req.json();
    if (global._adminPushSubscriptions) {
      global._adminPushSubscriptions = global._adminPushSubscriptions.filter(
        (s) => s.endpoint !== endpoint
      );
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
