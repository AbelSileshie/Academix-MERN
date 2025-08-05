import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    author: Schema.Types.ObjectId;
    club?: Schema.Types.ObjectId;
    class?: Schema.Types.ObjectId;
    course?: Schema.Types.ObjectId;
    content: string;
    comments: {
        user: Schema.Types.ObjectId;
        content: string;
        createdAt: Date;
    }[];
    likes: Schema.Types.ObjectId[];
    createdAt: Date;
}

const postSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    club: {
        type: Schema.Types.ObjectId,
        ref: 'Club'
    },
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class'
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course'
    },
    content: { type: String, required: true },
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        content: { type: String, required: true },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }]
}, {
    timestamps: true
});

export default mongoose.model<IPost>('Post', postSchema);
