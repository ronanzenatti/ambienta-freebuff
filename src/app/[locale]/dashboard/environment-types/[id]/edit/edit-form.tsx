"use client";

import { useActionState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { updateEnvironmentType, type ActionState } from "@/actions/environment-types";

interface Props {
  item: { id: string; name: string; description: string | null };
}

export function EditForm({ item }: Props) {
  const updateWithId = async (_prevState: ActionState, formData: FormData) => {
    "use server";
    return updateEnvironmentType(item.id, _prevState, formData);
  };

  const [state, action, pending] = useActionState<ActionState, FormData>(updateWithId, {});

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/environment-types"
          className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hovered transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text">Editar Tipo de Ambiente</h1>
          <p className="mt-1 text-sm text-text-subtle">Altere as informações do tipo de ambiente.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        {state?.error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            {state.error}
          </div>
        )}

        <form action={action} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text mb-1.5">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={item.name}
              className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted transition-all"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text mb-1.5">
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={item.description ?? ""}
              className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted transition-all resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-xl transition-all"
            >
              <Save className="w-4 h-4" />
              {pending ? "Salvando..." : "Salvar"}
            </button>
            <Link
              href="/dashboard/environment-types"
              className="px-4 py-2.5 text-sm font-medium text-text-subtle hover:text-text bg-surface hover:bg-surface-hovered border border-border rounded-xl transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
