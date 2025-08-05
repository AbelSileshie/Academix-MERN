import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }
    
    // Check if user is admin (assuming Admin model has been used)
    // You might need to add a role field or check the model type
    if (req.user.constructor.modelName !== 'Admin') {
        res.status(403).json({ error: 'Admin access required' });
        return;
    }
    
    next();
};

export const requireStudent = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }
    
    if (req.user.constructor.modelName !== 'Student') {
        res.status(403).json({ error: 'Student access required' });
        return;
    }
    
    next();
};

export const requireRole = (role: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        
        if (req.user.constructor.modelName.toLowerCase() !== role.toLowerCase()) {
            res.status(403).json({ error: `${role} access required` });
            return;
        }
        
        next();
    };
};
