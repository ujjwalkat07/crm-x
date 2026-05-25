import { Router } from "express";
import { createLead } from "./create-leads";
import { updateLead } from "./update-leads";
import { deleteLead } from "./delete-leads";
import { getAllLeads, getLeadById } from "./get-leads";
import { verifyJWT } from "../../middleware/jwt-verify";

const leadRoutes: Router = Router();

// Apply auth middleware to protect all routes
leadRoutes.use(verifyJWT);

leadRoutes.post("/", createLead);
leadRoutes.get("/", getAllLeads);
leadRoutes.get("/:id", getLeadById);
leadRoutes.put("/:id", updateLead);
leadRoutes.delete("/:id", deleteLead);

export { leadRoutes };
