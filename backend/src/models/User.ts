import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'student' | 'admin' | 'faculty';
    isActive: boolean;
    isVerified: boolean;
    isBanned: boolean;
    banReason?: string;
    bannedBy?: mongoose.Types.ObjectId;
    banExpires?: Date;
    warningCount: number;
    avatar?: string;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false // Don't include password in queries by default
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['student', 'admin', 'faculty'],
        default: 'student'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    banReason: {
        type: String,
        default: null
    },
    bannedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    banExpires: {
        type: Date,
        default: null
    },
    warningCount: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: null
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
    virtuals: true
});

export const User = mongoose.model<IUser>('User', userSchema);
