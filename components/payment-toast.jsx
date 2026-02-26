"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { getUnnotifiedPayments, markPaymentAsNotified } from "@/actions/payment";
import { useUser } from "@clerk/nextjs";

export default function PaymentToast() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const checkPayments = async () => {
      try {
        const res = await getUnnotifiedPayments();
        if (res.success && res.data && res.data.length > 0) {
          res.data.forEach((payment) => {
            toast.success("Payment Verified!", {
              description: `₹${payment.amount} has been verified and ${payment.credits} credits were added to your wallet.`,
              duration: 10000, // Show for 10 seconds
            });
            // Mark as notified so we don't show it again
            markPaymentAsNotified(payment.id);
          });
        }
      } catch (error) {
        console.error("Error checking for payments:", error);
      }
    };

    // Check immediately on mount/navigation
    checkPayments();
  }, [user, isLoaded]);

  return null;
}
