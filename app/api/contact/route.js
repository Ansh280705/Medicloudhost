import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    /* ---------------- AUTH ---------------- */
    const user = await currentUser();

    /* ---------------- BODY ---------------- */
    const {
      message,
      email: providedEmail,
      firstName: providedFirstName,
      lastName: providedLastName,
    } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    /* ---------------- RESOLVE SENDER ---------------- */
    // Prefer Clerk user when available; otherwise use provided name/email from form
    const email = user?.primaryEmailAddress?.emailAddress || providedEmail;
    const name = user
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : `${providedFirstName || ""} ${providedLastName || ""}`.trim();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    /* ---------------- MAIL ---------------- */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"DoctorDesk Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // admin
      replyTo: email,
      subject: "📩 New Contact Message",
      html: `
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${name || "(not provided)"}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <blockquote>${message}</blockquote>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
