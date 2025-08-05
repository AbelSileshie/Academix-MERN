import express from 'express';
import {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = express.Router();

// Public routes
router.get('/', getStudents);
router.get('/:id', getStudentById);

// Protected routes (require authentication)
router.post('/', authenticateToken, requireAdmin, createStudent);
router.put('/:id', authenticateToken, updateStudent);
router.delete('/:id', authenticateToken, requireAdmin, deleteStudent);

export default router;
