import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import slugifyLib from "slugify";

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format date to "January 1, 2024"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMMM d, yyyy");
}

/**
 * Format date to "Jan 1, 2024"
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM d, yyyy");
}

/**
 * Format currency amount
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "…";
}

/**
 * Generate URL-safe slug from text
 */
export function generateSlug(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}

/**
 * Estimate reading time in minutes
 */
export function readingTime(content: string): number {
  const wordsPerMinute = 200;
  const textOnly = content.replace(/<[^>]*>/g, "");
  const wordCount = textOnly.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Get initials from a name (max 2 chars)
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Format file size to human readable
 */
export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"] as const;
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Pluralize a word based on count
 */
export function pluralize(count: number, word: string): string {
  if (count === 1) return `${count} ${word}`;
  if (word.endsWith("y") && !/[aeiou]y$/i.test(word)) {
    return `${count} ${word.slice(0, -1)}ies`;
  }
  if (word.endsWith("s") || word.endsWith("x") || word.endsWith("ch") || word.endsWith("sh")) {
    return `${count} ${word}es`;
  }
  return `${count} ${word}s`;
}

/**
 * Generate a GeoSentry reference number
 * Format: GS-YYYY-XXXX (e.g., GS-2026-0001)
 */
export function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9999) + 1;
  const padded = random.toString().padStart(4, "0");
  return `GS-${year}-${padded}`;
}

/**
 * Format score display
 */
export function formatScore(score: number, max: number): string {
  return `${score}/${max}`;
}

/**
 * Get color class for risk level
 */
export function getRiskColor(
  level: "LOW" | "MEDIUM" | "HIGH"
): string {
  const colors: Record<"LOW" | "MEDIUM" | "HIGH", string> = {
    LOW: "#6B8E4E",
    MEDIUM: "#C8A951",
    HIGH: "#C0392B",
  };
  return colors[level];
}

/**
 * Get color for verdict type
 */
export function getVerdictColor(verdict: string): string {
  const colors: Record<string, string> = {
    GO: "#2E7D32",
    NO_GO: "#B71C1C",
    CONDITIONAL: "#C8A951",
    PENDING: "#64748B",
  };
  return colors[verdict] ?? "#64748B";
}

const ALLOWED_HTML_TAGS = new Set([
  "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code",
  "pre", "img", "hr", "table", "thead", "tbody", "tr", "th",
  "td", "span", "div", "figure", "figcaption", "sub", "sup",
]);

const ALLOWED_HTML_ATTRS = new Set([
  "href", "target", "rel", "src", "alt", "title", "class",
  "width", "height",
]);

/**
 * Sanitize HTML content (XSS prevention, serverless-safe without jsdom)
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";
  // Remove dangerous container blocks completely
  const cleaned = dirty
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /<(script|style|iframe|object|embed|svg|math|form|input|button|textarea|select|meta|link|base)\b[^>]*>[\s\S]*?<\/\1>/gi,
      ""
    )
    .replace(
      /<(script|style|iframe|object|embed|svg|math|form|input|button|textarea|select|meta|link|base)\b[^>]*\/?>/gi,
      ""
    );

  return cleaned.replace(/<\/?([a-zA-Z0-9-]+)([^>]*)>/g, (full, rawTag: string, rawAttrs: string) => {
    const tag = rawTag.toLowerCase();
    if (!ALLOWED_HTML_TAGS.has(tag)) {
      return "";
    }
    if (full.startsWith("</")) {
      return `</${tag}>`;
    }
    const selfClosing = full.endsWith("/>") || tag === "br" || tag === "hr" || tag === "img";
    const safeAttrs: string[] = [];
    const attrRegex = /([a-zA-Z0-9:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
    let match: RegExpExecArray | null;
    while ((match = attrRegex.exec(rawAttrs)) !== null) {
      const attrName = match[1].toLowerCase();
      if (!ALLOWED_HTML_ATTRS.has(attrName) || attrName.startsWith("on") || attrName.startsWith("data-")) {
        continue;
      }
      const rawVal = (match[2] ?? match[3] ?? match[4] ?? "").trim();
      if (attrName === "href" || attrName === "src") {
        const normalized = rawVal.replace(/[\u0000-\u0020]+/g, "").toLowerCase();
        if (
          normalized.startsWith("javascript:") ||
          normalized.startsWith("vbscript:") ||
          normalized.startsWith("data:")
        ) {
          continue;
        }
      }
      const escapedVal = rawVal.replace(/"/g, "&quot;");
      safeAttrs.push(`${attrName}="${escapedVal}"`);
    }
    const attrStr = safeAttrs.length > 0 ? " " + safeAttrs.join(" ") : "";
    return selfClosing && (tag === "br" || tag === "hr" || tag === "img")
      ? `<${tag}${attrStr} />`
      : `<${tag}${attrStr}>`;
  });
}

/**
 * Safely serialize JSON-LD structured data to prevent </script> breakout
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Capitalize first letter
 */
export function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert deposit type enum to human-readable label
 */
export function getDepositTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    PORPHYRY: "Porphyry",
    VMS: "Volcanogenic Massive Sulfide (VMS)",
    EPITHERMAL_HIGH_SULPHIDATION: "Epithermal High-Sulphidation",
    EPITHERMAL_LOW_SULPHIDATION: "Epithermal Low-Sulphidation",
    OROGENIC_GOLD: "Orogenic Gold",
    OPHIOLITE_HOSTED: "Ophiolite-Hosted",
    IOCG: "Iron Oxide Copper-Gold (IOCG)",
    SKARN: "Skarn",
    SEDEX: "Sedimentary Exhalative (SEDEX)",
    CARLIN_TYPE: "Carlin-Type Gold",
    PODIFORM_CHROMITE: "Podiform Chromite",
    NICKEL_LATERITE: "Nickel Laterite",
    LATERITE_SAPROLITE: "Laterite / Saprolite",
    PEGMATITE_LITHIUM_REE: "Pegmatite (Lithium/REE)",
    BIF_IRON: "Banded Iron Formation (BIF)",
    PLACER_GOLD: "Placer Gold",
    MANGANESE: "Manganese",
    PHOSPHATE: "Phosphate",
    BAUXITE: "Bauxite",
    MVT_LEAD_ZINC: "Mississippi Valley-Type (MVT) Lead-Zinc",
    INTRUSION_RELATED: "Intrusion-Related",
    VOLCANIC_HOSTED: "Volcanic-Hosted",
    SEDIMENT_HOSTED: "Sediment-Hosted",
    OTHER: "Other",
  };
  return labels[type] ?? type;
}

/**
 * Format coordinates to display string
 */
export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lonDir = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
}
