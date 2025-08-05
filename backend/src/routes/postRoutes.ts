import express from 'express';
import {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost
} from '../controllers/postController';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = express.Router();

// Public routes (with optional auth for personalization)
router.get('/', optionalAuth, getPosts);
router.get('/:id', optionalAuth, getPostById);

// Protected routes
router.post('/', authenticateToken, createPost);
router.put('/:id', authenticateToken, updatePost);
router.delete('/:id', authenticateToken, deletePost);

export default router;
