import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.SUPABASE_JWT_SECRET;

    if (!jwtSecret) {
        console.error('SUPABASE_JWT_SECRET is not configured on the server');
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        // Supabase JWTs typically have user info in `sub` (which is the user ID)
        req.user = {
            id: decoded.sub,
            phone: decoded.phone,
            role: decoded.role
        };
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Optional auth middleware (doesn't fail if token is missing/invalid)
export const optionalAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.SUPABASE_JWT_SECRET;

    if (!jwtSecret) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = {
            id: decoded.sub,
            phone: decoded.phone,
            role: decoded.role
        };
    } catch (error) {
        // Just ignore error for optional auth
    }
    next();
};
