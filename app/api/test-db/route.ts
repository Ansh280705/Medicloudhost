import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const result = await db.user.findMany({
      take: 1,
    });

    return NextResponse.json({
      success: true,
      message: "DB connected successfully",
      sampleUser: result,
    });
  } catch (error) {
    console.error("DB Test Error:", error);
    return NextResponse.json(
      { success: false, error: "DB connection failed" },
      { status: 500 }
    );
  }
}
