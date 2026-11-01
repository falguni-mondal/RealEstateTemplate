"use client";

import { useState, useEffect, useRef } from "react";
import { gsap, useGSAP, EASE_EXPO } from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { siteConfig } from "@/config/siteConfig";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function GalleryLightbox() {
  const sectionRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(null);
  const { lockScroll, unlockScroll } = useSmoothScroll();
  const items = siteConfig.gallery;

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Curtain reveal on each gallery frame
      gsap.fromTo(
        ".gallery-item",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.05,
          stagger: 0.1,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: ".gallery-grid",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Image Parallax inside each frame
      gsap.utils.toArray(".gallery-parallax-img").forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.18, yPercent: -10 },
          {
            scale: 1,
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      // Scroll-Speed Manipulation on Alternate Columns (Desktop)
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.to(".gallery-speed-fast", {
          y: -36,
          ease: "none",
          scrollTrigger: {
            trigger: ".gallery-grid",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  useEffect(() => {
    if (activeIdx === null) return;
    lockScroll();
    const onKey = (e) => {
      if (e.key === "Escape") setActiveIdx(null);
      if (e.key === "ArrowRight") setActiveIdx((i) => (i + 1) % items.length);
      if (e.key === "ArrowLeft")
        setActiveIdx((i) => (i - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [activeIdx, items.length, lockScroll, unlockScroll]);

  return (
    <section id="gallery" ref={sectionRef} className="bg-white py-20 md:py-32">
      <div className="page-shell">
        <SectionHeading
          title="Take a closer look inside Aurelia Greens."
          subtitle="Click any photo or video below to view in full screen."
        />

        <div className="gallery-grid mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`gallery-item group relative aspect-16/11 w-full cursor-pointer overflow-hidden border border-ink/15 bg-cloud text-left ${
                idx % 3 === 1 ? "gallery-speed-fast" : ""
              }`}
            >
              <img
                src={item.src}
                alt={item.title}
                className="gallery-parallax-img h-[120%] w-full object-cover will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center bg-white text-ink transition-transform group-hover:scale-110">
                    <Play className="h-5 w-5 fill-current" />
                  </span>
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 bg-white/95 p-3.5 text-ink backdrop-blur-xs">
                <span className="text-[10px] font-medium tracking-wider text-accent uppercase">
                  {item.category}
                </span>
                <p className="mt-0.5 font-heading text-base font-medium">
                  {item.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Light-Theme Fullscreen Lightbox */}
      {activeIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          data-lenis-prevent
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 p-4 backdrop-blur-md"
        >
          <button
            type="button"
            onClick={() => setActiveIdx(null)}
            className="absolute top-6 right-6 flex h-12 w-12 cursor-pointer items-center justify-center border border-ink/20 bg-white text-ink hover:bg-ink hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveIdx((activeIdx - 1 + items.length) % items.length)
            }
            className="absolute left-4 flex h-12 w-12 cursor-pointer items-center justify-center border border-ink/20 bg-white text-ink hover:bg-ink hover:text-white md:left-8"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="w-full max-w-5xl">
            <div className="overflow-hidden border border-ink/15 bg-cloud">
              <img
                src={items[activeIdx].src}
                alt={items[activeIdx].title}
                className="max-h-[78dvh] w-full object-cover"
              />
            </div>
            <div className="mt-4 flex justify-between text-sm font-normal text-ink">
              <span>{items[activeIdx].title}</span>
              <span>
                {activeIdx + 1} / {items.length}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveIdx((activeIdx + 1) % items.length)}
            className="absolute right-4 flex h-12 w-12 cursor-pointer items-center justify-center border border-ink/20 bg-white text-ink hover:bg-ink hover:text-white md:right-8"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </section>
  );
}