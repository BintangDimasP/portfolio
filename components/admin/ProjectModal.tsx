"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveProject } from "@/app/admin/actions";
import { X, Loader2, ChevronDown, Sparkles } from "lucide-react";
import SkillTagInput from "@/components/admin/SkillTagInput";
import ProjectImageManager from "@/components/admin/ProjectImageManager";
import { isGraphicDesignCategory } from "@/lib/utils";

interface ProjectModalProps {
  project?: any;
  isOpen: boolean;
  onClose: () => void;
  existingCategories?: string[];
}

const DEFAULT_CATEGORIES = ["Web Developer", "UI/UX Design", "Graphic Design"];

const inputCls =
  "h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-3 focus:ring-brand-500/10 transition-all";

const labelCls = "block text-sm font-medium text-gray-700";

export default function ProjectModal({
  project,
  isOpen,
  onClose,
  existingCategories = [],
}: ProjectModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");

  // Merge default categories with any existing categories in database and current project
  const allCategories = Array.from(
    new Set([
      ...DEFAULT_CATEGORIES,
      ...existingCategories.filter(Boolean),
      ...(project?.category ? [project.category] : []),
    ])
  );

  const [selectedCategory, setSelectedCategory] = useState<string>(
    project?.category || DEFAULT_CATEGORIES[0]
  );
  const [customCategory, setCustomCategory] = useState<string>("");

  const currentCategory = selectedCategory === "__CUSTOM__" ? customCategory.trim() : selectedCategory;
  const isGraphic = isGraphicDesignCategory(currentCategory);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const initialImages: string[] = [];
      if (project?.images && Array.isArray(project.images) && project.images.length > 0) {
        initialImages.push(...project.images.filter(Boolean));
      } else if (project?.image) {
        initialImages.push(project.image);
      }
      setImages(initialImages);

      if (project?.category) {
        setSelectedCategory(project.category);
      } else {
        setSelectedCategory(DEFAULT_CATEGORIES[0]);
      }
      setCustomCategory("");
      setError("");
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [project, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const finalCategory =
      selectedCategory === "__CUSTOM__"
        ? customCategory.trim()
        : selectedCategory;

    if (!finalCategory) {
      setError("Silakan pilih atau masukkan kategori proyek.");
      return;
    }

    if (images.length === 0) {
      setError("Silakan tambahkan minimal 1 gambar cover proyek.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("category", finalCategory);
    formData.set("image", images[0]);
    formData.set("images", images.join("\n"));

    startTransition(async () => {
      try {
        await saveProject(formData);
        router.refresh();
        onClose();
      } catch (err: any) {
        setError(err.message || "Gagal menyimpan proyek.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-hidden animate-in fade-in">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-2xl border border-gray-200 bg-white shadow-theme-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Sticky Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4 bg-white">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {project ? "Edit Proyek" : "Tambah Proyek Baru"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Isi detail dan galeri proyek portfolio Anda.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Container with scrollable body & sticky footer */}
        <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
            {error && (
              <div className="rounded-lg border border-error-100 bg-error-50 px-4 py-3 text-sm text-error-600">
                {error}
              </div>
            )}

            {project?.id && <input type="hidden" name="id" value={project.id} />}

            {/* Hidden resolved category input for FormData */}
            <input
              type="hidden"
              name="category"
              value={selectedCategory === "__CUSTOM__" ? customCategory.trim() : selectedCategory}
            />

            {/* Title */}
            <div>
              <label className={labelCls}>
                Judul Proyek <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                defaultValue={project?.title || ""}
                placeholder="Contoh: Pilmapres FST UNJA..."
                className={`mt-1.5 ${inputCls}`}
              />
            </div>

            {/* Category (Dynamic Dropdown) + Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>
                  Kategori <span className="text-error-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      if (e.target.value !== "__CUSTOM__") setCustomCategory("");
                    }}
                    className={`${inputCls} appearance-none pr-10 cursor-pointer`}
                  >
                    <optgroup label="Pilihan Kategori">
                      {allCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </optgroup>
                    <option value="__CUSTOM__">✨ + Tambah Kategori Baru...</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>

                {/* Custom Category Input if selected */}
                {selectedCategory === "__CUSTOM__" && (
                  <div className="mt-2 flex flex-col gap-1">
                    <input
                      type="text"
                      placeholder="Ketik kategori baru (misal: Academy, Mobile App...)"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      required
                      autoFocus
                      className={inputCls}
                    />
                    <p className="text-[11px] text-gray-400">
                      Kategori ini otomatis tersimpan dan langsung menjadi opsi filter di portfolio.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className={labelCls}>Instansi / Klien / Penyelenggara</label>
                <input
                  type="text"
                  name="company"
                  defaultValue={project?.company || ""}
                  placeholder="Contoh: FST UNJA, Bangkit Academy..."
                  className={`mt-1.5 ${inputCls}`}
                />
              </div>
            </div>

            {/* Project Images (Add, Update/Replace, Delete, Cover) */}
            <ProjectImageManager
              images={images}
              onChange={setImages}
              setError={setError}
            />

            {/* Description */}
            <div>
              <label className={labelCls}>
                Deskripsi Proyek <span className="text-error-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={3}
                defaultValue={project?.description || ""}
                placeholder="Jelaskan masalah, solusi, dan dampak proyek ini..."
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-3 focus:ring-brand-500/10 transition-all"
              />
            </div>

            {/* Modules (one per line) - Conditionally hidden for Graphic Design */}
            {isGraphic ? (
              <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50/80 p-4 flex items-start gap-3 text-xs text-amber-900">
                <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-amber-950">Mode Portofolio Desain Grafis (Instagram Showcase)</p>
                  <p className="text-amber-800/90 leading-relaxed">
                    Kategori Graphic Design akan menampilkan galeri karya visual secara penuh (utuh tanpa terpotong) dengan navigasi multi-slide ala Instagram. Bagian modul teknis otomatis ditiadakan.
                  </p>
                </div>
                <input type="hidden" name="modules" value="" />
              </div>
            ) : (
              <div>
                <label className={labelCls}>Modul / Fitur Utama (1 baris per modul)</label>
                <textarea
                  name="modules"
                  rows={3}
                  defaultValue={(project?.modules || []).join("\n")}
                  placeholder={"Modul Autentikasi Multi-Role\nModul Kalkulasi Otomatis\nLive Ranking Leaderboard"}
                  className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-3 focus:ring-brand-500/10 transition-all font-mono text-xs"
                />
              </div>
            )}

            {/* Tech Stack (Dropdown & Tag Selector like LinkedIn) */}
            <SkillTagInput
              name="tech_stack"
              label={isGraphic ? "Design Tools & Software" : "Tech Stack & Tools"}
              placeholder={
                isGraphic
                  ? "Cari atau pilih software desain (misal: Figma, Canva, Adobe Photoshop, Illustrator)..."
                  : "Cari atau pilih tech stack (misal: Next.js, Figma, Tailwind CSS)..."
              }
              initialSkills={project?.tech_stack || []}
            />

            {/* Display Order */}
            <div>
              <label className={labelCls}>Urutan Tampilan</label>
              <input
                type="number"
                name="display_order"
                defaultValue={project?.display_order ?? 0}
                min={0}
                className={`mt-1.5 w-32 ${inputCls}`}
              />
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 bg-gray-50/50">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors shadow-theme-xs disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {project ? "Simpan Perubahan" : "Tambah Proyek"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
