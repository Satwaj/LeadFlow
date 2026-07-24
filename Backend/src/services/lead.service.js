import mongoose from "mongoose";
import Activity from "../models/activity.model.js";
import Lead from "../models/lead.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

const ACTIVE_STATUSES = ["New", "Contacted", "Qualified", "Proposal"];

const actorId = (user) => user?.id || user?._id || null;

const populateLead = (query) =>
  query.populate("assignedTo", "name email role").populate("notes.author", "name email role");

const createActivity = (payload) => Activity.create(payload);

const ensureLeadAccess = async (leadId, user) => {
  const lead = await Lead.findById(leadId);

  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }

  if (user.role === "member") {
    const assignedTo = lead.assignedTo?.toString();
    const isAssignedToUser = assignedTo && assignedTo === user.id.toString();
    const isUnassignedActive = !assignedTo && ACTIVE_STATUSES.includes(lead.status);

    if (!isAssignedToUser && !isUnassignedActive) {
      throw new ApiError(403, "Forbidden");
    }
  }

  return lead;
};

const ensureLeadAssignment = async (leadId, user) => {
  const lead = await ensureLeadAccess(leadId, user);
  if (user.role === "member" && lead.assignedTo?.toString() !== user.id.toString()) {
    throw new ApiError(403, "You must be assigned to this lead to perform this action");
  }
  return lead;
};

export const createPublicLead = async (payload) => {
  const lead = await Lead.create({ ...payload, status: "New", assignedTo: null });

  await createActivity({
    lead: lead._id,
    action: "lead_created",
    performedBy: null,
    meta: {},
  });

  return {
    id: lead._id,
    name: lead.name,
    email: lead.email,
    service: lead.service,
    status: lead.status,
    createdAt: lead.createdAt,
  };
};

export const listLeads = async ({ page = 1, limit = 10, status, assignedTo, scope }, user) => {
  const filter = {};

  if (status) filter.status = status;

  if (user.role === "admin") {
    if (assignedTo) filter.assignedTo = assignedTo;
  } else {
    if (scope === "available") {
      filter.assignedTo = null;
      if (!status) filter.status = { $in: ACTIVE_STATUSES };
    } else if (scope === "assigned") {
      filter.assignedTo = user.id;
    } else {
      filter.$or = [
        { assignedTo: user.id },
        { assignedTo: null, status: { $in: ACTIVE_STATUSES } },
      ];
    }
  }

  const skip = (page - 1) * limit;
  const [leads, total] = await Promise.all([
    populateLead(Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)),
    Lead.countDocuments(filter),
  ]);

  return {
    leads,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getLeadById = async (leadId, user) => {
  await ensureLeadAccess(leadId, user);
  return populateLead(Lead.findById(leadId));
};

export const updateLeadStatus = async (leadId, status, user) => {
  const lead = await ensureLeadAssignment(leadId, user);
  const previousStatus = lead.status;

  lead.status = status;
  await lead.save();

  if (previousStatus !== status) {
    await createActivity({
      lead: lead._id,
      action: "status_changed",
      performedBy: actorId(user),
      meta: { from: previousStatus, to: status },
    });
  }

  return populateLead(Lead.findById(lead._id));
};

export const assignLead = async (leadId, assignedTo, user) => {
  const [lead, assignee] = await Promise.all([Lead.findById(leadId), User.findById(assignedTo)]);

  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }

  if (!assignee) {
    throw new ApiError(404, "Assigned user not found");
  }

  const previousAssignedTo = lead.assignedTo ? lead.assignedTo.toString() : null;
  lead.assignedTo = new mongoose.Types.ObjectId(assignedTo);
  await lead.save();

  await createActivity({
    lead: lead._id,
    action: "lead_assigned",
    performedBy: actorId(user),
    meta: {
      from: previousAssignedTo,
      to: assignedTo,
      assigneeName: assignee.name,
      performedByName: user?.name || "Admin",
    },
  });

  return populateLead(Lead.findById(lead._id));
};

export const addLeadNote = async (leadId, text, user) => {
  const lead = await ensureLeadAssignment(leadId, user);

  lead.notes.push({
    text,
    author: user.id,
    createdAt: new Date(),
  });

  await lead.save();

  await createActivity({
    lead: lead._id,
    action: "note_added",
    performedBy: actorId(user),
    meta: {},
  });

  return populateLead(Lead.findById(lead._id));
};

export const getLeadActivity = async (leadId, user) => {
  await ensureLeadAccess(leadId, user);
  return Activity.find({ lead: leadId }).sort({ createdAt: -1 }).populate("performedBy", "name email role");
};
