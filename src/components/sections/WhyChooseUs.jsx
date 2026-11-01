"use client";

import { useRef } from "react";
import { gsap, useGSAP, EASE_EXPO, EASE_OUT, revealWords, revealLines } from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";
import ElasticLine from "@/components/ui/ElasticLine";
import { siteConfig } from "@/config/siteConfig";
import { ShieldCheck, Hammer, Clock, FileCheck2 } from "lucide-react";

const icons = [ShieldCheck, Hammer, Clock, FileCheck2];

export default function WhyChooseUs() {
  const sectionRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: sectionRef });

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        ".why-card",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.95,
          stagger: 0.09,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: ".why-grid",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Word-by-word reveal on Pillar Headings
      const cleanupWhyWords = revealWords(".why-title-word", {
        trigger: ".why-grid",
        start: "top 82%",
        stagger: 0.03,
        duration: 0.9,
      });

      // Staggered line-by-line overflow-hidden Y-axis reveal on Pillar Body Text
      const cleanupWhyLines = revealLines(".why-body-line", {
        trigger: ".why-grid",
        start: "top 80%",
        delay: 0.1,
        stagger: 0.05,
        duration: 0.85,
      });

      gsap.fromTo(
        ".testimonial-card",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.95,
          stagger: 0.1,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: ".testimonial-grid",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Staggered line-by-line overflow-hidden Y-axis reveal on Testimonial Quotes
      const cleanupTestimonialLines = revealLines(".testimonial-body-line", {
        trigger: ".testimonial-grid",
        start: "top 82%",
        delay: 0.08,
        stagger: 0.055,
        duration: 0.85,
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.fromTo(
          ".why-speed-fast",
          { y: 40 },
          {
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: ".why-grid",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );

        gsap.fromTo(
          ".why-speed-slow",
          { y: -25 },
          {
            y: 25,
            ease: "none",
            scrollTrigger: {
              trigger: ".why-grid",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      });

      return () => {
        cleanupWhyWords();
        cleanupWhyLines();
        cleanupTestimonialLines();
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  const handleCardMove = contextSafe((e) => {
    if (window.innerWidth < 1024) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(card, {
      rotateY: (x / rect.width) * 8,
      rotateX: -(y / rect.height) * 8,
      transformPerspective: 800,
      duration: 0.35,
      ease: EASE_OUT,
    });
  });

  const handleCardLeave = contextSafe((e) => {
    gsap.to(e.currentTarget, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: EASE_OUT,
    });
  });

  return (
    <section ref={sectionRef} className="bg-white py-24 sm:py-28 md:py-36">
      <div className="page-shell">
        <SectionHeading
          title="Why families in Durgapur trust us."
          subtitle="Clear legal papers, strong materials, and honest pricing."
        />

        <div className="why-grid mt-14 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.whyChooseUs.map((item, idx) => {
            const Icon = icons[idx % icons.length];
            const speedClass =
              idx % 2 === 1 ? "why-speed-fast" : "why-speed-slow";
            return (
              <div key={item.title} className={`${speedClass} will-change-transform`}>
                <div
                  onMouseMove={handleCardMove}
                  onMouseLeave={handleCardLeave}
                  className="why-card flex h-full flex-col justify-between border border-ink/15 bg-cloud p-8 will-change-transform"
                >
                  <div className="flex h-12 w-12 items-center justify-center border border-ink/15 bg-white text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-8">
                    <h3 className="why-title-word font-heading text-xl font-medium text-ink">
                      {item.title}
                    </h3>
                    <p className="why-body-line mt-3 text-sm font-light leading-relaxed text-ink-muted">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <ElasticLine className="my-16 md:my-20" />

        <div className="testimonial-grid grid grid-cols-1 gap-6 md:grid-cols-3">
          {siteConfig.testimonials.map((t) => (
            <blockquote
              key={t.name}
              className="testimonial-card flex flex-col justify-between border border-ink/15 bg-cloud p-8"
            >
              <p className="testimonial-body-line font-heading text-lg font-normal leading-relaxed text-ink">
                “{t.quote}”
              </p>
              <footer className="mt-6 border-t border-ink/10 pt-4">
                <span className="testimonial-body-line block font-heading text-base font-medium text-ink">
                  {t.name}
                </span>
                <span className="testimonial-body-line block text-xs font-normal text-emerald">
                  {t.unit}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}