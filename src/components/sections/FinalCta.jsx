"use client";

import { useState } from "react";
import { siteConfig } from "@/config/siteConfig";
import { PhoneCall, CheckCircle2 } from "lucide-react";

export default function FinalCta() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("2 BHK Grand Haven");
  const [preferredTime, setPreferredTime] = useState("Morning (10 AM – 1 PM)");
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim().length < 2 || phone.replace(/\D/g, "").length < 10) {
      setErr("Please enter your name and a valid 10-digit mobile number.");
      return;
    }
    setErr("");
    setSubmitted(true);
  };

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 rounded-3xl bg-ink p-8 text-white sm:p-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-gold">
              Direct Developer Desk · Zero Brokerage
            </span>
            <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-5xl">
              Ready to find your family’s permanent address?
            </h2>
            <p className="mt-4 text-base text-white/75">
              Speak directly with our senior property advisor for unit availability, corner-unit inventory, and customized bank EMI structuring.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={`tel:${siteConfig.brand.phoneRaw}`}
                className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-6 py-3 font-mono text-sm font-semibold text-white transition hover:bg-white/20"
              >
                <PhoneCall className="h-4 w-4 text-gold" />
                {siteConfig.brand.phone}
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 text-ink sm:p-8 lg:col-span-6">
            {submitted ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald" />
                <h3 className="mt-3 font-heading text-2xl font-bold">
                  Callback Request Received
                </h3>
                <p className="mt-1 text-sm text-ink-muted">
                  Our senior advisor will call you during your preferred window ({preferredTime}).
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <h3 className="font-heading text-xl font-bold text-ink">
                  Request an Instant Callback
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cta-name" className="block text-xs font-semibold text-ink">
                      Full Name *
                    </label>
                    <input
                      id="cta-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="mt-1 min-h-12 w-full rounded-xl border border-ink/15 bg-cloud px-4 text-sm text-ink"
                    />
                  </div>
                  <div>
                    <label htmlFor="cta-phone" className="block text-xs font-semibold text-ink">
                      Phone Number *
                    </label>
                    <input
                      id="cta-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98300 XXXXX"
                      className="mt-1 min-h-12 w-full rounded-xl border border-ink/15 bg-cloud px-4 font-mono text-sm text-ink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cta-interest" className="block text-xs font-semibold text-ink">
                      Interested In
                    </label>
                    <select
                      id="cta-interest"
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="mt-1 min-h-12 w-full rounded-xl border border-ink/15 bg-cloud px-4 text-sm text-ink"
                    >
                      <option>1 BHK Smart Suite</option>
                      <option>2 BHK Grand Haven</option>
                      <option>3 BHK Signature</option>
                      <option>Villa Plots (2–5 Katha)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="cta-time" className="block text-xs font-semibold text-ink">
                      Preferred Callback Time
                    </label>
                    <select
                      id="cta-time"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="mt-1 min-h-12 w-full rounded-xl border border-ink/15 bg-cloud px-4 text-sm text-ink"
                    >
                      <option>Morning (10 AM – 1 PM)</option>
                      <option>Afternoon (1 PM – 4 PM)</option>
                      <option>Evening (4 PM – 8 PM)</option>
                    </select>
                  </div>
                </div>

                {err && (
                  <p role="alert" className="text-xs font-semibold text-red-600">
                    {err}
                  </p>
                )}

                <button
                  type="submit"
                  className="min-h-12 w-full rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gold hover:text-ink"
                >
                  Schedule Priority Callback
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}