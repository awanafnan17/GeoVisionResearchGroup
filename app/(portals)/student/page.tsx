import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function StudentPortalRoot() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/student/dashboard");
  }

  const role = (session.user as { role?: string })?.role;
  if (role !== "STUDENT") {
    redirect("/unauthorized");
  }

  redirect("/student/dashboard");
}
