import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
    author: Schema.Types.ObjectId;
    post: Schema.Types.ObjectId;
    content: string;
}

const commentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    content: { type: String, required: true }
}, {
    timestamps: true
});

export default mongoose.model<IComment>('Comment', commentSchema);
