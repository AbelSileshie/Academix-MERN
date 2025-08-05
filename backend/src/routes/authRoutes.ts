import express from 'express';
import { register, login, logout, refreshToken } from '../controllers/authController';
import { validateUserInput } from '../middleware/validate';

const router = express.Router();

// Authentication routes
router.post('/register', validateUserInput, register);
router.post('/login', validateUserInput, login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

export default router;
