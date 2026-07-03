import { Response } from "express";
import { AuthRequest } from "../../middleware/jwt-verify";
import { prisma } from "../../lib/prisma";

export const getAllLeads = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const leads = await prisma.lead.findMany({
      where: {
        assignedToId: userId,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      message: "Leads fetched successfully",
      data: leads,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getLeadById = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!id) {
      return res.status(400).json({
        message: "Lead ID is required",
      });
    }

    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    if (lead.assignedToId !== userId) {
      return res.status(403).json({
        message: "Unauthorized access to this lead",
      });
    }

    return res.status(200).json({
      message: "Lead fetched successfully",
      data: lead,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
