"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { X, Plus, Search, Check, Sparkles, ChevronDown } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";

interface SkillTagInputProps {
  initialSkills?: string[];
  name?: string;
  label?: string;
  placeholder?: string;
}

const DEFAULT_PRESETS = [
  // UI/UX & Design
  "Figma",
  "UI/UX Design",
  "Wireframing",
  "Prototyping",
  "Design Systems",
  "User Research",
  "Canva",
  "Adobe Illustrator",
  "Adobe Photoshop",
  "Miro",
  // System Analysis & Tools
  "System Analysis",
  "BPMN 2.0",
  "Bizagi Modeler",
  "Microsoft Visio",
  "Enterprise Architecture",
  "UML Modeling",
  "Requirements Gathering",
  "Microsoft Excel",
  "Excel Expert",
  // Web & Mobile Development
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "HTML5 & CSS3",
  "PHP",
  "Laravel",
  "Node.js",
  "Express.js",
  "Python",
  "MySQL",
  "PostgreSQL",
  "Supabase",
  "RESTful API",
  "Git & GitHub",
  // Soft Skills & Strategy
  "Agile / Scrum",
  "Problem Solving",
  "Critical Thinking",
  "Cross-functional Collaboration",
];

export default function SkillTagInput({
  initialSkills = [],
  name = "skills",
  label = "Tools & Skills",
  placeholder = "Cari atau ketik keahlian baru (misal: Figma, Next.js, BPMN)...",
}: SkillTagInputProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkills);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useClickOutside(boxRef, () => {
    setIsDropdownOpen(false);
  });

  const initialSkillsKey = (initialSkills || []).join(",");
  useEffect(() => {
    setSelectedSkills(initialSkills || []);
  }, [initialSkillsKey]);

  const addSkill = (skillToAdd: string) => {
    const clean = skillToAdd.trim();
    if (!clean) return;

    // Check if already selected (case-insensitive)
    const exists = selectedSkills.some(
      (s) => s.toLowerCase() === clean.toLowerCase()
    );

    if (!exists) {
      setSelectedSkills((prev) => [...prev, clean]);
    }

    setSearchQuery("");
  };

  const removeSkill = (skillToRemove: string) => {
    setSelectedSkills((prev) =>
      prev.filter((s) => s.toLowerCase() !== skillToRemove.toLowerCase())
    );
  };

  // Filter presets based on search query
  const filteredSuggestions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return DEFAULT_PRESETS.filter((preset) => {
      const matches = preset.toLowerCase().includes(query);
      return matches;
    });
  }, [searchQuery]);

  // Is the typed query an exact match with an existing suggestion
  const isExactMatch = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return DEFAULT_PRESETS.some((p) => p.toLowerCase() === query);
  }, [searchQuery]);

  // Is query already in selected list
  const isAlreadySelected = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return false;
    return selectedSkills.some((s) => s.toLowerCase() === query);
  }, [searchQuery, selectedSkills]);

  return (
    <div className="flex flex-col gap-2">
      {/* Label and Selected Counter */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {selectedSkills.length > 0 && (
          <span className="text-xs font-semibold text-brand-600 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-md">
            {selectedSkills.length} keahlian dipilih
          </span>
        )}
      </div>

      {/* Main Interactive Box with boxRef for accurate click-outside */}
      <div
        ref={boxRef}
        className="relative rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 transition-all focus-within:border-brand-300 focus-within:bg-white focus-within:ring-3 focus-within:ring-brand-500/10"
      >
        {/* Selected Skills Badges (Pills) */}
        {selectedSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {selectedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-800 shadow-theme-xs transition-all hover:bg-gray-50 hover:border-gray-300 animate-in fade-in zoom-in-95 duration-150"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSkill(skill);
                  }}
                  className="flex h-3.5 w-3.5 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-error-500 transition-colors focus:outline-none"
                  title={`Hapus ${skill}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Input Field with Search Icon + Action Buttons (Clear & Chevron Toggle) */}
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!isDropdownOpen) setIsDropdownOpen(true);
            }}
            onClick={() => {
              if (!isDropdownOpen) setIsDropdownOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (searchQuery.trim()) {
                  addSkill(searchQuery);
                }
              } else if (
                e.key === "Backspace" &&
                searchQuery === "" &&
                selectedSkills.length > 0
              ) {
                removeSkill(selectedSkills[selectedSkills.length - 1]);
              } else if (e.key === "Escape") {
                setIsDropdownOpen(false);
              }
            }}
            placeholder={
              selectedSkills.length === 0
                ? placeholder
                : "Tambah skill lainnya (ketik & Enter)..."
            }
            className="h-8 w-full rounded-md bg-transparent pl-8 pr-16 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />

          {/* Right Action Icons: Clear Search & Chevron Toggle */}
          <div className="absolute right-1 flex items-center gap-1">
            {searchQuery && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchQuery("");
                  inputRef.current?.focus();
                }}
                className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:text-gray-600 transition-colors"
                title="Hapus teks pencarian"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen((prev) => !prev);
              }}
              className={`flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all ${
                isDropdownOpen ? "rotate-180 text-brand-600" : ""
              }`}
              title={isDropdownOpen ? "Tutup daftar pilihan" : "Buka daftar pilihan"}
            >
              <ChevronDown className="h-4 w-4 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-theme-lg animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Dropdown Header with Selesai / Tutup button */}
            <div className="flex items-center justify-between px-2 py-1 border-b border-gray-100 mb-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                <Sparkles className="h-3 w-3 text-brand-500" />
                <span>Pilih atau Cari Keahlian</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(false);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold transition-colors cursor-pointer"
                title="Tutup dropdown"
              >
                <Check className="h-3.5 w-3.5 text-brand-600" />
                <span>Selesai</span>
              </button>
            </div>

            {/* Custom Skill Add Button (if user typed something) */}
            {searchQuery.trim() && !isExactMatch && !isAlreadySelected && (
              <button
                type="button"
                onClick={() => addSkill(searchQuery)}
                className="flex w-full items-center gap-2 rounded-lg bg-brand-50/70 px-3 py-2 text-left text-sm font-medium text-brand-700 hover:bg-brand-100/70 transition-colors mb-1.5"
              >
                <Plus className="h-4 w-4 shrink-0 text-brand-600" />
                <span>
                  Tambahkan{" "}
                  <strong className="font-semibold text-brand-900">
                    &ldquo;{searchQuery.trim()}&rdquo;
                  </strong>{" "}
                  sebagai keahlian baru
                </span>
              </button>
            )}

            {/* Suggestions List */}
            <div className="flex flex-col gap-0.5 mt-0.5 max-h-44 overflow-y-auto">
              {filteredSuggestions.length === 0 && !searchQuery.trim() ? (
                <div className="p-3 text-center text-xs text-gray-400">
                  Tidak ada keahlian yang cocok.
                </div>
              ) : (
                filteredSuggestions.map((skill) => {
                  const isSelected = selectedSkills.some(
                    (s) => s.toLowerCase() === skill.toLowerCase()
                  );

                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          removeSkill(skill);
                        } else {
                          addSkill(skill);
                        }
                      }}
                      className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-colors text-left ${
                        isSelected
                          ? "bg-brand-50/50 font-medium text-brand-700"
                          : "text-gray-700 hover:bg-gray-100/80"
                      }`}
                    >
                      <span className="truncate">{skill}</span>
                      {isSelected ? (
                        <Check className="h-4 w-4 shrink-0 text-brand-600" />
                      ) : (
                        <Plus className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Close Button */}
            <div className="pt-2 border-t border-gray-100 mt-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(false);
                }}
                className="w-full py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Check className="h-3.5 w-3.5 text-brand-600" />
                <span>Selesai Memilih ({selectedSkills.length} dipilih)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden input to automatically submit comma-separated skills in form */}
      <input type="hidden" name={name} value={selectedSkills.join(", ")} />

      {/* Helper text */}
      <p className="text-[11px] text-gray-400">
        💡 Pilih dari daftar dropdown atau ketik keahlian baru lalu tekan <strong>Enter</strong>. Klik tombol <strong>Selesai</strong> atau panah untuk menutup dropdown.
      </p>
    </div>
  );
}
