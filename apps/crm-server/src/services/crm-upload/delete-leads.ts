import { Response } from "express";
import { AuthRequest } from "../../middleware/jwt-verify";
import { prisma } from "../../lib/prisma";

export const deleteLead = async (
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

    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existingLead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    await prisma.lead.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Lead deleted successfully",
    });
  } catch (error: unknown) {
    console.error("DeleteLead Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
