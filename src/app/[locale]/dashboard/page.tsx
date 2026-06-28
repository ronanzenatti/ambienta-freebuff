import {
  CalendarDays,
  DoorOpen,
  Users,
  TrendingUp,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getDashboardStats, listBookings } from "@/actions/bookings";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const { data: recentBookings } = await listBookings({ pageSize: 5 });

  const statCards = [
    {
      label: "Reservas Ativas",
      value: String(stats.activeBookings),
      change: `${stats.cancelledToday} cancelada${stats.cancelledToday !== 1 ? "s" : ""} hoje`,
      icon: CalendarDays,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Ambientes Disponíveis",
      value: String(stats.totalEnvironments),
      change: `${stats.totalCapacity} vagas no total`,
      icon: DoorOpen,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Usuários Ativos",
      value: String(stats.totalUsers),
      change: "cadastrados no sistema",
      icon: Users,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Cancelamentos Hoje",
      value: String(stats.cancelledToday),
      change: "nas últimas 24h",
      icon: TrendingUp,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text">Dashboard</h1>
        <p className="mt-1 text-sm text-text-subtle">Visão geral do sistema de reservas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-text">{stat.value}</p>
              <p className="text-sm text-text-subtle">{stat.label}</p>
              <p className="mt-1 text-xs text-text-muted">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Alert */}
      {stats.cancelledToday > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Atenção necessária</p>
            <p className="text-sm text-amber-700 mt-0.5">
              {stats.cancelledToday} reserva{stats.cancelledToday !== 1 ? "s" : ""} cancelada{stats.cancelledToday !== 1 ? "s" : ""} nas últimas 24 horas.
            </p>
          </div>
        </div>
      )}

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text">Reservas Recentes</h2>
          <Link href="/dashboard/bookings" className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
            Ver todas <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">Nenhuma reserva encontrada.</p>
        ) : (
          <div className="space-y-2">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-hovered transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">{booking.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {booking.campusName} • {booking.startTime} - {booking.endTime} • {booking.userName}
                  </p>
                </div>
                <span className={`ml-3 px-2 py-0.5 rounded-full text-xs font-medium ${
                  booking.status === "active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}>
                  {booking.status === "active" ? "Ativa" : "Cancelada"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
