"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

export const EASE_OUT = "power3.out";
export const EASE_EXPO = "expo.out";

/**
 * Splits heading element(s) into words wrapped in .word-mask (overflow: hidden)
 * and staggers them upward on the Y-axis (no opacity fade).
 */
export function revealWords(
  targets,
  {
    trigger = null,
    start = "top 85%",
    delay = 0,
    stagger = 0.035,
    duration = 0.95,
  } = {}
) {
  const elements = gsap.utils.toArray(targets).filter(Boolean);
  if (!elements.length) return () => {};

  const splits = [];
  const wordInners = [];

  elements.forEach((el) => {
    const split = new SplitText(el, {
      type: "words",
      wordsClass: "word-inner",
    });
    splits.push(split);

    split.words.forEach((word) => {
      const mask = document.createElement("span");
      mask.className = "word-mask";
      word.parentNode.insertBefore(mask, word);
      mask.appendChild(word);
      wordInners.push(word);
    });
  });

  const tween = gsap.fromTo(
    wordInners,
    { yPercent: 118 },
    {
      yPercent: 0,
      duration,
      stagger,
      delay,
      ease: EASE_EXPO,
      ...(trigger
        ? {
            scrollTrigger: {
              trigger,
              start,
              toggleActions: "play none none none",
            },
          }
        : {}),
    }
  );

  return () => {
    tween.kill();
    splits.forEach((s) => s.revert());
  };
}

/**
 * Splits body text element(s) into lines wrapped in .line-mask (overflow: hidden)
 * and staggers them upward line-by-line on the Y-axis (no opacity fade).
 */
export function revealLines(
  targets,
  {
    trigger = null,
    start = "top 86%",
    delay = 0,
    stagger = 0.065,
    duration = 0.9,
  } = {}
) {
  const elements = gsap.utils.toArray(targets).filter(Boolean);
  if (!elements.length) return () => {};

  const splits = [];
  const lineInners = [];

  elements.forEach((el) => {
    const split = new SplitText(el, {
      type: "lines",
      linesClass: "line-inner",
    });
    splits.push(split);

    split.lines.forEach((line) => {
      const mask = document.createElement("span");
      mask.className = "line-mask";
      line.parentNode.insertBefore(mask, line);
      mask.appendChild(line);
      lineInners.push(line);
    });
  });

  const tween = gsap.fromTo(
    lineInners,
    { yPercent: 118 },
    {
      yPercent: 0,
      duration,
      stagger,
      delay,
      ease: EASE_EXPO,
      ...(trigger
        ? {
            scrollTrigger: {
              trigger,
              start,
              toggleActions: "play none none none",
            },
          }
        : {}),
    }
  );

  return () => {
    tween.kill();
    splits.forEach((s) => s.revert());
  };
}

export { gsap, ScrollTrigger, SplitText, useGSAP };