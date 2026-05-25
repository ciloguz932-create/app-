import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function createPrismaClient() {
  // Production: Turso remote SQLite — Development: local file
  const url =
    process.env.TURSO_DATABASE_URL ??
    process.env.DATABASE_URL ??
    "file:./prisma/dev.db";

  const adapter = new PrismaLibSql({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  return new PrismaClient({
    adapter,
  } as ConstructorParameters<typeof PrismaClient>[0]);
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
