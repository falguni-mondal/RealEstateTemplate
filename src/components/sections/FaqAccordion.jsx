"use client";

import { useState, useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  useGSAP,
  EASE_EXPO,
  revealWords,
} from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/siteConfig";

export default function FaqAccordion() {
  const sectionRef = useRef(null);
  const bodyRefs = useRef([]);
  const innerTextRefs = useRef([]);
  const vBarRefs = useRef([]);
  const lineGroupsRef = useRef([]);
  const [openIdx, setOpenIdx] = useState(0);

  const { contextSafe } = useGSAP({ scope: sectionRef });

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const cleanupQuestions = revealWords(".faq-q-word", {
        trigger: ".faq-list",
        start: "top 85%",
        stagger: 0.02,
        duration: 0.85,
      });

      const splits = [];
      lineGroupsRef.current = [];

      innerTextRefs.current.forEach((el, idx) => {
        if (!el) return;
        const split = new SplitText(el, {
          type: "lines",
          linesClass: "line-inner",
        });
        splits.push(split);

        const lines = split.lines.map((line) => {
          const mask = document.createElement("span");
          mask.className = "line-mask";
          line.parentNode.insertBefore(mask, line);
          mask.appendChild(line);
          return line;
        });

        lineGroupsRef.current[idx] = lines;

        if (idx === 0) {
          gsap.set(bodyRefs.current[idx], { height: "auto" });
          gsap.set(lines, { yPercent: 0 });
          gsap.set(vBarRefs.current[idx], { rotate: 90, scaleY: 0 });
        } else {
          gsap.set(bodyRefs.current[idx], { height: 0 });
          gsap.set(lines, { yPercent: 118 });
          gsap.set(vBarRefs.current[idx], { rotate: 0, scaleY: 1 });
        }
      });

      return () => {
        cleanupQuestions();
        splits.forEach((s) => s.revert());
      };
    },
    { scope: sectionRef }
  );

  const toggle = contextSafe((idx) => {
    const nextIdx = openIdx === idx ? -1 : idx;
    setOpenIdx(nextIdx);

    siteConfig.faqs.forEach((_, i) => {
      const body = bodyRefs.current[i];
      const lines = lineGroupsRef.current[i] || [];
      const vBar = vBarRefs.current[i];
      if (!body || !vBar) return;

      gsap.killTweensOf([body, vBar, ...lines]);

      if (i === nextIdx) {
        gsap.to(body, {
          height: "auto",
          duration: 0.6,
          ease: EASE_EXPO,
          onComplete: () => ScrollTrigger.refresh(),
        });
        gsap.fromTo(
          lines,
          { yPercent: 118 },
          {
            yPercent: 0,
            duration: 0.65,
            stagger: 0.055,
            ease: EASE_EXPO,
          }
        );
        gsap.to(vBar, {
          rotate: 90,
          scaleY: 0,
          duration: 0.45,
          ease: EASE_EXPO,
        });
      } else {
        gsap.to(body, {
          height: 0,
          duration: 0.5,
          ease: EASE_EXPO,
          onComplete: () => ScrollTrigger.refresh(),
        });
        gsap.to(lines, {
          yPercent: 118,
          duration: 0.35,
          ease: EASE_EXPO,
        });
        gsap.to(vBar, {
          rotate: 0,
          scaleY: 1,
          duration: 0.45,
          ease: EASE_EXPO,
        });
      }
    });
  });

  return (
    <section id="faq" ref={sectionRef} className="bg-cloud py-24 sm:py-28 md:py-36">
      <div className="page-shell">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <SectionHeading
              title="Common questions."
              subtitle="Everything you need to know before booking your home or plot."
            />
          </div>

          <div className="faq-list divide-y divide-ink/15 border-y border-ink/15 lg:col-span-7">
            {siteConfig.faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={faq.q} className="py-6">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggle(idx)}
                    className="group flex w-full cursor-pointer items-center justify-between gap-4 text-left font-heading text-xl font-medium text-ink md:text-2xl"
                  >
                    <span className="faq-q-word transition-colors group-hover:text-accent">
                      {faq.q}
                    </span>

                    <span
                      className={`relative flex h-10 w-10 shrink-0 items-center justify-center border transition-colors duration-300 ${
                        isOpen
                          ? "border-ink bg-ink text-white"
                          : "border-ink/20 bg-white text-ink group-hover:border-ink"
                      }`}
                    >
                      <span className="block h-[1.5px] w-3.5 bg-current" />
                      <span
                        ref={(el) => (vBarRefs.current[idx] = el)}
                        className="absolute block h-3.5 w-[1.5px] origin-center bg-current will-change-transform"
                      />
                    </span>
                  </button>

                  {/* GSAP Animated Height + Staggered Line-by-Line Y-Axis Body */}
                  <div
                    ref={(el) => (bodyRefs.current[idx] = el)}
                    className="h-0 overflow-hidden"
                  >
                    <p
                      ref={(el) => (innerTextRefs.current[idx] = el)}
                      className="pt-4 pr-10 text-base font-light leading-relaxed text-ink-muted"
                    >
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}