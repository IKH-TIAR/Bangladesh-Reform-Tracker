import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './LoginForm.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we have a redirect path from state (from PublicReformCard)
  const redirectPath = location.state?.from || '/dashboard';
  const message = location.state?.message || '';

  const { email, password } = formData;

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data before submission
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Success response
        setSubmitMessage({
          type: 'success',
          text: 'Login successful! Redirecting...'
        });
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

        
        // Update auth context
        setUser(data);
        
        // Redirect to dashboard or requested reform page after short delay
        setTimeout(() => {
          navigate(redirectPath);
        }, 1000);
      } else {
        // Error response
        setSubmitMessage({
          type: 'error',
          text: data.message || 'Invalid credentials. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      setSubmitMessage({
        type: 'error',
        text: 'Server error. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        {/* Header */}
        <header className="app-header">
          <h1>Bangladesh Citizen Portal</h1>
          <p>National Registration System</p>
        </header>
        
        <div className="login-header">
          <h1>Citizen Login</h1>
        </div>
        
        {message && (
          <div className="message info">
            {message}
          </div>
        )}
        
        {submitMessage.text && (
          <div className={`message ${submitMessage.type}`}>
            {submitMessage.text}
          </div>
        )}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-step">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <div className="login-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" name="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot password?
              </Link>
            </div>
            
            <div className="form-buttons">
              <button 
                type="submit" 
                className="btn btn-success login-btn" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </div>
            
            <div className="signup-link">
              Don't have an account? <Link to="/signup">Register here</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;