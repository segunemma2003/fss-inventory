import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * It returns a string based on the current hour of the day
 * @returns A string
 */
export const getTimeGreetings = () => {
  const currentHour = new Date().getHours();

  let intHour = Number(currentHour);

  if (intHour >= 5 && intHour <= 11) {
    return "Good morning";
  }

  if (intHour >= 12 && intHour <= 16) {
    return "Good afternoon";
  }

  if (intHour >= 17) {
    return "Good evening";
  }
};

/**
 * Formats a number as a currency string based on the provided locale and currency.
 * @param {number} amount - The amount of money to format.
 * @param {string} locale - The locale string (e.g., 'en-US', 'fr-FR').
 * @param {string} currency - The currency code (e.g., 'USD', 'EUR').
 * @returns {string} The formatted currency string.
 */
export function formatCurrency(
  amount: number,
  locale: Intl.LocaleOptions["region"],
  currency: Intl.NumberFormatOptions["currency"]
) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return amount.toString();
  }
}