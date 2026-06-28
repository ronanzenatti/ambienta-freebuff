"use client";

import { useActionState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { createBuilding, type ActionState } from "@/actions/buildings";

interface Props {
  campuses: Array<{ id: string; name: string }>;
}

export function BuildingForm({ campuses }: Props) {
  const [state, action, pending] = useActionState<ActionState, FormData>(createBuilding, {});

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/buildings" className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hovered transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text">Novo Prédio</h1>
          <p className="mt-1 text-sm text-text-subtle">Adicione um novo prédio ou bloco ao campus.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        {state?.error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{state.error}</div>
        )}

        <form action={action} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text mb-1.5">Nome <span className="text-red-500">*</span></label>
            <input id="name" name="name" type="text" required placeholder="Ex: Bloco A, Prédio Administrativo..." className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted transition-all" />
          </div>

          <div>
            <label htmlFor="campusId" className="block text-sm font-medium text-text mb-1.5">Campus <span className="text-red-500">*</span></label>
            <select id="campusId" name="campusId" required className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer">
              <option value="">Selecione um campus...</option>
              {campuses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-text mb-1.5">Localização no Campus</label>
            <input id="address" name="address" type="text" placeholder="Ex: Próximo ao bloco B" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted transition-all" />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-xl transition-all">
              <Save className="w-4 h-4" />
              {pending ? "Salvando..." : "Salvar"}
            </button>
            <Link href="/dashboard/buildings" className="px-4 py-2.5 text-sm font-medium text-text-subtle hover:text-text bg-surface hover:bg-surface-hovered border border-border rounded-xl transition-colors">Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
