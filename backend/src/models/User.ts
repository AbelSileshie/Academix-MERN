import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  username: string;
  email: string;
  passwordHash: string;
  role: "student" | "instructor" | "admin";
  gender?: string;
  phoneNumber: string;
  telegram?: string;
  linkedin?: string;
  instagram?: string;
  studentRef?: Schema.Types.ObjectId;
  adminRef?: Schema.Types.ObjectId;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    gender: { type: String },
    phoneNumber: { type: String, required: true },
    telegram: { type: String },
    linkedin: { type: String },
    instagram: { type: String },
    studentRef: { type: Schema.Types.ObjectId, ref: "Student" },
    adminRef: { type: Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("passwordHash")) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
  next();
});

export const User = model<IUser>("User", UserSchema);
