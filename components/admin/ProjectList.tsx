"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProject } from "@/app/admin/actions";
import ProjectModal from "@/components/admin/ProjectModal";
import { Plus, Edit2, Trash2, ExternalLink, Search } from "lucide-react";

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
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 shadow-theme-xs"
          />
        </div>

        {/* Add button */}
        <button
          onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors shadow-theme-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          Tambah Proyek
        </button>
      </div>

      {/* Category Pills */}
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

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 shadow-theme-xs text-center">
          <Search className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm font-semibold text-gray-700">Tidak ada proyek yang cocok</p>
          <p className="mt-1 text-xs text-gray-400">Coba ubah kata kunci pencarian atau kategori filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((project) => (
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
                <div className="flex items-center gap-2">
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
          ))}
        </div>
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
