import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ExpertPortalRoot() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/expert/dashboard");
  }

  const role = (session.user as { role?: string })?.role;
  if (role !== "EXPERT") {
    redirect("/unauthorized");
  }

  redirect("/expert/dashboard");
}
