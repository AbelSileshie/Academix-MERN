import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
    name: string;
    department: Schema.Types.ObjectId;
    year: number;
    semester: number;
    creditHours: number;
    lectureHours: number;
    overview: string;
    lecturers: Schema.Types.ObjectId[];
}

const courseSchema = new Schema({
    name: { type: String, required: true },
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    year: { type: Number, required: true },
    semester: { type: Number, required: true },
    creditHours: { type: Number, required: true },
    lectureHours: { type: Number, required: true },
    overview: { type: String },
    lecturers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

export default mongoose.model<ICourse>('Course', courseSchema);
