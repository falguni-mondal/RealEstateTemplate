"use client";

import { useRef } from "react";
import { gsap, useGSAP, EASE_EXPO, revealWords, revealLines } from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";
import ElasticLine from "@/components/ui/ElasticLine";
import { siteConfig } from "@/config/siteConfig";

export default function AboutFounder() {
  const sectionRef = useRef(null);
  const curtainRef = useRef(null);
  const photoRef = useRef(null);
  const quoteRef = useRef(null);
  const rightColRef = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // 1. Curtain reveal on ScrollTrigger
      gsap.to(curtainRef.current, {
        scaleY: 0,
        duration: 1.25,
        ease: EASE_EXPO,
        scrollTrigger: {
          trigger: ".about-photo-box",
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      // 2. Image Parallax Scrub
      gsap.fromTo(
        photoRef.current,
        { scale: 1.18, yPercent: -10 },
        {
          scale: 1,
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-photo-box",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // 3. Word-by-word reveal on Founder Quote
      const cleanupQuote = revealWords(quoteRef.current, {
        trigger: quoteRef.current,
        start: "top 88%",
        stagger: 0.022,
        duration: 0.85,
      });

      // 4. Line-by-line Y-axis overflow-hidden reveal on Timeline Body Descriptions
      const cleanupTimelineLines = revealLines(".about-body-line", {
        trigger: ".about-timeline-list",
        start: "top 86%",
        stagger: 0.06,
        duration: 0.85,
      });

      gsap.fromTo(
        ".about-reveal-inner",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: ".about-timeline-list",
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );

      // 5. Selective Differential Scroll Speed Manipulation (Desktop)
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.fromTo(
          rightColRef.current,
          { y: 55 },
          {
            y: -55,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      });

      return () => {
        cleanupQuote();
        cleanupTimelineLines();
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section id="about" ref={sectionRef} className="bg-white py-24 sm:py-28 md:py-36">
      <div className="page-shell">
        <SectionHeading
          title={siteConfig.about.heading}
          subtitle={siteConfig.about.story}
        />

        <div className="mt-14 grid grid-cols-1 gap-12 sm:mt-16 lg:grid-cols-12 lg:items-start">
          <div className="about-photo-box relative aspect-16/11 w-full overflow-hidden border border-ink/15 bg-cloud lg:col-span-7">
            <img
              ref={photoRef}
              src={siteConfig.about.architectureImage}
              alt="Aurelia Durgapur residential courtyard"
              className="h-[120%] w-full object-cover will-change-transform"
            />
            <div
              ref={curtainRef}
              className="pointer-events-none absolute inset-0 origin-bottom bg-cloud"
            />
          </div>

          <div
            ref={rightColRef}
            className="flex flex-col justify-between space-y-8 will-change-transform lg:col-span-5"
          >
            <div className="border border-ink/15 bg-cloud p-8 md:p-10">
              <p
                ref={quoteRef}
                className="font-heading text-xl font-normal leading-relaxed text-ink md:text-2xl"
              >
                “{siteConfig.about.founderQuote}”
              </p>
              <div className="mt-6 overflow-hidden border-t border-ink/10 pt-5">
                <div className="about-reveal-inner flex items-center gap-4">
                  <img
                    src={siteConfig.about.founderImage}
                    alt={siteConfig.about.founderName}
                    className="h-14 w-14 object-cover"
                  />
                  <div>
                    <h3 className="font-heading text-base font-medium text-ink">
                      {siteConfig.about.founderName}
                    </h3>
                    <p className="text-xs font-light text-ink-muted">
                      {siteConfig.about.founderRole}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-timeline-list divide-y divide-ink/15 border-y border-ink/15">
              {siteConfig.about.timeline.map((item) => (
                <div key={item.year} className="py-4">
                  <div className="flex items-baseline justify-between gap-6">
                    <div className="overflow-hidden">
                      <span className="about-reveal-inner block font-heading text-base font-semibold text-accent">
                        {item.year}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="overflow-hidden">
                        <h4 className="about-reveal-inner font-heading text-base font-medium text-ink">
                          {item.title}
                        </h4>
                      </div>
                      <p className="about-body-line mt-1 text-sm font-light text-ink-muted">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ElasticLine className="mt-16" />
      </div>
    </section>
  );
}