"use client";

import { useRef } from "react";
import { useGSAP, revealWords, revealLines } from "@/lib/gsap";

export default function SectionHeading({ title, subtitle }) {
  const wrapRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const cleanupWords = revealWords(titleRef.current, {
        trigger: wrapRef.current,
        start: "top 86%",
        stagger: 0.035,
        duration: 0.95,
      });

      const cleanupLines = subRef.current
        ? revealLines(subRef.current, {
            trigger: wrapRef.current,
            start: "top 85%",
            delay: 0.12,
            stagger: 0.065,
            duration: 0.9,
          })
        : () => {};

      return () => {
        cleanupWords();
        cleanupLines();
      };
    },
    { scope: wrapRef }
  );

  return (
    <div ref={wrapRef} className="w-full">
      <h2
        ref={titleRef}
        className="max-w-5xl font-heading text-[clamp(2.4rem,5vw,4.75rem)] font-medium leading-[1.08] tracking-tight text-ink"
      >
        {title}
      </h2>

      {subtitle && (
        <p
          ref={subRef}
          className="mt-4 max-w-2xl text-base font-light leading-relaxed text-ink-muted md:text-lg"
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}