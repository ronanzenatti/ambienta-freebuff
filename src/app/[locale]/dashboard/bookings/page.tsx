"use client";

import { Plus, Search, MapPin, Building2, CalendarDays, Clock, User, Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const bookings = [
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

export default function BookingsPage() {
  const t = useTranslations("booking");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">{t("title")}</h1>
          <p className="mt-1 text-sm text-text-subtle">
            Gerencie todas as reservas do sistema
          </p>
        </div>
        <Link
          href="/dashboard/bookings/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t("newBooking")}
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar reservas..."
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted"
            />
          </div>
          <select className="px-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer">
            <option value="">Todos os status</option>
            <option value="active">Ativas</option>
            <option value="cancelled">Canceladas</option>
          </select>
          <select className="px-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer">
            <option value="">Todos os campi</option>
            <option value="central">Campus Central</option>
            <option value="norte">Campus Norte</option>
            <option value="sul">Campus Sul</option>
          </select>
          <input
            type="date"
            className="px-3 py-2.5 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-subtle">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Título
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Local
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Data
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Horário
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Responsável
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-surface-hovered transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-text">
                      {booking.title}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-text-subtle">
                      <p>{booking.campus}</p>
                      <p className="text-xs text-text-muted">
                        {booking.building} - {booking.environment}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text">
                    {new Date(booking.date).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3 text-sm text-text">
                    {booking.startTime} - {booking.endTime}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-subtle">
                    {booking.user}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === "active"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {booking.status === "active" ? "Ativa" : "Cancelada"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-text-muted">
            Mostrando 1-5 de 5 resultados
          </p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-sm font-medium text-text-muted bg-surface border border-border rounded-lg hover:bg-surface-hovered transition-colors disabled:opacity-50" disabled>
              Anterior
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg">
              1
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-text-muted bg-surface border border-border rounded-lg hover:bg-surface-hovered transition-colors disabled:opacity-50" disabled>
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
