import jwt from 'jsonwebtoken';

interface JWTPayload {
    userId: string;
    role?: string;
    iat?: number;
    exp?: number;
}

export const generateToken = (userId: string, role?: string): string => {
    const payload: Record<string, any> = { userId };
    if (role) payload.role = role;
    
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

export const verifyToken = (token: string): JWTPayload | null => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    } catch (error) {
        return null;
    }
};

export const decodeToken = (token: string): JWTPayload | null => {
    try {
        return jwt.decode(token) as JWTPayload;
    } catch (error) {
        return null;
    }
};
