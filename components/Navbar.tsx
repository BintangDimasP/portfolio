"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HamburgerIcon } from "@/components/micro-interactions/hamburger";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectPreviewOpen, setProjectPreviewOpen] = useState(false);

  // Hide Navbar completely on all admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Observe whether a project preview modal is currently open
  useEffect(() => {
    const checkPreviewState = () => {
      const isOpen = document.body.getAttribute("data-project-preview-open") === "true";
      setProjectPreviewOpen(isOpen);
      if (isOpen) {
        setMobileMenuOpen(false);
      }
    };

    checkPreviewState();
    const observer = new MutationObserver(checkPreviewState);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-project-preview-open"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else if (!projectPreviewOpen) {
      document.body.style.overflow = "";
    }
    return () => {
      if (!projectPreviewOpen) {
        document.body.style.overflow = "";
      }
    };
  }, [mobileMenuOpen, projectPreviewOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* DESKTOP NAVBAR: Centered Unified Morphing Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <motion.div
          animate={{
            y: scrolled ? 16 : 0,
            borderTopLeftRadius: scrolled ? 32 : 0,
            borderTopRightRadius: scrolled ? 32 : 0,
            borderBottomLeftRadius: scrolled ? 32 : 20,
            borderBottomRightRadius: scrolled ? 32 : 20,
            borderTopColor: scrolled ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0)",
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            mass: 0.8,
          }}
          className={`hidden md:inline-flex pointer-events-auto items-center text-[12px] md:text-[15px] font-normal text-[#F2F0EF] tracking-wide py-2.5 bg-black/60 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 ease-out ${
            scrolled
              ? "gap-5 md:gap-7 px-6 md:px-8"
              : "gap-8 md:gap-12 px-8 md:px-12"
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative group hover:text-white transition-colors duration-200"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/60 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </motion.div>
      </nav>

      {/* MOBILE TRIGGER: Standalone Floating Circle Button (No Pill / No Wrapper) */}
      <div
        className={`fixed top-4 right-4 z-[110] md:hidden pointer-events-auto transition-all duration-300 ${
          projectPreviewOpen
            ? "opacity-0 pointer-events-none scale-75 select-none invisible"
            : "opacity-100 scale-100 visible"
        }`}
      >
        <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center hover:bg-black/80 active:scale-95 transition-all">
          <HamburgerIcon
            isOpen={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            size={18}
            color="#ffffff"
          />
        </div>
      </div>

      {/* MOBILE SIDEBAR MENU: Slides in from the RIGHT, full height, NO ROUNDED (rounded-none) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm pointer-events-auto md:hidden"
            />

            {/* Right Side Drawer without rounded corners */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30, mass: 0.8 }}
              className="fixed top-0 right-0 bottom-0 h-full w-[78%] sm:w-[320px] z-[100] bg-[#0c0c0e]/95 backdrop-blur-2xl border-l border-white/15 rounded-none shadow-2xl flex flex-col pointer-events-auto md:hidden pt-20 px-6 pb-8 overflow-y-auto"
            >
              {/* Navigation Links List (Hanya content navbar saja) */}
              <div className="flex flex-col divide-y divide-white/10 flex-1 justify-center -mt-10">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-4.5 text-[16px] font-medium tracking-wide text-neutral-200 hover:text-white hover:translate-x-2 transition-all duration-200 flex items-center justify-between group"
                  >
                    <span>{link.label}</span>
                    <span className="text-sm text-neutral-500 group-hover:text-white transition-colors">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
