// Standard API response helpers for Geo Vision Research Group
// All API responses use a consistent { success, data?, error?, code? } shape

import { NextResponse } from "next/server";

interface SuccessBody<T> {
  success: true;
  data: T;
}

interface ErrorBody {
  success: false;
  error: string;
  code?: string;
}

export function successResponse<T>(data: T, status: number = 200): NextResponse<SuccessBody<T>> {
  return NextResponse.json({ success: true as const, data }, { status });
}

export function errorResponse(
  message: string,
  status: number = 400,
  code?: string
): NextResponse<ErrorBody> {
  const body: ErrorBody = { success: false as const, error: message };
  if (code) {
    body.code = code;
  }
  return NextResponse.json(body, { status });
}
