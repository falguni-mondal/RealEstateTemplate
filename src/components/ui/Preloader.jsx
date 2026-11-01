"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, EASE_EXPO } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { siteConfig } from "@/config/siteConfig";

const SHUTTERS = [0, 1, 2, 3, 4, 5];
const DISPLAY_WORDS = ["Modern", "Flats", "&", "Land", "Plots"];

export default function Preloader() {
  const containerRef = useRef(null);
  const shutterRefs = useRef([]);
  const vLineRefs = useRef([]);
  const centerLineRef = useRef(null);
  const accentLineRef = useRef(null);
  const stageOverlayRef = useRef(null);

  const [done, setDone] = useState(false);
  const { lockScroll, unlockScroll } = useSmoothScroll();

  useGSAP(
    () => {
      let heroDispatched = false;

      const triggerHeroStart = () => {
        if (heroDispatched || typeof window === "undefined") return;
        heroDispatched = true;
        window.__preloaderDone = true;
        window.dispatchEvent(new CustomEvent("preloader:start-hero"));
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        triggerHeroStart();
        setDone(true);
        return;
      }

      window.__preloaderDone = false;
      lockScroll();

      const words = gsap.utils.toArray(".preloader-word-item");
      const metaItems = gsap.utils.toArray(".preloader-meta-item");

      // Normalize initial states explicitly in GSAP to match CSS classes
      gsap.set(vLineRefs.current, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(centerLineRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(accentLineRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set([words, metaItems], { y: 0, yPercent: 125 });
      gsap.set(shutterRefs.current, { yPercent: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          triggerHeroStart();
          unlockScroll();
          ScrollTrigger.refresh();
          setDone(true);
        },
      });

      // Phase 1: Draw 6 vertical architectural drafting hairlines + center datum axis
      tl.to(vLineRefs.current, {
        scaleY: 1,
        duration: 0.65,
        stagger: 0.045,
        ease: EASE_EXPO,
      })
        .to(
          centerLineRef.current,
          {
            scaleX: 1,
            duration: 0.7,
            ease: EASE_EXPO,
          },
          0.1
        )
        // Phase 2: Reveal architectural metadata & main display words on Y-axis
        .to(
          metaItems,
          {
            yPercent: 0,
            duration: 0.75,
            stagger: 0.06,
            ease: EASE_EXPO,
          },
          0.2
        )
        .to(
          words,
          {
            yPercent: 0,
            duration: 0.85,
            stagger: 0.045,
            ease: EASE_EXPO,
          },
          0.25
        )
        .to(
          accentLineRef.current,
          {
            scaleX: 1,
            duration: 0.85,
            ease: "power3.inOut",
          },
          0.25
        )
        // Phase 3: Clean upward retraction of words & lines into masks
        .to(
          [metaItems, words],
          {
            yPercent: -125,
            duration: 0.5,
            stagger: 0.02,
            ease: "power3.in",
          },
          1.25
        )
        .to(
          [centerLineRef.current, accentLineRef.current],
          {
            scaleX: 0,
            transformOrigin: "right center",
            duration: 0.45,
            ease: EASE_EXPO,
          },
          1.3
        )
        .to(
          vLineRefs.current,
          {
            scaleY: 0,
            transformOrigin: "bottom center",
            duration: 0.45,
            stagger: 0.03,
            ease: EASE_EXPO,
          },
          1.3
        )
        .set(stageOverlayRef.current, { autoAlpha: 0 }, 1.72)
        // Phase 4: 6-Part Architectural Curtain Lift (Left-to-Right Wave)
        .to(
          shutterRefs.current,
          {
            yPercent: -102,
            duration: 0.95,
            stagger: 0.055,
            ease: "expo.inOut",
          },
          1.68
        )
        // Trigger Hero & Navbar animations while curtains are rising for seamless handoff
        .call(triggerHeroStart, null, 1.92);

      return () => {
        tl.kill();
        unlockScroll();
      };
    },
    { scope: containerRef }
  );

  if (done) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {/* 6 Architectural Curtain Shutters with 1px Overlap so Zero Seams Show */}
      <div className="grid h-dvh w-full grid-cols-6">
        {SHUTTERS.map((col, idx) => (
          <div key={col} className="relative h-full w-full overflow-visible">
            <div
              ref={(el) => (shutterRefs.current[idx] = el)}
              className="relative -ml-[1px] h-full w-[calc(100%+2px)] bg-cloud will-change-transform"
            >
              <span
                ref={(el) => (vLineRefs.current[idx] = el)}
                className="preloader-init-scale-y absolute top-0 right-0 bottom-0 block w-[1px] bg-ink/12"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Central Architectural Drafting Stage */}
      <div
        ref={stageOverlayRef}
        className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 md:p-16"
      >
        {/* Top Corner Coordinates */}
        <div className="flex items-center justify-between">
          <div className="overflow-hidden">
            <span className="preloader-meta-item preloader-init-y block text-[11px] font-medium tracking-[0.24em] text-ink uppercase">
              {siteConfig.brand.name} · {siteConfig.brand.tagline}
            </span>
          </div>
          <div className="overflow-hidden">
            <span className="preloader-meta-item preloader-init-y block text-[11px] font-light tracking-[0.2em] text-ink-muted uppercase">
              City Centre · Durgapur
            </span>
          </div>
        </div>

        {/* Center Architectural Datum & Word-Split Typography */}
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-4 flex items-baseline justify-between">
            <div className="overflow-hidden">
              <span className="preloader-meta-item preloader-init-y block text-xs font-normal tracking-[0.22em] text-accent uppercase">
                Architectural Residences & Plotted Townships
              </span>
            </div>
          </div>

          {/* Dual-Layer Center Axis Line */}
          <div className="relative h-[1.5px] w-full overflow-hidden">
            <div
              ref={centerLineRef}
              className="preloader-init-scale-x absolute inset-0 bg-ink/20"
            />
            <div
              ref={accentLineRef}
              className="preloader-init-scale-x absolute inset-0 bg-accent"
            />
          </div>

          {/* Main Staggered Words */}
          <div className="mt-6 flex flex-wrap items-baseline gap-x-3.5 gap-y-2 sm:gap-x-5">
            {DISPLAY_WORDS.map((word) => (
              <span key={word} className="word-mask">
                <span className="preloader-word-item preloader-init-y block font-heading text-[clamp(2.25rem,5.5vw,5.25rem)] font-medium leading-[1.06] tracking-tight text-ink">
                  {word}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Architectural Footer Bar */}
        <div className="flex items-center justify-between">
          <div className="overflow-hidden">
            <span className="preloader-meta-item preloader-init-y block text-[11px] font-light tracking-[0.2em] text-ink-muted uppercase">
              Sector 2A · Near Junction Mall
            </span>
          </div>
          <div className="overflow-hidden">
            <span className="preloader-meta-item preloader-init-y block text-[11px] font-normal tracking-[0.2em] text-ink uppercase">
              Paschim Bardhaman, WB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}