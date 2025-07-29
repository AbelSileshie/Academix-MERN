import { Schema, model } from "mongoose";

const LikeSchema = new Schema(
  {
    userRef: { type: Schema.Types.ObjectId, ref: "User" },
    postRef: { type: Schema.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true }
);

export const Like = model("Like", LikeSchema);
