// Structured logging utility for Geo Vision Research Group
// Zero external dependencies - uses console under the hood

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const isProduction = process.env.NODE_ENV === "production";
const minLevel: LogLevel = isProduction ? "info" : "debug";

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[minLevel];
}

function formatTimestamp(): string {
  return new Date().toISOString();
}

function formatMessage(
  level: LogLevel,
  message: string,
  meta?: Record<string, unknown>
): string {
  const base: Record<string, unknown> = {
    timestamp: formatTimestamp(),
    level: level.toUpperCase(),
    message,
  };

  if (meta && Object.keys(meta).length > 0) {
    base.meta = meta;
  }

  return JSON.stringify(base);
}

export const logger = {
  debug(message: string, meta?: Record<string, unknown>): void {
    if (!shouldLog("debug")) return;
    console.debug(formatMessage("debug", message, meta));
  },

  info(message: string, meta?: Record<string, unknown>): void {
    if (!shouldLog("info")) return;
    console.info(formatMessage("info", message, meta));
  },

  warn(message: string, meta?: Record<string, unknown>): void {
    if (!shouldLog("warn")) return;
    console.warn(formatMessage("warn", message, meta));
  },

  error(message: string, meta?: Record<string, unknown>): void {
    if (!shouldLog("error")) return;
    console.error(formatMessage("error", message, meta));
  },
};
