"use client";

import { useActionState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { type ActionState } from "@/actions/users";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  DIRETOR: "Diretor",
  COORDENADOR: "Coordenador",
  PROFESSOR: "Professor",
  AUXILIAR: "Auxiliar",
};

interface EditUserFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    active: boolean;
  };
  updateAction: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}

export function EditUserForm({ user, updateAction }: EditUserFormProps) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateAction, {});

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
          <h1 className="text-2xl font-bold text-text">Editar Usuário</h1>
          <p className="mt-1 text-sm text-text-subtle">Altere os dados do usuário.</p>
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
              defaultValue={user.name}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
              defaultValue={user.email}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text mb-1.5">
              Senha <span className="text-text-muted font-normal">(deixe em branco para manter)</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={6}
              placeholder="Nova senha"
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
              defaultValue={user.role}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
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
