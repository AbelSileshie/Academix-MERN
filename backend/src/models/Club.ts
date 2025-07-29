import { Schema, model } from "mongoose";
import { embedText } from "../services/aiService";

const ClubSchema = new Schema(
  {
    name: { type: String, required: true },
    overview: { type: String, required: true },
    founderRef: { type: Schema.Types.ObjectId, ref: "User" },
    memberRefs: [{ type: Schema.Types.ObjectId, ref: "User" }],
    embedding: { type: [Number] },
  },
  { timestamps: true }
);

ClubSchema.pre("save", async function () {
  this.embedding = await embedText(
    `Club named: ${this.name}, overview: ${this.overview}`
  );
});

export const Club = model("Club", ClubSchema);
