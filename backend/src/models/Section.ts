import { Schema, model } from "mongoose";

const SectionSchema = new Schema(
  {
    name: { type: String, required: true },
    repRef: { type: Schema.Types.ObjectId, ref: "User" },
    year: { type: Number },
    departmentRef: { type: Schema.Types.ObjectId, ref: "Department" },
  },
  { timestamps: true }
);

export const Section = model("Section", SectionSchema);
