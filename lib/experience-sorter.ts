// Helper for automatically detecting chronological order of experiences
// (Newest / Most Recent on Top)

const MONTH_MAP: Record<string, number> = {
  januari: 1, january: 1, jan: 1,
  februari: 2, february: 2, feb: 2,
  maret: 3, march: 3, mar: 3,
  april: 4, apr: 4,
  mei: 5, may: 5,
  juni: 6, june: 6, jun: 6,
  juli: 7, july: 7, jul: 7,
  agustus: 8, agust: 8, august: 8, aug: 8, agu: 8,
  september: 9, sept: 9, sep: 9,
  oktober: 10, october: 10, okt: 10, oct: 10,
  november: 11, nopember: 11, nov: 11, nop: 11,
  desember: 12, december: 12, des: 12, dec: 12,
};

const ONGOING_KEYWORDS = [
  "present",
  "sekarang",
  "current",
  "kini",
  "saat ini",
  "ongoing",
  "now",
];

export function extractMonth(text?: string): number {
  if (!text) return 0;
  const lower = text.toLowerCase().trim();

  for (const [key, monthNum] of Object.entries(MONTH_MAP)) {
    const regex = new RegExp(`\\b${key}\\b`, "i");
    if (regex.test(lower) || lower.startsWith(key)) {
      return monthNum;
    }
  }

  const numMatch = lower.match(/\b(0?[1-9]|1[0-2])\b/);
  if (numMatch) return parseInt(numMatch[1], 10);

  return 0;
}

/**
 * Calculates a numerical chronological score for an experience item.
 * Higher score = more recent / newer.
 *
 * Formula: (endYear * 100000) + (endMonth * 100) + startMonth
 * Ongoing jobs ("Present", "Sekarang") receive endMonth = 99 to ensure
 * they rank at the top of their respective year.
 */
export function parseExperienceScore(yearStr?: string, periodStr?: string): number {
  const cleanYear = String(yearStr || "").trim();
  const cleanPeriod = String(periodStr || "").trim();

  // Extract years from year string (handles "2026" or "2024 - 2026")
  const yearMatches = cleanYear.match(/\d{4}/g);
  let endYear = 0;
  if (yearMatches && yearMatches.length > 0) {
    endYear = parseInt(yearMatches[yearMatches.length - 1], 10);
  }

  // Also check period string for explicit 4-digit years (e.g. "May 2024 - Sept 2026")
  const periodYearMatches = cleanPeriod.match(/\d{4}/g);
  if (periodYearMatches && periodYearMatches.length > 0) {
    const periodLatestYear = parseInt(periodYearMatches[periodYearMatches.length - 1], 10);
    if (!endYear || periodLatestYear > endYear) {
      endYear = periodLatestYear;
    }
  }

  const isOngoing = ONGOING_KEYWORDS.some(
    (k) => cleanPeriod.toLowerCase().includes(k) || cleanYear.toLowerCase().includes(k)
  );

  let startMonth = 1;
  let endMonth = 1;

  if (isOngoing) {
    endMonth = 99; // Ongoing experiences are placed at the very top of that year
    endYear = Math.max(endYear || 0, new Date().getFullYear());
    const parts = cleanPeriod.split(/\s*[-–—/]\s*|\s+\bto\b\s*|\s+\bsampai\b\s*/i);
    startMonth = extractMonth(parts[0]) || 1;
  } else if (cleanPeriod) {
    const parts = cleanPeriod.split(/\s*[-–—/]\s*|\s+\bto\b\s*|\s+\bsampai\b\s*/i);
    if (parts.length >= 2) {
      startMonth = extractMonth(parts[0]) || 1;
      endMonth = extractMonth(parts[parts.length - 1]) || startMonth;
    } else {
      startMonth = extractMonth(cleanPeriod) || 1;
      endMonth = startMonth;
    }
  }

  return (endYear || 2000) * 100000 + endMonth * 100 + startMonth;
}

/**
 * Sorts experiences chronologically descending: newest (most recent) first.
 * Ties are broken using created_at descending or id descending.
 */
export function sortExperiencesChronologically<
  T extends {
    year?: string;
    period?: string;
    created_at?: string;
    id?: number | string;
    [key: string]: any;
  }
>(experiences: T[]): T[] {
  return [...experiences].sort((a, b) => {
    const scoreA = parseExperienceScore(a.year, a.period);
    const scoreB = parseExperienceScore(b.year, b.period);

    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }

    // Tie breaker 1: created_at descending
    if (a.created_at && b.created_at) {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      if (dateB !== dateA) return dateB - dateA;
    }

    // Tie breaker 2: ID descending
    const idA = typeof a.id === "number" ? a.id : parseInt(String(a.id || 0), 10);
    const idB = typeof b.id === "number" ? b.id : parseInt(String(b.id || 0), 10);
    return idB - idA;
  });
}
