import mongoose, { Schema } from "mongoose";

const dateSchema = new mongoose.Schema(
  {
    dateTime: { type: String, required: true },
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

const Date = mongoose.model("Date", dateSchema);

export default Date;
