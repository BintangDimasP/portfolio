"use client";

import React from "react";
import { motion } from "framer-motion";

interface HamburgerIconProps {
  isOpen: boolean;
  color?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  onClick?: () => void;
}

export function HamburgerIcon({
  isOpen,
  color = "#ffffff",
  size = 20,
  strokeWidth = 2.2,
  className = "",
  onClick,
}: HamburgerIconProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center justify-center focus:outline-none cursor-pointer ${className}`}
      style={{ width: size + 10, height: size + 10 }}
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top bar morphs directly into Diagonal 1 of X */}
        <motion.path
          d={isOpen ? "M 5 5 L 19 19" : "M 4 7 L 20 7"}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          animate={{
            d: isOpen ? "M 5 5 L 19 19" : "M 4 7 L 20 7",
          }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Middle bar fades out cleanly */}
        <motion.path
          d="M 4 12 L 20 12"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          animate={{
            opacity: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        />

        {/* Bottom bar morphs directly into Diagonal 2 of X */}
        <motion.path
          d={isOpen ? "M 5 19 L 19 5" : "M 4 17 L 20 17"}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          animate={{
            d: isOpen ? "M 5 19 L 19 5" : "M 4 17 L 20 17",
          }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </button>
  );
}

export default HamburgerIcon;