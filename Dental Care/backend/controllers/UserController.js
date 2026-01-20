const User = require("../models/UserModel.js")
const bcrpyt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const addUser = async (req, res) => {
    try{
        console.log("Register request received:", req.body);
        const { username, email, password, role }= req.body;
        if (!username || !email || !password){
            return res.status(400).json({
                success: false,
                message : "All fields are required"
            });
        }

        // Validate role if provided
        const validRoles = ['patient', 'dentist', 'admin'];
        const userRole = role && validRoles.includes(role) ? role : 'patient';

        const isUser = await User.findOne({ where: { username } });
        const isEmail = await User.findOne({ where: { email } });

        if (isUser ) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }
        if (isEmail ) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const hashed = await bcrpyt.hash(password,10);
        console.log("Password hashed successfully");

        const newUser = await User.create({
            username,
            email,
            password: hashed,
            role: userRole
        });

        res.status(201).json({
            success: true,
            message : "User registered successfully",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch(error){
        console.error("Error in addUser:", error);
        res.status(500).json({
            success: false,
            message: "Error adding user",
            error: error.message
        });
    }
};


const getAllUsers = async(req, res) => {
    try{
        const user = await User.findAll({attributes:{exclude:['password']}});
        return res.json({user,message: "User fetched successfully"})
    }catch(error){
        return res.status(500).json({
        message: "Error fetching users",
        error: error.message
    });
};

}


    
const getUsersById = async(req, res) => {
    try{
        const id = req.params.id;
        const user = await User.findByPk(id);
        if(!user){
            return res.json({message: "User not found"});
    }
    return res.json({
        user : {id: user.id, username: user.username},
        message: "User fetched successfully by id"})
    }catch(error){
        return res.status(500).json({
        message: "Error fetching users by id",
        error: error.message
    });
};
}

const getActiveUsers = async(req, res) => {
    res.json({message: "This is to get all users request"});
};

const updateUser = async(req, res) => {
    try{
        const { id } = req.params;
        const { username, email, password } = req.body; 
        const user = await User.findByPk(id);
        if(!user){
            return res.status(404).json({
                message: "User not found",
            });
        }
        if (username) {
            const isexistingUser = await User.findOne({ where: { username } });
            if (isexistingUser && isexistingUser.id !== user.id) {
                return res.status(400).json({ message: "Username already exists"});
            }
        let hashedPassword = user.password;
        if (password) {
            hashedPassword = await bcrpyt.hash(password,10);
        }
        await user.update({
            username: username || user.username,
            email: email || user.email,
            password: hashedPassword,
            });
            return res.status(200).json({
            message: "User updated successfully",
            user,
            });
    }
} 
    catch(error){
        return res.status(500).json({
            message: "Error updating user",
            error: error.message
        });
    }
}
 const deleteUser = async(req, res) => {
    try{
        const { id } = req.params.id;
        const user = await User.findByPk(id);
        if(!user){
            return res.status(404).json({
                message: "User not found",
            });
        }
        await user.destroy();
        return res.status(200).json({
            message: "User deleted successfully",
        });
    } catch(error){
        return res.status(500).json({
            message: "Error deleting user",
            error: error.message
        });

    }
}
const loginUser = async(req, res) => {
    try{
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({
                message: "All fields are required." });
        }

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password." });
        }

        const isPasswordValid = await bcrpyt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid username or password." });
        }

        

const token = jwt.sign(
            { id: user.id, role: user.role, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email,
                role: user.role 
            }
        });



    } catch (error) {
        res.status(500).json({
            message: "Error logging in user",
            error: error.message
        });
    }
};

const logoutUser = async(req, res) => {
    res.json({message: "This is to login user request"});
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found with this email"
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Save token to user (you'll need to add these fields to your User model)
        await user.update({
            resetToken: resetToken,
            resetTokenExpiry: resetTokenExpiry
        });

        // In production, send email with reset link
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
        
        // TODO: Send email with resetUrl
        console.log('Password reset link:', resetUrl);

        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email",
            // For development only - remove in production
            resetLink: resetUrl
        });

    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({
            success: false,
            message: "Error processing forgot password request",
            error: error.message
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Token and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const user = await User.findOne({ 
            where: { 
                resetToken: token
            } 
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }

        // Check if token is expired
        if (new Date() > new Date(user.resetTokenExpiry)) {
            return res.status(400).json({
                success: false,
                message: "Reset token has expired. Please request a new one."
            });
        }

        // Hash new password
        const hashedPassword = await bcrpyt.hash(newPassword, 10);

        // Update password and clear reset token
        await user.update({
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null
        });

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({
            success: false,
            message: "Error resetting password",
            error: error.message
        });
    }
};

  

module.exports={
    addUser, getActiveUsers,getAllUsers, getUsersById, updateUser, deleteUser, loginUser, logoutUser, forgotPassword, resetPassword    
}