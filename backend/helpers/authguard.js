const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_TOKEN;

/**
 * Authentication middleware
 * Verifies JWT token and attaches user data to request
 */
const authGuard = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    // Check if authorization header exists and has Bearer token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false,
            message: 'Authorization token missing or invalid format' 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Attach user data to request object
        req.user = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role
        };
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: 'Token has expired. Please login again.' 
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token. Please login again.' 
            });
        }
        
        return res.status(401).json({ 
            success: false,
            message: 'Authentication failed',
            error: error.message 
        });
    }
};

module.exports = authGuard;
