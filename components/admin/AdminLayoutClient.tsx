"use client";

import React from "react";
import { useSidebar } from "@/context/SidebarContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import Backdrop from "@/components/admin/Backdrop";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "md:ml-64"
    : "md:ml-[72px]";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar and Backdrop */}
      <AdminSidebar />
      <Backdrop />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Sticky Header */}
        <AdminHeader />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 xl:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
