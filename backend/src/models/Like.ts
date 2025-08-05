import mongoose, { Schema, Document } from 'mongoose';

export interface ILike extends Document {
    user: Schema.Types.ObjectId;
    post: Schema.Types.ObjectId;
}

const likeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
}, {
    timestamps: true
});

// Ensure a user can only like a post once
likeSchema.index({ user: 1, post: 1 }, { unique: true });

export default mongoose.model<ILike>('Like', likeSchema);
