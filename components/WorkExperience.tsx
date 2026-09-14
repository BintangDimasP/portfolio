"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { sortExperiencesChronologically } from "@/lib/experience-sorter";

interface ExperienceItem {
  year: string;
  role: string;
  type: string;
  company: string;
  location: string;
  period: string;
  description: string;
  skills: string[];
  side: "left" | "right"; // Posisi card: kiri atau kanan
}

export default function WorkExperience({ initialExperiences }: { initialExperiences?: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 50%"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const [dbExperiences, setDbExperiences] = useState<any[]>(() =>
    sortExperiencesChronologically(initialExperiences || [])
  );

  useEffect(() => {
    if (initialExperiences) {
      setDbExperiences(sortExperiencesChronologically(initialExperiences));
    }
  }, [initialExperiences]);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const { data, error } = await supabase
          .from("experiences")
          .select("*")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false });

        if (!error && data) {
          setDbExperiences(sortExperiencesChronologically(data));
        }
      } catch (err) {
        // Ignored
      }
    }
    fetchExperiences();
  }, []);

  const list: ExperienceItem[] = sortExperiencesChronologically(dbExperiences).map((e, index) => ({
    year: e.year,
    role: e.role,
    type: e.type,
    company: e.company,
    location: e.location,
    period: e.period,
    description: e.description,
    skills: e.skills || [],
    side: index % 2 === 0 ? "left" : "right",
  }));

  return (
    <section id="experience" className="relative w-full py-20 px-4 sm:px-6 md:px-12 bg-black text-white overflow-hidden">
      <div className="max-w-6xl mx-auto" ref={containerRef}>
        
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-[28px] md:text-[38px] font-bold text-white tracking-tight mb-3">
            Work Experience
          </h2>
        </div>

        {/* Timeline Container */}
        {list.length === 0 ? (
          <div className="py-16 text-center text-neutral-400">
            <p className="text-base font-medium">Belum ada pengalaman kerja yang dipublikasikan.</p>
            <p className="text-xs text-neutral-500 mt-1">Tambahkan riwayat karir melalui Admin CMS.</p>
          </div>
        ) : (
          <div className="relative">
          
          {/* Central Vertical Line (Background Track) */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-neutral-800">
            {/* Animated Scroll Fill Line */}
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-white via-neutral-300 to-neutral-500 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.8)]"
            />
          </div>

          {/* Timeline Items (Selang-seling) */}
          <div className="flex flex-col gap-12 md:gap-20">
            {list.map((item, index) => {
              const isCardLeft = index % 2 === 0;

              return (
                <div
                  key={index}
                  className="relative flex flex-col md:flex-row items-start md:items-center justify-between w-full"
                >
                  {/* Central Node / Dot Marker */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-black border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.6)] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    </div>
                  </div>

                  {/* SISI KIRI (Desktop) / Konten Utama */}
                  <div className="w-full md:w-[45%] pl-10 md:pl-0 flex flex-col">
                    {isCardLeft ? (
                      /* Card di Sisi Kiri */
                      <ExperienceCard item={item} />
                    ) : (
                      /* Tahun & Info di Sisi Kiri */
                      <YearBlock item={item} align="right" />
                    )}
                  </div>

                  {/* SISI KANAN (Desktop) */}
                  <div className="w-full md:w-[45%] pl-10 md:pl-0 mt-4 md:mt-0 flex flex-col">
                    {isCardLeft ? (
                      /* Tahun & Info di Sisi Kanan */
                      <YearBlock item={item} align="left" />
                    ) : (
                      /* Card di Sisi Kanan */
                      <ExperienceCard item={item} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  </section>
  );
}

// Komponen Card Pengalaman dengan Efek 3D Tilted & Glare Halus
function ExperienceCard({ item }: { item: ExperienceItem }) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values untuk posisi mouse
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics untuk pergerakan tilt yang halus dan kenyal
  const mouseXSpring = useSpring(x, { stiffness: 180, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 180, damping: 20 });

  // Sudut rotasi tilt (dibuat proporsional ~8 derajat agar teks tetap nyaman dibaca)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  // Pantulan kilau cahaya (glare reflection) mengikuti kursor
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useSpring(0, { stiffness: 200, damping: 25 });

  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle 280px at ${gx}% ${gy}%, rgba(255,255,255,0.7), transparent 75%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;

    x.set(xPct);
    y.set(yPct);

    glareX.set((mouseX / rect.width) * 100);
    glareY.set((mouseY / rect.height) * 100);
    glareOpacity.set(0.18);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    glareOpacity.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full relative flex flex-col gap-3.5 p-6 sm:p-7 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-black shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-default"
      >
        {/* Dynamic Glare Reflection Sheen */}
        <motion.div
          style={{
            opacity: glareOpacity,
            background: glareBg,
          }}
          className="pointer-events-none absolute inset-0 z-10 rounded-2xl mix-blend-overlay overflow-hidden"
        />

        {/* Inner Content with subtle 3D depth pop */}
        <div style={{ transform: "translateZ(24px)", transformStyle: "preserve-3d" }} className="flex flex-col gap-3.5 relative z-20">
          {/* Header Bar: Role + Badge Type */}
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-[18px] sm:text-[20px] text-black leading-tight">
              {item.role}
            </h3>
            <span className="shrink-0 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-black text-white uppercase tracking-wider shadow-sm">
              {item.type}
            </span>
          </div>

          {/* Company, Location & Period */}
          <div>
            <h4 className="font-semibold text-[15px] sm:text-[16px] text-neutral-900">
              {item.company}
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-[13px] sm:text-[14px] text-neutral-600 mt-0.5">
              <span>{item.location}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-[14px] sm:text-[15px] font-normal leading-relaxed text-neutral-700 text-justify">
            {item.description}
          </p>

          {/* Skills / Tech & Tools Used */}
          <div className="mt-1">
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-[12px] font-medium px-2.5 py-0.5 rounded-full bg-white border border-neutral-200 text-neutral-800 shadow-sm select-none"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Komponen Tahun & Visual Identifier di Sisi Sebelahnya
function YearBlock({ item, align }: { item: ExperienceItem; align: "left" | "right" }) {
  const isRightAlign = align === "right";

  return (
    <div
      className={`hidden md:flex flex-col ${
        isRightAlign ? "items-end text-right pr-6" : "items-start text-left pl-6"
      } justify-center py-4`}
    >
      <div className="flex items-center gap-2">
        <span
          className="text-[48px] lg:text-[58px] font-extrabold tracking-tight text-white select-none drop-shadow-[0_4px_16px_rgba(255,255,255,0.15)]"
        >
          {item.year}
        </span>
      </div>
      <span className="text-[14px] font-semibold text-neutral-400 tracking-wide uppercase">
        {item.period}
      </span>
    </div>
  );
}
