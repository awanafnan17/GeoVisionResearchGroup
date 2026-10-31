// Request context extraction for Geo Vision Research Group
// Safely extracts IP and User-Agent from incoming requests

export interface RequestContext {
  ip: string;
  userAgent: string;
}

export function getRequestContext(req: Request): RequestContext {
  // Extract IP from proxy headers, with safe fallback
  let ip = "unknown";
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0];
    if (first) {
      ip = first.trim();
    }
  } else {
    const realIp = req.headers.get("x-real-ip");
    if (realIp) {
      ip = realIp;
    }
  }

  // Extract User-Agent
  const userAgent = req.headers.get("user-agent") ?? "unknown";

  return { ip, userAgent };
}
