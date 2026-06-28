"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/cookies";
import bcrypt from "bcryptjs";

// ─── Types ──────────────────────────────────────────────────────────────────

export type ActionState = { error?: string; success?: boolean };

interface ListParams {
  q?: string;
  role?: string;
  page?: number;
  pageSize?: number;
}

interface ListResult {
  data: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    active: boolean;
    createdAt: Date;
  }>;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

async function requireAdmin() {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return session;
}

// ─── List ───────────────────────────────────────────────────────────────────

export async function listUsers(params: ListParams = {}): Promise<ListResult> {
  await requireAdmin();

  const { q = "", role = "", page = 1, pageSize = 10 } = params;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" as const } },
      { email: { contains: q, mode: "insensitive" as const } },
    ];
  }

  if (role) {
    where.role = role;
  }

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    }),
    prisma.user.count({ where }),
  ]);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

// ─── Get by ID ──────────────────────────────────────────────────────────────

export async function getUser(id: string) {
  await requireAdmin();
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });
}

// ─── Create ─────────────────────────────────────────────────────────────────

export async function createUser(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!name) return { error: "Nome é obrigatório." };
  if (!email) return { error: "E-mail é obrigatório." };
  if (!password || password.length < 6) return { error: "Senha deve ter no mínimo 6 caracteres." };

  const validRoles = ["ADMIN", "DIRETOR", "COORDENADOR", "PROFESSOR", "AUXILIAR"];
  if (!validRoles.includes(role)) return { error: "Função inválida." };

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: "Já existe um usuário com este e-mail." };

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { name, email, password: hashedPassword, role: role as any },
    });
  } catch (err) {
    console.error("createUser error:", err);
    return { error: "Erro ao criar usuário." };
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}

// ─── Update ─────────────────────────────────────────────────────────────────

export async function updateUser(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!name) return { error: "Nome é obrigatório." };
  if (!email) return { error: "E-mail é obrigatório." };

  const validRoles = ["ADMIN", "DIRETOR", "COORDENADOR", "PROFESSOR", "AUXILIAR"];
  if (!validRoles.includes(role)) return { error: "Função inválida." };

  try {
    const existing = await prisma.user.findFirst({
      where: { email, NOT: { id } },
    });
    if (existing) return { error: "Já existe outro usuário com este e-mail." };

    const data: Record<string, unknown> = { name, email, role };

    if (password && password.length >= 6) {
      data.password = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({ where: { id }, data });
  } catch (err) {
    console.error("updateUser error:", err);
    return { error: "Erro ao atualizar usuário." };
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}

// ─── Toggle active ──────────────────────────────────────────────────────────

export async function toggleUserActive(id: string): Promise<ActionState> {
  await requireAdmin();

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { active: true, role: true },
    });
    if (!user) return { error: "Usuário não encontrado." };

    // Prevent deactivating yourself
    const session = await getSession();
    if (session?.userId === id) {
      return { error: "Você não pode desativar sua própria conta." };
    }

    await prisma.user.update({
      where: { id },
      data: { active: !user.active },
    });
  } catch (err) {
    console.error("toggleUserActive error:", err);
    return { error: "Erro ao alterar status." };
  }

  revalidatePath("/dashboard/users");
  return { success: true };
}

// ─── Delete ─────────────────────────────────────────────────────────────────

export async function deleteUser(id: string): Promise<ActionState> {
  await requireAdmin();

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true, _count: { select: { bookings: true } } },
    });
    if (!user) return { error: "Usuário não encontrado." };

    // Prevent deleting yourself
    const session = await getSession();
    if (session?.userId === id) {
      return { error: "Você não pode excluir sua própria conta." };
    }

    if (user._count.bookings > 0) {
      return { error: "Usuário possui reservas vinculadas. Desative-o em vez de excluir." };
    }

    await prisma.user.delete({ where: { id } });
  } catch (err) {
    console.error("deleteUser error:", err);
    return { error: "Erro ao excluir usuário." };
  }

  revalidatePath("/dashboard/users");
  return { success: true };
}
