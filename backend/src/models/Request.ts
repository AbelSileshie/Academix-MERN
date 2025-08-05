import mongoose, { Schema, Document } from 'mongoose';

export interface IRequest extends Document {
    student: Schema.Types.ObjectId;
    description: string;
    post?: Schema.Types.ObjectId;
    status: 'pending' | 'approved' | 'rejected';
}

const requestSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    description: { type: String, required: true },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

export default mongoose.model<IRequest>('Request', requestSchema);
