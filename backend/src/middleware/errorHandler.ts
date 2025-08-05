import { Request, Response, NextFunction } from 'express';

export const errorHandler = (error: any, _req: Request, res: Response, _next: NextFunction): void => {
    console.error(error.stack);
    
    // Mongoose validation error
    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err: any) => err.message);
        res.status(400).json({ error: 'Validation Error', details: errors });
        return;
    }
    
    // Mongoose duplicate key error
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        res.status(400).json({ error: `${field} already exists` });
        return;
    }
    
    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        res.status(401).json({ error: 'Invalid token' });
        return;
    }
    
    if (error.name === 'TokenExpiredError') {
        res.status(401).json({ error: 'Token expired' });
        return;
    }
    
    // Default error
    res.status(error.status || 500).json({
        error: error.message || 'Internal Server Error'
    });
};
