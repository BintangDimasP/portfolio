"use client";

import React, { useState } from "react";
import { handleLogin } from "@/app/admin/actions";
import { Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const res = await handleLogin(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-theme-lg">
        {/* Logo mark */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-theme-sm">
            <span className="text-lg font-black">BD</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin CMS</h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Masukkan password untuk mengelola konten portfolio Anda.
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mb-4 rounded-lg border border-error-100 bg-error-50 px-4 py-3 text-sm text-error-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Password Admin
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                autoFocus
                placeholder="Masukkan password admin..."
                className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-11 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-3 focus:ring-brand-500/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 text-sm font-semibold text-white hover:bg-brand-600 active:scale-[0.98] transition-all shadow-theme-xs disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Memverifikasi...</span>
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 border-t border-gray-100 pt-4 text-center">
          <a
            href="/"
            className="text-xs text-gray-400 hover:text-brand-500 transition-colors"
          >
            ← Kembali ke Portfolio Publik
          </a>
        </div>
      </div>
    </div>
  );
}
