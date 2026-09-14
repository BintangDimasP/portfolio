"use client";

import React from 'react';

export interface GlassIconsItem {
  icon: React.ReactElement;
  color: string;
  label?: string;
  customClass?: string;
}

export interface GlassIconsProps {
  items: GlassIconsItem[];
  className?: string;
  showLabel?: boolean;
}

const gradientMapping: Record<string, string> = {
  black: 'linear-gradient(145deg, #2b2b2b, #0d0d0d)',
  dark: 'linear-gradient(145deg, #383838, #171717)',
  gray: 'linear-gradient(145deg, #4b5563, #1f2937)',
  white: 'linear-gradient(145deg, #ffffff, #e5e5e5)',
  blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
  purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
  red: 'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
  indigo: 'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))',
  orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
  green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))',
  cyan: 'linear-gradient(145deg, #00d8ff, #0284c7)',
  yellow: 'linear-gradient(145deg, #f7df1e, #d97706)',
  teal: 'linear-gradient(145deg, #14b8a6, #0f766e)'
};

export const GlassIcons: React.FC<GlassIconsProps> = ({ items, className, showLabel = false }) => {
  const getBackgroundStyle = (color: string): React.CSSProperties => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  return (
    <div className={`grid grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3.5 md:gap-4 py-1 overflow-visible ${className || ''}`}>
      {items.map((item, index) => (
        <div key={index} className="flex flex-col items-center justify-center p-0.5 sm:p-1">
          <button
            type="button"
            aria-label={item.label || `Icon ${index}`}
            title={item.label}
            className={`relative bg-transparent outline-none border-none cursor-pointer w-[4.6em] h-[4.6em] [perspective:24em] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] group hover:z-30 focus:z-30 ${
              item.customClass || ''
            }`}
          >
            {/* Background 3D rotating layer */}
            <span
              className="absolute top-0 left-0 w-full h-full rounded-[1.3em] block transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[100%_100%] rotate-[12deg] [will-change:transform] group-hover:[transform:rotate(22deg)_translate3d(-0.45em,-0.45em,0.45em)] shadow-md"
              style={{
                ...getBackgroundStyle(item.color),
                boxShadow: '0.4em -0.4em 0.6em rgba(0, 0, 0, 0.14)'
              }}
            ></span>

            {/* Glass layer with blur */}
            <span
              className="absolute top-0 left-0 w-full h-full rounded-[1.3em] bg-white/70 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[80%_50%] flex backdrop-blur-[0.75em] [-webkit-backdrop-filter:blur(0.75em)] [-moz-backdrop-filter:blur(0.75em)] [will-change:transform] transform group-hover:[transform:translate3d(0,0,1.8em)] shadow-sm"
              style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
              }}
            >
              <span className="m-auto flex h-[2.7em] w-[2.7em] items-center justify-center" aria-hidden="true">
                {item.icon}
              </span>
            </span>

            {/* Optional Tooltip text on hover */}
            {showLabel && item.label && (
              <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 text-center whitespace-nowrap text-xs font-semibold text-neutral-800 opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] group-hover:opacity-100 group-hover:translate-y-2.5 z-20">
                {item.label}
              </span>
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

export default GlassIcons;
