// src/components/ProgressUpdate/ProgressUpdate.jsx
import { useState, useEffect } from 'react';
import { FiActivity, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import './ProgressUpdate.css';

const ProgressUpdate = () => {
  const [proposals, setProposals] = useState([
    { id: 1, title: 'Education Reform 2024', progress: 45, status: 'In Progress' },
    { id: 2, title: 'Healthcare Infrastructure', progress: 20, status: 'Draft' },
  ]);

  const [formData, setFormData] = useState({
    proposalId: '',
    progress: '',
    description: '',
  });

  const [statusMessage, setStatusMessage] = useState({
    type: '',
    text: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.proposalId || !formData.progress) {
      setStatusMessage({
        type: 'error',
        text: 'Please fill all required fields',
      });
      return;
    }

    setProposals(prev => prev.map(proposal => {
      if (proposal.id === parseInt(formData.proposalId)) {
        return {
          ...proposal,
          progress: parseInt(formData.progress),
          status: formData.progress === '100' ? 'Completed' : 'In Progress',
        };
      }
      return proposal;
    }));

    setStatusMessage({
      type: 'success',
      text: 'Progress updated successfully',
    });

    setFormData({ proposalId: '', progress: '', description: '' });
  };

  useEffect(() => {
    if (statusMessage.text) {
      const timer = setTimeout(() => {
        setStatusMessage({ type: '', text: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  return (
    <div className="progress-update-container">
      <div className="progress-card">
        <div className="card-header">
          <FiActivity className="header-icon" />
          <h2>Update Reform Progress</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Proposal</label>
            <select
              value={formData.proposalId}
              onChange={(e) => setFormData({...formData, proposalId: e.target.value})}
              required
            >
              <option value="">Choose a proposal</option>
              {proposals.map(proposal => (
                <option key={proposal.id} value={proposal.id}>
                  {proposal.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Progress Percentage</label>
              <div className="progress-input">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({...formData, progress: e.target.value})}
                  required
                />
                <span>%</span>
              </div>
            </div>

            <div className="form-group">
              <label>Status</label>
              <div className="status-indicator">
                {formData.proposalId ? (
                  proposals.find(p => p.id === parseInt(formData.proposalId)).status
                ) : 'N/A'}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Update Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Add detailed update..."
            />
          </div>

          <button type="submit" className="update-button">
            <FiCheckCircle /> Save Update
          </button>
        </form>

        {statusMessage.text && (
          <div className={`status-message ${statusMessage.type}`}>
            {statusMessage.type === 'error' ? <FiAlertCircle /> : <FiCheckCircle />}
            {statusMessage.text}
          </div>
        )}
      </div>

      <div className="progress-list">
        <h3>Active Proposals</h3>
        <table>
          <thead>
            <tr>
              <th>Proposal</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map(proposal => (
              <tr key={proposal.id}>
                <td>{proposal.title}</td>
                <td>
                  <div className="progress-bar">
                    <div style={{ width: `${proposal.progress}%` }}></div>
                    <span>{proposal.progress}%</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${proposal.status.replace(' ', '-')}`}>
                    {proposal.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgressUpdate;
