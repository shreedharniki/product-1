"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordController = exports.resetPasswordController = exports.forgotPassword = exports.logout = exports.login = void 0;
const auth_service_1 = require("../services/auth.service");
const mail_1 = require("../utils/mail");
const mjml_1 = __importDefault(require("mjml"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const login = async (req, res) => {
    const { login, password } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ua = req.headers['user-agent'];
    const result = await (0, auth_service_1.loginUser)(login, password, ip, ua);
    if (result.error === 'INVALID_CREDENTIALS')
        return res.status(401).json({ message: 'Invalid credentials' });
    if (result.error === 'ACCOUNT_DISABLED')
        return res.status(403).json({ message: 'Account disabled' });
    if (result.error)
        return res.status(400).json({ message: result.error });
    res.json(result);
};
exports.login = login;
const logout = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (token) {
        await (0, auth_service_1.logoutUser)(token);
    }
    res.json({ success: true });
};
exports.logout = logout;
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ message: 'Email required' });
    const result = await (0, auth_service_1.requestPasswordReset)(email);
    if (!result)
        return res.status(404).json({ message: 'User not found' });
    const link = `${process.env.CLIENT_URL}/reset-password?token=${result.token}`;
    const name = result.name;
    const templatePath = path_1.default.join(__dirname, '../templates/reset-password.mjml');
    if (fs_1.default.existsSync(templatePath)) {
        let content = fs_1.default.readFileSync(templatePath, 'utf8');
        content = content.replace(/{{name}}/g, name).replace(/{{resetLink}}/g, link);
        const { html } = (0, mjml_1.default)(content);
        await (0, mail_1.sendMail)({
            to: email,
            subject: 'Reset Your Password',
            html,
            text: `Hi ${name}, Reset Link: ${link}`
        });
    }
    res.json({ message: `Reset link sent to ${email}` });
};
exports.forgotPassword = forgotPassword;
const resetPasswordController = async (req, res) => {
    const { token, password } = req.body;
    const result = await (0, auth_service_1.resetPassword)(token, password);
    if (result.error === 'INVALID_TOKEN')
        return res.status(400).json({ message: 'Invalid or expired Link' });
    const { email, name } = result;
    const loginLink = `${process.env.CLIENT_URL}/login`;
    const templatePath = path_1.default.join(__dirname, '../templates/password-changed.mjml');
    if (fs_1.default.existsSync(templatePath)) {
        let content = fs_1.default.readFileSync(templatePath, 'utf8');
        content = content.replace(/{{name}}/g, name).replace(/{{loginLink}}/g, loginLink);
        const { html } = (0, mjml_1.default)(content);
        await (0, mail_1.sendMail)({
            to: email,
            subject: 'Password Changed Successfully',
            html,
            text: `Hi ${name}, Your password has been changed.`
        });
    }
    res.json({ message: 'Password updated successfully' });
};
exports.resetPasswordController = resetPasswordController;
const changePasswordController = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : null;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { oldPassword, newPassword } = req.body;
        //  basic validation
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                message: 'Old password and new password are required',
            });
        }
        const result = await (0, auth_service_1.changePassword)(token, oldPassword, newPassword);
        //  HANDLE ALL POSSIBLE ERRORS
        if (result.error === 'USER_NOT_FOUND') {
            return res.status(404).json({ message: 'User not found' });
        }
        if (result.error === 'INVALID_OLD_PASSWORD') {
            return res.status(400).json({
                message: 'Old password is incorrect',
            });
        }
        if (result.error === 'CHANGE_PASSWORD_FAILED') {
            return res.status(500).json({
                message: 'Something went wrong. Please try again',
            });
        }
        return res.json({
            message: 'Password changed successfully',
        });
    }
    catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};
exports.changePasswordController = changePasswordController;
