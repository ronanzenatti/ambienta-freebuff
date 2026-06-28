"use client";

import { useState } from "react";
import { Edit2, Power, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { deleteEnvironment, toggleEnvironmentActive } from "@/actions/environments";

export function EnvironmentListActions({ id, name, active }: { id: string; name: string; active: boolean }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggle = async () => { await toggleEnvironmentActive(id); };
  const handleDelete = async () => {
    setDeleting(true);
    const result = await deleteEnvironment(id);
    setDeleting(false);
    if (!result.error) setShowDeleteModal(false);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Link href={`/dashboard/environments/${id}/edit`} className="p-2 rounded-lg text-text-muted hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Editar">
          <Edit2 className="w-4 h-4" />
        </Link>
        <button onClick={handleToggle} className={`p-2 rounded-lg transition-colors ${active ? "text-text-muted hover:text-amber-600 hover:bg-amber-50" : "text-text-muted hover:text-green-600 hover:bg-green-50"}`} title={active ? "Desativar" : "Ativar"}>
          <Power className="w-4 h-4" />
        </button>
        <button onClick={() => setShowDeleteModal(true)} className="p-2 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors" title="Excluir">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <ConfirmModal
        open={showDeleteModal}
        onClose={() => !deleting && setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Excluir Ambiente"
        message={`Tem certeza que deseja excluir "${name}"? Esta ação não pode ser desfeita.`}
        confirmLabel={deleting ? "Excluindo..." : "Excluir"}
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
