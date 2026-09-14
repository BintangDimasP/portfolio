import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

const initialProjects = [
  {
    title: "Pilmapres FST UNJA: Selection of Outstanding Students",
    category: "Web Development",
    company: "FST Universitas Jambi (UNJA) • Sistem Informasi",
    button_text: "Visit Site",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    ],
    url: "https://github.com",
    description: "The Selection of Outstanding Students (Pilmapres) FST UNJA previously relied on manual physical document collection and Excel-based calculations, which were highly prone to human error. Developed a multi-role web ecosystem (Admin, Jury, Student) that automates scoring based on preset weight matrices, ensuring transparent, real-time, and 100% accurate student rankings.",
    modules: [
      "Multi-Role Authentication System (Admin, Jury, Student)",
      "Automated Matrix Scoring Logic & Weightage Calculations",
      "Live Ranking Leaderboard & Real-Time Analytics",
      "Document Validation Workflow & Portfolio Archiving",
    ],
    tech_stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma", "PXP Matrix"],
    display_order: 1,
  },
  {
    title: "Nyawit Mobile App: Smart Agriculture & Supply Tracking",
    category: "Mobile App",
    company: "Mata Kuliah: Mobile Application Development",
    button_text: "Visit Site",
    image: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=1200&auto=format&fit=crop",
    ],
    url: "https://github.com",
    description: "Aplikasi mobile berbasis offline-first yang dirancang untuk mendukung petani dan pengepul kelapa sawit dalam pencatatan panen digital, kalkulasi tonase, serta pelacakan rantai pasok dari perkebunan hingga pabrik kelapa sawit secara terverifikasi.",
    modules: [
      "Modul Offline-First SQLite Synchronization",
      "Modul Pencatatan Panen & Kalkulasi Tonase Otomatis",
      "Modul Pemetaan Geolocation Polygon Lahan Sawit",
      "Modul Pelacakan Logistik & Supply Chain Manifest",
    ],
    tech_stack: ["Flutter", "Dart", "SQLite", "Firebase", "Google Maps API", "Offline-First"],
    display_order: 2,
  },
  {
    title: "Pelindo Marine Service Portal: Operations & Logistics",
    category: "UI/UX Design",
    company: "PT Pelindo Marine Service • Enterprise Logistics",
    button_text: "Visit Site",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
    ],
    url: "https://figma.com",
    description: "Redesain antarmuka portal layanan operasional kapal dan pemodelan alur kerja sistem berbasis BPMN 2.0. Memangkas birokrasi manual pelaporan kapal, mempercepat alokasi armada tunda (tugboat), dan menyediakan pelacakan kapal real-time.",
    modules: [
      "Modul Pelayanan Sandar & Keberangkatan Kapal (Vessel Clearance)",
      "Modul Dispatching Armada Kapal Tunda & Pemanduan",
      "Modul Billing Tarif Layanan Marine Otomatis",
      "Modul Executive Dashboard & Operational Vessel Tracking",
    ],
    tech_stack: ["Figma", "BPMN 2.0", "UI/UX Research", "Design System", "Enterprise Architecture"],
    display_order: 3,
  },
  {
    title: "Smart City Dashboard: Centralized Public Telemetry",
    category: "Web Development",
    company: "Dinas Kominfo • Public Service Integration",
    button_text: "Visit Site",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    ],
    url: "https://github.com",
    description: "Portal integrasi telemetri cerdas kota dan sistem pengaduan terpadu masyarakat. Menyatukan data sensor cuaca/kualitas udara, pemantauan status jalan, dan eskalasi aduan warga langsung ke dinas teknis terkait.",
    modules: [
      "Modul GIS Map Telemetri Sensor Lingkungan Real-Time",
      "Modul Pelaporan & Disposisi Aduan Publik Cerdas",
      "Modul Rekapitulasi Indikator Kinerja Pelayanan Publik",
      "Modul Role-Based Access Control Pegawai & Administrator",
    ],
    tech_stack: ["React", "Node.js", "Express", "Leaflet GIS", "Tailwind CSS", "RESTful API"],
    display_order: 4,
  },
  {
    title: "Fintech Mobile Wallet & Contactless Payment Suite",
    category: "UI/UX Design",
    company: "Mata Kuliah: Desain Antarmuka & Pengalaman Pengguna (UI/UX)",
    button_text: "Visit Site",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556742049-0a67e5572263?q=80&w=1200&auto=format&fit=crop",
    ],
    url: "https://figma.com",
    description: "Studi kasus desain produk finansial digital yang mengedepankan keamanan biometrik, kemudahan transaksi QRIS tanpa hambatan, serta fitur tabungan berkantong (pocket vaults) untuk milenial dan Gen Z.",
    modules: [
      "Modul E-KYC Verifikasi Identitas & Biometrik Cepat",
      "Modul Transaksi QRIS Nirsentuh & Fitur Split-Bill",
      "Modul Target Tabungan Otomatis (Pocket Vaults)",
      "Modul Visualisasi Laporan Keuangan & Pengeluaran Bulanan",
    ],
    tech_stack: ["Figma", "Micro-Interactions", "Wireframing", "Prototyping", "QRIS Flow", "Design Tokens"],
    display_order: 5,
  },
  {
    title: "LEGI Enterprise Architecture & Flow Analysis",
    category: "System Design",
    company: "Mata Kuliah: Perancangan Arsitektur Enterprise (TOGAF)",
    button_text: "Visit Site",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop",
    ],
    url: "https://github.com",
    description: "Dokumentasi dan perancangan arsitektur enterprise komprehensif mengadopsi TOGAF ADM. Menyelaraskan proses bisnis manufaktur, arsitektur data, portofolio aplikasi, dan infrastruktur komputasi awan.",
    modules: [
      "Modul Architecture Vision, Business Architecture, & TOGAF 9.2",
      "Modul Data & Application Systems Architecture Blueprints",
      "Modul Technology & Cloud Infrastructure Topology",
      "Modul Gap Analysis, Transition Planning, & Risk Mitigation",
    ],
    tech_stack: ["TOGAF ADM", "BPMN 2.0", "Enterprise Architect", "Cloud Architecture", "Data Modeling"],
    display_order: 6,
  },
];

const initialExperiences = [
  {
    year: "2026",
    role: "Graphic Design",
    type: "Freelance",
    company: "Excel Expert",
    location: "WFA",
    period: "May - Present",
    description: "Designing and deploying end-to-end applications. Fully involved in developing scalable web systems, offline-first mobile apps, and institutional information systems.",
    skills: ["Figma", "Canva", "Excel"],
    side: "left",
    display_order: 1,
  },
  {
    year: "2026",
    role: "System Analyst & UI/UX Designer",
    type: "Internship",
    company: "PT Pelindo Marine Service LEGI",
    location: "Surabaya, Indonesia",
    period: "May - September",
    description: "Analyzed business process workflows using BPMN 2.0 with Bizagi & Visio. Designed high-fidelity UI/UX wireframes, prototypes, and user flows in Figma for enterprise portals.",
    skills: ["System Analysis", "Figma", "Bizagi", "Microsoft Visio", "UI/UX Design", "BPMN 2.0"],
    side: "right",
    display_order: 2,
  },
  {
    year: "2025",
    role: "Junior Fullstack Web Developer",
    type: "Internship",
    company: "Dinas Komunikasi & Informatika Jatim",
    location: "Surabaya, Indonesia",
    period: "July - September",
    description: "Analyzed business process workflows using BPMN 2.0 with Bizagi & Visio. Designed high-fidelity UI/UX wireframes, prototypes, and user flows in Figma for enterprise portals.",
    skills: ["System Analysis", "Figma", "Bizagi", "Microsoft Visio", "UI/UX Design", "BPMN 2.0"],
    side: "left",
    display_order: 3,
  },
  {
    year: "2024",
    role: "Graphic Design",
    type: "Volunteer",
    company: "Badan Pusat Statistik Jatim",
    location: "Surabaya, Indonesia",
    period: "July - September",
    description: "Analyzed business process workflows using BPMN 2.0 with Bizagi & Visio. Designed high-fidelity UI/UX wireframes, prototypes, and user flows in Figma for enterprise portals.",
    skills: ["System Analysis", "Figma", "Bizagi", "Microsoft Visio", "UI/UX Design", "BPMN 2.0"],
    side: "right",
    display_order: 4,
  },
];

async function seed() {
  console.log('Seeding Supabase database...');

  // Check if projects already exist
  const { count: projectCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
  if (!projectCount || projectCount === 0) {
    console.log('Inserting initial projects...');
    const { error: projErr } = await supabase.from('projects').insert(initialProjects);
    if (projErr) console.error('Error inserting projects:', projErr);
    else console.log(`✓ Inserted ${initialProjects.length} projects.`);
  } else {
    console.log(`Projects table already has ${projectCount} items. Skipping project seed.`);
  }

  // Check if experiences already exist
  const { count: expCount } = await supabase.from('experiences').select('*', { count: 'exact', head: true });
  if (!expCount || expCount === 0) {
    console.log('Inserting initial experiences...');
    const { error: expErr } = await supabase.from('experiences').insert(initialExperiences);
    if (expErr) console.error('Error inserting experiences:', expErr);
    else console.log(`✓ Inserted ${initialExperiences.length} experiences.`);
  } else {
    console.log(`Experiences table already has ${expCount} items. Skipping experience seed.`);
  }

  console.log('Seeding completed successfully!');
}

seed().catch((err) => {
  console.error('Seed error:', err);
});
