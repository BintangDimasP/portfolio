"use client";

import React, { useState, useEffect, useTransition } from "react";
import { markMessageAsRead, deleteMessage } from "@/app/admin/actions";
import { Mail, Check, Trash2, Calendar, User, AtSign, MessageSquare } from "lucide-react";

interface MessagesListProps {
  initialMessages: any[];
}

export default function MessagesList({ initialMessages }: MessagesListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const handleMarkRead = (id: number) => {
    startTransition(async () => {
      await markMessageAsRead(id);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
      );
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Hapus pesan ini?")) return;
    startTransition(async () => {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    });
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-500">
          Total:{" "}
          <span className="font-semibold text-gray-800">{messages.length} pesan</span>
        </p>
        {unreadCount > 0 && (
          <span className="rounded-full bg-warning-50 px-2.5 py-0.5 text-xs font-bold text-warning-600">
            {unreadCount} belum dibaca
          </span>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 shadow-theme-xs text-center">
          <Mail className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm font-semibold text-gray-600">Inbox Anda masih kosong</p>
          <p className="mt-1 text-xs text-gray-400">
            Pesan dari formulir kontak portfolio akan tampil di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Message List Column */}
          <div className="no-scrollbar lg:col-span-5 flex flex-col gap-2 max-h-[75vh] overflow-y-auto">
            {messages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.is_read) handleMarkRead(msg.id);
                  }}
                  className={[
                    "cursor-pointer rounded-xl border p-4 transition-all",
                    isSelected
                      ? "border-brand-300 bg-brand-50 ring-2 ring-brand-500/20"
                      : !msg.is_read
                      ? "border-warning-200 bg-warning-50/50 hover:border-warning-300"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-theme-xs",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {!msg.is_read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                      )}
                      <span className="truncate text-sm font-semibold text-gray-900">{msg.name}</span>
                    </div>
                    <span className="shrink-0 text-[10px] text-gray-400">
                      {new Date(msg.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-gray-500">{msg.email}</p>
                  {msg.subject && (
                    <p className="mt-1.5 truncate text-xs font-medium text-gray-700">{msg.subject}</p>
                  )}
                  <p className="mt-0.5 line-clamp-2 text-xs text-gray-400">{msg.message}</p>
                </div>
              );
            })}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-7 lg:sticky lg:top-6">
            {selectedMessage ? (
              <div className="rounded-2xl border border-gray-200 bg-white shadow-theme-xs overflow-hidden">
                {/* Panel Header */}
                <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {selectedMessage.subject || "Pesan dari " + selectedMessage.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {new Date(selectedMessage.created_at).toLocaleString("id-ID", {
                        weekday: "long", year: "numeric", month: "long",
                        day: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!selectedMessage.is_read && (
                      <button
                        onClick={() => handleMarkRead(selectedMessage.id)}
                        disabled={isPending}
                        className="flex items-center gap-1.5 rounded-lg border border-success-100 bg-success-50 px-3 py-1.5 text-xs font-medium text-success-600 hover:bg-success-100 transition-colors"
                        title="Tandai telah dibaca"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Tandai Dibaca
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      disabled={isPending}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-error-100 bg-error-50 text-error-600 hover:bg-error-100 transition-colors"
                      title="Hapus pesan"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sender Info */}
                <div className="border-b border-gray-100 bg-gray-50/60 px-6 py-3">
                  <dl className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-xs">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <span className="text-gray-500">Pengirim:</span>
                      <span className="font-semibold text-gray-700">{selectedMessage.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AtSign className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-brand-500 hover:underline font-medium"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <span className="text-gray-500">
                        {new Date(selectedMessage.created_at).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </dl>
                </div>

                {/* Message body */}
                <div className="px-6 py-5">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Quick Reply hint */}
                <div className="border-t border-gray-100 bg-gray-50/60 px-6 py-3">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || "Balasan Pesan")}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors shadow-theme-xs"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Balas via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
                <Mail className="mb-3 h-10 w-10 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">Pilih pesan untuk melihat detailnya</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
