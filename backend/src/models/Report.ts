import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  post: mongoose.Types.ObjectId;
  reportedBy: mongoose.Types.ObjectId;
  reportType: 'inappropriate' | 'spam' | 'harassment' | 'misinformation' | 'privacy_violation' | 'other';
  reason: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  adminNotes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  aiAnalysis?: {
    toxicityScore: number;
    categories: string[];
    recommendation: 'approve' | 'warn' | 'remove' | 'ban';
    confidence: number;
    flaggedContent: string[];
  };
  actionTaken?: 'none' | 'warning_sent' | 'post_removed' | 'user_banned';
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  reportedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportType: {
    type: String,
    enum: ['inappropriate', 'spam', 'harassment', 'misinformation', 'privacy_violation', 'other'],
    required: true
  },
  reason: {
    type: String,
    required: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'resolved', 'dismissed'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    maxlength: 1000
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  aiAnalysis: {
    toxicityScore: {
      type: Number,
      min: 0,
      max: 1
    },
    categories: [String],
    recommendation: {
      type: String,
      enum: ['approve', 'warn', 'remove', 'ban']
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    flaggedContent: [String]
  },
  actionTaken: {
    type: String,
    enum: ['none', 'warning_sent', 'post_removed', 'user_banned'],
    default: 'none'
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
reportSchema.index({ post: 1 });
reportSchema.index({ reportedBy: 1 });
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ reviewedBy: 1 });

export default mongoose.model<IReport>('Report', reportSchema);
