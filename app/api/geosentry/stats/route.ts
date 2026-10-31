import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";

export const GET = apiHandler(async () => {
  await requireSessionUser(["GEOSENTRY_MANAGER", "SUPERADMIN"]);

  const [
    totalRequests,
    newRequests,
    inProgress,
    delivered,
    recentRequests,
    scoreAgg,
    byDepositType,
    byStatus,
  ] = await Promise.all([
    prisma.geoSentryRequest.count(),
    prisma.geoSentryRequest.count({ where: { status: "SUBMITTED" } }),
    prisma.geoSentryRequest.count({ where: { status: "IN_PROGRESS" } }),
    prisma.geoSentryRequest.count({ where: { status: "DELIVERED" } }),
    prisma.geoSentryRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        referenceNumber: true,
        clientName: true,
        targetName: true,
        targetCountry: true,
        depositType: true,
        priority: true,
        status: true,
        overallScore: true,
        createdAt: true,
      },
    }),
    prisma.geoSentryRequest.aggregate({
      _avg: { overallScore: true },
      where: { overallScore: { not: null } },
    }),
    prisma.geoSentryRequest.groupBy({
      by: ["depositType"],
      _count: { depositType: true },
      orderBy: { _count: { depositType: "desc" } },
      take: 5,
    }),
    prisma.geoSentryRequest.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  const avgScore = Math.round(scoreAgg._avg.overallScore ?? 0);

  return successResponse({
    totalRequests,
    newRequests,
    inProgress,
    delivered,
    avgScore,
    recentRequests,
    byDepositType: byDepositType.map((d) => ({
      type: d.depositType,
      count: d._count.depositType,
    })),
    byStatus: byStatus.map((s) => ({
      status: s.status,
      count: s._count.status,
    })),
  });
});
