import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function normalizeArabic(str: string): string {
  return str
    .replace(/[أإآ]/g, "ا")
    .replace(/[ة]/g, "ه")
    .replace(/[ى]/g, "ي")
    .replace(/[ً-ٟ]/g, "")
    .toLowerCase()
    .trim();
}

export function checkAnswer(input: string, expected: string, language: string): boolean {
  const normalize = (s: string) =>
    language === "ar" ? normalizeArabic(s) : s.toLowerCase().trim();
  return normalize(input) === normalize(expected);
}
