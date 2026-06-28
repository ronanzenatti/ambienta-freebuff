import { listBuildings } from "@/actions/buildings";
import { listEnvironmentTypes } from "@/actions/environment-types";
import { EnvironmentForm } from "./environment-form";

export default async function NewEnvironmentPage() {
  const [{ data: buildings }, { data: environmentTypes }] = await Promise.all([
    listBuildings({ pageSize: 100 }),
    listEnvironmentTypes({ pageSize: 100 }),
  ]);
  return <EnvironmentForm buildings={buildings} environmentTypes={environmentTypes} />;
}
