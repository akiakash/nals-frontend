const trimSlash = (value) => String(value || "").replace(/\/+$/, "");


export const API_BASE = trimSlash("https://student.nikeeworld.online");