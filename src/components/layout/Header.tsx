"use client";

import { useState } from "react";
import { Menu, X, Bell, User, Globe, LogOut, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

interface HeaderProps {
  onMenuToggle?: () => void;
  isAuthenticated?: boolean;
}

export default function Header({ onMenuToggle, isAuthenticated = false }: HeaderProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [localeMenuOpen, setLocaleMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/bookings", label: t("bookings") },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hovered transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg font-bold text-text"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">RE</span>
            </div>
            <span className="hidden sm:inline">ReservaEspaços</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1 ml-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === link.href
                    ? "text-blue-600 bg-blue-50"
                    : "text-text-subtle hover:text-text hover:bg-surface-hovered"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Locale switcher */}
          <div className="relative">
            <button
              onClick={() => setLocaleMenuOpen(!localeMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-2 text-sm text-text-muted hover:text-text hover:bg-surface-hovered rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">PT</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {localeMenuOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white border border-border rounded-xl shadow-xl overflow-hidden z-50">
                <Link
                  href="/"
                  locale="pt-BR"
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-text hover:bg-surface-hovered transition-colors"
                  onClick={() => setLocaleMenuOpen(false)}
                >
                  <span className="text-base">🇧🇷</span>
                  Português (BR)
                </Link>
                <Link
                  href="/"
                  locale="en"
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-text hover:bg-surface-hovered transition-colors"
                  onClick={() => setLocaleMenuOpen(false)}
                >
                  <span className="text-base">🇺🇸</span>
                  English
                </Link>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <button className="relative p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hovered transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-hovered transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                    A
                  </div>
                  <ChevronDown className="w-4 h-4 text-text-muted hidden sm:block" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-56 bg-white border border-border rounded-xl shadow-xl overflow-hidden z-50">
                    <div className="px-3 py-3 border-b border-border">
                      <p className="text-sm font-medium text-text">Admin</p>
                      <p className="text-xs text-text-muted">admin@admin.com</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2.5 text-sm text-text hover:bg-surface-hovered transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 text-text-muted" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-border"
                    >
                      <LogOut className="w-4 h-4" />
                      {t("logout")}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {t("login")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
