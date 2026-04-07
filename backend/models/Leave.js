import mongoose from "mongoose"

const leaveSchema = new mongoose.Schema(
  {
    studentEmail: {
      type: String,
      required: true,
      trim: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    fromDate: {
      type: String,
      required: true,
    },
    toDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "staff_approved", "hod_approved", "rejected"],
    },
  },
  {
    timestamps: true,
  }
)

const Leave = mongoose.model("Leave", leaveSchema)

export default Leave
