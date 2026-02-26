"use client";
import { useState, useEffect } from "react";
import { HashLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader({ children, user }) {
  const [phase, setPhase] = useState("loading"); // "loading" | "greeting" | "finished"

  useEffect(() => {
    // 1. Initial Loading Animation (HashLoader)
    const loaderTimer = setTimeout(() => {
      if (user) {
        setPhase("greeting");
      } else {
        setPhase("finished");
      }
    }, 4500);

    return () => clearTimeout(loaderTimer);
  }, [user]);

  useEffect(() => {
    if (phase === "greeting") {
      // 2. Greeting Phase Duration
      const greetingTimer = setTimeout(() => {
        setPhase("finished");
      }, 4000);
      return () => clearTimeout(greetingTimer);
    }
  }, [phase]);

  const getGreetingText = () => {
    if (!user) return null;

    if (user.role === "ADMIN")
      return <>Hi <span className="text-client">Admin</span></>;

    if (user.role === "DOCTOR")
      return <>Hi <span className="text-client">Doctor</span></>;

    return <>Hi <span className="text-client">{user.name || "Patient"}</span></>;
  };

  if (phase === "finished") {
    return children;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-background z-[100]">
      <AnimatePresence mode="wait">
        {phase === "loading" ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <HashLoader color="#6ba49f" size={60} />
          </motion.div>
        ) : (
          <motion.div
            key="greeting"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -10 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-primary tracking-tight">
              {getGreetingText()}
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.4, duration: 1 }}
              className="h-1 bg-primary mt-4 rounded-full mx-auto"
              style={{ maxWidth: "150px" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
