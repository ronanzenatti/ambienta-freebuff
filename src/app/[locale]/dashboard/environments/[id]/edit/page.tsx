import { getEnvironment, updateEnvironment } from "@/actions/environments";
import { listBuildings } from "@/actions/buildings";
import { listEnvironmentTypes } from "@/actions/environment-types";
import { notFound } from "next/navigation";
import { EditEnvironmentForm } from "./edit-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEnvironmentPage({ params }: Props) {
  const { id } = await params;
  const [item, { data: buildings }, { data: envTypes }] = await Promise.all([
    getEnvironment(id),
    listBuildings({ pageSize: 100 }),
    listEnvironmentTypes({ pageSize: 100 }),
  ]);
  if (!item) notFound();

  return (
    <EditEnvironmentForm
      item={item}
      buildings={buildings}
      environmentTypes={envTypes}
      updateAction={updateEnvironment.bind(null, id)}
    />
  );
}
