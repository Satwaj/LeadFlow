import mongoose from "mongoose";

export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"];

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    service: { type: String, required: true, trim: true },
    source: { type: String, required: true, default: "website", trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: LEAD_STATUSES, default: "New" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    notes: [noteSchema],
  },
  { timestamps: true }
);

leadSchema.index({ status: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ createdAt: -1 });

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
