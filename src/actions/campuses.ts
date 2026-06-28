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
  data: Array<{
    id: string;
    name: string;
    city: string;
    state: string;
    active: boolean;
  }>;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ViaCEPResult {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

async function requireAuth() {
  const session = await getSession();
  if (!session?.userId) redirect("/login");
  return session;
}

// ─── ViaCEP lookup ──────────────────────────────────────────────────────────

export async function lookupCep(cep: string): Promise<ViaCEPResult | { error: string }> {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return { error: "CEP deve ter 8 dígitos." };

  try {
    const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
      next: { revalidate: 86400 }, // cache for 24h
    });
    const data: ViaCEPResult = await res.json();
    if (data.erro) return { error: "CEP não encontrado." };
    return data;
  } catch {
    return { error: "Erro ao consultar CEP. Tente novamente." };
  }
}

// ─── List ───────────────────────────────────────────────────────────────────

export async function listCampuses(params: ListParams = {}): Promise<ListResult> {
  await requireAuth();

  const { q = "", page = 1, pageSize = 10 } = params;
  const skip = (page - 1) * pageSize;

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { city: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.campus.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { name: "asc" },
      select: { id: true, name: true, city: true, state: true, active: true },
    }),
    prisma.campus.count({ where }),
  ]);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

// ─── Get by ID ──────────────────────────────────────────────────────────────

export async function getCampus(id: string) {
  await requireAuth();
  return prisma.campus.findUnique({ where: { id } });
}

// ─── Create ─────────────────────────────────────────────────────────────────

export async function createCampus(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const name = (formData.get("name") as string)?.trim();
  const address = (formData.get("address") as string)?.trim() || "";
  const city = (formData.get("city") as string)?.trim() || "";
  const state = (formData.get("state") as string)?.trim() || "";
  const zipCode = (formData.get("zipCode") as string)?.trim() || "";

  if (!name) return { error: "Nome é obrigatório." };
  if (name.length < 2) return { error: "Nome deve ter no mínimo 2 caracteres." };

  try {
    await prisma.campus.create({
      data: { name, address, city, state, zipCode },
    });
  } catch (err) {
    console.error("createCampus error:", err);
    return { error: "Erro ao criar campus." };
  }

  revalidatePath("/dashboard/campuses");
  redirect("/dashboard/campuses");
}

// ─── Update ─────────────────────────────────────────────────────────────────

export async function updateCampus(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const name = (formData.get("name") as string)?.trim();
  const address = (formData.get("address") as string)?.trim() || "";
  const city = (formData.get("city") as string)?.trim() || "";
  const state = (formData.get("state") as string)?.trim() || "";
  const zipCode = (formData.get("zipCode") as string)?.trim() || "";

  if (!name) return { error: "Nome é obrigatório." };

  try {
    await prisma.campus.update({
      where: { id },
      data: { name, address, city, state, zipCode },
    });
  } catch (err) {
    console.error("updateCampus error:", err);
    return { error: "Erro ao atualizar campus." };
  }

  revalidatePath("/dashboard/campuses");
  redirect("/dashboard/campuses");
}

// ─── Delete ─────────────────────────────────────────────────────────────────

export async function deleteCampus(id: string): Promise<ActionState> {
  await requireAuth();

  try {
    await prisma.campus.delete({ where: { id } });
  } catch (err) {
    console.error("deleteCampus error:", err);
    return { error: "Erro ao excluir campus. Verifique se há prédios vinculados." };
  }

  revalidatePath("/dashboard/campuses");
  return { success: true };
}

// ─── Toggle active ──────────────────────────────────────────────────────────

export async function toggleCampusActive(id: string): Promise<ActionState> {
  await requireAuth();
  try {
    const item = await prisma.campus.findUnique({ where: { id }, select: { active: true } });
    if (!item) return { error: "Campus não encontrado." };
    await prisma.campus.update({ where: { id }, data: { active: !item.active } });
  } catch (err) {
    console.error("toggleCampusActive error:", err);
    return { error: "Erro ao alterar status." };
  }
  revalidatePath("/dashboard/campuses");
  return { success: true };
}
