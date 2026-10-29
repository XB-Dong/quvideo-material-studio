import { NextRequest } from "next/server";
export async function proxy(
  request: NextRequest,
  prefix: string,
  segments: string[],
) {
  if (
    segments.some(
      (s) => s === ".." || s === "." || s.includes("/") || s.includes("\\"),
    )
  )
    return new Response("Invalid path", { status: 400 });
  const target = new URL(
    prefix + "/" + segments.map(encodeURIComponent).join("/"),
    process.env.BACKEND_INTERNAL_URL || "http://backend:8080",
  );
  target.search = request.nextUrl.search;
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  headers.delete("connection");
  try {
    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method)
        ? undefined
        : await request.arrayBuffer(),
      cache: "no-store",
      redirect: "manual",
      signal: request.signal,
    });
    const outgoing = new Headers(upstream.headers);
    outgoing.delete("content-encoding");
    outgoing.delete("content-length");
    outgoing.delete("transfer-encoding");
    outgoing.set("cache-control", "no-store");
    return new Response(upstream.body, {
      status: upstream.status,
      headers: outgoing,
    });
  } catch {
    return Response.json(
      {
        code: "UPSTREAM_UNAVAILABLE",
        message: "后端暂时不可用，请稍后重试",
        requestId: crypto.randomUUID(),
      },
      { status: 502 },
    );
  }
}
