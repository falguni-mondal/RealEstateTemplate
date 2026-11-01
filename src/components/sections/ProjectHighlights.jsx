"use client";

import { useRef } from "react";
import { gsap, useGSAP, EASE_EXPO, revealWords, revealLines } from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/siteConfig";

export default function ProjectHighlights() {
  const sectionRef = useRef(null);
  const progressRef = useRef(null);

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

        {/* Sharp Swiss Hairline Grid */}
        <div className="highlights-grid mt-14 grid grid-cols-1 border-t border-l border-ink/15 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.highlights.map((item) => (
            <div
              key={item.label}
              className="flex flex-col justify-between border-r border-b border-ink/15 bg-white p-8 transition-colors hover:bg-cloud md:p-10"
            >
              <span className="highlight-body-line text-xs font-normal tracking-wider text-ink-muted uppercase">
                {item.label}
              </span>
              <p className="highlight-val-word mt-6 font-heading text-3xl font-medium text-ink md:text-4xl">
                {item.value}
              </p>
              <p className="highlight-body-line mt-2 text-sm font-light text-ink-muted">
                {item.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Construction Status Box */}
        <div className="construction-box mt-12 border border-ink/15 bg-cloud p-8 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-heading text-2xl font-medium text-ink">
              Live Construction Status — Q4 2026
            </h3>
            <span className="text-sm font-medium text-emerald">
              75% Structure Completed
            </span>
          </div>

          <div className="my-6 h-2 w-full overflow-hidden bg-white">
            <div
              ref={progressRef}
              className="h-full w-full origin-left bg-ink"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {siteConfig.constructionStages.map((s) => (
              <div
                key={s.stage}
                className="border-l-2 border-accent pl-3.5"
              >
                <span className="stage-body-line block text-sm font-medium text-ink">
                  {s.status}
                </span>
                <span className="stage-body-line block text-xs font-light text-ink-muted">
                  {s.stage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}