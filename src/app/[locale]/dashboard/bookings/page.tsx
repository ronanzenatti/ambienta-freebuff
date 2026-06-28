import { Suspense } from "react";
import { Plus, Search, CalendarDays } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { listBookings } from "@/actions/bookings";
import { listCampuses } from "@/actions/campuses";
import { BookingListActions } from "./list-actions";
import { Pagination } from "@/components/ui/pagination";

interface Props {
  searchParams: Promise<{ q?: string; status?: string; campusId?: string; date?: string; page?: string }>;
}

async function Table({ q, status, campusId, date, page }: { q: string; status: string; campusId: string; date: string; page: number }) {
  const { data, total, page: currentPage, totalPages } = await listBookings({ q, status, campusId, date, page });

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-12 text-center">
        <CalendarDays className="w-12 h-12 text-text-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text mb-1">Nenhuma reserva</h3>
        <p className="text-sm text-text-subtle mb-4">
          {q ? "Nenhum resultado para sua busca." : "Crie a primeira reserva para começar."}
        </p>
        {!q && (
          <Link href="/dashboard/bookings/new" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Nova Reserva
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
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Título</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Local</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Data</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Horário</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Responsável</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Tipo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((booking) => (
              <tr key={booking.id} className="hover:bg-surface-hovered transition-colors">
                <td className="px-4 py-3"><p className="text-sm font-medium text-text">{booking.title}</p></td>
                <td className="px-4 py-3">
                  <div className="text-sm text-text-subtle">
                    <p>{booking.campusName}</p>
                    <p className="text-xs text-text-muted">{booking.buildingName} - {booking.environmentName}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-text">
                  {booking.date ? new Date(booking.date).toLocaleDateString("pt-BR") : `${new Date(booking.createdAt).toLocaleDateString("pt-BR")} (recorrente)`}
                </td>
                <td className="px-4 py-3 text-sm text-text">{booking.startTime} - {booking.endTime}</td>
                <td className="px-4 py-3 text-sm text-text-subtle">{booking.userName}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    booking.bookingType === "single" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                  }`}>
                    {booking.bookingType === "single" ? "Única" : "Recorrente"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    booking.status === "active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}>
                    {booking.status === "active" ? "Ativa" : "Cancelada"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <BookingListActions id={booking.id} status={booking.status} />
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

export default async function BookingsPage({ searchParams }: Props) {
  const { q = "", status = "", campusId = "", date = "", page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1", 10) || 1);

  let campuses: Array<{ id: string; name: string }> = [];
  try {
    const result = await listCampuses({ pageSize: 100 });
    campuses = result.data;
  } catch {}

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Reservas</h1>
          <p className="mt-1 text-sm text-text-subtle">Gerencie todas as reservas do sistema.</p>
        </div>
        <Link href="/dashboard/bookings/new" className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Nova Reserva
        </Link>
      </div>

      <form className="bg-white rounded-xl border border-border p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" name="q" defaultValue={q} placeholder="Buscar reservas..." className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted" />
          </div>
          <select name="status" defaultValue={status} className="px-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer">
            <option value="">Todos os status</option>
            <option value="active">Ativas</option>
            <option value="cancelled">Canceladas</option>
          </select>
          <select name="campusId" defaultValue={campusId} className="px-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer">
            <option value="">Todos os campi</option>
            {campuses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="date" name="date" defaultValue={date} className="px-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>
      </form>

      <Suspense fallback={<div className="bg-white rounded-xl border border-border p-12 text-center text-text-muted">Carregando...</div>}>
        <Table q={q} status={status} campusId={campusId} date={date} page={page} />
      </Suspense>
    </div>
  );
}
