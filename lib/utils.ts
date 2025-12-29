import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateForInput(date: Date | string | number): string {
  // Convert to Date object if it's a string or number
  const dateObj = date instanceof Date ? date : new Date(date);

  // Validate the date
  if (isNaN(dateObj.getTime())) {
    // Return current date if invalid
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Alternative: More robust version with optional fallback
export function formatDateForInputSafe(
  date: Date | string | number | null | undefined,
  fallback?: string
): string {
  // Return fallback or empty string if date is null/undefined
  if (date === null || date === undefined) {
    return fallback || formatDateForInput(new Date());
  }

  try {
    const dateObj = date instanceof Date ? date : new Date(date);

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date");
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.warn("Invalid date provided to formatDateForInput:", date, error);
    return fallback || formatDateForInput(new Date());
  }
}

// Additional utility functions you might find useful:
export function formatCurrency(
  amount: number | string | null | undefined
): string {
  if (amount === null || amount === undefined) return "$0.00";

  const num = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(num)) return "$0.00";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatDisplayDate(
  date: Date | string | number | null | undefined
): string {
  if (date === null || date === undefined) return "N/A";

  try {
    const dateObj = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(dateObj);
  } catch (error) {
    console.warn("Error formatting date:", error);
    return "Invalid date";
  }
}

export function formatDateTime(
  date: Date | string | number | null | undefined
): string {
  if (date === null || date === undefined) return "N/A";

  try {
    const dateObj = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(dateObj);
  } catch (error) {
    console.warn("Error formatting date/time:", error);
    return "Invalid date";
  }
}

// For React hook forms or similar where you might get undefined
export function formatDateForInputOrNow(date: any): string {
  if (!date) return formatDateForInput(new Date());

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return formatDateForInput(new Date());
    }
    return formatDateForInput(dateObj);
  } catch {
    return formatDateForInput(new Date());
  }
}

// Helper to check if value is a valid Date
export function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

// Helper to parse date from various formats
export function parseDate(input: any): Date | null {
  if (input instanceof Date) {
    return isValidDate(input) ? input : null;
  }

  if (typeof input === "string" || typeof input === "number") {
    const date = new Date(input);
    return isValidDate(date) ? date : null;
  }

  return null;
}
