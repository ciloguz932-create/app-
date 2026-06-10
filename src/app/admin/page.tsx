import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/dashboard");

  return <AdminDashboard />;
}
