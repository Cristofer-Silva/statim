/**
 * @file utils.ts
 * @description Shared utility for merging Tailwind CSS class names.
 *
 * Combines `clsx` (conditional class joining) with `tailwind-merge`
 * (deduplication of conflicting Tailwind utilities) into a single `cn` helper.
 *
 * @project  CheeseHacks 2026 — Remote Surgery Interface
 * @version  0.0.1
 * @since    2026-02-28
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge and deduplicate Tailwind CSS class names.
 *
 * @param inputs - Any number of class values (strings, arrays, objects).
 * @returns A single, conflict-free className string.
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-blue-600", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
