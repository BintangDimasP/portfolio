"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { isDesignCategory, isProjectAcademic } from "@/lib/utils";

export interface SlideItem {
  id: number;
  badge?: string;
  isAcademy?: boolean;
  category?: string;
  role?: string;
  title: string;
  company?: string;
  buttonText?: string;
  button_text?: string;
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
    company: "FST Universitas Jambi",
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
    company: "AgriTech Solution",
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
    company: "PT Pelindo Marine Service",
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
    company: "Dinas Kominfo",
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
    company: "Fintech Lab",
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
    company: "Enterprise Architect Team",
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
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

  const selectedProject = selectedImageIndex !== null ? filteredSlides[selectedImageIndex] : null;
  const modalImages = selectedProject
    ? selectedProject.images && selectedProject.images.length > 0
      ? selectedProject.images
      : [selectedProject.image]
    : [];
  const totalModalImages = modalImages.length;

  // Lock body scroll, hide mobile navbar, and handle keyboard navigation for modal & lightbox
  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-project-preview-open", "true");
      document.body.classList.add("preview-modal-open");

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          if (isLightboxOpen) {
            setIsLightboxOpen(false);
          } else {
            setSelectedImageIndex(null);
          }
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

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
        document.body.removeAttribute("data-project-preview-open");
        document.body.classList.remove("preview-modal-open");
      };
    } else {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-project-preview-open");
      document.body.classList.remove("preview-modal-open");
    }
  }, [selectedImageIndex, isLightboxOpen, totalModalImages]);

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
                {slide.image && (
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={idx === 0}
                    loading={idx === 0 ? "eager" : "lazy"}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Academy Badge in top-right corner, minimalist without icon */}
              {isProjectAcademic(slide) && (
                <div className="absolute top-3.5 right-3.5 z-30 pointer-events-none">
                  <span
                    suppressHydrationWarning
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide text-white bg-black/75 backdrop-blur-md border border-white/25 shadow-md select-none"
                  >
                    Academy
                  </span>
                </div>
              )}

              {/* Content overlay */}
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 sm:p-6">
                <h3
                  className="text-sm sm:text-base lg:text-lg font-bold text-white leading-tight tracking-tight truncate max-w-[95%]"
                  title={slide.title}
                >
                  {slide.title}
                </h3>
                {(slide.role || slide.company) && (
                  <p
                    className="text-xs sm:text-[13px] font-medium text-white/80 mt-1 truncate max-w-[95%]"
                    title={`${slide.role && !isDesignCategory(slide.category) ? `${slide.role} • ` : ""}${slide.company || ""}`}
                  >
                    {slide.role && !isDesignCategory(slide.category) && (
                      <span className="text-white font-semibold">
                        {slide.role}
                        {slide.company ? " • " : ""}
                      </span>
                    )}
                    {slide.company}
                  </p>
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
        <div className="flex items-center gap-1">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => canSlide && scrollToIndex(idx)}
              className={`p-2 flex items-center justify-center ${
                canSlide ? "cursor-pointer" : "cursor-default pointer-events-none"
              }`}
              aria-label={`Go to slide step ${idx + 1}`}
            >
              <span
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIdx === idx ? "w-7 bg-black" : "w-2 bg-neutral-300 hover:bg-neutral-500"
                }`}
              />
            </button>
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

      {/* Compact & Scrollable Project Preview Dialog Modal via Portal at z-[200] */}
      {mounted && selectedProject && createPortal(
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md overflow-hidden flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedImageIndex(null)}
        >
          <div
            className="relative w-full max-w-5xl h-[88vh] md:h-[620px] bg-[#0b0b0f] border border-neutral-800/90 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col-reverse md:flex-row text-white animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button pinned at top-right of modal */}
            <button
              type="button"
              className="absolute top-3.5 right-3.5 z-50 w-8 h-8 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 flex items-center justify-center text-xs transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
              onClick={() => setSelectedImageIndex(null)}
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* LEFT SIDE: Project Details (Title, Client, Description, Modul if present, Tech Stack) */}
            <div
              className="w-full md:w-[42%] lg:w-[38%] h-full flex flex-col justify-between p-6 sm:p-7 md:p-8 overflow-y-auto bg-[#0c0c10] border-t md:border-t-0 md:border-r border-neutral-800/80 gap-6"
              style={{ scrollbarWidth: "thin" }}
            >
              <div className="flex flex-col gap-5">
                {/* Header (Title, Badges row: Category & Academy, Subtitle row: Role & Instansi) */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight tracking-tight">
                    {selectedProject.title}
                  </h3>

                  {/* Line 2: Category & Academy badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedProject.category && (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 font-medium border border-white/10">
                        {selectedProject.category}
                      </span>
                    )}
                    {isProjectAcademic(selectedProject) && (
                      <span
                        suppressHydrationWarning
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide text-neutral-200 bg-white/15 border border-white/25 select-none shadow-sm"
                      >
                        Academy
                      </span>
                    )}
                  </div>

                  {/* Line 3: Role & Instansi / Perusahaan */}
                  {(selectedProject.role || selectedProject.company) && (
                    <p className="text-xs sm:text-sm text-neutral-400 font-medium flex items-center gap-1.5 flex-wrap">
                      {selectedProject.role && !isDesignCategory(selectedProject.category) && (
                        <span className="text-brand-400 font-semibold text-white/90">
                          {selectedProject.role}
                        </span>
                      )}
                      {selectedProject.role && !isDesignCategory(selectedProject.category) && selectedProject.company && (
                        <span className="text-neutral-500">•</span>
                      )}
                      {selectedProject.company && (
                        <span>{selectedProject.company}</span>
                      )}
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-neutral-800/80" />

                {/* Description Section */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                    Description
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed text-justify">
                    {selectedProject.description || "Deskripsi proyek belum ditambahkan."}
                  </p>
                </div>

                {/* Modul Section (rendered only if modules exist and NOT a design category) */}
                {!isDesignCategory(selectedProject.category) &&
                  selectedProject.modules &&
                  selectedProject.modules.length > 0 && (
                  <>
                    <div className="w-full h-px bg-neutral-800/80" />
                    <div className="flex flex-col gap-2.5">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                        Modul &amp; Fitur Utama
                      </h4>
                      <ul className="flex flex-col gap-2">
                        {selectedProject.modules.map((mod, mIdx) => (
                          <li
                            key={mIdx}
                            className="text-xs sm:text-sm text-neutral-200 flex items-start gap-2.5 leading-snug"
                          >
                            <span className="text-neutral-500 font-bold select-none">•</span>
                            <span>{mod}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {/* Divider */}
                <div className="w-full h-px bg-neutral-800/80" />

                {/* Tech Stack / Tools & Skills Section */}
                <div className="flex flex-col gap-2.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                    {isDesignCategory(selectedProject.category)
                      ? "Tools & Skills"
                      : "Tech Stack & Tools"}
                  </h4>
                  {selectedProject.techStack && selectedProject.techStack.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {selectedProject.techStack.map((tool, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-neutral-900 border border-neutral-700/80 text-neutral-200 shadow-sm select-none"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500 italic">
                      Tools belum didaftarkan.
                    </p>
                  )}
                </div>
              </div>

              {/* Optional External Link Button */}
              {selectedProject.url && (
                <a
                  href={selectedProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all shadow-md mt-4"
                >
                  Buka Tautan Proyek
                </a>
              )}
            </div>

            {/* RIGHT SIDE: Visual Showcase (Full fit content, click image for full res) */}
            <div className="w-full md:w-[58%] lg:w-[62%] h-full flex flex-col justify-between bg-[#040406] relative p-4 sm:p-6 overflow-hidden">
              {/* Main Image Stage (fits container naturally, click to open full-res lightbox pop-up) */}
              <div className="relative flex-1 w-full h-full min-h-0 flex items-center justify-center overflow-hidden">
                <div className="relative group flex items-center justify-center max-w-full max-h-full">
                  <img
                    key={currentModalImageIdx}
                    src={modalImages[currentModalImageIdx] || selectedProject.image}
                    alt={`${selectedProject.title} - Slide ${currentModalImageIdx + 1}`}
                    onClick={() => setIsLightboxOpen(true)}
                    title="Klik untuk memperbesar gambar"
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-xl drop-shadow-2xl select-none cursor-zoom-in transition-all duration-200 group-hover:brightness-105"
                  />
                  {/* Hover hint badge */}
                  <div
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-[11px] font-medium text-white flex items-center gap-1.5 shadow-lg cursor-pointer"
                  >
                    
                  </div>
                </div>

                {/* Nav Arrows (if multiple images) */}
                {totalModalImages > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentModalImageIdx((prev) =>
                          prev > 0 ? prev - 1 : totalModalImages - 1
                        )
                      }
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 flex items-center justify-center text-base font-bold transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer backdrop-blur-md"
                      aria-label="Previous slide"
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
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 flex items-center justify-center text-base font-bold transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer backdrop-blur-md"
                      aria-label="Next slide"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Bottom Dots Indicator (if multiple images) */}
              {totalModalImages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-3 shrink-0 z-20">
                  {modalImages.map((_, imgIdx) => (
                    <button
                      key={imgIdx}
                      type="button"
                      onClick={() => setCurrentModalImageIdx(imgIdx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        currentModalImageIdx === imgIdx
                          ? "w-6 bg-white"
                          : "w-2 bg-neutral-600 hover:bg-neutral-400"
                      }`}
                      aria-label={`Slide ${imgIdx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Full-Resolution Image Lightbox Pop-up Modal via React Portal at z-[300] */}
      {mounted && isLightboxOpen && selectedProject && createPortal(
        <div
          className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200 select-none"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar: Title, Counter & Close Button */}
          <div
            className="w-full flex items-center justify-between px-2 py-1 text-white shrink-0 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col">
              <h4 className="text-sm sm:text-base font-bold text-white truncate max-w-[70vw] sm:max-w-md">
                {selectedProject.title}
              </h4>
              {totalModalImages > 1 && (
                <span className="text-[11px] sm:text-xs text-neutral-400">
                  Gambar {currentModalImageIdx + 1} dari {totalModalImages}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center text-sm font-bold transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
              aria-label="Tutup gambar penuh"
            >
              ✕
            </button>
          </div>

          {/* Center Stage: Full Resolution Image with Nav Arrows */}
          <div className="relative flex-1 w-full h-full min-h-0 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
            <img
              src={modalImages[currentModalImageIdx] || selectedProject.image}
              alt={`${selectedProject.title} - Resolusi Penuh`}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[82vh] w-auto h-auto object-contain rounded-xl shadow-2xl transition-transform duration-200 select-none drop-shadow-2xl"
            />

            {/* Left Arrow (Previous Photo) */}
            {totalModalImages > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentModalImageIdx((prev) =>
                    prev > 0 ? prev - 1 : totalModalImages - 1
                  );
                }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/75 hover:bg-black text-white border border-white/20 flex items-center justify-center text-xl font-bold transition-all hover:scale-110 active:scale-95 shadow-2xl cursor-pointer backdrop-blur-md"
                aria-label="Gambar sebelumnya"
              >
                ‹
              </button>
            )}

            {/* Right Arrow (Next Photo) */}
            {totalModalImages > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentModalImageIdx((prev) =>
                    prev < totalModalImages - 1 ? prev + 1 : 0
                  );
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/75 hover:bg-black text-white border border-white/20 flex items-center justify-center text-xl font-bold transition-all hover:scale-110 active:scale-95 shadow-2xl cursor-pointer backdrop-blur-md"
                aria-label="Gambar berikutnya"
              >
                ›
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip (if multiple photos) */}
          {totalModalImages > 1 && (
            <div
              className="flex items-center justify-center gap-2.5 pt-2 pb-1 shrink-0 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {modalImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentModalImageIdx(idx)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    currentModalImageIdx === idx
                      ? "border-white scale-110 shadow-lg"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`Pilih gambar ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-10 h-8 sm:w-14 sm:h-10 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

export default ImageExpansionSlider;
