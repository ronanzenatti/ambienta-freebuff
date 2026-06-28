import { Suspense } from "react";
import { Plus, Search, Users, Filter } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { listUsers } from "@/actions/users";
import { ListActions } from "./list-actions";
import { Pagination } from "@/components/ui/pagination";

interface Props {
  searchParams: Promise<{ q?: string; role?: string; page?: string }>;
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  DIRETOR: "Diretor",
  COORDENADOR: "Coordenador",
  PROFESSOR: "Professor",
  AUXILIAR: "Auxiliar",
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-purple-50 text-purple-700",
  DIRETOR: "bg-blue-50 text-blue-700",
  COORDENADOR: "bg-cyan-50 text-cyan-700",
  PROFESSOR: "bg-green-50 text-green-700",
  AUXILIAR: "bg-amber-50 text-amber-700",
};

async function Table({ q, role, page }: { q: string; role: string; page: number }) {
  const { data, total, page: currentPage, totalPages } = await listUsers({ q, role, page });

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-12 text-center">
        <Users className="w-12 h-12 text-text-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text mb-1">Nenhum usuário encontrado</h3>
        <p className="text-sm text-text-subtle mb-4">
          {q || role ? "Nenhum resultado para sua busca." : "Crie o primeiro usuário para começar."}
        </p>
        {!q && !role && (
          <Link
            href="/dashboard/users/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Usuário
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
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">E-mail</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Função</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Criado em</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((user) => (
              <tr key={user.id} className="hover:bg-surface-hovered transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-text">{user.name}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-text-subtle">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[user.role] ?? "bg-gray-50 text-gray-700"}`}>
                    {ROLE_LABELS[user.role] ?? user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}>
                    {user.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-text-subtle">{new Date(user.createdAt).toLocaleDateString("pt-BR")}</p>
                </td>
                <td className="px-4 py-3 text-right">
                  <ListActions id={user.id} name={user.name} active={user.active} />
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

export default async function UsersPage({ searchParams }: Props) {
  const { q = "", role = "", page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1", 10) || 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Usuários</h1>
          <p className="mt-1 text-sm text-text-subtle">Gerencie os usuários e suas funções no sistema.</p>
        </div>
        <Link
          href="/dashboard/users/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Usuário
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Buscar por nome ou e-mail..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted"
          />
        </form>
        <form>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <select
              name="role"
              defaultValue={role}
              className="w-full sm:w-44 pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
            >
              <option value="">Todas as funções</option>
              <option value="ADMIN">Admin</option>
              <option value="DIRETOR">Diretor</option>
              <option value="COORDENADOR">Coordenador</option>
              <option value="PROFESSOR">Professor</option>
              <option value="AUXILIAR">Auxiliar</option>
            </select>
          </div>
        </form>
      </div>

      <Suspense fallback={<div className="bg-white rounded-xl border border-border p-12 text-center text-text-muted">Carregando...</div>}>
        <Table q={q} role={role} page={page} />
      </Suspense>
    </div>
  );
}
