"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { handleLogout } from "@/app/admin/actions";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Mail,
  ExternalLink,
  LogOut,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Proyek", icon: FolderKanban },
  { href: "/admin/experience", label: "Pengalaman Kerja", icon: Briefcase },
  { href: "/admin/messages", label: "Pesan Masuk", icon: Mail },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();

  // Don't show sidebar on login page
  if (pathname === "/admin/login") return null;

  const sidebarExpanded = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      className={[
        "fixed top-0 left-0 z-50 flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out",
        // Desktop width based on expansion state
        sidebarExpanded ? "w-64" : "w-[72px]",
        // Mobile: slide in from left
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
        // On md+ always visible
        "md:translate-x-0",
      ].join(" ")}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Logo / Brand ── */}
      <div
        className={[
          "flex h-16 items-center border-b border-gray-200 px-4",
          sidebarExpanded ? "justify-start gap-3" : "justify-center",
        ].join(" ")}
      >
        {/* Icon mark */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
          <span className="text-sm font-black leading-none">BD</span>
        </div>
        {/* Text logo — only when expanded */}
        {sidebarExpanded && (
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-bold text-gray-900 leading-none">Bintang Dimas</span>
            <span className="text-[11px] text-gray-400 mt-0.5">CMS Panel</span>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="no-scrollbar flex flex-1 flex-col overflow-y-auto px-3 py-4 gap-0.5">
        {/* Section label */}
        {sidebarExpanded && (
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Menu
          </p>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          // Exact match for dashboard, startsWith for others
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "admin-menu-item group",
                isActive ? "admin-menu-item-active" : "admin-menu-item-inactive",
                !sidebarExpanded ? "justify-center px-2" : "",
              ].join(" ")}
              title={!sidebarExpanded ? item.label : undefined}
            >
              <Icon
                className={[
                  "h-5 w-5 shrink-0",
                  isActive ? "admin-menu-icon-active" : "admin-menu-icon-inactive group-hover:text-gray-700",
                ].join(" ")}
              />
              {sidebarExpanded && (
                <span className="truncate">{item.label}</span>
              )}
              {sidebarExpanded && item.badge && (
                <span
                  className={[
                    "ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-700",
                  ].join(" ")}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer Actions ── */}
      <div className="border-t border-gray-200 px-3 py-4 flex flex-col gap-0.5">
        {/* View site link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={[
            "admin-menu-item admin-menu-item-inactive group",
            !sidebarExpanded ? "justify-center px-2" : "",
          ].join(" ")}
          title={!sidebarExpanded ? "Lihat Website" : undefined}
        >
          <ExternalLink className="h-5 w-5 shrink-0 admin-menu-icon-inactive group-hover:text-gray-700" />
          {sidebarExpanded && <span className="truncate">Lihat Website</span>}
        </Link>

        {/* Logout */}
        <form action={handleLogout}>
          <button
            type="submit"
            className={[
              "admin-menu-item w-full group text-error-600 hover:bg-error-50 hover:text-error-600",
              !sidebarExpanded ? "justify-center px-2" : "",
            ].join(" ")}
            title={!sidebarExpanded ? "Logout" : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0 text-error-500" />
            {sidebarExpanded && <span className="truncate">Logout</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
