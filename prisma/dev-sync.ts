/**
 * Dev Database Sync Script
 *
 * In DEV environment, Prisma must not run incremental migration updates.
 * Instead, it executes a full DB teardown (DROP) and redraws the entire schema
 * from scratch on every sync, using `prisma db push --force-reset`.
 *
 * Usage:
 *   npx tsx prisma/dev-sync.ts
 */

import { execSync } from "child_process";

function main() {
  console.log("🔧 Dev Database Sync (Force Reset Mode)");
  console.log("========================================");

  const isDev = process.env.NODE_ENV !== "production";

  if (!isDev) {
    console.log("⚠️  This script is intended for DEV environments only.");
    console.log("   Use 'npx prisma migrate deploy' for production.");
    process.exit(1);
  }

  console.log("\n📦 Step 1: Generating Prisma client...");
  execSync("npx prisma generate", { stdio: "inherit" });

  console.log("\n🗑️  Step 2: Force-resetting database (DROP + recreate)...");
  execSync("npx prisma db push --force-reset --accept-data-loss", {
    stdio: "inherit",
  });

  console.log("\n✅ Database sync complete! Schema is up to date.");
}

main();
