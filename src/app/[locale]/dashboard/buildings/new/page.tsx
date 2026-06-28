import { listCampuses } from "@/actions/campuses";
import { BuildingForm } from "./building-form";

export default async function NewBuildingPage() {
  const { data: campuses } = await listCampuses({ pageSize: 100 });
  return <BuildingForm campuses={campuses} />;
}
