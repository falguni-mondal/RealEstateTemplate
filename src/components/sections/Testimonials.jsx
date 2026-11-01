"use client";

import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/siteConfig";
import { Star } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="bg-cloud py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="4,200+ Happy Families"
          title="Stories from residents who call Aurelia home."
          subtitle="Unfiltered feedback from homeowners and plot buyers across Kolkata."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {siteConfig.testimonials.map((item) => (
            <article
              key={item.name}
              className="flex flex-col justify-between rounded-2xl border border-ink/10 bg-white p-6 shadow-2xs"
            >
              <div>
                <div className="flex items-center gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink">
                  “{item.quote}”
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3.5 border-t border-ink/10 pt-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-cloud">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-ink">
                    {item.name}
                  </h3>
                  <p className="text-xs text-ink-muted">{item.unit}</p>
                  <span className="font-mono text-[10px] font-semibold text-emerald">
                    {item.year}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}