import express from 'express';
import {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    enrollStudent
} from '../controllers/courseController';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin, requireStudent } from '../middleware/roleMiddleware';

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Student routes
router.post('/:id/enroll', authenticateToken, requireStudent, enrollStudent);

// Admin routes
router.post('/', authenticateToken, requireAdmin, createCourse);
router.put('/:id', authenticateToken, requireAdmin, updateCourse);
router.delete('/:id', authenticateToken, requireAdmin, deleteCourse);

export default router;
