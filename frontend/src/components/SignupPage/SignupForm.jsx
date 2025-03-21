// src/components/SignupForm.jsx
import React, { useState } from 'react';
import './SignupForm.css';

const SignupForm = () => {
  // Initial form state
  const initialFormState = {
    name: '',
    email: '',
    nid: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    division: '',
    district: '',
    address: '',
    password: '',
    confirmPassword: ''
  };

  // Form states
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  const [currentStep, setCurrentStep] = useState(1);

  // Bangladesh divisions and their districts
  const divisionDistricts = {
    'Dhaka': ['Dhaka', 'Gazipur', 'Narayanganj', 'Tangail', 'Narsingdi', 'Munshiganj', 'Manikganj', 'Faridpur', 'Madaripur', 'Shariatpur', 'Rajbari', 'Gopalganj', 'Kishoreganj'],
    'Chittagong': ['Chittagong', 'Cox\'s Bazar', 'Bandarban', 'Khagrachari', 'Rangamati', 'Comilla', 'Chandpur', 'Lakshmipur', 'Noakhali', 'Feni', 'Brahmanbaria'],
    'Rajshahi': ['Rajshahi', 'Chapainawabganj', 'Naogaon', 'Natore', 'Pabna', 'Sirajganj', 'Bogra', 'Joypurhat'],
    'Khulna': ['Khulna', 'Bagerhat', 'Satkhira', 'Jessore', 'Narail', 'Magura', 'Jhenaidah', 'Chuadanga', 'Kushtia', 'Meherpur'],
    'Barisal': ['Barisal', 'Pirojpur', 'Jhalokati', 'Bhola', 'Patuakhali', 'Barguna'],
    'Sylhet': ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
    'Rangpur': ['Rangpur', 'Dinajpur', 'Thakurgaon', 'Panchagarh', 'Nilphamari', 'Lalmonirhat', 'Kurigram', 'Gaibandha'],
    'Mymensingh': ['Mymensingh', 'Jamalpur', 'Sherpur', 'Netrokona']
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Handle division change to update district options
  const handleDivisionChange = (e) => {
    const division = e.target.value;
    setFormData({ 
      ...formData, 
      division, 
      district: '' // Reset district when division changes
    });
    
    if (errors.division) {
      setErrors({ ...errors, division: '' });
    }
  };

  // Validate form data
  const validateForm = (step) => {
    const newErrors = {};
    
    // Step 1 validation (Personal Information)
    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (formData.name.trim().length < 3) {
        newErrors.name = 'Name must be at least 3 characters';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Please provide a valid email';
      }
      
      if (!formData.nid.trim()) {
        newErrors.nid = 'National ID is required';
      } else if (!/^(\d{10}|\d{17})$/.test(formData.nid)) {
        newErrors.nid = 'NID must be either 10 or 17 digits';
      }

      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required';
      } else {
        const dob = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 18) {
          newErrors.dateOfBirth = 'You must be at least 18 years old to register';
        }
      }
      
      if (!formData.gender) {
        newErrors.gender = 'Please select your gender';
      }
    }
    
    // Step 2 validation (Contact Information)
    if (step === 2) {
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^(\+8801|01)[0-9]{9}$/.test(formData.phone)) {
        newErrors.phone = 'Please provide a valid Bangladesh phone number';
      }
      
      if (!formData.division) {
        newErrors.division = 'Please select your division';
      }
      
      if (!formData.district) {
        newErrors.district = 'Please select your district';
      }
      
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      } else if (formData.address.trim().length < 5) {
        newErrors.address = 'Address is too short';
      }
    }
    
    // Step 3 validation (Security Information)
    if (step === 3) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    return newErrors;
  };

  // Handle next step button
  const handleNextStep = () => {
    const stepErrors = validateForm(currentStep);
    
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(currentStep + 1);
    } else {
      setErrors(stepErrors);
    }
  };

  // Handle previous step button
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all form data before submission
    const stepErrors = validateForm(currentStep);
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });
    
    try {
      const response = await fetch('/api/users/signup', {
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
          text: data.message || 'Registration successful! Please check your email for verification.'
        });
        setFormData(initialFormState);
        setCurrentStep(1);
      } else {
        // Error response
        if (data.errors && Array.isArray(data.errors)) {
          // Handle validation errors from server
          const serverErrors = {};
          data.errors.forEach(err => {
            serverErrors[err.field] = err.message;
          });
          setErrors(serverErrors);
        } else {
          // General error message
          setSubmitMessage({
            type: 'error',
            text: data.message || 'Registration failed. Please try again.'
          });
        }
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setSubmitMessage({
        type: 'error',
        text: 'Server error. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render different form steps
  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-step">
            <h2>Personal Information</h2>
            
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="nid">National ID Number</label>
              <input
                type="text"
                id="nid"
                name="nid"
                value={formData.nid}
                onChange={handleChange}
                placeholder="Enter your 10 or 17 digit NID number"
                className={errors.nid ? 'error' : ''}
              />
              {errors.nid && <span className="error-message">{errors.nid}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={errors.dateOfBirth ? 'error' : ''}
              />
              {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
            </div>
            
            <div className="form-group">
              <label>Gender</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleChange}
                  />
                  Male
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleChange}
                  />
                  Female
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={formData.gender === 'other'}
                    onChange={handleChange}
                  />
                  Other
                </label>
              </div>
              {errors.gender && <span className="error-message">{errors.gender}</span>}
            </div>
            
            <div className="form-buttons">
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleNextStep}
              >
                Next
              </button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="form-step">
            <h2>Contact Information</h2>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number (e.g., 01XXXXXXXXX)"
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="division">Division</label>
              <select
                id="division"
                name="division"
                value={formData.division}
                onChange={handleDivisionChange}
                className={errors.division ? 'error' : ''}
              >
                <option value="">Select Division</option>
                {Object.keys(divisionDistricts).map(division => (
                  <option key={division} value={division}>{division}</option>
                ))}
              </select>
              {errors.division && <span className="error-message">{errors.division}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="district">District</label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                disabled={!formData.division}
                className={errors.district ? 'error' : ''}
              >
                <option value="">Select District</option>
                {formData.division && divisionDistricts[formData.division].map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              {errors.district && <span className="error-message">{errors.district}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Full Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your full address"
                rows="3"
                className={errors.address ? 'error' : ''}
              ></textarea>
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>
            
            <div className="form-buttons">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handlePrevStep}
              >
                Previous
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleNextStep}
              >
                Next
              </button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="form-step">
            <h2>Security Information</h2>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
            
            <div className="password-requirements">
              <h3>Password Requirements:</h3>
              <ul>
                <li>Minimum 8 characters</li>
                <li>At least one uppercase letter (A-Z)</li>
                <li>At least one lowercase letter (a-z)</li>
                <li>At least one number (0-9)</li>
                <li>At least one special character (!@#$%^&*)</li>
              </ul>
            </div>
            
            <div className="form-buttons">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handlePrevStep}
              >
                Previous
              </button>
              <button 
                type="submit" 
                className="btn btn-success" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Register'}
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <h1>Citizen Registration</h1>
        <div className="progress-indicator">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Personal</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Contact</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Security</div>
          </div>
        </div>
      </div>
      
      {submitMessage.text && (
        <div className={`message ${submitMessage.type}`}>
          {submitMessage.text}
        </div>
      )}
      
      <form className="signup-form" onSubmit={handleSubmit}>
        {renderFormStep()}
      </form>
    </div>
  );
};

export default SignupForm;