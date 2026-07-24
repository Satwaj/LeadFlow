import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
    action: {
      type: String,
      enum: ["lead_created", "status_changed", "lead_assigned", "note_added", "lead_request_rejected"],
      required: true,
    },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

activitySchema.index({ lead: 1, createdAt: -1 });

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
