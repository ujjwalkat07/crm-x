import { Auth, sanitizeAuthUser } from "../services/auth-services/auth-model";
import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  ApiResponse,
  HttpCodes,
  jwtVerifyAccessToken,
  ApiErrorHandling,
  getAccessTokenFromRequest,
} from "../../utils/utils-export";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    fullname: string;
    email: string;
  };
}


const verifyJWT: RequestHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = getAccessTokenFromRequest(req);

    if (!token) {
      throw new ApiErrorHandling(400, "token invalid");
    }
    const decodedToken = jwtVerifyAccessToken(token);

    if (!decodedToken) {
      throw new ApiErrorHandling(HttpCodes.BAD_REQUEST, "Invalid Token");
    }

    const user = await Auth.findPublicById(decodedToken.UserPayLoad?._id);

    if (!user) {
      throw new ApiErrorHandling(401, "Invalid Access Token");
    }
    req.user = sanitizeAuthUser(user);

    next();
  } catch (error) {
    if (error instanceof ApiErrorHandling) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }

    return res
      .status(HttpCodes.INTERNAL_SERVER_ERROR)
      .json(
        new ApiResponse(
          HttpCodes.INTERNAL_SERVER_ERROR,
          null,
          "Internal Server Error",
        ),
      );
  }
};

export { verifyJWT };
