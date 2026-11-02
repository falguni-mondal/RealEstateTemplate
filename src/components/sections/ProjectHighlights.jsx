"use client";

import { useRef } from "react";
import { gsap, useGSAP, EASE_EXPO, revealWords, revealLines } from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/siteConfig";

export default function ProjectHighlights() {
  const sectionRef = useRef(null);
  const progressRef = useRef(null);
  const mainImgWrapRef = useRef(null);
  const mainImgParallaxRef = useRef(null);
  const floatImgWrapRef = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const cleanupTitles = revealWords(".highlight-val-word", {
        trigger: ".highlights-grid",
        start: "top 85%",
        stagger: 0.03,
        duration: 0.9,
      });

      const cleanupBodyLines = revealLines(".highlight-body-line", {
        trigger: ".highlights-grid",
        start: "top 84%",
        delay: 0.1,
        stagger: 0.055,
        duration: 0.85,
      });

      gsap.fromTo(
        [mainImgWrapRef.current, floatImgWrapRef.current],
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.15,
          stagger: 0.18,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: ".construction-showcase",
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        mainImgParallaxRef.current,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: ".construction-showcase",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        floatImgWrapRef.current,
        { y: 125 },
        {
          y: -125,
          ease: "none",
          scrollTrigger: {
            trigger: ".construction-showcase",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        }
      );

      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        {
          scaleX: 0.75,
          ease: "none",
          scrollTrigger: {
            trigger: ".construction-box",
            start: "top 88%",
            end: "bottom 55%",
            scrub: true,
          },
        }
      );

      const cleanupStages = revealLines(".stage-body-line", {
        trigger: ".construction-box",
        start: "top 85%",
        stagger: 0.05,
        duration: 0.85,
      });

      return () => {
        cleanupTitles();
        cleanupBodyLines();
        cleanupStages();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section id="highlights" ref={sectionRef} className="bg-white py-24 sm:py-28 md:py-36">
      <div className="page-shell">
        <SectionHeading
          title="Key project details at a glance."
          subtitle="Clear facts on pricing, land area, and current construction status at City Centre, Durgapur."
        />

        {/* Compact, Proportionate Swiss Hairline Grid */}
        <div className="highlights-grid mt-14 grid grid-cols-1 border-t border-l border-ink/15 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.highlights.map((item) => (
            <div
              key={item.label}
              className="group relative flex flex-col justify-between border-r border-b border-ink/15 bg-white p-6 transition-colors hover:bg-cloud md:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="highlight-body-line text-[11px] font-normal tracking-widest text-ink-muted uppercase">
                  {item.label}
                </span>
                <span className="h-1.5 w-1.5 bg-accent transition-transform duration-300 group-hover:scale-150" />
              </div>
              <p className="highlight-val-word mt-5 font-heading text-xl font-medium text-ink md:text-2xl">
                {item.value}
              </p>
              <p className="highlight-body-line mt-1.5 text-xs font-light leading-relaxed text-ink-muted md:text-sm">
                {item.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Architectural Dual-Image Parallax & Live Construction Tracker */}
        <div className="construction-showcase mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="relative pb-12 lg:col-span-5 lg:pb-0">
            <div
              ref={mainImgWrapRef}
              className="relative aspect-4/5 w-[84%] overflow-hidden border border-ink/15 bg-cloud"
            >
              <div
                ref={mainImgParallaxRef}
                className="relative -top-[14%] h-[128%] w-full will-change-transform"
              >
                <img
                  src={siteConfig.highlightsMedia.mainImage}
                  alt="Aurelia Durgapur structural tower progress"
                  className="h-full w-full scale-105 object-cover"
                />
              </div>
            </div>

            <div
              ref={floatImgWrapRef}
              className="absolute right-0 -bottom-4 z-10 w-[56%] overflow-hidden border-2 border-white bg-cloud shadow-2xl will-change-transform lg:bottom-8"
            >
              <div className="aspect-4/3 w-full overflow-hidden">
                <img
                  src={siteConfig.highlightsMedia.secondaryImage}
                  alt="Sample flat interior finish"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="border-t border-ink/15 bg-white p-3.5">
                <span className="block text-[10px] font-medium tracking-wider text-accent uppercase">
                  On-Schedule Structure
                </span>
                <p className="mt-0.5 text-xs font-light text-ink">
                  {siteConfig.highlightsMedia.caption}
                </p>
              </div>
            </div>
          </div>

          <div className="construction-box border border-ink/15 bg-cloud p-8 md:p-12 lg:col-span-7">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <span className="block text-xs font-normal tracking-widest text-accent uppercase">
                  Verified Site Progress
                </span>
                <h3 className="mt-1 font-heading text-xl font-medium text-ink md:text-2xl">
                  Live Construction Status — Q4 2026
                </h3>
              </div>
              <span className="border border-emerald/30 bg-white px-4 py-1.5 text-xs font-medium tracking-wider text-emerald uppercase">
                75% Structure Completed
              </span>
            </div>

            <div className="my-8 h-2.5 w-full overflow-hidden bg-white">
              <div
                ref={progressRef}
                className="h-full w-full origin-left bg-ink"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
              {siteConfig.constructionStages.map((s) => (
                <div
                  key={s.stage}
                  className="border-l-2 border-accent bg-white p-4"
                >
                  <span className="stage-body-line block font-heading text-sm font-medium text-ink md:text-base">
                    {s.status}
                  </span>
                  <span className="stage-body-line mt-1 block text-xs font-light text-ink-muted">
                    {s.stage}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}