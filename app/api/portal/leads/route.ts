import type { LeadStatus, LeadType, Prisma } from "@prisma/client";
import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

const LEAD_STATUS_VALUES = [
  "NEW",
  "CONTACTED",
  "IN_DISCUSSION",
  "PROPOSAL_SENT",
  "WON",
  "LOST",
  "CLOSED",
] as const;

const LEAD_TYPE_VALUES = [
  "GENERAL_INQUIRY",
  "PROJECT_INQUIRY",
  "EXPERT_CONTACT",
  "COURSE_INQUIRY",
] as const;

export const GET = apiHandler(async (req) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN", "EXPERT"]);
  const url = new URL(req.url);

  const statusParam = url.searchParams.get("status");
  const typeParam = url.searchParams.get("type");
  const searchParam = url.searchParams.get("search")?.trim();

  const where: Prisma.LeadWhereInput = {};

  if (user.role === "EXPERT") {
    where.OR = [
      { assignedToId: user.id },
      { expertProfile: { userId: user.id } },
    ];
  }

  if (
    statusParam &&
    statusParam !== "ALL" &&
    (LEAD_STATUS_VALUES as readonly string[]).includes(statusParam)
  ) {
    where.status = statusParam as LeadStatus;
  }

  if (
    typeParam &&
    typeParam !== "ALL" &&
    (LEAD_TYPE_VALUES as readonly string[]).includes(typeParam)
  ) {
    where.type = typeParam as LeadType;
  }

  if (searchParam) {
    const searchFilter: Prisma.LeadWhereInput = {
      OR: [
        { name: { contains: searchParam, mode: "insensitive" } },
        { email: { contains: searchParam, mode: "insensitive" } },
        { organization: { contains: searchParam, mode: "insensitive" } },
        { subject: { contains: searchParam, mode: "insensitive" } },
        { message: { contains: searchParam, mode: "insensitive" } },
      ],
    };
    where.AND = [searchFilter];
  }

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      expertProfile: {
        select: {
          id: true,
          fullName: true,
          designation: true,
          slug: true,
          userId: true,
        },
      },
      service: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      notes: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return successResponse(leads);
});
