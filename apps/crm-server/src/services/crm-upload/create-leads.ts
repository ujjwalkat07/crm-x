import { Response } from "express";
import { AuthRequest } from "../../middleware/jwt-verify";
import {getPrisma} from "../../lib/prisma";

export const createLead = async (req: AuthRequest, res: Response) => {
  try {
    const prisma = getPrisma();
    

    const leadData = req.body;
    const lead = await prisma.lead.create({
      data: {
        customerName: leadData.customerName,
        email: leadData.email,
        phone: leadData.phone,
        company: leadData.company,
        jobTitle: leadData.jobTitle,
        source: leadData.source,
        status: leadData.status || "NEW",
        dealValue: leadData.dealValue,
        currency: leadData.currency || "USD",
        priority: leadData.priority || "MEDIUM",
        tags: leadData.tags || [],
        notes: leadData.notes,
        lastContactDate: leadData.lastContactDate,
        nextFollowUpDate: leadData.nextFollowUpDate,
        assignedToId: leadData.assignedToId,
      }
    });

    return res.status(201).json(lead);
  } catch (error: any) {
    console.error("CreateLead Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};