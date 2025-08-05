import { Request, Response } from 'express';
import { User } from '../models/User';
import notificationService from '../services/notificationService';

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Promote a user to admin
export const promoteToAdmin = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ error: 'User is already an admin' });
    user.role = 'admin';
    await user.save();
    await notificationService.sendAdminCreatedNotification(user._id, (req.user as any)._id);
    return res.json({ message: 'User promoted to admin', user });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Ban a user
export const banUser = async (req: Request, res: Response) => {
  try {
    const { userId, reason, banExpires } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.isBanned = true;
    user.banReason = reason;
    user.bannedBy = req.user._id;
    user.banExpires = banExpires || null;
    await user.save();
    await notificationService.sendAccountBanNotification(user._id, reason, req.user._id, banExpires);
    return res.json({ message: 'User banned', user });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Unban a user
export const unbanUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.isBanned = false;
    user.banReason = undefined;
    user.bannedBy = undefined;
    user.banExpires = undefined;
    await user.save();
    return res.json({ message: 'User unbanned', user });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
