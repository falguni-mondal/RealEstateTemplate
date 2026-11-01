"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function ElasticLine({ dark = false, className = "" }) {
  const wrapRef = useRef(null);
  const pathRef = useRef(null);
  const point = useRef({ x: 500, y: 20 });

  const { contextSafe } = useGSAP({ scope: wrapRef });

  const updateCurve = () => {
    if (pathRef.current) {
      pathRef.current.setAttribute(
        "d",
        `M 0 20 Q ${point.current.x} ${point.current.y} 1000 20`
      );
    }
  };

  const handleMove = contextSafe((e) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * 1000;
    const relY = e.clientY - rect.top;
    const pullY = 20 + (relY - 20) * 1.8;

    gsap.to(point.current, {
      x: Math.max(50, Math.min(950, relX)),
      y: Math.max(-35, Math.min(75, pullY)),
      duration: 0.15,
      overwrite: "auto",
      onUpdate: updateCurve,
    });
  });

  const handleLeave = contextSafe(() => {
    gsap.to(point.current, {
      x: 500,
      y: 20,
      duration: 1.4,
      ease: "elastic.out(1.2, 0.14)",
      overwrite: "auto",
      onUpdate: updateCurve,
    });
  });

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative h-10 w-full cursor-row-resize select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1000 40"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
      >
        <path
          ref={pathRef}
          d="M 0 20 Q 500 20 1000 20"
          fill="none"
          stroke={dark ? "rgba(255,255,255,0.22)" : "rgba(15,23,42,0.18)"}
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}