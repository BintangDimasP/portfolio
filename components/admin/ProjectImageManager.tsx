"use client";

import React, { useState, useRef } from "react";
import { Upload, Trash2, Star, RefreshCw, Plus, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadProjectImage } from "@/app/admin/actions";

interface ProjectImageManagerProps {
  images: string[];
  onChange: (newImages: string[]) => void;
  setError: (msg: string) => void;
}

export default function ProjectImageManager({
  images,
  onChange,
  setError,
}: ProjectImageManagerProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [isAddingUpload, setIsAddingUpload] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const [replaceTargetIndex, setReplaceTargetIndex] = useState<number | null>(null);

  // Add via file upload
  const handleAddNewFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAddingUpload(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadProjectImage(formData);
      if (res?.url) {
        onChange([...images, res.url]);
      }
    } catch (err: any) {
      setError(err.message || "Gagal mengunggah gambar.");
    } finally {
      setIsAddingUpload(false);
      if (addFileInputRef.current) addFileInputRef.current.value = "";
    }
  };

  // Replace existing image with new file upload
  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replaceTargetIndex === null) return;

    const idx = replaceTargetIndex;
    setUploadingIndex(idx);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadProjectImage(formData);
      if (res?.url) {
        const next = [...images];
        next[idx] = res.url;
        onChange(next);
      }
    } catch (err: any) {
      setError(err.message || "Gagal mengganti gambar.");
    } finally {
      setUploadingIndex(null);
      setReplaceTargetIndex(null);
      if (replaceFileInputRef.current) replaceFileInputRef.current.value = "";
    }
  };

  // Add via URL
  const handleAddUrl = () => {
    const clean = urlInput.trim();
    if (!clean) return;
    if (!clean.startsWith("http://") && !clean.startsWith("https://") && !clean.startsWith("/")) {
      setError("URL gambar harus diawali dengan http:// atau https://");
      return;
    }
    onChange([...images, clean]);
    setUrlInput("");
    setError("");
  };

  // Delete image
  const handleDelete = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    onChange(next);
  };

  // Set as main cover (moves to index 0)
  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const remaining = images.filter((_, i) => i !== index);
    onChange([target, ...remaining]);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Header with count badge */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Galeri &amp; Cover Gambar Proyek <span className="text-error-500">*</span>
        </label>
        <span className="text-xs font-semibold text-brand-600 bg-brand-50 border border-brand-100 px-2.5 py-0.5 rounded-md">
          {images.length} gambar {images.length > 0 ? `(Cover: #${1})` : ""}
        </span>
      </div>

      {/* Grid of Images */}
      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {images.map((imgUrl, index) => {
            const isCover = index === 0;
            const isReplacing = uploadingIndex === index;

            return (
              <div
                key={index}
                className={`group relative flex flex-col rounded-xl border bg-white overflow-hidden transition-all shadow-theme-xs ${
                  isCover
                    ? "border-brand-500 ring-2 ring-brand-500/20 shadow-theme-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Thumbnail Preview */}
                <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                  <img
                    src={imgUrl}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Loading Overlay when replacing */}
                  {isReplacing && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center text-white text-xs font-semibold gap-2 z-20">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Mengganti...</span>
                    </div>
                  )}

                  {/* Cover Badge */}
                  {isCover && (
                    <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 rounded-md bg-brand-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-md">
                      <Star className="h-3 w-3 fill-white" />
                      Cover Utama
                    </span>
                  )}

                  {/* Action Buttons Overlay */}
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-error-600 shadow-md hover:bg-error-500 hover:text-white transition-colors"
                      title="Hapus gambar ini"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Footer Controls for Thumbnail */}
                <div className="flex items-center justify-between p-2 text-xs border-t border-gray-100 bg-gray-50/50">
                  {/* Set as Cover */}
                  {!isCover ? (
                    <button
                      type="button"
                      onClick={() => handleSetCover(index)}
                      className="text-gray-600 hover:text-brand-600 font-medium inline-flex items-center gap-1 transition-colors"
                    >
                      <Star className="h-3 w-3" />
                      <span>Jadikan Cover</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-semibold text-brand-600 flex items-center gap-1">
                      <span>✓ Ditampilkan di Depan</span>
                    </span>
                  )}

                  {/* Replace Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setReplaceTargetIndex(index);
                      replaceFileInputRef.current?.click();
                    }}
                    disabled={isReplacing}
                    className="text-gray-500 hover:text-gray-900 font-medium inline-flex items-center gap-1 transition-colors ml-auto"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Ganti</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center">
          <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-1.5" />
          <p className="text-xs font-semibold text-gray-700">Belum ada gambar yang ditambahkan</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Tambahkan minimal 1 gambar sebagai cover proyek portfolio Anda.
          </p>
        </div>
      )}

      {/* Hidden File Input for Replace */}
      <input
        ref={replaceFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleReplaceFile}
        className="hidden"
      />

      {/* Add New Image Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
        {/* Upload Button */}
        <label className="flex items-center justify-center gap-2 rounded-lg bg-white border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-theme-xs cursor-pointer shrink-0">
          {isAddingUpload ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-500" />
          ) : (
            <Upload className="h-3.5 w-3.5 text-gray-500" />
          )}
          <span>{isAddingUpload ? "Mengunggah..." : "+ Upload File Foto"}</span>
          <input
            ref={addFileInputRef}
            type="file"
            accept="image/*"
            disabled={isAddingUpload}
            onChange={handleAddNewFile}
            className="hidden"
          />
        </label>

        {/* URL Input */}
        <div className="flex flex-1 items-center gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddUrl();
              }
            }}
            placeholder="Atau tempel URL gambar (https://...)"
            className="h-9 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs text-gray-900 placeholder:text-gray-400 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-3 focus:ring-brand-500/10 transition-all"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-theme-xs shrink-0 inline-flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah URL</span>
          </button>
        </div>
      </div>

      {/* Hidden inputs to send to form */}
      <input type="hidden" name="image" value={images[0] || ""} />
      <input type="hidden" name="images" value={images.join("\n")} />

      <p className="text-[11px] text-gray-400">
        💡 Gambar pertama otomatis menjadi <strong>Cover Utama</strong>. Anda dapat mengunggah beberapa gambar untuk galeri multi-foto di portfolio.
      </p>
    </div>
  );
}
