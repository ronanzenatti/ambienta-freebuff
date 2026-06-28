"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { login, type AuthResult } from "@/actions/auth";
import { LogIn, AlertCircle, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { Link } from "@/i18n/navigation";

export default function LoginPage() {
  const t = useTranslations("auth");
  const appT = useTranslations("app");
  const [state, action, pending] = useActionState<AuthResult | undefined, FormData>(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

  const error = state && !state.success ? state.error : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-surface via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold text-text">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">RE</span>
          </div>
          <span className="hidden sm:inline">{appT("shortName")}</span>
        </Link>
      </header>

      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-modal-slide-up">
          <div className="bg-white rounded-2xl border border-border shadow-xl p-8 sm:p-10">
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-200/50">
                <LogIn className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-text">{t("loginTitle")}</h1>
              <p className="mt-1.5 text-sm text-text-subtle">
                {appT("tagline")}
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Form */}
            <form action={action} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text mb-1.5"
                >
                  {t("email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="admin@admin.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-text mb-1.5"
                >
                  {t("password")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-border rounded-xl bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-text-muted transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot password link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {t("forgotPassword")}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={pending}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm hover:shadow-md disabled:shadow-none"
              >
                {pending ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
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
                    {t("loginButton")}...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    {t("loginButton")}
                  </>
                )}
              </button>
            </form>

            {/* Dev Hint */}
            <div className="mt-6 p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700 leading-relaxed">
              <p className="font-medium mb-0.5">🔧 Ambiente de Desenvolvimento</p>
              <p>
                Admin padrão: <strong>admin@admin.com</strong> /{" "}
                <strong>admin123</strong>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-text-muted">
            &copy; {new Date().getFullYear()} {appT("shortName")}.{" "}
            {appT("name")}.
          </p>
        </div>
      </div>
    </div>
  );
}
