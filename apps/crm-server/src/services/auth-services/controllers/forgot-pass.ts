import { Request, Response } from "express";
import { ApiErrorHandling, ApiResponse } from "../../../utils/utils-export";
import { prisma } from "../../../lib/prisma";

const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new ApiErrorHandling(404, "User not found");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    null,
                    "Password reset link sent successfully",
                ),
            );
    } catch (error: any) {
        const { statusCode = 500, message } = error;
        return res
            .status(statusCode)
            .json(
                new ApiResponse(
                    statusCode,
                    null,
                    message || "Internal Server Error",
                ),
            );
    }
};

const resetPassword = async (_req: Request, res: Response) => {
    try {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    null,
                    "Password reset link sent successfully",
                ),
            );
    } catch (error: any) {
        const { statusCode = 500, message } = error;
        return res
            .status(statusCode)
            .json(
                new ApiResponse(
                    statusCode,
                    null,
                    message || "Internal Server Error",
                ),
            );
    }
};


export { forgotPassword, resetPassword }