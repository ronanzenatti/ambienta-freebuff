import { getEnvironmentType, updateEnvironmentType } from "@/actions/environment-types";
import { notFound } from "next/navigation";
import { EditForm } from "./edit-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEnvironmentTypePage({ params }: Props) {
  const { id } = await params;
  const item = await getEnvironmentType(id);

  if (!item) notFound();

  return (
    <EditForm
      item={{ id: item.id, name: item.name, description: item.description }}
      updateAction={updateEnvironmentType.bind(null, id)}
    />
  );
}
