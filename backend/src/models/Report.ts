import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
    post: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    reason: string;
}

const reportSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    reason: { type: String, required: true }
}, {
    timestamps: true
});

export default mongoose.model<IReport>('Report', reportSchema);
