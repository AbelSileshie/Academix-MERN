import { Schema, model } from "mongoose";

export interface IStudent {
  studentId: string;
  academicYear?: number;
  isRep: boolean;
  sectionRef?: Schema.Types.ObjectId;
  departmentRef?: Schema.Types.ObjectId;
  groups: Schema.Types.ObjectId[];
  permissions: Schema.Types.ObjectId[];
}

const StudentSchema = new Schema<IStudent>(
  {
    studentId: { type: String, required: true },
    academicYear: { type: Number },
    isRep: { type: Boolean, default: false },
    sectionRef: { type: Schema.Types.ObjectId, ref: "Section" },
    departmentRef: { type: Schema.Types.ObjectId, ref: "Department" },
    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
    permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
  },
  { timestamps: true }
);

export const Student = model<IStudent>("Student", StudentSchema);
