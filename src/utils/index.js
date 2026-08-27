import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
  }).format(amount).replace('BDT', '৳').trim();
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const formatted = date.toLocaleDateString('en-GB', options).replace(/ /g, '-');
  return formatted;
}
