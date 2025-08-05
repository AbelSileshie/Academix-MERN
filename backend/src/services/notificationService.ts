import Notification from '../models/Notification';
import { User } from '../models/User';
import emailService from './emailService';
import mongoose from 'mongoose';

interface NotificationData {
  postId?: mongoose.Types.ObjectId;
  adminId?: mongoose.Types.ObjectId;
  banReason?: string;
  banDuration?: Date;
  contactAdmin?: string;
}

class NotificationService {
  async createNotification(
    recipientId: mongoose.Types.ObjectId,
    type: 'account_warning' | 'account_banned' | 'post_removed' | 'admin_created' | 'general',
    title: string,
    message: string,
    data?: NotificationData
  ) {
    try {
      const notification = new Notification({
        recipient: recipientId,
        type,
        title,
        message,
        data
      });

      await notification.save();

      // Also send email notification for critical actions
      if (['account_banned', 'admin_created'].includes(type)) {
        await this.sendEmailNotification(recipientId, type, title, message, data);
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  private async sendEmailNotification(
    recipientId: mongoose.Types.ObjectId,
    type: string,
    title: string,
    message: string,
    data?: NotificationData
  ) {
    try {
      const user = await User.findById(recipientId);
      if (!user || !user.email) return;

      let emailSubject = title;
      let emailBody = message;

      if (type === 'account_banned') {
        emailSubject = `🚫 Account Suspended - ${title}`;
        emailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Account Suspended</h2>
            <p>Dear ${user.firstName} ${user.lastName},</p>
            
            <p>Your Academix account has been suspended due to policy violations.</p>
            
            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0;">
              <h3 style="color: #dc2626; margin-top: 0;">Suspension Details</h3>
              <p><strong>Reason:</strong> ${data?.banReason || 'Policy violation'}</p>
              ${data?.banDuration ? `<p><strong>Duration:</strong> Until ${data.banDuration.toDateString()}</p>` : '<p><strong>Duration:</strong> Permanent</p>'}
              ${data?.contactAdmin ? `<p><strong>Contact Admin:</strong> ${data.contactAdmin}</p>` : ''}
            </div>
            
            <p>If you believe this action was taken in error, please contact the designated administrator immediately.</p>
            
            <p>To appeal this decision or discuss the suspension, please reach out to our moderation team.</p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
            <p style="color: #6b7280; font-size: 14px;">
              This is an automated message from the Academix moderation system.
            </p>
          </div>
        `;
      } else if (type === 'admin_created') {
        emailSubject = `🔑 Admin Access Granted - Welcome to Academix Administration`;
        emailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">Administrator Access Granted</h2>
            <p>Dear ${user.firstName} ${user.lastName},</p>
            
            <p>You have been granted administrator privileges on the Academix platform.</p>
            
            <div style="background-color: #f0fdf4; border-left: 4px solid #059669; padding: 16px; margin: 20px 0;">
              <h3 style="color: #059669; margin-top: 0;">Admin Responsibilities</h3>
              <ul>
                <li>Monitor and moderate community posts</li>
                <li>Review reported content and user behavior</li>
                <li>Manage user accounts and permissions</li>
                <li>Oversee AI moderation decisions</li>
                <li>Handle appeals and user communications</li>
              </ul>
            </div>
            
            <p>Please log in to access your administrator dashboard and familiarize yourself with the moderation tools.</p>
            
            <p><strong>Important:</strong> Use your administrator privileges responsibly and in accordance with Academix community guidelines.</p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
            <p style="color: #6b7280; font-size: 14px;">
              This is an automated message from the Academix administration system.
            </p>
          </div>
        `;
      }

      await emailService.sendEmail(user.email, emailSubject, emailBody);
    } catch (error) {
      console.error('Error sending email notification:', error);
      // Don't throw error - notification should still be created even if email fails
    }
  }

  async sendAccountBanNotification(
    userId: mongoose.Types.ObjectId,
    banReason: string,
    bannedByAdmin: mongoose.Types.ObjectId,
    banExpires?: Date
  ) {
    const admin = await User.findById(bannedByAdmin);
    const adminContact = admin ? `${admin.firstName} ${admin.lastName} (${admin.email})` : 'Unknown Admin';

    return this.createNotification(
      userId,
      'account_banned',
      'Account Suspended',
      `Your account has been suspended${banExpires ? ` until ${banExpires.toDateString()}` : ' permanently'} due to policy violations. Contact the administrator for more information.`,
      {
        banReason,
        banDuration: banExpires,
        contactAdmin: adminContact,
        adminId: bannedByAdmin
      }
    );
  }

  async sendPostRemovedNotification(
    userId: mongoose.Types.ObjectId,
    postId: mongoose.Types.ObjectId,
    reason: string
  ) {
    return this.createNotification(
      userId,
      'post_removed',
      'Post Removed',
      `Your post has been removed due to: ${reason}. Please review our community guidelines.`,
      { postId }
    );
  }

  async sendWarningNotification(
    userId: mongoose.Types.ObjectId,
    reason: string,
    postId?: mongoose.Types.ObjectId
  ) {
    return this.createNotification(
      userId,
      'account_warning',
      'Community Guidelines Warning',
      `You have received a warning for: ${reason}. Please review our community guidelines to avoid further action.`,
      { postId }
    );
  }

  async sendAdminCreatedNotification(
    newAdminId: mongoose.Types.ObjectId,
    createdByAdminId: mongoose.Types.ObjectId
  ) {
    return this.createNotification(
      newAdminId,
      'admin_created',
      'Administrator Access Granted',
      'You have been granted administrator privileges. Please review your new responsibilities and access the admin dashboard.',
      { adminId: createdByAdminId }
    );
  }

  async getUserNotifications(
    userId: mongoose.Types.ObjectId,
    limit: number = 20,
    unreadOnly: boolean = false
  ) {
    const query: any = { recipient: userId };
    if (unreadOnly) {
      query.isRead = false;
    }

    return Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('data.adminId', 'firstName lastName email')
      .exec();
  }

  async markAsRead(notificationId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true }
    );
  }

  async markAllAsRead(userId: mongoose.Types.ObjectId) {
    return Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );
  }

  async deleteNotification(notificationId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) {
    return Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId
    });
  }
}

export default new NotificationService();
