"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/* ---------------- CONFIG ---------------- */

const PHONEPE_ENV = process.env.PHONEPE_ENV || "sandbox";
const CLIENT_ID = process.env.PHONEPE_CLIENT_ID;
const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET;
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION || "1";

const OAUTH_URL =
  PHONEPE_ENV === "production"
    ? "https://api.phonepe.com/apis/identity-manager/v1/oauth/token"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";

const PAY_URL =
  PHONEPE_ENV === "production"
    ? "https://api.phonepe.com/apis/pg/checkout/v2/pay"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay";

const STATUS_URL =
  PHONEPE_ENV === "production"
    ? "https://api.phonepe.com/apis/pg/checkout/v2/order"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order";

/* ---------------- TOKEN CACHING (UAT REQUIREMENT) ---------------- */

let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  const now = Date.now();

  if (cachedToken && now < tokenExpiry - 3 * 60 * 1000) {
    return cachedToken;
  }

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    client_version: CLIENT_VERSION,
    grant_type: "client_credentials",
  });

  const res = await fetch(OAUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "OAuth failed");
  }

  cachedToken = data.access_token;
  tokenExpiry = new Date(data.expires_at).getTime();

  return cachedToken;
}

/* ---------------- CREATE PAYMENT (V2 FINAL CORRECT) ---------------- */

export async function initiatePhonePePayment({ amount, credits, packageId }) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) return { success: false, error: "User not found" };

    const merchantOrderId = `ORD_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    console.log("🔄 Initiating payment:", merchantOrderId);

    const token = await getAccessToken();

    // ✅ OFFICIAL V2 CHECKOUT PAYLOAD (UAT APPROVED)
    const payload = {
      merchantOrderId,
      amount: amount * 100, // paisa
      expireAfter: 900, // 15 minutes

      metaInfo: {
        udf1: user.id,
        udf2: packageId,
      },

      paymentFlow: {
        type: "PG_CHECKOUT",
        merchantUrls: {
          // Use mId for our tracking to avoid conflict with PhonePe's 'orderId'
          redirectUrl: `${process.env.NEXT_PUBLIC_REDIRECT_URL}?mId=${merchantOrderId}`,
          callbackUrl: process.env.NEXT_PUBLIC_REDIRECT_URL
        }
      }
    };

    console.log("📤 Payload:", JSON.stringify(payload, null, 2));

    const res = await fetch(PAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ⚠️ V2 requires O-Bearer prefix for OAuth tokens
        Authorization: `O-Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    console.log("📥 PhonePe Response:", JSON.stringify(result, null, 2));

    // V2 success detection: either success field is true, OR orderId + redirectUrl are present
    const isSuccess = result.success || (result.orderId && result.redirectUrl);

    if (!res.ok || !isSuccess) {
      // Return a string error message, not the whole object
      const errorMsg = result.message || result.errorCode || "Payment initiation failed";
      return { success: false, error: errorMsg };
    }

    // Store in DB - We store PhonePe's orderId as the primary transactionId
    // because that's what the Status API requires.
    await db.paymentRequest.create({
      data: {
        userId: user.id,
        amount,
        credits,
        transactionId: result.orderId, // Store PhonePe's OMO... ID
        paymentMethod: "PhonePe",
        packageId,
        status: "PENDING",
        screenshotUrl: merchantOrderId, // Save our ORD_... ID here just in case
      },
    });

    return {
      success: true,
      phonePeOrderId: result.orderId,
      redirectUrl: result.redirectUrl,
      merchantOrderId,
    };
  } catch (error) {
    console.error("❌ Error initiating payment:", error);
    return { success: false, error: error.message };
  }
}

/* ---------------- VERIFY PAYMENT (STATE-BASED) ---------------- */

export async function verifyPhonePePayment(merchantOrderId) {
  try {
    const token = await getAccessToken();

    const res = await fetch(`${STATUS_URL}/${merchantOrderId}/status?details=false`, {
      method: "GET",
      headers: {
        // ⚠️ V2 requires O-Bearer prefix
        Authorization: `O-Bearer ${token}`,
        "X-MERCHANT-ID": MERCHANT_ID,
      },
    });

    const result = await res.json();
    console.log("🔍 Status Response:", JSON.stringify(result, null, 2));

    if (!res.ok) {
      const errorMsg = result.message || "Verification failed";
      return { success: false, state: "UNKNOWN", error: errorMsg };
    }

    const state = result.state || result.data?.state; // Support both top-level and nested state
    console.log(`ℹ️  Payment State for ${merchantOrderId}: ${state}`);

    if (state === "COMPLETED") {
      // Look for the record using either the ID we sent (merchantOrderId) 
      // or the PhonePe ID (result.orderId which we sometimes store in screenshotUrl)
      const payment = await db.paymentRequest.findFirst({
        where: {
          OR: [
            { transactionId: merchantOrderId },
            { screenshotUrl: merchantOrderId }
          ]
        },
      });

      console.log(`ℹ️  Payment Record found for ${merchantOrderId}:`, payment ? "YES" : "NO");

      if (payment?.status === "PENDING") {
        await db.$transaction(async (tx) => {
          await tx.paymentRequest.update({
            where: { id: payment.id },
            data: { 
              status: "APPROVED",
              processedAt: new Date()
            },
          });

          await tx.user.update({
            where: { id: payment.userId },
            data: { credits: { increment: payment.credits } },
          });

          await tx.creditTransaction.create({
            data: {
              userId: payment.userId,
              amount: payment.credits,
              type: "CREDIT_PURCHASE",
              packageId: payment.packageId,
              transactionId: merchantOrderId,
            },
          });
        });
        console.log(`✅ Credits updated successfully for ${merchantOrderId}`);
      }
    } else if (state === "FAILED" || state === "ABORTED" || state === "CANCELLED") {
      const payment = await db.paymentRequest.findFirst({
        where: {
          OR: [
            { transactionId: merchantOrderId },
            { screenshotUrl: merchantOrderId }
          ]
        },
      });

      if (payment?.status === "PENDING") {
        await db.paymentRequest.update({
          where: { id: payment.id },
          data: { 
            status: "REJECTED",
            processedAt: new Date()
          },
        });
        console.log(`❌ Payment marked as REJECTED for ${merchantOrderId}`);
      }
    }

    const isSuccess = result.success || state === "COMPLETED";

    return {
      success: isSuccess,
      state: state, // COMPLETED, FAILED, PENDING
      data: result
    };
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    return { success: false, state: "ERROR" };
  }
}
