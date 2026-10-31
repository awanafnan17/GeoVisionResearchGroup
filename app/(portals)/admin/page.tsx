import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPortalRoot() {
  const session = await auth();
  if (!session?.user) {
    redirect("/staff/login?callbackUrl=/admin/dashboard");
  }

  const role = (session.user as { role?: string })?.role;
  if (role !== "ADMIN") {
    redirect("/unauthorized");
  }

  redirect("/admin/dashboard");
}
