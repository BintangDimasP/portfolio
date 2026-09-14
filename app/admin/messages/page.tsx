import React from "react";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getContactMessages } from "@/app/admin/actions";
import MessagesList from "@/components/admin/MessagesList";

export default async function AdminMessagesPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const messages = await getContactMessages();

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 pb-6 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Inbox Pesan Masuk
        </h1>
        <p className="text-sm text-gray-500">
          Daftar pesan dan tawaran kolaborasi yang dikirim oleh pengunjung melalui formulir kontak portfolio Anda.
        </p>
      </div>

      {/* Messages List & Detail */}
      <MessagesList initialMessages={messages} />
    </div>
  );
}
