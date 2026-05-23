import { Router } from "express";
import {
  userLogin,
  userSignup,
  userLogout,
  genrateNewAccessAndRefreshToken,
  verifyJWTToken,
} from "./auth-controllers";
import { verifyJWT } from "../../middleware/jwt-verify";

const authRoutes: Router = Router();

authRoutes.post("/login", userLogin);
authRoutes.post("/signup", userSignup);
authRoutes.post("/logout", verifyJWT, userLogout);
authRoutes.post("/new-refresh-token", genrateNewAccessAndRefreshToken);

authRoutes.post("/verify-token", verifyJWTToken);

export { authRoutes };
