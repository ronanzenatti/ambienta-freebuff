"use client";

import {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
} from "react";
import { ChevronDown, Search, X, Check, Loader2 } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface LazySelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  searchPlaceholder?: string;
  noResultsMessage?: string;
  loading?: boolean;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  loadMore?: () => void;
  hasMore?: boolean;
  className?: string;
}

export default function LazySelect({
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  label,
  searchPlaceholder = "Buscar...",
  noResultsMessage = "Nenhum resultado encontrado",
  loading = false,
  error,
  disabled = false,
  required = false,
  loadMore,
  hasMore = false,
  className = "",
}: LazySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsListRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Filter options based on search
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opening
  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  // Scroll focused option into view
  useEffect(() => {
    if (focusedIndex >= 0 && optionsListRef.current) {
      const items = optionsListRef.current.querySelectorAll(
        '[role="option"]'
      );
      if (items[focusedIndex]) {
        items[focusedIndex].scrollIntoView({ block: "nearest" });
      }
    }
  }, [focusedIndex]);

  // Reset focus index when search changes
  useEffect(() => {
    setFocusedIndex(-1);
  }, [search]);

  // Intersection Observer for lazy loading (infinite scroll) — via useEffect + ref
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !loadMore || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore, hasMore, loading]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
    setSearch("");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === "ArrowDown") {
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleSelect(filteredOptions[focusedIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        setSearch("");
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-text mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-3 py-2.5 text-sm
          border rounded-lg transition-all duration-150
          ${
            error
              ? "border-red-400 focus:ring-red-500"
              : "border-border hover:border-border-bold focus:border-blue-500"
          }
          ${disabled ? "bg-surface-hovered cursor-not-allowed opacity-60" : "bg-white cursor-pointer"}
          ${open ? "ring-2 ring-blue-500/20 border-blue-500" : ""}
          focus:outline-none focus:ring-2 focus:ring-blue-500/20
        `}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className={`truncate ${
            selectedOption ? "text-text" : "text-text-muted"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-text-muted transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Error message */}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-1 w-full bg-white border border-border rounded-xl shadow-xl overflow-hidden animate-select-fade-in"
        >
          {/* Search input */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Options list with lazy loading */}
          <div
            ref={optionsListRef}
            className="max-h-60 overflow-y-auto py-1"
            role="listbox"
          >
            {loading && options.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-text-muted">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span className="text-sm">Carregando...</span>
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-text-muted">
                <Search className="w-8 h-8 mb-2 opacity-40" />
                <span className="text-sm">{noResultsMessage}</span>
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  disabled={option.disabled}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 text-sm text-left transition-colors
                    ${
                      option.value === value
                        ? "bg-blue-50 text-blue-700"
                        : focusedIndex === index
                          ? "bg-surface-hovered text-text"
                          : "text-text hover:bg-surface-hovered"
                    }
                    ${option.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === value && (
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  )}
                </button>
              ))
            )}

            {/* Load more trigger (Intersection Observer target) */}
            {hasMore && !loading && (
              <div
                ref={sentinelRef}
                className="h-8 flex items-center justify-center"
              >
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Loading more indicator */}
            {loading && options.length > 0 && (
              <div className="flex items-center justify-center py-3 text-text-muted">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className="text-xs">Carregando mais...</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
