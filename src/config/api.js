const trimSlash = (value) => String(value || "").replace(/\/+$/, "");


export const API_BASE = trimSlash("https://your-api-url.com");