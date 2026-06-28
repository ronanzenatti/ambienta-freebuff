"use client";

import { useActionState, useState, useEffect } from "react";
import { ArrowLeft, Save, RefreshCw, CalendarDays } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { createBooking, createRecurringBooking, checkAvailability, type ActionState, type AvailableEnvironment } from "@/actions/bookings";
import LazySelect from "@/components/ui/LazySelect";
import type { SelectOption } from "@/components/ui/LazySelect";

interface Props {
  campuses: Array<{ id: string; name: string }>;
  buildings: Array<{ id: string; name: string; campusId: string }>;
  environmentTypes: Array<{ id: string; name: string }>;
  users: Array<{ id: string; name: string }>;
}

export function BookingForm({ campuses, buildings, environmentTypes, users }: Props) {
  const [bookingType, setBookingType] = useState<"single" | "recurring">("single");
  const [state, action, pending] = useActionState<ActionState, FormData>(
    bookingType === "single" ? createBooking : createRecurringBooking,
    {},
  );

  const [selectedCampus, setSelectedCampus] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [selectedEnvType, setSelectedEnvType] = useState("");

  const campusOptions: SelectOption[] = campuses.map((c) => ({ value: c.id, label: c.name }));
  const buildingOptions: SelectOption[] = buildings
    .filter((b) => !selectedCampus || b.campusId === selectedCampus)
    .map((b) => ({ value: b.id, label: b.name }));
  const envTypeOptions: SelectOption[] = environmentTypes.map((t) => ({ value: t.id, label: t.name }));
  const [availableEnvs, setAvailableEnvs] = useState<AvailableEnvironment[]>([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);

  const filteredBuildings = buildings.filter((b) => !selectedCampus || b.campusId === selectedCampus);

  const checkAvailabilityNow = async () => {
    if (!selectedDate || !selectedStartTime || !selectedEndTime) return;
    setCheckingAvailability(true);
    const envs = await checkAvailability(selectedDate, selectedStartTime, selectedEndTime, selectedCampus, selectedBuilding);
    // Filter by environment type if selected
    const filtered = selectedEnvType
      ? envs.filter((e) => e.environmentTypeName === environmentTypes.find((t) => t.id === selectedEnvType)?.name)
      : envs;
    setAvailableEnvs(filtered);
    setAvailabilityChecked(true);
    setCheckingAvailability(false);
  };

  // Reset availability when filters change
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setAvailabilityChecked(false);
  }, [selectedDate, selectedStartTime, selectedEndTime, selectedCampus, selectedBuilding, selectedEnvType]);

  const weekDays = [
    { value: "0", label: "Domingo" },
    { value: "1", label: "Segunda-feira" },
    { value: "2", label: "Terça-feira" },
    { value: "3", label: "Quarta-feira" },
    { value: "4", label: "Quinta-feira" },
    { value: "5", label: "Sexta-feira" },
    { value: "6", label: "Sábado" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/bookings" className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hovered transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text">Nova Reserva</h1>
          <p className="mt-1 text-sm text-text-subtle">Reserve um ambiente para uso.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        {state?.error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{state.error}</div>
        )}

        {/* Booking Type Toggle */}
        <div className="flex items-center gap-2 mb-6 p-1 bg-surface-subtle rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setBookingType("single")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${bookingType === "single" ? "bg-white text-blue-700 shadow-sm" : "text-text-subtle hover:text-text"}`}
          >
            <CalendarDays className="w-4 h-4 inline mr-1.5" />
            Reserva Única
          </button>
          <button
            type="button"
            onClick={() => setBookingType("recurring")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${bookingType === "recurring" ? "bg-white text-blue-700 shadow-sm" : "text-text-subtle hover:text-text"}`}
          >
            <RefreshCw className="w-4 h-4 inline mr-1.5" />
            Reserva Recorrente
          </button>
        </div>

        <form action={action} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text mb-1.5">Título <span className="text-red-500">*</span></label>
            <input id="title" name="title" type="text" required placeholder="Ex: Aula de Matemática - Turma A" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted transition-all" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text mb-1.5">Descrição</label>
            <textarea id="description" name="description" rows={2} placeholder="Descrição opcional..." className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted transition-all resize-none" />
          </div>

          {/* Campus & Building Filters */}
          <div className="grid grid-cols-2 gap-4">
            <LazySelect
              label="Campus"
              options={[{ value: "", label: "Todos os campi" }, ...campusOptions]}
              value={selectedCampus}
              onChange={(v) => { setSelectedCampus(v); setSelectedBuilding(""); }}
              placeholder="Todos os campi"
              searchPlaceholder="Buscar campus..."
            />
            <LazySelect
              label="Prédio"
              options={[{ value: "", label: "Todos os prédios" }, ...buildingOptions]}
              value={selectedBuilding}
              onChange={setSelectedBuilding}
              placeholder="Todos os prédios"
              searchPlaceholder="Buscar prédio..."
            />
          </div>

          {/* Date & Time */}
          {bookingType === "single" ? (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-text mb-1.5">Data <span className="text-red-500">*</span></label>
                <input id="date" name="date" type="date" required value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              </div>
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-text mb-1.5">Início <span className="text-red-500">*</span></label>
                <input id="startTime" name="startTime" type="time" required value={selectedStartTime} onChange={(e) => setSelectedStartTime(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-text mb-1.5">Fim <span className="text-red-500">*</span></label>
                <input id="endTime" name="endTime" type="time" required value={selectedEndTime} onChange={(e) => setSelectedEndTime(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-text mb-1.5">Data Início <span className="text-red-500">*</span></label>
                  <input id="startDate" name="startDate" type="date" required className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-text mb-1.5">Data Fim <span className="text-red-500">*</span></label>
                  <input id="endDate" name="endDate" type="date" required className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label htmlFor="recurringDayOfWeek" className="block text-sm font-medium text-text mb-1.5">Dia da Semana <span className="text-red-500">*</span></label>
                  <select id="recurringDayOfWeek" name="recurringDayOfWeek" required className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer">
                    <option value="">Selecione...</option>
                    {weekDays.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-text mb-1.5">Início <span className="text-red-500">*</span></label>
                  <input id="startTime" name="startTime" type="time" required className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-text mb-1.5">Fim <span className="text-red-500">*</span></label>
                  <input id="endTime" name="endTime" type="time" required className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
              </div>
            </>
          )}

          {/* Environment Type Filter */}
          <LazySelect
            label="Tipo de Ambiente"
            options={[{ value: "", label: "Todos os tipos" }, ...envTypeOptions]}
            value={selectedEnvType}
            onChange={setSelectedEnvType}
            placeholder="Todos os tipos"
            searchPlaceholder="Buscar tipo..."
          />

          {/* Check Availability Button */}
          {bookingType === "single" && (
            <button
              type="button"
              onClick={checkAvailabilityNow}
              disabled={!selectedDate || !selectedStartTime || !selectedEndTime || checkingAvailability}
              className="w-full px-4 py-3 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${checkingAvailability ? "animate-spin" : ""}`} />
              {checkingAvailability ? "Verificando disponibilidade..." : "Verificar Ambientes Disponíveis"}
            </button>
          )}

          {/* Available Environments */}
          {availabilityChecked && (
            <div>
              <label htmlFor="environmentId" className="block text-sm font-medium text-text mb-1.5">Ambiente <span className="text-red-500">*</span></label>
              {availableEnvs.length === 0 ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700">
                  Nenhum ambiente disponível para o horário solicitado. Tente alterar a data ou horário.
                </div>
              ) : (
                <select id="environmentId" name="environmentId" required size={Math.min(availableEnvs.length, 5)} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  <option value="">Selecione um ambiente...</option>
                  {availableEnvs.map((env) => (
                    <option key={env.id} value={env.id}>
                      {env.name} — {env.buildingName}, {env.campusName} ({env.capacity} vagas, {env.environmentTypeName})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Book for another user (admin only) */}
          {users.length > 0 && (
            <div>
              <label htmlFor="bookedForUserId" className="block text-sm font-medium text-text mb-1.5">Reservar para</label>
              <select id="bookedForUserId" name="bookedForUserId" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer">
                <option value="">Para mim mesmo</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-xl transition-all">
              <Save className="w-4 h-4" />
              {pending ? "Salvando..." : "Reservar"}
            </button>
            <Link href="/dashboard/bookings" className="px-4 py-2.5 text-sm font-medium text-text-subtle hover:text-text bg-surface hover:bg-surface-hovered border border-border rounded-xl transition-colors">Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
