import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Access token required' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        
        // Find user by userId from the token
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            res.status(403).json({ error: 'Invalid token' });
            return;
        }
        
        req.user = user;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
};

export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
            const user = await User.findById(decoded.userId);
            req.user = user;
        } catch (error) {
            // Token is invalid, but continue without user
        }
    }
    
    next();
};
