import ClientsPageView from "@/app/src/modules/client/components/ClientsPageView";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ClientsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  return <ClientsPageView />;
}
