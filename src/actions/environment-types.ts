"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/cookies";

// ─── Types ──────────────────────────────────────────────────────────────────

export type ActionState = { error?: string; success?: boolean };

interface ListParams {
  q?: string;
  page?: number;
  pageSize?: number;
}

interface ListResult {
  data: Array<{ id: string; name: string; description: string | null; active: boolean }>;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

async function requireAuth() {
  const session = await getSession();
  if (!session?.userId) redirect("/login");
  return session;
}

// ─── List ───────────────────────────────────────────────────────────────────

export async function listEnvironmentTypes(params: ListParams = {}): Promise<ListResult> {
  await requireAuth();

  const { q = "", page = 1, pageSize = 10 } = params;
  const skip = (page - 1) * pageSize;

  const where = q
    ? { OR: [{ name: { contains: q, mode: "insensitive" as const } }] }
    : {};

  const [data, total] = await Promise.all([
    prisma.environmentType.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { name: "asc" },
      select: { id: true, name: true, description: true, active: true },
    }),
    prisma.environmentType.count({ where }),
  ]);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

// ─── Get by ID ──────────────────────────────────────────────────────────────

export async function getEnvironmentType(id: string) {
  await requireAuth();
  return prisma.environmentType.findUnique({ where: { id } });
}

// ─── Create ─────────────────────────────────────────────────────────────────

export async function createEnvironmentType(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;

  if (!name) return { error: "Nome é obrigatório." };
  if (name.length < 2) return { error: "Nome deve ter no mínimo 2 caracteres." };

  try {
    const existing = await prisma.environmentType.findUnique({ where: { name } });
    if (existing) return { error: "Já existe um tipo de ambiente com este nome." };

    await prisma.environmentType.create({ data: { name, description } });
  } catch (err) {
    console.error("createEnvironmentType error:", err);
    return { error: "Erro ao criar tipo de ambiente." };
  }

  revalidatePath("/dashboard/environment-types");
  redirect("/dashboard/environment-types");
}

// ─── Update ─────────────────────────────────────────────────────────────────

export async function updateEnvironmentType(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;

  if (!name) return { error: "Nome é obrigatório." };
  if (name.length < 2) return { error: "Nome deve ter no mínimo 2 caracteres." };

  try {
    const existing = await prisma.environmentType.findFirst({
      where: { name, NOT: { id } },
    });
    if (existing) return { error: "Já existe outro tipo de ambiente com este nome." };

    await prisma.environmentType.update({
      where: { id },
      data: { name, description },
    });
  } catch (err) {
    console.error("updateEnvironmentType error:", err);
    return { error: "Erro ao atualizar tipo de ambiente." };
  }

  revalidatePath("/dashboard/environment-types");
  redirect("/dashboard/environment-types");
}

// ─── Delete ─────────────────────────────────────────────────────────────────

export async function deleteEnvironmentType(id: string): Promise<ActionState> {
  await requireAuth();

  try {
    await prisma.environmentType.delete({ where: { id } });
  } catch (err) {
    console.error("deleteEnvironmentType error:", err);
    return { error: "Erro ao excluir tipo de ambiente. Verifique se há ambientes vinculados." };
  }

  revalidatePath("/dashboard/environment-types");
  return { success: true };
}

// ─── Toggle active ──────────────────────────────────────────────────────────

export async function toggleEnvironmentTypeActive(id: string): Promise<ActionState> {
  await requireAuth();

  try {
    const item = await prisma.environmentType.findUnique({ where: { id }, select: { active: true } });
    if (!item) return { error: "Tipo de ambiente não encontrado." };

    await prisma.environmentType.update({
      where: { id },
      data: { active: !item.active },
    });
  } catch (err) {
    console.error("toggleEnvironmentTypeActive error:", err);
    return { error: "Erro ao alterar status." };
  }

  revalidatePath("/dashboard/environment-types");
  return { success: true };
}
