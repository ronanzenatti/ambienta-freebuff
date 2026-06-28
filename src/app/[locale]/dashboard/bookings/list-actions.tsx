"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { cancelBooking, restoreBooking } from "@/actions/bookings";
import ConfirmModal from "@/components/ui/ConfirmModal";

export function BookingListActions({ id, status }: { id: string; status: string }) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (!reason.trim()) {
      setError("Motivo do cancelamento é obrigatório.");
      return;
    }
    if (reason.trim().length < 5) {
      setError("Motivo deve ter no mínimo 5 caracteres.");
      return;
    }
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.set("cancellationReason", reason.trim());
    const result = await cancelBooking(id, undefined, formData);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setShowCancelModal(false);
      setReason("");
      router.refresh();
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    const result = await restoreBooking(id);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setShowRestoreModal(false);
      router.refresh();
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        {status === "active" ? (
          <button
            onClick={() => setShowCancelModal(true)}
            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        ) : (
          <button
            onClick={() => setShowRestoreModal(true)}
            className="px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            Restaurar
          </button>
        )}
      </div>

      {/* Cancel Modal */}
      <ConfirmModal
        open={showCancelModal}
        onClose={() => { if (!loading) { setShowCancelModal(false); setError(""); setReason(""); } }}
        onConfirm={handleCancel}
        title="Cancelar Reserva"
        message={
          <div className="space-y-3">
            <p className="text-sm text-text-subtle">Informe o motivo do cancelamento:</p>
            <textarea
              value={reason}
              onChange={(e) => { setReason(e.target.value); setError(""); }}
              placeholder="Motivo do cancelamento..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted resize-none"
              autoFocus
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        }
        confirmLabel={loading ? "Cancelando..." : "Confirmar Cancelamento"}
        variant="danger"
        loading={loading}
      />

      {/* Restore Modal */}
      <ConfirmModal
        open={showRestoreModal}
        onClose={() => { if (!loading) { setShowRestoreModal(false); setError(""); } }}
        onConfirm={handleRestore}
        title="Restaurar Reserva"
        message="Tem certeza que deseja restaurar esta reserva? Ela voltará a ficar ativa."
        confirmLabel={loading ? "Restaurando..." : "Restaurar"}
        variant="warning"
        loading={loading}
      />
    </>
  );
}
