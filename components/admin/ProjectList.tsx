"use client";

import React, { useState, useEffect, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { deleteProject, reorderProjects } from "@/app/admin/actions";
import ProjectModal from "@/components/admin/ProjectModal";
import { Reorder } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Search,
  ArrowUpDown,
  GripVertical,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  Check,
  Loader2,
} from "lucide-react";

interface ProjectListProps {
  initialProjects: any[];
}

export default function ProjectList({ initialProjects }: ProjectListProps) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Reorder state
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category as string)))];

  const filtered = projects.filter((p) => {
    const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
    const q = search.toLowerCase();
    const matchSearch =
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tech_stack ?? []).some((t: string) => t.toLowerCase().includes(q));
    return matchCategory && matchSearch;
  });

  const handleDelete = (id: number, title: string) => {
    if (!confirm(`Hapus proyek "${title}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    startTransition(async () => {
      await deleteProject(id);
      router.refresh();
    });
  };

  // Save new order to server
  const saveOrderToServer = async (newProjects: any[]) => {
    setIsSavingOrder(true);
    try {
      const orderedIds = newProjects.map((p) => p.id);
      await reorderProjects(orderedIds);
      setSaveStatus("Urutan tersimpan!");
      setTimeout(() => setSaveStatus(null), 2500);
      router.refresh();
    } catch (err) {
      console.error("Gagal menyimpan urutan:", err);
      setSaveStatus("Gagal menyimpan urutan");
    } finally {
      setIsSavingOrder(false);
    }
  };

  // Move item by direction (up, down, top)
  const moveItem = (index: number, direction: "up" | "down" | "top") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === projects.length - 1) return;
    if (direction === "top" && index === 0) return;

    const newArr = [...projects];
    const item = newArr[index];

    if (direction === "top") {
      newArr.splice(index, 1);
      newArr.unshift(item);
    } else if (direction === "up") {
      newArr[index] = newArr[index - 1];
      newArr[index - 1] = item;
    } else if (direction === "down") {
      newArr[index] = newArr[index + 1];
      newArr[index + 1] = item;
    }

    setProjects(newArr);
    saveOrderToServer(newArr);
  };

  // Handler for drag-and-drop reorder
  const handleDragReorder = (newOrder: any[]) => {
    setProjects(newOrder);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      saveOrderToServer(newOrder);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari proyek..."
            value={search}
            disabled={isReorderMode}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 shadow-theme-xs disabled:opacity-50 disabled:bg-gray-50"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Reorder Mode Toggle Button */}
          <button
            onClick={() => {
              if (!isReorderMode) {
                setSelectedCategory("All");
                setSearch("");
              }
              setIsReorderMode(!isReorderMode);
            }}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors shadow-theme-xs ${
              isReorderMode
                ? "bg-brand-50 text-brand-600 border border-brand-300 hover:bg-brand-100"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <ArrowUpDown className="h-4 w-4 text-brand-500" />
            {isReorderMode ? "Tampilan Grid" : "Atur Urutan"}
          </button>

          {/* Add project button */}
          <button
            onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors shadow-theme-xs shrink-0"
          >
            <Plus className="h-4 w-4" />
            Tambah Proyek
          </button>
        </div>
      </div>

      {/* Category Pills (Hidden in Reorder Mode) */}
      {!isReorderMode && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-brand-500 text-white shadow-theme-xs"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Reorder Mode Helper Banner */}
      {isReorderMode && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-theme-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-xs">
              <ArrowUpDown className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Mode Atur Urutan Proyek</h4>
              <p className="text-xs text-gray-600">
                Tarik pegangan <span className="inline-block font-mono font-bold text-gray-700">⠿</span> atau gunakan tombol panah untuk mengubah posisi. Urutan akan tersimpan otomatis ke database.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {isSavingOrder ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-brand-600 border border-brand-200 shadow-xs">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Menyimpan...
              </span>
            ) : saveStatus ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
                <Check className="h-3.5 w-3.5 text-emerald-600" /> {saveStatus}
              </span>
            ) : null}
            <button
              onClick={() => setIsReorderMode(false)}
              className="rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600 transition-colors shadow-theme-xs"
            >
              Selesai
            </button>
          </div>
        </div>
      )}

      {/* Content Rendering: Reorder List vs Grid */}
      {isReorderMode ? (
        /* Reorder Drag & Drop List */
        projects.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 shadow-theme-xs text-center">
            <p className="text-sm font-semibold text-gray-700">Belum ada proyek untuk diurutkan</p>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={projects}
            onReorder={handleDragReorder}
            className="flex flex-col gap-2.5"
          >
            {projects.map((project, index) => (
              <Reorder.Item
                key={project.id}
                value={project}
                className="group flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-3.5 shadow-theme-xs hover:border-brand-300 hover:shadow-theme-sm transition-all select-none"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Drag Handle */}
                  <div
                    className="flex h-10 w-8 shrink-0 cursor-grab active:cursor-grabbing items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    title="Tarik untuk menggeser posisi"
                  >
                    <GripVertical className="h-5 w-5" />
                  </div>

                  {/* Position Badge */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 font-bold text-xs border border-brand-100">
                    #{index + 1}
                  </div>

                  {/* Thumbnail */}
                  <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">
                      {project.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                        {project.category}
                      </span>
                      {project.company && (
                        <span className="text-xs text-gray-400 truncate">
                          • {project.company}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Reorder Action Buttons */}
                <div className="flex items-center justify-end gap-1.5 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); moveItem(index, "top"); }}
                    disabled={index === 0 || isSavingOrder}
                    title="Pindahkan ke paling atas (#1)"
                    className="flex h-8 items-center gap-1 px-2.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-colors disabled:opacity-30 disabled:pointer-events-none shadow-theme-xs"
                  >
                    <ChevronsUp className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Teratas</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveItem(index, "up"); }}
                    disabled={index === 0 || isSavingOrder}
                    title="Naikkan 1 posisi"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-colors disabled:opacity-30 disabled:pointer-events-none shadow-theme-xs"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveItem(index, "down"); }}
                    disabled={index === projects.length - 1 || isSavingOrder}
                    title="Turunkan 1 posisi"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-colors disabled:opacity-30 disabled:pointer-events-none shadow-theme-xs"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )
      ) : (
        /* Regular Projects Grid */
        filtered.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 shadow-theme-xs text-center">
            <Search className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm font-semibold text-gray-700">Tidak ada proyek yang cocok</p>
            <p className="mt-1 text-xs text-gray-400">Coba ubah kata kunci pencarian atau kategori filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((project) => {
              const globalIndex = projects.findIndex((p) => p.id === project.id);
              return (
                <div
                  key={project.id}
                  className="group flex flex-col rounded-2xl border border-gray-200 bg-white shadow-theme-xs hover:shadow-theme-md hover:border-brand-200 transition-all overflow-hidden"
                >
                  {/* Cover Image */}
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Category badge */}
                    <span className="absolute top-3 left-3 rounded-full border border-gray-200 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-semibold text-gray-700">
                      {project.category}
                    </span>
                    {/* Position badge */}
                    <span
                      className="absolute top-3 right-3 rounded-full border border-brand-200 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-bold text-brand-600 shadow-xs"
                      title={`Urutan Tampilan #${globalIndex + 1}`}
                    >
                      #{globalIndex + 1}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div>
                      <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2">
                        {project.title}
                      </h3>
                      {project.company && (
                        <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">{project.company}</p>
                      )}
                      <p className="mt-2 text-xs text-gray-500 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech stack */}
                    {project.tech_stack?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 border-t border-gray-100 pt-3">
                        {project.tech_stack.slice(0, 4).map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech_stack.length > 4 && (
                          <span className="px-1.5 py-0.5 text-[10px] text-gray-400">
                            +{project.tech_stack.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/60 px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {/* Edit & Delete */}
                      <button
                        onClick={() => { setEditingProject(project); setIsModalOpen(true); }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-brand-300 hover:text-brand-500 transition-colors shadow-theme-xs"
                        title="Edit Proyek"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        disabled={isPending}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-error-100 bg-error-50 text-error-600 hover:bg-error-100 transition-colors"
                        title="Hapus Proyek"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      {/* Quick Move Up/Down */}
                      <div className="flex items-center gap-1 border-l border-gray-200 pl-1.5 ml-0.5">
                        <button
                          onClick={() => moveItem(globalIndex, "up")}
                          disabled={globalIndex === 0 || isSavingOrder}
                          title="Naikkan urutan"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-brand-300 hover:text-brand-500 transition-colors disabled:opacity-30 disabled:pointer-events-none shadow-theme-xs"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => moveItem(globalIndex, "down")}
                          disabled={globalIndex === projects.length - 1 || isSavingOrder}
                          title="Turunkan urutan"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-brand-300 hover:text-brand-500 transition-colors disabled:opacity-30 disabled:pointer-events-none shadow-theme-xs"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-brand-500 transition-colors"
                      >
                        Demo <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Modal */}
      <ProjectModal
        project={editingProject}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProject(null); }}
        existingCategories={categories.filter((c) => c !== "All")}
      />
    </div>
  );
}
