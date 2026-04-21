const trimSlash = (value) => String(value || "").replace(/\/+$/, "");

export const API_BASE =
  trimSlash(import.meta.env.VITE_API_URL) || "https://student.nikeeworld.online";
