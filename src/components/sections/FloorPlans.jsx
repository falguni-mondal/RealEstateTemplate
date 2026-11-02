"use client";

import { useState, useRef, useEffect } from "react";
import { gsap, useGSAP, EASE_EXPO, EASE_OUT } from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";
import DirectionalButton from "@/components/ui/DirectionalButton";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { siteConfig } from "@/config/siteConfig";
import { Check, ArrowUpRight } from "lucide-react";

const keys = Object.keys(siteConfig.floorPlans);

export default function FloorPlans() {
  const sectionRef = useRef(null);
  const tabBarRef = useRef(null);
  const activeBgRef = useRef(null);
  const tabBtnRefs = useRef({});
  const layerRefs = useRef({});
  const imgRefs = useRef({});
  const specPanelRefs = useRef({});

  const [activeKey, setActiveKey] = useState("2 BHK");
  const activeKeyRef = useRef("2 BHK");
  const zCounterRef = useRef(10);

  const { scrollTo } = useSmoothScroll();
  const { contextSafe } = useGSAP({ scope: sectionRef });

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        ".floorplan-box",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.0,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      keys.forEach((k) => {
        const layer = layerRefs.current[k];
        if (!layer) return;
        gsap.set(layer, {
          zIndex: k === "2 BHK" ? 10 : 1,
          clipPath: "inset(0% 0% 0% 0%)",
        });
      });
    },
    { scope: sectionRef }
  );

  const moveTabIndicator = contextSafe((targetKey, immediate = false) => {
    const bar = tabBarRef.current;
    const btn = tabBtnRefs.current[targetKey];
    const bg = activeBgRef.current;
    if (!bar || !btn || !bg) return;

    const x = btn.offsetLeft;
    const y = btn.offsetTop;
    const width = btn.offsetWidth;
    const height = btn.offsetHeight;

    if (immediate) {
      gsap.set(bg, { x, y, width, height });
    } else {
      gsap.to(bg, {
        x,
        y,
        width,
        height,
        duration: 0.55,
        ease: EASE_EXPO,
        overwrite: "auto",
      });
    }
  });

  useEffect(() => {
    moveTabIndicator(activeKeyRef.current, true);
    let lastW = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== lastW) {
        lastW = window.innerWidth;
        moveTabIndicator(activeKeyRef.current, true);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSelectTab = contextSafe((nextKey) => {
    if (nextKey === activeKeyRef.current) return;
    activeKeyRef.current = nextKey;
    moveTabIndicator(nextKey, false);
    setActiveKey(nextKey);

    // 1. Pre-Mounted Curtain Reveal for New Floor Plan Image over Previous Image
    zCounterRef.current += 1;
    const nextLayer = layerRefs.current[nextKey];
    const nextImg = imgRefs.current[nextKey];

    if (nextLayer && nextImg) {
      gsap.killTweensOf([nextLayer, nextImg]);
      gsap.set(nextLayer, {
        zIndex: zCounterRef.current,
        clipPath: "inset(100% 0% 0% 0%)",
      });
      gsap.to(nextLayer, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.75,
        ease: EASE_EXPO,
        overwrite: "auto",
      });
      gsap.fromTo(
        nextImg,
        { scale: 1.16 },
        {
          scale: 1,
          duration: 0.85,
          ease: EASE_OUT,
          overwrite: "auto",
        }
      );
    }

    // 2. Smooth Y-Axis Mask Slide for the Newly Selected Spec Panel
    const nextSpecPanel = specPanelRefs.current[nextKey];
    if (nextSpecPanel) {
      const items = nextSpecPanel.querySelectorAll(".fp-text-anim");
      gsap.killTweensOf(items);
      gsap.fromTo(
        items,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.65,
          stagger: 0.04,
          ease: EASE_EXPO,
        }
      );
    }
  });

  return (
    <section id="floor-plans" ref={sectionRef} className="bg-cloud py-24 sm:py-28 md:py-36">
      <div className="page-shell">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            title="Clear layouts and upfront prices."
            subtitle="Switch between 1 BHK, 2 BHK, 3 BHK flats and residential land plots."
          />

          {/* Sharp Tab Bar with Continuously Shifting Active Indicator */}
          <div
            ref={tabBarRef}
            className="relative inline-flex flex-wrap self-start border border-ink/20 bg-white p-1 lg:self-auto"
          >
            <span
              ref={activeBgRef}
              className="pointer-events-none absolute top-0 left-0 z-0 bg-ink will-change-transform"
            />
            {keys.map((k) => (
              <button
                key={k}
                ref={(el) => (tabBtnRefs.current[k] = el)}
                type="button"
                onClick={() => handleSelectTab(k)}
                className={`relative z-10 min-h-11 cursor-pointer bg-transparent px-6 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors duration-300 sm:text-sm ${
                  activeKey === k ? "text-white" : "text-ink-muted hover:text-ink"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <div className="floorplan-box mt-12 grid grid-cols-1 gap-10 border border-ink/15 bg-white p-6 md:p-12 lg:grid-cols-12 lg:items-center">
          {/* Left Specs: Locked-Height Grid Stack so Height Never Shifts */}
          <div className="grid grid-cols-1 items-center lg:col-span-6">
            {keys.map((k) => {
              const p = siteConfig.floorPlans[k];
              const isSelected = activeKey === k;
              return (
                <div
                  key={k}
                  ref={(el) => (specPanelRefs.current[k] = el)}
                  aria-hidden={!isSelected}
                  className={`col-start-1 row-start-1 space-y-6 transition-opacity duration-200 ${
                    isSelected
                      ? "visible pointer-events-auto z-10 opacity-100"
                      : "invisible pointer-events-none z-0 opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <span className="fp-text-anim inline-block border border-ink/15 bg-cloud px-4 py-1.5 text-xs font-normal tracking-wider text-ink uppercase">
                      {p.facing}
                    </span>
                  </div>

                  <div>
                    <div className="overflow-hidden">
                      <h3 className="fp-text-anim font-heading text-2xl font-medium text-ink md:text-3xl">
                        {p.title}
                      </h3>
                    </div>
                    <div className="mt-2 overflow-hidden">
                      <p className="fp-text-anim font-heading text-3xl font-medium text-emerald md:text-4xl">
                        {p.price}
                      </p>
                    </div>
                    <div className="mt-1 overflow-hidden">
                      <span className="fp-text-anim block text-sm font-light text-ink-muted">
                        Booking Amount:{" "}
                        <span className="font-normal text-ink">
                          {p.bookingAmount}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 border-t border-l border-ink/15">
                    <div className="overflow-hidden border-r border-b border-ink/15 bg-cloud p-4">
                      <div className="fp-text-anim">
                        <span className="block text-[11px] font-normal tracking-wider text-ink-muted uppercase">
                          Carpet Area
                        </span>
                        <span className="mt-1 block font-heading text-sm font-medium text-ink md:text-lg">
                          {p.carpetArea}
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden border-r border-b border-ink/15 bg-cloud p-4">
                      <div className="fp-text-anim">
                        <span className="block text-[11px] font-normal tracking-wider text-ink-muted uppercase">
                          Balcony
                        </span>
                        <span className="mt-1 block font-heading text-sm font-medium text-ink md:text-lg">
                          {p.balconyArea}
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden border-r border-b border-ink/15 bg-cloud p-4">
                      <div className="fp-text-anim">
                        <span className="block text-[11px] font-normal tracking-wider text-ink-muted uppercase">
                          Total Area
                        </span>
                        <span className="mt-1 block font-heading text-sm font-medium text-ink md:text-lg">
                          {p.superBuiltUp}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2.5">
                    {p.highlights.map((h) => (
                      <li key={h} className="overflow-hidden">
                        <div className="fp-text-anim flex items-center gap-2.5 text-sm font-light text-ink md:text-base">
                          <Check className="h-4 w-4 text-emerald" />
                          {h}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    <DirectionalButton
                      href="#site-visit"
                      variant="dark"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollTo("#site-visit");
                      }}
                    >
                      Request Full Cost Sheet & Brochure
                      <ArrowUpRight className="h-4 w-4" />
                    </DirectionalButton>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Image with Pre-Mounted Multi-Layer Curtain Reveal */}
          <div className="relative aspect-4/3 w-full overflow-hidden border border-ink/15 bg-cloud lg:col-span-6">
            {keys.map((k) => {
              const p = siteConfig.floorPlans[k];
              return (
                <div
                  key={k}
                  ref={(el) => (layerRefs.current[k] = el)}
                  className="absolute inset-0 overflow-hidden bg-cloud will-change-[clip-path]"
                >
                  <img
                    ref={(el) => (imgRefs.current[k] = el)}
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover will-change-transform"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}