import React, { useState } from 'react';
import axios from 'axios';
import './AuthPage.css';

const AuthPage = () => {
  // State to track which form is active
  const [activeForm, setActiveForm] = useState('login');
  
  // Form input states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [forgotPasswordData, setForgotPasswordData] = useState({ email: '' });
  
  // Success/Error message states
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Updated form submission handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
        email: loginData.email,
        password: loginData.password
      });
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      setMessage({ text: 'Login successful!', type: 'success' });
      
      // Reset form
      setLoginData({ email: '', password: '' });
      
      // Redirect or handle successful login
      window.location.href = '/dashboard';
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Login failed!', 
        type: 'error' 
      });
    }
  };
  
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      setMessage({ text: 'Passwords do not match!', type: 'error' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/auth/register', {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        role: 'Student'
      });

    
      setMessage({ text: 'Account created successfully!', type: 'success' });
      // Reset form
      setSignupData({ name: '', email: '', password: '', confirmPassword: '' });
      // Redirect to login
      setActiveForm('login');
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Registration failed!', 
        type: 'error' 
      });
    }
  };
  
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      // Note: You'll need to implement this endpoint in your backend
      const response = await axios.post('http://localhost:3001/auth/forgot-password', {
        email: forgotPasswordData.email
      });
      
      setMessage({ text: 'Password reset link sent to your email!', type: 'success' });
      setForgotPasswordData({ email: '' });
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Failed to send reset link!', 
        type: 'error' 
      });
    }
  };
  
  // Input change handlers
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };
  
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };
  
  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData({ ...forgotPasswordData, [name]: value });
  };
  
  return (
    <div className="auth-container">
      <div className="auth-form-container">
        {/* Form Header */}
        <div className="auth-header">
          <h2 className="auth-title">
            {activeForm === 'login' && 'Sign in to your account'}
            {activeForm === 'signup' && 'Create a new account'}
            {activeForm === 'forgotPassword' && 'Reset your password'}
          </h2>
          <p className="auth-subtitle">
            {activeForm === 'login' && (
              <>
                Or{' '}
                <button 
                  onClick={() => setActiveForm('signup')}
                  className="auth-link"
                >
                  create a new account
                </button>
              </>
            )}
            {activeForm === 'signup' && (
              <>
                Already have an account?{' '}
                <button 
                  onClick={() => setActiveForm('login')}
                  className="auth-link"
                >
                  Sign in
                </button>
              </>
            )}
            {activeForm === 'forgotPassword' && (
              <>
                Remember your password?{' '}
                <button 
                  onClick={() => setActiveForm('login')}
                  className="auth-link"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
        
        {/* Status Message */}
        {message.text && (
          <div className={`auth-message ${message.type === 'success' ? 'auth-message-success' : 'auth-message-error'}`}>
            {message.text}
          </div>
        )}
        
        {/* Login Form */}
        {activeForm === 'login' && (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <div className="auth-inputs">
              <div>
                <label htmlFor="login-email" className="sr-only">Email address</label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="auth-input auth-input-top"
                  placeholder="Email address"
                  value={loginData.email}
                  onChange={handleLoginChange}
                />
              </div>
              <div>
                <label htmlFor="login-password" className="sr-only">Password</label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="auth-input auth-input-bottom"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                />
              </div>
            </div>

            <div className="auth-options">
              <div className="auth-remember">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="auth-checkbox"
                />
                <label htmlFor="remember-me" className="auth-checkbox-label">
                  Remember me
                </label>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setActiveForm('forgotPassword')}
                  className="auth-link"
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="auth-button"
              >
                Sign in
              </button>
            </div>
          </form>
        )}
        
        {/* Signup Form */}
        {activeForm === 'signup' && (
          <form className="auth-form" onSubmit={handleSignupSubmit}>
            <div className="auth-inputs">
              <div>
                <label htmlFor="signup-name" className="sr-only">Full name</label>
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="auth-input auth-input-top"
                  placeholder="Full name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                />
              </div>
              <div>
                <label htmlFor="signup-email" className="sr-only">Email address</label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="auth-input"
                  placeholder="Email address"
                  value={signupData.email}
                  onChange={handleSignupChange}
                />
              </div>
              <div>
                <label htmlFor="signup-password" className="sr-only">Password</label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="auth-input"
                  placeholder="Password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                />
              </div>
              <div>
                <label htmlFor="signup-confirm-password" className="sr-only">Confirm Password</label>
                <input
                  id="signup-confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="auth-input auth-input-bottom"
                  placeholder="Confirm password"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="auth-button"
              >
                Create account
              </button>
            </div>
          </form>
        )}
        
        {/* Forgot Password Form */}
        {activeForm === 'forgotPassword' && (
          <form className="auth-form" onSubmit={handleForgotPasswordSubmit}>
            <div className="auth-inputs">
              <div>
                <label htmlFor="forgot-email" className="sr-only">Email address</label>
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="auth-input auth-input-single"
                  placeholder="Email address"
                  value={forgotPasswordData.email}
                  onChange={handleForgotPasswordChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="auth-button"
              >
                Send reset link
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;