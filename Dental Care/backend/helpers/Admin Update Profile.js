const User = require("../models/UserModel.js");
const bcrypt = require("bcrypt");

/**
 * Admin Update Profile
 * Allows admin users to update their own profile information
 */
const adminUpdateProfile = async (req, res) => {
    try {
        // Get admin ID from authenticated user (from JWT token)
        const adminId = req.user.id;
        const { username, email, currentPassword, newPassword } = req.body;

        // Verify user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        // Find the admin user
        const admin = await User.findByPk(adminId);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin user not found"
            });
        }

        // Check if username is being changed and if it's already taken
        if (username && username !== admin.username) {
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Username already exists"
                });
            }
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== admin.email) {
            const existingEmail = await User.findOne({ where: { email } });
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: "Email already exists"
                });
            }
        }

        // Handle password update
        let updatedPassword = admin.password;
        if (newPassword) {
            // Verify current password before allowing change
            if (!currentPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Current password is required to set a new password"
                });
            }

            const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
            if (!isPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: "Current password is incorrect"
                });
            }

            // Validate new password strength
            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "New password must be at least 6 characters long"
                });
            }

            // Hash the new password
            updatedPassword = await bcrypt.hash(newPassword, 10);
        }

        // Update admin profile
        await admin.update({
            username: username || admin.username,
            email: email || admin.email,
            password: updatedPassword
        });

        // Return updated admin info (excluding password)
        return res.status(200).json({
            success: true,
            message: "Admin profile updated successfully",
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        console.error("Error in adminUpdateProfile:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating admin profile",
            error: error.message
        });
    }
};

/**
 * Get Admin Profile
 * Retrieve current admin user's profile information
 */
const getAdminProfile = async (req, res) => {
    try {
        const adminId = req.user.id;

        // Verify user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        const admin = await User.findByPk(adminId, {
            attributes: { exclude: ['password'] }
        });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin user not found"
            });
        }

        return res.status(200).json({
            success: true,
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
                createdAt: admin.createdAt,
                updatedAt: admin.updatedAt
            }
        });

    } catch (error) {
        console.error("Error in getAdminProfile:", error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving admin profile",
            error: error.message
        });
    }
};

module.exports = {
    adminUpdateProfile,
    getAdminProfile
};
