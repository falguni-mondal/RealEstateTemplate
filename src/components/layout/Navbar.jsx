"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, EASE_EXPO, EASE_OUT } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import DirectionalButton from "@/components/ui/DirectionalButton";
import { siteConfig } from "@/config/siteConfig";
import { Phone, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const headerRef = useRef(null);
  const navContainerRef = useRef(null);
  const indicatorRef = useRef(null);
  const pillRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const barTopRef = useRef(null);
  const barBottomRef = useRef(null);
  const toggleTlRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const isHoveringNav = useRef(false);

  const { lockScroll, unlockScroll, scrollTo } = useSmoothScroll();
  const { contextSafe } = useGSAP({ scope: headerRef });

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (!menuOpen) {
        setHidden(y > lastY.current && y > 160);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  // Synchronized Navbar Entrance (Plays right when Preloader curtains lift)
  useGSAP(
    () => {
      const navItems = gsap.utils.toArray(".nav-item-inner");
      gsap.set(navItems, { yPercent: 125 });

      const playNavIntro = () => {
        gsap.to(navItems, {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.045,
          ease: EASE_EXPO,
        });
      };

      if (typeof window !== "undefined" && window.__preloaderDone) {
        playNavIntro();
      } else {
        window.addEventListener("preloader:start-hero", playNavIntro, {
          once: true,
        });
      }

      // Build persistent 2-stage cinematic hamburger-to-cross timeline
      const tl = gsap.timeline({ paused: true });

      tl.to(
        barTopRef.current,
        { y: 4.5, duration: 0.2, ease: "power2.inOut" },
        0
      )
        .to(
          barBottomRef.current,
          { y: -4.5, width: "22px", duration: 0.2, ease: "power2.inOut" },
          0
        )
        .to(
          barTopRef.current,
          { rotate: 45, scaleX: 1.1, duration: 0.38, ease: EASE_EXPO },
          0.18
        )
        .to(
          barBottomRef.current,
          { rotate: -45, scaleX: 1.1, duration: 0.38, ease: EASE_EXPO },
          0.18
        );

      toggleTlRef.current = tl;

      return () => {
        window.removeEventListener("preloader:start-hero", playNavIntro);
      };
    },
    { scope: headerRef }
  );

  // Play / Reverse Hamburger Timeline & Fullscreen Menu Curtain
  useGSAP(
    () => {
      if (menuOpen) {
        toggleTlRef.current?.play();
        gsap.to(menuOverlayRef.current, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.65,
          ease: EASE_EXPO,
          overwrite: "auto",
        });
        gsap.fromTo(
          ".mobile-nav-inner",
          { yPercent: 115 },
          {
            yPercent: 0,
            stagger: 0.055,
            duration: 0.65,
            ease: EASE_EXPO,
            delay: 0.18,
            overwrite: "auto",
          }
        );
      } else {
        toggleTlRef.current?.reverse();
        gsap.to(menuOverlayRef.current, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.5,
          ease: EASE_EXPO,
          overwrite: "auto",
        });
      }
    },
    { dependencies: [menuOpen], scope: headerRef }
  );

  const handleLinkEnter = contextSafe((e) => {
    const nav = navContainerRef.current;
    const indicator = indicatorRef.current;
    const pill = pillRef.current;
    if (!nav || !indicator || !pill) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = e.currentTarget.getBoundingClientRect();
    const targetX = linkRect.left - navRect.left;
    const targetW = linkRect.width;

    gsap.killTweensOf([indicator, pill]);

    if (!isHoveringNav.current) {
      isHoveringNav.current = true;
      gsap.set(indicator, {
        x: targetX,
        width: targetW,
        transformOrigin: "left center",
        scaleX: 0,
      });
      gsap.to(indicator, {
        scaleX: 1,
        duration: 0.45,
        ease: EASE_EXPO,
      });

      gsap.set(pill, {
        x: targetX,
        width: targetW,
        scaleY: 0,
        transformOrigin: "bottom center",
      });
      gsap.to(pill, {
        scaleY: 1,
        duration: 0.35,
        ease: EASE_OUT,
      });
    } else {
      gsap.to(indicator, {
        x: targetX,
        width: targetW,
        scaleX: 1,
        duration: 0.45,
        ease: EASE_EXPO,
      });
      gsap.to(pill, {
        x: targetX,
        width: targetW,
        scaleY: 1,
        duration: 0.45,
        ease: EASE_EXPO,
      });
    }
  });

  const handleNavLeave = contextSafe(() => {
    const indicator = indicatorRef.current;
    const pill = pillRef.current;
    if (!indicator || !pill) return;

    isHoveringNav.current = false;
    gsap.killTweensOf([indicator, pill]);

    gsap.set(indicator, { transformOrigin: "right center" });
    gsap.to(indicator, {
      scaleX: 0,
      duration: 0.4,
      ease: EASE_EXPO,
    });
    gsap.set(pill, { transformOrigin: "top center" });
    gsap.to(pill, {
      scaleY: 0,
      duration: 0.3,
      ease: EASE_OUT,
    });
  });

  useEffect(() => {
    if (!menuOpen) return;
    lockScroll();
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [menuOpen, lockScroll, unlockScroll]);

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-40 w-full transition-transform duration-300 ${
        hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled
          ? "border-b border-ink/15 bg-white/95 backdrop-blur-md"
          : "border-b border-ink/15 bg-white"
      }`}
    >
      <div className="page-shell flex h-20 items-center justify-between">
        {/* Brand */}
        <div className="overflow-hidden">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollTo(0, { offset: 0 });
            }}
            className="nav-item-inner flex cursor-pointer items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center bg-ink font-heading text-base font-medium text-white">
              A<span className="text-accent">.</span>
            </span>
            <div>
              <span className="block font-heading text-lg font-semibold tracking-tight text-ink">
                {siteConfig.brand.name}
              </span>
              <span className="block text-[10px] font-normal tracking-widest text-ink-muted uppercase">
                {siteConfig.brand.tagline}
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Nav Links */}
        <nav
          ref={navContainerRef}
          onMouseLeave={handleNavLeave}
          aria-label="Primary Navigation"
          className="relative hidden items-center py-1 lg:flex"
        >
          <span
            ref={pillRef}
            className="pointer-events-none absolute top-1 bottom-1 left-0 scale-y-0 bg-cloud"
          />
          <span
            ref={indicatorRef}
            className="pointer-events-none absolute bottom-0 left-0 z-20 h-0.5 scale-x-0 bg-ink"
          />

          {siteConfig.navLinks.map((link) => (
            <div key={link.label} className="overflow-hidden">
              <a
                href={link.href}
                onClick={(e) => e.preventDefault()}
                onMouseEnter={handleLinkEnter}
                className="nav-item-inner group relative z-10 block cursor-pointer px-4 py-2 text-sm font-normal text-ink"
              >
                <span className="relative block overflow-hidden">
                  <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
                    {link.label}
                  </span>
                  <span className="absolute inset-0 block translate-y-full text-ink transition-transform duration-300 ease-out group-hover:translate-y-0">
                    {link.label}
                  </span>
                </span>
              </a>
            </div>
          ))}
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden items-center gap-5 lg:flex">
          <div className="overflow-hidden">
            <a
              href={`tel:${siteConfig.brand.phoneRaw}`}
              className="nav-item-inner hidden cursor-pointer items-center gap-2 text-sm font-normal text-ink transition-colors hover:text-accent xl:inline-flex"
            >
              <Phone className="h-4 w-4 text-accent" />
              {siteConfig.brand.phone}
            </a>
          </div>

          <div className="overflow-hidden">
            <div className="nav-item-inner">
              <DirectionalButton
                href="#site-visit"
                variant="dark"
                magnetic={false}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#site-visit");
                }}
                className="min-h-11 px-6 py-2.5 text-xs uppercase tracking-wider"
              >
                Book a Site Visit
                <ArrowUpRight className="h-4 w-4" />
              </DirectionalButton>
            </div>
          </div>
        </div>

        {/* Cinematic 2-Div Architectural Hamburger / Cross Button */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className={`group relative z-50 flex h-12 w-12 cursor-pointer flex-col items-end justify-center border px-3.5 transition-colors duration-300 lg:hidden ${
            menuOpen
              ? "border-ink bg-ink text-white"
              : "border-ink/20 bg-white text-ink hover:border-ink"
          }`}
        >
          <span
            ref={barTopRef}
            className="block h-[1.5px] w-[22px] origin-center bg-current will-change-transform"
          />
          <span
            ref={barBottomRef}
            className="mt-[7.5px] block h-[1.5px] w-[15px] origin-center bg-current transition-[width] duration-300 group-hover:w-[22px] will-change-transform"
          />
        </button>
      </div>

      {/* Light-Theme Full-Screen Mobile Menu */}
      <div
        ref={menuOverlayRef}
        data-lenis-prevent
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
        className="fixed inset-0 z-40 flex h-dvh flex-col justify-between overflow-y-auto border-b border-ink/15 bg-white pt-24 pb-10 text-ink lg:hidden"
      >
        <div className="page-shell my-auto">
          <ul className="divide-y divide-ink/10">
            {siteConfig.navLinks.map((link) => (
              <li key={link.label} className="overflow-hidden py-4">
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                  }}
                  className="mobile-nav-inner flex cursor-pointer items-center justify-between font-heading text-3xl font-medium text-ink transition-colors hover:text-accent"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="h-6 w-6 text-accent" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="page-shell flex flex-col gap-4 pt-6">
          <div className="overflow-hidden">
            <a
              href={`tel:${siteConfig.brand.phoneRaw}`}
              className="mobile-nav-inner inline-flex items-center gap-2 text-base font-medium text-ink"
            >
              <Phone className="h-4 w-4 text-accent" />
              {siteConfig.brand.phone}
            </a>
          </div>
          <DirectionalButton
            href="#site-visit"
            variant="dark"
            magnetic={false}
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              scrollTo("#site-visit");
            }}
            className="w-full"
          >
            Book a Site Visit
            <ArrowUpRight className="h-4 w-4" />
          </DirectionalButton>
        </div>
      </div>
    </header>
  );
}