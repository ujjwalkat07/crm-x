import { Auth, sanitizeAuthUser } from "./auth-model";
import {
  ApiResponse,
  ApiErrorHandling,
  HttpCodes,
  jwtVerifyRefreshToken,
  getAccessAndRefreshToken,
  jwtVerifyAccessToken,
  authCookieOptions,
  getAccessTokenFromRequest,
  getRefreshTokenFromRequest,
} from "../../../utils/utils-export";
import { Request, Response, RequestHandler } from "express";
import { AuthRequest } from "../../middleware/jwt-verify";

const userSignup = async (
  req: Request<
    {},
    {},
    { fullName: string; userName: string; password: string; email: string }
  >,
  res: Response,
) => {
  try {
    //checkpoints
    /* 
            access user details like username, email,etc...
            genrate an error if user misktakenly miss any one of the fields
            check if user already register or not if register kindly login
            create a new user
            again check if user registered or not 
            */
    const { fullName, password, email } = req.body;

    //check validation if an user is enter a value in field or not
    if (!email?.trim() || !password?.trim() || !fullName?.trim()) {
      throw new ApiErrorHandling(
        HttpCodes.BAD_REQUEST,
        "All fields are required",
      );
    }

    //check for existing user from DB
    const userExist = await Auth.findOne({ email });
    if (userExist) {
      throw new ApiErrorHandling(
        HttpCodes.BAD_REQUEST,
        "User with email or username already exists",
      );
    }

    //create a new user
    const user = await Auth.create({
      fullName,
      email,
      password,
    });

    const userCreated = await Auth.findPublicById(user._id);

    if (!userCreated) {
      throw new ApiErrorHandling(
        HttpCodes.BAD_REQUEST,
        "Something went wrong while registering the user",
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(200, userCreated, "User registered Successfully"));
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
          "Internal Server Error error",
        ),
      );
  }
};

const userLogin = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response,
) => {
  try {
    /*
       access login credential from user like email and password
       check if user register or not
       check the details with db
       return the token
       */

    //access login credential
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiErrorHandling(
        HttpCodes.BAD_REQUEST,
        "user credential required",
      );
    }

    //check if user register or not
    const user = await Auth.findOne({ email });
    if (!user) {
      throw new ApiErrorHandling(
        HttpCodes.BAD_REQUEST,
        "Invalid user credentials",
      );
    }

    // let userID = await User.findById(email);
    // Compare passwords (assuming password is stored as plain text, but in production use bcrypt to secure more with salt)
    const checkUserPasssowrd = await user.IsPasswordCorrect(password);

    if (!checkUserPasssowrd) {
      throw new ApiErrorHandling(
        HttpCodes.BAD_REQUEST,
        "Invalid user credentials",
      );
    }

    const { accessToken, refreshToken } = await getAccessAndRefreshToken(
      String(user._id),
    );
    // const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    //loggedInUser is optionally because we can also extract user details directly from stored jwt tokens

    // If you want to return a token, generate it here
    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...authCookieOptions,
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        maxAge: 84600 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        ...authCookieOptions,
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        maxAge: 84600 * 1000,
      })
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "user login successful",
        ),
      );
  } catch (error) {
    //we can check if error is instance of ApiError
    //we use oops concept to handle the error
    if (error instanceof ApiErrorHandling) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    } else {
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
  }
};

const userLogout = async (req: AuthRequest, res: Response) => {
  if (req.user?._id) {
    await Auth.clearRefreshToken(req.user._id);
  }

  interface IOptions {
    httpOnly: boolean;
    secure: boolean;
  }

  const options: IOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
};

//why we generate new both access and refresh token again
//to maintain the security for webapp we generate both access and refresh token,
//why we generate the refresh token again if its limit is 10d because with refresh token anyone can re-generate access token
const genrateNewAccessAndRefreshToken = async (req: Request, res: Response) => {
  //get refresh token from browser local storage
  //check if it valid or not
  //verify the token with jwt
  //check if stored token in DB and browser stored token are same or not
  //now generate new access token and refresh token to maintain the security for web app
  try {
    const localToken = getRefreshTokenFromRequest(req);
    if (!localToken) {
      throw new ApiErrorHandling(
        HttpCodes.BAD_REQUEST,
        "invaild token kindly check",
      );
    }

    const user = jwtVerifyRefreshToken(localToken);
    if (!user) {
      throw new ApiErrorHandling(
        HttpCodes.BAD_REQUEST,
        "invaild decoded token",
      );
    }

    const storedDBToken = await Auth.findById(user?.UserPayLoad._id);

    if (storedDBToken?.refreshToken !== localToken) {
      throw new ApiErrorHandling(
        HttpCodes.BAD_REQUEST,
        "something wrong with token",
      );
    }

    const { accessToken, refreshToken } = await getAccessAndRefreshToken(
      user.UserPayLoad._id,
    );
    //why we use this keyword because i am using the constructor to maintain the code readbility so, to access the method define in constructor with this keyword

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...authCookieOptions,
        maxAge: 60 * 60 * 24 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        ...authCookieOptions,
        maxAge: 60 * 60 * 24 * 10 * 1000,
      })
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "succesfull refresh tokens",
        ),
      );
  } catch (error) {
    if (error instanceof ApiErrorHandling) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    } else {
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
  }
};

const verifyJWTToken: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const token = getAccessTokenFromRequest(req);
console.log("token from cookie or header:", token);
    if (!token) {
      throw new ApiErrorHandling(400, "token invalid");
    }
    const decodedToken = jwtVerifyAccessToken(token);

    if (!decodedToken) {
      throw new ApiErrorHandling(HttpCodes.BAD_REQUEST, "Invalid Token");
    }

    const user = await Auth.findPublicById(decodedToken.UserPayLoad._id);

    if (!user) {
      throw new ApiErrorHandling(401, "Invalid Access Token");
    }

    res
      .status(HttpCodes.OK)
      .json(
        new ApiResponse(
          HttpCodes.OK,
          sanitizeAuthUser(user),
          "User verified successfully",
        ),
      );
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

export {
  userLogin,
  userSignup,
  userLogout,
  genrateNewAccessAndRefreshToken,
  verifyJWTToken,
};
