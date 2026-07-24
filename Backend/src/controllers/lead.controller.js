import {
  addLeadNote,
  assignLead,
  createPublicLead,
  getLeadActivity,
  getLeadById,
  listLeads,
  updateLeadStatus,
} from "../services/lead.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createLead = asyncHandler(async (req, res) => {
  const lead = await createPublicLead(req.body);
  res.status(201).json(new ApiResponse("Lead created successfully", { lead }));
});

export const getLeads = asyncHandler(async (req, res) => {
  const data = await listLeads(req.validated.query, req.user);
  res.status(200).json(new ApiResponse("Leads fetched successfully", data));
});

export const getLead = asyncHandler(async (req, res) => {
  const lead = await getLeadById(req.params.id, req.user);
  res.status(200).json(new ApiResponse("Lead fetched successfully", { lead }));
});

export const updateStatus = asyncHandler(async (req, res) => {
  const lead = await updateLeadStatus(req.params.id, req.body.status, req.user);
  res.status(200).json(new ApiResponse("Lead status updated successfully", { lead }));
});

export const assign = asyncHandler(async (req, res) => {
  const lead = await assignLead(req.params.id, req.body.assignedTo, req.user);
  res.status(200).json(new ApiResponse("Lead assigned successfully", { lead }));
});

export const addNote = asyncHandler(async (req, res) => {
  const lead = await addLeadNote(req.params.id, req.body.text, req.user);
  res.status(200).json(new ApiResponse("Note added successfully", { lead }));
});

export const activity = asyncHandler(async (req, res) => {
  const activities = await getLeadActivity(req.params.id, req.user);
  res.status(200).json(new ApiResponse("Lead activity fetched successfully", { activities }));
});
