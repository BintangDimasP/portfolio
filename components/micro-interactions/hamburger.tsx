"use client";

import React from "react";

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
  strokeWidth = 2,
  className = "",
  onClick,
}: HamburgerIconProps) {
  const halfTravel = size * 0.35 - strokeWidth / 2;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center justify-center focus:outline-none cursor-pointer ${className}`}
      style={{ width: size + 10, height: size + 10 }}
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
    >
      <div
        className="relative flex flex-col justify-between"
        style={{ width: size, height: size * 0.7 }}
      >
        {/* Top bar */}
        <span
          className="block w-full rounded-full transition-all duration-300 ease-out origin-center"
          style={{
            height: strokeWidth,
            backgroundColor: color,
            transform: isOpen
              ? `translateY(${halfTravel}px) rotate(45deg)`
              : "none",
          }}
        />

        {/* Middle bar */}
        <span
          className="block w-full rounded-full transition-all duration-200 ease-out origin-center"
          style={{
            height: strokeWidth,
            backgroundColor: color,
            opacity: isOpen ? 0 : 1,
            transform: isOpen ? "scaleX(0)" : "scaleX(1)",
          }}
        />

        {/* Bottom bar */}
        <span
          className="block w-full rounded-full transition-all duration-300 ease-out origin-center"
          style={{
            height: strokeWidth,
            backgroundColor: color,
            transform: isOpen
              ? `translateY(-${halfTravel}px) rotate(-45deg)`
              : "none",
          }}
        />
      </div>
    </button>
  );
}

export default HamburgerIcon;