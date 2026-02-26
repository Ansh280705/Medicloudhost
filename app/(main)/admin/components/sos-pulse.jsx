"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Siren, MapPin, X, CheckCircle, Bell, BellOff } from "lucide-react";
import { getActiveSOSAlerts, resolveSOSAlert } from "@/actions/admin";
import { Button } from "@/components/ui/button";

async function subscribeToPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return null;

  try {
    // Register service worker
    const registration = await navigator.serviceWorker.register("/sw.js");

    // Wait for it to be ready
    await navigator.serviceWorker.ready;

    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const applicationServerKey = urlBase64ToUint8Array(vapidKey);

    // Check existing subscription or create new
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return null;

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
    }

    // Send to server
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });

    return subscription;
  } catch (err) {
    console.error("Push subscribe error:", err);
    return null;
  }
}

async function unsubscribeFromPush() {
  if (!("serviceWorker" in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await fetch("/api/push/subscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
      await subscription.unsubscribe();
    }
  } catch (err) {
    console.error("Unsubscribe error:", err);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function SOSAlertPulse() {
  const [alerts, setAlerts] = useState([]);
  const [lastCount, setLastCount] = useState(0);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const hasInteracted = useRef(false);

  // Track first user interaction so audio is allowed
  useEffect(() => {
    const markInteracted = () => { hasInteracted.current = true; };
    document.addEventListener("click", markInteracted, { once: true });
    document.addEventListener("keydown", markInteracted, { once: true });
    return () => {
      document.removeEventListener("click", markInteracted);
      document.removeEventListener("keydown", markInteracted);
    };
  }, []);

  // Check initial push state
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setPushEnabled(!!sub);
        });
      }).catch(() => {});
    }
  }, []);

  const fetchAlerts = useCallback(async () => {
    const res = await getActiveSOSAlerts();
    if (res.alerts) {
      setAlerts(res.alerts);
      if (res.alerts.length > lastCount) {
        playAlertSound();
      }
      setLastCount(res.alerts.length);
    }
  }, [lastCount]);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  const playAlertSound = () => {
    if (!hasInteracted.current) return; // browser blocks autoplay without interaction
    try {
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audio.volume = 0.4;
      audio.play().catch(() => {}); // silently ignore if still blocked
    } catch (e) {
      console.warn("Audio play blocked");
    }
  };

  const handleResolve = async (id) => {
    const confirm = window.confirm("Mark this SOS as resolved?");
    if (confirm) {
      await resolveSOSAlert(id);
      setAlerts(alerts.filter((a) => a.id !== id));
    }
  };

  const handleTogglePush = async () => {
    setPushLoading(true);
    try {
      if (pushEnabled) {
        await unsubscribeFromPush();
        setPushEnabled(false);
      } else {
        const sub = await subscribeToPush();
        setPushEnabled(!!sub);
      }
    } finally {
      setPushLoading(false);
    }
  };

  return (
    <>
      {/* Push Toggle Button — always visible for admin */}
      <div className="flex justify-end mb-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleTogglePush}
          disabled={pushLoading}
          className={`text-xs gap-1.5 h-8 border transition-all ${
            pushEnabled
              ? "border-emerald-500 text-emerald-600 hover:bg-emerald-50"
              : "border-gray-300 text-gray-500 hover:bg-gray-50"
          }`}
        >
          {pushEnabled ? (
            <><Bell className="w-3.5 h-3.5" /> SOS Alerts ON</>
          ) : (
            <><BellOff className="w-3.5 h-3.5" /> Enable SOS Alerts</>
          )}
        </Button>
      </div>

      {/* Active SOS Cards */}
      {alerts.length > 0 && (
        <div className="fixed top-20 right-6 z-[100] w-full max-w-sm space-y-3 animate-in fade-in slide-in-from-right-10 duration-500">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white border-2 border-red-500 rounded-2xl p-5 shadow-[0_10px_40px_rgba(220,38,38,0.2)] relative overflow-hidden ring-4 ring-red-50"
            >
              <div className="absolute inset-0 bg-red-50 animate-pulse opacity-50" />
              <div className="relative z-10">
                <div className="flex items-start gap-4">
                  <div className="bg-red-600 p-2 rounded-full animate-bounce">
                    <Siren className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-red-700 font-black uppercase tracking-wider text-xs flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
                      Active SOS Trigger
                    </h4>
                    <p className="text-gray-900 font-bold mt-1 text-sm">
                      {alert.user.name || alert.user.email}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(alert.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  {alert.latitude && alert.longitude ? (
                    <a
                      href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all"
                    >
                      <MapPin className="w-3 h-3" /> View Live Location
                    </a>
                  ) : (
                    <div className="w-full flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-400 rounded-xl text-xs font-bold cursor-not-allowed border border-gray-200">
                      <MapPin className="w-3 h-3" /> No Location Available
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-red-200 text-red-700 hover:bg-red-50 text-[10px] font-bold h-8"
                    onClick={() => handleResolve(alert.id)}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" /> Mark as Safe / Resolved
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
