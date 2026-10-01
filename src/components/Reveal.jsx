"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const delayClass = delay > 0 ? ` reveal-delay-${Math.min(delay, 4)}` : "";

  return (
    <Tag
      ref={ref}
      className={`reveal${visible ? " visible" : ""}${delayClass} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
