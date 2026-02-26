"use client";

import { useState, useEffect } from "react";

export default function TypingText() {
  const words = [
    "Instant Care Anytime Anywhere",
    "Your Health Our Priority",
    
    

  
  ];

  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const typingSpeed = 100;
  const deletingSpeed = 60;
  const pauseTime = 1200;

  useEffect(() => {
    if (!deleting && subIndex === words[index].length) {
      setTimeout(() => setDeleting(true), pauseTime);
      return;
    }

    if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      const nextSubIndex = subIndex + (deleting ? -1 : 1);
      setSubIndex(nextSubIndex);
      setText(words[index].substring(0, nextSubIndex));
    }, deleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting]);

  return (
    <span className="inline-block items-center text-xl md:text-2xl lg:text-4xl font-bold">
      <span className="bg-gradient-to-r from-[#6ba49f]  to-[#45827e] bg-clip-text text-transparent">
        {text}
      </span>
      {/* <span className="ml-1 w-[2px] h-[.8em] bg-[#fcfcfc] cursor-pulse"></span> */}
    </span>
  );
}
