import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  type: 'account_warning' | 'account_banned' | 'post_removed' | 'admin_created' | 'general';
  title: string;
  message: string;
  data?: {
    postId?: mongoose.Types.ObjectId;
    adminId?: mongoose.Types.ObjectId;
    banReason?: string;
    banDuration?: Date;
    contactAdmin?: string;
  };
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['account_warning', 'account_banned', 'post_removed', 'admin_created', 'general'],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  data: {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    banReason: String,
    banDuration: Date,
    contactAdmin: String
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

export default mongoose.model<INotification>('Notification', notificationSchema);
