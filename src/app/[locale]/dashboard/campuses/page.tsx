import { Suspense } from "react";
import { Plus, Search, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { listCampuses } from "@/actions/campuses";
import { CampusListActions } from "./list-actions";
import { Pagination } from "@/components/ui/pagination";

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

async function Table({ q, page }: { q: string; page: number }) {
  const { data, total, page: currentPage, totalPages } = await listCampuses({ q, page });

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-12 text-center">
        <MapPin className="w-12 h-12 text-text-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text mb-1">Nenhum campus</h3>
        <p className="text-sm text-text-subtle mb-4">
          {q ? "Nenhum resultado para sua busca." : "Crie o primeiro campus para começar."}
        </p>
        {!q && (
          <Link
            href="/dashboard/campuses/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Campus
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface-subtle">
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Nome</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Cidade</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Estado</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-surface-hovered transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-text">{item.name}</p>
                </td>
                <td className="px-4 py-3 text-sm text-text-subtle">{item.city || "—"}</td>
                <td className="px-4 py-3 text-sm text-text-subtle">{item.state || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    item.active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}>
                    {item.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <CampusListActions id={item.id} name={item.name} active={item.active} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} total={total} />
    </div>
  );
}

export default async function CampusesPage({ searchParams }: Props) {
  const { q = "", page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1", 10) || 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Campi</h1>
          <p className="mt-1 text-sm text-text-subtle">Gerencie os campi da instituição.</p>
        </div>
        <Link
          href="/dashboard/campuses/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Campus
        </Link>
      </div>

      <form className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nome ou cidade..."
          className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted"
        />
      </form>

      <Suspense fallback={<div className="bg-white rounded-xl border border-border p-12 text-center text-text-muted">Carregando...</div>}>
        <Table q={q} page={page} />
      </Suspense>
    </div>
  );
}
