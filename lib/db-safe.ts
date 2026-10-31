// Safe Prisma error mapping for Geo Vision Research Group
// Maps raw Prisma errors to safe ApiError instances
// NEVER exposes raw database error details to the client

import { Prisma } from "@prisma/client";
import {
  ApiError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "@/lib/api-error";
import { logger } from "@/lib/logger";

export function mapPrismaError(error: unknown): ApiError {
  // Log the real error internally for debugging
  if (error instanceof Error) {
    logger.error("Database error occurred", {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  } else {
    logger.error("Unknown database error occurred", {
      error: String(error),
    });
  }

  // Map known Prisma request errors to safe client responses
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return new ConflictError("Record already exists");
      case "P2025":
        return new NotFoundError("Record not found");
      case "P2003":
        return new ValidationError("Invalid reference - related record not found");
      case "P2014":
        return new ValidationError("Required relation violation");
      case "P2016":
        return new NotFoundError("Query interpretation error - record not found");
      default:
        return new ApiError("Database operation failed", 500, "DB_ERROR");
    }
  }

  // Prisma validation errors (bad query shape)
  if (error instanceof Prisma.PrismaClientValidationError) {
    return new ValidationError("Invalid database query parameters");
  }

  // Connection or initialization failures
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new ApiError("Database connection failed", 503, "DB_UNAVAILABLE");
  }

  // Rust-level panics in the query engine
  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return new ApiError("Database engine error", 503, "DB_ENGINE_ERROR");
  }

  // Fallback for anything else
  return new ApiError("Database error", 500, "DB_ERROR");
}
