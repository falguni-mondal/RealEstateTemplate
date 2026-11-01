"use client";

import { useState, useRef } from "react";
import { gsap, useGSAP, EASE_EXPO } from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/siteConfig";
import { MapPin, Clock, Navigation } from "lucide-react";

export default function LocationAdvantage() {
  const sectionRef = useRef(null);
  const [mapActive, setMapActive] = useState(false);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        ".loc-card",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.95,
          stagger: 0.1,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: ".loc-grid",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".loc-row-inner",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.85,
          stagger: 0.04,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: ".loc-grid",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section id="location" ref={sectionRef} className="bg-cloud py-24 sm:py-28 md:py-36">
      <div className="page-shell">
        <SectionHeading
          title="Minutes away from City Centre, NH-19, schools, and hospitals."
          subtitle={siteConfig.brand.address}
        />

        <div className="loc-grid mt-14 grid grid-cols-1 gap-8 sm:mt-16 lg:grid-cols-12">
          {/* Durgapur Map Embed */}
          <div className="loc-card relative min-h-[420px] overflow-hidden border border-ink/15 bg-white lg:col-span-6">
            <iframe
              title="Durgapur City Centre Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58524.51264984434!2d87.270997!3d23.540445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f7710b47a89171%3A0x429e1bdb57e009dd!2sCity%20Centre%2C%20Durgapur%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              className={`h-full min-h-[420px] w-full border-0 ${
                mapActive ? "pointer-events-auto" : "pointer-events-none"
              }`}
              loading="lazy"
            />
            {!mapActive && (
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-ink/15 bg-white/95 p-5 backdrop-blur-xs">
                <span className="inline-flex items-center gap-2 text-xs font-medium text-ink">
                  <MapPin className="h-4 w-4 text-accent" />
                  City Centre, Durgapur
                </span>
                <button
                  type="button"
                  onClick={() => setMapActive(true)}
                  className="inline-flex min-h-10 cursor-pointer items-center gap-2 bg-ink px-5 py-2 text-xs font-medium text-white"
                >
                  <Navigation className="h-3.5 w-3.5 text-accent" />
                  Interact with Map
                </button>
              </div>
            )}
          </div>

          {/* Travel Times with Masked Row Animations */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-6">
            {siteConfig.locationAdvantages.map((group) => (
              <div
                key={group.category}
                className="loc-card border border-ink/15 bg-white p-6"
              >
                <div className="overflow-hidden">
                  <h3 className="loc-row-inner font-heading text-lg font-medium text-ink">
                    {group.category}
                  </h3>
                </div>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <li
                      key={item.name}
                      className="overflow-hidden border-b border-ink/10 pb-2.5 text-sm font-light last:border-0 last:pb-0"
                    >
                      <div className="loc-row-inner flex items-start justify-between gap-2">
                        <span className="text-ink">{item.name}</span>
                        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-emerald">
                          <Clock className="h-3.5 w-3.5" />
                          {item.time}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}