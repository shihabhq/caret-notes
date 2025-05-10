import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function handleError(error: unknown) {
  if (error instanceof Error) {
    return { errorMessage: error.message };
  }
  return { errorMessage: "An unexpected error occured" };
}
