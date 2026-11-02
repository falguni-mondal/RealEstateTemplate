"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, EASE_EXPO } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { siteConfig } from "@/config/siteConfig";
import { MapPin, ArrowUpRight } from "lucide-react";

const badgeColors = {
  "Ready to Move": "bg-emerald text-white",
  "Under Construction": "bg-accent text-white",
  Upcoming: "bg-ink text-white",
};

export default function FeaturedProjects() {
  const pinWrapRef = useRef(null);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const pinWrap = pinWrapRef.current;
      const track = trackRef.current;
      if (!pinWrap || !track) return;

      const split = new SplitText(headingRef.current, {
        type: "words",
        wordsClass: "word-inner",
      });
      const words = split.words.map((w) => {
        const mask = document.createElement("span");
        mask.className = "word-mask";
        w.parentNode.insertBefore(mask, w);
        mask.appendChild(w);
        return w;
      });

      gsap.fromTo(
        words,
        { yPercent: 118 },
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.04,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: pinWrap,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );

      const getScrollDistance = () =>
        Math.max(0, track.scrollWidth - document.documentElement.clientWidth);

      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrap,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          pin: sectionRef.current,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) {
              gsap.set(barRef.current, { scaleX: self.progress });
            }
          },
        },
      });

      pinTl
        .to(
          track,
          {
            x: () => -getScrollDistance(),
            ease: "none",
          },
          0
        )
        .fromTo(
          ".proj-parallax-img",
          { xPercent: -7, scale: 1.15 },
          {
            xPercent: 7,
            scale: 1.15,
            ease: "none",
          },
          0
        );

      return () => {
        pinTl.kill();
        split.revert();
      };
    },
    { scope: pinWrapRef }
  );

  return (
    <div id="projects" ref={pinWrapRef} className="w-full">
      <section
        ref={sectionRef}
        className="flex h-svh w-full flex-col justify-between overflow-hidden border-y border-ink/15 bg-cloud pt-20 pb-6 text-ink md:pt-24 md:pb-8"
      >
        {/* Top Header */}
        <div className="page-shell shrink-0 flex flex-wrap items-end justify-between gap-4">
          <h2
            ref={headingRef}
            className="font-heading text-[clamp(2rem,4.2vw,4rem)] font-medium leading-tight text-ink"
          >
            Featured Homes & Land Plots
          </h2>

          <div className="flex items-center gap-4">
            <span className="text-xs font-normal tracking-wider text-ink-muted uppercase">
              Scroll to pan
            </span>
            <div className="h-1 w-28 overflow-hidden bg-ink/15 md:w-44">
              <div
                ref={barRef}
                className="h-full w-full origin-left scale-x-0 bg-ink will-change-transform"
              />
            </div>
          </div>
        </div>

        {/* Middle Track Area — flex-1 min-h-0 guarantees cards never overflow 100svh */}
        <div className="flex min-h-0 w-full flex-1 items-center overflow-hidden py-4 md:py-6">
          <div
            ref={trackRef}
            className="flex h-full max-h-[500px] w-max items-stretch gap-6 px-4 will-change-transform md:gap-8 md:px-8 lg:px-12 xl:px-16 2xl:px-24"
          >
            {siteConfig.featuredProjects.map((proj) => (
              <article
                key={proj.title}
                className="group relative flex h-full w-[84vw] max-w-[440px] shrink-0 flex-col justify-between overflow-hidden border border-ink/15 bg-white text-ink sm:w-[400px] md:w-[430px]"
              >
                {/* Top Image with Horizontal Parallax */}
                <div className="relative h-[53%] w-full shrink-0 overflow-hidden bg-cloud">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="proj-parallax-img h-full w-full object-cover will-change-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wider ${
                        badgeColors[proj.status]
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs font-normal text-white">
                    <MapPin className="h-3.5 w-3.5 text-accent" />
                    {proj.location}
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex h-[47%] flex-col justify-between p-5 md:p-6">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-heading text-xl font-medium text-ink md:text-2xl">
                        {proj.title}
                      </h3>
                      <span className="font-heading text-base font-semibold text-emerald md:text-lg">
                        {proj.price}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between border-y border-ink/10 py-2 text-xs font-light md:text-sm">
                      <span className="text-ink">{proj.config}</span>
                      <span className="text-ink-muted">{proj.area}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-light text-ink-muted">
                      Possession:{" "}
                      <span className="font-normal text-ink">
                        {proj.possession}
                      </span>
                    </span>

                    <a
                      href="#site-visit"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollTo("#site-visit");
                      }}
                      className="inline-flex h-10 cursor-pointer items-center gap-1.5 bg-ink px-5 text-xs font-medium text-white transition hover:bg-accent"
                    >
                      Book Visit
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Bottom Footnote */}
        <div className="page-shell shrink-0 flex items-center justify-between text-xs font-normal tracking-wider text-ink-muted uppercase">
          <span>City Centre & Bidhannagar, Durgapur</span>
          <span>1, 2, 3 BHK & Residential Plots</span>
        </div>
      </section>
    </div>
  );
}