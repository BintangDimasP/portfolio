import React from "react";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getExperiences } from "@/app/admin/actions";
import ExperienceList from "@/components/admin/ExperienceList";

export default async function AdminExperiencePage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const experiences = await getExperiences();

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 pb-6 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Manajemen Pengalaman Kerja
        </h1>
        <p className="text-sm text-gray-500">
          Kelola riwayat karir, freelance, internship, dan skills yang tampil di linimasa Work Experience.
        </p>
      </div>

      {/* Interactive Experience List */}
      <ExperienceList initialExperiences={experiences} />
    </div>
  );
}
