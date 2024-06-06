import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getInitials(name: string): string {
  if (!name) return "NA"
  return name.split(" ").reduce((acc, curr) => acc + curr[0], "").toUpperCase()
}


export function isRTL(str: string) {
  const hebRegex = /[\u0590-\u05FF]/;
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
  
  return hebRegex.test(str) || arabicRegex.test(str);
}