import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getProjects, getExperiences, getContactMessages } from "@/app/admin/actions";
import {
  FolderKanban,
  Briefcase,
  Mail,
  Plus,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) redirect("/admin/login");

  const [projects, experiences, messages] = await Promise.all([
    getProjects(),
    getExperiences(),
    getContactMessages(),
  ]);

  const unreadCount = messages.filter((m: any) => !m.is_read).length;

  const metrics = [
    {
      label: "Total Proyek",
      value: projects.length,
      icon: FolderKanban,
      href: "/admin/projects",
      badge: `${projects.length > 0 ? "+" + projects.length : "0"} karya`,
      badgeColor: "success" as const,
    },
    {
      label: "Pengalaman Kerja",
      value: experiences.length,
      icon: Briefcase,
      href: "/admin/experience",
      badge: `${experiences.length} riwayat`,
      badgeColor: "primary" as const,
    },
    {
      label: "Pesan Masuk",
      value: messages.length,
      icon: Mail,
      href: "/admin/messages",
      badge: unreadCount > 0 ? `${unreadCount} baru` : "Semua dibaca",
      badgeColor: unreadCount > 0 ? ("warning" as const) : ("success" as const),
    },
    {
      label: "Koneksi Supabase",
      value: "Live",
      icon: TrendingUp,
      href: "#",
      badge: "Connected",
      badgeColor: "success" as const,
    },
  ];

  const badgeClasses = {
    success: "bg-success-50 text-success-600",
    primary: "bg-brand-50 text-brand-500",
    warning: "bg-warning-50 text-warning-600",
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola konten portfolio, proyek, pengalaman, dan pesan masuk.
          </p>
        </div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors shadow-theme-xs"
        >
          <Plus className="h-4 w-4" />
          Tambah Proyek
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const badgeCls = badgeClasses[metric.badgeColor] ?? badgeClasses.primary;
          return (
            <Link
              key={metric.label}
              href={metric.href}
              className="group rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-theme-xs hover:shadow-theme-md transition-all"
            >
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 group-hover:bg-brand-50 transition-colors">
                <Icon className="h-6 w-6 text-gray-700 group-hover:text-brand-500 transition-colors" />
              </div>
              {/* Value */}
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <span className="text-sm text-gray-500">{metric.label}</span>
                  <h4 className="mt-1.5 text-3xl font-bold text-gray-900">
                    {metric.value}
                  </h4>
                </div>
                {/* Badge */}
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeCls}`}
                >
                  <ArrowUpRight className="h-3 w-3" />
                  {metric.badge}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Messages Section */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-theme-xs overflow-hidden">
        {/* Section header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 md:px-6">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-gray-500" />
            <h2 className="text-base font-semibold text-gray-800">Pesan Terbaru</h2>
            {unreadCount > 0 && (
              <span className="rounded-full bg-warning-50 px-2 py-0.5 text-xs font-bold text-warning-600">
                {unreadCount} belum dibaca
              </span>
            )}
          </div>
          <Link
            href="/admin/messages"
            className="text-xs font-medium text-gray-500 hover:text-brand-500 transition-colors flex items-center gap-1"
          >
            Lihat semua <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Messages list */}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Mail className="h-10 w-10 text-gray-300" />
            <p className="text-sm font-semibold text-gray-600">Belum ada pesan masuk</p>
            <p className="text-xs text-gray-400">
              Pesan dari formulir kontak portfolio akan tampil di sini.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.slice(0, 5).map((msg: any) => (
              <div
                key={msg.id}
                className={`flex items-start justify-between gap-4 px-5 py-4 md:px-6 hover:bg-gray-25 transition-colors ${
                  !msg.is_read ? "bg-brand-25" : ""
                }`}
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    {!msg.is_read && (
                      <span className="h-2 w-2 rounded-full bg-brand-500 shrink-0" />
                    )}
                    <span className="text-sm font-semibold text-gray-900">{msg.name}</span>
                    <span className="text-xs text-gray-400">{msg.email}</span>
                  </div>
                  <p className="truncate text-xs text-gray-600">
                    <span className="font-medium">{msg.subject || "(Tanpa subjek)"}</span>
                    {msg.message && (
                      <span className="text-gray-400"> — {msg.message}</span>
                    )}
                  </p>
                </div>
                <span className="shrink-0 whitespace-nowrap text-[11px] text-gray-400">
                  {new Date(msg.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            href: "/admin/projects",
            label: "Kelola Proyek",
            sub: `${projects.length} proyek aktif`,
            icon: FolderKanban,
          },
          {
            href: "/admin/experience",
            label: "Kelola Pengalaman",
            sub: `${experiences.length} riwayat karir`,
            icon: Briefcase,
          },
          {
            href: "/admin/messages",
            label: "Buka Inbox",
            sub: `${messages.length} total pesan`,
            icon: Mail,
          },
        ].map((qa) => (
          <Link
            key={qa.href}
            href={qa.href}
            className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs hover:border-brand-200 hover:shadow-theme-sm transition-all"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-brand-50 transition-colors">
              <qa.icon className="h-5 w-5 text-gray-600 group-hover:text-brand-500 transition-colors" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 group-hover:text-brand-500 transition-colors">
                {qa.label}
              </p>
              <p className="text-xs text-gray-400">{qa.sub}</p>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4 text-gray-300 group-hover:text-brand-500 transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
