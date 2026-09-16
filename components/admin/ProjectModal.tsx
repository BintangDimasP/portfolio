"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveProject } from "@/app/admin/actions";
import { X, Loader2, ChevronDown, Sparkles, Briefcase } from "lucide-react";
import SkillTagInput from "@/components/admin/SkillTagInput";
import ProjectImageManager from "@/components/admin/ProjectImageManager";
import { isDesignCategory, isProjectAcademic, getProjectRole } from "@/lib/utils";

interface ProjectModalProps {
  project?: any;
  isOpen: boolean;
  onClose: () => void;
  existingCategories?: string[];
}

const DEFAULT_CATEGORIES = ["Web Developer", "UI/UX Design", "Graphic Design"];

const PRESET_ROLES = [
  "Fullstack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Mobile App Developer",
  "UI/UX & Frontend Developer",
  "DevOps / Cloud Engineer",
  "Software Engineer / Lead Dev",
];

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
  const [isAcademic, setIsAcademic] = useState<boolean>(
    isProjectAcademic(project)
  );

  // Role state (for Web Dev / non-design categories)
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [customRole, setCustomRole] = useState<string>("");

  // Confirmation modal state before save/create
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  const currentCategory = selectedCategory === "__CUSTOM__" ? customCategory.trim() : selectedCategory;
  const isDesign = isDesignCategory(currentCategory);

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
      setIsAcademic(isProjectAcademic(project));

      const existingRole = getProjectRole(project) || "";
      if (PRESET_ROLES.includes(existingRole)) {
        setSelectedRole(existingRole);
        setCustomRole("");
      } else if (existingRole) {
        setSelectedRole("__CUSTOM__");
        setCustomRole(existingRole);
      } else {
        setSelectedRole("");
        setCustomRole("");
      }

      setCustomCategory("");
      setError("");
      setShowConfirmSave(false);
      setPendingFormData(null);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handlePreSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

    const finalRole = isDesign ? "" : (selectedRole === "__CUSTOM__" ? customRole.trim() : selectedRole);

    const formData = new FormData(e.currentTarget);
    formData.set("category", finalCategory);
    formData.set("role", finalRole);
    formData.set("is_academic", isAcademic ? "true" : "false");
    formData.set("image", images[0]);
    formData.set("images", images.join("\n"));

    setPendingFormData(formData);
    setShowConfirmSave(true);
  };

  const handleConfirmedSave = () => {
    if (!pendingFormData) return;
    startTransition(async () => {
      try {
        await saveProject(pendingFormData);
        router.refresh();
        setShowConfirmSave(false);
        onClose();
      } catch (err: any) {
        setError(err.message || "Gagal menyimpan proyek.");
        setShowConfirmSave(false);
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
        <form onSubmit={handlePreSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
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

            {/* Role in Project (Web Dev / Non-Design Only) */}
            {!isDesign && (
              <div className="rounded-xl border border-brand-100 bg-brand-50/40 p-3.5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-brand-600" />
                    Role Anda dalam Proyek
                  </label>
                  <span className="text-[11px] text-brand-700 bg-brand-100/70 font-medium px-2 py-0.5 rounded-full">
                    Khusus Web Dev
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={selectedRole}
                    onChange={(e) => {
                      setSelectedRole(e.target.value);
                      if (e.target.value !== "__CUSTOM__") setCustomRole("");
                    }}
                    className={`${inputCls} appearance-none pr-10 cursor-pointer bg-white`}
                  >
                    <option value="">-- Pilih Role (Opsional) --</option>
                    {PRESET_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                    <option value="__CUSTOM__">✨ + Ketik Role Lainnya...</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>

                {selectedRole === "__CUSTOM__" && (
                  <div className="mt-1 flex flex-col gap-1">
                    <input
                      type="text"
                      placeholder="Ketik role kustom Anda (misal: AI Engineer, Tech Lead...)"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      autoFocus
                      className={`${inputCls} bg-white`}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Academy Project Checkbox Option */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 hover:bg-gray-50 transition-colors">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="is_academic"
                  checked={isAcademic}
                  onChange={(e) => setIsAcademic(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500/20 cursor-pointer"
                />
                <span className="text-sm font-semibold text-gray-800">
                  Academy
                </span>
                <span className="text-xs text-gray-400">
                  (Tampilkan badge Academy di bawah judul proyek)
                </span>
              </label>
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

            {/* Modules (one per line) - Hidden for Design Categories */}
            {isDesign ? (
              <input type="hidden" name="modules" value="" />
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

            {/* Tech Stack / Tools & Skills */}
            <SkillTagInput
              name="tech_stack"
              label={isDesign ? "Tools & Skills" : "Tech Stack & Tools"}
              placeholder={
                isDesign
                  ? "Cari atau pilih tools & skills (misal: Figma, Wireframing, User Research, Prototyping, Adobe Illustrator, Canva)..."
                  : "Cari atau pilih tech stack & tools (misal: Next.js, React, Tailwind CSS, PostgreSQL)..."
              }
              initialSkills={project?.tech_stack || []}
            />

            {/* Display Order */}
            <div>
              <div className="flex items-baseline justify-between">
                <label className={labelCls}>Urutan Tampilan</label>
                <span className="text-[11px] text-gray-400">Opsional</span>
              </div>
              <input
                type="number"
                name="display_order"
                defaultValue={project?.display_order ?? 0}
                min={0}
                className={`mt-1.5 w-32 ${inputCls}`}
              />
              <p className="mt-1 text-[11px] text-gray-500">
                Isi 0 atau kosongkan agar otomatis berada di urutan paling awal (posisi #1). Anda juga bisa mengubah urutan secara visual dengan drag & drop di daftar proyek.
              </p>
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

      {/* Confirmation Modal for Save / Create */}
      {showConfirmSave && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {project ? "Konfirmasi Simpan Perubahan" : "Konfirmasi Buat Proyek"}
            </h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Apakah Anda yakin ingin {project ? "menyimpan perubahan pada" : "menambahkan"} proyek{" "}
              <strong className="text-gray-900 font-semibold">
                &quot;{pendingFormData?.get("title")?.toString() || ""}&quot;
              </strong>
              ? Data akan langsung diperbarui ke portfolio publik.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setShowConfirmSave(false)}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleConfirmedSave}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors shadow-theme-xs disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {project ? "Ya, Simpan" : "Ya, Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
