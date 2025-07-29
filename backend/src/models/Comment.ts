import { Schema, model } from "mongoose";
import { embedText } from "../services/aiService";

const CommentSchema = new Schema(
  {
    content: { type: String, required: true },
    userRef: { type: Schema.Types.ObjectId, ref: "User" },
    postRef: { type: Schema.Types.ObjectId, ref: "Post" },
    embedding: { type: [Number] },
  },
  { timestamps: true }
);

CommentSchema.pre("save", async function () {
  this.embedding = await embedText(
    `User comment content: ${this.content}, made by: ${this.userRef}`
  );
});
export const Comment = model("Comment", CommentSchema);
