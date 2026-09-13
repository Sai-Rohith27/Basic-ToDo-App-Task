import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';

/**
 * EXTEND EXPRESS REQUEST
 * Add userId property to request object
 */
declare global {
    namespace Express {
        interface Request {
            userId?: string;
            token?: string;
        }
    }
}

/**
 * VERIFY FIREBASE TOKEN MIDDLEWARE
 * Checks if request has valid Firebase token
 * Extracts userId from token
 * Attaches userId to request
 */
export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get token from Authorization header
        // Format: "Bearer TOKEN_HERE"
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                error: 'No token provided',
            });
            return;
        }

        // Extract token (remove "Bearer " prefix)
        const token = authHeader.substring(7);

        // Verify token with Firebase
        const decodedToken = await getAuth().verifyIdToken(token);

        // Attach userId to request
        req.userId = decodedToken.uid;
        req.token = token;

        // Continue to next middleware/route
        next();
    } catch (error) {
        console.error('Token verification error:', error);

        res.status(401).json({
            success: false,
            error: 'Invalid or expired token',
        });
    }
};

/**
 * OPTIONAL: Refresh token if expired
 */
export const refreshTokenIfNeeded = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get current user from Firebase
        const user = await getAuth().getUser(req.userId || '');

        // Token is valid, continue
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Token refresh failed',
        });
    }
};