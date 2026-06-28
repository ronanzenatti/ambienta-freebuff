import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const rawUrl = process.env.POSTGRES_URL;

  if (!rawUrl) {
    throw new Error(
      `Database connection string is missing. ` +
        `Please set POSTGRES_URL in your environment variables.`
    );
  }

  // Strip sslmode from URL — handled via adapter ssl option below
  // Handles both ?sslmode=require and ?sslmode=require&other=... cases
  const connectionString = rawUrl.replace(/([?&])sslmode=[^&]*&?/g, "$1").replace(/[?&]$/, "");
  const adapter = new PrismaPg({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
