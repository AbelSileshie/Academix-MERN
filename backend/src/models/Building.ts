import { Schema, model } from "mongoose";
import { embedText } from "../services/aiService";

export interface IBuilding {
  name: string;
  blockNumber: number;
  type: string;
  description: string;
  embedding?: number[];
}

const BuildingSchema = new Schema<IBuilding>(
  {
    name: { type: String, required: true },
    blockNumber: { type: Number, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    embedding: { type: [Number] },
  },
  { timestamps: true }
);

BuildingSchema.pre("save", async function () {
  this.embedding = await embedText(
    `Building name: ${this.name}, Description: ${this.description}, block number: ${this.blockNumber}, type: ${this.type}`
  );
});

export const Building = model<IBuilding>("Building", BuildingSchema);
