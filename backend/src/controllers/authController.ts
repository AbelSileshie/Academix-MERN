import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import Student from '../models/Student';
import Admin from '../models/Admin';
import { generateToken, verifyToken } from '../utils/jwt';
import { logger } from '../utils/logger';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, firstName, lastName, studentId, role = 'student' } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const userData = {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role
        };

        const user = new User(userData);
        await user.save();

        // Create profile based on role
        if (role === 'student') {
            const student = new Student({
                user: user._id,
                studentId: studentId || `STU${Date.now()}`,
                department: req.body.department,
                yearOfStudy: req.body.yearOfStudy || 1,
                gpa: 0,
                credits: 0
            });
            await student.save();
        } else if (role === 'admin') {
            const admin = new Admin({
                user: user._id,
                employeeId: req.body.employeeId || `EMP${Date.now()}`,
                department: req.body.department,
                position: req.body.position || 'Administrator'
            });
            await admin.save();
        }

        // Generate token
        const token = generateToken(user._id.toString(), user.role);

        logger.info(`User registered: ${email}`);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            },
            token
        });
    } catch (error) {
        logger.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id.toString(), user.role);

        logger.info(`User logged in: ${email}`);

        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            },
            token
        });
    } catch (error) {
        logger.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
    try {
        // In a stateless JWT system, logout is handled client-side
        // However, we can log the action for audit purposes
        logger.info('User logged out');
        
        res.json({ message: 'Logout successful' });
    } catch (error) {
        logger.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.body;

        if (!token) {
            res.status(401).json({ error: 'Token required' });
            return;
        }

        // Verify token
        const decoded = verifyToken(token);
        if (!decoded) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }

        // Find user
        const user = await User.findById(decoded.userId);
        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        // Generate new token
        const newToken = generateToken(user._id.toString(), user.role);

        res.json({
            message: 'Token refreshed successfully',
            token: newToken
        });
    } catch (error) {
        logger.error('Token refresh error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
