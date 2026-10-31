import type { NextRequest } from "next/server";
import { handlers } from "@/lib/auth";
import { checkRateLimit, getClientIp, loginLimiter } from "@/lib/security";

export const GET = handlers.GET;

export async function POST(req: NextRequest): Promise<Response> {
  const pathname = new URL(req.url).pathname;
  if (pathname.endsWith("/callback/credentials")) {
    const ip = getClientIp(req);
    if (!checkRateLimit(`login:${ip}`, loginLimiter)) {
      return Response.json(
        { error: "Too many login attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }
  }
  return handlers.POST(req);
}
