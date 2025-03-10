import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export let euro = Intl.NumberFormat("en-DE", {
  style: "currency",
  currency: "EUR",
});
