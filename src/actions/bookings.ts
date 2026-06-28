"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/cookies";

// ─── Types ──────────────────────────────────────────────────────────────────

export type ActionState = { error?: string; success?: boolean };

interface ListParams {
  q?: string;
  status?: string;
  campusId?: string;
  date?: string;
  page?: number;
  pageSize?: number;
}

export interface BookingListItem {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  startTime: string;
  endTime: string;
  status: string;
  bookingType: string;
  userName: string;
  environmentName: string;
  buildingName: string;
  campusName: string;
  cancellationReason: string | null;
  createdAt: Date;
}

interface ListResult {
  data: BookingListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AvailableEnvironment {
  id: string;
  name: string;
  buildingName: string;
  campusName: string;
  capacity: number;
  environmentTypeName: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

async function requireAuth() {
  const session = await getSession();
  if (!session?.userId) redirect("/login");
  return session;
}

// ─── List bookings ──────────────────────────────────────────────────────────

export async function listBookings(params: ListParams = {}): Promise<ListResult> {
  const session = await requireAuth();
  const isAdmin = session.role === "ADMIN";

  const { q = "", status = "", campusId = "", date = "", page = 1, pageSize = 10 } = params;
  const skip = (page - 1) * pageSize;

  const andConditions: Record<string, unknown>[] = [];

  // Visibility: non-admin users only see their own bookings
  if (!isAdmin) {
    andConditions.push({ userId: session.userId });
  }

  if (q) {
    andConditions.push({
      OR: [
        { title: { contains: q, mode: "insensitive" as const } },
        { user: { name: { contains: q, mode: "insensitive" as const } } },
      ],
    });
  }

  if (status) {
    andConditions.push({ status: status.toUpperCase() });
  }

  if (campusId) {
    andConditions.push({ environment: { building: { campusId } } });
  }

  if (date) {
    const dateObj = new Date(date);
    andConditions.push({
      date: { gte: dateObj, lt: new Date(dateObj.getTime() + 86400000) },
    });
  }

  const where = andConditions.length > 0 ? { AND: andConditions } : {};

  const [data, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        startTime: true,
        endTime: true,
        status: true,
        bookingType: true,
        cancellationReason: true,
        createdAt: true,
        user: { select: { name: true } },
        environment: {
          select: {
            name: true,
            building: { select: { name: true, campus: { select: { name: true } } } },
          },
        },
      },
    }),
    prisma.booking.count({ where }),
  ]);

  return {
    data: data.map((b) => ({
      id: b.id,
      title: b.title,
      description: b.description,
      date: b.date?.toISOString() ?? null,
      startTime: b.startTime,
      endTime: b.endTime,
      status: b.status.toLowerCase(),
      bookingType: b.bookingType.toLowerCase(),
      userName: b.user.name,
      environmentName: b.environment.name,
      buildingName: b.environment.building.name,
      campusName: b.environment.building.campus.name,
      cancellationReason: b.cancellationReason,
      createdAt: b.createdAt,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// ─── Get booking by ID ──────────────────────────────────────────────────────

export async function getBooking(id: string) {
  const session = await requireAuth();
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      environment: {
        select: {
          id: true,
          name: true,
          capacity: true,
          building: { select: { id: true, name: true, campus: { select: { id: true, name: true } } } },
        },
      },
    },
  });

  if (!booking) return null;

  // Non-admin users can only see their own bookings
  if (session.role !== "ADMIN" && booking.userId !== session.userId) {
    return null;
  }

  return booking;
}

// ─── Check availability ────────────────────────────────────────────────────

export async function checkAvailability(
  date: string,
  startTime: string,
  endTime: string,
  campusId?: string,
  buildingId?: string,
): Promise<AvailableEnvironment[]> {
  await requireAuth();

  const dateObj = new Date(date);

  // Find environments that don't have overlapping active bookings
  const environments = await prisma.environment.findMany({
    where: {
      active: true,
      building: {
        ...(campusId ? { campusId } : {}),
        ...(buildingId ? { id: buildingId } : {}),
      },
    },
    select: {
      id: true,
      name: true,
      capacity: true,
      building: { select: { name: true, campus: { select: { name: true } } } },
      environmentType: { select: { name: true } },
    },
  });

  // Get all active bookings that overlap with the requested time slot on the given date
  const conflictingBookings = await prisma.booking.findMany({
    where: {
      status: "ACTIVE",
      date: dateObj,
      AND: [
        { startTime: { lt: endTime } },
        { endTime: { gt: startTime } },
      ],
    },
    select: { environmentId: true },
  });

  const conflictingIds = new Set(conflictingBookings.map((b) => b.environmentId));

  return environments
    .filter((e) => !conflictingIds.has(e.id))
    .map((e) => ({
      id: e.id,
      name: e.name,
      buildingName: e.building.name,
      campusName: e.building.campus.name,
      capacity: e.capacity,
      environmentTypeName: e.environmentType.name,
    }));
}

// ─── Create single booking ──────────────────────────────────────────────────

export async function createBooking(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAuth();

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const environmentId = formData.get("environmentId") as string;
  const dateStr = formData.get("date") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const bookedForUserId = (formData.get("bookedForUserId") as string) || null;

  if (!title) return { error: "Título é obrigatório." };
  if (!environmentId) return { error: "Ambiente é obrigatório." };
  if (!dateStr) return { error: "Data é obrigatória." };
  if (!startTime || !endTime) return { error: "Horário é obrigatório." };
  if (startTime >= endTime) return { error: "Hora início deve ser anterior à hora fim." };

  try {
    const date = new Date(dateStr);

    // Check for conflicts
    const conflict = await prisma.booking.findFirst({
      where: {
        environmentId,
        status: "ACTIVE",
        date,
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: startTime } },
        ],
      },
    });

    if (conflict) {
      return { error: "Este ambiente já está reservado neste horário." };
    }

    await prisma.booking.create({
      data: {
        title,
        description,
        userId: session.userId,
        bookedForUserId,
        environmentId,
        bookingType: "SINGLE",
        date,
        startTime,
        endTime,
        status: "ACTIVE",
      },
    });
  } catch (err) {
    console.error("createBooking error:", err);
    return { error: "Erro ao criar reserva." };
  }

  revalidatePath("/dashboard/bookings");
  revalidatePath("/");
  redirect("/dashboard/bookings");
}

// ─── Create recurring booking ───────────────────────────────────────────────

export async function createRecurringBooking(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAuth();

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const environmentId = formData.get("environmentId") as string;
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const dayOfWeekStr = formData.get("recurringDayOfWeek") as string;

  if (!title) return { error: "Título é obrigatório." };
  if (!environmentId) return { error: "Ambiente é obrigatório." };
  if (!startDateStr || !endDateStr) return { error: "Período é obrigatório." };
  if (!startTime || !endTime) return { error: "Horário é obrigatório." };
  if (startTime >= endTime) return { error: "Hora início deve ser anterior à hora fim." };

  const recurringDayOfWeek = parseInt(dayOfWeekStr, 10);
  if (isNaN(recurringDayOfWeek) || recurringDayOfWeek < 0 || recurringDayOfWeek > 6) {
    return { error: "Dia da semana inválido." };
  }

  try {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    await prisma.booking.create({
      data: {
        title,
        description,
        userId: session.userId,
        environmentId,
        bookingType: "RECURRING",
        startDate,
        endDate,
        startTime,
        endTime,
        recurringDayOfWeek,
        status: "ACTIVE",
      },
    });
  } catch (err) {
    console.error("createRecurringBooking error:", err);
    return { error: "Erro ao criar reserva recorrente." };
  }

  revalidatePath("/dashboard/bookings");
  revalidatePath("/");
  redirect("/dashboard/bookings");
}

// ─── Cancel booking ─────────────────────────────────────────────────────────

export async function cancelBooking(
  id: string,
  _prevState: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAuth();

  const reason = (formData.get("cancellationReason") as string)?.trim();
  if (!reason) return { error: "Motivo do cancelamento é obrigatório." };
  if (reason.length < 5) return { error: "Motivo deve ter no mínimo 5 caracteres." };

  try {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return { error: "Reserva não encontrada." };

    if (session.role !== "ADMIN" && booking.userId !== session.userId) {
      return { error: "Você não tem permissão para cancelar esta reserva." };
    }

    await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED", cancellationReason: reason },
    });
  } catch (err) {
    console.error("cancelBooking error:", err);
    return { error: "Erro ao cancelar reserva." };
  }

  revalidatePath("/dashboard/bookings");
  revalidatePath("/");
  return { success: true };
}

// ─── Restore booking ────────────────────────────────────────────────────────

export async function restoreBooking(id: string): Promise<ActionState> {
  const session = await requireAuth();

  try {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return { error: "Reserva não encontrada." };

    if (session.role !== "ADMIN" && booking.userId !== session.userId) {
      return { error: "Você não tem permissão para restaurar esta reserva." };
    }

    // Check for conflicts when restoring
    if (booking.date) {
      const conflict = await prisma.booking.findFirst({
        where: {
          id: { not: id },
          environmentId: booking.environmentId,
          status: "ACTIVE",
          date: booking.date,
          AND: [
            { startTime: { lt: booking.endTime } },
            { endTime: { gt: booking.startTime } },
          ],
        },
      });

      if (conflict) {
        return { error: "Não é possível restaurar — há conflito de horário com outra reserva ativa." };
      }
    }

    await prisma.booking.update({
      where: { id },
      data: { status: "ACTIVE", cancellationReason: null },
    });
  } catch (err) {
    console.error("restoreBooking error:", err);
    return { error: "Erro ao restaurar reserva." };
  }

  revalidatePath("/dashboard/bookings");
  revalidatePath("/");
  return { success: true };
}

// ─── Dashboard stats ────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const session = await requireAuth();
  const isAdmin = session.role === "ADMIN";

  const userFilter = isAdmin ? {} : { userId: session.userId };

  const [activeBookings, totalEnvironments, totalUsers, cancelledToday] = await Promise.all([
    prisma.booking.count({ where: { ...userFilter, status: "ACTIVE" } }),
    prisma.environment.count({ where: { active: true } }),
    prisma.user.count({ where: { active: true } }),
    prisma.booking.count({
      where: {
        ...userFilter,
        status: "CANCELLED",
        updatedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
  ]);

  const totalCapacity = await prisma.environment.aggregate({
    _sum: { capacity: true },
    where: { active: true },
  });

  return {
    activeBookings,
    totalEnvironments,
    totalUsers,
    cancelledToday,
    totalCapacity: totalCapacity._sum.capacity ?? 0,
  };
}
