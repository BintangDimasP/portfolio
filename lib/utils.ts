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

