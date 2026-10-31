import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "@/lib/validate-env";
import { logger } from "@/lib/logger";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = env.DATABASE_URL;
  const isProd = process.env.NODE_ENV === "production";
  const pool = new Pool({
    connectionString,
    max: isProd ? 5 : 10,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 15_000,
  });
  const adapter = new PrismaPg(pool);

  // Store pool reference for graceful shutdown
  globalForPrisma.pool = pool;

  const client = new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

  if (process.env.NODE_ENV === "development") {
    logger.debug("Prisma client created", {
      database: "geovision",
      adapter: "pg",
    });
  }

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;

/**
 * Graceful disconnect helper for clean shutdown.
 * Disconnects both the Prisma client and the underlying pg Pool.
 */
export async function disconnectPrisma(): Promise<void> {
  try {
    await prisma.$disconnect();
    if (globalForPrisma.pool) {
      await globalForPrisma.pool.end();
    }
    logger.info("Prisma and pg pool disconnected gracefully");
  } catch (error) {
    logger.error("Error during Prisma disconnect", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
