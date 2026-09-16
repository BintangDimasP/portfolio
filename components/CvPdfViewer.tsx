"use client";

import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set local worker path to avoid CDN worker issues and mobile blocking
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

interface CvPdfViewerProps {
  cvUrl: string;
}

export default function CvPdfViewer({ cvUrl }: CvPdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    const updateWidth = () => {
      if (el) {
        setContainerWidth(el.clientWidth);
      }
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-auto overflow-x-hidden p-3 sm:p-6 flex flex-col items-center custom-scrollbar"
      style={{ scrollbarWidth: "thin" }}
    >
      <Document
        file={cvUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="w-full flex flex-col items-center justify-center gap-3 text-neutral-400 min-h-[50vh]">
            <div className="w-7 h-7 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            <span className="text-xs font-medium text-neutral-300">
              Memuat Dokumen CV...
            </span>
          </div>
        }
        error={
          <div className="w-full flex flex-col items-center justify-center gap-4 text-neutral-400 min-h-[50vh] p-6 text-center">
            <span className="text-3xl">📄</span>
            <p className="text-sm font-medium text-neutral-300">
              Gagal memuat dokumen
            </p>
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-all shadow-md cursor-pointer"
            >
              Buka / Unduh CV langsung
            </a>
          </div>
        }
        className="flex flex-col items-center gap-4 max-w-full"
      >
        {numPages &&
          Array.from({ length: numPages }, (_, i) => (
            <div
              key={`page_wrap_${i + 1}`}
              className="shadow-2xl rounded-sm overflow-hidden bg-white max-w-full"
            >
              <Page
                pageNumber={i + 1}
                width={
                  containerWidth
                    ? Math.min(containerWidth - (containerWidth < 640 ? 24 : 48), 750)
                    : undefined
                }
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          ))}
      </Document>
    </div>
  );
}
