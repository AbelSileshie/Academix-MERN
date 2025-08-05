import mongoose, { Schema, Document } from 'mongoose';

export interface IBuilding extends Document {
    name: string;
    blockNumber: string;
    type: string;
    description: string;
}

const buildingSchema = new Schema({
    name: { type: String, required: true },
    blockNumber: { type: String },
    type: { type: String },
    description: { type: String }
}, {
    timestamps: true
});

export default mongoose.model<IBuilding>('Building', buildingSchema);
