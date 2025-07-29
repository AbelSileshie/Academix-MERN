import { Schema, model } from "mongoose";

const ReportSchema = new Schema(
  {
    status: { type: Number },
    userRef: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postRef: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true }
);
export const Report = model("Report", ReportSchema);
