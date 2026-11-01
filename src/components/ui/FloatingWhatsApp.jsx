"use client";

import { siteConfig } from "@/config/siteConfig";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const url = `https://wa.me/${siteConfig.brand.whatsappRaw}?text=${encodeURIComponent(
    "Hello Aurelia Durgapur, please share the brochure and price sheet."
  )}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-5 bottom-5 z-30 inline-flex min-h-12 cursor-pointer items-center gap-2 border border-ink/15 bg-emerald px-5 py-3 text-xs font-medium uppercase tracking-wider text-white shadow-lg transition hover:-translate-y-0.5"
    >
      <MessageCircle className="h-4 w-4 fill-current" />
      <span className="hidden sm:inline">WhatsApp Us</span>
    </a>
  );
}