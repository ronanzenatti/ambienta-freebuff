"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X, AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

const variantStyles = {
  danger: {
    icon: "bg-red-100 text-red-600",
    button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    iconComponent: AlertTriangle,
  },
  warning: {
    icon: "bg-amber-100 text-amber-600",
    button: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
    iconComponent: AlertTriangle,
  },
  info: {
    icon: "bg-blue-100 text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    iconComponent: AlertTriangle,
  },
};

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Confirmar ação",
  message = "Tem certeza que deseja continuar?",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "danger",
  loading = false,
}: ConfirmModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const Icon = variantStyles[variant].iconComponent;

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !loading) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === overlayRef.current && !loading) onClose();
      }}
    >
      {/* Overlay with backdrop blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-border overflow-hidden animate-modal-slide-up"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-hovered transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div
            className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${variantStyles[variant].icon}`}
          >
            <Icon className="w-6 h-6" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-text text-center">
            {title}
          </h3>

          {/* Message */}
          <div className="mt-2 text-sm text-text-subtle text-center">
            {message}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-text-subtle bg-surface hover:bg-surface-hovered border border-border rounded-lg transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2 ${variantStyles[variant].button}`}
          >
            {loading && (
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {confirmLabel}
          </button>
        </div>
      </div>

    </div>
  );
}
