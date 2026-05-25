import { Response } from "express";
import { AuthRequest } from "../../middleware/jwt-verify";
import { prisma } from "../../lib/prisma";
import { CreateLeadBody } from "../../types/types";

export const updateLead = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params as { id: string };
    const leadData: Partial<CreateLeadBody> = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Lead ID is required",
      });
    }

    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existingLead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        customerName: leadData.customerName,
        email: leadData.email,
        phone: leadData.phone,
        company: leadData.company,
        status: leadData.status,
        priority: leadData.priority,
        tags: leadData.tags,
        notes: leadData.notes,
        lastContactDate: leadData.lastContactDate
          ? new Date(leadData.lastContactDate)
          : undefined,
        nextFollowUpDate: leadData.nextFollowUpDate
          ? new Date(leadData.nextFollowUpDate)
          : undefined,
        assignedToId: leadData.assignedToId || undefined,
      },
    });

    return res.status(200).json({
      message: "Lead updated successfully",
      data: updatedLead,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
