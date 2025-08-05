import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    department: Schema.Types.ObjectId;
}

const adminSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department'
    }
}, {
    timestamps: true
});

export default mongoose.model<IAdmin>('Admin', adminSchema);
