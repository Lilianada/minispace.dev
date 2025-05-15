import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string into a readable format
 * @param dateString ISO date string to format
 * @param options Optional Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric"
  }
): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

/**
 * Format a date as relative time (e.g., "2 days ago")
 * @param dateString ISO date string 
 * @returns Relative time string
 */
export function formatRelativeDate(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  
  // Less than 1 minute
  if (diffInSeconds < 60) {
    return "just now";
  }
  
  // Less than 1 hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }
  
  // Less than 1 day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }
  
  // Less than 1 week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }
  
  // Less than 1 month
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }
  
  // Less than 1 year
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }
  
  // More than 1 year
  const years = Math.floor(diffInSeconds / 31536000);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}

/**
 * Format a number to include comma separators
 * @param number Number to format
 * @returns Formatted number string with commas
 */
export function formatNumber(number: number): string {
  return new Intl.NumberFormat("en-US").format(number);
}
