import mongoose from "mongoose";
import Activity from "../models/activity.model.js";
import Lead from "../models/lead.model.js";
import LeadRequest from "../models/leadRequest.model.js";
import ApiError from "../utils/ApiError.js";

const ACTIVE_STATUSES = ["New", "Contacted", "Qualified", "Proposal"];

const populateRequest = (query) =>
  query
    .populate("lead", "name email company service status source createdAt assignedTo")
    .populate("requestedBy", "name email role")
    .populate("reviewedBy", "name email role");

export const createLeadRequest = async (leadId, user) => {
  const lead = await Lead.findById(leadId);

  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }

  if (lead.assignedTo) {
    throw new ApiError(400, "Lead is already assigned to a team member");
  }

  if (!ACTIVE_STATUSES.includes(lead.status)) {
    throw new ApiError(400, "Lead is not active and cannot be requested");
  }

  const existingPending = await LeadRequest.findOne({
    lead: leadId,
    requestedBy: user.id,
    status: "pending",
  });

  if (existingPending) {
    throw new ApiError(400, "You already have a pending request for this lead");
  }

  const request = await LeadRequest.create({
    lead: leadId,
    requestedBy: user.id,
    status: "pending",
  });

  return populateRequest(LeadRequest.findById(request._id));
};

export const listLeadRequests = async (user) => {
  if (user.role !== "admin") {
    throw new ApiError(403, "Forbidden");
  }

  // Admin lists requests, sorting pending first, then by date descending
  const requests = await populateRequest(
    LeadRequest.find().sort({ status: -1, createdAt: -1 })
  );

  return requests;
};

export const getMyLeadRequests = async (user) => {
  const requests = await populateRequest(
    LeadRequest.find({ requestedBy: user.id }).sort({ createdAt: -1 })
  );

  return requests;
};

export const approveLeadRequest = async (requestId, adminUser) => {
  if (adminUser.role !== "admin") {
    throw new ApiError(403, "Forbidden");
  }

  const request = await LeadRequest.findById(requestId);

  if (!request) {
    throw new ApiError(404, "Lead request not found");
  }

  if (request.status !== "pending") {
    throw new ApiError(400, `Lead request has already been ${request.status}`);
  }

  const lead = await Lead.findById(request.lead);

  if (!lead) {
    throw new ApiError(404, "Associated lead not found");
  }

  if (lead.assignedTo && lead.assignedTo.toString() !== request.requestedBy.toString()) {
    // If already assigned to someone else, reject this request safely
    request.status = "rejected";
    request.reviewedBy = adminUser.id;
    request.reviewedAt = new Date();
    await request.save();
    throw new ApiError(400, "Lead has already been assigned to another member");
  }

  const previousAssignedTo = lead.assignedTo ? lead.assignedTo.toString() : null;

  // 1. Assign lead to requesting member
  lead.assignedTo = new mongoose.Types.ObjectId(request.requestedBy);
  await lead.save();

  // 2. Approve this request
  request.status = "approved";
  request.reviewedBy = adminUser.id;
  request.reviewedAt = new Date();
  await request.save();

  // 3. Reject any other pending requests for the same lead
  await LeadRequest.updateMany(
    { lead: lead._id, _id: { $ne: request._id }, status: "pending" },
    { $set: { status: "rejected", reviewedBy: adminUser.id, reviewedAt: new Date() } }
  );

  // 4. Create Activity record
  await Activity.create({
    lead: lead._id,
    action: "lead_assigned",
    performedBy: adminUser.id,
    meta: { from: previousAssignedTo, to: request.requestedBy.toString(), approvedRequestId: request._id.toString() },
  });

  return populateRequest(LeadRequest.findById(request._id));
};

export const rejectLeadRequest = async (requestId, adminUser) => {
  if (adminUser.role !== "admin") {
    throw new ApiError(403, "Forbidden");
  }

  const request = await LeadRequest.findById(requestId);

  if (!request) {
    throw new ApiError(404, "Lead request not found");
  }

  if (request.status !== "pending") {
    throw new ApiError(400, `Lead request has already been ${request.status}`);
  }

  request.status = "rejected";
  request.reviewedBy = adminUser.id;
  request.reviewedAt = new Date();
  await request.save();

  await Activity.create({
    lead: request.lead,
    action: "lead_request_rejected",
    performedBy: adminUser.id,
    meta: { rejectedRequestId: request._id.toString(), requestedBy: request.requestedBy.toString() },
  });

  return populateRequest(LeadRequest.findById(request._id));
};
