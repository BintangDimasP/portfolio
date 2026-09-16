"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Trash2,
  Star,
  RefreshCw,
  Plus,
  Image as ImageIcon,
  Loader2,
  FileText,
  GripVertical,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { uploadProjectImage } from "@/app/admin/actions";

// Render a single PDF page to a PNG Blob using pdfjs-dist (loaded dynamically)
async function renderPdfPageToBlob(
  pdf: any,
  pageNum: number,
  scale: number = 1.5
): Promise<Blob> {
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const ctx = canvas.getContext("2d")!;
  await page.render({ canvasContext: ctx, viewport }).promise;

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to convert canvas to blob"));
      },
      "image/png"
    );
  });
}

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
  const [isPdfUploading, setIsPdfUploading] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<{ current: number; total: number } | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const pdfFileInputRef = useRef<HTMLInputElement>(null);
  const [replaceTargetIndex, setReplaceTargetIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const isAnyUploading = isAddingUpload || isPdfUploading;

  // Add via file upload
  const handleAddNewFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setError("Ukuran file gambar melebihi batas maksimal 20 MB.");
      if (addFileInputRef.current) addFileInputRef.current.value = "";
      return;
    }

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

    if (file.size > 20 * 1024 * 1024) {
      setError("Ukuran file gambar melebihi batas maksimal 20 MB.");
      if (replaceFileInputRef.current) replaceFileInputRef.current.value = "";
      return;
    }

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

  // PDF → slides: render each page client-side then upload to Supabase
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Hanya file PDF yang didukung untuk fitur upload slide.");
      if (pdfFileInputRef.current) pdfFileInputRef.current.value = "";
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("Ukuran file PDF melebihi batas maksimal 50 MB.");
      if (pdfFileInputRef.current) pdfFileInputRef.current.value = "";
      return;
    }

    setIsPdfUploading(true);
    setPdfProgress(null);
    setError("");

    try {
      // Dynamically import pdfjs-dist (already installed via react-pdf)
      const pdfjs = await import("pdfjs-dist");
      // Use the same CDN worker as CvPdfViewer
      (pdfjs as any).GlobalWorkerOptions.workerSrc =
        `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;

      setPdfProgress({ current: 0, total: totalPages });

      const uploadedUrls: string[] = [];

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        setPdfProgress({ current: pageNum, total: totalPages });

        // Render page to PNG blob at 1.5x scale (~1080px wide for landscape)
        const blob = await renderPdfPageToBlob(pdf, pageNum, 1.5);

        const formData = new FormData();
        formData.append(
          "file",
          new File([blob], `slide-${pageNum}.png`, { type: "image/png" })
        );
        const res = await uploadProjectImage(formData);
        if (res?.url) uploadedUrls.push(res.url);
      }

      if (uploadedUrls.length > 0) {
        onChange([...images, ...uploadedUrls]);
      }
    } catch (err: any) {
      setError(err.message || "Gagal mengkonversi PDF ke gambar slide.");
    } finally {
      setIsPdfUploading(false);
      setPdfProgress(null);
      if (pdfFileInputRef.current) pdfFileInputRef.current.value = "";
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

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const next = [...images];
    const [item] = next.splice(draggedIndex, 1);
    next.splice(targetIndex, 0, item);

    onChange(next);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Quick reorder buttons
  const moveImage = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.splice(targetIndex, 0, item);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Header with count badge and drag hint */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Galeri &amp; Cover Gambar Proyek <span className="text-error-500">*</span>
          </label>
          {images.length > 1 && (
            <p className="text-[11px] text-gray-400 mt-0.5">
              Tarik &amp; letakkan kartu gambar (drag &amp; drop) untuk mengatur urutan. Urutan #1 otomatis menjadi Cover Utama.
            </p>
          )}
        </div>
        <span className="text-xs font-semibold text-brand-600 bg-brand-50 border border-brand-100 px-2.5 py-0.5 rounded-md shrink-0">
          {images.length} gambar {images.length > 0 ? `(Cover: #${1})` : ""}
        </span>
      </div>

      {/* PDF Upload Progress Banner */}
      {isPdfUploading && pdfProgress && (
        <div className="flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3">
          <Loader2 className="h-4 w-4 animate-spin text-brand-500 shrink-0" />
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <p className="text-xs font-semibold text-brand-700">Mengkonversi PDF ke slide...</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-brand-100 overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-300"
                  style={{ width: `${(pdfProgress.current / pdfProgress.total) * 100}%` }}
                />
              </div>
              <span className="text-[11px] text-brand-600 font-medium shrink-0">
                {pdfProgress.current}/{pdfProgress.total} slide
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Images with Drag and Drop Reordering */}
      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {images.map((imgUrl, index) => {
            const isCover = index === 0;
            const isReplacing = uploadingIndex === index;
            const isDragging = draggedIndex === index;
            const isOver = dragOverIndex === index;

            return (
              <div
                key={`${imgUrl}-${index}`}
                draggable={!isAnyUploading && !isReplacing}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`group relative flex flex-col rounded-xl border bg-white overflow-hidden transition-all shadow-theme-xs select-none cursor-grab active:cursor-grabbing ${
                  isDragging
                    ? "opacity-30 scale-95 border-dashed border-brand-500 ring-2 ring-brand-500/40"
                    : isOver
                    ? "border-brand-500 ring-2 ring-brand-500 scale-[1.02] shadow-theme-md"
                    : isCover
                    ? "border-brand-500 ring-2 ring-brand-500/20 shadow-theme-sm"
                    : "border-gray-200 hover:border-brand-300 hover:shadow-theme-sm"
                }`}
              >
                {/* Thumbnail Preview */}
                <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                  <img
                    src={imgUrl}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
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

                  {/* Drag Handle Indicator */}
                  <div
                    className={`absolute top-2 z-10 flex items-center gap-1 rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm shadow-sm opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity ${
                      isCover ? "left-24" : "left-2"
                    }`}
                    title="Tarik untuk menggeser urutan posisi"
                  >
                    <GripVertical className="h-3 w-3 text-neutral-300" />
                    <span>Geser</span>
                  </div>

                  {/* Slide number badge */}
                  <span className="absolute bottom-2 right-2 z-10 inline-flex items-center rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                    #{index + 1}
                  </span>

                  {/* Action Buttons Overlay */}
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(index);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-error-600 shadow-md hover:bg-error-500 hover:text-white transition-colors cursor-pointer"
                      title="Hapus gambar ini"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Footer Controls for Thumbnail */}
                <div className="flex items-center justify-between p-2 text-xs border-t border-gray-100 bg-gray-50/50 gap-1.5">
                  {/* Quick Move Arrows */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImage(index, "left");
                      }}
                      disabled={index === 0}
                      title="Pindahkan ke kiri (# sebelumnya)"
                      className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-colors disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
                    >
                      <ArrowLeft className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImage(index, "right");
                      }}
                      disabled={index === images.length - 1}
                      title="Pindahkan ke kanan (# selanjutnya)"
                      className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-colors disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
                    >
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Set as Cover */}
                  {!isCover ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetCover(index);
                      }}
                      className="text-gray-600 hover:text-brand-600 font-medium inline-flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
                    >
                      <Star className="h-3 w-3" />
                      <span>Jadikan Cover</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-semibold text-brand-600 flex items-center gap-1">
                      <span>✓ Cover Utama</span>
                    </span>
                  )}

                  {/* Replace Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setReplaceTargetIndex(index);
                      replaceFileInputRef.current?.click();
                    }}
                    disabled={isReplacing}
                    className="text-gray-500 hover:text-gray-900 font-medium inline-flex items-center gap-1 transition-colors ml-auto cursor-pointer text-[11px]"
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

      {/* Hidden File Input for PDF */}
      <input
        ref={pdfFileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handlePdfUpload}
        className="hidden"
      />

      {/* Add New Image Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
        {/* Upload Image Button */}
        <label className={`flex items-center justify-center gap-2 rounded-lg bg-white border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-theme-xs shrink-0 ${isAnyUploading ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}` }>
          {isAddingUpload ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-500" />
          ) : (
            <Upload className="h-3.5 w-3.5 text-gray-500" />
          )}
          <span>{isAddingUpload ? "Mengunggah..." : "+ Upload Foto"}</span>
          <input
            ref={addFileInputRef}
            type="file"
            accept="image/*"
            disabled={isAnyUploading}
            onChange={handleAddNewFile}
            className="hidden"
          />
        </label>

        {/* Upload PDF Slide Button */}
        <button
          type="button"
          disabled={isAnyUploading}
          onClick={() => pdfFileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-lg bg-white border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-theme-xs cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPdfUploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-500" />
          ) : (
            <FileText className="h-3.5 w-3.5 text-gray-500" />
          )}
          <span>
            {isPdfUploading
              ? `Slide ${pdfProgress?.current ?? "…"}/${pdfProgress?.total ?? "…"}`
              : "+ Upload PDF Slide"}
          </span>
        </button>

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
        💡 Gambar pertama otomatis menjadi <strong>Cover Utama</strong>. Upload PDF untuk otomatis mengkonversi setiap halaman menjadi slide gambar, seperti fitur LinkedIn.
      </p>
    </div>
  );
}
