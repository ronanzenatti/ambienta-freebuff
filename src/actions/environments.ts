"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/cookies";

// ─── Types ──────────────────────────────────────────────────────────────────

export type ActionState = { error?: string; success?: boolean };

interface ListParams {
  q?: string;
  buildingId?: string;
  environmentTypeId?: string;
  page?: number;
  pageSize?: number;
}

interface ListResult {
  data: Array<{
    id: string;
    name: string;
    buildingId: string;
    buildingName: string;
    environmentTypeName: string;
    capacity: number;
    active: boolean;
  }>;
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

export async function listEnvironments(params: ListParams = {}): Promise<ListResult> {
  await requireAuth();

  const { q = "", buildingId = "", environmentTypeId = "", page = 1, pageSize = 10 } = params;
  const skip = (page - 1) * pageSize;

  const andConditions: Record<string, unknown>[] = [];
  if (q) andConditions.push({ name: { contains: q, mode: "insensitive" as const } });
  if (buildingId) andConditions.push({ buildingId });
  if (environmentTypeId) andConditions.push({ environmentTypeId });

  const where = andConditions.length > 0 ? { AND: andConditions } : {};

  const [data, total] = await Promise.all([
    prisma.environment.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        buildingId: true,
        building: { select: { name: true } },
        environmentType: { select: { name: true } },
        capacity: true,
        active: true,
      },
    }),
    prisma.environment.count({ where }),
  ]);

  return {
    data: data.map((e) => ({
      id: e.id,
      name: e.name,
      buildingId: e.buildingId,
      buildingName: e.building.name,
      environmentTypeName: e.environmentType.name,
      capacity: e.capacity,
      active: e.active,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// ─── Get by ID ──────────────────────────────────────────────────────────────

export async function getEnvironment(id: string) {
  await requireAuth();
  return prisma.environment.findUnique({
    where: { id },
    include: {
      building: { select: { id: true, name: true } },
      environmentType: { select: { id: true, name: true } },
    },
  });
}

// ─── Create ─────────────────────────────────────────────────────────────────

export async function createEnvironment(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const name = (formData.get("name") as string)?.trim();
  const buildingId = formData.get("buildingId") as string;
  const environmentTypeId = formData.get("environmentTypeId") as string;
  const capacityStr = formData.get("capacity") as string;
  const description = (formData.get("description") as string)?.trim() || null;
  const photoUrl = (formData.get("photoUrl") as string)?.trim() || null;

  if (!name) return { error: "Nome é obrigatório." };
  if (!buildingId) return { error: "Prédio é obrigatório." };
  if (!environmentTypeId) return { error: "Tipo de ambiente é obrigatório." };

  const capacity = parseInt(capacityStr, 10);
  if (isNaN(capacity) || capacity < 1) return { error: "Capacidade deve ser um número positivo." };

  try {
    await prisma.environment.create({
      data: { name, buildingId, environmentTypeId, capacity, description, photoUrl },
    });
  } catch (err) {
    console.error("createEnvironment error:", err);
    return { error: "Erro ao criar ambiente." };
  }

  revalidatePath("/dashboard/environments");
  redirect("/dashboard/environments");
}

// ─── Update ─────────────────────────────────────────────────────────────────

export async function updateEnvironment(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const name = (formData.get("name") as string)?.trim();
  const buildingId = formData.get("buildingId") as string;
  const environmentTypeId = formData.get("environmentTypeId") as string;
  const capacityStr = formData.get("capacity") as string;
  const description = (formData.get("description") as string)?.trim() || null;
  const photoUrl = (formData.get("photoUrl") as string)?.trim() || null;

  if (!name) return { error: "Nome é obrigatório." };
  if (!buildingId) return { error: "Prédio é obrigatório." };
  if (!environmentTypeId) return { error: "Tipo de ambiente é obrigatório." };

  const capacity = parseInt(capacityStr, 10);
  if (isNaN(capacity) || capacity < 1) return { error: "Capacidade deve ser um número positivo." };

  try {
    await prisma.environment.update({
      where: { id },
      data: { name, buildingId, environmentTypeId, capacity, description, photoUrl },
    });
  } catch (err) {
    console.error("updateEnvironment error:", err);
    return { error: "Erro ao atualizar ambiente." };
  }

  revalidatePath("/dashboard/environments");
  redirect("/dashboard/environments");
}

// ─── Delete ─────────────────────────────────────────────────────────────────

export async function deleteEnvironment(id: string): Promise<ActionState> {
  await requireAuth();

  try {
    await prisma.environment.delete({ where: { id } });
  } catch (err) {
    console.error("deleteEnvironment error:", err);
    return { error: "Erro ao excluir ambiente. Verifique se há reservas vinculadas." };
  }

  revalidatePath("/dashboard/environments");
  return { success: true };
}

// ─── Toggle active ──────────────────────────────────────────────────────────

export async function toggleEnvironmentActive(id: string): Promise<ActionState> {
  await requireAuth();
  try {
    const item = await prisma.environment.findUnique({ where: { id }, select: { active: true } });
    if (!item) return { error: "Ambiente não encontrado." };
    await prisma.environment.update({ where: { id }, data: { active: !item.active } });
  } catch (err) {
    console.error("toggleEnvironmentActive error:", err);
    return { error: "Erro ao alterar status." };
  }
  revalidatePath("/dashboard/environments");
  return { success: true };
}
