"use client";

import React from "react";
import { Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { ImageExpansionSlider, SlideItem } from "@/components/ui/image-expansion";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const projectSlides: SlideItem[] = [
  {
    id: 1,
    category: "Web Development",
    title: "Pilmapres FST UNJA: Selection of Outstanding Students",
    company: "FST Universitas Jambi (UNJA) • Sistem Informasi",
    buttonText: "Visit Site",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    ],
    url: "https://github.com",
    description:
      "The Selection of Outstanding Students (Pilmapres) FST UNJA previously relied on manual physical document collection and Excel-based calculations, which were highly prone to human error. Developed a multi-role web ecosystem (Admin, Jury, Student) that automates scoring based on preset weight matrices, ensuring transparent, real-time, and 100% accurate student rankings.",
    modules: [
      "Multi-Role Authentication System (Admin, Jury, Student)",
      "Automated Matrix Scoring Logic & Weightage Calculations",
      "Live Ranking Leaderboard & Real-Time Analytics",
      "Document Validation Workflow & Portfolio Archiving",
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma", "PXP Matrix"],
  },
  {
    id: 2,
    category: "Mobile App",
    title: "Nyawit Mobile App: Smart Agriculture & Supply Tracking",
    company: "Mata Kuliah: Mobile Application Development",
    buttonText: "Visit Site",
    image: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=1200&auto=format&fit=crop",
    ],
    url: "https://github.com",
    description:
      "Aplikasi mobile berbasis offline-first yang dirancang untuk mendukung petani dan pengepul kelapa sawit dalam pencatatan panen digital, kalkulasi tonase, serta pelacakan rantai pasok dari perkebunan hingga pabrik kelapa sawit secara terverifikasi.",
    modules: [
      "Modul Offline-First SQLite Synchronization",
      "Modul Pencatatan Panen & Kalkulasi Tonase Otomatis",
      "Modul Pemetaan Geolocation Polygon Lahan Sawit",
      "Modul Pelacakan Logistik & Supply Chain Manifest",
    ],
    techStack: ["Flutter", "Dart", "SQLite", "Firebase", "Google Maps API", "Offline-First"],
  },
  {
    id: 3,
    category: "UI/UX Design",
    title: "Pelindo Marine Service Portal: Operations & Logistics",
    company: "PT Pelindo Marine Service • Enterprise Logistics",
    buttonText: "Visit Site",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
    ],
    url: "https://figma.com",
    description:
      "Redesain antarmuka portal layanan operasional kapal dan pemodelan alur kerja sistem berbasis BPMN 2.0. Memangkas birokrasi manual pelaporan kapal, mempercepat alokasi armada tunda (tugboat), dan menyediakan pelacakan kapal real-time.",
    modules: [
      "Modul Pelayanan Sandar & Keberangkatan Kapal (Vessel Clearance)",
      "Modul Dispatching Armada Kapal Tunda & Pemanduan",
      "Modul Billing Tarif Layanan Marine Otomatis",
      "Modul Executive Dashboard & Operational Vessel Tracking",
    ],
    techStack: ["Figma", "BPMN 2.0", "UI/UX Research", "Design System", "Enterprise Architecture"],
  },
  {
    id: 4,
    category: "Web Development",
    title: "Smart City Dashboard: Centralized Public Telemetry",
    company: "Dinas Kominfo • Public Service Integration",
    buttonText: "Visit Site",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    ],
    url: "https://github.com",
    description:
      "Portal integrasi telemetri cerdas kota dan sistem pengaduan terpadu masyarakat. Menyatukan data sensor cuaca/kualitas udara, pemantauan status jalan, dan eskalasi aduan warga langsung ke dinas teknis terkait.",
    modules: [
      "Modul GIS Map Telemetri Sensor Lingkungan Real-Time",
      "Modul Pelaporan & Disposisi Aduan Publik Cerdas",
      "Modul Rekapitulasi Indikator Kinerja Pelayanan Publik",
      "Modul Role-Based Access Control Pegawai & Administrator",
    ],
    techStack: ["React", "Node.js", "Express", "Leaflet GIS", "Tailwind CSS", "RESTful API"],
  },
  {
    id: 5,
    category: "UI/UX Design",
    title: "Fintech Mobile Wallet & Contactless Payment Suite",
    company: "Mata Kuliah: Desain Antarmuka & Pengalaman Pengguna (UI/UX)",
    buttonText: "Visit Site",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556742049-0a67e5572263?q=80&w=1200&auto=format&fit=crop",
    ],
    url: "https://figma.com",
    description:
      "Studi kasus desain produk finansial digital yang mengedepankan keamanan biometrik, kemudahan transaksi QRIS tanpa hambatan, serta fitur tabungan berkantong (pocket vaults) untuk milenial dan Gen Z.",
    modules: [
      "Modul E-KYC Verifikasi Identitas & Biometrik Cepat",
      "Modul Transaksi QRIS Nirsentuh & Fitur Split-Bill",
      "Modul Target Tabungan Otomatis (Pocket Vaults)",
      "Modul Visualisasi Laporan Keuangan & Pengeluaran Bulanan",
    ],
    techStack: ["Figma", "Micro-Interactions", "Wireframing", "Prototyping", "QRIS Flow", "Design Tokens"],
  },
  {
    id: 6,
    category: "System Design",
    title: "LEGI Enterprise Architecture & Flow Analysis",
    company: "Mata Kuliah: Perancangan Arsitektur Enterprise (TOGAF)",
    buttonText: "Visit Site",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop",
    ],
    url: "https://github.com",
    description:
      "Dokumentasi dan perancangan arsitektur enterprise komprehensif mengadopsi TOGAF ADM. Menyelaraskan proses bisnis manufaktur, arsitektur data, portofolio aplikasi, dan infrastruktur komputasi awan.",
    modules: [
      "Modul Business Architecture & Value Stream Mapping",
      "Modul Data & Application Architecture Blueprint",
      "Modul Technology & Cloud Infrastructure Topology",
      "Modul Gap Analysis, Transition Planning, & Risk Mitigation",
    ],
    techStack: ["TOGAF ADM", "BPMN 2.0", "Enterprise Architect", "Cloud Architecture", "Data Modeling"],
  },
];

const categories = ["All", "Web Development", "Mobile App", "UI/UX Design", "System Design"];

export default function Projects() {
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
          <ImageExpansionSlider
            slides={projectSlides}
            tabs={categories}
          />
        </div>
      </div>
    </section>
  );
}

