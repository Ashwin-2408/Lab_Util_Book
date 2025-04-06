import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setMessage({ text: 'Passwords do not match!', type: 'error' });
            return;
        }

        try {
            await axios.post('http://localhost:3001/auth/reset-password', {
                token,
                newPassword: password
            });

            setMessage({ text: 'Password reset successful!', type: 'success' });
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setMessage({ 
                text: error.response?.data?.message || 'Password reset failed!', 
                type: 'error' 
            });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-container">
                <h2 className="auth-title">Reset Your Password</h2>
                
                {message.text && (
                    <div className={`auth-message ${message.type === 'success' ? 'auth-message-success' : 'auth-message-error'}`}>
                        {message.text}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-inputs">
                        <div>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="auth-input auth-input-top"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="auth-input auth-input-bottom"
                            />
                        </div>
                    </div>
                    <button type="submit" className="auth-button">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;