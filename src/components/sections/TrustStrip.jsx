"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, EASE_EXPO, EASE_OUT } from "@/lib/gsap";
import ElasticLine from "@/components/ui/ElasticLine";
import { siteConfig } from "@/config/siteConfig";
import { Landmark } from "lucide-react";

export default function TrustStrip() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        ".trust-stat-inner",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.95,
          stagger: 0.08,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".bank-header-inner",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.85,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: ".bank-marquee-wrap",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.utils.toArray(".trust-num").forEach((el) => {
        const target = parseFloat(el.getAttribute("data-target") || "0");
        const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: EASE_OUT,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            el.textContent = obj.val.toFixed(decimals);
          },
        });
      });

      // Gentle, Controlled Bidirectional Scroll-Velocity Marquee
      const track = trackRef.current;
      if (!track) return;

      let xPercent = 0;
      let direction = -1;
      let speedBoost = 0;

      const st = ScrollTrigger.create({
        onUpdate(self) {
          direction = self.direction === 1 ? -1 : 1;
          const vel = self.getVelocity();
          // Capped at 0.065 so scrolling never makes the marquee spin too fast
          speedBoost = gsap.utils.clamp(0, 0.065, Math.abs(vel) / 9000);
        },
      });

      const tick = () => {
        xPercent += (0.018 + speedBoost) * direction;
        if (xPercent <= -50) xPercent = 0;
        if (xPercent > 0) xPercent = -50;
        gsap.set(track, { xPercent });
        speedBoost *= 0.92;
      };

      gsap.ticker.add(tick);

      return () => {
        st.kill();
        gsap.ticker.remove(tick);
      };
    },
    { scope: sectionRef }
  );

  const banks = [...siteConfig.approvedBanks, ...siteConfig.approvedBanks];

  return (
    <section ref={sectionRef} className="bg-white py-20 sm:py-24 md:py-28">
      <div className="page-shell">
        <ElasticLine />

        <div className="grid grid-cols-2 gap-10 py-12 md:grid-cols-4 md:py-16">
          {siteConfig.trustStats.map((item) => (
            <div key={item.label} className="overflow-hidden">
              <div className="trust-stat-inner flex flex-col justify-between">
                <div className="font-heading text-[clamp(2.8rem,5.5vw,5.25rem)] leading-none font-medium tracking-tight text-ink">
                  <span
                    className="trust-num"
                    data-target={item.value}
                    data-decimals={item.decimals || 0}
                  >
                    {item.value}
                  </span>
                  <span className="text-accent">{item.suffix}</span>
                </div>
                <p className="mt-3 text-xs font-normal tracking-wider text-ink-muted uppercase">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <ElasticLine />
      </div>

      {/* Clear Context Header + Controlled Bidirectional Bank Marquee */}
      <div className="bank-marquee-wrap mt-10 border-y border-ink/15 bg-cloud">
        <div className="page-shell border-b border-ink/10 py-4">
          <div className="overflow-hidden">
            <div className="bank-header-inner flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 text-xs font-medium tracking-wider text-ink uppercase">
                <Landmark className="h-4 w-4 text-accent" />
                <span>Pre-Approved Home Loan Partners</span>
              </div>
              <span className="text-xs font-light text-ink-muted">
                All projects are pre-approved by these banks for paperless home loan sanction
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden py-6">
          <div
            ref={trackRef}
            className="flex w-max items-center gap-12 px-6 will-change-transform"
          >
            {banks.map((bank, i) => (
              <div
                key={`${bank}-${i}`}
                className="flex shrink-0 items-center gap-4 border border-ink/15 bg-white px-6 py-3.5"
              >
                <span className="h-2 w-2 bg-emerald" />
                <span className="font-heading text-lg font-medium text-ink md:text-xl">
                  {bank}
                </span>
                <span className="border-l border-ink/15 pl-3 text-[11px] font-normal tracking-wider text-emerald uppercase">
                  Home Loan Approved
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}