"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Mic, MicOff, Volume2, VolumeX, Send, RefreshCw,
  Stethoscope, Calendar, AlertTriangle, Loader2, ChevronRight,
  ChevronDown
} from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import Link from "next/link";

const STAGES = ["Greeting", "Symptoms", "History", "Assessment", "Plan"];

const INITIAL_MESSAGE = {
  role: "assistant",
  content: "Hello! I'm Dr. MediAI 👋 I'm here to help you understand your health concerns. What brings you in today? Please describe what you're experiencing.",
};

export default function AIConsultation() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [lang, setLang] = useState("en-IN");
  const [interimText, setInterimText] = useState("");
  const [hasSpokenGreeting, setHasSpokenGreeting] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const { isSpeaking, speak, stop: stopSpeech, voices, selectedVoice, setSelectedVoice } =
    useSpeechSynthesis();

  const handleMicResult = useCallback((text, isFinal) => {
    if (!isFinal) { setInterimText(text); return; }
    setInterimText("");
    setInput(text);
  }, []);

  const handleMicEnd = useCallback(() => {
    setInterimText("");
  }, []);

  const { isListening, isSupported, start: startMic, stop: stopMic } =
    useSpeechRecognition({ onResult: handleMicResult, onEnd: handleMicEnd });

  // Speak greeting once on mount
  useEffect(() => {
    if (!hasSpokenGreeting && voiceEnabled) {
      const timer = setTimeout(() => {
        speak(INITIAL_MESSAGE.content, {
          lang,
          onEnd: () => setHasSpokenGreeting(true),
        });
      }, 800);
      setHasSpokenGreeting(true);
      return () => clearTimeout(timer);
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimText]);

  // Auto-submit when mic gives final result
  useEffect(() => {
    if (input && !isListening) {
      const t = setTimeout(() => {
        if (input.trim()) sendMessage(input);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [input, isListening]);

  const toggleMic = () => {
    if (isListening) { stopMic(); return; }
    if (isSpeaking) stopSpeech();
    startMic(lang);
  };

  // Preview voice when user changes it
  const handleVoiceChange = (e) => {
    const voice = voices.find((v) => v.name === e.target.value) || null;
    setSelectedVoice(voice);
    if (voice) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance("Hello, I am Dr. MediAI. How can I help you today?");
      u.voice = voice;
      u.rate = 0.92;
      u.pitch = 1.05;
      window.speechSynthesis.speak(u);
    }
  };

  const sendMessage = async (text = input) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setInput("");
    setIsLoading(true);
    if (stageIndex < STAGES.length - 1) setStageIndex((s) => s + 1);

    const userMsg = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    // Placeholder for streaming
    const aiMsg = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, aiMsg]);

    try {
      const res = await fetch("/api/ai/doctor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, lang }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        fullText += chunk;
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: fullText };
          return copy;
        });
      }

      // Speak the AI response
      if (voiceEnabled && fullText) {
        speak(fullText, { lang });
      }

    } catch (e) {
      console.error(e);
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "⚠️ Connection issue. Please check your internet and try again.",
        };
        return copy;
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const restart = () => {
    stopSpeech();
    stopMic();
    setMessages([INITIAL_MESSAGE]);
    setInput("");
    setStageIndex(0);
    setInterimText("");
    if (voiceEnabled) speak(INITIAL_MESSAGE.content, { lang });
  };

  const isSummary = messages[messages.length - 1]?.content?.includes("Consultation Summary");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 flex flex-col">

      {/* ── Header ── */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              {(isLoading || isSpeaking) && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
              )}
            </div>
            <div>
              <h1 className="text-white font-bold text-base leading-none">Dr. MediAI</h1>
              <p className="text-teal-400 text-xs mt-0.5">
                {isLoading ? "Thinking..." : isSpeaking ? "Speaking..." : isListening ? "Listening..." : "AI Medical Consultation"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice selector */}
            {voices.length > 0 && (
              <div className="relative">
                <select
                  value={selectedVoice?.name || ""}
                  onChange={handleVoiceChange}
                  className="appearance-none bg-white/10 border border-white/20 text-white text-xs pl-2.5 pr-6 py-1.5 rounded-lg cursor-pointer hover:bg-white/20 transition-all focus:outline-none focus:ring-1 focus:ring-teal-500 max-w-[120px] truncate"
                  title="Change AI voice (previews on select)"
                >
                  <option value="" className="bg-slate-900 text-white">🔊 Voice</option>
                  {voices.filter(v => v.lang.startsWith("en")).map(v => (
                    <option key={v.name} value={v.name} className="bg-slate-900 text-white">
                      🇬🇧 {v.name.replace(/Microsoft |Google /, "")}
                    </option>
                  ))}
                  {voices.filter(v => v.lang.startsWith("hi")).map(v => (
                    <option key={v.name} value={v.name} className="bg-slate-900 text-white">
                      🇮🇳 {v.name.replace(/Microsoft |Google /, "")}
                    </option>
                  ))}
                  {voices.filter(v => !v.lang.startsWith("en") && !v.lang.startsWith("hi")).map(v => (
                    <option key={v.name} value={v.name} className="bg-slate-900 text-white">
                      🌐 {v.name.replace(/Microsoft |Google /, "")}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
            )}
            {/* Lang toggle */}
            <button
              onClick={() => {
                const next = lang === "en-IN" ? "hi-IN" : "en-IN";
                setLang(next);
                // Auto-pick best voice for selected language
                const all = window.speechSynthesis?.getVoices() ?? [];
                if (next === "hi-IN") {
                  // Priority: Swara Neural (best) > Heera > any hi voice
                  const hiVoice =
                    all.find(v => v.name.includes("Swara")) ||
                    all.find(v => v.name.includes("Heera")) ||
                    all.find(v => v.lang === "hi-IN") ||
                    all.find(v => v.lang.startsWith("hi"));
                  if (hiVoice) setSelectedVoice(hiVoice);
                } else {
                  // Back to English — pick Google UK/US or first en voice
                  const enVoice =
                    all.find(v => v.name.includes("Google UK")) ||
                    all.find(v => v.name.includes("Google US")) ||
                    all.find(v => v.lang.startsWith("en"));
                  setSelectedVoice(enVoice || null);
                }
              }}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all font-medium"
            >
              {lang === "en-IN" ? "🇮🇳 EN" : "🇮🇳 हि"}
            </button>
            {/* Voice toggle */}
            <button
              onClick={() => { setVoiceEnabled((v) => !v); if (isSpeaking) stopSpeech(); }}
              className={`p-2 rounded-lg transition-all ${voiceEnabled ? "bg-teal-500/20 text-teal-400" : "bg-white/10 text-gray-400"}`}
              title={voiceEnabled ? "Mute AI voice" : "Enable AI voice"}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            {/* Restart */}
            <button
              onClick={restart}
              className="p-2 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-all"
              title="New consultation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Stage Progress ── */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-4">
        <div className="flex items-center gap-1">
          {STAGES.map((s, i) => (
            <div key={s} className="flex-1 flex items-center gap-1">
              <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= stageIndex ? "bg-teal-400" : "bg-white/10"
              }`} />
              {i < STAGES.length - 1 && (
                <ChevronRight className="w-2 h-2 text-white/20 shrink-0" />
              )}
            </div>
          ))}
        </div>
        <p className="text-[10px] text-teal-400/70 mt-1 font-medium uppercase tracking-widest">
          {STAGES[stageIndex]}
        </p>
      </div>

      {/* ── Chat Messages ── */}
      <div className="flex-1 overflow-y-auto pt-4 pb-2">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm ${
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-teal-400 to-emerald-600 shadow-md shadow-teal-500/20"
                  : "bg-gradient-to-br from-blue-500 to-violet-600"
              }`}>
                {msg.role === "assistant" ? "🩺" : "👤"}
              </div>

              {/* Bubble */}
              <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "assistant"
                  ? "bg-white/8 border border-white/10 text-gray-100 rounded-tl-sm"
                  : "bg-blue-600/80 text-white rounded-tr-sm"
              } ${isLoading && i === messages.length - 1 && msg.role === "assistant" && !msg.content
                ? "animate-pulse min-w-[80px] min-h-[40px]"
                : ""
              }`}>
                {msg.content ? (
                  <span className="whitespace-pre-wrap">{msg.content}
                    {isLoading && i === messages.length - 1 && msg.role === "assistant" && (
                      <span className="inline-block w-0.5 h-4 bg-teal-400 animate-pulse ml-0.5 align-middle" />
                    )}
                  </span>
                ) : isLoading && i === messages.length - 1 ? (
                  <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                ) : null}
              </div>
            </div>
          ))}

          {/* Interim speech text */}
          {interimText && (
            <div className="flex flex-row-reverse gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm shrink-0">👤</div>
              <div className="max-w-[78%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm bg-blue-600/40 border border-blue-500/30 text-blue-200 italic">
                {interimText}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Summary CTA (if summary detected) ── */}
      {isSummary && (
        <div className="max-w-3xl mx-auto w-full px-4 py-3">
          <Link
            href="/doctors"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-teal-500/30"
          >
            <Calendar className="w-4 h-4" />
            Book a Real Doctor on MediCloud
          </Link>
        </div>
      )}

      {/* ── Input Bar ── */}
      <div className="border-t border-white/10 bg-white/5 backdrop-blur-xl px-4 py-4">
        <div className="max-w-3xl mx-auto">
          {!isSupported && (
            <p className="text-xs text-orange-400 mb-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Mic not supported in this browser. Use Chrome or Edge for voice.
            </p>
          )}
          <div className="flex items-center gap-2">
            {/* Mic button */}
            <button
              onClick={toggleMic}
              disabled={isLoading || !isSupported}
              className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
                isListening
                  ? "bg-red-500 shadow-lg shadow-red-500/40 scale-110"
                  : "bg-white/10 hover:bg-white/20 text-gray-300"
              }`}
            >
              {isListening && (
                <span className="absolute inset-0 rounded-2xl bg-red-500 animate-ping opacity-40" />
              )}
              {isListening ? (
                <MicOff className="w-5 h-5 text-white relative z-10" />
              ) : (
                <Mic className="w-5 h-5 relative z-10" />
              )}
            </button>

            {/* Text input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder={
                  isListening ? "🎙️ Listening — speak now..." :
                  isSpeaking ? "Dr. MediAI is speaking..." :
                  "Type or tap mic to speak..."
                }
                disabled={isLoading}
                className="w-full bg-white/10 border border-white/15 text-white placeholder:text-gray-500 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
              />
              {isSpeaking && (
                <button
                  onClick={stopSpeech}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-teal-400 hover:text-white"
                >
                  Stop
                </button>
              )}
            </div>

            {/* Send button */}
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-600 mt-3">
            ⚕️ AI guidance only — not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
