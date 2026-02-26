"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";

export async function getEmergencyContacts() {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        emergencyEmails: true,
      },
    });

    return { emails: user?.emergencyEmails || [] };
  } catch (error) {
    console.error("Failed to get emergency contacts:", error);
    return { error: "Failed to fetch contacts" };
  }
}

export async function updateEmergencyContacts(emails) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    // Basic email validation
    const validEmails = emails.filter(email => email.includes("@"));

    await db.user.update({
      where: { clerkUserId: userId },
      data: {
        emergencyEmails: validEmails,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update emergency contacts:", error);
    return { error: "Failed to update contacts" };
  }
}

export async function triggerEmergencyAlert(latitude, longitude) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        name: true,
        email: true,
        emergencyEmails: true,
      },
    });

    if (!user) return { error: "User not found" };

    // 1. Log the alert in DB
    const alert = await db.emergencyAlert.create({
      data: {
        userId: user.id,
        latitude,
        longitude,
        status: "ACTIVE",
      },
    });

    // 2. Setup Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const googleMapsUrl = (latitude && longitude)
      ? `https://www.google.com/maps?q=${latitude},${longitude}`
      : "Location access was not shared.";

    const emailRecipients = [...user.emergencyEmails];
    if (!emailRecipients.includes(process.env.GMAIL_USER)) {
      emailRecipients.push(process.env.GMAIL_USER);
    }

    // 3. Dispatch Emails
    const emailPromises = emailRecipients.map(target =>
      transporter.sendMail({
        from: `"🚨 MediCloud SOS" <${process.env.GMAIL_USER}>`,
        to: target,
        subject: `⚠️ URGENT: SOS Alert for ${user.name || 'Registered User'}`,
        priority: 'high',
        html: `
          <div style="font-family: Arial, sans-serif; border: 4px solid #dc2626; padding: 25px; border-radius: 15px; max-width: 600px; margin: 0 auto; background-color: #fff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="font-size: 40px;">🆘</span>
              <h1 style="color: #dc2626; margin: 10px 0; border-bottom: 2px solid #fee2e2; padding-bottom: 10px;">EMERGENCY SOS</h1>
            </div>
            <p style="font-size: 16px; color: #111827;">This is a critical automated alert from <strong>MediCloud</strong>.</p>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
              <p style="margin: 5px 0;"><strong>Name:</strong> ${user.name || 'Not provided'}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #374151; font-weight: bold; margin-bottom: 15px;">SOS LIVE LOCATION:</p>
              <a href="${googleMapsUrl}" style="background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View on Google Maps</a>
            </div>
            <p style="background: #fee2e2; padding: 12px; border-radius: 8px; color: #991b1b; font-size: 13px; text-align: center;">
              <strong>Action Needed:</strong> Please try to contact the user immediately and verify their safety.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="font-size: 10px; color: #9ca3af; text-align: center; line-height: 1.5;">
              Safety first. This email was triggered via the MediCloud emergency portal.
            </p>
          </div>
        `
      })
    );

    await Promise.all(emailPromises);

    // 4. Send Web Push to all subscribed admin browsers
    try {
      const webpush = (await import("web-push")).default;
      webpush.setVapidDetails(
        process.env.VAPID_EMAIL,
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );

      const subscriptions = global._adminPushSubscriptions || [];
      const pushPayload = JSON.stringify({
        title: "🚨 SOS ALERT — Patient Emergency!",
        body: `${user.name || user.email} has triggered an SOS. Tap to open dashboard.`,
        url: "/admin",
        icon: "/medi-cloud-logo.png",
      });

      await Promise.allSettled(
        subscriptions.map((sub) => webpush.sendNotification(sub, pushPayload))
      );
    } catch (pushErr) {
      console.warn("Push notification failed (non-critical):", pushErr.message);
    }

    return { success: true, alertId: alert.id };
  } catch (error) {
    console.error("Failed to trigger emergency alert:", error);
    return { error: "Emergency trigger failed" };
  }
}
