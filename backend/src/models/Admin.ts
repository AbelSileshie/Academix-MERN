import { Schema, model } from "mongoose";

export interface IAdmin {
  departmentRef: Schema.Types.ObjectId;
  groups: Schema.Types.ObjectId[];
  permissions: Schema.Types.ObjectId[];
}

const AdminSchema = new Schema<IAdmin>(
  {
    departmentRef: { type: Schema.Types.ObjectId, ref: "Department" },
    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
    permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
  },
  { timestamps: true }
);

export const Admin = model<IAdmin>("Admin", AdminSchema);
