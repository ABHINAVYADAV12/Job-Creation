import { PrismaClient } from "@prisma/client";

// Declare global Prisma instance for caching in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use global Prisma instance or create a new one
export const db = globalThis.prisma ?? new PrismaClient();

// Cache Prisma instance in development mode to avoid multiple instances
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
