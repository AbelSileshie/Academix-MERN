import { Schema, model } from "mongoose";
import { embedText } from "../services/aiService";

export interface IDepartment {
  headRef?: Schema.Types.ObjectId;
  name: string;
  overview: string;
  embedding?: number[];
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    headRef: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    overview: { type: String, required: true },
    embedding: { type: [Number] },
  },
  { timestamps: true }
);

DepartmentSchema.pre("save", async function () {
  this.embedding = await embedText(
    `Department name: ${this.name}, overview: ${this.overview}`
  );
});

export const Department = model<IDepartment>("Department", DepartmentSchema);
