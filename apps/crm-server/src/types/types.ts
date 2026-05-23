
export interface CreateLeadBody {
  customerName: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: "Open" | "Closed" | "Lost" | "Active";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  tags?: string[];
  notes?: string;
  lastContactDate?: string | Date;
  nextFollowUpDate?: string | Date;
  assignedToId?: string;
}