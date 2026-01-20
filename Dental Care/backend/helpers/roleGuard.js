/**
 * Role-based authorization middleware
 * Ensures user has the required role to access the route
 * Must be used after authGuard middleware
 */

const roleGuard = (...allowedRoles) => {
    return (req, res, next) => {
        // Check if user was authenticated by authGuard
        if (!req.user) {
            return res.status(401).json({ 
                success: false,
                message: 'Authentication required' 
            });
        }

        // Check if user's role is in the allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false,
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}` 
            });
        }

        // User has required role, proceed to next middleware
        next();
    };
};

module.exports = roleGuard;
