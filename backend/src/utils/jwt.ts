import jwt, { Secret, SignOptions } from 'jsonwebtoken';

interface JWTPayload {
    userId: string;
    role?: string;
    iat?: number;
    exp?: number;
}

export const generateToken = (userId: string, role?: string): string => {
    const payload: { userId: string; role?: string } = { userId };
    if (role) {
        payload.role = role;
    }
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    
    const options: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn']
    };
    
    return jwt.sign(payload, secret as Secret, options);
};

export const verifyToken = (token: string): JWTPayload | null => {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }
        return jwt.verify(token, secret as Secret) as JWTPayload;
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
