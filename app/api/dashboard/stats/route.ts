import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";
import { ForbiddenError } from "@/lib/api-error";

export const GET = apiHandler(async (req) => {
  const user = await requireSessionUser();
  const url = new URL(req.url);
  const requestedRole = url.searchParams.get("role");

  if (requestedRole && requestedRole !== user.role && user.role !== "SUPERADMIN") {
    throw new ForbiddenError("You do not have permission to view statistics for another role");
  }

  const role = user.role === "SUPERADMIN" && requestedRole ? requestedRole : user.role;

  if (role === "SUPERADMIN" || role === "ADMIN") {
    if (user.role !== "SUPERADMIN" && user.role !== "ADMIN") {
      throw new ForbiddenError("Admin or SuperAdmin role required");
    }

    const [
      expertCount,
      serviceCount,
      courseCount,
      leadCount,
      newLeadCount,
      enrollmentCount,
      geoSentryCount,
      recentLeads,
    ] = await Promise.all([
      prisma.expertProfile.count({ where: { status: "PUBLISHED" } }),
      prisma.service.count({ where: { isPublished: true } }),
      prisma.course.count({ where: { status: "PUBLISHED" } }),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.enrollment.count(),
      prisma.geoSentryRequest.count(),
      prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          type: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return successResponse({
      expertCount,
      serviceCount,
      courseCount,
      leadCount,
      newLeadCount,
      enrollmentCount,
      geoSentryCount,
      recentLeads,
    });
  }

  if (role === "EXPERT") {
    const [profile, assignedLeadCount] = await Promise.all([
      prisma.expertProfile.findUnique({
        where: { userId: user.id },
        select: { profileViews: true, cvDownloads: true, status: true },
      }),
      prisma.lead.count({
        where: { assignedToId: user.id },
      }),
    ]);

    return successResponse({
      profileViews: profile?.profileViews ?? 0,
      cvDownloads: profile?.cvDownloads ?? 0,
      profileStatus: profile?.status ?? "DRAFT",
      assignedLeadCount,
    });
  }

  if (role === "STUDENT") {
    const [enrollmentCount, activeCourseCount] = await Promise.all([
      prisma.enrollment.count({ where: { userId: user.id } }),
      prisma.enrollment.count({ where: { userId: user.id, status: "CONFIRMED" } }),
    ]);

    return successResponse({
      enrollmentCount,
      activeCourseCount,
    });
  }

  return successResponse({});
});
