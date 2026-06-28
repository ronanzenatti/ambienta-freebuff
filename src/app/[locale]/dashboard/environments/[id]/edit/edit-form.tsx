"use client";

import { useActionState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ActionState } from "@/actions/environments";

interface Props {
  item: {
    id: string;
    name: string;
    buildingId: string;
    environmentTypeId: string;
    capacity: number;
    description: string | null;
  };
  buildings: Array<{ id: string; name: string }>;
  environmentTypes: Array<{ id: string; name: string }>;
  updateAction: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}

export function EditEnvironmentForm({ item, buildings, environmentTypes, updateAction }: Props) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateAction, {});

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/environments" className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hovered transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text">Editar Ambiente</h1>
          <p className="mt-1 text-sm text-text-subtle">Altere as informações do ambiente.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        {state?.error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{state.error}</div>
        )}

        <form action={action} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text mb-1.5">Nome <span className="text-red-500">*</span></label>
            <input id="name" name="name" type="text" required defaultValue={item.name} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </div>

          <div>
            <label htmlFor="buildingId" className="block text-sm font-medium text-text mb-1.5">Prédio <span className="text-red-500">*</span></label>
            <select id="buildingId" name="buildingId" required defaultValue={item.buildingId} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer">
              {buildings.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="environmentTypeId" className="block text-sm font-medium text-text mb-1.5">Tipo de Ambiente <span className="text-red-500">*</span></label>
              <select id="environmentTypeId" name="environmentTypeId" required defaultValue={item.environmentTypeId} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer">
                {environmentTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-text mb-1.5">Capacidade <span className="text-red-500">*</span></label>
              <input id="capacity" name="capacity" type="number" required min={1} defaultValue={item.capacity} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text mb-1.5">Descrição</label>
            <textarea id="description" name="description" rows={3} defaultValue={item.description ?? ""} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-xl transition-all">
              <Save className="w-4 h-4" />
              {pending ? "Salvando..." : "Salvar"}
            </button>
            <Link href="/dashboard/environments" className="px-4 py-2.5 text-sm font-medium text-text-subtle hover:text-text bg-surface hover:bg-surface-hovered border border-border rounded-xl transition-colors">Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
