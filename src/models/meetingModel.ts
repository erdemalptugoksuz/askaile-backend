import mongoose, { Schema } from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    meetingTime: { type: String, required: true },
    place: { type: String, required: false },
    description: { type: String, required: false },
    budget: { type: Number, required: false },
    budgetCurrency: { type: String, required: false },
    relationship: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Relationship",
    },
  },
  {
    timestamps: true,
  }
);

const Meeting = mongoose.model("Meeting", meetingSchema);

export default Meeting;
