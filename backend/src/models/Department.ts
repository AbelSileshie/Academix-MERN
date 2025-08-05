import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
    name: string;
    overview: string;
    head: Schema.Types.ObjectId;
}

const departmentSchema = new Schema({
    name: { type: String, required: true },
    overview: { type: String },
    head: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, {
    timestamps: true
});

export default mongoose.model<IDepartment>('Department', departmentSchema);
