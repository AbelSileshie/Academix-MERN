import { Schema, model } from "mongoose";

const NotificationSchema = new Schema(
  {
    toUserRef: { type: Schema.Types.ObjectId, ref: "User" },
    status: { type: Number },
    content: { type: String },
  },
  { timestamps: true }
);
export const Notification = model("Notification", NotificationSchema);
