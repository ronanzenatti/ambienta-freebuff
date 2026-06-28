import { notFound } from "next/navigation";
import { getUser, updateUser } from "@/actions/users";
import { EditUserForm } from "./edit-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: Props) {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    notFound();
  }

  return (
    <EditUserForm
      user={user}
      updateAction={updateUser.bind(null, id)}
    />
  );
}
