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
  const topImgWrapRef = useRef(null);
  const topImgRef = useRef(null);
  const textWrapRef = useRef(null);

  const [prevKey, setPrevKey] = useState("2 BHK");
  const [activeKey, setActiveKey] = useState("2 BHK");

  const { scrollTo } = useSmoothScroll();
  const { contextSafe } = useGSAP({ scope: sectionRef });

  const prevPlan = siteConfig.floorPlans[prevKey];
  const plan = siteConfig.floorPlans[activeKey];

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        ".floorplan-box",
        { clipPath: "inset(100% 0% 0% 0%)", y: 40 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          y: 0,
          duration: 1.0,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  const moveTabIndicator = contextSafe((targetKey, immediate = false) => {
    const bar = tabBarRef.current;
    const btn = tabBtnRefs.current[targetKey];
    const bg = activeBgRef.current;
    if (!bar || !btn || !bg) return;

    const barRect = bar.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const x = btnRect.left - barRect.left;
    const y = btnRect.top - barRect.top;

    gsap.to(bg, {
      x,
      y,
      width: btnRect.width,
      height: btnRect.height,
      duration: immediate ? 0 : 0.55,
      ease: EASE_EXPO,
    });
  });

  useEffect(() => {
    moveTabIndicator(activeKey, true);
    const onResize = () => moveTabIndicator(activeKey, true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSelectTab = contextSafe((nextKey) => {
    if (nextKey === activeKey) return;
    setPrevKey(activeKey);
    setActiveKey(nextKey);
    moveTabIndicator(nextKey, false);

    // 1. Curtain Reveal for New Floor Plan Image over Previous Image
    if (topImgWrapRef.current && topImgRef.current) {
      gsap.killTweensOf([topImgWrapRef.current, topImgRef.current]);
      gsap.fromTo(
        topImgWrapRef.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.75,
          ease: EASE_EXPO,
        }
      );
      gsap.fromTo(
        topImgRef.current,
        { scale: 1.15 },
        {
          scale: 1,
          duration: 0.85,
          ease: EASE_OUT,
        }
      );
    }

    // 2. Smooth Y-Axis Mask Slide for Text Details
    if (textWrapRef.current) {
      const items = textWrapRef.current.querySelectorAll(".fp-text-anim");
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
    <section id="floor-plans" ref={sectionRef} className="bg-cloud py-20 md:py-32">
      <div className="page-shell">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            title="Clear layouts and upfront prices."
            subtitle="Switch between 1 BHK, 2 BHK, 3 BHK flats and residential land plots."
          />

          {/* Sharp Tab Bar with Shifting Active Indicator */}
          <div
            ref={tabBarRef}
            className="relative inline-flex flex-wrap self-start border border-ink/20 bg-white p-1 lg:self-auto"
          >
            <span
              ref={activeBgRef}
              className="pointer-events-none absolute top-0 left-0 bg-ink"
            />
            {keys.map((k) => (
              <button
                key={k}
                ref={(el) => (tabBtnRefs.current[k] = el)}
                type="button"
                onClick={() => handleSelectTab(k)}
                className={`relative z-10 min-h-11 cursor-pointer px-6 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors duration-300 sm:text-sm ${
                  activeKey === k ? "text-white" : "text-ink-muted hover:text-ink"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <div className="floorplan-box mt-12 grid grid-cols-1 gap-10 border border-ink/15 bg-white p-6 md:p-12 lg:grid-cols-12 lg:items-center">
          {/* Left Specs with Masked Y-Axis Slide Transition */}
          <div ref={textWrapRef} className="space-y-6 lg:col-span-6">
            <div className="overflow-hidden">
              <span className="fp-text-anim inline-block border border-ink/15 bg-cloud px-4 py-1.5 text-xs font-normal tracking-wider text-ink uppercase">
                {plan.facing}
              </span>
            </div>

            <div>
              <div className="overflow-hidden">
                <h3 className="fp-text-anim font-heading text-3xl font-medium text-ink md:text-4xl">
                  {plan.title}
                </h3>
              </div>
              <div className="mt-2 overflow-hidden">
                <p className="fp-text-anim font-heading text-4xl font-medium text-emerald md:text-5xl">
                  {plan.price}
                </p>
              </div>
              <div className="mt-1 overflow-hidden">
                <span className="fp-text-anim block text-sm font-light text-ink-muted">
                  Booking Amount: <span className="font-normal text-ink">{plan.bookingAmount}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 border-t border-l border-ink/15">
              <div className="overflow-hidden border-r border-b border-ink/15 bg-cloud p-4">
                <div className="fp-text-anim">
                  <span className="block text-[11px] font-normal tracking-wider text-ink-muted uppercase">
                    Carpet Area
                  </span>
                  <span className="mt-1 block font-heading text-base font-medium text-ink md:text-xl">
                    {plan.carpetArea}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden border-r border-b border-ink/15 bg-cloud p-4">
                <div className="fp-text-anim">
                  <span className="block text-[11px] font-normal tracking-wider text-ink-muted uppercase">
                    Balcony
                  </span>
                  <span className="mt-1 block font-heading text-base font-medium text-ink md:text-xl">
                    {plan.balconyArea}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden border-r border-b border-ink/15 bg-cloud p-4">
                <div className="fp-text-anim">
                  <span className="block text-[11px] font-normal tracking-wider text-ink-muted uppercase">
                    Total Area
                  </span>
                  <span className="mt-1 block font-heading text-base font-medium text-ink md:text-xl">
                    {plan.superBuiltUp}
                  </span>
                </div>
              </div>
            </div>

            <ul className="space-y-2.5">
              {plan.highlights.map((h) => (
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

          {/* Right Image with Continuous Dual-Layer Curtain Reveal */}
          <div className="relative aspect-4/3 w-full overflow-hidden border border-ink/15 bg-cloud lg:col-span-6">
            {/* Previous Image Underneath */}
            <img
              src={prevPlan.image}
              alt={prevPlan.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Active Image Wiping Over with Curtain Reveal */}
            <div ref={topImgWrapRef} className="absolute inset-0 overflow-hidden">
              <img
                ref={topImgRef}
                src={plan.image}
                alt={plan.title}
                className="h-full w-full object-cover will-change-transform"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}