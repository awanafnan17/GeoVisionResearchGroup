import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function GeoSentryPortalRoot() {
  const session = await auth();
  if (!session?.user) {
    redirect("/staff/login?callbackUrl=/geosentry-portal/dashboard");
  }

  const role = (session.user as { role?: string })?.role;
  if (role !== "GEOSENTRY_MANAGER") {
    redirect("/unauthorized");
  }

  redirect("/geosentry-portal/dashboard");
}
