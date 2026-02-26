"use server";
// Triggering re-compilation

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Create a new manual payment request
export async function createPaymentRequest(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // data = { amount, credits, screenshotUrl, transactionId, packageId }
  
  try {
     const user = await db.user.findUnique({
        where: { clerkUserId: userId },
     });
     
     if (!user) throw new Error("User not found");

     await db.paymentRequest.create({
       data: {
          userId: user.id,
          amount: data.amount,
          credits: data.credits,
          screenshotUrl: data.screenshotUrl,
          transactionId: data.transactionId,
          paymentMethod: data.paymentMethod,
          packageId: data.packageId,
          status: "PENDING"
       }
     });
     
     return { success: true };
  } catch (error) {
    console.error("Error creating payment request:", error);
    return { success: false, error: error.message };
  }
}

// Get requests (Pending & History)
export async function getPaymentRequests() {
    const { userId } = await auth();
    
    // Check if user is admin
    const admin = await db.user.findUnique({
       where: { clerkUserId: userId },
    });

    if(admin?.role !== "ADMIN") throw new Error("Unauthorized");

    try {
        const pending = await db.paymentRequest.findMany({
            where: { status: "PENDING" },
            include: { user: true },
            orderBy: { createdAt: "desc" }
        });

        const history = await db.paymentRequest.findMany({
            where: { status: { in: ["APPROVED", "REJECTED"] } },
            include: { user: true },
            orderBy: { processedAt: "desc" },
            take: 50 // Limit to last 50
        });

        return { success: true, requests: pending, history };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Verification mechanism
export async function verifyPaymentRequest(requestId, status) {
    // status: APPROVED or REJECTED
    const { userId } = await auth();
     
    // Check if user is admin
    const admin = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if(admin?.role !== "ADMIN") throw new Error("Unauthorized");
     
     try {
        const request = await db.paymentRequest.findUnique({
            where: { id: requestId },
        });
        
        if (!request) throw new Error("Request not found");
        if (request.status !== "PENDING") throw new Error("Request already processed");
        
        await db.$transaction(async (tx) => {
            await tx.paymentRequest.update({
                where: { id: requestId },
                data: { 
                    status,
                    processedAt: new Date(),
                    processedBy: admin.name || admin.email || userId
                },
            });
            
            if (status === "APPROVED") {
                // Add credits
                await tx.user.update({
                    where: { id: request.userId },
                    data: { credits: { increment: request.credits } },
                });
                
                // Create credit transaction record
                await tx.creditTransaction.create({
                    data: {
                        userId: request.userId,
                        amount: request.credits,
                        type: "CREDIT_PURCHASE",
                        packageId: request.packageId,
                        transactionId: request.id // Use internal Request ID to ensure uniqueness
                    }
                });
            }
        });
        
        return { success: true };
     } catch (error) {
         console.error("Error verifying payment:", error);
         return { success: false, error: error.message };
     }
}

// Get current user's payment history
export async function getUserPaymentHistory() {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) return { success: false, error: "User not found" };

    const requests = await db.paymentRequest.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 10
    });

    return { success: true, data: requests };
  } catch (error) {
      console.error("Error fetching user history:", error);
      return { success: false, error: error.message };
  }
}

// Get unnotified approved payments for the current user
export async function getUnnotifiedPayments() {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) return { success: false, error: "User not found" };

    if (user.role !== "PATIENT") return { success: true, data: [] };

    const unnotified = await db.paymentRequest.findMany({
      where: {
        userId: user.id,
        status: "APPROVED",
        isNotified: false,
      },
    });

    return { success: true, data: unnotified };
  } catch (error) {
    console.error("Error fetching unnotified payments:", error);
    return { success: false, error: error.message };
  }
}

// Mark a payment as notified
export async function markPaymentAsNotified(paymentId) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    await db.paymentRequest.update({
      where: { id: paymentId },
      data: { isNotified: true },
    });
    return { success: true };
  } catch (error) {
    console.error("Error marking payment as notified:", error);
    return { success: false, error: error.message };
  }
}
