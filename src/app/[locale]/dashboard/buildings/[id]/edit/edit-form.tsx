"use client";

import { useActionState, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ActionState } from "@/actions/buildings";
import LazySelect from "@/components/ui/LazySelect";

interface Props {
  item: {
    id: string;
    name: string;
    campusId: string;
    address: string | null;
    photoUrl: string | null;
    internalMapUrl: string | null;
  };
  campuses: Array<{ id: string; name: string }>;
  updateAction: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}

export function EditBuildingForm({ item, campuses, updateAction }: Props) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateAction, {});
  const [campusId, setCampusId] = useState(item.campusId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/buildings" className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hovered transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text">Editar Prédio</h1>
          <p className="mt-1 text-sm text-text-subtle">Altere as informações do prédio.</p>
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
            label="Campus"
            options={campuses.map((c) => ({ value: c.id, label: c.name }))}
            value={campusId}
            onChange={setCampusId}
            placeholder="Selecione um campus..."
            searchPlaceholder="Buscar campus..."
            required
          />
          <input type="hidden" name="campusId" value={campusId} />

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-text mb-1.5">Localização no Campus</label>
            <input id="address" name="address" type="text" defaultValue={item.address ?? ""} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </div>

          {/* Foto do Prédio */}
          <div>
            <label htmlFor="photoUrl" className="block text-sm font-medium text-text mb-1.5">Foto do Prédio</label>
            <input id="photoUrl" name="photoUrl" type="url" defaultValue={item.photoUrl ?? ""} placeholder="https://exemplo.com/foto-predio.jpg" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted transition-all" />
            <p className="mt-1 text-xs text-text-muted">URL de uma imagem do prédio.</p>
          </div>

          {/* Mapa interno do Prédio */}
          <div>
            <label htmlFor="internalMapUrl" className="block text-sm font-medium text-text mb-1.5">Mapa / Planta Interna</label>
            <input id="internalMapUrl" name="internalMapUrl" type="url" defaultValue={item.internalMapUrl ?? ""} placeholder="https://exemplo.com/planta-predio.pdf" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted transition-all" />
            <p className="mt-1 text-xs text-text-muted">URL de uma imagem ou PDF da planta interna do prédio.</p>
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
