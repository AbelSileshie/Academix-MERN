import { Schema, model } from "mongoose";
import { embedText } from "../services/aiService";

export interface ICourse {
  name: string;
  departmentRefs: Schema.Types.ObjectId[];
  academicYear?: number;
  semester: number;
  creditHour: number;
  lectureHour: number;
  overview: string;
  embedding?: number[];
}

const CourseSchema = new Schema<ICourse>(
  {
    name: { type: String, required: true },
    departmentRefs: { type: [Schema.Types.ObjectId], ref: "Department" },
    academicYear: { type: Number },
    semester: { type: Number, required: true },
    creditHour: { type: Number, required: true },
    lectureHour: { type: Number, required: true },
    overview: { type: String, required: true },
    embedding: { type: [Number] },
  },
  { timestamps: true }
);

CourseSchema.pre("save", async function () {
  this.embedding = await embedText(
    `Course name: ${this.name}, overview: ${this.overview}`
  );
});

export const Course = model<ICourse>("Course", CourseSchema);
