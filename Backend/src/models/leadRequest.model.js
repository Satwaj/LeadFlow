import mongoose from "mongoose";

const leadRequestSchema = new mongoose.Schema(
  {
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

leadRequestSchema.index({ lead: 1, requestedBy: 1 });
leadRequestSchema.index({ status: 1 });
leadRequestSchema.index({ createdAt: -1 });

const LeadRequest = mongoose.model("LeadRequest", leadRequestSchema);

export default LeadRequest;
