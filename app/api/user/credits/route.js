import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";



export async function GET() {
  try {
    /* ---------------- AUTH ---------------- */
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { credits: 0, authenticated: false },
        { status: 200 }
      );
    }

    /* ---------------- FETCH USER ---------------- */
    const dbUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
      select: { credits: true },
    });

    return NextResponse.json({
      credits: dbUser?.credits ?? 0,
      authenticated: true,
    });
  } catch (error) {
    console.error("Credits API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch credits" },
      { status: 500 }
    );
  }
}
