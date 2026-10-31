import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";

export const GET = apiHandler(async () => {
  const user = await requireSessionUser();

  return successResponse({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    image: user.image ?? null,
  });
});
