"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Wallet, Clock, Lock, Smartphone, Clipboard, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { useCredits } from "@/context/CreditsContext";
import { useAuth, useUser, SignInButton } from "@clerk/nextjs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getUserPaymentHistory } from "@/actions/payment";
import { initiatePhonePePayment } from "@/actions/phonepe";
import { format } from "date-fns";

const plans = [
  { id: "BASIC", price: 300, credits: 1, currency: "INR" },
  { id: "STANDARD", price: 600, credits: 2, popular: true, currency: "INR" },
  { id: "PREMIUM", price: 900, credits: 3, currency: "INR" },
];

function PaymentHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await getUserPaymentHistory();
      if (res.success) {
        setHistory(res.data);
      }
      setLoading(false);
    };
    fetchHistory();
  }, [searchParams]); // Refresh when URL params change (after payment)

  if (loading) return null;
  if (history.length === 0) return null;

  return (
    <div className="mt-12 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-center">Recent Payment Activity</h3>
      <div className="space-y-3">
        {history.map((item) => (
          <div key={item.id} className="bg-white border rounded-lg p-3 flex items-center justify-between shadow-sm">
            <div className="flex flex-col">
              <span className="font-medium text-sm">₹{item.amount} for {item.credits} Credits</span>
              {item.transactionId && <span className="text-xs font-mono text-muted-foreground">Transaction-Id : {item.transactionId}</span>}
              <span className="text-xs text-muted-foreground mt-0.5">Req: {format(new Date(item.createdAt), "MMM d, h:mm a")}</span>
              {item.processedAt && (
                <span className="text-xs text-green-600 mt-0.5 font-medium">
                  Approved: {format(new Date(item.processedAt), "MMM d, h:mm a")}
                </span>
              )}
            </div>
            <div>
              {item.status === "APPROVED" && <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100 flex items-center gap-1"><Check className="w-3 h-3" /> Approved</span>}
              {item.status === "REJECTED" && <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100">Rejected</span>}
              {item.status === "PENDING" && <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100 flex items-center gap-1"><Sparkles className="w-3 h-3 animate-pulse" /> Verifying</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Pricing({ showHistory = true }) {
  const { credits, loading: creditsLoading, reloadCredits } = useCredits();
  const { isSignedIn } = useAuth();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const showWalletParam = searchParams?.get("showWallet") === "1";
  const showPanel = showWalletParam || pathname === "/pricing";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { user } = useUser();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Check for payment status in URL
  useEffect(() => {
    const paymentStatus = searchParams?.get("payment");
    const txnId = searchParams?.get("orderId") || searchParams?.get("txnId");
    const reason = searchParams?.get("reason");

    if (paymentStatus === "success") {
      reloadCredits(); // Refresh credits in UI
      toast.success("Payment Successful!", {
        description: `Your credits have been added. Transaction ID: ${txnId}`,
      });
      // Clean URL
      window.history.replaceState({}, "", pathname);
    } else if (paymentStatus === "failed") {
      toast.error("Payment Failed", {
        description: reason || "Please try again or contact support.",
      });
      window.history.replaceState({}, "", pathname);
    } else if (paymentStatus === "error") {
      toast.error("Payment Error", {
        description: reason || "An unexpected error occurred.",
      });
      window.history.replaceState({}, "", pathname);
    }
  }, [searchParams, pathname]);

  const handleBuy = async (plan) => {
    if (!isSignedIn) {
      toast.error("Please sign in first", {
        description: "Login is required to purchase credits",
      });
      return;
    }

    setIsPaymentLoading(true);

    try {
      const result = await initiatePhonePePayment({
        amount: plan.price,
        credits: plan.credits,
        packageId: plan.id,
      });

      if (result.success && result.redirectUrl) {
        // Redirect to PhonePe payment page
        window.location.href = result.redirectUrl;
      } else {
        toast.error("Payment Initiation Failed", {
          description: result.error || "Unable to start payment. Please try again.",
        });
        setIsPaymentLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment Error", {
        description: "An unexpected error occurred. Please try again.",
      });
      setIsPaymentLoading(false);
    }
  };

  return (
    <div className="mt-14 ">
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--client);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #5a8b87;
        }
      `}} />
      {/* Payment Processing Dialog */}
      <Dialog open={isPaymentLoading} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center">Processing Payment</DialogTitle>
            <DialogDescription className="text-center">
              Please wait while we redirect you to PhonePe...
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-muted-foreground">Initializing secure payment</p>
          </div>
        </DialogContent>
      </Dialog>



      {showPanel && (isSignedIn || showWalletParam) && (
        <div className="mb-6 flex items-center justify-center">
          <div
            className="
      flex items-center gap-3 px-4 py-2
      rounded-full
      bg-gradient-to-r from-yellow-100 to-yellow-200
      border border-yellow-300
      shadow-sm
    "
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-400/30">
              <Wallet className="w-5 h-5 text-yellow-700" />
            </div>

            <div className="text-sm leading-tight">
              <p className="text-yellow-700 font-medium">Wallet Balance</p>
              {isSignedIn ? (
                <p className="font-semibold text-yellow-900">
                  {creditsLoading ? "Loading..." : `${credits} credits`}
                </p>
              ) : (
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-yellow-900">
                    Sign in to view balance
                  </p>
                  <SignInButton
                    mode="modal"
                    forceRedirectUrl="/pricing?showWallet=1"
                    fallbackRedirectUrl="/pricing?showWallet=1"
                  >
                    <Button size="sm" className="bg-client text-white">
                      Sign in
                    </Button>
                  </SignInButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isMobile ? (
        // 🔹 Mobile: Swiper
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={16}
          slidesPerView={1.1}
          className="pb-10"
        >
          {plans.map((plan) => (
            <SwiperSlide key={plan.id}>
              <PricingCard
                plan={plan}
                isSignedIn={isSignedIn}
                handleBuy={handleBuy}
                loading={isPaymentLoading}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        // 🔹 Desktop: Grid
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PricingCard
              plan={plan}
              key={plan.id}
              isSignedIn={isSignedIn}
              handleBuy={handleBuy}
              loading={isPaymentLoading}
            />
          ))}
        </div>
      )}

      {/* Payment History Section */}
      {isSignedIn && showHistory && <PaymentHistory />}

    </div>
  );
}

function PricingCard({ plan, isSignedIn, handleBuy, loading }) {
  return (
    <Card
      className={`relative border-2 transition-all duration-300
        hover:-translate-y-2 hover:shadow-xl
        ${plan.popular
          ? "border-[#6ba49f] shadow-[#6ba49f]/30"
          : "border-[#6ba49f]/30 hover:border-[#6ba49f]"
        }`}
    >
      {plan.popular && (
        <span className="absolute top-4 right-4 flex items-center gap-1 bg-[#6ba49f] text-white text-xs px-3 py-1 rounded-full">
          <Sparkles className="h-3 w-3" /> Most Popular
        </span>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-xl">{plan.id}</CardTitle>
        <p className="text-4xl font-extrabold mt-2">₹{plan.price}</p>
      </CardHeader>

      <CardContent className="space-y-4 text-center">
        <div className="flex justify-center items-center gap-2 text-muted-foreground">
          <Check className="h-4 w-4 text-[#6ba49f]" />
          {plan.credits} Credits
        </div>

        {isSignedIn ? (
          <Button
            onClick={() => handleBuy(plan)}
            disabled={loading}
            className={`w-full btn-shine text-white ${plan.popular
              ? "bg-[#6ba49f] hover:bg-[#6ba49f]/90"
              : "bg-[#6ba49f]/90 hover:bg-[#6ba49f]"
              }`}
          >
            {loading ? "Processing..." : `Buy ${plan.id}`}
          </Button>
        ) : (
          <SignInButton
            mode="modal"
            forceRedirectUrl="/#pricing"
            fallbackRedirectUrl="/#pricing"
          >
            <Button
              className="w-full border-2 border-[#6ba49f] text-[#6ba49f]
                         hover:bg-[#6ba49f] hover:text-white transition"
            >
              Sign in to Buy
            </Button>
          </SignInButton>
        )}
      </CardContent>
    </Card>
  );
}
