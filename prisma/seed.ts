/**
 * Database Seed — Provisions the default administrator account.
 *
 * Usage:
 *   npx tsx prisma/seed.ts
 *
 * This script is intended for DEVELOPMENT only.
 * It drops and recreates the admin user on every run.
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

// ─── Database connection ─────────────────────────────────────────────────────

const connectionString = process.env.DATABASE_URL ?? "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ─── Constants ───────────────────────────────────────────────────────────────

const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "admin123";

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding database …\n");

  // 1. Upsert the admin user
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      password: hashedPassword,
      role: "ADMIN",
      active: true,
    },
    create: {
      name: "Administrador",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "ADMIN",
      active: true,
    },
  });

  console.log(`  ✅ Admin user created:`);
  console.log(`     Email:    ${admin.email}`);
  console.log(`     Password: ${ADMIN_PASSWORD}`);
  console.log(`     Role:     ${admin.role}`);
  console.log();

  // 2. Seed environment types
  const envTypes = [
    { name: "Sala de Aula", description: "Sala de aula tradicional" },
    { name: "Laboratório", description: "Laboratório de informática ou ciências" },
    { name: "Auditório", description: "Auditório para palestras e eventos" },
    { name: "Sala de Reuniões", description: "Sala para reuniões administrativas" },
    { name: "Quadra Esportiva", description: "Quadra poliesportiva" },
  ];

  for (const et of envTypes) {
    await prisma.environmentType.upsert({
      where: { name: et.name },
      update: {},
      create: et,
    });
  }
  console.log(`  ✅ ${envTypes.length} environment types seeded.`);

  // ─── Summary ──────────────────────────────────────────────────────────────
  console.log("\n🌱 Seed complete!");
  console.log("   Login with admin@admin.com / admin123\n");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
