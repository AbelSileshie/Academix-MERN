import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
    building: Schema.Types.ObjectId;
    club: Schema.Types.ObjectId;
    startTime: Date;
    endTime: Date;
    description: string;
}

const eventSchema = new Schema({
    building: {
        type: Schema.Types.ObjectId,
        ref: 'Building'
    },
    club: {
        type: Schema.Types.ObjectId,
        ref: 'Club'
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    description: { type: String, required: true }
}, {
    timestamps: true
});

export default mongoose.model<IEvent>('Event', eventSchema);
