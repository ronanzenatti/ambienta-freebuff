"use server";

import { prisma } from "@/lib/prisma";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PublicBooking {
  id: string;
  title: string;
  date: string | null;
  startTime: string;
  endTime: string;
  status: string;
  campusName: string;
  buildingName: string;
  environmentName: string;
  userName: string;
}

interface ListParams {
  q?: string;
  campusId?: string;
  buildingId?: string;
  date?: string;
  page?: number;
  pageSize?: number;
}

interface ListResult {
  data: PublicBooking[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PublicCampus {
  id: string;
  name: string;
}

export interface PublicBuilding {
  id: string;
  name: string;
  campusId: string;
}

// ─── List active bookings (public) ──────────────────────────────────────────

export async function listPublicBookings(params: ListParams = {}): Promise<ListResult> {
  const { q = "", campusId = "", buildingId = "", date = "", page = 1, pageSize = 20 } = params;
  const skip = (page - 1) * pageSize;

  const andConditions: Record<string, unknown>[] = [{ status: "ACTIVE" }];

  if (q) {
    andConditions.push({ title: { contains: q, mode: "insensitive" as const } });
  }
  if (campusId) {
    andConditions.push({ environment: { building: { campusId } } });
  }
  if (buildingId) {
    andConditions.push({ environment: { buildingId } });
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
      orderBy: { date: "asc" },
      select: {
        id: true,
        title: true,
        date: true,
        startTime: true,
        endTime: true,
        status: true,
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
      date: b.date?.toISOString() ?? null,
      startTime: b.startTime,
      endTime: b.endTime,
      status: b.status.toLowerCase(),
      campusName: b.environment.building.campus.name,
      buildingName: b.environment.building.name,
      environmentName: b.environment.name,
      userName: b.user.name,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// ─── List campuses (public) ─────────────────────────────────────────────────

export async function listPublicCampuses(): Promise<PublicCampus[]> {
  const data = await prisma.campus.findMany({
    where: { active: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  return data;
}

// ─── List buildings (public) ────────────────────────────────────────────────

export async function listPublicBuildings(campusId?: string): Promise<PublicBuilding[]> {
  const where = campusId ? { active: true, campusId } : { active: true };
  const data = await prisma.building.findMany({
    where,
    select: { id: true, name: true, campusId: true },
    orderBy: { name: "asc" },
  });
  return data;
}
