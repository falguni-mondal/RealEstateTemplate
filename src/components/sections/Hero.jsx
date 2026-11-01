"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, EASE_EXPO, EASE_OUT } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import DirectionalButton from "@/components/ui/DirectionalButton";
import { siteConfig } from "@/config/siteConfig";
import { ArrowUpRight } from "lucide-react";

export default function Hero() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const imageScrubWrapRef = useRef(null);
  const imageEntranceRef = useRef(null);
  const imgRef = useRef(null);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // 1. Split Heading into Words inside .word-mask (overflow: hidden)
      const wordSplit = new SplitText(titleRef.current, {
        type: "words",
        wordsClass: "word-inner",
      });
      const wordInners = wordSplit.words.map((w) => {
        const mask = document.createElement("span");
        mask.className = "word-mask";
        w.parentNode.insertBefore(mask, w);
        mask.appendChild(w);
        return w;
      });

      // 2. Split Subtitle into Lines inside .line-mask (overflow: hidden)
      const lineSplit = new SplitText(subtitleRef.current, {
        type: "lines",
        linesClass: "line-inner",
      });
      const lineInners = lineSplit.lines.map((l) => {
        const mask = document.createElement("span");
        mask.className = "line-mask";
        l.parentNode.insertBefore(mask, l);
        mask.appendChild(l);
        return l;
      });

      // Hold Hero elements in pre-reveal state until Preloader curtains start parting
      gsap.set(wordInners, { yPercent: 120 });
      gsap.set(lineInners, { yPercent: 120 });
      gsap.set(".hero-cta-inner", { yPercent: 120 });
      gsap.set(".hero-stat-inner", { yPercent: 120 });
      gsap.set(imageEntranceRef.current, { clipPath: "inset(100% 0% 0% 0%)" });

      const heroIntroTl = gsap.timeline({ paused: true });

      heroIntroTl
        .to(
          wordInners,
          {
            yPercent: 0,
            duration: 1.0,
            stagger: 0.035,
            ease: EASE_EXPO,
          },
          0
        )
        .to(
          lineInners,
          {
            yPercent: 0,
            duration: 0.9,
            stagger: 0.065,
            ease: EASE_EXPO,
          },
          0.12
        )
        .to(
          ".hero-cta-inner",
          {
            yPercent: 0,
            duration: 0.9,
            ease: EASE_EXPO,
          },
          0.2
        )
        .to(
          imageEntranceRef.current,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.25,
            ease: EASE_EXPO,
          },
          0.1
        )
        .fromTo(
          imgRef.current,
          { scale: 1.22 },
          {
            scale: 1.08,
            duration: 1.45,
            ease: EASE_OUT,
          },
          0.1
        )
        .to(
          ".hero-stat-inner",
          {
            yPercent: 0,
            duration: 0.85,
            stagger: 0.08,
            ease: EASE_EXPO,
          },
          0.4
        );

      const startHeroAnimation = () => {
        heroIntroTl.play();
      };

      if (typeof window !== "undefined" && window.__preloaderDone) {
        startHeroAnimation();
      } else {
        window.addEventListener("preloader:start-hero", startHeroAnimation, {
          once: true,
        });
      }

      // 3. Non-Conflicting Scroll-Scrubbed Curtain Expansion (Starts at scrollY = 0)
      gsap.fromTo(
        imageScrubWrapRef.current,
        { clipPath: "inset(0% 5% 0% 5%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=300",
            scrub: true,
          },
        }
      );

      // 4. Vertical Parallax Scrub on Hero Image
      gsap.fromTo(
        imgRef.current,
        { yPercent: -6 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: imageScrubWrapRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      return () => {
        window.removeEventListener("preloader:start-hero", startHeroAnimation);
        heroIntroTl.kill();
        wordSplit.revert();
        lineSplit.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="top"
      ref={sectionRef}
      className="bg-white pt-32 pb-20 sm:pt-36 md:pt-40 md:pb-28"
    >
      <div className="page-shell">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h1
              ref={titleRef}
              className="font-heading text-[clamp(2.65rem,5.8vw,6rem)] font-medium leading-[1.08] tracking-tight text-ink"
            >
              {siteConfig.hero.title}
            </h1>
          </div>

          <div className="flex flex-col justify-between space-y-6 lg:col-span-4">
            <p
              ref={subtitleRef}
              className="text-base font-light leading-relaxed text-ink-muted md:text-lg"
            >
              {siteConfig.hero.subtitle}
            </p>

            <div className="overflow-hidden pt-1">
              <div className="hero-cta-inner flex flex-wrap items-center gap-3">
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
                  href="#projects"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("#projects");
                  }}
                >
                  Explore Projects
                </DirectionalButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Outer Wrapper: Scroll-Scrubbed Horizontal Expansion */}
      <div className="mt-14 md:mt-18">
        <div
          ref={imageScrubWrapRef}
          style={{ clipPath: "inset(0% 5% 0% 5%)" }}
          className="relative h-[60dvh] w-full overflow-hidden md:h-[78dvh]"
        >
          {/* Inner Wrapper: Post-Preloader Vertical Curtain Entrance */}
          <div
            ref={imageEntranceRef}
            className="relative h-full w-full overflow-hidden bg-cloud"
          >
            <img
              ref={imgRef}
              src={siteConfig.hero.bgImage}
              alt="Aurelia Greens Durgapur modern apartment facade"
              className="h-[118%] w-full object-cover will-change-transform"
            />

            <div className="page-shell absolute inset-x-0 bottom-6 md:bottom-10">
              <div className="grid grid-cols-1 border border-ink/15 bg-white/95 backdrop-blur-md sm:grid-cols-3">
                {siteConfig.hero.stats.map((st) => (
                  <div
                    key={st.label}
                    className="overflow-hidden border-b border-ink/15 p-5 last:border-b-0 sm:border-r sm:border-b-0 sm:p-6 sm:last:border-r-0"
                  >
                    <div className="hero-stat-inner">
                      <span className="block text-xs font-normal tracking-wider text-ink-muted uppercase">
                        {st.label}
                      </span>
                      <span className="mt-1 block font-heading text-2xl font-medium text-ink md:text-4xl">
                        {st.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}