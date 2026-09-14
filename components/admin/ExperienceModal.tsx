"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveExperience } from "@/app/admin/actions";
import { X, Loader2, Calendar } from "lucide-react";
import SkillTagInput from "@/components/admin/SkillTagInput";

interface ExperienceModalProps {
  experience?: any;
  isOpen: boolean;
  onClose: () => void;
}

const MONTHS = [
  { value: "January", label: "Januari (Jan)", index: 1 },
  { value: "February", label: "Februari (Feb)", index: 2 },
  { value: "March", label: "Maret (Mar)", index: 3 },
  { value: "April", label: "April (Apr)", index: 4 },
  { value: "May", label: "Mei (May)", index: 5 },
  { value: "June", label: "Juni (Jun)", index: 6 },
  { value: "July", label: "Juli (Jul)", index: 7 },
  { value: "August", label: "Agustus (Aug)", index: 8 },
  { value: "September", label: "September (Sep)", index: 9 },
  { value: "October", label: "Oktober (Oct)", index: 10 },
  { value: "November", label: "November (Nov)", index: 11 },
  { value: "December", label: "Desember (Dec)", index: 12 },
];

function findMonthValue(str?: string) {
  if (!str) return null;
  const lower = str.toLowerCase().trim();
  for (const m of MONTHS) {
    const valLow = m.value.toLowerCase();
    const indLow = m.label.split(" ")[0].toLowerCase();
    if (lower.includes(valLow) || lower.includes(indLow)) {
      return m.value;
    }
  }
  return null;
}

function parseExperienceToDates(yearStr?: string, periodStr?: string) {
  const currentYear = new Date().getFullYear();
  const cleanYear = String(yearStr || "").trim();
  const cleanPeriod = String(periodStr || "").toLowerCase().trim();

  const isCurrent = ["present", "sekarang", "current", "kini", "now"].some(
    (k) => cleanPeriod.includes(k) || cleanYear.includes(k)
  );

  const yearMatches = (cleanYear + " " + cleanPeriod).match(/\d{4}/g);
  let startYear = currentYear;
  let endYear = currentYear;

  if (yearMatches && yearMatches.length > 0) {
    startYear = parseInt(yearMatches[0], 10);
    endYear = parseInt(yearMatches[yearMatches.length - 1], 10);
  }

  const parts = cleanPeriod.split(/\s*[-–—/]\s*|\s+\bto\b\s*|\s+\bsampai\b\s*/i);
  const startMonth = findMonthValue(parts[0]) || "May";
  const endMonth = isCurrent
    ? "December"
    : parts.length > 1
    ? findMonthValue(parts[parts.length - 1]) || "September"
    : startMonth;

  return {
    startMonth,
    startYear,
    endMonth,
    endYear,
    isCurrentWork: isCurrent,
  };
}

const inputCls =
  "h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-3 focus:ring-brand-500/10 transition-all";

const labelCls = "block text-sm font-medium text-gray-700";

export default function ExperienceModal({ experience, isOpen, onClose }: ExperienceModalProps) {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [startMonth, setStartMonth] = useState<string>("May");
  const [startYear, setStartYear] = useState<number>(currentYear);
  const [endMonth, setEndMonth] = useState<string>("September");
  const [endYear, setEndYear] = useState<number>(currentYear);
  const [isCurrentWork, setIsCurrentWork] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (experience) {
        const parsed = parseExperienceToDates(experience.year, experience.period);
        setStartMonth(parsed.startMonth);
        setStartYear(parsed.startYear);
        setEndMonth(parsed.endMonth);
        setEndYear(parsed.endYear);
        setIsCurrentWork(parsed.isCurrentWork);
      } else {
        setStartMonth("May");
        setStartYear(currentYear);
        setEndMonth("September");
        setEndYear(currentYear);
        setIsCurrentWork(false);
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, experience, currentYear]);

  // Generate list of year options (up to currentYear + 2 down to minimum year)
  const minYear = Math.min(startYear, endYear, 2015);
  const maxYear = currentYear + 2;
  const yearOptions: number[] = [];
  for (let y = maxYear; y >= minYear; y--) {
    yearOptions.push(y);
  }

  const currentStartObj = MONTHS.find((m) => m.value === startMonth);
  const currentStartIndex = currentStartObj ? currentStartObj.index : 1;

  const handleStartYearChange = (newYear: number) => {
    setStartYear(newYear);
    if (!isCurrentWork) {
      if (endYear < newYear) {
        setEndYear(newYear);
      } else if (endYear === newYear) {
        const startIdx = MONTHS.find((m) => m.value === startMonth)?.index || 1;
        const endIdx = MONTHS.find((m) => m.value === endMonth)?.index || 1;
        if (endIdx < startIdx) {
          setEndMonth(startMonth);
        }
      }
    }
  };

  const handleStartMonthChange = (newMonth: string) => {
    setStartMonth(newMonth);
    if (!isCurrentWork && endYear === startYear) {
      const newStartIdx = MONTHS.find((m) => m.value === newMonth)?.index || 1;
      const endIdx = MONTHS.find((m) => m.value === endMonth)?.index || 1;
      if (endIdx < newStartIdx) {
        setEndMonth(newMonth);
      }
    }
  };

  const handleEndYearChange = (newYear: number) => {
    if (newYear < startYear) {
      setEndYear(startYear);
      return;
    }
    setEndYear(newYear);
    if (newYear === startYear) {
      const startIdx = MONTHS.find((m) => m.value === startMonth)?.index || 1;
      const endIdx = MONTHS.find((m) => m.value === endMonth)?.index || 1;
      if (endIdx < startIdx) {
        setEndMonth(startMonth);
      }
    }
  };

  const handleEndMonthChange = (newMonth: string) => {
    if (endYear === startYear) {
      const startIdx = MONTHS.find((m) => m.value === startMonth)?.index || 1;
      const endIdx = MONTHS.find((m) => m.value === newMonth)?.index || 1;
      if (endIdx < startIdx) {
        setEndMonth(startMonth);
        return;
      }
    }
    setEndMonth(newMonth);
  };

  const computedYear = isCurrentWork
    ? (startYear === currentYear ? String(startYear) : `${startYear} - Present`)
    : (startYear === endYear ? String(startYear) : `${startYear} - ${endYear}`);

  const computedPeriod = isCurrentWork
    ? `${startMonth} - Present`
    : (startYear === endYear
        ? `${startMonth} - ${endMonth}`
        : `${startMonth} ${startYear} - ${endMonth} ${endYear}`);

  if (!isOpen) return null;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await saveExperience(formData);
        router.refresh();
        onClose();
      } catch (err: any) {
        setError(err.message || "Gagal menyimpan pengalaman.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-hidden animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-xl max-h-[90vh] rounded-2xl border border-gray-200 bg-white shadow-theme-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Sticky Header */}
        <div className="flex-shrink-0 flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-white z-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {experience ? "Edit Pengalaman Kerja" : "Tambah Pengalaman Kerja"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Isi riwayat pekerjaan, freelance, atau internship.</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Container with scrollable body & sticky footer */}
        <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
            {error && (
              <div className="rounded-lg border border-error-100 bg-error-50 px-4 py-3 text-sm text-error-600">
                {error}
              </div>
            )}

            {experience?.id && <input type="hidden" name="id" value={experience.id} />}

            {/* Posisi / Role */}
            <div>
              <label className={labelCls}>Posisi / Role <span className="text-error-500">*</span></label>
              <input
                type="text" name="role" required
                defaultValue={experience?.role || ""}
                placeholder="System Analyst & UI/UX Designer"
                className={`mt-1.5 ${inputCls}`}
              />
            </div>

            {/* Company + Type (Dropdown) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Perusahaan / Instansi <span className="text-error-500">*</span></label>
                <input
                  type="text" name="company" required
                  defaultValue={experience?.company || ""}
                  placeholder="PT Pelindo Marine Service"
                  className={`mt-1.5 ${inputCls}`}
                />
              </div>
              <div>
                <label className={labelCls}>Tipe Pekerjaan <span className="text-error-500">*</span></label>
                <select
                  name="type"
                  required
                  defaultValue={experience?.type || "Internship"}
                  className={`mt-1.5 ${inputCls}`}
                >
                  <option value="Internship">Internship (Magang)</option>
                  <option value="Full-time">Full-time (Penuh Waktu)</option>
                  <option value="Part-time">Part-time (Paruh Waktu)</option>
                  <option value="Freelance">Freelance (Pekerja Lepas)</option>
                  <option value="Contract">Contract (Kontrak)</option>
                  <option value="Volunteer">Volunteer (Sukarelawan)</option>
                  {experience?.type &&
                    !["Internship", "Full-time", "Part-time", "Freelance", "Contract", "Volunteer"].includes(
                      experience.type
                    ) && (
                      <option value={experience.type}>{experience.type}</option>
                    )}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className={labelCls}>Lokasi <span className="text-error-500">*</span></label>
              <input
                type="text" name="location" required
                defaultValue={experience?.location || "Surabaya, Indonesia"}
                placeholder="Surabaya, Indonesia / WFA"
                className={`mt-1.5 ${inputCls}`}
              />
            </div>

            {/* Waktu & Periode Kerja (Pilihan Kalender Bulan & Tahun) */}
            <div className="rounded-2xl border border-gray-200/80 bg-gray-50/60 p-4 flex flex-col gap-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-brand-600" />
                  <span>Periode &amp; Waktu Kerja <span className="text-error-500">*</span></span>
                </label>
                <span className="text-xs font-semibold text-brand-700 bg-white border border-gray-200 px-2.5 py-0.5 rounded-lg shadow-theme-xs">
                  {computedYear} • {computedPeriod}
                </span>
              </div>

              {/* Checkbox Masih Bekerja */}
              <label className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-gray-700 cursor-pointer select-none bg-white p-2.5 rounded-xl border border-gray-200 hover:border-brand-300 transition-colors">
                <input
                  type="checkbox"
                  checked={isCurrentWork}
                  onChange={(e) => setIsCurrentWork(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500/20 cursor-pointer accent-brand-600"
                />
                <span>Saya saat ini masih bekerja di posisi ini (Present)</span>
              </label>

              {/* Grid Tanggal Mulai & Selesai */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Waktu Mulai */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-gray-600">Waktu Mulai</span>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={startMonth}
                      onChange={(e) => handleStartMonthChange(e.target.value)}
                      className={inputCls}
                    >
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={startYear}
                      onChange={(e) => handleStartYearChange(Number(e.target.value))}
                      className={inputCls}
                    >
                      {yearOptions.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Waktu Selesai */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-gray-600">Waktu Selesai</span>
                  {isCurrentWork ? (
                    <div className="h-10 w-full rounded-lg border border-brand-200 bg-brand-50/70 px-3.5 flex items-center justify-between text-xs font-semibold text-brand-700">
                      <span>Sekarang (Present)</span>
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={endMonth}
                        onChange={(e) => handleEndMonthChange(e.target.value)}
                        className={inputCls}
                      >
                        {MONTHS.map((m) => {
                          const isBefore = endYear === startYear && m.index < currentStartIndex;
                          return (
                            <option
                              key={m.value}
                              value={m.value}
                              disabled={isBefore}
                            >
                              {m.label} {isBefore ? "(< Mulai)" : ""}
                            </option>
                          );
                        })}
                      </select>
                      <select
                        value={endYear}
                        onChange={(e) => handleEndYearChange(Number(e.target.value))}
                        className={inputCls}
                      >
                        {yearOptions.map((y) => (
                          <option key={y} value={y} disabled={y < startYear}>
                            {y} {y < startYear ? "(< Mulai)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Nilai Tahun & Periode Otomatis Terisi */}
              <input type="hidden" name="year" value={computedYear} />
              <input type="hidden" name="period" value={computedPeriod} />

              <p className="mt-0.5 text-[11px] text-gray-400">
                💡 Waktu selesai tidak dapat mendahului waktu mulai. Jika centang aktif, status otomatis tersimpan sebagai <strong>Present</strong>.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className={labelCls}>Deskripsi Pekerjaan <span className="text-error-500">*</span></label>
              <textarea
                name="description" required rows={3}
                defaultValue={experience?.description || ""}
                placeholder="Jelaskan peran dan kontribusi Anda selama bekerja..."
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-3 focus:ring-brand-500/10 transition-all"
              />
            </div>

            {/* Tools & Skills (LinkedIn-style Dropdown with Add & Remove) */}
            <SkillTagInput
              key={experience?.id || "new"}
              initialSkills={experience?.skills || []}
              name="skills"
              label="Tools & Skills"
              placeholder="Cari atau ketik skill baru (misal: Figma, BPMN 2.0, React)..."
            />

            {/* Note info */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-xs text-gray-500 flex items-center gap-2">
              <span className="text-base">✨</span>
              <span>
                Posisi kartu (kiri &amp; kanan) dan urutan tampilan linimasa otomatis diatur oleh sistem berdasarkan kronologi terbaru di bagian teratas.
              </span>
            </div>
          </div>

          {/* Sticky Actions Footer */}
          <div className="flex-shrink-0 flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 bg-gray-50/80 z-10">
            <button
              type="button" onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit" disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors shadow-theme-xs disabled:opacity-60"
            >
              {isPending ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Menyimpan...</> : "Simpan Pengalaman"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
