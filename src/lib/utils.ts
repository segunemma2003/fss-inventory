import { User } from "@/types";
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

type UserPrivilege = {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canView: boolean;
};

export const checkUserPrivilege = (
  pageName: string,
  userAuthority: User["authority"] = []
) => {
  const result: UserPrivilege = {
    canCreate: false,
    canDelete: false,
    canUpdate: false,
    canView: false,
  };

  const getPagePrivileges = userAuthority.filter((page) =>
    page.includes(pageName)
  );

  ["Create", "Update", "Delete", "View"].forEach((action) => {
    const isActive = getPagePrivileges.some((privilege) =>
      privilege.includes(action.toLowerCase())
    );

    const key = `can${action}`;

    result[key as keyof UserPrivilege] = isActive;
  });

  return result;
};

export function combineActions(
  obj: Record<string, boolean | string[]>
): string[] {
  // Filter out keys with false values and empty arrays
  const filteredObj: Record<string, string[]> = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] && Array.isArray(obj[key])) {
        filteredObj[key] = obj[key] as string[];
      }
    }
  }

  // Combine all arrays into a single array
  const combinedActions = Object.values(filteredObj).reduce(
    (acc, actions) => acc.concat(actions),
    [] as string[]
  );

  return combinedActions;
}

export const reverseCombine = (payload: string[]) => {
  const pagesActive = payload.reduce((prev, curr) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, value] = curr.split("_");
    const pred = prev as Record<string, boolean | string[]>;

    if (pred[value]) return prev;

    const pagePrivileges = payload.filter((item) => item.includes(value));
    if (value === "api") {
      return {
        ...prev,
        ["api_key"]: true,
        ["api_key_actions"]: pagePrivileges,
      };
    }

    return {
      ...prev,
      [value]: true,
      [`${value}-actions`]: [...pagePrivileges],
    };
  }, {} as Record<string, boolean | string[]>);

  return pagesActive;
};