import { Schema, model } from "mongoose";
import { embedText } from "../services/aiService";

const PostSchema = new Schema(
  {
    authorRef: { type: Schema.Types.ObjectId, ref: "User" },
    clubRef: { type: Schema.Types.ObjectId, ref: "Club" },
    sectionRef: { type: Schema.Types.ObjectId, ref: "Section" },
    courseRef: { type: Schema.Types.ObjectId, ref: "Course" },
    content: { type: String, default: "" },
    filePath: { type: String },
    embedding: { type: [Number] },
  },
  { timestamps: true }
);

PostSchema.pre("save", async function () {
  this.embedding = await embedText(
    `Post Author: ${this.authorRef}, content: ${this.content}`
  );
});
export const Post = model("Post", PostSchema);
