"use client";

import { useRef } from "react";
import { gsap, useGSAP, EASE_EXPO, revealWords, revealLines } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import DirectionalButton from "@/components/ui/DirectionalButton";
import { siteConfig } from "@/config/siteConfig";
import { ArrowUpRight, Compass } from "lucide-react";

export default function HeroParallaxBg() {
  const sectionRef = useRef(null);
  const bgWrapRef = useRef(null);
  const stageRef = useRef(null);
  const ledgerRef = useRef(null);
  const titleRef = useRef(null);
  const bodyRef = useRef(null);
  const topRuleRef = useRef(null);
  const bottomRuleRef = useRef(null);
  const vertRuleRef = useRef(null);

  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // 1. True Full-Bleed Background Parallax Scrub (Centered buffer)
      gsap.fromTo(
        bgWrapRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // 2. Differential Scroll Speed on Main Stage vs Bottom Ledger
      gsap.fromTo(
        stageRef.current,
        { y: 40 },
        {
          y: -35,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );

      gsap.fromTo(
        ledgerRef.current,
        { y: 20 },
        {
          y: -15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        }
      );

      // 3. Architectural Hairline Rules Drawing in on ScrollTrigger
      gsap.fromTo(
        [topRuleRef.current, bottomRuleRef.current],
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1.25,
          stagger: 0.15,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      if (vertRuleRef.current) {
        gsap.fromTo(
          vertRuleRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            duration: 1.15,
            delay: 0.15,
            ease: EASE_EXPO,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 4. Word-by-word Y-axis overflow-hidden stagger on Main Display Heading
      const cleanupWords = revealWords(titleRef.current, {
        trigger: sectionRef.current,
        start: "top 72%",
        stagger: 0.038,
        duration: 1.0,
      });

      // 5. Line-by-line Y-axis overflow-hidden stagger on Body Text
      const cleanupLines = revealLines(bodyRef.current, {
        trigger: sectionRef.current,
        start: "top 70%",
        delay: 0.14,
        stagger: 0.065,
        duration: 0.9,
      });

      // 6. Y-axis Mask Reveal on Top Coordinates, CTAs & Bottom Ledger Metrics
      gsap.fromTo(
        ".overlay-mask-item",
        { yPercent: 120 },
        {
          yPercent: 0,
          duration: 0.95,
          stagger: 0.07,
          delay: 0.1,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 74%",
            toggleActions: "play none none none",
          },
        }
      );

      return () => {
        cleanupWords();
        cleanupLines();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh w-full flex-col justify-between overflow-hidden py-16 text-white sm:py-20 md:py-24"
    >
      {/* Full-Screen Parallax Image Background + Rich Black-Tinted Architectural Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          ref={bgWrapRef}
          className="relative -top-[12%] h-[124%] w-full will-change-transform"
        >
          <img
            src={siteConfig.heroParallax.bgImage}
            alt="Aurelia Durgapur evening architectural residence"
            className="h-full w-full scale-105 object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/35 to-black/85" />
      </div>

      {/* 1. TOP ARCHITECTURAL HORIZON BAR (Directly on Overlay) */}
      <div className="page-shell relative z-10 w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5">
          <div className="overflow-hidden">
            <span className="overlay-mask-item inline-flex items-center gap-2 text-xs font-normal tracking-[0.22em] text-white/80 uppercase">
              <Compass className="h-4 w-4 text-accent" />
              City Centre · Sector 2A, Durgapur
            </span>
          </div>

          <div className="overflow-hidden">
            <span className="overlay-mask-item block text-xs font-light tracking-[0.2em] text-white/70 uppercase">
              23.5404° N, 87.2710° E · Integrated Gated Township
            </span>
          </div>
        </div>
        <div
          ref={topRuleRef}
          className="h-[1px] w-full bg-white/25 will-change-transform"
        />
      </div>

      {/* 2. CENTER ASYMMETRIC ARCHITECTURAL STAGE (Directly on Overlay, No Box) */}
      <div
        ref={stageRef}
        className="page-shell relative z-10 my-auto w-full py-12 will-change-transform md:py-20"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          {/* Left 8 Cols: Massive Editorial Heading */}
          <div className="lg:col-span-8 lg:pr-8">
            <h2
              ref={titleRef}
              className="font-heading text-[clamp(2.65rem,5.6vw,5.75rem)] font-medium leading-[1.06] tracking-tight text-white"
            >
              {siteConfig.heroParallax.title}
            </h2>
          </div>

          {/* Right 4 Cols: Architectural Vertical Hairline + Line-Split Copy & CTAs */}
          <div className="relative lg:col-span-4 lg:pl-10">
            <span
              ref={vertRuleRef}
              className="pointer-events-none absolute top-0 bottom-0 left-0 hidden w-[1px] bg-white/25 will-change-transform lg:block"
            />

            <p
              ref={bodyRef}
              className="text-base font-light leading-relaxed text-white/80 md:text-lg"
            >
              {siteConfig.heroParallax.subtitle}
            </p>

            <div className="mt-8 overflow-hidden pt-1">
              <div className="overlay-mask-item flex flex-wrap items-center gap-3">
                <DirectionalButton
                  href="#site-visit"
                  variant="accent"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("#site-visit");
                  }}
                >
                  Book a Site Visit
                  <ArrowUpRight className="h-4 w-4" />
                </DirectionalButton>

                <DirectionalButton
                  href="#floor-plans"
                  variant="glass"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("#floor-plans");
                  }}
                >
                  View Floor Plans
                </DirectionalButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ARCHITECTURAL LEDGER (Directly on Overlay) */}
      <div
        ref={ledgerRef}
        className="page-shell relative z-10 w-full will-change-transform"
      >
        <div
          ref={bottomRuleRef}
          className="h-[1px] w-full bg-white/25 will-change-transform"
        />

        <div className="grid grid-cols-1 pt-6 sm:grid-cols-3 sm:pt-8">
          {siteConfig.heroParallax.metrics.map((m) => (
            <div
              key={m.label}
              className="overflow-hidden border-b border-white/15 py-4 first:pt-0 last:border-b-0 last:pb-0 sm:border-r sm:border-b-0 sm:px-8 sm:py-0 sm:first:pl-0 sm:last:border-r-0"
            >
              <div className="overlay-mask-item">
                <span className="block text-xs font-normal tracking-[0.18em] text-white/60 uppercase">
                  {m.label}
                </span>
                <span className="mt-1.5 block font-heading text-3xl font-medium tracking-tight text-white md:text-4xl">
                  {m.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}