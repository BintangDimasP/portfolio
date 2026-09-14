"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminSupabase } from "@/lib/supabase/server";
import { loginAdmin, logoutAdmin, isAdminAuthenticated } from "@/lib/admin-auth";
import { sortExperiencesChronologically } from "@/lib/experience-sorter";

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

  const rawImages = formData.get("images") as string;
  const images = rawImages
    ? rawImages.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];

  const rawModules = formData.get("modules") as string;
  const modules = rawModules
    ? rawModules.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];

  const rawTech = formData.get("tech_stack") as string;
  const tech_stack = rawTech
    ? rawTech.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const projectPayload = {
    title: formData.get("title") as string,
    category: formData.get("category") as string,
    company: (formData.get("company") as string) || null,
    button_text: (formData.get("button_text") as string) || "Visit Site",
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
    // Update
    const { error } = await supabase.from("projects").update(projectPayload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    // Insert
    const { error } = await supabase.from("projects").insert([projectPayload]);
    if (error) throw new Error(error.message);
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

  revalidatePath("/");
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

// Submit contact message from public landing page
export async function submitContactMessage(formData: FormData) {
  const supabase = getAdminSupabase();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = (formData.get("subject") as string) || null;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "Semua kolom wajib diisi." };
  }

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

// Upload project image to Supabase Storage
export async function uploadProjectImage(formData: FormData) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

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
