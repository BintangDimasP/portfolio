import React from "react";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getProjects } from "@/app/admin/actions";
import ProjectList from "@/components/admin/ProjectList";

export default async function AdminProjectsPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const projects = await getProjects();

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 pb-6 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Manajemen Proyek
        </h1>
        <p className="text-sm text-gray-500">
          Kelola portofolio karya, modul fitur, cover gambar, dan tech stack yang tampil di website.
        </p>
      </div>

      {/* Interactive Project List */}
      <ProjectList initialProjects={projects} />
    </div>
  );
}
