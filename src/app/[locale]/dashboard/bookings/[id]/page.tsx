import { notFound } from "next/navigation";
import { getBooking } from "@/actions/bookings";
import { CalendarDays, Clock, MapPin, Building2, User, Tag, Info, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BookingActions } from "./booking-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params;
  const booking = await getBooking(id);

  if (!booking) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/bookings" className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hovered transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text">{booking.title}</h1>
          <p className="mt-1 text-sm text-text-subtle">Detalhes da reserva</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Status bar */}
        <div className={`px-6 py-3 ${booking.status === "ACTIVE" ? "bg-green-50" : "bg-red-50"}`}>
          <div className="flex items-center justify-between">
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              booking.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {booking.status === "ACTIVE" ? "Ativa" : "Cancelada"}
            </span>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              booking.bookingType === "SINGLE" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
            }`}>
              {booking.bookingType === "SINGLE" ? "Reserva Única" : "Reserva Recorrente"}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CalendarDays className="w-5 h-5 text-text-muted mt-0.5" />
              <div>
                <p className="text-xs text-text-muted uppercase font-semibold tracking-wider">Data</p>
                <p className="text-sm text-text font-medium">
                  {booking.date
                    ? new Date(booking.date).toLocaleDateString("pt-BR")
                    : `${new Date(booking.startDate!).toLocaleDateString("pt-BR")} - ${new Date(booking.endDate!).toLocaleDateString("pt-BR")}`}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-text-muted mt-0.5" />
              <div>
                <p className="text-xs text-text-muted uppercase font-semibold tracking-wider">Horário</p>
                <p className="text-sm text-text font-medium">{booking.startTime} - {booking.endTime}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-text-muted mt-0.5" />
              <div>
                <p className="text-xs text-text-muted uppercase font-semibold tracking-wider">Campus</p>
                <p className="text-sm text-text font-medium">{booking.environment.building.campus.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-text-muted mt-0.5" />
              <div>
                <p className="text-xs text-text-muted uppercase font-semibold tracking-wider">Prédio</p>
                <p className="text-sm text-text font-medium">{booking.environment.building.name}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Tag className="w-5 h-5 text-text-muted mt-0.5" />
              <div>
                <p className="text-xs text-text-muted uppercase font-semibold tracking-wider">Ambiente</p>
                <p className="text-sm text-text font-medium">{booking.environment.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-text-muted mt-0.5" />
              <div>
                <p className="text-xs text-text-muted uppercase font-semibold tracking-wider">Responsável</p>
                <p className="text-sm text-text font-medium">{booking.user.name}</p>
              </div>
            </div>
          </div>

          {booking.description && (
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-text-muted mt-0.5" />
              <div>
                <p className="text-xs text-text-muted uppercase font-semibold tracking-wider">Descrição</p>
                <p className="text-sm text-text">{booking.description}</p>
              </div>
            </div>
          )}

          {booking.cancellationReason && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200">
              <p className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-1">Motivo do Cancelamento</p>
              <p className="text-sm text-red-600">{booking.cancellationReason}</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border bg-surface-subtle flex items-center gap-3">
          <BookingActions id={booking.id} status={booking.status} />
        </div>
      </div>
    </div>
  );
}
