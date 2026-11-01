"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/siteConfig";
import { FileDown, Gift, CheckCircle2 } from "lucide-react";

export default function PricingBrochure() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [formErr, setFormErr] = useState("");

  const handleBrochureSubmit = (e) => {
    e.preventDefault();
    if (name.trim().length < 2 || phone.replace(/\D/g, "").length < 10) {
      setFormErr("Please enter your name and a valid 10-digit phone number.");
      return;
    }
    setFormErr("");
    setUnlocked(true);
  };

  return (
    <section id="pricing" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Transparent Cost Sheet & Offers"
          title="All-inclusive pricing with zero hidden surprises."
          subtitle="Review unit-wise base pricing, booking amounts, and download the complete RERA payment schedule."
        />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Pricing Table + Launch Offers */}
          <div className="space-y-6 lg:col-span-7">
            <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-cloud">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-ink/10 bg-ink text-xs font-mono uppercase text-white">
                  <tr>
                    <th className="px-4 py-3.5">Configuration</th>
                    <th className="px-4 py-3.5">Super Area</th>
                    <th className="px-4 py-3.5">All-In Price</th>
                    <th className="px-4 py-3.5">Booking Amt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10 bg-white">
                  {siteConfig.pricingTable.map((row) => (
                    <tr key={row.unit} className="hover:bg-cloud/60">
                      <td className="px-4 py-4 font-heading font-bold text-ink">
                        {row.unit}
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-ink-muted">
                        {row.area}
                      </td>
                      <td className="px-4 py-4 font-mono font-bold text-emerald">
                        {row.basePrice}
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-ink">
                        {row.booking}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Festive / Launch Offers Box */}
            <div className="rounded-2xl border border-gold/40 bg-cloud p-6">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-gold">
                <Gift className="h-4 w-4" />
                Exclusive Early-Allotment Benefits
              </div>
              <ul className="mt-3 space-y-2 text-sm text-ink">
                {siteConfig.launchOffers.map((offer) => (
                  <li key={offer} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {offer}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Download Brochure Lead Form */}
          <div className="rounded-3xl bg-ink p-7 text-white sm:p-9 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-widest text-gold">
              Instant Digital Kit
            </span>
            <h3 className="mt-2 font-heading text-2xl font-bold">
              Download E-Brochure & Payment Schedule
            </h3>
            <p className="mt-2 text-sm text-white/70">
              Includes isometric floor plans, carpet area matrix, and subvention milestone chart.
            </p>

            {unlocked ? (
              <div className="mt-6 rounded-2xl border border-emerald/40 bg-white/10 p-6 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald" />
                <p className="mt-3 font-heading text-lg font-bold">
                  Your Brochure is Ready!
                </p>
                <p className="mt-1 text-xs text-white/75">
                  We have also shared a copy on your WhatsApp number.
                </p>
                <a
                  href="#pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    window.print();
                  }}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-xs font-bold uppercase text-ink"
                >
                  <FileDown className="h-4 w-4" />
                  Save / Print Cost Sheet PDF
                </a>
              </div>
            ) : (
              <form onSubmit={handleBrochureSubmit} className="mt-6 space-y-4" noValidate>
                <div>
                  <label htmlFor="br-name" className="block text-xs text-white/80">
                    Full Name *
                  </label>
                  <input
                    id="br-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="mt-1 min-h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="br-phone" className="block text-xs text-white/80">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    id="br-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98300 XXXXX"
                    className="mt-1 min-h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 font-mono text-sm text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="br-email" className="block text-xs text-white/80">
                    Email Address (Optional)
                  </label>
                  <input
                    id="br-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="mt-1 min-h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
                  />
                </div>

                {formErr && (
                  <p role="alert" className="text-xs font-semibold text-gold">
                    {formErr}
                  </p>
                )}

                <button
                  type="submit"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-bold text-ink transition hover:bg-gold/90"
                >
                  <FileDown className="h-4 w-4" />
                  Download Brochure PDF (14.2 MB)
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}