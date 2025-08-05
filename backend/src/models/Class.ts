import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
    name: string;
    representative: Schema.Types.ObjectId;
    students: Schema.Types.ObjectId[];
}

const classSchema = new Schema({
    name: { type: String, required: true },
    representative: {
        type: Schema.Types.ObjectId,
        ref: 'Student'
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }]
}, {
    timestamps: true
});

export default mongoose.model<IClass>('Class', classSchema);
