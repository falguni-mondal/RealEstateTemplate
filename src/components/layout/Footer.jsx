"use client";

import { useRef } from "react";
import { gsap, useGSAP, EASE_EXPO } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import ElasticLine from "@/components/ui/ElasticLine";
import { siteConfig } from "@/config/siteConfig";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const footerRef = useRef(null);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        ".footer-col-inner",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".footer-watermark-inner",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: ".footer-bottom",
            start: "top 92%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: footerRef }
  );

  return (
    <footer
      ref={footerRef}
      className="border-t border-ink/15 bg-cloud pt-16 pb-12 text-ink"
    >
      <div className="page-shell">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden">
            <div className="footer-col-inner">
              <span className="font-heading text-2xl font-semibold tracking-tight text-ink">
                {siteConfig.brand.name}
                <span className="text-accent">.</span>
              </span>
              <p className="mt-3 text-sm font-light leading-relaxed text-ink-muted">
                {siteConfig.brand.address}
              </p>
              <p className="mt-3 text-xs font-normal text-ink-muted">
                WB-RERA: {siteConfig.brand.reraNumber}
              </p>
            </div>
          </div>

          <div className="overflow-hidden">
            <div className="footer-col-inner">
              <h3 className="text-xs font-medium tracking-widest text-ink-muted uppercase">
                Explore
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm font-light">
                {siteConfig.navLinks.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      onClick={(e) => e.preventDefault()}
                      className="cursor-pointer text-ink-muted transition-colors hover:text-ink"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="overflow-hidden">
            <div className="footer-col-inner">
              <h3 className="text-xs font-medium tracking-widest text-ink-muted uppercase">
                Durgapur Projects
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm font-light text-ink-muted">
                {siteConfig.featuredProjects.map((p) => (
                  <li key={p.title}>
                    <span className="font-normal text-ink">{p.title}</span> — {p.location}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="overflow-hidden">
            <div className="footer-col-inner">
              <h3 className="text-xs font-medium tracking-widest text-ink-muted uppercase">
                Direct Desk
              </h3>
              <div className="mt-4 space-y-2.5 text-sm">
                <a
                  href={`tel:${siteConfig.brand.phoneRaw}`}
                  className="block cursor-pointer font-heading text-xl font-medium text-ink hover:text-accent"
                >
                  {siteConfig.brand.phone}
                </a>
                <a
                  href={`mailto:${siteConfig.brand.email}`}
                  className="block cursor-pointer font-light text-ink-muted hover:text-ink"
                >
                  {siteConfig.brand.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <ElasticLine className="my-10" />

        {/* Huge Brand Watermark with Masked ScrollTrigger Reveal */}
        <div className="footer-bottom flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="overflow-hidden">
            <p className="footer-watermark-inner font-heading text-[clamp(3.2rem,10.5vw,10rem)] font-medium leading-none tracking-tighter text-ink/10 select-none">
              AURELIA DURGAPUR
            </p>
          </div>

          <button
            type="button"
            onClick={() => scrollTo(0, { offset: 0 })}
            className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 border border-ink/20 bg-white px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-ink transition hover:border-ink hover:bg-ink hover:text-white"
          >
            Back to Top
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}