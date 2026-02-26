import { NextResponse } from "next/server";
import { verifyPhonePePayment } from "@/actions/phonepe";

/**
 * PhonePe Payment Callback Handler
 * Handles both POST (redirect) and GET (status check) requests
 */
export async function POST(request) {
  try {
    let body = {};
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = Object.fromEntries(formData.entries());
    }

    console.log("📥 PhonePe Callback Body:", JSON.stringify(body, null, 2));

    // PhonePe V2 often sends a base64 encoded 'response' field
    if (body.response) {
      try {
        const decodedString = Buffer.from(body.response, 'base64').toString('utf-8');
        const decodedPayload = JSON.parse(decodedString);
        console.log("🔓 Decoded PhonePe Payload:", JSON.stringify(decodedPayload, null, 2));
        
        // Merge decoded payload into body to use existing logic
        body = { ...body, ...decodedPayload, ...(decodedPayload.data || {}) };
      } catch (e) {
        console.error("❌ Failed to decode PhonePe response field:", e);
      }
    }

    // Extract order ID from various possible fields in the callback
    const merchantOrderId = 
      body.merchantOrderId || 
      body.orderId || 
      body.merchantTransactionId ||
      body.transactionId;

    if (!merchantOrderId) {
      console.error("❌ POST callback: Missing order ID in body", body);
      return NextResponse.json(
        { success: false, error: "Missing order ID" },
        { status: 200 } // Return 200 even on error to stop PhonePe retries if it's malformed
      );
    }

    // Verify payment status
    const result = await verifyPhonePePayment(merchantOrderId);

    // POST callback (Server-to-Server) should just return 200 OK
    // PhonePe needs to see 'success: true' to mark transaction as completed in dashboard
    return NextResponse.json({ 
      success: true, 
      code: "SUCCESS",
      message: "Callback processed and acknowledged"
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in payment callback (POST):", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Handle GET requests for payment status check
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // mId is our ORD_... ID, orderId/merchantOrderId usually PhonePe's ID in redirect
    const merchantOrderId = 
      searchParams.get("mId") || 
      searchParams.get("orderId") || 
      searchParams.get("merchantOrderId") || 
      searchParams.get("merchantTransactionId") || 
      searchParams.get("transactionId");

    // phonePeOrderId is essential for the Status API
    const phonePeOrderId = searchParams.get("orderId") || merchantOrderId;

    if (!merchantOrderId) {
      console.error("❌ GET callback: Missing any order ID");
      return NextResponse.json(
        { success: false, error: "Missing order ID" },
        { status: 400 }
      );
    }

    console.log("📥 PhonePe Callback (GET). MerchantID:", merchantOrderId, "PhonePeID:", phonePeOrderId);

    // Verify payment status - Try identifying by PhonePe ID first (as we now store it as transactionId)
    const result = await verifyPhonePePayment(phonePeOrderId);

    // Construct the base URL for redirect
    // Use the request origin directly to respect ngrok/public domains
    const origin = new URL(request.url).origin;
    let baseUrl = origin;
    
    // Safety check for localhost SSL
    if (baseUrl.includes("localhost") && baseUrl.startsWith("https")) {
      baseUrl = baseUrl.replace("https://", "http://");
    }

    const redirectUrl = new URL("/payment-success", baseUrl);
    redirectUrl.searchParams.set("orderId", phonePeOrderId);
    
    // V2 uses COMPLETED state
    if (result.success && result.state === "COMPLETED") {
      redirectUrl.searchParams.set("payment", "success");
    } else {
      redirectUrl.searchParams.set("payment", "failed");
      redirectUrl.searchParams.set("reason", (result.data?.message || result.error) || "Payment not completed");
    }

    console.log("↪️ Redirecting to:", redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("❌ Error in payment callback (GET):", error);
    const { searchParams } = new URL(request.url);
    const mid = searchParams.get("orderId") || searchParams.get("merchantOrderId") || searchParams.get("merchantTransactionId");
    
    const redirectUrl = new URL("/payment-success", request.url);
    if (mid) redirectUrl.searchParams.set("orderId", mid);
    redirectUrl.searchParams.set("payment", "error");
    redirectUrl.searchParams.set("reason", error.message);
    return NextResponse.redirect(redirectUrl);
  }
}
