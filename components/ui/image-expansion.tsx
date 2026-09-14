"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export interface SlideItem {
  id: number;
  badge?: string;
  category?: string;
  title: string;
  company?: string;
  buttonText: string;
  image: string;
  images?: string[];
  url?: string;
  description?: string;
  modules?: string[];
  techStack?: string[];
}

interface ImageExpansionSliderProps {
  slides?: SlideItem[];
  tabs?: string[];
  className?: string;
}

const DEFAULT_SLIDES: SlideItem[] = [
  {
    id: 1,
    category: "Web Development",
    title: "E-Recruitment System: Automated Candidate Assessment",
    buttonText: "Live Demo",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    ],
    url: "https://github.com",
    description: "Web-based recruitment system designed with PXP methods, streamlining candidate assessment, document verification, and hiring analytics.",
  },
  {
    id: 2,
    category: "Mobile App",
    title: "Nyawit Mobile App: Smart Agriculture & Supply Tracking",
    buttonText: "View Project",
    image: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=1200&auto=format&fit=crop",
    ],
    url: "https://github.com",
    description: "Offline-first mobile application developed for agricultural productivity and supply-chain logistics tracking.",
  },
  {
    id: 3,
    category: "UI/UX Design",
    title: "Pelindo Marine Service Portal: Operations & Logistics",
    buttonText: "Case Study",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
    ],
    url: "https://figma.com",
    description: "Enterprise portal interface redesign and BPMN 2.0 system workflow modeling for operational vessel logistics.",
  },
  {
    id: 4,
    category: "Web Development",
    title: "Smart City Dashboard: Centralized Public Telemetry",
    buttonText: "Live Demo",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    ],
    url: "https://github.com",
    description: "Real-time government administration portal and central dashboard for public service integration.",
  },
  {
    id: 5,
    category: "UI/UX Design",
    title: "Fintech Mobile Wallet & Contactless Payment Suite",
    buttonText: "View Design",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556742049-0a67e5572263?q=80&w=1200&auto=format&fit=crop",
    ],
    url: "https://figma.com",
    description: "High-conversion onboarding experience and micro-interaction design for personal finance management.",
  },
  {
    id: 6,
    category: "System Design",
    title: "LEGI Enterprise Architecture & Flow Analysis",
    buttonText: "View Blueprint",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop",
    ],
    url: "https://github.com",
    description: "Enterprise business process reengineering, data model optimization, and system integration blueprint.",
  },
];

const DEFAULT_TABS = ["All", "Web Development", "Mobile App", "UI/UX Design", "System Design"];

export function ImageExpansionSlider({
  slides = DEFAULT_SLIDES,
  tabs = DEFAULT_TABS,
  className = "",
}: ImageExpansionSliderProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0] || "All");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [currentModalImageIdx, setCurrentModalImageIdx] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [visibleCards, setVisibleCards] = useState(3);

  // Deteksi jumlah kartu yang tampak sesuai breakpoint layar
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth >= 1024) {
        setVisibleCards(3); // Desktop: 3 kartu
      } else if (window.innerWidth >= 640) {
        setVisibleCards(2); // Tablet: 2 kartu
      } else {
        setVisibleCards(1); // Mobile: 1 kartu
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter slides based on active tab
  const filteredSlides = slides.filter((slide) => {
    if (activeTab === "All") return true;
    const itemCategory = slide.category || slide.badge || "";
    return itemCategory.toLowerCase() === activeTab.toLowerCase();
  });

  const totalProjects = filteredSlides.length;
  // Slider hanya bisa digeser jika jumlah kartu melebihi kapasitas yang tampak di layar
  const canSlide = totalProjects > visibleCards;
  // Hitung jumlah langkah scroll (titik indikator) agar titik terakhir persis saat carousel mentok di akhir
  const totalSteps = canSlide ? totalProjects - visibleCards + 1 : 1;
  const maxIndex = totalSteps - 1;

  // Scroll ke index tertentu secara presisi
  const scrollToIndex = (index: number) => {
    if (!sliderRef.current) return;
    const card = sliderRef.current.children[0] as HTMLElement;
    if (!card) return;

    const cardWidth = card.offsetWidth + 24; // lebar kartu + gap-6 (24px)
    const maxScrollLeft = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;

    // Jika target index adalah index terakhir, scroll ke maxScrollLeft persis
    const targetLeft = index >= maxIndex ? maxScrollLeft : Math.min(maxScrollLeft, index * cardWidth);

    sliderRef.current.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth",
    });
    setCurrentIdx(index);
  };

  const handleNext = () => {
    if (totalSteps <= 1) return;
    if (currentIdx < maxIndex) {
      scrollToIndex(currentIdx + 1);
    } else {
      scrollToIndex(0); // Loop kembali ke awal
    }
  };

  const handlePrev = () => {
    if (totalSteps <= 1) return;
    if (currentIdx > 0) {
      scrollToIndex(currentIdx - 1);
    } else {
      scrollToIndex(maxIndex); // Loop ke ujung akhir
    }
  };

  // Sinkronisasi indikator titik saat pengguna menggeser slider secara manual (mouse / trackpad / touch)
  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const maxScrollLeft = scrollWidth - clientWidth;

    if (maxScrollLeft <= 0) {
      setCurrentIdx(0);
      return;
    }

    // Jika scroll sudah di dekat ujung kanan (toleransi 15px), aktifkan titik paling akhir
    if (scrollLeft >= maxScrollLeft - 15) {
      setCurrentIdx(maxIndex);
      return;
    }

    const card = sliderRef.current.children[0] as HTMLElement;
    if (!card || card.offsetWidth <= 0) return;
    const cardWidth = card.offsetWidth + 24;
    const calculatedIndex = Math.min(maxIndex, Math.max(0, Math.round(scrollLeft / cardWidth)));
    setCurrentIdx(calculatedIndex);
  };

  // Reset index saat ganti tab
  useEffect(() => {
    setCurrentIdx(0);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [activeTab]);

  // Pastikan index tidak melebihi batas saat resize layar
  useEffect(() => {
    if (currentIdx > maxIndex) {
      setCurrentIdx(maxIndex);
    }
  }, [maxIndex, currentIdx]);

  // Lock body scroll and hide navbar when modal is open
  useEffect(() => {
    if (selectedImageIndex !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      document.body.classList.add("preview-modal-open");
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.classList.remove("preview-modal-open");
      };
    }
  }, [selectedImageIndex]);

  const selectedProject = selectedImageIndex !== null ? filteredSlides[selectedImageIndex] : null;
  const modalImages = selectedProject
    ? selectedProject.images && selectedProject.images.length > 0
      ? selectedProject.images
      : [selectedProject.image]
    : [];
  const totalModalImages = modalImages.length;

  // Keyboard navigation for modal (Esc to close, ArrowLeft/Right to switch photos of the project)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImageIndex(null);
      } else if (e.key === "ArrowLeft") {
        setCurrentModalImageIdx((prev) =>
          totalModalImages > 1 ? (prev > 0 ? prev - 1 : totalModalImages - 1) : 0
        );
      } else if (e.key === "ArrowRight") {
        setCurrentModalImageIdx((prev) =>
          totalModalImages > 1 ? (prev < totalModalImages - 1 ? prev + 1 : 0) : 0
        );
      }
    };

    if (selectedImageIndex !== null) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedImageIndex, totalModalImages]);

  return (
    <div className={`w-full select-none ${className}`.trim()}>
      {/* Category Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-xs md:text-sm font-semibold rounded-full border transition-colors duration-200 cursor-pointer ${
              activeTab === tab
                ? "bg-black text-white border-black shadow-sm"
                : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Slider Carousel Container (Pure Cards, No Outer Box) */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pt-3 pb-6 px-1"
        style={{ scrollbarWidth: "none" }}
      >
        {filteredSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className="min-w-[100%] sm:min-w-[48%] lg:min-w-[31.8%] shrink-0 snap-start"
          >
            <div
              onClick={() => {
                setSelectedImageIndex(idx);
                setCurrentModalImageIdx(0);
              }}
              className="w-full group relative aspect-[1.5/1] rounded-2xl overflow-hidden border border-neutral-200/80 bg-neutral-950 shadow-md hover:shadow-xl hover:-translate-y-1.5 hover:border-neutral-300 transition-all duration-300 ease-out cursor-pointer"
            >
              {/* Background Image with Zoom & Dark Vignette */}
              <div className="absolute inset-0 z-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content overlay */}
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
                <h3
                  className="text-sm sm:text-base lg:text-lg font-bold text-white mb-4 leading-tight tracking-tight truncate max-w-[95%]"
                  title={slide.title}
                >
                  {slide.title}
                </h3>
                {slide.url ? (
                  <a
                    href={slide.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-fit px-3.5 py-1.5 bg-white text-black font-bold text-[10px] tracking-tight rounded-[5px] transition-all duration-300 hover:bg-zinc-200 active:scale-95 shadow-md shadow-black/20 inline-flex items-center gap-1 cursor-pointer"
                  >
                    {slide.buttonText} ↗
                  </a>
                ) : (
                  <button
                    type="button"
                    className="w-fit px-3.5 py-1.5 bg-white text-black font-bold text-[10px] tracking-tight rounded-[5px] transition-all duration-300 hover:bg-zinc-200 active:scale-95 shadow-md shadow-black/20 cursor-pointer"
                  >
                    {slide.buttonText}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Centered Navigation Footer: [ Prev Arrow ] [ Dots ] [ Next Arrow ] */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mt-8 px-1 min-h-[36px]">
        {/* Prev Arrow - disembunyikan tanpa merusak layout jika project tidak bisa di-slide */}
        <button
          type="button"
          onClick={handlePrev}
          aria-hidden={!canSlide}
          tabIndex={canSlide ? 0 : -1}
          className={`w-9 h-9 rounded-full border border-neutral-200 bg-white text-neutral-800 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm ${
            canSlide
              ? "opacity-100 hover:bg-neutral-100 hover:border-neutral-300 hover:shadow-md cursor-pointer"
              : "opacity-0 pointer-events-none select-none invisible"
          }`}
          aria-label="Previous slide"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Step Indicators - selalu ditampilkan agar ukuran section tetap konsisten */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => canSlide && scrollToIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIdx === idx ? "w-7 bg-black" : "w-2 bg-neutral-300 hover:bg-neutral-500"
              } ${canSlide ? "cursor-pointer" : "cursor-default pointer-events-none"}`}
              aria-label={`Go to slide step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next Arrow - disembunyikan tanpa merusak layout jika project tidak bisa di-slide */}
        <button
          type="button"
          onClick={handleNext}
          aria-hidden={!canSlide}
          tabIndex={canSlide ? 0 : -1}
          className={`w-9 h-9 rounded-full border border-neutral-200 bg-white text-neutral-800 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm ${
            canSlide
              ? "opacity-100 hover:bg-neutral-100 hover:border-neutral-300 hover:shadow-md cursor-pointer"
              : "opacity-0 pointer-events-none select-none invisible"
          }`}
          aria-label="Next slide"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Compact & Scrollable Project Preview Dialog Modal via Portal at z-[100] */}
      {mounted && selectedProject && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md overflow-hidden flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Modal Card with internal scroll strictly inside the card */}
          <div
            className="relative w-full max-w-3xl max-h-[88vh] bg-[#0e0e11] border border-neutral-800 rounded-2xl shadow-2xl overflow-y-auto flex flex-col text-white animate-in fade-in zoom-in-95 duration-200"
            style={{ scrollbarWidth: "thin" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Close Button pinned at top-right of card */}
            <div className="sticky top-0 z-30 w-full flex justify-end p-3.5 pointer-events-none -mb-14">
              <button
                type="button"
                className="pointer-events-auto w-8 h-8 rounded-full bg-black/75 hover:bg-black text-white border border-white/20 flex items-center justify-center text-xs transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
                onClick={() => setSelectedImageIndex(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Image Preview Banner */}
            <div className="relative w-full aspect-[16/9] max-h-[44vh] shrink-0 bg-black overflow-hidden group/modalimg">
              <img
                key={currentModalImageIdx}
                src={modalImages[currentModalImageIdx] || selectedProject.image}
                alt={`${selectedProject.title} - Preview ${currentModalImageIdx + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300 animate-in fade-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e11] via-transparent to-black/30 pointer-events-none" />

              {/* Quick Image Arrows on Banner (if multiple images) */}
              {totalModalImages > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentModalImageIdx((prev) =>
                        prev > 0 ? prev - 1 : totalModalImages - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                    aria-label="Previous photo"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentModalImageIdx((prev) =>
                        prev < totalModalImages - 1 ? prev + 1 : 0
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                    aria-label="Next photo"
                  >
                    ›
                  </button>

                  {/* Thumbnail Dots on Banner */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
                    {modalImages.map((_, imgIdx) => (
                      <button
                        key={imgIdx}
                        type="button"
                        onClick={() => setCurrentModalImageIdx(imgIdx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          currentModalImageIdx === imgIdx
                            ? "w-5 bg-white"
                            : "w-1.5 bg-white/40 hover:bg-white/75"
                        }`}
                        aria-label={`View photo ${imgIdx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Content Details: Judul -> Company/MataKuliah -> Description -> Modul */}
            <div className="p-6 md:p-8 flex flex-col gap-6">
              {/* 1. JUDUL & 2. COMPANY / MATAKULIAH */}
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white leading-tight tracking-tight">
                    {selectedProject.title}
                  </h3>
                  
                </div>

                {/* Company / Mata Kuliah */}
                {selectedProject.company && (
                  <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-400">
                    
                    <span className="text-neutral-200 font-semibold">
                      {selectedProject.company}
                    </span>
                  </div>
                )}
              </div>

              {/* Divider Line */}
              <div className="w-full h-px bg-neutral-800/80" />

              {/* 3. Description Section */}
              <div className="flex flex-col gap-2.5">
                <h4 className="text-xs md:text-[13px] font-extrabold uppercase tracking-wider text-white">
                  Description
                </h4>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed text-justify">
                  {selectedProject.description || "Deskripsi proyek belum ditambahkan."}
                </p>
              </div>

              {/* Divider Line after Description */}
              <div className="w-full h-px bg-neutral-800/80" />

              {/* 4. MODUL & TECH & TOOLS (Berdampingan dengan divider di tengah) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-neutral-800/80">
                {/* Modul Section */}
                <div className="flex flex-col gap-2.5 md:pr-8">
                  <h4 className="text-xs md:text-[13px] font-extrabold uppercase tracking-wider text-white">
                    Modul
                  </h4>
                  {selectedProject.modules && selectedProject.modules.length > 0 ? (
                    <ul className="flex flex-col gap-2">
                      {selectedProject.modules.map((mod, mIdx) => (
                        <li
                          key={mIdx}
                          className="text-xs sm:text-sm text-neutral-200 flex items-start gap-2.5 leading-snug"
                        >
                          <span className="text-neutral-400 font-bold select-none mt-0.5">•</span>
                          <span>{mod}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-neutral-500 italic">
                      Modul proyek belum didaftarkan.
                    </p>
                  )}
                </div>

                {/* Tech & Tools Section (Rounded Shape) */}
                <div className="flex flex-col gap-2.5 pt-6 md:pt-0 md:pl-8">
                  <h4 className="text-xs md:text-[13px] font-extrabold uppercase tracking-wider text-white">
                    Tech & Tools
                  </h4>
                  {selectedProject.techStack && selectedProject.techStack.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {selectedProject.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-neutral-900/90 border border-neutral-700/80 text-neutral-200 shadow-sm hover:border-neutral-500 hover:text-white transition-all select-none"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500 italic">
                      Tech & tools belum didaftarkan.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default ImageExpansionSlider;
