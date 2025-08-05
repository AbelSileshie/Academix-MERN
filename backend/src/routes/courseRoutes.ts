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

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department ID
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 6
 *         description: Filter by year
 *       - in: query
 *         name: semester
 *         schema:
 *           type: integer
 *           enum: [1, 2]
 *         description: Filter by semester
 *     responses:
 *       200:
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get('/', getCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 */
router.get('/:id', getCourseById);

/**
 * @swagger
 * /api/courses/{id}/enroll:
 *   post:
 *     summary: Enroll student in course (Student only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Successfully enrolled in course
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully enrolled in course
 *                 course:
 *                   $ref: '#/components/schemas/Course'
 *       400:
 *         description: Already enrolled or prerequisites not met
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Student access required
 */
router.post('/:id/enroll', authenticateToken, requireStudent, enrollStudent);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course (Admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - credits
 *               - department
 *             properties:
 *               name:
 *                 type: string
 *                 example: Introduction to Computer Science
 *               code:
 *                 type: string
 *                 example: CS101
 *               description:
 *                 type: string
 *                 example: Basic concepts of computer science and programming
 *               credits:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 6
 *                 example: 3
 *               department:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: []
 *               semester:
 *                 type: number
 *                 enum: [1, 2]
 *                 example: 1
 *               year:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 6
 *                 example: 1
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Validation errors
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/', authenticateToken, requireAdmin, createCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update course (Admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Introduction to Computer Science
 *               code:
 *                 type: string
 *                 example: CS101
 *               description:
 *                 type: string
 *                 example: Basic concepts of computer science and programming
 *               credits:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 6
 *                 example: 3
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: []
 *               semester:
 *                 type: number
 *                 enum: [1, 2]
 *                 example: 1
 *               year:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 6
 *                 example: 1
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Validation errors
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.put('/:id', authenticateToken, requireAdmin, updateCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete course (Admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Course deleted successfully
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete('/:id', authenticateToken, requireAdmin, deleteCourse);

export default router;
