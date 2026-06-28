"use server";

import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/auth/cookies";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export type AuthResult =
  | { success: true }
  | { success: false; error: string };

export async function login(
  _prevState: AuthResult | undefined,
  formData: FormData,
): Promise<AuthResult> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email e senha são obrigatórios." };
  }

  if (password.length < 6) {
    return { success: false, error: "Senha deve ter no mínimo 6 caracteres." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        name: true,
        active: true,
      },
    });

    if (!user) {
      return { success: false, error: "Credenciais inválidas." };
    }

    if (!user.active) {
      return { success: false, error: "Usuário desativado. Contate o administrador." };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return { success: false, error: "Credenciais inválidas." };
    }

    await createSession(user.id, user.role);
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, error: "Erro interno do servidor. Tente novamente." };
  }

  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
