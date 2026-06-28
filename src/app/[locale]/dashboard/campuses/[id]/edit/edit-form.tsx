"use client";

import { useActionState, useState } from "react";
import { ArrowLeft, Save, Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { lookupCep, type ActionState } from "@/actions/campuses";

interface Props {
  item: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  updateAction: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}

export function EditCampusForm({ item, updateAction }: Props) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateAction, {});
  const [cepLoading, setCepLoading] = useState(false);
  const [address, setAddress] = useState(item.address);
  const [city, setCity] = useState(item.city);
  const [state_uf, setStateUf] = useState(item.state);
  const [cepError, setCepError] = useState("");

  const handleCepLookup = async () => {
    const cepInput = document.getElementById("zipCode") as HTMLInputElement;
    const cep = cepInput?.value || "";
    if (cep.replace(/\D/g, "").length !== 8) {
      setCepError("CEP deve ter 8 dígitos.");
      return;
    }
    setCepLoading(true);
    setCepError("");
    const result = await lookupCep(cep);
    setCepLoading(false);
    if ("error" in result) {
      setCepError(result.error);
    } else {
      setAddress(result.logradouro || "");
      setCity(result.localidade || "");
      setStateUf(result.uf || "");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/campuses" className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hovered transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text">Editar Campus</h1>
          <p className="mt-1 text-sm text-text-subtle">Altere as informações do campus.</p>
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
            <label htmlFor="zipCode" className="block text-sm font-medium text-text mb-1.5">CEP</label>
            <div className="flex gap-2">
              <input id="zipCode" name="zipCode" type="text" defaultValue={item.zipCode} className="flex-1 px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              <button type="button" onClick={handleCepLookup} disabled={cepLoading} className="px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2">
                <Search className="w-4 h-4" />
                {cepLoading ? "Buscando..." : "Buscar"}
              </button>
            </div>
            {cepError && <p className="mt-1 text-xs text-red-500">{cepError}</p>}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-text mb-1.5">Endereço</label>
            <input id="address" name="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-text mb-1.5">Cidade</label>
              <input id="city" name="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-text mb-1.5">Estado</label>
              <input id="state" name="state" type="text" value={state_uf} onChange={(e) => setStateUf(e.target.value)} maxLength={2} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all uppercase" />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-xl transition-all">
              <Save className="w-4 h-4" />
              {pending ? "Salvando..." : "Salvar"}
            </button>
            <Link href="/dashboard/campuses" className="px-4 py-2.5 text-sm font-medium text-text-subtle hover:text-text bg-surface hover:bg-surface-hovered border border-border rounded-xl transition-colors">Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
