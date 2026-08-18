/** Server-only base URL for the Django API — never import this from a Client Component. */
export const DJANGO_API_BASE = (process.env.DJANGO_INTERNAL_API_URL ?? "http://localhost:8000/api/v1").replace(/\/+$/, "");

/** Path prefix Client Components fetch through (same-origin, proxied to Django). */
export const API_PROXY_PATH = "/api/proxy";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Mirrors apps.core.exceptions.api_exception_handler's envelope:
 * {"error": {"code": string, "message": string | Record<string, string[]>, ...extra}}
 */
export class ApiError extends Error {
  status: number;
  code: string;
  fields?: Record<string, string[]>;

  constructor(status: number, code: string, message: string, fields?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fields = fields;
  }

  static async fromResponse(res: Response): Promise<ApiError> {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      return new ApiError(res.status, "unknown_error", res.statusText || "Request failed");
    }
    const error = (body as { error?: { code?: string; message?: unknown } })?.error;
    if (!error) {
      return new ApiError(res.status, "unknown_error", res.statusText || "Request failed");
    }
    if (typeof error.message === "string") {
      return new ApiError(res.status, error.code ?? "unknown_error", error.message);
    }
    // Field-level validation errors: {"email": ["This field is required."]}
    const fields = error.message as Record<string, string[]> | undefined;
    const firstField = fields ? Object.values(fields)[0]?.[0] : undefined;
    return new ApiError(res.status, error.code ?? "validation_error", firstField ?? "Invalid request", fields);
  }
}

function withTrailingSlash(path: string): string {
  const [pathname, query] = path.split("?");
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return query ? `${normalized}?${query}` : normalized;
}

export function buildDjangoUrl(path: string): string {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${DJANGO_API_BASE}/${withTrailingSlash(clean)}`;
}
