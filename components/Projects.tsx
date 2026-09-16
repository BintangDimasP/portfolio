"use client";

import React, { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import { cn, isProjectAcademic } from "@/lib/utils";
import { ImageExpansionSlider, SlideItem } from "@/components/ui/image-expansion";
import { supabase } from "@/lib/supabase/client";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function Projects({ initialProjects }: { initialProjects?: any[] }) {
  const [dbProjects, setDbProjects] = useState<any[]>(initialProjects || []);

  useEffect(() => {
    if (initialProjects) {
      setDbProjects(initialProjects);
    }
  }, [initialProjects]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false });

        if (!error && data) {
          setDbProjects(data);
        }
      } catch (err) {
        // Ignored
      }
    }
    fetchProjects();
  }, []);

  const slides: SlideItem[] = dbProjects.map((p) => {
    const isAcademy = isProjectAcademic(p);
    return {
      id: p.id,
      category: p.category,
      badge: isAcademy ? "Academy" : undefined,
      isAcademy,
      title: p.title,
      company: p.company,
      buttonText: p.button_text || "Visit Site",
      button_text: p.button_text,
      image: p.image,
      images: p.images && p.images.length > 0 ? p.images : [p.image],
      url: p.url,
      description: p.description,
      modules: p.modules || [],
      techStack: p.tech_stack || [],
    };
  });

  const dynamicTabs = [
    "All",
    ...Array.from(new Set(slides.map((s) => s.category).filter((c): c is string => Boolean(c)))),
  ];

  return (
    <section
      id="projects"
      className="relative w-full py-24 px-6 md:px-16 bg-[#F8F9FA] text-black rounded-t-[80px] rounded-b-[40px] shadow-2xl overflow-hidden z-10 my-12"
    >
      {/* Background Grid Pattern (Aceternity Grid) */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-50",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]"
        )}
      />
      {/* Radial gradient mask for soft faded look */}
      <div className="pointer-events-none absolute inset-0 bg-[#F8F9FA] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-85" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col justify-center gap-10">
        {/* Section Title */}
        <div className="text-center">
          <h2 className="text-center text-[24px] md:text-[34px] font-bold text-black mb-2 flex items-baseline justify-center">
            <span
              className={`${playfair.className} text-[42px] md:text-[62px] font-semibold italic mr-0.5 leading-none select-none`}
            >
              Projects
            </span>
          </h2>
        </div>

        {/* Image Expansion Slider Carousel */}
        <div className="w-full">
          {slides.length === 0 ? (
            <div className="py-16 text-center text-neutral-500">
              <p className="text-base font-semibold text-neutral-800">Belum ada proyek yang dipublikasikan.</p>
              <p className="text-xs text-neutral-400 mt-1">Tambahkan portofolio Anda melalui Admin CMS.</p>
            </div>
          ) : (
            <ImageExpansionSlider
              slides={slides}
              tabs={dynamicTabs.length > 1 ? dynamicTabs : ["All"]}
            />
          )}
        </div>
      </div>
    </section>
  );
}
