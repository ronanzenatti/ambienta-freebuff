"use client";

import { useActionState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { createUser, type ActionState } from "@/actions/users";

export default function NewUserPage() {
  const [state, action, pending] = useActionState<ActionState, FormData>(createUser, {});

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/users"
          className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hovered transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text">Novo Usuário</h1>
          <p className="mt-1 text-sm text-text-subtle">Cadastre um novo usuário no sistema.</p>
        </div>
      </div>

      <form action={action} className="bg-white rounded-xl border border-border p-6 space-y-5">
        {state?.error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
            {state.error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-text mb-1.5">
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Nome completo"
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="email@exemplo.com"
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text mb-1.5">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-text mb-1.5">
              Função
            </label>
            <select
              id="role"
              name="role"
              required
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="PROFESSOR">Professor</option>
              <option value="COORDENADOR">Coordenador</option>
              <option value="DIRETOR">Diretor</option>
              <option value="AUXILIAR">Auxiliar</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/dashboard/users"
            className="px-4 py-2.5 text-sm font-medium text-text-subtle hover:text-text bg-white border border-border rounded-lg hover:bg-surface-hovered transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            {pending ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
