import mongoose from "mongoose";
import { z } from "zod";
import { LEAD_STATUSES } from "../models/lead.model.js";

const objectId = z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
  message: "Invalid ID",
});

const optionalTrimmed = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value === "" ? undefined : value));

export const leadIdParamSchema = z.object({
  params: z.object({ id: objectId }),
});

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.email().trim().toLowerCase(),
    phone: optionalTrimmed,
    company: optionalTrimmed,
    service: z.string().trim().min(1, "Service is required"),
    source: z.string().trim().min(1).default("website"),
    message: optionalTrimmed,
  }),
});

export const listLeadsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    status: z.enum(LEAD_STATUSES).optional(),
    assignedTo: objectId.optional(),
  }),
});

export const updateStatusSchema = leadIdParamSchema.extend({
  body: z.object({ status: z.enum(LEAD_STATUSES) }),
});

export const assignLeadSchema = leadIdParamSchema.extend({
  body: z.object({ assignedTo: objectId }),
});

export const createNoteSchema = leadIdParamSchema.extend({
  body: z.object({ text: z.string().trim().min(1, "Note cannot be blank") }),
});
