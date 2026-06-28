import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Use pooled connection in production (Vercel serverless), direct in development
  const isProduction = process.env.NODE_ENV === "production";
  const connectionString = isProduction
    ? (process.env.DATABASE_URL_POOLED ?? "")
    : (process.env.DATABASE_URL ?? "");

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
