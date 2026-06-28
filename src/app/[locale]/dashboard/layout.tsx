"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface-subtle">
      <Header
        isAuthenticated
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex flex-1">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
        />
        {/* On mobile (fixed sidebar), no margin needed.
            On desktop (static sidebar), the flex layout naturally
            pushes content right by the sidebar's width (w-64 = 16rem or w-16 = 4rem). */}
        <main className="flex-1 min-w-0 overflow-x-hidden transition-all duration-300">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
