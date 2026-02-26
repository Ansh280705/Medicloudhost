"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export function ScrollReveal({
  children,
  offset = 100,
  className,
}) {
  const ref = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
        }
      },
      { rootMargin: `0px 0px -${offset}px 0px` }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [offset]);

  return (
    <div ref={ref} className={clsx("relative", className)}>
      {typeof children === "function" ? children(isActive) : children}
    </div>
  );
}
