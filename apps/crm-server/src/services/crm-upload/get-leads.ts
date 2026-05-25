import { Response } from "express";
import { AuthRequest } from "../../middleware/jwt-verify";
import { prisma } from "../../lib/prisma";

export const getAllLeads = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const leads = await prisma.lead.findMany({
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
