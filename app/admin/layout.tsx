import React from "react";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { SidebarProvider } from "@/context/SidebarContext";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export const metadata = {
  title: "Admin CMS | Bintang Dimas Portfolio",
  description: "Built-in Content Management System for Portfolio",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await isAdminAuthenticated();

  // Login page: no sidebar/header, full page centered
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </SidebarProvider>
  );
}
