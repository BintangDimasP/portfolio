"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAdminSupabase } from "@/lib/supabase/server";
import { loginAdmin, logoutAdmin, isAdminAuthenticated } from "@/lib/admin-auth";
import { sortExperiencesChronologically } from "@/lib/experience-sorter";
import { normalizeSocialUrl, isDesignCategory } from "@/lib/utils";

// --- AUTH ACTIONS ---
export async function handleLogin(formData: FormData) {
  const password = formData.get("password") as string;
  const success = await loginAdmin(password);
  if (!success) {
    return { error: "Password salah. Silakan coba lagi." };
  }
  redirect("/admin");
}

export async function handleLogout() {
  await logoutAdmin();
  redirect("/admin/login");
}

// --- PROJECT ACTIONS ---
export async function getProjects() {
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Failed to fetch projects:", error.message || error.details || "Unknown error");
      return [];
    }
    return data ?? [];
  } catch (err: any) {
    console.warn("Error in getProjects:", err?.message || err);
    return [];
  }
}

export async function saveProject(formData: FormData) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getAdminSupabase();
  const id = formData.get("id") as string;

  const rawCategory = (formData.get("category") as string) || "";
  const isDesign = isDesignCategory(rawCategory);

  const rawImages = formData.get("images") as string;
  const images = rawImages
    ? rawImages.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];

  const rawModules = formData.get("modules") as string;
  const modules = isDesign
    ? []
    : rawModules
    ? rawModules.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];

  const rawTech = formData.get("tech_stack") as string;
  const tech_stack = rawTech
    ? rawTech.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const rawRole = (formData.get("role") as string) || "";
  const role = isDesign ? "" : rawRole.trim();

  const isAcademic =
    formData.get("is_academic") === "true" ||
    formData.get("is_academic") === "on" ||
    formData.get("button_text") === "Academy" ||
    (formData.get("button_text") as string || "").startsWith("Academy::");

  let buttonTextValue = isAcademic ? "Academy" : "Visit Site";
  if (role) {
    buttonTextValue = isAcademic ? `Academy::${role}` : `Role::${role}`;
  }

  const projectPayload: any = {
    title: formData.get("title") as string,
    category: rawCategory,
    company: (formData.get("company") as string) || null,
    button_text: buttonTextValue,
    image: formData.get("image") as string,
    images: images.length > 0 ? images : [formData.get("image") as string],
    url: (formData.get("url") as string) || null,
    description: formData.get("description") as string,
    modules,
    tech_stack,
    display_order: parseInt((formData.get("display_order") as string) || "0", 10),
    updated_at: new Date().toISOString(),
  };

  if (id) {
    // Update existing project
    const { error } = await supabase.from("projects").update(projectPayload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    // Insert new project
    // If display_order is 0 or unassigned, place it at the top (#1) and shift others
    if (projectPayload.display_order <= 0) {
      projectPayload.display_order = 1;
      const { data: inserted, error: insertError } = await supabase
        .from("projects")
        .insert([projectPayload])
        .select("id")
        .single();
      if (insertError) throw new Error(insertError.message);

      // Auto-shift other projects so there are no collisions
      try {
        const { data: others } = await supabase
          .from("projects")
          .select("id")
          .neq("id", inserted.id)
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false });

        if (others && others.length > 0) {
          await Promise.all(
            others.map((p, idx) =>
              supabase
                .from("projects")
                .update({ display_order: idx + 2 })
                .eq("id", p.id)
            )
          );
        }
      } catch (shiftErr) {
        console.warn("Auto-shift display_order warning:", shiftErr);
      }
    } else {
      const { error } = await supabase.from("projects").insert([projectPayload]);
      if (error) throw new Error(error.message);
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function reorderProjects(orderedIds: number[]) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getAdminSupabase();

  // Update display_order for each ID sequentially: 1, 2, 3, ...
  const updates = orderedIds.map((id, index) =>
    supabase
      .from("projects")
      .update({
        display_order: index + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed && failed.error) {
    console.error("Failed to reorder projects:", failed.error);
    throw new Error(failed.error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function deleteProject(id: number) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getAdminSupabase();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);

  // Auto-normalize display_order for remaining projects
  try {
    const { data: remaining } = await supabase
      .from("projects")
      .select("id")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (remaining && remaining.length > 0) {
      await Promise.all(
        remaining.map((p, idx) =>
          supabase
            .from("projects")
            .update({ display_order: idx + 1 })
            .eq("id", p.id)
        )
      );
    }
  } catch (syncErr) {
    console.warn("Auto-sync display_order on delete warning:", syncErr);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  return { success: true };
}

// --- EXPERIENCE ACTIONS ---
export async function getExperiences() {
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Failed to fetch experiences:", error.message || error.details || "Unknown error");
      return [];
    }
    return sortExperiencesChronologically(data ?? []);
  } catch (err: any) {
    console.warn("Error in getExperiences:", err?.message || err);
    return [];
  }
}

export async function saveExperience(formData: FormData) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getAdminSupabase();
  const id = formData.get("id") as string;

  const rawSkills = formData.get("skills") as string;
  const skills = rawSkills
    ? rawSkills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const experiencePayload = {
    year: formData.get("year") as string,
    role: formData.get("role") as string,
    type: formData.get("type") as string,
    company: formData.get("company") as string,
    location: formData.get("location") as string,
    period: formData.get("period") as string,
    description: formData.get("description") as string,
    skills,
    side: (formData.get("side") as string) || "left",
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase.from("experiences").update(experiencePayload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("experiences").insert([experiencePayload]);
    if (error) throw new Error(error.message);
  }

  // Auto-sync display_order and alternating side for all experiences based on chronological score
  try {
    const { data: allExp } = await supabase
      .from("experiences")
      .select("id, year, period, created_at");

    if (allExp && allExp.length > 0) {
      const sorted = sortExperiencesChronologically(allExp);
      await Promise.all(
        sorted.map((item, index) =>
          supabase
            .from("experiences")
            .update({
              display_order: index + 1,
              side: index % 2 === 0 ? "left" : "right",
            })
            .eq("id", item.id)
        )
      );
    }
  } catch (syncErr) {
    console.warn("Auto-sync display_order warning:", syncErr);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/experience");
  return { success: true };
}

export async function deleteExperience(id: number) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getAdminSupabase();
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw new Error(error.message);

  // Auto-sync display_order and alternating side after deletion
  try {
    const { data: allExp } = await supabase
      .from("experiences")
      .select("id, year, period, created_at");

    if (allExp && allExp.length > 0) {
      const sorted = sortExperiencesChronologically(allExp);
      await Promise.all(
        sorted.map((item, index) =>
          supabase
            .from("experiences")
            .update({
              display_order: index + 1,
              side: index % 2 === 0 ? "left" : "right",
            })
            .eq("id", item.id)
        )
      );
    }
  } catch (syncErr) {
    console.warn("Auto-sync display_order warning:", syncErr);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/experience");
  return { success: true };
}

// --- CONTACT / MESSAGE ACTIONS ---
export async function getContactMessages() {
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Failed to fetch messages:", error.message || error.details || "Unknown error");
      return [];
    }
    return data ?? [];
  } catch (err: any) {
    console.warn("Error in getContactMessages:", err?.message || err);
    return [];
  }
}

export async function markMessageAsRead(id: number) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getAdminSupabase();
  const { error } = await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/messages");
  return { success: true };
}

export async function deleteMessage(id: number) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getAdminSupabase();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/messages");
  return { success: true };
}

// Rate limiter in-memory untuk form kontak publik (anti-spam / flood)
const contactSubmissionLog = new Map<string, number[]>();

function checkContactRateLimit(clientIp: string, limit = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const history = (contactSubmissionLog.get(clientIp) || []).filter((time) => now - time < windowMs);

  if (history.length >= limit) {
    return false;
  }

  history.push(now);
  contactSubmissionLog.set(clientIp, history);

  // Bersihkan key lama jika map terlalu besar
  if (contactSubmissionLog.size > 1000) {
    for (const [ip, times] of contactSubmissionLog.entries()) {
      if (times.every((t) => now - t >= windowMs)) {
        contactSubmissionLog.delete(ip);
      }
    }
  }

  return true;
}

// Submit contact message from public landing page
export async function submitContactMessage(formData: FormData) {
  // 1. Honeypot check: Kolom rahasia yang tidak diisi manusia tapi otomatis diisi bot
  const honeypot = (formData.get("company_website_verify") as string) || "";
  if (honeypot.trim() !== "") {
    console.warn("[Anti-Spam] Bot submission blocked by honeypot.");
    // Kembalikan status sukses semu agar bot mengira pesannya terkirim
    return { success: true };
  }

  // 2. Rate Limiting per IP Pengunjung (Maks 5 pesan per 15 menit)
  const headerStore = await headers();
  const clientIp =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "client-default";

  if (!checkContactRateLimit(clientIp, 5, 15 * 60 * 1000)) {
    return {
      error: "Terlalu banyak pesan terkirim dari koneksi Anda. Harap tunggu beberapa menit sebelum mencoba kembali.",
    };
  }

  // 3. Sanitasi & Validasi Input
  const name = ((formData.get("name") as string) || "")
    .trim()
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
  const email = ((formData.get("email") as string) || "").trim().toLowerCase();
  const rawSubject = (formData.get("subject") as string) || "";
  const subject =
    rawSubject.trim().replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "") || null;
  const message = ((formData.get("message") as string) || "")
    .trim()
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");

  if (!name || !email || !message) {
    return { error: "Semua kolom wajib diisi." };
  }

  if (name.length < 2 || name.length > 100) {
    return { error: "Nama harus berisi antara 2 hingga 100 karakter." };
  }

  if (message.length < 5 || message.length > 3000) {
    return { error: "Pesan harus berisi antara 5 hingga 3000 karakter." };
  }

  if (subject && subject.length > 250) {
    return { error: "Subjek terlalu panjang (maksimal 250 karakter)." };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email) || email.length > 150) {
    return { error: "Format alamat email tidak valid." };
  }

  // 4. Simpan ke database Supabase
  const supabase = getAdminSupabase();
  const { error } = await supabase.from("contact_messages").insert([
    { name, email, subject, message },
  ]);

  if (error) {
    console.error("Error submitting contact message:", error);
    return { error: "Gagal mengirim pesan. Silakan coba lagi nanti." };
  }

  revalidatePath("/admin/messages");
  return { success: true };
}

// Maksimal batas ukuran upload file: 20 MB
const MAX_UPLOAD_SIZE = 20 * 1024 * 1024;

// Upload project image to Supabase Storage
export async function uploadProjectImage(formData: FormData) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("Ukuran file gambar melebihi batas maksimal 20 MB.");
  }

  const supabase = getAdminSupabase();
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `projects/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("project-images")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    throw new Error(uploadError.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from("project-images")
    .getPublicUrl(filePath);

  return { url: publicUrlData.publicUrl };
}

// --- PROFILE & HERO ACTIONS ---
export interface ProfileData {
  greeting: string;
  name: string;
  tagline: string;
  avatar_url: string;
  about_text: string;
  github_url: string;
  linkedin_url: string;
  cv_url: string;
  education_school: string;
  education_degree: string;
  education_gpa: string;
  education_period: string;
  hard_skills: string[];
  soft_skills: string[];
}

const DEFAULT_PROFILE: ProfileData = {
  greeting: "Hello, I'm",
  name: "Bintang Dimas",
  tagline: "Web Developer • UI/UX Designer • Graphic Designer • System Analyst",
  avatar_url: "/me.jpg",
  about_text: "Information Systems graduate from Telkom University with a strong interest in information technology. Experienced in system design and development, UI/UX design, business process modeling, web development, and graphic design, gained through freelance work, volunteering, internships, and university projects. Proficient in Figma, Visio, Bizagi, VS Code, and Laragon, and adept at leveraging AI tools to optimize workflow efficiency. A disciplined professional with excellent time management skills, committed to continuous growth within the IT industry.",
  github_url: "https://github.com",
  linkedin_url: "https://linkedin.com",
  cv_url: "/cv.pdf",
  education_school: "Telkom University Surabaya",
  education_degree: "Bachelor Degree of Information System",
  education_gpa: "3.89 / 4.00",
  education_period: "2020 - 2024",
  hard_skills: [
    "Fullstack Developer",
    "Graphic Design",
    "UI/UX Design",
    "Web Development",
    "Data Entry",
    "IT System Analyst",
    "IT Support",
  ],
  soft_skills: [
    "Problem Solving",
    "Teamwork & Collaboration",
    "Time Management",
    "Critical Thinking",
    "Communication",
    "Adaptability",
  ],
};

async function readLocalJson<T>(filename: string, fallback: T): Promise<T> {
  try {
    const filePath = path.join(process.cwd(), "data", filename);
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

async function writeLocalJson<T>(filename: string, data: T): Promise<void> {
  try {
    const dataDir = path.join(process.cwd(), "data");
    await fs.mkdir(dataDir, { recursive: true });
    const filePath = path.join(dataDir, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn(`Failed to write local ${filename}:`, err);
  }
}

export async function getProfile(): Promise<ProfileData> {
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase.from("profile").select("*").eq("id", 1).maybeSingle();
    if (!error && data) {
      return {
        ...DEFAULT_PROFILE,
        ...data,
        hard_skills: data.hard_skills && data.hard_skills.length > 0 ? data.hard_skills : DEFAULT_PROFILE.hard_skills,
        soft_skills: data.soft_skills && data.soft_skills.length > 0 ? data.soft_skills : DEFAULT_PROFILE.soft_skills,
      };
    }
  } catch (err) {
    // Supabase table not created yet or query failed
  }
  return await readLocalJson<ProfileData>("profile.json", DEFAULT_PROFILE);
}

export async function saveProfile(formData: FormData) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const rawHard = formData.get("hard_skills") as string;
  const hard_skills = rawHard
    ? rawHard.split(",").map((s) => s.trim()).filter(Boolean)
    : DEFAULT_PROFILE.hard_skills;

  const rawSoft = formData.get("soft_skills") as string;
  const soft_skills = rawSoft
    ? rawSoft.split(",").map((s) => s.trim()).filter(Boolean)
    : DEFAULT_PROFILE.soft_skills;

  const rawGithub = (formData.get("github_url") as string) || "";
  const rawLinkedin = (formData.get("linkedin_url") as string) || "";

  const github_url = normalizeSocialUrl(rawGithub, "github") || DEFAULT_PROFILE.github_url;
  const linkedin_url = normalizeSocialUrl(rawLinkedin, "linkedin") || DEFAULT_PROFILE.linkedin_url;

  const profilePayload: ProfileData = {
    greeting: (formData.get("greeting") as string)?.trim() || DEFAULT_PROFILE.greeting,
    name: (formData.get("name") as string)?.trim() || DEFAULT_PROFILE.name,
    tagline: (formData.get("tagline") as string)?.trim() || DEFAULT_PROFILE.tagline,
    avatar_url: (formData.get("avatar_url") as string)?.trim() || DEFAULT_PROFILE.avatar_url,
    about_text: (formData.get("about_text") as string)?.trim() || DEFAULT_PROFILE.about_text,
    github_url,
    linkedin_url,
    cv_url: (formData.get("cv_url") as string)?.trim() || DEFAULT_PROFILE.cv_url,
    education_school: (formData.get("education_school") as string)?.trim() || DEFAULT_PROFILE.education_school,
    education_degree: (formData.get("education_degree") as string)?.trim() || DEFAULT_PROFILE.education_degree,
    education_gpa: (formData.get("education_gpa") as string)?.trim() || DEFAULT_PROFILE.education_gpa,
    education_period: (formData.get("education_period") as string)?.trim() || DEFAULT_PROFILE.education_period,
    hard_skills,
    soft_skills,
  };

  // 1. Always write to local JSON for immediate effect
  await writeLocalJson("profile.json", profilePayload);

  // 2. Try Supabase upsert
  try {
    const supabase = getAdminSupabase();
    await supabase.from("profile").upsert({
      id: 1,
      ...profilePayload,
      updated_at: new Date().toISOString(),
    });
  } catch (err: any) {
    console.warn("Supabase profile upsert note:", err?.message || err);
  }

  revalidatePath("/", "page");
  revalidatePath("/", "layout");
  revalidatePath("/admin", "page");
  revalidatePath("/admin/profile", "page");
  return { success: true };
}

export async function uploadProfileAvatar(formData: FormData) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("Ukuran foto profil melebihi batas maksimal 20 MB.");
  }

  const supabase = getAdminSupabase();
  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `avatar-${Date.now()}.${fileExt}`;
  const filePath = `profile/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("project-images")
    .upload(filePath, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });

  let avatarUrl = `/me.jpg`;
  if (!uploadError) {
    const { data: publicUrlData } = supabase.storage
      .from("project-images")
      .getPublicUrl(filePath);
    if (publicUrlData?.publicUrl) {
      avatarUrl = publicUrlData.publicUrl;
    }
  } else {
    console.warn("Storage upload avatar note:", uploadError.message);
  }

  // Otomatis simpan ke profile database & local JSON
  try {
    const currentProfile = await getProfile();
    const updatedProfile = { ...currentProfile, avatar_url: avatarUrl };
    await writeLocalJson("profile.json", updatedProfile);
    await supabase.from("profile").upsert({
      id: 1,
      ...updatedProfile,
      updated_at: new Date().toISOString(),
    });
    revalidatePath("/", "page");
    revalidatePath("/", "layout");
    revalidatePath("/admin", "page");
    revalidatePath("/admin/profile", "page");
  } catch (saveErr) {
    console.warn("Auto-save avatar note:", saveErr);
  }

  return { url: avatarUrl };
}

export async function uploadProfileCV(formData: FormData) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("Ukuran file CV melebihi batas maksimal 20 MB.");
  }

  const supabase = getAdminSupabase();
  const fileName = `cv-${Date.now()}.pdf`;
  const filePath = `profile/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 1. Simpan ke file lokal public/cv.pdf
  let cvUrl = "/cv.pdf";
  try {
    const publicCvPath = path.join(process.cwd(), "public", "cv.pdf");
    await fs.writeFile(publicCvPath, buffer);
  } catch (localErr) {
    console.warn("Local CV write note:", localErr);
  }

  // 2. Unggah ke Supabase Storage
  try {
    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(filePath);
      if (publicUrlData?.publicUrl) {
        cvUrl = publicUrlData.publicUrl;
      }
    } else {
      console.warn("Storage upload CV warning:", uploadError.message);
    }
  } catch (storageErr) {
    console.warn("Supabase storage error, using local fallback:", storageErr);
  }

  // 3. Otomatis simpan ke profil database Supabase & profile.json
  try {
    const currentProfile = await getProfile();
    const updatedProfile = { ...currentProfile, cv_url: cvUrl };
    await writeLocalJson("profile.json", updatedProfile);
    await supabase.from("profile").upsert({
      id: 1,
      ...updatedProfile,
      updated_at: new Date().toISOString(),
    });
    revalidatePath("/", "page");
    revalidatePath("/", "layout");
    revalidatePath("/admin", "page");
    revalidatePath("/admin/profile", "page");
  } catch (saveErr) {
    console.warn("Auto-save CV to profile note:", saveErr);
  }

  return { url: cvUrl };
}

// --- TECH & TOOLS ACTIONS ---
export interface TechToolItem {
  id: number;
  label: string;
  category?: string;
  color: string;
  icon_url: string;
  display_order: number;
}

export async function getTechTools(): Promise<TechToolItem[]> {
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("tech_tools")
      .select("*")
      .order("display_order", { ascending: true })
      .order("id", { ascending: true });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    // Fallback to local
  }
  const localList = await readLocalJson<TechToolItem[]>("tech-tools.json", []);
  return localList.sort((a, b) => a.display_order - b.display_order);
}

export async function saveTechTool(formData: FormData) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const idStr = formData.get("id") as string;
  const label = (formData.get("label") as string) || "Tool";
  const category = (formData.get("category") as string) || "General";
  const color = (formData.get("color") as string) || "#171717";
  const icon_url = (formData.get("icon_url") as string) || "/icons/bizagi.svg";
  const display_order = parseInt((formData.get("display_order") as string) || "0", 10);

  const localList = await readLocalJson<TechToolItem[]>("tech-tools.json", []);
  let targetId = idStr ? parseInt(idStr, 10) : Date.now();

  const toolPayload: TechToolItem = {
    id: targetId,
    label,
    category,
    color,
    icon_url,
    display_order,
  };

  // Update or insert into local JSON
  const existingIdx = localList.findIndex((t) => t.id === targetId);
  if (existingIdx >= 0) {
    localList[existingIdx] = toolPayload;
  } else {
    localList.push(toolPayload);
  }
  await writeLocalJson("tech-tools.json", localList);

  // Try Supabase insert/update
  try {
    const supabase = getAdminSupabase();
    if (idStr) {
      await supabase.from("tech_tools").update({
        label,
        category,
        color,
        icon_url,
        display_order,
        updated_at: new Date().toISOString(),
      }).eq("id", targetId);
    } else {
      const { data } = await supabase.from("tech_tools").insert([{
        label,
        category,
        color,
        icon_url,
        display_order,
      }]).select().single();
      if (data?.id) {
        targetId = data.id;
      }
    }
  } catch (sbErr) {
    console.warn("Supabase tech_tools save note:", sbErr);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/profile");
  return { success: true };
}

export async function deleteTechTool(id: number) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  // Remove from local JSON
  const localList = await readLocalJson<TechToolItem[]>("tech-tools.json", []);
  const nextList = localList.filter((t) => t.id !== id);
  await writeLocalJson("tech-tools.json", nextList);

  // Remove from Supabase
  try {
    const supabase = getAdminSupabase();
    await supabase.from("tech_tools").delete().eq("id", id);
  } catch (sbErr) {
    console.warn("Supabase tech_tools delete note:", sbErr);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/profile");
  return { success: true };
}

export async function uploadToolIcon(formData: FormData) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  const supabase = getAdminSupabase();
  const fileExt = file.name.split(".").pop() || "svg";
  const fileName = `icon-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
  const filePath = `icons/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("project-images")
    .upload(filePath, buffer, {
      contentType: file.type || "image/svg+xml",
      upsert: true,
    });

  if (uploadError) {
    console.error("Storage upload icon error:", uploadError);
    throw new Error(uploadError.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from("project-images")
    .getPublicUrl(filePath);

  return { url: publicUrlData.publicUrl };
}

