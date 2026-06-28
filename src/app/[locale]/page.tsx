import { getTranslations } from "next-intl/server";
import { CalendarDays, MapPin, Building2, Search, Filter, Clock, User } from "lucide-react";
import Header from "@/components/layout/Header";

// Mock data for the landing page
const mockBookings = [
  {
    id: "1",
    title: "Aula de Matemática - Turma A",
    campus: "Campus Central",
    building: "Bloco A",
    environment: "Sala 101",
    date: "2026-06-28",
    startTime: "08:00",
    endTime: "10:00",
    user: "Prof. Carlos Silva",
    status: "active" as const,
  },
  {
    id: "2",
    title: "Laboratório de Química",
    campus: "Campus Central",
    building: "Bloco B",
    environment: "Lab. Química 1",
    date: "2026-06-28",
    startTime: "10:00",
    endTime: "12:00",
    user: "Prof. Ana Oliveira",
    status: "active" as const,
  },
  {
    id: "3",
    title: "Reunião de Coordenação",
    campus: "Campus Norte",
    building: "Prédio Administrativo",
    environment: "Sala de Reuniões 1",
    date: "2026-06-28",
    startTime: "14:00",
    endTime: "16:00",
    user: "Coord. Roberto Santos",
    status: "active" as const,
  },
  {
    id: "4",
    title: "Workshop de Programação",
    campus: "Campus Central",
    building: "Bloco C",
    environment: "Lab. Informática 2",
    date: "2026-06-29",
    startTime: "09:00",
    endTime: "11:00",
    user: "Prof. Maria Costa",
    status: "cancelled" as const,
  },
  {
    id: "5",
    title: "Aula de Inglês - Nível 3",
    campus: "Campus Sul",
    building: "Bloco D",
    environment: "Sala 203",
    date: "2026-06-29",
    startTime: "13:00",
    endTime: "15:00",
    user: "Prof. João Pereira",
    status: "active" as const,
  },
];

function StatusBadge({ status }: { status: "active" | "cancelled" }) {
  const styles = {
    active: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {status === "active" ? "Ativa" : "Cancelada"}
    </span>
  );
}

export default async function HomePage() {
  const t = await getTranslations("app");

  return (
    <>
      <Header />
      <div className="flex-1 bg-surface-subtle">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-text">
              {t("name")}
            </h1>
            <p className="mt-1 text-text-subtle">{t("tagline")}</p>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-blue-600" />
              <h2 className="text-sm font-semibold text-text">Filtros</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search by title */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Buscar por título..."
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted"
                />
              </div>

              {/* Campus filter */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <select className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer">
                  <option value="">Todos os campi</option>
                  <option value="central">Campus Central</option>
                  <option value="norte">Campus Norte</option>
                  <option value="sul">Campus Sul</option>
                </select>
              </div>

              {/* Building filter */}
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <select className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer">
                  <option value="">Todos os prédios</option>
                  <option value="a">Bloco A</option>
                  <option value="b">Bloco B</option>
                  <option value="c">Bloco C</option>
                  <option value="d">Bloco D</option>
                </select>
              </div>

              {/* Date filter */}
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="date"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Active filters tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                Campus Central
                <button className="ml-0.5 hover:text-blue-900">&times;</button>
              </span>
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                + Adicionar filtro
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-text-subtle">
              <span className="font-medium text-text">{mockBookings.length}</span> reservas encontradas
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted">Ordenar por:</span>
              <select className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
                <option>Data (recente)</option>
                <option>Data (antigo)</option>
                <option>Título (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-3">
            {mockBookings.map((booking) => (
              <div
                key={booking.id}
                className="group bg-white rounded-xl border border-border p-4 sm:p-5 hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-sm font-semibold text-text truncate">
                        {booking.title}
                      </h3>
                      <StatusBadge status={booking.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-subtle">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {booking.campus}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {booking.building}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {new Date(booking.date).toLocaleDateString("pt-BR")}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {booking.startTime} - {booking.endTime}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {booking.user}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons - visible on hover */}
                  <div className="hidden group-hover:flex items-center gap-2 flex-shrink-0">
                    <button className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                      Ver detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {mockBookings.length === 0 && (
            <div className="text-center py-16">
              <CalendarDays className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text mb-1">
                Nenhuma reserva encontrada
              </h3>
              <p className="text-sm text-text-subtle">
                Tente ajustar os filtros ou criar uma nova reserva.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
