// Centralized API route handler wrapper for Geo Vision Research Group
// Wraps async route handlers with error catching, logging, and context extraction

import { ZodError } from "zod";
import { ApiError } from "@/lib/api-error";
import { errorResponse } from "@/lib/api-response";
import { mapPrismaError } from "@/lib/db-safe";
import { logger } from "@/lib/logger";
import { getRequestContext, type RequestContext } from "@/lib/request-context";

type HandlerFn = (
  req: Request,
  ctx: RequestContext
) => Promise<Response>;

const isProduction = process.env.NODE_ENV === "production";

export function apiHandler(handler: HandlerFn) {
  return async function wrappedHandler(req: Request): Promise<Response> {
    const context = getRequestContext(req);

    try {
      return await handler(req, context);
    } catch (error: unknown) {
      // Known API errors - return the intended status and message
      if (error instanceof ApiError) {
        logger.warn("API error thrown", {
          code: error.code,
          statusCode: error.statusCode,
          message: error.message,
          ip: context.ip,
          path: new URL(req.url).pathname,
        });

        return errorResponse(error.message, error.statusCode, error.code);
      }

      // Zod validation errors - format issues into a readable message
      if (error instanceof ZodError) {
        const issues = error.issues.map(
          (issue) => `${issue.path.join(".")}: ${issue.message}`
        );
        const message = `Validation failed: ${issues.join("; ")}`;

        logger.warn("Validation error", {
          issues: error.issues,
          ip: context.ip,
          path: new URL(req.url).pathname,
        });

        return errorResponse(message, 422, "VALIDATION_ERROR");
      }

      // Prisma errors - map to safe client-facing errors
      if (isPrismaError(error)) {
        const mapped = mapPrismaError(error);
        return errorResponse(mapped.message, mapped.statusCode, mapped.code);
      }

      // Unknown errors - log full details but return generic message
      if (error instanceof Error) {
        logger.error("Unhandled error in API route", {
          name: error.name,
          message: error.message,
          stack: isProduction ? undefined : error.stack,
          ip: context.ip,
          path: new URL(req.url).pathname,
        });
      } else {
        logger.error("Unknown error in API route", {
          error: String(error),
          ip: context.ip,
          path: new URL(req.url).pathname,
        });
      }

      // Never leak internal details to the client in production
      const clientMessage = isProduction
        ? "An unexpected error occurred"
        : error instanceof Error
          ? error.message
          : "An unexpected error occurred";

      return errorResponse(clientMessage, 500, "INTERNAL_ERROR");
    }
  };
}

// Check if an error originates from Prisma
function isPrismaError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const name = error.constructor.name;
  return (
    name === "PrismaClientKnownRequestError" ||
    name === "PrismaClientValidationError" ||
    name === "PrismaClientInitializationError" ||
    name === "PrismaClientRustPanicError" ||
    name === "PrismaClientUnknownRequestError"
  );
}
