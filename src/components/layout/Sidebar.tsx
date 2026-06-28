"use client";

import {
  LayoutDashboard,
  CalendarDays,
  Building2,
  MapPin,
  DoorOpen,
  Tags,
  Users,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

interface NavItem {
  href: string;
  labelKey: string;
  icon: typeof LayoutDashboard;
  roles?: string[];
}

const navItems: NavItem[] = [
  { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/dashboard/bookings", labelKey: "bookings", icon: CalendarDays },
  { href: "/dashboard/campuses", labelKey: "campuses", icon: MapPin },
  { href: "/dashboard/buildings", labelKey: "buildings", icon: Building2 },
  { href: "/dashboard/environments", labelKey: "environments", icon: DoorOpen },
  { href: "/dashboard/environment-types", labelKey: "environmentTypes", icon: Tags },
  { href: "/dashboard/users", labelKey: "users", icon: Users, roles: ["ADMIN"] },
  { href: "/dashboard/settings", labelKey: "settings", icon: Settings },
];

export default function Sidebar({ open, onClose, collapsed, onCollapse }: SidebarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-white border-r border-border
          transition-all duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:h-auto
          ${collapsed ? "w-16" : "w-64"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => onCollapse(!collapsed)}
            className="hidden lg:flex items-center justify-end p-2 border-b border-border"
            aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
          >
            <ChevronLeft
              className={`w-4 h-4 text-text-muted transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Navigation items */}
          <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                    ${
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-text-subtle hover:text-text hover:bg-surface-hovered"
                    }
                    ${collapsed ? "justify-center px-2" : ""}
                  `}
                  title={collapsed ? t(item.labelKey) : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="truncate">{t(item.labelKey)}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="p-3 border-t border-border">
            <Link
              href="/"
              onClick={onClose}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-subtle hover:text-text hover:bg-surface-hovered transition-colors
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <LayoutDashboard className="w-5 h-5" />
              {!collapsed && <span>{t("home")}</span>}
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
