import { Response } from "express";
import { AuthRequest } from "../../middleware/jwt-verify";
import { prisma } from "../../lib/prisma";
import { CreateLeadBody } from "../../types/types";

export const createLead = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;

    // Typed request body
    const leadData: CreateLeadBody = req.body;

    // Validation
    if (!leadData.customerName) {
      return res.status(400).json({
        message: "Customer name is required",
      });
    }

    const lead = await prisma.lead.create({
      data: {
        customerName: leadData.customerName,
        email: leadData.email,
        phone: leadData.phone,
        company: leadData.company,
        status: req.body.status,
        priority: leadData.priority || "MEDIUM",
        tags: leadData.tags || [],
        notes: leadData.notes,
        lastContactDate: leadData.lastContactDate
          ? new Date(leadData.lastContactDate)
          : null,

        nextFollowUpDate: leadData.nextFollowUpDate
          ? new Date(leadData.nextFollowUpDate)
          : null,

        assignedToId: userId,
      },
    });

    return res.status(201).json({
      message: "Lead created successfully",
      createdBy: userId,
      data: lead,
      lead
    });

  } catch (error: unknown) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};