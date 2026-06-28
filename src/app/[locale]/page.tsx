import { getTranslations } from "next-intl/server";
import { CalendarDays, MapPin, Building2, Search, Filter, Clock, User } from "lucide-react";
import Header from "@/components/layout/Header";
import { listPublicBookings, listPublicCampuses, listPublicBuildings } from "@/actions/public";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "./status-badge";

interface Props {
  searchParams: Promise<{
    q?: string;
    campusId?: string;
    buildingId?: string;
    date?: string;
    page?: string;
  }>;
}

async function BookingList({ q, campusId, buildingId, date, page: pageNum }: {
  q: string; campusId: string; buildingId: string; date: string; page: number;
}) {
  const { data: bookings, total, page, totalPages } = await listPublicBookings({
    q, campusId, buildingId, date, page: pageNum, pageSize: 20,
  });

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16">
        <CalendarDays className="w-12 h-12 text-text-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text mb-1">Nenhuma reserva encontrada</h3>
        <p className="text-sm text-text-subtle">Tente ajustar os filtros ou busque por outra data.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-subtle">
          <span className="font-medium text-text">{total}</span> reserva{total !== 1 ? "s" : ""} encontrada{total !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="space-y-3">
        {bookings.map((booking) => (
          <div key={booking.id} className="group bg-white rounded-xl border border-border p-4 sm:p-5 hover:border-blue-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-sm font-semibold text-text truncate">{booking.title}</h3>
                  <StatusBadge status={booking.status as "active" | "cancelled"} />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-subtle">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {booking.campusName}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    {booking.buildingName}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {booking.date ? new Date(booking.date).toLocaleDateString("pt-BR") : "Data a definir"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {booking.startTime} - {booking.endTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {booking.userName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Pagination currentPage={page} totalPages={totalPages} total={total} />
      </div>
    </>
  );
}

export default async function HomePage({ searchParams }: Props) {
  const t = await getTranslations("app");
  const { q = "", campusId = "", buildingId = "", date = "", page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1", 10) || 1);

  const campuses = await listPublicCampuses();
  const buildings = await listPublicBuildings(campusId || undefined);

  return (
    <>
      <Header />
      <div className="flex-1 bg-surface-subtle">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-text">{t("name")}</h1>
            <p className="mt-1 text-text-subtle">{t("tagline")}</p>
          </div>

          {/* Filters Section */}
          <form className="bg-white rounded-xl border border-border shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-blue-600" />
              <h2 className="text-sm font-semibold text-text">Filtros</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="text" name="q" defaultValue={q} placeholder="Buscar por título..." className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted" />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <select name="campusId" defaultValue={campusId} className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer">
                  <option value="">Todos os campi</option>
                  {campuses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <select name="buildingId" defaultValue={buildingId} className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer">
                  <option value="">Todos os prédios</option>
                  {buildings.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="date" name="date" defaultValue={date} className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
            </div>
          </form>

          {/* Bookings List */}
          <BookingList q={q} campusId={campusId} buildingId={buildingId} date={date} page={page} />
        </main>
      </div>
    </>
  );
}
