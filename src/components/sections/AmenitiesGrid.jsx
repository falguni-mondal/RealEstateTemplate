"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP, EASE_EXPO, EASE_OUT, revealWords, revealLines } from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/siteConfig";
import { ArrowUpRight } from "lucide-react";

export default function AmenitiesGrid() {
  const sectionRef = useRef(null);
  const listRef = useRef(null);
  const floatRef = useRef(null);
  const layerRefs = useRef([]);
  const imgRefs = useRef([]);

  const xToRef = useRef(null);
  const yToRef = useRef(null);
  const pointerPos = useRef({ x: 0, y: 0, hasCoordinates: false });
  const isInsideRef = useRef(false);
  const activeIdxRef = useRef(0);
  const zCounterRef = useRef(10);

  const { contextSafe } = useGSAP({ scope: sectionRef });

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const cleanupTitles = revealWords(".amenity-title-word", {
        trigger: listRef.current,
        start: "top 85%",
        stagger: 0.025,
        duration: 0.9,
      });

      const cleanupLines = revealLines(".amenity-desc-line", {
        trigger: listRef.current,
        start: "top 84%",
        delay: 0.08,
        stagger: 0.055,
        duration: 0.85,
      });

      layerRefs.current.forEach((layer, i) => {
        if (!layer) return;
        gsap.set(layer, {
          zIndex: i === 0 ? 10 : 1,
          clipPath: "inset(0% 0% 0% 0%)",
        });
      });

      if (floatRef.current) {
        xToRef.current = gsap.quickTo(floatRef.current, "x", {
          duration: 0.35,
          ease: EASE_OUT,
        });
        yToRef.current = gsap.quickTo(floatRef.current, "y", {
          duration: 0.35,
          ease: EASE_OUT,
        });
      }

      return () => {
        cleanupTitles();
        cleanupLines();
      };
    },
    { scope: sectionRef }
  );

  const triggerImageCurtainSwitch = contextSafe((nextIdx) => {
    if (nextIdx === activeIdxRef.current) return;
    activeIdxRef.current = nextIdx;
    zCounterRef.current += 1;

    const nextLayer = layerRefs.current[nextIdx];
    const nextImg = imgRefs.current[nextIdx];
    if (!nextLayer || !nextImg) return;

    gsap.killTweensOf([nextLayer, nextImg]);

    gsap.set(nextLayer, {
      zIndex: zCounterRef.current,
      clipPath: "inset(100% 0% 0% 0%)",
    });

    gsap.to(nextLayer, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.65,
      ease: EASE_EXPO,
      overwrite: "auto",
    });

    gsap.fromTo(
      nextImg,
      { scale: 1.22, yPercent: 10 },
      {
        scale: 1,
        yPercent: 0,
        duration: 0.8,
        ease: EASE_OUT,
        overwrite: "auto",
      }
    );
  });

  const showFloatingPreview = contextSafe((clientX, clientY) => {
    if (!floatRef.current || window.innerWidth < 1024) return;
    const targetX = clientX - 180;
    const targetY = clientY - 125;

    if (!isInsideRef.current) {
      isInsideRef.current = true;
      gsap.set(floatRef.current, { x: targetX, y: targetY });
      xToRef.current = gsap.quickTo(floatRef.current, "x", {
        duration: 0.35,
        ease: EASE_OUT,
      });
      yToRef.current = gsap.quickTo(floatRef.current, "y", {
        duration: 0.35,
        ease: EASE_OUT,
      });
      gsap.fromTo(
        floatRef.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.55,
          ease: EASE_EXPO,
          overwrite: "auto",
        }
      );
    } else {
      xToRef.current?.(targetX);
      yToRef.current?.(targetY);
    }
  });

  const hideFloatingPreview = contextSafe(() => {
    if (!isInsideRef.current || !floatRef.current) return;
    isInsideRef.current = false;
    gsap.to(floatRef.current, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 0.4,
      ease: EASE_EXPO,
      overwrite: "auto",
    });
  });

  useEffect(() => {
    const onGlobalMouseMove = (e) => {
      pointerPos.current = {
        x: e.clientX,
        y: e.clientY,
        hasCoordinates: true,
      };
    };

    const onWindowScroll = () => {
      if (
        !pointerPos.current.hasCoordinates ||
        !listRef.current ||
        window.innerWidth < 1024
      ) {
        return;
      }

      const { x, y } = pointerPos.current;
      const rect = listRef.current.getBoundingClientRect();
      const insideBounds =
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

      if (!insideBounds) {
        hideFloatingPreview();
        return;
      }

      showFloatingPreview(x, y);
      const elUnderMouse = document.elementFromPoint(x, y);
      const row = elUnderMouse?.closest("[data-amenity-idx]");
      if (row) {
        const idx = Number(row.getAttribute("data-amenity-idx"));
        if (!Number.isNaN(idx)) {
          triggerImageCurtainSwitch(idx);
        }
      }
    };

    window.addEventListener("mousemove", onGlobalMouseMove, { passive: true });
    window.addEventListener("scroll", onWindowScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onGlobalMouseMove);
      window.removeEventListener("scroll", onWindowScroll);
    };
  }, []);

  return (
    <section
      id="amenities"
      ref={sectionRef}
      className="relative bg-white py-24 text-ink sm:py-28 md:py-36"
    >
      <div className="page-shell">
        <SectionHeading
          title="Spaces built for fitness, family time, and peace of mind."
          subtitle="Everything your family needs inside a secure, green gated community."
        />

        <div
          ref={listRef}
          onPointerMove={(e) => {
            pointerPos.current = {
              x: e.clientX,
              y: e.clientY,
              hasCoordinates: true,
            };
            showFloatingPreview(e.clientX, e.clientY);
          }}
          onPointerLeave={hideFloatingPreview}
          className="mt-14 divide-y divide-ink/15 border-y border-ink/15 sm:mt-16"
        >
          {siteConfig.amenities.map((item, idx) => (
            <div
              key={item.title}
              data-amenity-idx={idx}
              onPointerEnter={() => triggerImageCurtainSwitch(idx)}
              className="group py-8 transition-colors hover:bg-cloud md:px-6"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h3 className="amenity-title-word font-heading text-2xl font-medium text-ink transition-transform duration-300 group-hover:translate-x-2 md:text-4xl">
                    {item.title}
                  </h3>
                  <p className="amenity-desc-line mt-2 text-sm font-light text-ink-muted md:text-base">
                    {item.desc}
                  </p>
                </div>

                {/* Mobile Inline Image */}
                <div className="relative h-52 w-full overflow-hidden border border-ink/15 lg:hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="hidden items-center gap-4 lg:flex">
                  <span className="border border-ink/20 bg-white px-4 py-1.5 text-xs font-normal tracking-wider text-ink uppercase">
                    {item.category}
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-accent transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pre-Mounted Multi-Layer Curtain Preview */}
      <div
        ref={floatRef}
        style={{ clipPath: "inset(100% 0% 0% 0%)" }}
        className="pointer-events-none fixed top-0 left-0 z-30 hidden h-64 w-96 overflow-hidden border border-ink/20 bg-cloud shadow-2xl will-change-transform lg:block"
      >
        {siteConfig.amenities.map((item, idx) => (
          <div
            key={item.title}
            ref={(el) => (layerRefs.current[idx] = el)}
            className="absolute inset-0 overflow-hidden bg-cloud will-change-[clip-path]"
          >
            <img
              ref={(el) => (imgRefs.current[idx] = el)}
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover will-change-transform"
            />
          </div>
        ))}
      </div>
    </section>
  );
}