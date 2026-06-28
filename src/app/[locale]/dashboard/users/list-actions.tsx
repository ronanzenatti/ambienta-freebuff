"use client";

import { useState } from "react";
import { Edit2, Power, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { deleteUser, toggleUserActive } from "@/actions/users";

export function ListActions({ id, name, active }: { id: string; name: string; active: boolean }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const result = await toggleUserActive(id);
    setLoading(false);
    if (!result.error) setShowToggleModal(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteUser(id);
    setLoading(false);
    if (!result.error) setShowDeleteModal(false);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Link
          href={`/dashboard/users/${id}/edit`}
          className="p-2 rounded-lg text-text-muted hover:text-blue-600 hover:bg-blue-50 transition-colors"
          title="Editar"
        >
          <Edit2 className="w-4 h-4" />
        </Link>
        <button
          onClick={() => setShowToggleModal(true)}
          className={`p-2 rounded-lg transition-colors ${
            active
              ? "text-text-muted hover:text-amber-600 hover:bg-amber-50"
              : "text-text-muted hover:text-green-600 hover:bg-green-50"
          }`}
          title={active ? "Desativar" : "Ativar"}
        >
          <Power className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="p-2 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Excluir"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <ConfirmModal
        open={showToggleModal}
        onClose={() => !loading && setShowToggleModal(false)}
        onConfirm={handleToggle}
        title={active ? "Desativar Usuário" : "Ativar Usuário"}
        message={`Tem certeza que deseja ${active ? "desativar" : "ativar"} "${name}"?`}
        confirmLabel={loading ? "Aguarde..." : active ? "Desativar" : "Ativar"}
        variant={active ? "danger" : "info"}
        loading={loading}
      />

      <ConfirmModal
        open={showDeleteModal}
        onClose={() => !loading && setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Excluir Usuário"
        message={`Tem certeza que deseja excluir "${name}"? Esta ação não pode ser desfeita.`}
        confirmLabel={loading ? "Excluindo..." : "Excluir"}
        variant="danger"
        loading={loading}
      />
    </>
  );
}
