import { NextRequest, NextResponse } from "next/server";
import { DJANGO_API_BASE, SITE_URL } from "@/lib/api/config";

export const dynamic = "force-dynamic";

const HOP_BY_HOP_REQUEST_HEADERS = new Set(["host", "connection", "content-length"]);

async function proxyRequest(req: NextRequest, path: string[]): Promise<NextResponse> {
  const search = req.nextUrl.search;
  const targetPath = path.join("/");
  const targetUrl = `${DJANGO_API_BASE}/${targetPath}/${search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_REQUEST_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });
  // Django's CSRF middleware checks Referer/Origin against CSRF_TRUSTED_ORIGINS;
  // a server-to-server fetch may not carry the browser's original values.
  headers.set("Origin", SITE_URL);
  headers.set("Referer", `${SITE_URL}/`);

  const hasBody = !["GET", "HEAD"].includes(req.method);
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const djangoRes = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: body && body.byteLength > 0 ? body : undefined,
    redirect: "manual",
  });

  const resHeaders = new Headers();
  djangoRes.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "content-encoding" && key.toLowerCase() !== "transfer-encoding") {
      resHeaders.append(key, value);
    }
  });
  // Node's fetch Headers only exposes the first Set-Cookie via .get()/forEach —
  // getSetCookie() is required to relay all of them (access/refresh/csrf/guest-cart).
  resHeaders.delete("set-cookie");
  for (const cookie of djangoRes.headers.getSetCookie()) {
    resHeaders.append("set-cookie", cookie);
  }

  const responseBody = await djangoRes.arrayBuffer();
  return new NextResponse(responseBody, { status: djangoRes.status, headers: resHeaders });
}

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(req, path);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
