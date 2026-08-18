import { cookies } from "next/headers";
import { ApiError, buildDjangoUrl } from "./config";

/**
 * For Server Components / Route Handlers: calls Django directly (server-to-server),
 * manually forwarding the incoming request's cookies since Next's server fetch
 * does not do this automatically.
 */
export async function serverFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

  const res = await fetch(buildDjangoUrl(path), {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      Cookie: cookieHeader,
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw await ApiError.fromResponse(res);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}
