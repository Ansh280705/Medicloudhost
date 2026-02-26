"use client";

import { useEffect, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useCredits } from "@/context/CreditsContext";
import { verifyPhonePePayment } from "@/actions/phonepe";

function PaymentSuccessContent() {
    const { reloadCredits } = useCredits();
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get("orderId") || searchParams.get("merchantOrderId") || searchParams.get("merchantTransactionId");
    const paymentParam = searchParams.get("payment");
    const reason = searchParams.get("reason");
    const [status, setStatus] = useState(
        paymentParam === "success" ? "success" :
            (paymentParam === "failed" || paymentParam === "error") ? "failed" :
                "processing"
    );

    useEffect(() => {
        // If already successful from URL, just reload credits once
        if (status === "success") {
            reloadCredits();
            return;
        }

        if (!orderId || status === "failed") return;

        let pollCount = 0;
        const maxPolls = 15; // Increased polls

        const pollStatus = async () => {
            console.log(`🔍 Polling status for ${orderId} (${pollCount + 1}/${maxPolls})...`);
            try {
                const result = await verifyPhonePePayment(orderId);

                if (result.state === "COMPLETED") {
                    console.log("✅ Payment COMPLETED!");
                    setStatus("success");
                    reloadCredits();
                    return true;
                } else if (result.state === "FAILED" || result.state === "ABORTED" || result.state === "CANCELLED") {
                    console.log("❌ Payment FAILED/ABORTED!");
                    setStatus("failed");
                    return true;
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
            return false;
        };

        const interval = setInterval(async () => {
            pollCount++;
            const stop = await pollStatus();
            if (stop || pollCount >= maxPolls) {
                clearInterval(interval);
                if (pollCount >= maxPolls && status === "processing") {
                    console.log("⌛ Polling timed out. Setting status to unknown/failed.");
                    // If it's still processing after max polls, we'll stop the loader
                    // but maybe not set it to "failed" yet, just keep it as is or show a "timed out" state.
                    // For now, let's keep it as processing but the UI will show it stopped.
                }
            }
        }, 3000);

        pollStatus();
        return () => clearInterval(interval);
    }, [orderId, reloadCredits, status]);

    return (
        <div className="flex items-center justify-center min-h-[70vh] p-4">
            <Card className="w-full max-w-md text-center shadow-lg border-2">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className={`rounded-full p-3 ${status === 'success' ? 'bg-green-100' : status === 'failed' ? 'bg-red-100' : 'bg-amber-100'}`}>
                            {status === 'success' ? (
                                <CheckCircle2 className="w-12 h-12 text-green-600" />
                            ) : status === 'failed' ? (
                                <AlertTriangle className="w-12 h-12 text-red-600" />
                            ) : (
                                <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
                            )}
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        {status === 'success' ? "Payment Successful!" : status === 'failed' ? "Payment Failed" : "Verifying Payment..."}
                    </CardTitle>
                    {orderId && (
                        <p className="text-xs font-mono text-muted-foreground mt-1">
                            ID: {orderId}
                        </p>
                    )}
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-muted-foreground">
                        {status === 'success'
                            ? "Great news! Your credits have been added to your account."
                            : status === 'failed'
                                ? (reason || "Unfortunately, we couldn't confirm your payment. If money was deducted, it will be refunded.")
                                : "Thank you for your purchase. We are currently verifying your payment with PhonePe."
                        }
                    </p>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-left space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Order ID:</span>
                            <span className="font-mono font-medium">{orderId || "N/A"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Status:</span>
                            <span className={`font-medium ${status === 'success' ? 'text-green-600' : status === 'failed' ? 'text-red-600' : 'text-amber-600'}`}>
                                {status === 'success' ? 'COMPLETED' : status === 'failed' ? 'FAILED' : 'PROCESSING...'}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={() => router.push("/pricing")}
                            className="w-full bg-[#6ba49f] hover:bg-[#5a8b87]"
                        >
                            Back to Pricing
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push("/")}
                            className="w-full"
                        >
                            Return Home
                        </Button>
                    </div>

                    <p className="text-[10px] text-muted-foreground">
                        Your credits will be updated automatically within a few minutes.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <Loader2 className="w-10 h-10 animate-spin text-[#6ba49f]" />
                <p className="mt-4 text-muted-foreground">Loading your order details...</p>
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}
