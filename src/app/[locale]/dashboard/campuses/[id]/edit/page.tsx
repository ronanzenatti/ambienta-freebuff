import { getCampus, updateCampus } from "@/actions/campuses";
import { notFound } from "next/navigation";
import { EditCampusForm } from "./edit-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCampusPage({ params }: Props) {
  const { id } = await params;
  const item = await getCampus(id);
  if (!item) notFound();

  return <EditCampusForm item={item} updateAction={updateCampus.bind(null, id)} />;
}
