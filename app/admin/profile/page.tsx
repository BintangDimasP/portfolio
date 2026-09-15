import React from "react";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getProfile, getTechTools } from "@/app/admin/actions";
import ProfileManager from "@/components/admin/ProfileManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Profil & Keahlian | Admin CMS",
  description: "Kelola Hero Banner, About Me, Berkas CV, dan Tech & Tools",
};

export default async function AdminProfilePage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const [profile, techTools] = await Promise.all([
    getProfile(),
    getTechTools(),
  ]);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 pb-6 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Profil &amp; Keahlian
        </h1>
        <p className="text-sm text-gray-500">
          Kelola informasi Hero Section, Persona / About Me, Foto Profil, Berkas CV (PDF), dan ikon 3D Tech &amp; Tools.
        </p>
      </div>

      {/* Main Profile & Tools Manager */}
      <ProfileManager initialProfile={profile} initialTools={techTools} />
    </div>
  );
}
