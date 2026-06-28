import { listCampuses } from "@/actions/campuses";
import { listBuildings } from "@/actions/buildings";
import { listEnvironmentTypes } from "@/actions/environment-types";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/cookies";
import { BookingForm } from "./booking-form";
import { redirect } from "next/navigation";

export default async function NewBookingPage() {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const [{ data: campuses }, { data: buildings }, { data: environmentTypes }] = await Promise.all([
    listCampuses({ pageSize: 100 }),
    listBuildings({ pageSize: 100 }),
    listEnvironmentTypes({ pageSize: 100 }),
  ]);

  // Only admins can book for other users
  let users: Array<{ id: string; name: string }> = [];
  if (session.role === "ADMIN") {
    users = await prisma.user.findMany({
      where: { active: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  }

  return (
    <BookingForm
      campuses={campuses}
      buildings={buildings}
      environmentTypes={environmentTypes}
      users={users}
    />
  );
}
