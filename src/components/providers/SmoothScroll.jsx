"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const SmoothScrollContext = createContext({
  lenis: null,
  lockScroll: () => {},
  unlockScroll: () => {},
  scrollTo: () => {},
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export default function SmoothScroll({ children }) {
  const [lenisInstance, setLenisInstance] = useState(null);
  const lenisRef = useRef(null);
  const lockCountRef = useRef(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const lenis = new Lenis({
      autoRaf: false,
      duration: prefersReducedMotion ? 0 : 1.15,
      lerp: prefersReducedMotion ? 1 : 0.09,
      smoothWheel: !prefersReducedMotion,
      syncTouch: false,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    // If Preloader locked scroll during useLayoutEffect before Lenis mounted, stop immediately
    if (lockCountRef.current > 0) {
      lenis.stop();
    }

    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    const handleResizeOrLoad = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("load", handleResizeOrLoad);
    window.addEventListener("resize", handleResizeOrLoad);

    return () => {
      window.removeEventListener("load", handleResizeOrLoad);
      window.removeEventListener("resize", handleResizeOrLoad);
      gsap.ticker.remove(updateTicker);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const lockScroll = useCallback(() => {
    lockCountRef.current += 1;
    lenisRef.current?.stop();
    document.body.style.overflow = "hidden";
  }, []);

  const unlockScroll = useCallback(() => {
    lockCountRef.current = Math.max(0, lockCountRef.current - 1);
    if (lockCountRef.current === 0) {
      lenisRef.current?.start();
      document.body.style.overflow = "";
    }
  }, []);

  const scrollTo = useCallback((target, options = {}) => {
    const opts = { offset: -80, duration: 1.2, ...options };
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, opts);
    } else if (typeof target === "string") {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    } else if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      lenis: lenisInstance,
      lockScroll,
      unlockScroll,
      scrollTo,
    }),
    [lenisInstance, lockScroll, unlockScroll, scrollTo]
  );

  return (
    <SmoothScrollContext.Provider value={contextValue}>
      {children}
    </SmoothScrollContext.Provider>
  );
}