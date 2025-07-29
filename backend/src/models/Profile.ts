import { Schema, model } from "mongoose";

export interface IProfile {
  userRef: Schema.Types.ObjectId;
  bio?: string;
  avatar?: string;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userRef: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bio: { type: String },
    avatar: { type: String },
  },
  { timestamps: true }
);

export const Profile = model<IProfile>("Profile", ProfileSchema);
