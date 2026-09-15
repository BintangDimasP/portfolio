"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ProfileData,
  TechToolItem,
  saveProfile,
  uploadProfileAvatar,
  uploadProfileCV,
  deleteTechTool,
} from "@/app/admin/actions";
import ToolModal from "@/components/admin/ToolModal";
import SkillTagInput from "@/components/admin/SkillTagInput";
import { normalizeSocialUrl } from "@/lib/utils";
import {
  User,
  Sparkles,
  Upload,
  FileText,
  ExternalLink,
  Edit2,
  Trash2,
  Plus,
  Loader2,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Share2,
  Search,
} from "lucide-react";

interface ProfileManagerProps {
  initialProfile: ProfileData;
  initialTools: TechToolItem[];
}

const inputCls =
  "h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-3 focus:ring-brand-500/10 transition-all";

const labelCls = "block text-sm font-medium text-gray-700";

export default function ProfileManager({
  initialProfile,
  initialTools,
}: ProfileManagerProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "tools">("profile");

  // Profile Form State
  const [isPendingProfile, startTransitionProfile] = useTransition();
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatar_url || "/me.jpg");
  const [cvUrl, setCvUrl] = useState(initialProfile.cv_url || "/cv.pdf");
  const [githubUrl, setGithubUrl] = useState(initialProfile.github_url || "");
  const [linkedinUrl, setLinkedinUrl] = useState(initialProfile.linkedin_url || "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);

  useEffect(() => {
    if (initialProfile.github_url !== undefined) setGithubUrl(initialProfile.github_url || "");
    if (initialProfile.linkedin_url !== undefined) setLinkedinUrl(initialProfile.linkedin_url || "");
    if (initialProfile.avatar_url) setAvatarUrl(initialProfile.avatar_url);
    if (initialProfile.cv_url) setCvUrl(initialProfile.cv_url);
  }, [initialProfile]);

  // Tech Tools State
  const [tools, setTools] = useState<TechToolItem[]>(initialTools);
  const [toolSearch, setToolSearch] = useState("");
  const [editingTool, setEditingTool] = useState<TechToolItem | null>(null);
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [isDeletingTool, startDeleteTransition] = useTransition();

  // Upload Profile Avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setProfileMsg({ type: "error", text: "Ukuran foto profil melebihi batas maksimal 20 MB." });
      return;
    }

    setUploadingAvatar(true);
    setProfileMsg(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadProfileAvatar(formData);
      if (res?.url) {
        setAvatarUrl(res.url);
        setProfileMsg({ type: "success", text: "Foto profil berhasil diunggah & otomatis disimpan!" });
        router.refresh();
      }
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.message || "Gagal mengunggah foto profil." });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Upload CV PDF
  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setProfileMsg({ type: "error", text: "Ukuran file CV melebihi batas maksimal 20 MB." });
      return;
    }

    setUploadingCv(true);
    setProfileMsg(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadProfileCV(formData);
      if (res?.url) {
        setCvUrl(res.url);
        setProfileMsg({ type: "success", text: "File CV (.pdf) berhasil diunggah & otomatis disimpan!" });
        router.refresh();
      }
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.message || "Gagal mengunggah file CV." });
    } finally {
      setUploadingCv(false);
    }
  };

  // Submit Profile Form
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileMsg(null);

    const formData = new FormData(e.currentTarget);
    formData.set("avatar_url", avatarUrl);
    formData.set("cv_url", cvUrl);
    formData.set("github_url", githubUrl.trim());
    formData.set("linkedin_url", linkedinUrl.trim());

    startTransitionProfile(async () => {
      try {
        await saveProfile(formData);
        setProfileMsg({ type: "success", text: "Perubahan profil, hero & tautan sosial berhasil disimpan!" });
        router.refresh();
      } catch (err: any) {
        setProfileMsg({ type: "error", text: err.message || "Gagal menyimpan profil." });
      }
    });
  };

  // Delete Tech Tool
  const handleDeleteTool = (id: number, label: string) => {
    if (!confirm(`Hapus tool "${label}" dari daftar keahlian?`)) return;

    setTools((prev) => prev.filter((t) => t.id !== id));
    startDeleteTransition(async () => {
      await deleteTechTool(id);
      router.refresh();
    });
  };

  const filteredTools = tools.filter(
    (t) =>
      t.label.toLowerCase().includes(toolSearch.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(toolSearch.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Top Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "profile"
              ? "border-brand-500 text-brand-500"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <User className="h-4 w-4" />
          <span>Profil, Hero &amp; About Me</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("tools")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "tools"
              ? "border-brand-500 text-brand-500"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Tech &amp; Tools ({tools.length})</span>
        </button>
      </div>

      {/* TAB 1: PROFIL & HERO */}
      {activeTab === "profile" && (
        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-6">
          {profileMsg && (
            <div
              className={`flex items-center gap-2 rounded-xl p-4 text-sm font-medium ${
                profileMsg.type === "success"
                  ? "border border-success-100 bg-success-50 text-success-600"
                  : "border border-error-100 bg-error-50 text-error-600"
              }`}
            >
              {profileMsg.type === "success" && <CheckCircle2 className="h-5 w-5 shrink-0" />}
              <span>{profileMsg.text}</span>
            </div>
          )}

          {/* Section 1: Hero Section */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs flex flex-col gap-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Hero Section (Banner Utama)</h2>
                <p className="text-xs text-gray-400">Pengaturan teks sambutan dan nama di halaman paling atas.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Teks Sambutan (Greeting)</label>
                <input
                  type="text"
                  name="greeting"
                  defaultValue={initialProfile.greeting || "Hello, I'm"}
                  placeholder="Hello, I'm"
                  className={`mt-1.5 ${inputCls}`}
                />
              </div>
              <div>
                <label className={labelCls}>
                  Nama Lengkap <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={initialProfile.name || "Bintang Dimas"}
                  placeholder="Bintang Dimas"
                  className={`mt-1.5 ${inputCls}`}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>
                Tagline Peran / Keahlian Utama <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                name="tagline"
                required
                defaultValue={
                  initialProfile.tagline ||
                  "Web Developer • UI/UX Designer • Graphic Designer • System Analyst"
                }
                placeholder="Web Developer • UI/UX Designer • System Analyst"
                className={`mt-1.5 ${inputCls}`}
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Ditampilkan tepat di bawah nama pada Hero Banner. Gunakan tanda bullet (•) sebagai pemisah.
              </p>
            </div>
          </div>

          {/* Section 2: Persona & About Me */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs flex flex-col gap-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Persona &amp; About Me</h2>
                <p className="text-xs text-gray-400">Foto diri, berkas CV, bio narasi, dan tautan sosial.</p>
              </div>
            </div>

            {/* Foto Profil & CV Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Foto Profil */}
              <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-4 flex flex-col gap-3">
                <label className={labelCls}>
                  Foto Profil (Persona 3D Card) <span className="text-error-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-brand-500/20 bg-gray-100 shadow-sm">
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                    {uploadingAvatar && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-white border border-gray-200 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-theme-xs">
                      <Upload className="h-3.5 w-3.5 text-gray-500" />
                      <span>{uploadingAvatar ? "Mengunggah..." : "Upload Foto Baru"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      name="avatar_url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="/me.jpg atau https://..."
                      className="h-8 rounded-lg border border-gray-200 bg-white px-2.5 text-xs text-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* File CV (PDF) */}
              <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-4 flex flex-col gap-3">
                <label className={labelCls}>
                  File Dokumen CV (.pdf) <span className="text-error-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 border-brand-500/20 bg-brand-50 text-brand-600 shadow-sm">
                    <FileText className="h-8 w-8" />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2">
                      <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-white border border-gray-200 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-theme-xs">
                        <Upload className="h-3.5 w-3.5 text-gray-500" />
                        <span>{uploadingCv ? "Mengunggah..." : "Upload CV Baru (.pdf)"}</span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleCvUpload}
                          disabled={uploadingCv}
                          className="hidden"
                        />
                      </label>
                      {cvUrl && (
                        <a
                          href={cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Preview</span>
                        </a>
                      )}
                    </div>
                    <input
                      type="text"
                      name="cv_url"
                      value={cvUrl}
                      onChange={(e) => setCvUrl(e.target.value)}
                      placeholder="/cv.pdf atau URL cloud"
                      className="h-8 rounded-lg border border-gray-200 bg-white px-2.5 text-xs text-gray-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Paragraf Bio / About Me */}
            <div>
              <label className={labelCls}>
                Deskripsi Diri (About Me / Persona) <span className="text-error-500">*</span>
              </label>
              <textarea
                name="about_text"
                rows={5}
                required
                defaultValue={initialProfile.about_text || ""}
                placeholder="Tuliskan latar belakang pendidikan, spesialisasi, tools yang dikuasai, dan keunggulan Anda..."
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 p-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-3 focus:ring-brand-500/10 transition-all leading-relaxed"
              />
            </div>

            {/* Social Media Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelCls}>Tautan GitHub</label>
                  {githubUrl && (
                    <a
                      href={normalizeSocialUrl(githubUrl, "github")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                      title="Buka profil GitHub untuk memverifikasi tautan"
                    >
                      <span>Tes Link</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="github_url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username atau BintangDimasP"
                    className={inputCls}
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-500">
                  {githubUrl ? (
                    <span>
                      Tujuan URL: <strong className="text-gray-800">{normalizeSocialUrl(githubUrl, "github")}</strong>
                    </span>
                  ) : (
                    "Contoh: https://github.com/BintangDimasP atau BintangDimasP"
                  )}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelCls}>Tautan LinkedIn</label>
                  {linkedinUrl && (
                    <a
                      href={normalizeSocialUrl(linkedinUrl, "linkedin")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                      title="Buka profil LinkedIn untuk memverifikasi tautan"
                    >
                      <span>Tes Link</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="linkedin_url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username atau username"
                    className={inputCls}
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-500">
                  {linkedinUrl ? (
                    <span>
                      Tujuan URL: <strong className="text-gray-800">{normalizeSocialUrl(linkedinUrl, "linkedin")}</strong>
                    </span>
                  ) : (
                    "Contoh: https://linkedin.com/in/bintang-dimas atau bintang-dimas"
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Education */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs flex flex-col gap-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Education &amp; Academic Details</h2>
                <p className="text-xs text-gray-400">Informasi kartu riwayat pendidikan di samping grid Tech &amp; Tools.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Nama Universitas / Kampus</label>
                <input
                  type="text"
                  name="education_school"
                  defaultValue={initialProfile.education_school || "Telkom University Surabaya"}
                  placeholder="Telkom University Surabaya"
                  className={`mt-1.5 ${inputCls}`}
                />
              </div>
              <div>
                <label className={labelCls}>Jurusan / Program Studi</label>
                <input
                  type="text"
                  name="education_degree"
                  defaultValue={initialProfile.education_degree || "Bachelor of Information Systems"}
                  placeholder="Bachelor of Information Systems"
                  className={`mt-1.5 ${inputCls}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>IPK / Nilai Kelulusan (GPA)</label>
                <input
                  type="text"
                  name="education_gpa"
                  defaultValue={initialProfile.education_gpa || "3.89 / 4.00"}
                  placeholder="3.89 / 4.00"
                  className={`mt-1.5 ${inputCls}`}
                />
              </div>
              <div>
                <label className={labelCls}>Periode Tahun Kuliah</label>
                <input
                  type="text"
                  name="education_period"
                  defaultValue={initialProfile.education_period || "2020 - 2024"}
                  placeholder="2020 - 2024"
                  className={`mt-1.5 ${inputCls}`}
                />
              </div>
            </div>

            {/* Hard Skills Tag Input */}
            <SkillTagInput
              name="hard_skills"
              label="Hard Skills"
              placeholder="Cari atau ketik hard skill lalu tekan Enter (misal: Fullstack Developer, UI/UX Design)..."
              initialSkills={initialProfile.hard_skills || []}
            />

            {/* Soft Skills Tag Input */}
            <SkillTagInput
              name="soft_skills"
              label="Soft Skills"
              placeholder="Cari atau ketik soft skill lalu tekan Enter (misal: Problem Solving, Teamwork)..."
              initialSkills={initialProfile.soft_skills || []}
            />
          </div>

          {/* Sticky Bottom Action Bar */}
          <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-md p-4 shadow-theme-lg">
            <p className="text-xs text-gray-500">
              Perubahan akan langsung terlihat di Hero Section dan About Me landing page.
            </p>
            <button
              type="submit"
              disabled={isPendingProfile || uploadingAvatar || uploadingCv}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors shadow-theme-xs disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPendingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Simpan Perubahan Profil</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: TECH & TOOLS CRUD */}
      {activeTab === "tools" && (
        <div className="flex flex-col gap-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-theme-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari tool atau kategori..."
                value={toolSearch}
                onChange={(e) => setToolSearch(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/10"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingTool(null);
                setIsToolModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors shadow-theme-xs cursor-pointer shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Tool Baru</span>
            </button>
          </div>

          {/* Grid of Tools */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="group relative flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-theme-sm transition-all text-center"
                >
                  {/* Action buttons on hover */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTool(tool);
                        setIsToolModalOpen(true);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:text-brand-500 hover:border-brand-300 transition-colors shadow-sm"
                      title="Edit tool"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTool(tool.id, tool.label)}
                      disabled={isDeletingTool}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-error-100 bg-error-50 text-error-600 hover:bg-error-100 transition-colors shadow-sm"
                      title="Hapus tool"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>

                  {/* 3D Glass Mockup Icon */}
                  <div
                    className="relative w-14 h-14 rounded-xl flex items-center justify-center shadow-md my-1 transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: tool.color || "#171717",
                      boxShadow: `0 8px 16px -4px ${tool.color || "#000"}35`,
                    }}
                  >
                    <div className="absolute inset-1 rounded-lg bg-white/70 backdrop-blur-md flex items-center justify-center p-2 shadow-sm">
                      <img
                        src={tool.icon_url}
                        alt={tool.label}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  <h3 className="font-bold text-xs text-gray-900 mt-2 truncate max-w-full">
                    {tool.label}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: tool.color }}
                    />
                    <span className="text-[11px] text-gray-400 truncate">
                      {tool.category || "General"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm font-semibold text-gray-700">Tidak ada tool yang ditemukan</p>
              <p className="text-xs text-gray-400 mt-1">
                Klik tombol &ldquo;Tambah Tool Baru&rdquo; untuk menambahkan keahlian dan software baru.
              </p>
            </div>
          )}

          {/* Tool Modal */}
          <ToolModal
            tool={editingTool}
            isOpen={isToolModalOpen}
            onClose={() => {
              setIsToolModalOpen(false);
              setEditingTool(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
