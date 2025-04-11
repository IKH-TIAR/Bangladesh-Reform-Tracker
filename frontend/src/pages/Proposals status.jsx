// frontend/src/pages/AcceptedProposals.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Proposals.css';

const AcceptedProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [progressUpdate, setProgressUpdate] = useState({});

  useEffect(() => {
    fetchAcceptedProposals();
  }, []);

  const fetchAcceptedProposals = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/proposals/accepted');
      setProposals(res.data);
      
      // Initialize progress updates
      const updates = {};
      res.data.forEach(proposal => {
        updates[proposal._id] = {
          progress: proposal.progress,
          milestones: proposal.milestones.map(m => ({ ...m }))
        };
      });
      setProgressUpdate(updates);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching accepted proposals:', error);
      setLoading(false);
    }
  };

  const handleToggleEditMode = (id) => {
    setEditMode(editMode === id ? null : id);
  };

  const handleProgressChange = (id, value) => {
    setProgressUpdate({
      ...progressUpdate,
      [id]: {
        ...progressUpdate[id],
        progress: parseInt(value)
      }
    });
  };

  const handleMilestoneToggle = (proposalId, index) => {
    const updatedMilestones = [...progressUpdate[proposalId].milestones];
    updatedMilestones[index].completed = !updatedMilestones[index].completed;
    
    setProgressUpdate({
      ...progressUpdate,
      [proposalId]: {
        ...progressUpdate[proposalId],
        milestones: updatedMilestones
      }
    });
  };

  const handleSaveProgress = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/proposals/${id}`, {
        progress: progressUpdate[id].progress,
        milestones: progressUpdate[id].milestones
      });
      
      fetchAcceptedProposals(); // Refresh the list
      setEditMode(null);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return (
    <div className="proposals-container">
      <h2>Accepted Reform Proposals</h2>
      
      {loading ? (
        <div className="loading">Loading accepted proposals...</div>
      ) : proposals.length === 0 ? (
        <div className="no-proposals">No accepted proposals found</div>
      ) : (
        <div className="proposals-list">
          {proposals.map(proposal => (
            <div key={proposal._id} className="proposal-card accepted">
              <div className="proposal-header">
                <h3>{proposal.title}</h3>
                <div className="progress-container">
                  <div className="progress-label">
                    Progress: {editMode === proposal._id ? 
                      progressUpdate[proposal._id].progress : 
                      proposal.progress}%
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${editMode === proposal._id ? 
                        progressUpdate[proposal._id].progress : 
                        proposal.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="proposal-info">
                <p><strong>Submitted By:</strong> {proposal.submittedBy}</p>
                <p><strong>Accepted Date:</strong> {new Date(proposal.submissionDate).toLocaleDateString()}</p>
              </div>
              
              <div className="proposal-description">
                <p>{proposal.description}</p>
              </div>
              
              <div className="milestones-section">
                <h4>Milestones</h4>
                <ul className="milestones-list">
                  {proposal.milestones.map((milestone, index) => (
                    <li key={index} className={`milestone-item ${
                      editMode === proposal._id ? 
                        progressUpdate[proposal._id].milestones[index].completed ? 'completed' : '' :
                        milestone.completed ? 'completed' : ''
                    }`}>
                      {editMode === proposal._id ? (
                        <label className="milestone-checkbox">
                          <input 
                            type="checkbox"
                            checked={progressUpdate[proposal._id].milestones[index].completed}
                            onChange={() => handleMilestoneToggle(proposal._id, index)}
                          />
                          {milestone.title} (Due: {new Date(milestone.dueDate).toLocaleDateString()})
                        </label>
                      ) : (
                        <span>
                          {milestone.completed ? '✓ ' : '○ '}
                          {milestone.title} (Due: {new Date(milestone.dueDate).toLocaleDateString()})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="proposal-actions">
                {editMode === proposal._id ? (
                  <>
                    <div className="progress-edit">
                      <label htmlFor={`progress-${proposal._id}`}>Update Progress:</label>
                      <input 
                        type="range" 
                        id={`progress-${proposal._id}`}
                        min="0" 
                        max="100" 
                        value={progressUpdate[proposal._id].progress}
                        onChange={(e) => handleProgressChange(proposal._id, e.target.value)}
                      />
                      <span>{progressUpdate[proposal._id].progress}%</span>
                    </div>
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleSaveProgress(proposal._id)}
                    >
                      Save Updates
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setEditMode(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleToggleEditMode(proposal._id)}
                  >
                    Update Progress
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcceptedProposals;