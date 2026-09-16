import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isGraphicDesignCategory(category?: string | null): boolean {
  if (!category) return false;
  const c = category.toLowerCase().trim();
  return (
    c === "graphic design" ||
    c === "desain grafis" ||
    c === "design graphic" ||
    c.includes("graphic") ||
    c.includes("grafis")
  );
}

export function isDesignCategory(category?: string | null): boolean {
  if (!category) return false;
  const c = category.toLowerCase().trim();
  return (
    c.includes("design") ||
    c.includes("desain") ||
    c.includes("ui/ux") ||
    c.includes("ui-ux") ||
    c.includes("ui ux") ||
    c.includes("ux") ||
    c.includes("graphic") ||
    c.includes("grafis") ||
    c.includes("product design")
  );
}

export function isProjectAcademic(project?: any): boolean {
  if (!project) return false;
  const rawBtn = String(project.button_text || project.buttonText || "").trim().toLowerCase();
  const btn = rawBtn.split("::")[0].trim();
  const badge = String(project.badge || "").trim().toLowerCase();
  return (
    btn === "academy" ||
    btn === "academic" ||
    badge === "academy" ||
    badge === "academic" ||
    project.is_academic === true ||
    project.is_academic === "true" ||
    project.isAcademy === true ||
    project.isAcademy === "true"
  );
}

export function getProjectRole(project?: any): string | null {
  if (!project) return null;
  if (project.role && typeof project.role === "string" && project.role.trim()) {
    return project.role.trim();
  }
  const btn = String(project.button_text || project.buttonText || "").trim();
  if (btn.includes("::")) {
    const parts = btn.split("::");
    const rolePart = parts.slice(1).join("::").trim();
    return rolePart || null;
  }
  return null;
}

export function normalizeSocialUrl(url: string | null | undefined, platform: "github" | "linkedin"): string {
  if (!url) return "";
  let trimmed = url.trim();
  if (!trimmed) return "";

  // If already starts with http:// or https://
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Handle protocol-relative //
  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  // Handle common domain prefixes without protocol
  if (trimmed.toLowerCase().startsWith("github.com/")) {
    return `https://${trimmed}`;
  }
  if (trimmed.toLowerCase().startsWith("www.github.com/")) {
    return `https://${trimmed}`;
  }
  if (trimmed.toLowerCase().startsWith("linkedin.com/")) {
    return `https://${trimmed}`;
  }
  if (trimmed.toLowerCase().startsWith("www.linkedin.com/")) {
    return `https://${trimmed}`;
  }

  // Handle plain username or @handle
  const clean = trimmed.replace(/^@/, "").replace(/^\/+/, "");
  if (!clean) return "";

  if (platform === "github") {
    return `https://github.com/${clean}`;
  }
  if (platform === "linkedin") {
    if (clean.toLowerCase().startsWith("in/")) {
      return `https://linkedin.com/${clean}`;
    }
    return `https://linkedin.com/in/${clean}`;
  }

  return `https://${trimmed}`;
}

