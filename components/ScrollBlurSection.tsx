"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ScrollBlurSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  maxBlur?: number;
}

export default function ScrollBlurSection({
  children,
  id,
  className = "",
  maxBlur = 8,
}: ScrollBlurSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["end end", "end start"],
  });

  // Smooth out scroll progression with a spring for buttery fluid response
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 30,
    restDelta: 0.001,
  });

  // Only blur at the very end when the section is almost completely scrolled past (0.7 -> 1.0)
  // Purely blur, no zoom out, no scale, no shift.
  // Crucial: return 'none' when blur <= 0.05 to prevent CSS filter from flattening 3D transforms / stacking context traps!
  const blurValue = useTransform(smoothProgress, [0, 0.7, 1], [0, 0, maxBlur]);
  const filter = useTransform(blurValue, (v) => (v > 0.05 ? `blur(${v}px)` : "none"));
  const willChange = useTransform(blurValue, (v) => (v > 0.05 ? "filter" : "auto"));

  return (
    <div ref={containerRef} id={id} className={`relative w-full ${className}`}>
      <motion.div
        style={{
          filter,
          willChange,
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
