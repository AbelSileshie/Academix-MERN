import { Schema, model } from "mongoose";

const RequestSchema = new Schema(
  {
    description: { type: String, required: true },
    studentRef: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postData: { type: Schema.Types.Mixed },
    clubData: { type: Schema.Types.Mixed },
    eventData: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);
export const Request = model("Request", RequestSchema);
