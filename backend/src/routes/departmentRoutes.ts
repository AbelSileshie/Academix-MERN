import express from 'express';
import {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
} from '../controllers/departmentController';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = express.Router();

// Public routes
router.get('/', getDepartments);
router.get('/:id', getDepartmentById);

// Protected routes (admin only)
router.post('/', authenticateToken, requireAdmin, createDepartment);
router.put('/:id', authenticateToken, requireAdmin, updateDepartment);
router.delete('/:id', authenticateToken, requireAdmin, deleteDepartment);

export default router;
