"use client";
import { useEffect, useState } from "react";

export default function Counter({ value, duration = 1500 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.replace(/\D/g, "")) || 0; // remove % or text
    if (end === 0) return;

    const increment = Math.ceil(end / (duration / 50)); // ~30ms per tick

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, 30);

    return () => clearInterval(timer);
  }, [value, duration]);

  // Keep any suffix like % or + from original value
  const suffix = value.replace(/\d/g, "");

  return <span>{count}{suffix}</span>;
}
