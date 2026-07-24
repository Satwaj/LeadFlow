export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"];

export const STATUS_OPTIONS = [{ label: "All statuses", value: "" }, ...LEAD_STATUSES.map((status) => ({ label: status, value: status }))];

export const PUBLIC_SOURCES = ["website", "referral", "social", "email", "event", "other"];

export const SERVICE_OPTIONS = [
  "Web Development",
  "Landing Page",
  "Brand Strategy",
  "Marketing Automation",
  "CRM Setup",
  "Other",
];
