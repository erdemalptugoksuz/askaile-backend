import mongoose, { Schema } from "mongoose";

const relationshipSchema = new mongoose.Schema(
  {
    startDate: { type: String, required: true },
    status: { type: String, required: true },
    partners: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
    dates: [{ type: Schema.Types.ObjectId, required: false, ref: "Date" }],
  },
  {
    timestamps: true,
  }
);

const Relationship = mongoose.model("Relationship", relationshipSchema);

export default Relationship;
