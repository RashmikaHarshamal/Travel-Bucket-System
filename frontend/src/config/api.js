// src/config/api.js
// Prefer same-origin relative calls (works well with Docker/nginx reverse proxy).
// You can override via VITE_API_BASE_URL (either absolute or relative).
const rawBase = (import.meta.env.VITE_API_BASE_URL || "/api/v1").trim();

export const API_BASE = rawBase.endsWith("/api/v1")
  ? rawBase
  : rawBase.endsWith("/api/v1/")
    ? rawBase.slice(0, -1)
    : rawBase.endsWith("/")
      ? `${rawBase}api/v1`
      : `${rawBase}/api/v1`;
