"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
}

export function Pagination({ currentPage, totalPages, total }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <p className="text-sm text-text-muted">{total} resultado{total !== 1 ? "s" : ""}</p>
      </div>
    );
  }

  const navigate = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
      <p className="text-sm text-text-muted">
        Página {currentPage} de {totalPages} ({total} resultado{total !== 1 ? "s" : ""})
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => navigate(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hovered transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          let pageNum: number;
          if (totalPages <= 7) {
            pageNum = i + 1;
          } else if (currentPage <= 4) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 3) {
            pageNum = totalPages - 6 + i;
          } else {
            pageNum = currentPage - 3 + i;
          }
          return (
            <button
              key={pageNum}
              onClick={() => navigate(pageNum)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                pageNum === currentPage
                  ? "text-white bg-blue-600"
                  : "text-text-muted hover:text-text hover:bg-surface-hovered"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => navigate(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hovered transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
