export interface CreateLeadBody {
  customerName: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  source?: string;
  dealValue?: number;
  currency?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  tags?: string[];
  notes?: string;
  lastContactDate?: string | Date;
  nextFollowUpDate?: string | Date;
  assignedToId?: string;
}