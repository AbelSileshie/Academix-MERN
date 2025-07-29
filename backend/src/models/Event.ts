import { Schema, model } from "mongoose";
import { embedText } from "../services/aiService";

const EventSchema = new Schema(
  {
    buildingRef: { type: Schema.Types.ObjectId, ref: "Building" },
    clubRef: { type: Schema.Types.ObjectId, ref: "Club" },
    startTime: { type: Date },
    endTime: { type: Date },
    description: { type: String },
    embedding: { type: [Number] },
  },
  { timestamps: true }
);

EventSchema.pre("save", async function () {
  this.embedding = await embedText(
    `Event starting at: ${this.startTime}, description: ${this.description}`
  );
});

export const Event = model("Event", EventSchema);
