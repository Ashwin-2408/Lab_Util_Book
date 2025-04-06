import User from '../Schema/User.js';
import Auth from '../Schema/Auth.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { Op } from 'sequelize';  // Add this import

// Register a new user
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            name,
            email,
            role: role || 'Student'
        });

        // Create auth entry
        await Auth.create({
            user_id: user.user_id,
            password: hashedPassword
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({
            where: { email },
            include: [{
                model: Auth,
                attributes: ['password']
            }]
        });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.Auth.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Update last login
        await Auth.update(
            { last_login: new Date() },
            { where: { user_id: user.user_id } }
        );

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Get current user
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            attributes: { exclude: ['Auth.password'] },
            include: [Auth]
        });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

// Add these new controller functions
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        // Save reset token in Auth table
        await Auth.update({
            token: resetToken,
            token_expiry: resetTokenExpiry
        }, {
            where: { user_id: user.user_id }
        });

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Reset password URL
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="${resetUrl}">link</a> to reset your password</p>
                <p>This link will expire in 1 hour</p>
            `
        });

        res.json({ message: 'Password reset link sent to email' });
    } catch (error) {
        res.status(500).json({ message: 'Error in password reset', error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Validate inputs
        if (!token || !newPassword) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                token: !!token,
                password: !!newPassword
            });
        }

        // Log the received data (remove in production)
        console.log('Received token:', token);
        console.log('Password length:', newPassword.length);

        const auth = await Auth.findOne({
            where: {
                token: token,
                token_expiry: { [Op.gt]: new Date() }
            }
        });

        if (!auth) {
            return res.status(400).json({ 
                message: 'Invalid or expired reset token',
                tokenFound: false
            });
        }

        // Hash and update password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await Auth.update({
            password: hashedPassword,
            token: null,
            token_expiry: null
        }, {
            where: { auth_id: auth.auth_id }
        });

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ 
            message: 'Error resetting password', 
            error: error.message 
        });
    }
};

export { forgotPassword, resetPassword };

export { register, login, getCurrentUser };