"use client";

import { API_PROXY_PATH, ApiError } from "./config";

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function getCsrfTokenFromCookie(): string | null {
  const match = document.cookie.match(/(?:^|; )ekas_csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function ensureCsrfCookie(): Promise<void> {
  if (getCsrfTokenFromCookie()) return;
  await fetch(`${API_PROXY_PATH}/auth/csrf/`, { credentials: "include" });
}

export async function clientFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (UNSAFE_METHODS.has(method)) {
    await ensureCsrfCookie();
    const token = getCsrfTokenFromCookie();
    if (token) headers.set("X-CSRFTOKEN", token);
  }

  const res = await fetch(`${API_PROXY_PATH}${path.startsWith("/") ? path : `/${path}`}`, {
    ...init,
    method,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    throw await ApiError.fromResponse(res);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}
