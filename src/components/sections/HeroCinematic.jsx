"use client";

import { useRef } from "react";
import { gsap, useGSAP, EASE_EXPO, revealWords, revealLines } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import DirectionalButton from "@/components/ui/DirectionalButton";
import { siteConfig } from "@/config/siteConfig";
import { ArrowUpRight, Play } from "lucide-react";

export default function HeroCinematic() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const mediaFrameRef = useRef(null);
  const videoRef = useRef(null);
  const floatCardRef = useRef(null);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // 1. Word-by-word Y-axis overflow-hidden reveal on Heading
      const cleanupWords = revealWords(headingRef.current, {
        trigger: sectionRef.current,
        start: "top 80%",
        stagger: 0.035,
        duration: 0.95,
      });

      // 2. Line-by-line Y-axis overflow-hidden reveal on Body Subtitle
      const cleanupLines = revealLines(subRef.current, {
        trigger: sectionRef.current,
        start: "top 78%",
        delay: 0.12,
        stagger: 0.065,
        duration: 0.9,
      });

      gsap.fromTo(
        ".cinematic-cta-inner",
        { yPercent: 118 },
        {
          yPercent: 0,
          duration: 0.9,
          delay: 0.22,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 76%",
            toggleActions: "play none none none",
          },
        }
      );

      // 3. Curtain reveal on video frame
      gsap.fromTo(
        mediaFrameRef.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.25,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: mediaFrameRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // 4. Video Parallax + Differential Scroll Speed on Overlapping Spec Box
      gsap.fromTo(
        videoRef.current,
        { scale: 1.18, yPercent: -10 },
        {
          scale: 1,
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: mediaFrameRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        floatCardRef.current,
        { y: 70 },
        {
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
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
      className="border-t border-ink/15 bg-cloud py-24 text-ink sm:py-28 md:py-36"
    >
      <div className="page-shell">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h2
              ref={headingRef}
              className="font-heading text-[clamp(2.4rem,5.2vw,5.25rem)] font-medium leading-[1.07] tracking-tight text-ink"
            >
              {siteConfig.heroAlternative.title}
            </h2>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <p
              ref={subRef}
              className="text-base font-light leading-relaxed text-ink-muted md:text-lg"
            >
              {siteConfig.heroAlternative.subtitle}
            </p>

            <div className="overflow-hidden pt-1">
              <div className="cinematic-cta-inner flex flex-wrap items-center gap-3">
                <DirectionalButton
                  href="#site-visit"
                  variant="dark"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("#site-visit");
                  }}
                >
                  Book a Site Visit
                  <ArrowUpRight className="h-4 w-4" />
                </DirectionalButton>

                <DirectionalButton
                  href="#gallery"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("#gallery");
                  }}
                >
                  <Play className="h-4 w-4 fill-current text-accent" />
                  Watch Tour
                </DirectionalButton>
              </div>
            </div>
          </div>
        </div>

        {/* Unwashed Framed Video & Image Showcase with Scroll-Speed Floating Bar */}
        <div className="relative mt-14 md:mt-18">
          <div
            ref={mediaFrameRef}
            className="relative h-[54dvh] w-full overflow-hidden border border-ink/15 bg-white md:h-[70dvh]"
          >
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              poster={siteConfig.heroAlternative.fallbackImage}
              className="h-[120%] w-full object-cover will-change-transform"
            >
              <source src={siteConfig.heroAlternative.videoUrl} type="video/mp4" />
            </video>
          </div>

          <div
            ref={floatCardRef}
            className="relative z-10 mx-auto -mt-12 grid max-w-5xl grid-cols-1 border border-ink/15 bg-white shadow-xl sm:grid-cols-3 md:-mt-16"
          >
            {siteConfig.heroAlternative.highlights.map((item) => (
              <div
                key={item.label}
                className="border-b border-ink/15 p-6 last:border-b-0 sm:border-r sm:border-b-0 sm:p-8 sm:last:border-r-0"
              >
                <span className="text-xs font-normal tracking-wider text-ink-muted uppercase">
                  {item.label}
                </span>
                <p className="mt-1 font-heading text-2xl font-medium text-ink md:text-3xl">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}