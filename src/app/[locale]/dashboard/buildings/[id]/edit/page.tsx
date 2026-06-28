import { getBuilding, updateBuilding } from "@/actions/buildings";
import { listCampuses } from "@/actions/campuses";
import { notFound } from "next/navigation";
import { EditBuildingForm } from "./edit-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBuildingPage({ params }: Props) {
  const { id } = await params;
  const [item, { data: campuses }] = await Promise.all([
    getBuilding(id),
    listCampuses({ pageSize: 100 }),
  ]);
  if (!item) notFound();

  return <EditBuildingForm item={item} campuses={campuses} updateAction={updateBuilding.bind(null, id)} />;
}
