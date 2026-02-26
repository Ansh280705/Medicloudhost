"use client";
import { useRef, useCallback, useState, useEffect } from "react";

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const utteranceRef = useRef(null);

  // Load all available voices (async in some browsers)
  useEffect(() => {
    const load = () => {
      const v = window.speechSynthesis?.getVoices() ?? [];
      if (v.length > 0) setVoices(v);
    };
    load();
    window.speechSynthesis?.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", load);
  }, []);

  const speak = useCallback(
    (text, { lang = "en-IN", rate, pitch, onEnd } = {}) => {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();

      // Hindi needs slower rate to be clearly understood
      const isHindi = lang.startsWith("hi");
      const finalRate  = rate  ?? (isHindi ? 0.82 : 0.92);
      const finalPitch = pitch ?? (isHindi ? 1.1  : 1.05);

      // Strip markdown symbols
      const clean = text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/📋|⚠️|🟢|🟡|🔴|✅|•/g, "")
        .replace(/\n+/g, "। ")
        .trim();

      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = lang;
      utterance.rate = finalRate;
      utterance.pitch = finalPitch;

      // Use selectedVoice if set, else auto-pick best
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      } else {
        const all = window.speechSynthesis.getVoices();
        if (isHindi) {
          // Best Hindi voices in priority order
          const hiVoice =
            all.find(v => v.name.includes("Swara"))   ||  // Microsoft Neural (best)
            all.find(v => v.name.includes("Heera"))   ||  // Microsoft standard
            all.find(v => v.lang === "hi-IN")         ||
            all.find(v => v.lang.startsWith("hi"));
          if (hiVoice) utterance.voice = hiVoice;
        } else {
          const preferred = all.find(
            v => v.lang.startsWith("en") &&
              (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Female"))
          );
          if (preferred) utterance.voice = preferred;
        }
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => { setIsSpeaking(false); onEnd?.(); };
      utterance.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [selectedVoice]
  );

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, speak, stop, voices, selectedVoice, setSelectedVoice };
}
