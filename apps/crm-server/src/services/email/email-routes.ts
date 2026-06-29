import { Router } from "express";
import { aiGenerateEmail, sendEmail } from "./email-controller";
import { verifyJWT } from "../../middleware/jwt-verify";

const emailRoutes: Router = Router();

// Protect email routes with JWT auth
emailRoutes.use(verifyJWT);

emailRoutes.post("/ai-generate", aiGenerateEmail);
emailRoutes.post("/send", sendEmail);

export { emailRoutes };
