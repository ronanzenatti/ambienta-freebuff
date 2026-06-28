export function StatusBadge({ status }: { status: "active" | "cancelled" }) {
  const styles = {
    active: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status === "active" ? "Ativa" : "Cancelada"}
    </span>
  );
}
