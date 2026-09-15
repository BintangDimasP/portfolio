"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface CvPdfViewerProps {
  cvUrl: string;
  onDownload: () => void;
}

export default function CvPdfViewer({ cvUrl, onDownload }: CvPdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageWidth, setPageWidth] = useState<number>(600);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePageWidth = useCallback(() => {
    if (containerRef.current) {
      setPageWidth(containerRef.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(updatePageWidth, 50);
    window.addEventListener("resize", updatePageWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updatePageWidth);
    };
  }, [updatePageWidth]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    updatePageWidth();
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-auto overflow-x-hidden"
      style={{ scrollbarWidth: "thin" }}
    >
      <Document
        file={cvUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="w-full flex flex-col items-center justify-center gap-3 text-neutral-400 min-h-[60vh]">
            <div className="w-7 h-7 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            <span className="text-xs font-medium text-neutral-300">
              Memuat Dokumen CV...
            </span>
          </div>
        }
        error={
          <div className="w-full flex flex-col items-center justify-center gap-4 text-neutral-400 min-h-[60vh] p-6 text-center">
            <span className="text-3xl">📄</span>
            <p className="text-sm font-medium text-neutral-300">
              Gagal memuat dokumen
            </p>
            <button
              type="button"
              onClick={onDownload}
              className="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-all shadow-md cursor-pointer"
            >
              Unduh CV langsung
            </button>
          </div>
        }
        className="flex flex-col items-center"
      >
        {numPages &&
          Array.from({ length: numPages }, (_, i) => (
            <Page
              key={`page_${i + 1}`}
              pageNumber={i + 1}
              width={pageWidth || undefined}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-md"
            />
          ))}
      </Document>
    </div>
  );
}
