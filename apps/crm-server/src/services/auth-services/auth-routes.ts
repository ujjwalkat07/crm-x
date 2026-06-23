import { Router } from "express";
import {
  userLogin,
  userSignup,
  userLogout,
  genrateNewAccessAndRefreshToken,
  verifyJWTToken,
  updateProfileController,
} from "../auth-services/auth-controllers";
import { forgotPassword } from "./controllers/forgot-pass";
import { verifyJWT } from "../../middleware/jwt-verify";

const authRoutes: Router = Router();

authRoutes.post("/login", userLogin);
authRoutes.post("/signup", userSignup);
authRoutes.post("/logout", verifyJWT, userLogout);
authRoutes.post("/new-refresh-token", genrateNewAccessAndRefreshToken);
authRoutes.post("/forgot-password", forgotPassword);

authRoutes.post("/verify-token", verifyJWTToken);
authRoutes.put("/profile", verifyJWT, updateProfileController);

export { authRoutes };


