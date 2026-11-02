"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { gsap, useGSAP, EASE_EXPO } from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";

const WB_UNITS = {
  sqft: { label: "Square Feet (Sq. Ft.)", toSqFt: 1 },
  sqm: { label: "Square Meter (Sq. M.)", toSqFt: 10.76391 },
  katha: { label: "Katha (WB · 720 Sq. Ft.)", toSqFt: 720 },
  decimal: { label: "Decimal / Satak (435.6 Sq. Ft.)", toSqFt: 435.6 },
  bigha: { label: "Bigha (20 Katha · 14,400 Sq. Ft.)", toSqFt: 14400 },
};

const TABS = [
  { id: "emi", label: "EMI Calculator" },
  { id: "afford", label: "Home Affordability" },
  { id: "area", label: "WB Land Converter" },
];

const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(n || 0)));

export default function CustomerTools() {
  const sectionRef = useRef(null);
  const tabBarRef = useRef(null);
  const activeBgRef = useRef(null);
  const tabBtnRefs = useRef({});
  const panelRefs = useRef({});

  const [tab, setTab] = useState("emi");
  const activeTabRef = useRef("emi");

  // EMI State
  const [loan, setLoan] = useState(4000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  // Affordability State
  const [income, setIncome] = useState(90000);
  const [otherEmi, setOtherEmi] = useState(5000);
  const [downPay, setDownPay] = useState(1000000);

  // WB Area Converter State
  const [areaVal, setAreaVal] = useState("3");
  const [unit, setUnit] = useState("katha");

  const { contextSafe } = useGSAP({ scope: sectionRef });

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        ".tools-shell",
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
    },
    { scope: sectionRef }
  );

  const moveTabIndicator = contextSafe((targetId, immediate = false) => {
    const bar = tabBarRef.current;
    const btn = tabBtnRefs.current[targetId];
    const bg = activeBgRef.current;
    if (!bar || !btn || !bg) return;

    const x = btn.offsetLeft;
    const y = btn.offsetTop;
    const width = btn.offsetWidth;
    const height = btn.offsetHeight;

    if (immediate) {
      gsap.set(bg, { x, y, width, height });
    } else {
      gsap.to(bg, {
        x,
        y,
        width,
        height,
        duration: 0.55,
        ease: EASE_EXPO,
        overwrite: "auto",
      });
    }
  });

  useEffect(() => {
    moveTabIndicator(activeTabRef.current, true);
    let lastW = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== lastW) {
        lastW = window.innerWidth;
        moveTabIndicator(activeTabRef.current, true);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleTabSwitch = contextSafe((newTab) => {
    if (newTab === activeTabRef.current) return;
    activeTabRef.current = newTab;
    moveTabIndicator(newTab, false);
    setTab(newTab);

    const targetPanel = panelRefs.current[newTab];
    if (targetPanel) {
      gsap.killTweensOf(targetPanel);
      gsap.fromTo(
        targetPanel,
        { clipPath: "inset(100% 0% 0% 0%)", y: 18 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          y: 0,
          duration: 0.6,
          ease: EASE_EXPO,
        }
      );
    }
  });

  const emiStats = useMemo(() => {
    const P = Math.max(100000, Number(loan) || 0);
    const r = Math.max(0.1, Number(rate) || 8.5) / 12 / 100;
    const n = Math.max(12, (Number(years) || 1) * 12);
    const f = Math.pow(1 + r, n);
    const emi = (P * r * f) / (f - 1);
    const total = emi * n;
    const interest = Math.max(0, total - P);
    const principalPct = Math.round((P / total) * 100);
    return { emi, interest, total, principalPct };
  }, [loan, rate, years]);

  const affordStats = useMemo(() => {
    const maxEmi = Math.max(0, income * 0.5 - otherEmi);
    const r = 8.5 / 12 / 100;
    const n = 240;
    const f = Math.pow(1 + r, n);
    const eligibleLoan = maxEmi > 0 ? (maxEmi * (f - 1)) / (r * f) : 0;
    return { maxEmi, eligibleLoan, budget: eligibleLoan + downPay };
  }, [income, otherEmi, downPay]);

  const conversions = useMemo(() => {
    const v = parseFloat(areaVal);
    const safe = Number.isFinite(v) && v >= 0 ? v : 0;
    const sqFt = safe * WB_UNITS[unit].toSqFt;
    return Object.entries(WB_UNITS).map(([k, m]) => ({
      key: k,
      label: m.label,
      val: (sqFt / m.toSqFt).toLocaleString("en-IN", { maximumFractionDigits: 3 }),
    }));
  }, [areaVal, unit]);

  const radius = 64;
  const circ = 2 * Math.PI * radius;
  const strokeDash = `${(emiStats.principalPct / 100) * circ} ${circ}`;

  return (
    <section id="calculators" ref={sectionRef} className="bg-cloud py-24 sm:py-28 md:py-36">
      <div className="page-shell">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            title="Plan your monthly EMI, budget & land area."
            subtitle="Switch between our EMI calculator, home affordability planner, and West Bengal land unit converter."
          />

          {/* Sharp Tab Bar with Continuously Shifting Indicator */}
          <div
            ref={tabBarRef}
            className="relative inline-flex flex-wrap self-start border border-ink/20 bg-white p-1 lg:self-auto"
          >
            <span
              ref={activeBgRef}
              className="pointer-events-none absolute top-0 left-0 z-0 bg-ink will-change-transform"
            />
            {TABS.map((t) => (
              <button
                key={t.id}
                ref={(el) => (tabBtnRefs.current[t.id] = el)}
                type="button"
                onClick={() => handleTabSwitch(t.id)}
                className={`relative z-10 min-h-11 cursor-pointer bg-transparent px-5 py-2.5 text-xs font-normal tracking-wide transition-colors duration-300 sm:text-sm ${
                  tab === t.id ? "text-white" : "text-ink-muted hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Locked-Height CSS Grid Stack: All 3 Panels Share col-start-1 row-start-1 */}
        <div className="tools-shell mt-12 border border-ink/15 bg-white p-6 md:p-12">
          <div className="grid grid-cols-1 items-center">
            {/* PANEL 1: EMI CALCULATOR */}
            <div
              ref={(el) => (panelRefs.current.emi = el)}
              aria-hidden={tab !== "emi"}
              className={`col-start-1 row-start-1 transition-opacity duration-200 ${
                tab === "emi"
                  ? "visible pointer-events-auto z-10 opacity-100"
                  : "invisible pointer-events-none z-0 opacity-0"
              }`}
            >
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
                <div className="space-y-8 lg:col-span-7">
                  <div>
                    <div className="mb-2 flex justify-between text-sm font-normal text-ink">
                      <span>Loan Amount</span>
                      <span className="font-heading text-lg font-medium">
                        {formatINR(loan)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={500000}
                      max={15000000}
                      step={100000}
                      value={loan}
                      onChange={(e) => setLoan(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between text-sm font-normal text-ink">
                      <span>Interest Rate (% p.a.)</span>
                      <span className="font-heading text-lg font-medium">
                        {rate.toFixed(2)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={6.5}
                      max={12.5}
                      step={0.1}
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between text-sm font-normal text-ink">
                      <span>Loan Tenure</span>
                      <span className="font-heading text-lg font-medium">
                        {years} Years
                      </span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={30}
                      step={1}
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-6 border border-ink/15 bg-cloud p-8 sm:flex-row lg:col-span-5">
                  <div className="relative flex h-40 w-40 shrink-0 items-center justify-center">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 150 150">
                      <circle
                        cx="75"
                        cy="75"
                        r={radius}
                        fill="none"
                        stroke="#B8863B"
                        strokeWidth="12"
                      />
                      <circle
                        cx="75"
                        cy="75"
                        r={radius}
                        fill="none"
                        stroke="#0F172A"
                        strokeWidth="12"
                        strokeDasharray={strokeDash}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="block text-[10px] font-normal tracking-wider text-ink-muted uppercase">
                        Principal
                      </span>
                      <span className="font-heading text-xl font-medium text-ink">
                        {emiStats.principalPct}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full space-y-3">
                    <span className="text-xs font-normal tracking-wider text-ink-muted uppercase">
                      Monthly EMI
                    </span>
                    <p className="font-heading text-3xl font-medium text-ink md:text-4xl">
                      {formatINR(emiStats.emi)}
                    </p>
                    <div className="border-t border-ink/10 pt-3 text-sm font-light text-ink-muted">
                      <div>
                        Principal:{" "}
                        <span className="font-normal text-ink">
                          {formatINR(loan)}
                        </span>
                      </div>
                      <div className="mt-1">
                        Interest:{" "}
                        <span className="font-normal text-ink">
                          {formatINR(emiStats.interest)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL 2: HOME AFFORDABILITY */}
            <div
              ref={(el) => (panelRefs.current.afford = el)}
              aria-hidden={tab !== "afford"}
              className={`col-start-1 row-start-1 transition-opacity duration-200 ${
                tab === "afford"
                  ? "visible pointer-events-auto z-10 opacity-100"
                  : "invisible pointer-events-none z-0 opacity-0"
              }`}
            >
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
                <div className="space-y-6 lg:col-span-7">
                  <div>
                    <div className="mb-2 flex justify-between text-sm font-normal text-ink">
                      <span>Monthly Family Income</span>
                      <span className="font-heading text-lg font-medium">
                        {formatINR(income)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={30000}
                      max={500000}
                      step={5000}
                      value={income}
                      onChange={(e) => setIncome(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between text-sm font-normal text-ink">
                      <span>Existing Monthly EMIs</span>
                      <span className="font-heading text-lg font-medium">
                        {formatINR(otherEmi)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={150000}
                      step={2500}
                      value={otherEmi}
                      onChange={(e) => setOtherEmi(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between text-sm font-normal text-ink">
                      <span>Down Payment Available</span>
                      <span className="font-heading text-lg font-medium">
                        {formatINR(downPay)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={300000}
                      max={8000000}
                      step={100000}
                      value={downPay}
                      onChange={(e) => setDownPay(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="border border-ink/15 bg-cloud p-8 text-ink lg:col-span-5">
                  <span className="text-xs font-normal tracking-wider text-accent uppercase">
                    Recommended Home Budget
                  </span>
                  <p className="mt-2 font-heading text-3xl font-medium text-ink md:text-4xl">
                    {formatINR(affordStats.budget)}
                  </p>
                  <div className="mt-6 space-y-2 border-t border-ink/15 pt-4 text-sm font-light text-ink-muted">
                    <div className="flex justify-between">
                      <span>Eligible Bank Loan (20 Yrs):</span>
                      <span className="font-medium text-ink">
                        {formatINR(affordStats.eligibleLoan)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your Down Payment:</span>
                      <span className="font-medium text-accent">
                        {formatINR(downPay)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL 3: WEST BENGAL AREA CONVERTER */}
            <div
              ref={(el) => (panelRefs.current.area = el)}
              aria-hidden={tab !== "area"}
              className={`col-start-1 row-start-1 transition-opacity duration-200 ${
                tab === "area"
                  ? "visible pointer-events-auto z-10 opacity-100"
                  : "invisible pointer-events-none z-0 opacity-0"
              }`}
            >
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-normal tracking-wider text-ink-muted uppercase">
                      Enter Land / Flat Area
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={areaVal}
                      onChange={(e) => setAreaVal(e.target.value)}
                      className="mt-2 min-h-12 w-full border border-ink/20 bg-cloud px-4 font-heading text-xl font-medium text-ink"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-normal tracking-wider text-ink-muted uppercase">
                      Select Measurement Unit
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="mt-2 min-h-12 w-full cursor-pointer border border-ink/20 bg-cloud px-4 text-sm font-normal text-ink"
                    >
                      {Object.entries(WB_UNITS).map(([k, m]) => (
                        <option key={k} value={k}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                  {conversions.map((c) => (
                    <div
                      key={c.key}
                      className={`border p-5 ${
                        c.key === unit
                          ? "border-accent bg-cloud text-ink"
                          : "border-ink/15 bg-white text-ink"
                      }`}
                    >
                      <span className="block text-xs font-light text-ink-muted">
                        {c.label}
                      </span>
                      <span className="mt-2 block font-heading text-2xl font-medium">
                        {c.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}