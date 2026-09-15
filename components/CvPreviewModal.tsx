"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";

// Dynamic import with ssr:false prevents react-pdf from running on the server,
// which would throw "document is not defined" during Next.js SSR.
const CvPdfViewer = dynamic(() => import("@/components/CvPdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-neutral-400 min-h-[60vh]">
      <div className="w-7 h-7 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      <span className="text-xs font-medium text-neutral-300">
        Memuat Dokumen CV...
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
  name = "Bintang Dimas",
  children,
}: CvPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll, hide mobile navbar, listen to Escape when modal is open
  useEffect(() => {
    if (isOpen) {
      const origBody = document.body.style.overflow;
      const origHtml = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.setAttribute("data-project-preview-open", "true");

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);

      // Prevent bounce scroll outside the card
      const handlePreventScroll = (e: Event) => {
        const target = e.target as HTMLElement | null;
        if (target && !target.closest("[data-cv-card='true']")) {
          e.preventDefault();
        }
      };
      window.addEventListener("wheel", handlePreventScroll, { passive: false });
      window.addEventListener("touchmove", handlePreventScroll, { passive: false });

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("wheel", handlePreventScroll);
        window.removeEventListener("touchmove", handlePreventScroll);
        document.body.style.overflow = origBody;
        document.documentElement.style.overflow = origHtml;
        document.body.removeAttribute("data-project-preview-open");
      };
    } else {
      document.body.removeAttribute("data-project-preview-open");
    }
  }, [isOpen]);

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = cvUrl;
    link.download = `CV_${name.replace(/\s+/g, "_")}.pdf`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Trigger Button Wrapper */}
      <div onClick={handleOpen} className="inline-block cursor-pointer">
        {children}
      </div>

      {/* Pop-up Modal via React Portal at z-[250] */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[250] bg-black/90 backdrop-blur-md flex items-center justify-center sm:p-6 overflow-hidden select-none touch-none overscroll-none animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Card CV:
                - Mobile (<640px): fullscreen, isi penuh layar HP
                - Desktop (>=640px): card proporsional A4
            */}
            <div
              data-cv-card="true"
              className="relative w-full h-full sm:w-auto sm:h-auto sm:aspect-[1/1.414] sm:max-w-[min(88vw,calc(92vh/1.414))] sm:max-h-[92vh] bg-neutral-950 border border-neutral-800/80 rounded-none sm:rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 select-auto touch-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile-only top bar: Kembali + Unduh */}
              <div className="flex sm:hidden items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800 shrink-0 z-30">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-white text-sm font-medium active:opacity-70 cursor-pointer"
                  aria-label="Kembali"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5" />
                    <path d="M12 19l-7-7 7-7" />
                  </svg>
                  <span>Kembali</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 text-white text-sm font-medium active:opacity-70 cursor-pointer"
                  aria-label="Unduh CV"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Unduh</span>
                </button>
              </div>

              {/* Download Button - desktop only */}
              <button
                type="button"
                onClick={handleDownload}
                className="hidden sm:flex absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
                title="Unduh CV (.pdf)"
                aria-label="Unduh CV"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>

              {/* PDF Viewer (client-only via dynamic import) */}
              <CvPdfViewer cvUrl={cvUrl} onDownload={handleDownload} />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
