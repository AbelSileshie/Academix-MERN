import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { logger } from '../utils/logger';

// Schema for user registration
const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    role: z.enum(['student', 'admin', 'faculty']).optional(),
    studentId: z.string().optional(),
    employeeId: z.string().optional(),
    department: z.string().optional(),
    yearOfStudy: z.number().min(1).max(6).optional(),
    position: z.string().optional()
});

// Schema for user login
const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
});

// Schema for course creation
const courseSchema = z.object({
    name: z.string().min(1, 'Course name is required'),
    code: z.string().min(1, 'Course code is required'),
    description: z.string().optional(),
    credits: z.number().min(1, 'Credits must be at least 1'),
    department: z.string().min(1, 'Department is required'),
    prerequisites: z.array(z.string()).optional()
});

// Schema for post creation
const postSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    content: z.string().min(1, 'Content is required'),
    category: z.enum(['general', 'academic', 'events', 'clubs', 'announcements']).optional(),
    tags: z.array(z.string()).optional(),
    isAnonymous: z.boolean().optional()
});

// Validation middleware factory
const validate = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const result = schema.safeParse(req.body);
            
            if (!result.success) {
                const errors = result.error.issues.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                
                logger.warn('Validation failed:', errors);
                res.status(400).json({
                    error: 'Validation failed',
                    details: errors
                });
                return;
            }
            
            // Replace req.body with parsed data
            req.body = result.data;
            next();
        } catch (error) {
            logger.error('Validation error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};

// Specific validation middleware functions
export const validateUserInput = (req: Request, res: Response, next: NextFunction): void => {
    // Determine which schema to use based on the endpoint
    const path = req.path;
    
    if (path.includes('register')) {
        validate(registerSchema)(req, res, next);
    } else if (path.includes('login')) {
        validate(loginSchema)(req, res, next);
    } else {
        next();
    }
};

export const validateCourse = validate(courseSchema);
export const validatePost = validate(postSchema);

// Generic validation middleware
export const validateWith = (schema: z.ZodSchema) => validate(schema);

// Optional parameter validation
export const validateQuery = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const result = schema.safeParse(req.query);
            
            if (!result.success) {
                const errors = result.error.issues.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                
                res.status(400).json({
                    error: 'Query validation failed',
                    details: errors
                });
                return;
            }
            
            req.query = result.data as any;
            next();
        } catch (error) {
            logger.error('Query validation error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};
