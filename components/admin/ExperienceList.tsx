"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteExperience } from "@/app/admin/actions";
import ExperienceModal from "@/components/admin/ExperienceModal";
import { sortExperiencesChronologically } from "@/lib/experience-sorter";
import { Plus, Edit2, Trash2, MapPin, Calendar } from "lucide-react";

interface ExperienceListProps {
  initialExperiences: any[];
}

export default function ExperienceList({ initialExperiences }: ExperienceListProps) {
  const router = useRouter();
  const [experiences, setExperiences] = useState(() =>
    sortExperiencesChronologically(initialExperiences || [])
  );
  const [editingExp, setEditingExp] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setExperiences(sortExperiencesChronologically(initialExperiences || []));
  }, [initialExperiences]);

  const handleDelete = (id: number, role: string, company: string) => {
    if (!confirm(`Hapus pengalaman "${role} di ${company}"?`)) return;
    setExperiences((prev) => prev.filter((e) => e.id !== id));
    startTransition(async () => {
      await deleteExperience(id);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Action */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Total:{" "}
          <span className="font-semibold text-gray-800">{experiences.length} riwayat pengalaman</span>
        </p>
        <button
          onClick={() => { setEditingExp(null); setIsModalOpen(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors shadow-theme-xs"
        >
          <Plus className="h-4 w-4" />
          Tambah Pengalaman
        </button>
      </div>

      {/* List */}
      {experiences.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 shadow-theme-xs text-center">
          <p className="text-sm font-semibold text-gray-600">Belum ada data pengalaman kerja</p>
          <p className="mt-1 text-xs text-gray-400">Klik tombol di atas untuk menambahkan riwayat karir pertama Anda.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {experiences.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-theme-xs hover:shadow-theme-sm hover:border-brand-200 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              {/* Content */}
              <div className="flex flex-1 flex-col gap-2.5 min-w-0">
                {/* Header */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-600">
                    {item.year}
                  </span>
                  <h3 className="font-semibold text-gray-900">{item.role}</h3>
                  <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                    {item.type}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="font-medium text-gray-700">{item.company}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {item.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {item.period}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                {/* Skills */}
                {item.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.skills.map((skill: string, i: number) => (
                      <span
                        key={i}
                        className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 sm:self-start">
                <button
                  onClick={() => { setEditingExp(item); setIsModalOpen(true); }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-brand-300 hover:text-brand-500 transition-colors shadow-theme-xs"
                  title="Edit Pengalaman"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.role, item.company)}
                  disabled={isPending}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-error-100 bg-error-50 text-error-600 hover:bg-error-100 transition-colors"
                  title="Hapus Pengalaman"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <ExperienceModal
        experience={editingExp}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingExp(null); }}
      />
    </div>
  );
}
