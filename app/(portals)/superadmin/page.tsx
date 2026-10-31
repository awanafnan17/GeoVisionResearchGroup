import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SuperAdminPortalRoot() {
  const session = await auth();
  if (!session?.user) {
    redirect("/staff/login?callbackUrl=/superadmin/dashboard");
  }

  const role = (session.user as { role?: string })?.role;
  if (role !== "SUPERADMIN") {
    redirect("/unauthorized");
  }

  redirect("/superadmin/dashboard");
}
