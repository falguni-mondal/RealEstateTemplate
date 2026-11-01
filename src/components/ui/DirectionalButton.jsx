"use client";

import { useRef } from "react";
import { gsap, useGSAP, EASE_OUT } from "@/lib/gsap";

export default function DirectionalButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "dark", // "dark" | "accent" | "outline" | "glass"
  magnetic = false,
  className = "",
}) {
  const btnRef = useRef(null);
  const flairRef = useRef(null);

  const { contextSafe } = useGSAP({ scope: btnRef });

  const getFarthestDiameter = (x, y, rect) => {
    const distX = Math.max(x, rect.width - x);
    const distY = Math.max(y, rect.height - y);
    return Math.hypot(distX, distY) * 2.25;
  };

  const handleMouseEnter = contextSafe((e) => {
    const btn = btnRef.current;
    const flair = flairRef.current;
    if (!btn || !flair) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const diameter = getFarthestDiameter(x, y, rect);

    gsap.killTweensOf(flair);
    gsap.set(flair, {
      width: diameter,
      height: diameter,
      left: x,
      top: y,
      xPercent: -50,
      yPercent: -50,
      scale: 0,
    });
    gsap.to(flair, {
      scale: 1,
      duration: 0.55,
      ease: EASE_OUT,
    });
  });

  const handleMouseMove = contextSafe((e) => {
    const btn = btnRef.current;
    const flair = flairRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (flair) {
      gsap.to(flair, {
        left: x,
        top: y,
        duration: 0.2,
        ease: "power2.out",
      });
    }

    if (magnetic && window.innerWidth >= 1024) {
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      gsap.to(btn, {
        x: relX * 0.14,
        y: relY * 0.14,
        duration: 0.3,
        ease: EASE_OUT,
      });
    }
  });

  const handleMouseLeave = contextSafe((e) => {
    const btn = btnRef.current;
    const flair = flairRef.current;
    if (!btn || !flair) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.killTweensOf(flair);
    gsap.to(flair, {
      left: x,
      top: y,
      scale: 0,
      duration: 0.45,
      ease: EASE_OUT,
    });

    if (magnetic) {
      gsap.to(btn, { x: 0, y: 0, duration: 0.45, ease: EASE_OUT });
    }
  });

  const variants = {
    dark: "bg-ink text-white border border-ink hover:text-white",
    accent: "bg-accent text-white border border-accent hover:text-white",
    outline: "bg-white text-ink border border-ink/30 hover:text-white hover:border-ink",
    glass: "bg-transparent text-white border border-white/40 hover:text-ink hover:border-white",
  };

  const flairColors = {
    dark: "bg-accent",
    accent: "bg-ink",
    outline: "bg-ink",
    glass: "bg-white",
  };

  const sharedClasses = `group relative inline-flex min-h-12 cursor-pointer items-center justify-center overflow-hidden px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300 ${variants[variant]} ${className}`;

  const content = (
    <>
      <span
        ref={flairRef}
        style={{ borderRadius: "9999px" }}
        className={`pointer-events-none absolute scale-0 ${flairColors[variant]}`}
      />
      <span className="relative z-10 inline-flex items-center gap-2.5">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        ref={btnRef}
        href={href}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={sharedClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={btnRef}
      type={type}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={sharedClasses}
    >
      {content}
    </button>
  );
}