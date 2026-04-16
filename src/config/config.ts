export const BACKEND_URL = import.meta.env.VITE_API_URL_DEV;
export const PBI_URL = import.meta.env.VITE_PBI_URL;
export const USERS_2025_IDS: Set<string> = new Set(
  (import.meta.env.VITE_USERS_2025_IDS as string)
    .split(",")
    .map((id: string) => id.trim())
);
