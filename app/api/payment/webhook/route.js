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

    console.log("📥 PhonePe Callback (POST):", body);

    // Extract order ID from the callback
    const merchantOrderId = 
      body.merchantOrderId || 
      body.orderId || 
      body.transactionId || 
      body.merchantTransactionId;

    if (!merchantOrderId) {
      console.error("❌ POST callback: Missing order ID in body", body);
      return NextResponse.json(
        { success: false, error: "Missing order ID" },
        { status: 400 }
      );
    }

    // Verify payment status
    const result = await verifyPhonePePayment(merchantOrderId);

    // POST callback (Server-to-Server) should just return 200 OK
    return NextResponse.json({ 
      success: result.success, 
      state: result.state 
    });
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
    
    // Extract order ID from search params - check all possible PhonePe names
    const merchantOrderId = 
      searchParams.get("orderId") || 
      searchParams.get("merchantOrderId") || 
      searchParams.get("transactionId") || 
      searchParams.get("txnId");

    if (!merchantOrderId) {
      console.error("❌ GET callback: Missing order ID");
      return NextResponse.json(
        { success: false, error: "Missing order ID" },
        { status: 400 }
      );
    }

    console.log("📥 PhonePe Callback (GET) for order:", merchantOrderId);

    // Verify payment status
    const result = await verifyPhonePePayment(merchantOrderId);

    // Construct the base URL for redirect
    // Use NEXT_PUBLIC_BASE_URL if available, otherwise fallback to request origin
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
    
    // Safety check: If we are on localhost and the baseUrl is https, it might cause SSL errors
    if (baseUrl.includes("localhost") && baseUrl.startsWith("https")) {
      baseUrl = baseUrl.replace("https://", "http://");
    }

    const redirectUrl = new URL("/payment-success", baseUrl);
    
    // V2 uses COMPLETED state
    if (result.success && result.state === "COMPLETED") {
      redirectUrl.searchParams.set("payment", "success");
      redirectUrl.searchParams.set("orderId", merchantOrderId);
    } else {
      redirectUrl.searchParams.set("payment", "failed");
      redirectUrl.searchParams.set("reason", (result.data?.message || result.error) || "Payment not completed");
    }

    console.log("↪️ Redirecting to:", redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("❌ Error in payment callback (GET):", error);
    const redirectUrl = new URL("/payment-success", request.url);
    redirectUrl.searchParams.set("payment", "error");
    redirectUrl.searchParams.set("reason", error.message);
    return NextResponse.redirect(redirectUrl);
  }
}
