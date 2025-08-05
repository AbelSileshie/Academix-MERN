import mongoose, { Schema, Document } from 'mongoose';

export interface IClub extends Document {
    name: string;
    overview: string;
    founder: Schema.Types.ObjectId;
    members: Schema.Types.ObjectId[];
}

const clubSchema = new Schema({
    name: { type: String, required: true },
    overview: { type: String },
    founder: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }]
}, {
    timestamps: true
});

export default mongoose.model<IClub>('Club', clubSchema);
