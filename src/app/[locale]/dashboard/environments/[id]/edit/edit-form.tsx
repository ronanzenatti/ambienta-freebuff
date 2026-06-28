"use client";

import { useActionState, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ActionState } from "@/actions/environments";
import LazySelect from "@/components/ui/LazySelect";

interface Props {
  item: {
    id: string;
    name: string;
    buildingId: string;
    environmentTypeId: string;
    capacity: number;
    description: string | null;
    photoUrl: string | null;
  };
  buildings: Array<{ id: string; name: string }>;
  environmentTypes: Array<{ id: string; name: string }>;
  updateAction: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}

export function EditEnvironmentForm({ item, buildings, environmentTypes, updateAction }: Props) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateAction, {});
  const [buildingId, setBuildingId] = useState(item.buildingId);
  const [envTypeId, setEnvTypeId] = useState(item.environmentTypeId);

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

          <LazySelect
            label="Prédio"
            options={buildings.map((b) => ({ value: b.id, label: b.name }))}
            value={buildingId}
            onChange={setBuildingId}
            placeholder="Selecione um prédio..."
            searchPlaceholder="Buscar prédio..."
            required
          />
          <input type="hidden" name="buildingId" value={buildingId} />

          <div className="grid grid-cols-2 gap-4">
            <LazySelect
              label="Tipo de Ambiente"
              options={environmentTypes.map((t) => ({ value: t.id, label: t.name }))}
              value={envTypeId}
              onChange={setEnvTypeId}
              placeholder="Selecione..."
              searchPlaceholder="Buscar tipo..."
              required
            />
            <input type="hidden" name="environmentTypeId" value={envTypeId} />
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-text mb-1.5">Capacidade <span className="text-red-500">*</span></label>
              <input id="capacity" name="capacity" type="number" required min={1} defaultValue={item.capacity} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text mb-1.5">Descrição</label>
            <textarea id="description" name="description" rows={3} defaultValue={item.description ?? ""} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" />
          </div>

          {/* Foto do Ambiente */}
          <div>
            <label htmlFor="photoUrl" className="block text-sm font-medium text-text mb-1.5">Foto do Ambiente</label>
            <input id="photoUrl" name="photoUrl" type="url" defaultValue={item.photoUrl ?? ""} placeholder="https://exemplo.com/foto-ambiente.jpg" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted transition-all" />
            <p className="mt-1 text-xs text-text-muted">URL de uma imagem do ambiente.</p>
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
