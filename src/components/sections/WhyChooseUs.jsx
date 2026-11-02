"use client";

import { useRef, useState, useEffect } from "react";
import {
  gsap,
  useGSAP,
  EASE_EXPO,
  EASE_OUT,
  revealWords,
  revealLines,
} from "@/lib/gsap";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import SectionHeading from "@/components/ui/SectionHeading";
import DirectionalButton from "@/components/ui/DirectionalButton";
import ElasticLine from "@/components/ui/ElasticLine";
import { siteConfig } from "@/config/siteConfig";
import {
  ShieldCheck,
  Hammer,
  Clock,
  FileCheck2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Star,
  Quote,
  MessageSquarePlus,
  X,
} from "lucide-react";

const icons = [ShieldCheck, Hammer, Clock, FileCheck2];
const AUTO_ADVANCE_SECONDS = 5.5;

export default function WhyChooseUs() {
  const sectionRef = useRef(null);
  const storyStageRef = useRef(null);
  const storyTabsBarRef = useRef(null);
  const storyActiveBgRef = useRef(null);
  const storyTabRefs = useRef([]);
  const storyLayerRefs = useRef([]);
  const storyImgRefs = useRef([]);
  const storyParallaxRef = useRef(null);
  const storyPanelRefs = useRef([]);
  const masterProgressRef = useRef(null);
  const progressTweenRef = useRef(null);
  const modalBoxRef = useRef(null);

  const [testimonials, setTestimonials] = useState(siteConfig.testimonials);
  const [activeStory, setActiveStory] = useState(0);
  const activeStoryRef = useRef(0);
  const testimonialsLenRef = useRef(siteConfig.testimonials.length);
  const zCounterRef = useRef(10);

  // Interactive Feedback Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [fbName, setFbName] = useState("");
  const [fbRole, setFbRole] = useState("");
  const [fbUnit, setFbUnit] = useState("2 BHK Family Flat · City Centre");
  const [fbRating, setFbRating] = useState(5);
  const [fbHoverRating, setFbHoverRating] = useState(0);
  const [fbQuote, setFbQuote] = useState("");
  const [fbError, setFbError] = useState("");
  const [fbSuccess, setFbSuccess] = useState(false);

  const { lockScroll, unlockScroll } = useSmoothScroll();
  const { contextSafe } = useGSAP({ scope: sectionRef });

  testimonialsLenRef.current = testimonials.length;
  const currentStory = testimonials[activeStory] || testimonials[0];

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

      const cleanupWhyWords = revealWords(".why-title-word", {
        trigger: ".why-grid",
        start: "top 82%",
        stagger: 0.03,
        duration: 0.9,
      });

      const cleanupWhyLines = revealLines(".why-body-line", {
        trigger: ".why-grid",
        start: "top 80%",
        delay: 0.1,
        stagger: 0.05,
        duration: 0.85,
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.fromTo(
          ".why-speed-fast",
          { y: 115 },
          {
            y: -115,
            ease: "none",
            scrollTrigger: {
              trigger: ".why-grid",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          }
        );

        gsap.fromTo(
          ".why-speed-slow",
          { y: -85 },
          {
            y: 85,
            ease: "none",
            scrollTrigger: {
              trigger: ".why-grid",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          }
        );
      });

      gsap.fromTo(
        storyStageRef.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.1,
          ease: EASE_EXPO,
          scrollTrigger: {
            trigger: storyStageRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        storyParallaxRef.current,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: storyStageRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      storyLayerRefs.current.forEach((layer, i) => {
        if (!layer) return;
        gsap.set(layer, {
          zIndex: i === 0 ? 10 : 1,
          clipPath: "inset(0% 0% 0% 0%)",
        });
      });

      return () => {
        cleanupWhyWords();
        cleanupWhyLines();
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  const moveStoryHighlight = contextSafe((idx, immediate = false) => {
    const bar = storyTabsBarRef.current;
    const btn = storyTabRefs.current[idx];
    const bg = storyActiveBgRef.current;
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

  const startAutoProgress = contextSafe(() => {
    if (!masterProgressRef.current) return;
    progressTweenRef.current?.kill();

    gsap.set(masterProgressRef.current, {
      scaleX: 0,
      transformOrigin: "left center",
    });

    progressTweenRef.current = gsap.to(masterProgressRef.current, {
      scaleX: 1,
      duration: AUTO_ADVANCE_SECONDS,
      ease: "none",
      onComplete: () => {
        switchStory(activeStoryRef.current + 1);
      },
    });
  });

  const switchStory = contextSafe((nextIdx) => {
    const total = testimonialsLenRef.current;
    const normalized = (nextIdx + total) % total;
    if (normalized === activeStoryRef.current) {
      startAutoProgress();
      return;
    }

    activeStoryRef.current = normalized;
    moveStoryHighlight(normalized, false);
    setActiveStory(normalized);

    zCounterRef.current += 1;
    const nextLayer = storyLayerRefs.current[normalized];
    const nextImg = storyImgRefs.current[normalized];
    if (nextLayer && nextImg) {
      gsap.killTweensOf([nextLayer, nextImg]);
      gsap.set(nextLayer, {
        zIndex: zCounterRef.current,
        clipPath: "inset(100% 0% 0% 0%)",
      });
      gsap.to(nextLayer, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.75,
        ease: EASE_EXPO,
        overwrite: "auto",
      });
      gsap.fromTo(
        nextImg,
        { scale: 1.18 },
        {
          scale: 1.04,
          duration: 0.9,
          ease: EASE_OUT,
          overwrite: "auto",
        }
      );
    }

    const incomingPanel = storyPanelRefs.current[normalized];
    if (incomingPanel) {
      const animItems = incomingPanel.querySelectorAll(".story-anim-item");
      gsap.killTweensOf(animItems);
      gsap.fromTo(
        animItems,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.65,
          stagger: 0.045,
          ease: EASE_EXPO,
        }
      );
    }

    startAutoProgress();
  });

  useEffect(() => {
    moveStoryHighlight(activeStoryRef.current, true);
    startAutoProgress();

    let lastW = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== lastW) {
        lastW = window.innerWidth;
        moveStoryHighlight(activeStoryRef.current, true);
      }
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      progressTweenRef.current?.kill();
    };
  }, []);

  // Lock scroll & pause progress bar while Give Feedback Modal is open
  useEffect(() => {
    if (!modalOpen) {
      progressTweenRef.current?.play();
      return;
    }

    lockScroll();
    progressTweenRef.current?.pause();

    if (modalBoxRef.current) {
      gsap.fromTo(
        modalBoxRef.current,
        { clipPath: "inset(100% 0% 0% 0%)", y: 24 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          y: 0,
          duration: 0.55,
          ease: EASE_EXPO,
        }
      );
    }

    const onKey = (e) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [modalOpen, lockScroll, unlockScroll]);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (fbName.trim().length < 2) {
      setFbError("Please enter your full name.");
      return;
    }
    if (fbQuote.trim().length < 12) {
      setFbError("Please share a few words about your experience.");
      return;
    }

    const newEntry = {
      name: fbName.trim(),
      role: fbRole.trim() || "Homeowner, Durgapur",
      unit: fbUnit,
      rating: fbRating,
      handover: "Verified Customer Submission",
      quote: fbQuote.trim(),
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    };

    const nextList = [...testimonials, newEntry];
    const newIndex = nextList.length - 1;
    testimonialsLenRef.current = nextList.length;
    setTestimonials(nextList);
    setFbError("");
    setFbSuccess(true);

    setTimeout(() => {
      setFbSuccess(false);
      setModalOpen(false);
      setFbName("");
      setFbRole("");
      setFbQuote("");
      setFbRating(5);
      setTimeout(() => {
        switchStory(newIndex);
      }, 80);
    }, 1100);
  };

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

        {/* Gravitational Tilt + Strong Differential Scroll Speed Pillars */}
        <div className="why-grid mt-14 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:py-12">
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

        <ElasticLine className="my-20 md:my-28" />

        {/* DEDICATED HOMEOWNER FEEDBACKS & VERIFIED REVIEWS SECTION */}
        <div className="pt-4">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-4 inline-flex flex-wrap items-center gap-3 border border-ink/15 bg-cloud px-4 py-2">
                <div className="flex items-center gap-1 text-accent">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-medium tracking-wider text-ink uppercase">
                  4.9 / 5.0 Verified Homeowner Feedback · 2,800+ Families
                </span>
              </div>

              <SectionHeading
                title="Customer feedbacks & family stories."
                subtitle="Unfiltered reviews from homeowners, doctors, and engineers living in our Durgapur developments."
              />
            </div>

            {/* Give Feedback CTA + Prev / Next Controls */}
            <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
              <DirectionalButton
                type="button"
                variant="outline"
                onClick={() => setModalOpen(true)}
                className="min-h-12 px-6 py-3 text-xs uppercase tracking-wider"
              >
                <MessageSquarePlus className="h-4 w-4 text-accent" />
                Give Feedback
              </DirectionalButton>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous customer feedback"
                  onClick={() => switchStory(activeStory - 1)}
                  className="flex h-12 w-12 cursor-pointer items-center justify-center border border-ink/20 bg-white text-ink transition hover:bg-ink hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next customer feedback"
                  onClick={() => switchStory(activeStory + 1)}
                  className="flex h-12 w-12 cursor-pointer items-center justify-center border border-ink/20 bg-white text-ink transition hover:bg-ink hover:text-white"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Customer Feedback Stage */}
          <div
            ref={storyStageRef}
            className="mt-12 border border-ink/15 bg-cloud"
          >
            {/* Sleeker 3px Auto-Advancing Loading Bar */}
            <div className="relative h-[3px] w-full overflow-hidden bg-ink/10">
              <div
                ref={masterProgressRef}
                className="h-full w-full origin-left scale-x-0 bg-accent will-change-transform"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left 5 Cols: Pre-Mounted Multi-Layer Curtain Image with Parallax */}
              <div className="relative min-h-[360px] overflow-hidden border-b border-ink/15 bg-white sm:min-h-[440px] lg:col-span-5 lg:border-r lg:border-b-0">
                <div
                  ref={storyParallaxRef}
                  className="relative -top-[12%] h-[124%] w-full will-change-transform"
                >
                  {testimonials.map((t, idx) => (
                    <div
                      key={`${t.name}-${idx}`}
                      ref={(el) => (storyLayerRefs.current[idx] = el)}
                      className="absolute inset-0 overflow-hidden bg-cloud will-change-[clip-path]"
                    >
                      <img
                        ref={(el) => (storyImgRefs.current[idx] = el)}
                        src={t.image}
                        alt={t.unit}
                        className="h-full w-full scale-105 object-cover will-change-transform"
                      />
                    </div>
                  ))}
                </div>

                {/* Floating Verified Handover Badge */}
                <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between border border-ink/15 bg-white/95 px-4 py-3 backdrop-blur-xs">
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald">
                    <CheckCircle2 className="h-4 w-4" />
                    {currentStory.handover}
                  </span>
                  <span className="text-[11px] font-normal tracking-wider text-ink-muted uppercase">
                    Verified Buyer Review
                  </span>
                </div>
              </div>

              {/* Right 7 Cols: Locked-Height Stacked Feedback Panels */}
              <div className="relative grid grid-cols-1 items-center overflow-hidden p-8 sm:p-12 md:p-16 lg:col-span-7">
                <Quote
                  aria-hidden="true"
                  className="pointer-events-none absolute top-6 right-8 h-28 w-28 text-ink/5 sm:h-36 sm:w-36"
                />

                {testimonials.map((t, idx) => {
                  const isCurrent = activeStory === idx;
                  const starsCount = t.rating || 5;
                  return (
                    <div
                      key={`${t.name}-${idx}`}
                      ref={(el) => (storyPanelRefs.current[idx] = el)}
                      aria-hidden={!isCurrent}
                      className={`col-start-1 row-start-1 flex flex-col justify-between transition-opacity duration-200 ${
                        isCurrent
                          ? "visible pointer-events-auto z-10 opacity-100"
                          : "invisible pointer-events-none z-0 opacity-0"
                      }`}
                    >
                      <div>
                        <div className="overflow-hidden">
                          <div className="story-anim-item flex flex-wrap items-center gap-3">
                            <span className="inline-block border border-ink/15 bg-white px-4 py-1.5 text-xs font-medium tracking-wider text-ink uppercase">
                              {t.unit}
                            </span>
                            <div className="flex items-center gap-1 text-accent">
                              {Array.from({ length: starsCount }).map((_, s) => (
                                <Star key={s} className="h-4 w-4 fill-current" />
                              ))}
                              <span className="ml-1 text-xs font-medium text-ink">
                                {starsCount}.0 / 5.0
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 overflow-hidden">
                          <blockquote className="story-anim-item font-heading text-[clamp(1.35rem,2.3vw,2.15rem)] font-normal leading-[1.3] tracking-tight text-ink">
                            “{t.quote}”
                          </blockquote>
                        </div>
                      </div>

                      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-ink/15 pt-6">
                        <div className="overflow-hidden">
                          <div className="story-anim-item flex items-center gap-4">
                            <img
                              src={t.avatar}
                              alt={t.name}
                              className="h-14 w-14 border border-ink/15 object-cover"
                            />
                            <div>
                              <strong className="block font-heading text-lg font-medium text-ink">
                                {t.name}
                              </strong>
                              <span className="text-xs font-light text-ink-muted">
                                {t.role}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="overflow-hidden">
                          <span className="story-anim-item block border border-emerald/30 bg-white px-3.5 py-1.5 text-[11px] font-medium tracking-wider text-emerald uppercase">
                            Verified Homeowner
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Interactive Customer Feedback Selector Bar */}
            <div
              ref={storyTabsBarRef}
              className="relative grid grid-cols-1 border-t border-ink/15 bg-white sm:grid-cols-3"
            >
              <span
                ref={storyActiveBgRef}
                className="pointer-events-none absolute top-0 left-0 z-0 bg-ink will-change-transform"
              />
              {testimonials.map((t, idx) => {
                const isSelected = activeStory === idx;
                const starsCount = t.rating || 5;
                return (
                  <button
                    key={`${t.name}-${idx}`}
                    ref={(el) => (storyTabRefs.current[idx] = el)}
                    type="button"
                    onClick={() => switchStory(idx)}
                    className={`relative z-10 flex cursor-pointer items-center gap-3.5 border-b border-ink/10 bg-transparent p-5 text-left transition-colors duration-300 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0 ${
                      isSelected ? "text-white" : "text-ink hover:bg-cloud/50"
                    }`}
                  >
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-11 w-11 shrink-0 border border-current/20 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 text-accent">
                        {Array.from({ length: starsCount }).map((_, s) => (
                          <Star key={s} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                      <span className="mt-1 block truncate font-heading text-sm font-medium">
                        {t.name}
                      </span>
                      <span
                        className={`block truncate text-[11px] font-light ${
                          isSelected ? "text-white/75" : "text-ink-muted"
                        }`}
                      >
                        {t.unit}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE GIVE FEEDBACK MODAL */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Share your homeowner feedback"
          data-lenis-prevent
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-xs"
        >
          <div
            ref={modalBoxRef}
            className="relative max-h-[90svh] w-full max-w-xl overflow-y-auto border border-ink/20 bg-white p-6 text-ink shadow-2xl sm:p-10"
          >
            <div className="flex items-start justify-between gap-4 border-b border-ink/15 pb-5">
              <div>
                <span className="block text-[11px] font-medium tracking-widest text-accent uppercase">
                  Homeowner Review Portal
                </span>
                <h3 className="mt-1 font-heading text-2xl font-medium text-ink">
                  Share Your Aurelia Experience
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close feedback modal"
                onClick={() => setModalOpen(false)}
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center border border-ink/15 bg-cloud text-ink transition hover:bg-ink hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {fbSuccess ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald" />
                <h4 className="mt-4 font-heading text-2xl font-medium text-ink">
                  Thank You for Your Feedback!
                </h4>
                <p className="mt-2 text-sm font-light text-ink-muted">
                  Your review has been added to our homeowner showcase.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="mt-6 space-y-5" noValidate>
                {/* Interactive 5-Star Selector */}
                <div>
                  <label className="block text-xs font-normal tracking-wider text-ink-muted uppercase">
                    Your Overall Rating
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const active = (fbHoverRating || fbRating) >= starVal;
                      return (
                        <button
                          key={starVal}
                          type="button"
                          onMouseEnter={() => setFbHoverRating(starVal)}
                          onMouseLeave={() => setFbHoverRating(0)}
                          onClick={() => setFbRating(starVal)}
                          className="flex h-10 w-10 cursor-pointer items-center justify-center border border-ink/15 bg-cloud transition hover:border-accent"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              active ? "fill-accent text-accent" : "text-ink/25"
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="ml-2 text-xs font-medium text-ink">
                      {fbRating}.0 / 5.0 Stars
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-normal text-ink-muted">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fbName}
                      onChange={(e) => setFbName(e.target.value)}
                      placeholder="e.g. Anirban & Soma Sen"
                      className="mt-1.5 min-h-11 w-full border border-ink/20 bg-cloud px-4 text-sm text-ink focus:border-ink focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-normal text-ink-muted">
                      Profession / Designation
                    </label>
                    <input
                      type="text"
                      value={fbRole}
                      onChange={(e) => setFbRole(e.target.value)}
                      placeholder="e.g. Professor, NIT Durgapur"
                      className="mt-1.5 min-h-11 w-full border border-ink/20 bg-cloud px-4 text-sm text-ink focus:border-ink focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-normal text-ink-muted">
                    Select Your Residence / Plot
                  </label>
                  <select
                    value={fbUnit}
                    onChange={(e) => setFbUnit(e.target.value)}
                    className="mt-1.5 min-h-11 w-full cursor-pointer border border-ink/20 bg-cloud px-4 text-sm text-ink focus:border-ink focus:bg-white focus:outline-none"
                  >
                    <option>1 BHK Smart Flat · City Centre</option>
                    <option>2 BHK Family Flat · City Centre</option>
                    <option>3 BHK Corner Flat · Bidhannagar</option>
                    <option>Residential Land Plot · Bamunara</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-normal text-ink-muted">
                    Your Experience & Feedback *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={fbQuote}
                    onChange={(e) => setFbQuote(e.target.value)}
                    placeholder="Share your experience with construction quality, legal clarity, or handover..."
                    className="mt-1.5 w-full border border-ink/20 bg-cloud p-4 text-sm text-ink focus:border-ink focus:bg-white focus:outline-none"
                  />
                </div>

                {fbError && (
                  <p className="text-xs font-medium text-red-600">{fbError}</p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="min-h-12 cursor-pointer border border-ink/20 bg-white px-6 text-xs font-medium uppercase tracking-wider text-ink hover:bg-cloud"
                  >
                    Cancel
                  </button>
                  <DirectionalButton type="submit" variant="dark">
                    Submit Feedback
                  </DirectionalButton>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}