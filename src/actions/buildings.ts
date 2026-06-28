"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/cookies";

// ─── Types ──────────────────────────────────────────────────────────────────

export type ActionState = { error?: string; success?: boolean };

interface ListParams {
  q?: string;
  campusId?: string;
  page?: number;
  pageSize?: number;
}

interface ListResult {
  data: Array<{
    id: string;
    name: string;
    campusId: string;
    campusName: string;
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

export async function listBuildings(params: ListParams = {}): Promise<ListResult> {
  await requireAuth();

  const { q = "", campusId = "", page = 1, pageSize = 10 } = params;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};
  const andConditions: Record<string, unknown>[] = [];

  if (q) {
    andConditions.push({ name: { contains: q, mode: "insensitive" as const } });
  }
  if (campusId) {
    andConditions.push({ campusId });
  }
  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  const [data, total] = await Promise.all([
    prisma.building.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        campusId: true,
        campus: { select: { name: true } },
        active: true,
      },
    }),
    prisma.building.count({ where }),
  ]);

  return {
    data: data.map((b) => ({
      id: b.id,
      name: b.name,
      campusId: b.campusId,
      campusName: b.campus.name,
      active: b.active,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// ─── Get by ID ──────────────────────────────────────────────────────────────

export async function getBuilding(id: string) {
  await requireAuth();
  return prisma.building.findUnique({
    where: { id },
    include: { campus: { select: { id: true, name: true } } },
  });
}

// ─── Create ─────────────────────────────────────────────────────────────────

export async function createBuilding(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const name = (formData.get("name") as string)?.trim();
  const campusId = formData.get("campusId") as string;
  const address = (formData.get("address") as string)?.trim() || null;
  const photoUrl = (formData.get("photoUrl") as string)?.trim() || null;
  const internalMapUrl = (formData.get("internalMapUrl") as string)?.trim() || null;

  if (!name) return { error: "Nome é obrigatório." };
  if (!campusId) return { error: "Campus é obrigatório." };

  try {
    await prisma.building.create({ data: { name, campusId, address, photoUrl, internalMapUrl } });
  } catch (err) {
    console.error("createBuilding error:", err);
    return { error: "Erro ao criar prédio." };
  }

  revalidatePath("/dashboard/buildings");
  redirect("/dashboard/buildings");
}

// ─── Update ─────────────────────────────────────────────────────────────────

export async function updateBuilding(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const name = (formData.get("name") as string)?.trim();
  const campusId = formData.get("campusId") as string;
  const address = (formData.get("address") as string)?.trim() || null;
  const photoUrl = (formData.get("photoUrl") as string)?.trim() || null;
  const internalMapUrl = (formData.get("internalMapUrl") as string)?.trim() || null;

  if (!name) return { error: "Nome é obrigatório." };
  if (!campusId) return { error: "Campus é obrigatório." };

  try {
    await prisma.building.update({
      where: { id },
      data: { name, campusId, address, photoUrl, internalMapUrl },
    });
  } catch (err) {
    console.error("updateBuilding error:", err);
    return { error: "Erro ao atualizar prédio." };
  }

  revalidatePath("/dashboard/buildings");
  redirect("/dashboard/buildings");
}

// ─── Delete ─────────────────────────────────────────────────────────────────

export async function deleteBuilding(id: string): Promise<ActionState> {
  await requireAuth();

  try {
    await prisma.building.delete({ where: { id } });
  } catch (err) {
    console.error("deleteBuilding error:", err);
    return { error: "Erro ao excluir prédio. Verifique se há ambientes vinculados." };
  }

  revalidatePath("/dashboard/buildings");
  return { success: true };
}

// ─── Toggle active ──────────────────────────────────────────────────────────

export async function toggleBuildingActive(id: string): Promise<ActionState> {
  await requireAuth();
  try {
    const item = await prisma.building.findUnique({ where: { id }, select: { active: true } });
    if (!item) return { error: "Prédio não encontrado." };
    await prisma.building.update({ where: { id }, data: { active: !item.active } });
  } catch (err) {
    console.error("toggleBuildingActive error:", err);
    return { error: "Erro ao alterar status." };
  }
  revalidatePath("/dashboard/buildings");
  return { success: true };
}
