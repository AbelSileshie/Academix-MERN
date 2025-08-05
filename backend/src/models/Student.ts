import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    academicYear: number;
    department: Schema.Types.ObjectId;
    section: Schema.Types.ObjectId;
}

const studentSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    academicYear: { type: Number, required: true },
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    section: {
        type: Schema.Types.ObjectId,
        ref: 'Class'
    }
}, {
    timestamps: true
});

export default mongoose.model<IStudent>('Student', studentSchema);
