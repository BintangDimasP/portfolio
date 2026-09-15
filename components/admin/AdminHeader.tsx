"use client";

import React, { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSidebar } from "@/context/SidebarContext";
import { useClickOutside } from "@/hooks/useClickOutside";
import { handleLogout } from "@/app/admin/actions";
import {
  Menu,
  Search,
  Bell,
  ExternalLink,
  LogOut,
  User,
  ChevronDown,
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Mail,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/projects": "Manajemen Proyek",
  "/admin/experience": "Pengalaman Kerja",
  "/admin/messages": "Inbox Pesan",
  "/admin/profile": "Profil & Keahlian",
};

export default function AdminHeader() {
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setDropdownOpen(false));

  const handleToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  // Derive page title
  const title =
    Object.entries(pageTitles).find(([key]) =>
      key === "/admin" ? pathname === "/admin" : pathname.startsWith(key)
    )?.[1] ?? "Admin";

  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:px-6">
      {/* Left: Hamburger + Page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          aria-label="Toggle sidebar"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb / page title */}
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <Link href="/admin" className="text-gray-400 hover:text-brand-500 transition-colors">
            Admin
          </Link>
          {pathname !== "/admin" && (
            <>
              <span className="text-gray-300">/</span>
              <span className="font-semibold text-gray-800">{title}</span>
            </>
          )}
        </div>
      </div>

      {/* Center: Search bar (desktop) */}
      

      {/* Right: Notification + User */}
      <div className="flex items-center gap-2">
        {/* Notification bell (decorative) */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
          <Bell className="h-4.5 w-4.5" />
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-white text-xs font-bold">
              BD
            </div>
            <span className="hidden sm:block font-medium text-gray-800">Admin</span>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-200 bg-white shadow-theme-lg py-2 z-50">
              {/* User info */}
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800">Bintang Dimas P.</p>
                  <span
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200"
                    title="Perangkat ini diizinkan mengakses panel admin"
                  >
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                    Trusted
                  </span>
                </div>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>

              {/* Nav shortcuts */}
              <ul className="py-1">
                {[
                  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
                  { href: "/admin/projects", label: "Proyek", icon: FolderKanban },
                  { href: "/admin/experience", label: "Pengalaman", icon: Briefcase },
                  { href: "/admin/messages", label: "Pesan Masuk", icon: Mail },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-500 transition-colors"
                    >
                      <item.icon className="h-4 w-4 text-gray-400" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Footer actions */}
              <div className="border-t border-gray-100 pt-1">
                <Link
                  href="/"
                  target="_blank"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                  Lihat Website
                </Link>
                <a
                  href="/admin/deactivate"
                  onClick={(e) => {
                    if (!confirm("Yakin ingin mencabut akses perangkat ini? Halaman admin akan kembali tersembunyi (404) sampai Anda membuka tautan aktivasi lagi.")) {
                      e.preventDefault();
                    }
                  }}
                  className="flex items-center gap-3 px-4 py-2 text-xs text-amber-600 hover:bg-amber-50 transition-colors"
                  title="Kunci kembali admin dari perangkat ini"
                >
                  <ShieldOff className="h-3.5 w-3.5 text-amber-500" />
                  Kunci Perangkat Ini
                </a>
                <form action={handleLogout}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 text-error-500" />
                    Logout
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
