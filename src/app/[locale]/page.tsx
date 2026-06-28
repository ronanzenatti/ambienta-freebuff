import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("app");

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-surface-subtle">
      <main className="flex flex-1 w-full max-w-7xl flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-rovo-text sm:text-4xl">
          {t("name")}
        </h1>
        <p className="mt-2 text-lg text-rovo-text-subtle">{t("tagline")}</p>

        {/* Booking Dashboard Placeholder */}
        <div className="mt-12 w-full grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Filters Section */}
          <div className="lg:col-span-1 bg-white rounded-lg border border-rovo-border p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-rovo-text">Filtros</h2>
            <div className="mt-4 space-y-4">
              <div className="h-10 bg-surface-hovered rounded animate-pulse" />
              <div className="h-10 bg-surface-hovered rounded animate-pulse" />
              <div className="h-10 bg-surface-hovered rounded animate-pulse" />
              <div className="h-10 bg-surface-hovered rounded animate-pulse" />
            </div>
          </div>

          {/* Bookings List Section */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-rovo-border p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-rovo-text">Reservas</h2>
            <div className="mt-4 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-surface-hovered rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
