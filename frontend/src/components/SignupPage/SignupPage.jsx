import React, { useState } from 'react';
import './SignupPage.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    
    if (!formData.firstName.trim()) {
      tempErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      tempErrors.lastName = "Last name is required";
    }
    
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      tempErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    
    if (formData.passwordpassword !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsSuccess(true);
        console.log("Form submitted successfully:", formData);
        
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      } catch (error) {
        console.error("Error submitting form:", error);
        setErrors({ form: "An error occurred. Please try again." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-wrapper">
        <h1 className="signup-title">Create an Account</h1>
        
        {isSuccess && (
          <div className="success-message">
            <p>Your account has been created successfully! You can now log in.</p>
          </div>
        )}
        
        {errors.form && (
          <div className="error-box">
            <p>{errors.form}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? 'input-error' : ''}
              placeholder="Enter your first name"
            />
            {errors.firstName && <span className="error-text">{errors.firstName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? 'input-error' : ''}
              placeholder="Enter your last name"
            />
            {errors.lastName && <span className="error-text">{errors.lastName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
              placeholder="Create a password"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
            <span className="password-hint">
              Password must be at least 8 characters with uppercase, lowercase, and number
            </span>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'input-error' : ''}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>
          
          <button 
            type="submit" 
            className={`signup-button ${isSubmitting ? 'button-disabled' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="login-link">
          Already have an account? <a href="#login">Log in</a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;