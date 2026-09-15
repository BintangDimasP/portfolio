"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TechToolItem, saveTechTool, uploadToolIcon } from "@/app/admin/actions";
import { X, Upload, Loader2, Search, Check, Sparkles, Palette } from "lucide-react";

interface ToolModalProps {
  tool?: TechToolItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_ICONS = [
  { label: "Next.js", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", color: "#171717", category: "Frontend" },
  { label: "React", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", color: "#087ea4", category: "Frontend" },
  { label: "TypeScript", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", color: "#1c5285", category: "Frontend" },
  { label: "JavaScript", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", color: "#b8860b", category: "Frontend" },
  { label: "Tailwind CSS", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", color: "#0369a1", category: "Frontend" },
  { label: "HTML5", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", color: "#c84318", category: "Frontend" },
  { label: "CSS3", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", color: "#12619d", category: "Frontend" },
  { label: "Node.js", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", color: "#22c55e", category: "Backend" },
  { label: "Python", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", color: "#244f77", category: "Backend" },
  { label: "PHP", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg", color: "#4d547f", category: "Backend" },
  { label: "Laravel", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg", color: "#c51717", category: "Backend" },
  { label: "PostgreSQL", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", color: "#336791", category: "Database" },
  { label: "MySQL", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", color: "#00576e", category: "Database" },
  { label: "Supabase", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg", color: "#10b981", category: "Database" },
  { label: "MongoDB", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", color: "#16a34a", category: "Database" },
  { label: "Docker", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", color: "#116199", category: "DevOps" },
  { label: "Git", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", color: "#bf371d", category: "Tools" },
  { label: "GitHub", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", color: "#18181b", category: "Tools" },
  { label: "VS Code", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg", color: "#005a9e", category: "Tools" },
  { label: "Postman", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg", color: "#c84a1a", category: "Tools" },
  { label: "Figma", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", color: "#6c2bd9", category: "Design" },
  { label: "Flutter", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg", color: "#0284c7", category: "Mobile" },
  { label: "Kotlin", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg", color: "#7c3aed", category: "Mobile" },
  { label: "Bizagi", icon_url: "/icons/bizagi.svg", color: "#006d96", category: "Design & Modeling" },
  { label: "Visio", icon_url: "/icons/visio.svg", color: "#23386d", category: "Design & Modeling" },
];

const PRESET_COLORS = [
  "#171717", "#087ea4", "#1c5285", "#0369a1", "#c84318",
  "#12619d", "#244f77", "#4d547f", "#c51717", "#00576e",
  "#6c2bd9", "#116199", "#bf371d", "#005a9e", "#10b981",
];

const inputCls =
  "h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-3 focus:ring-brand-500/10 transition-all";

const labelCls = "block text-sm font-medium text-gray-700";

export default function ToolModal({ tool, isOpen, onClose }: ToolModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [label, setLabel] = useState(tool?.label || "");
  const [category, setCategory] = useState(tool?.category || "Development");
  const [color, setColor] = useState(tool?.color || "#171717");
  const [iconUrl, setIconUrl] = useState(tool?.icon_url || "");
  const [displayOrder, setDisplayOrder] = useState<number>(tool?.display_order ?? 0);
  const [presetSearch, setPresetSearch] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (tool) {
        setLabel(tool.label);
        setCategory(tool.category || "Development");
        setColor(tool.color || "#171717");
        setIconUrl(tool.icon_url || "");
        setDisplayOrder(tool.display_order ?? 0);
      } else {
        setLabel("");
        setCategory("Development");
        setColor("#171717");
        setIconUrl("");
        setDisplayOrder(0);
      }
      setPresetSearch("");
      setError("");
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [tool, isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (p: typeof PRESET_ICONS[0]) => {
    if (!label) setLabel(p.label);
    setIconUrl(p.icon_url);
    setColor(p.color);
    if (p.category) setCategory(p.category);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadToolIcon(formData);
      if (res?.url) {
        setIconUrl(res.url);
      }
    } catch (err: any) {
      setError(err.message || "Gagal mengunggah icon.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!label.trim()) {
      setError("Nama tool / skill wajib diisi.");
      return;
    }
    if (!iconUrl.trim()) {
      setError("Silakan pilih atau unggah icon terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    if (tool?.id) formData.append("id", String(tool.id));
    formData.append("label", label.trim());
    formData.append("category", category.trim());
    formData.append("color", color.trim());
    formData.append("icon_url", iconUrl.trim());
    formData.append("display_order", String(displayOrder));

    startTransition(async () => {
      try {
        await saveTechTool(formData);
        router.refresh();
        onClose();
      } catch (err: any) {
        setError(err.message || "Gagal menyimpan tool.");
      }
    });
  };

  const filteredPresets = PRESET_ICONS.filter((p) =>
    p.label.toLowerCase().includes(presetSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-hidden animate-in fade-in">
      <div className="relative flex flex-col w-full max-w-xl max-h-[90vh] rounded-2xl border border-gray-200 bg-white shadow-theme-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Sticky Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4 bg-white">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {tool ? "Edit Tech & Tool" : "Tambah Tech & Tool Baru"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Kelola ikon 3D glass untuk bagian Persona portfolio Anda.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
            {error && (
              <div className="rounded-lg border border-error-100 bg-error-50 px-4 py-3 text-sm text-error-600">
                {error}
              </div>
            )}

            {/* Live 3D Glass Icon Preview Card */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50/80 to-gray-100/50 p-4 flex items-center justify-center gap-6">
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Preview Tampilan 3D
                </span>
                <div
                  className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-md transition-all"
                  style={{
                    backgroundColor: color || "#171717",
                    boxShadow: `0 10px 20px -5px ${color || "#000"}40`,
                  }}
                >
                  {/* Glass overlay layer */}
                  <div className="absolute inset-1 rounded-xl bg-white/70 backdrop-blur-md flex items-center justify-center p-2.5 shadow-sm">
                    {iconUrl ? (
                      <img
                        src={iconUrl}
                        alt={label || "Preview"}
                        className="w-full h-full object-contain"
                        onError={() => setError("Icon URL tidak valid.")}
                      />
                    ) : (
                      <Sparkles className="w-5 h-5 text-gray-400 animate-pulse" />
                    )}
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-800 mt-2">
                  {label || "Nama Tool"}
                </span>
              </div>
            </div>

            {/* Label / Name */}
            <div>
              <label className={labelCls}>
                Nama Keahlian / Tool <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
                placeholder="Contoh: Next.js, Figma, Docker..."
                className={`mt-1.5 ${inputCls}`}
              />
            </div>

            {/* Category & Display Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Kategori</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Frontend, Backend, Design, DevOps..."
                  className={`mt-1.5 ${inputCls}`}
                />
              </div>
              <div>
                <label className={labelCls}>Urutan Tampilan</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                  min={0}
                  className={`mt-1.5 ${inputCls}`}
                />
              </div>
            </div>

            {/* Color Picker & Preset Swatches */}
            <div>
              <label className={labelCls}>
                Warna Aksen 3D Layer <span className="text-error-500">*</span>
              </label>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-7 w-7 rounded-lg border-2 transition-all cursor-pointer ${
                      color.toLowerCase() === c.toLowerCase()
                        ? "border-brand-500 scale-110 shadow-sm"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
                {/* Custom Color Input */}
                <div className="flex items-center gap-2 ml-auto">
                  <input
                    type="color"
                    value={color.startsWith("#") ? color : "#171717"}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded-lg border border-gray-200 bg-transparent p-0.5"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="#171717"
                    className="h-8 w-24 rounded-lg border border-gray-200 bg-gray-50 px-2 text-xs font-mono text-gray-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Icon Selection & Upload */}
            <div className="flex flex-col gap-2.5">
              <label className={labelCls}>
                Pilihan Icon <span className="text-error-500">*</span>
              </label>

              {/* Upload or Custom URL input */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={iconUrl}
                  onChange={(e) => setIconUrl(e.target.value)}
                  placeholder="https://... atau pilih dari preset di bawah"
                  required
                  className={`flex-1 ${inputCls}`}
                />
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shrink-0 shadow-theme-xs">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
                  ) : (
                    <Upload className="h-4 w-4 text-gray-500" />
                  )}
                  <span>{uploading ? "Mengunggah..." : "Upload SVG"}</span>
                  <input
                    type="file"
                    accept="image/*,.svg"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Popular Presets Quick Selector */}
              <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-3 mt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-brand-500" />
                    Pilih Cepat dari Preset Devicons
                  </span>
                  <div className="relative w-36 sm:w-44">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Cari icon..."
                      value={presetSearch}
                      onChange={(e) => setPresetSearch(e.target.value)}
                      className="h-7 w-full rounded-md border border-gray-200 bg-white pl-7 pr-2 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto pr-1">
                  {filteredPresets.map((p) => {
                    const isSelected = iconUrl === p.icon_url;
                    return (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => handleSelectPreset(p)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all cursor-pointer text-center ${
                          isSelected
                            ? "bg-white border-brand-500 shadow-sm ring-1 ring-brand-500/20"
                            : "bg-white/60 border-gray-200 hover:bg-white hover:border-gray-300"
                        }`}
                        title={`Pilih ${p.label}`}
                      >
                        <img
                          src={p.icon_url}
                          alt={p.label}
                          className="h-6 w-6 object-contain"
                        />
                        <span className="text-[10px] font-medium text-gray-700 truncate w-full">
                          {p.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
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
              disabled={isPending || uploading}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors shadow-theme-xs disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {tool ? "Simpan Perubahan" : "Tambah Tool"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
