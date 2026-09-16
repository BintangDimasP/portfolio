"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";

const CvPdfViewer = dynamic(() => import("./CvPdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-neutral-400 min-h-[50vh]">
      <div className="w-7 h-7 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      <span className="text-xs font-medium text-neutral-300">
        Menyiapkan dokumen...
      </span>
    </div>
  ),
});

interface CvPreviewModalProps {
  cvUrl: string;
  name?: string;
  children?: React.ReactNode;
}

export default function CvPreviewModal({
  cvUrl,
  children,
}: CvPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open, listen to Escape
  useEffect(() => {
    if (!isOpen) {
      document.body.removeAttribute("data-project-preview-open");
      return;
    }

    const origBody = document.body.style.overflow;
    const origHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.setAttribute("data-project-preview-open", "true");

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = origBody;
      document.documentElement.style.overflow = origHtml;
      document.body.removeAttribute("data-project-preview-open");
    };
  }, [isOpen]);

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <>
      {/* Trigger */}
      <div onClick={handleOpen} className="inline-block cursor-pointer">
        {children}
      </div>

      {/* Modal Portal */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[250] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-6 animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          >
            {/* Floating Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer border border-white/10 shadow-lg"
              aria-label="Tutup preview"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Card Container without top header */}
            <div
              className="relative flex flex-col w-full max-w-4xl h-[92vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-950/90 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <CvPdfViewer cvUrl={cvUrl} />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
