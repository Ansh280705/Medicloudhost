"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  User,
} from "lucide-react";
import { toast } from "sonner";
import PrescriptionForm from "@/components/PrescriptionForm";
import { getAppointmentById } from "@/actions/appointments";
import PrescriptionModal from "@/components/prescriptionModal";

export default function VideoCall({ sessionId, token, appointmentEndTime, appointmentId, appointmentStartTime }) {
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [remoteUser, setRemoteUser] = useState(null);
  const [countdown, setCountdown] = useState(null); // 30 → 0
  const [sessionDuration, setSessionDuration] = useState(0); // in seconds
  const [sessionTimer, setSessionTimer] = useState(""); // Display string
  const [timerType, setTimerType] = useState("waiting"); // waiting | active | ended
  const [sessionEnded, setSessionEnded] = useState(false);
  const [appointment, setAppointment] = useState(null);

  const [showPrescription, setShowPrescription] = useState(false);

  const sessionRef = useRef(null);
  const publisherRef = useRef(null);

  const router = useRouter();

  const appId = process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID;

  useEffect(() => {
    async function fetchAppointment() {
      try {
        const data = await getAppointmentById(appointmentId);
        setAppointment(data);
      } catch (err) {
        toast.error(err.message || "Failed to load appointment");
      }
    }

    fetchAppointment();
  }, [getAppointmentById]);
  useEffect(() => {
    if (!isConnected) return;

    // Start session duration timer
    const timer = setInterval(() => {
      setSessionDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isConnected]);


  // useEffect(() => {
  //   if (!appointmentEndTime) return;


  //   const endTime = new Date(appointmentEndTime).getTime();
  //   const now = Date.now();

  //   const timeUntilEnd = endTime - now;
  //   const warningTime = timeUntilEnd - 30 * 1000;

  //   let warningTimer;
  //   let endTimer;

  //   // 1️⃣ Session started
  //   toast.success(" Your session has started");

  //   // 2️⃣ 30 seconds warning
  //   if (warningTime > 0) {
  //     warningTimer = setTimeout(() => {
  //       toast.warning("Session will end in 30 seconds");
  //     }, warningTime);
  //   }

  //   // 3️⃣ Session end
  //   if (timeUntilEnd > 0) {
  //     endTimer = setTimeout(() => {
  //       toast.error("Session ended");

  //       if (sessionRef.current) {
  //         sessionRef.current.disconnect();
  //       }
  //       router.push("/appointments");
  //     }, timeUntilEnd);
  //   }

  //   return () => {
  //     clearTimeout(warningTimer);
  //     clearTimeout(endTimer);
  //   };
  // }, [appointmentEndTime]);
  // Timer Effect
  useEffect(() => {
    if (!appointmentEndTime || !appointmentStartTime) return;

    const calculateTime = () => {
      const start = new Date(appointmentStartTime).getTime();
      const end = new Date(appointmentEndTime).getTime();
      const now = Date.now();

      // Case 1: Session hasn't started yet (Buffer time)
      if (now < start) {
        const diff = Math.ceil((start - now) / 1000);
        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;
        setSessionTimer(`Starts in: ${minutes}:${seconds.toString().padStart(2, "0")}`);
        setTimerType("waiting");
      }
      // Case 2: Session is live
      else if (now >= start && now < end) {
        const diff = Math.ceil((end - now) / 1000);
        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;
        setSessionTimer(`Time Remaining: ${minutes}:${seconds.toString().padStart(2, "0")}`);
        setTimerType("active");

        // 30s Warning
        if (diff <= 30 && diff > 0 && countdown === null) {
          toast.warning("Session will end in 30 seconds");
          setCountdown(diff);
        }
      }
      // Case 3: Session Ended
      else {
        setSessionTimer("Session Ended");
        setTimerType("ended");
        setSessionEnded(true);
        if (sessionRef.current) sessionRef.current.disconnect();

        if (userRole === "DOCTOR") {
          setShowPrescription(true);
        } else {
          router.push("/appointments");
        }
      }
    };

    // Run immediately
    calculateTime();

    // Update every second
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [appointmentEndTime, appointmentStartTime, userRole, router, countdown]);

  // Handle script load
  const handleScriptLoad = () => {
    setScriptLoaded(true);
    if (!window.OT) {
      toast.error("Failed to load Vonage Video API");
      setIsLoading(false);
      return;
    }
    initializeSession();
  };

  // Initialize video session
  const initializeSession = () => {
    if (!appId || !sessionId || !token) {
      toast.error("Missing required video call parameters");
      router.push("/appointments");
      return;
    }

    console.log({ appId, sessionId, token });

    try {
      // Initialize the session
      sessionRef.current = window.OT.initSession(appId, sessionId);

      // Subscribe to new streams
      sessionRef.current.on("streamCreated", (event) => {
        toast.success("Your session has started");
        console.log(event, "New stream created");
        const raw = event.stream.connection.data || "";

        const parsed = JSON.parse(raw);

        setRemoteUser({
          name: parsed.name || "User",
          role: parsed.role || "Patient",
        });

        sessionRef.current.subscribe(
          event.stream,
          "subscriber",
          {
            insertMode: "append",
            width: "100%",
            height: "100%",
          },
          (error) => {
            if (error) {
              toast.error("Error connecting to other participant's stream");
            }
          }
        );
      });

      // Handle session events
      sessionRef.current.on("sessionConnected", () => {
        const data = sessionRef.current.connection?.data || "";

        const parsed = JSON.parse(data);

        setUserName(parsed.name || "You");
        setUserRole(parsed.role || "Patient");
        setIsConnected(true);
        setIsLoading(false);

        // THIS IS THE FIX - Initialize publisher AFTER session connects
        publisherRef.current = window.OT.initPublisher(
          "publisher", // This targets the div with id="publisher"
          {
            insertMode: "replace", // Change from "append" to "replace"
            width: "100%",
            height: "100%",
            publishAudio: isAudioEnabled,
            publishVideo: isVideoEnabled,
          },
          (error) => {
            if (error) {
              console.error("Publisher error:", error);
              toast.error("Error initializing your camera and microphone");
            } else {
              console.log(
                "Publisher initialized successfully - you should see your video now"
              );
            }
          }
        );
      });

      sessionRef.current.on("sessionDisconnected", () => {
        setIsConnected(false);
      });

      // Connect to the session
      sessionRef.current.connect(token, (error) => {
        if (error) {
          toast.error("Error connecting to video session");
        } else {
          // Publish your stream AFTER connecting
          if (publisherRef.current) {
            sessionRef.current.publish(publisherRef.current, (error) => {
              if (error) {
                console.log("Error publishing stream:", error);
                toast.error("Error publishing your stream");
              } else {
                console.log("Stream published successfully");
              }
            });
          }
        }
      });
    } catch (error) {
      toast.error("Failed to initialize video call");
      setIsLoading(false);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (publisherRef.current) {
      publisherRef.current.publishVideo(!isVideoEnabled);
      setIsVideoEnabled((prev) => !prev);
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (publisherRef.current) {
      publisherRef.current.publishAudio(!isAudioEnabled);
      setIsAudioEnabled((prev) => !prev);
    }
  };

  // End call
  const endCall = () => {
    // Properly destroy publisher
    if (publisherRef.current) {
      publisherRef.current.destroy();
      publisherRef.current = null;
    }

    // Disconnect session
    if (sessionRef.current) {
      sessionRef.current.disconnect();
      sessionRef.current = null;
    }

    if (userRole === "DOCTOR") {
      setShowPrescription(true); // Show modal
    } else {
      router.push("/appointments"); // Patient redirect
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (publisherRef.current) {
        publisherRef.current.destroy();
      }
      if (sessionRef.current) {
        sessionRef.current.disconnect();
      }
    };
  }, []);

  if (!sessionId || !token || !appId) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-client mb-4">
          Invalid Video Call
        </h1>
        <p className="text-muted-foreground mb-6">
          Missing required parameters for the video call.
        </p>
        <Button
          onClick={() => router.push("/appointments")}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Back to Appointments
        </Button>
      </div>
    );
  }


  return (
    <>
      <Script
        src="https://unpkg.com/@vonage/client-sdk-video@latest/dist/js/opentok.js"
        onLoad={handleScriptLoad}
        onError={() => {
          toast.error("Failed to load video call script");
          setIsLoading(false);
        }}
      />
      {showPrescription && (
        <PrescriptionModal
          appointment={appointment}
          doctor={{ name: userName, id: userRole }}
          onClose={() => setShowPrescription(false)}
        />
      )}


      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-client mb-2">
            Live Session
          </h1>
          <p className="text-muted-foreground">
            {isConnected
              ? "Connected"
              : isLoading
                ? "Connecting..."
                : "Connection failed"}
          </p>
        </div>
        <div className="text-center mb-2">
          <p className={`text-lg font-bold ${timerType === "active" ? "text-green-600" :
              timerType === "waiting" ? "text-yellow-600" : "text-red-600"
            }`}>
            {sessionTimer}
          </p>
        </div>

        {isLoading && !scriptLoaded ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-emerald-400 animate-spin mb-4" />
            <p className="text-black text-lg">
              Connecting to video call...
            </p>

            <p className="mt-3 text-sm text-yellow-500 text-center">
              If the call takes too long, please refresh the page.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Publisher (Your video) */}
              <div className="border-2 border-emerald-500 rounded-lg overflow-hidden flex flex-col">
                <div className="bg-emerald-900/10 px-3 py-2 text-emerald-400 text-sm font-medium">
                  {userName} ({userRole})
                </div>
                <div
                  id="publisher"
                  className="w-full aspect-video bg-muted/30 flex items-center justify-center"
                >
                  {!scriptLoaded && (
                    <div className="bg-muted/20 rounded-full p-8">
                      <User className="h-12 w-12 text-emerald-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Subscriber (Other person's video) */}
              <div className="border-2 border-blue-500 rounded-lg overflow-hidden flex flex-col">
                <div className="bg-blue-900/10 px-3 py-2 text-blue-400 text-sm font-medium">
                  {remoteUser
                    ? `${remoteUser.name} (${remoteUser.role})`
                    : "Waiting for participant..."}
                </div>
                <div
                  id="subscriber"
                  className="w-full aspect-video bg-muted/30 flex items-center justify-center"
                >
                  {(!isConnected || !scriptLoaded) && (
                    <div className="bg-muted/20 rounded-full p-8">
                      <User className="h-12 w-12 text-emerald-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Video controls */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={toggleVideo}
                className={`rounded-full p-4 h-14 w-14 ${isVideoEnabled
                  ? "border-emerald-900/30"
                  : "bg-red-900/20 border-red-900/30 text-red-400"
                  }`}
                disabled={!publisherRef.current}
              >
                {isVideoEnabled ? <Video /> : <VideoOff />}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={toggleAudio}
                className={`rounded-full p-4 h-14 w-14 ${isAudioEnabled
                  ? "border-emerald-900/30"
                  : "bg-red-900/20 border-red-900/30 text-red-400"
                  }`}
                disabled={!publisherRef.current}
              >
                {isAudioEnabled ? <Mic /> : <MicOff />}
              </Button>

              <Button
                variant="destructive"
                size="lg"
                onClick={endCall}
                className="rounded-full p-4 h-14 w-14 bg-red-600 hover:bg-red-700"
              >
                <PhoneOff />
              </Button>
            </div>

            <div className="text-center mt-2">
              <p className="text-muted-foreground text-sm">
                {isVideoEnabled ? "Camera on" : "Camera off"} •
                {isAudioEnabled ? " Microphone on" : " Microphone off"}
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                When you're finished with your session, click the red
                button to end the call
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
