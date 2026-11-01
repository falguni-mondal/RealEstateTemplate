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
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const track = trackRef.current;
      if (!track) return;

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
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.04,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Curtain reveal on cards when entering section
      gsap.fromTo(
        ".proj-card-wrap",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.0,
          stagger: 0.1,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      const getScrollDistance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth + 48);

      const tween = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) {
              gsap.set(barRef.current, { scaleX: self.progress });
            }
          },
        },
      });

      // Internal Horizontal Image Parallax during horizontal scroll
      gsap.fromTo(
        ".proj-parallax-img",
        { xPercent: -8, scale: 1.16 },
        {
          xPercent: 8,
          scale: 1.16,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            scrub: true,
          },
        }
      );

      return () => {
        tween.kill();
        split.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="flex h-dvh w-full flex-col justify-between overflow-hidden border-y border-ink/15 bg-cloud py-8 text-ink md:py-12"
    >
      {/* Header inside 100dvh */}
      <div className="page-shell flex flex-wrap items-end justify-between gap-4 pt-12">
        <h2
          ref={headingRef}
          className="font-heading text-[clamp(2.1rem,4.4vw,4.25rem)] font-medium leading-tight text-ink"
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
              className="h-full w-full origin-left scale-x-0 bg-ink"
            />
          </div>
        </div>
      </div>

      {/* Horizontal Pinned Track — Sharp Cards Fitting 100% Inside 100dvh */}
      <div className="my-auto w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-max items-center gap-6 px-4 md:gap-8 md:px-8 lg:px-12 xl:px-16 2xl:px-24"
        >
          {siteConfig.featuredProjects.map((proj) => (
            <article
              key={proj.title}
              className="proj-card-wrap group relative flex h-[64dvh] max-h-[540px] w-[85vw] max-w-[460px] shrink-0 flex-col justify-between overflow-hidden border border-ink/15 bg-white text-ink sm:w-[430px]"
            >
              {/* Top Image with Horizontal Parallax */}
              <div className="relative h-[54%] w-full overflow-hidden bg-cloud">
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
              <div className="flex h-[46%] flex-col justify-between p-6">
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-heading text-2xl font-medium text-ink">
                      {proj.title}
                    </h3>
                    <span className="font-heading text-lg font-semibold text-emerald">
                      {proj.price}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-y border-ink/10 py-2.5 text-sm font-light">
                    <span className="text-ink">{proj.config}</span>
                    <span className="text-ink-muted">{proj.area}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-light text-ink-muted">
                    Possession: <span className="font-normal text-ink">{proj.possession}</span>
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
      <div className="page-shell flex items-center justify-between text-xs font-normal tracking-wider text-ink-muted uppercase">
        <span>City Centre & Bidhannagar, Durgapur</span>
        <span>1, 2, 3 BHK & Residential Plots</span>
      </div>
    </section>
  );
}