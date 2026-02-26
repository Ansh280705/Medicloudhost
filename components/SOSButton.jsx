"use client";

import { useState, useEffect, useRef } from "react";
import { Siren, PhoneCall, Settings2, MapPin, MapPinOff, Loader2, Bell } from "lucide-react";
import { triggerEmergencyAlert } from "@/actions/safety";
import { toast } from "sonner";
import Link from "next/link";

// Register our SW and return the registration (or null)
async function ensureServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;
    return reg;
  } catch (e) {
    console.warn("SW register failed:", e);
    return null;
  }
}

// Show a notification — tries SW first, falls back to new Notification()
async function showNotification(title, options) {
  const permission = Notification.permission;
  if (permission !== "granted") return;

  try {
    const reg = await ensureServiceWorker();
    if (reg) {
      await reg.showNotification(title, options);
    } else {
      // Fallback: plain Notification API
      const n = new Notification(title, options);
      if (options.data?.url) {
        n.onclick = () => { window.open(options.data.url, "_blank"); n.close(); };
      }
    }
  } catch (e) {
    console.warn("Notification failed:", e);
    // Last resort fallback
    try {
      new Notification(title, { body: options.body, icon: options.icon });
    } catch {}
  }
}

export default function SOSButton({ userRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [triggered, setTriggered] = useState(false);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [notifPermission, setNotifPermission] = useState("default");
  const locationRef = useRef({ lat: null, lng: null });
  const watchIdRef = useRef(null);

  // ── On mount: pre-warm geolocation + check notification permission ──
  useEffect(() => {
    if (userRole !== "PATIENT") return;

    // Check current notification permission state
    if ("Notification" in window) {
      setNotifPermission(Notification.permission);
    }

    // Pre-register SW silently so it's ready when SOS fires
    ensureServiceWorker();

    // Start watching location continuously
    if (!("geolocation" in navigator)) {
      setLocationStatus("denied");
      return;
    }
    setLocationStatus("watching");

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        locationRef.current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocationStatus("got");
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
        setLocationStatus("denied");
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [userRole]);

  // ── Countdown tick ──
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
    handleFinalTrigger();
  }, [countdown]);

  // Only render for patients
  if (userRole !== "PATIENT") return null;

  // ── Request notification permission — MUST be on a user gesture ──
  const requestNotifPermission = async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setNotifPermission(result);
    if (result === "granted") {
      toast.success("✅ Notifications enabled — you'll get browser alerts when SOS fires.");
    } else {
      toast.error("Notifications blocked. Enable them in browser settings for SOS alerts.");
    }
  };

  const startSOS = async () => {
    // If permission not yet asked, request it now (user gesture moment!)
    if ("Notification" in window && Notification.permission === "default") {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);
    }
    setCountdown(3);
    setIsOpen(true);
    setTriggered(false);
  };

  const cancelSOS = () => {
    setCountdown(null);
    setIsOpen(false);
    setTriggered(false);
  };

  const handleFinalTrigger = async () => {
    setCountdown(null);
    setTriggered(true);

    const { lat, lng } = locationRef.current;
    const mapsUrl = lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : null;

    // 1. Server action → emails + admin push
    const res = await triggerEmergencyAlert(lat, lng);

    // 2. Browser notification for patient
    await showNotification("🚨 SOS Alert Sent — Medicloud", {
      body: lat
        ? "Your live location has been sent to family & support team."
        : "Alert sent. Enable location access for better emergency response.",
      icon: "/medi-cloud-logo.png",
      badge: "/medi-cloud-logo.png",
      tag: "sos-patient",
      requireInteraction: true,
      vibrate: [300, 100, 300, 100, 300],
      data: { url: mapsUrl || "/appointments" },
      actions: mapsUrl ? [{ action: "open", title: "📍 View My Location" }] : [],
    });

    // 3. In-app toast
    if (res?.success) {
      toast.error("🚨 EMERGENCY ALERT SENT", {
        description: lat
          ? "Family & support alerted with your live location."
          : "Family & support alerted. Enable location for better help.",
        duration: 10000,
      });
    } else {
      toast.error("Alert failed! Call 112 immediately.");
    }
  };

  const locationPill = {
    idle: null,
    watching: { text: "Getting location...", icon: <Loader2 className="w-3 h-3 animate-spin" />, cls: "bg-blue-50 text-blue-700 border-blue-200" },
    got:      { text: "📍 Live location ready", icon: <MapPin className="w-3 h-3" />, cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    denied:   { text: "No location — allow in browser", icon: <MapPinOff className="w-3 h-3" />, cls: "bg-orange-50 text-orange-700 border-orange-200" },
  }[locationStatus];

  return (
    <>
      {/* ── Notification permission banner (only if not yet asked) ── */}
      {notifPermission === "default" && (
        <div className="fixed bottom-44 left-4 z-50 max-w-[220px] bg-white border-2 border-red-300 rounded-2xl shadow-xl p-3 animate-in slide-in-from-left-4 duration-500">
          <p className="text-[10px] font-bold text-gray-700 leading-snug mb-2">
            🔔 Enable SOS notifications so you get alerted when help is dispatched.
          </p>
          <button
            onClick={requestNotifPermission}
            className="w-full py-1.5 bg-red-600 text-white text-[10px] font-black rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-1"
          >
            <Bell className="w-3 h-3" /> Enable Alerts
          </button>
        </div>
      )}

      {/* ── SOS Button ── */}
      <button
        onClick={startSOS}
        className="fixed bottom-24 left-6 z-50 flex items-center justify-center w-14 h-14 bg-red-600 text-white rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 group border-4 border-white"
        aria-label="Trigger SOS"
      >
        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-25" />
        <Siren className="w-7 h-7 animate-pulse" />

        {/* Location dot */}
        <span className={`absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
          locationStatus === "got" ? "bg-emerald-400" :
          locationStatus === "denied" ? "bg-orange-400" : "bg-blue-400 animate-pulse"
        }`} />

        {/* Notification dot */}
        {notifPermission !== "granted" && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-yellow-400 rounded-full border-2 border-white" title="Notifications not enabled" />
        )}

        <span className="absolute left-16 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-tighter pointer-events-none">
          SOS EMERGENCY
        </span>
      </button>

      {/* ── SOS Modal ── */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-red-950/80 backdrop-blur-md">
          <div className="w-[90%] max-w-sm bg-white rounded-3xl p-8 text-center shadow-2xl border-4 border-red-500 animate-in zoom-in-95 duration-300">
            {countdown !== null ? (
              <div className="space-y-5">
                <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-5xl font-black text-white mx-auto animate-bounce shadow-xl border-4 border-white">
                  {countdown}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 uppercase">Triggering Help</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Alert fires in {countdown} second{countdown !== 1 ? "s" : ""}...
                  </p>
                </div>

                {locationPill && (
                  <div className={`flex items-center justify-center gap-2 text-xs font-semibold px-3 py-2 rounded-full border ${locationPill.cls}`}>
                    {locationPill.icon} {locationPill.text}
                  </div>
                )}

                {notifPermission !== "granted" && (
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold px-3 py-2 rounded-full border bg-yellow-50 text-yellow-700 border-yellow-200">
                    <Bell className="w-3 h-3" /> No browser alerts — tap "Enable Alerts" after
                  </div>
                )}

                <button onClick={cancelSOS} className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl font-bold border-2 border-gray-200">
                  CANCEL TRIGGER
                </button>
              </div>

            ) : triggered ? (
              <div className="space-y-6">
                <div className="relative inline-block">
                  <Siren className="w-20 h-20 text-red-600 mx-auto animate-pulse" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-red-600 uppercase">SOS Triggered</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    {locationRef.current.lat ? "✅ Family alerted with your live location." : "⚠️ Family alerted. No location available."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a href="tel:112" className="flex flex-col items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-2xl hover:bg-red-100 transition-all group">
                    <PhoneCall className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black text-red-700 uppercase">Emergency 112</span>
                  </a>
                  <a href="tel:102" className="flex flex-col items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-2xl hover:bg-blue-100 transition-all group">
                    <PhoneCall className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black text-blue-700 uppercase">Ambulance 102</span>
                  </a>
                </div>

                <button onClick={cancelSOS} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all uppercase tracking-wide">
                  I am Safe / Close
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Emergency Contacts gear */}
      <Link href="/emergency-contacts" className="fixed bottom-8 left-6 z-50 flex items-center justify-center w-8 h-8 bg-white border border-gray-200 text-gray-500 rounded-full shadow-md hover:scale-110 transition-all" title="Manage emergency contacts">
        <Settings2 className="w-4 h-4" />
      </Link>
    </>
  );
}
