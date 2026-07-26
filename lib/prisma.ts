import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  const adapter = new PrismaMariaDb(url);
  return new PrismaClient({ adapter });
}

/** Dev server caches global prisma — invalidate if client predates new models. */
function isClientCurrent(client: PrismaClient) {
  const c = client as PrismaClient & {
    company?: { count: unknown };
    order?: { count: unknown };
  };
  return typeof c.company?.count === "function" && typeof c.order?.count === "function";
}

function getPrismaClient() {
  const cached = globalForPrisma.prisma;
  if (cached && isClientCurrent(cached)) {
    return cached;
  }
  const client = createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}

export const prisma = getPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
