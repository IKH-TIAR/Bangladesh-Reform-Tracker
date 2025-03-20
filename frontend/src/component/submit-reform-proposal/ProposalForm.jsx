import React, { useState } from 'react';
import './ProposalForm.css';

const ProposalForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    targetCompletion: '',
    documents: []
  });
  
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.description.length < 50) newErrors.description = 'Description must be at least 50 characters';
    if (!formData.category) newErrors.category = 'Category is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Temporary frontend-only submission
    
    setErrors({});
    
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="form-container">
      <h2>Submit Reform Proposal</h2>
      {submitted && <div className="success-message">Proposal submitted successfully!</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            rows="5"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className={errors.description ? 'error' : ''}
          ></textarea>
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className={errors.category ? 'error' : ''}
            >
              <option value="">Select Category</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label>Target Completion Date</label>
            <input
              type="date"
              value={formData.targetCompletion}
              onChange={(e) => setFormData({...formData, targetCompletion: e.target.value})}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Supporting Documents (PDF/Images)</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFormData({...formData, documents: Array.from(e.target.files)})}
          />
          <div className="file-list">
            {formData.documents.map((file, index) => (
              <span key={index} className="file-item">
                {file.name}
              </span>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Submit Proposal
        </button>
      </form>
    </div>
  );
};

export default ProposalForm;
