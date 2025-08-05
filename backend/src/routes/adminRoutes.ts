import express from 'express';
import { promoteToAdmin, banUser, unbanUser } from '../controllers/adminController';
import { authenticateToken } from '../middleware/auth';
import { requireRole } from '../middleware/role';

const router = express.Router();

/**
 * @swagger
 * /api/admin/promote:
 *   post:
 *     summary: Promote a user to admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID to promote
 *     responses:
 *       200:
 *         description: User promoted to admin
 *       400:
 *         description: User is already an admin
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.post('/promote', authenticateToken, requireRole('admin'), promoteToAdmin);

/**
 * @swagger
 * /api/admin/ban:
 *   post:
 *     summary: Ban a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - reason
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID to ban
 *               reason:
 *                 type: string
 *                 description: Reason for ban
 *               banExpires:
 *                 type: string
 *                 format: date-time
 *                 description: Ban expiration date (optional)
 *     responses:
 *       200:
 *         description: User banned
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.post('/ban', authenticateToken, requireRole('admin'), banUser);

/**
 * @swagger
 * /api/admin/unban:
 *   post:
 *     summary: Unban a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID to unban
 *     responses:
 *       200:
 *         description: User unbanned
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.post('/unban', authenticateToken, requireRole('admin'), unbanUser);

export default router;
