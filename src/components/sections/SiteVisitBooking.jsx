"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { gsap, useGSAP, EASE_EXPO } from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";
import DirectionalButton from "@/components/ui/DirectionalButton";
import { CalendarDays, Clock, CheckCircle2, Car } from "lucide-react";

const SLOTS = ["10:30 AM", "12:30 PM", "03:00 PM", "05:00 PM"];

export default function SiteVisitBooking() {
  const sectionRef = useRef(null);
  const dateGridRef = useRef(null);
  const dateBgRef = useRef(null);
  const dateBtnRefs = useRef({});

  const slotGridRef = useRef(null);
  const slotBgRef = useRef(null);
  const slotBtnRefs = useRef({});

  const dates = useMemo(() => {
    const base = new Date("2026-11-02T10:00:00");
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return {
        iso: d.toISOString().split("T")[0],
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        num: d.toLocaleDateString("en-US", { day: "2-digit" }),
        month: d.toLocaleDateString("en-US", { month: "short" }),
      };
    });
  }, []);

  const [selectedDate, setSelectedDate] = useState(dates[0].iso);
  const [selectedSlot, setSelectedSlot] = useState(SLOTS[0]);
  const [interest, setInterest] = useState("2 BHK Flat (₹52L)");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const { contextSafe } = useGSAP({ scope: sectionRef });

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        ".booking-card",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.0,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".booking-text-inner",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.85,
          stagger: 0.08,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  const moveDateHighlight = contextSafe((iso, immediate = false) => {
    const grid = dateGridRef.current;
    const btn = dateBtnRefs.current[iso];
    const bg = dateBgRef.current;
    if (!grid || !btn || !bg) return;

    const gRect = grid.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    gsap.to(bg, {
      x: bRect.left - gRect.left,
      y: bRect.top - gRect.top,
      width: bRect.width,
      height: bRect.height,
      duration: immediate ? 0 : 0.5,
      ease: EASE_EXPO,
    });
  });

  const moveSlotHighlight = contextSafe((slot, immediate = false) => {
    const grid = slotGridRef.current;
    const btn = slotBtnRefs.current[slot];
    const bg = slotBgRef.current;
    if (!grid || !btn || !bg) return;

    const gRect = grid.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    gsap.to(bg, {
      x: bRect.left - gRect.left,
      y: bRect.top - gRect.top,
      width: bRect.width,
      height: bRect.height,
      duration: immediate ? 0 : 0.5,
      ease: EASE_EXPO,
    });
  });

  useEffect(() => {
    if (submitted) return;
    moveDateHighlight(selectedDate, true);
    moveSlotHighlight(selectedSlot, true);
    const onResize = () => {
      moveDateHighlight(selectedDate, true);
      moveSlotHighlight(selectedSlot, true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [submitted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim().length < 2 || phone.replace(/\D/g, "").length < 10) {
      setError("Please enter your full name and a 10-digit mobile number.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <section
      id="site-visit"
      ref={sectionRef}
      className="border-t border-ink/15 bg-white py-24 text-ink sm:py-28 md:py-36"
    >
      <div className="page-shell">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="flex flex-col justify-between lg:col-span-5">
            <SectionHeading
              title="See the sample flat in Durgapur."
              subtitle="Pick a date and time for your site visit, or get the complete floor plan and cost sheet PDF on WhatsApp."
            />

            <div className="mt-10 space-y-3 border border-ink/15 bg-cloud p-6 text-sm font-light text-ink">
              <div className="overflow-hidden">
                <div className="booking-text-inner flex items-center gap-3">
                  <Car className="h-5 w-5 text-accent" />
                  <span>Free AC cab pickup across Durgapur Station & City Centre</span>
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="booking-text-inner flex items-center gap-3">
                  <Clock className="h-5 w-5 text-accent" />
                  <span>Open every day · 9:30 AM – 7:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="booking-card border border-ink/15 bg-cloud p-6 text-ink md:p-10 lg:col-span-7">
            {submitted ? (
              <div className="bg-white p-10 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald" />
                <h3 className="mt-4 font-heading text-3xl font-medium">
                  Visit Confirmed & Brochure Ready!
                </h3>
                <p className="mt-2 text-base font-light text-ink-muted">
                  Thank you, <span className="font-medium text-ink">{name}</span>. Your slot for{" "}
                  <span className="font-medium text-ink">{interest}</span> is booked for{" "}
                  <span className="font-medium text-ink">
                    {selectedDate} at {selectedSlot}
                  </span>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 cursor-pointer bg-ink px-6 py-3 text-xs font-medium uppercase tracking-wider text-white"
                >
                  Change Date / Time
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Date Picker with Shifting Indicator */}
                <div>
                  <label className="mb-2.5 flex items-center gap-2 text-xs font-normal uppercase tracking-wider text-ink-muted">
                    <CalendarDays className="h-4 w-4 text-accent" />
                    Select Date
                  </label>
                  <div
                    ref={dateGridRef}
                    className="relative grid grid-cols-3 gap-2 sm:grid-cols-6"
                  >
                    <span
                      ref={dateBgRef}
                      className="pointer-events-none absolute top-0 left-0 bg-ink"
                    />
                    {dates.map((d) => (
                      <button
                        key={d.iso}
                        ref={(el) => (dateBtnRefs.current[d.iso] = el)}
                        type="button"
                        onClick={() => {
                          setSelectedDate(d.iso);
                          moveDateHighlight(d.iso, false);
                        }}
                        className={`relative z-10 flex cursor-pointer flex-col items-center border py-3 transition-colors duration-300 ${
                          selectedDate === d.iso
                            ? "border-ink text-white"
                            : "border-ink/15 bg-white/80 text-ink hover:border-ink/40"
                        }`}
                      >
                        <span className="text-[11px] font-light opacity-75">
                          {d.day}
                        </span>
                        <span className="font-heading text-xl font-medium">
                          {d.num}
                        </span>
                        <span className="text-[11px] font-light">{d.month}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slot Picker with Shifting Indicator */}
                <div>
                  <label className="mb-2.5 flex items-center gap-2 text-xs font-normal uppercase tracking-wider text-ink-muted">
                    <Clock className="h-4 w-4 text-accent" />
                    Select Time Slot
                  </label>
                  <div
                    ref={slotGridRef}
                    className="relative grid grid-cols-2 gap-2.5 sm:grid-cols-4"
                  >
                    <span
                      ref={slotBgRef}
                      className="pointer-events-none absolute top-0 left-0 bg-accent"
                    />
                    {SLOTS.map((slot) => (
                      <button
                        key={slot}
                        ref={(el) => (slotBtnRefs.current[slot] = el)}
                        type="button"
                        onClick={() => {
                          setSelectedSlot(slot);
                          moveSlotHighlight(slot, false);
                        }}
                        className={`relative z-10 min-h-11 cursor-pointer border text-xs font-medium transition-colors duration-300 ${
                          selectedSlot === slot
                            ? "border-accent text-white"
                            : "border-ink/15 bg-white/80 text-ink hover:border-ink/40"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-normal text-ink-muted">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="mt-1.5 min-h-12 w-full border border-ink/20 bg-white px-4 text-sm font-normal text-ink focus:border-ink focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-normal text-ink-muted">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile"
                      className="mt-1.5 min-h-12 w-full border border-ink/20 bg-white px-4 text-sm font-normal text-ink focus:border-ink focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-normal text-ink-muted">
                      Interested In
                    </label>
                    <select
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="mt-1.5 min-h-12 w-full cursor-pointer border border-ink/20 bg-white px-4 text-sm font-normal text-ink focus:border-ink focus:outline-none"
                    >
                      <option>1 BHK Flat (₹32.5L)</option>
                      <option>2 BHK Flat (₹52.0L)</option>
                      <option>3 BHK Flat (₹78.0L)</option>
                      <option>Land Plot (2–5 Katha)</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <p className="text-xs font-medium text-red-600">{error}</p>
                )}

                <DirectionalButton
                  type="submit"
                  variant="dark"
                  magnetic={false}
                  className="w-full"
                >
                  Confirm Site Visit & Download Brochure PDF
                </DirectionalButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}