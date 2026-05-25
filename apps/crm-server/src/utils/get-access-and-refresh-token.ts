import { Auth } from "../services/auth-services/auth-model";
import { ApiErrorHandling } from "../utils/errors-handler/api-error-handling";
import { HttpCodes } from "../utils/http-codes";

const getAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await Auth.findById(userId);
    if (!user) {
      throw new ApiErrorHandling(HttpCodes.BAD_REQUEST, "User not found");
    }
    const accessToken = user.GenrateAccessToken();
    const refreshToken = user.GenrateRefreshToken();
    await Auth.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  } catch (error) {
    if (error instanceof ApiErrorHandling) {
      throw new ApiErrorHandling(error.statusCode, error.message);
    }
    throw new ApiErrorHandling(
      HttpCodes.INTERNAL_SERVER_ERROR,
      "Internal Server Error"
    );
  }
};

export { getAccessAndRefreshToken };
