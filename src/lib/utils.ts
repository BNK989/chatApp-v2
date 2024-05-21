import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getInitials(name: string): string {
  if (!name) return "NA"
  return name.split(" ").reduce((acc, curr) => acc + curr[0], "").toUpperCase()
}
