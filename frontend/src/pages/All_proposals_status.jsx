// frontend/src/pages/AllProposals.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Proposals.css';

const AllProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/proposals');
      setProposals(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this proposal?')) {
      try {
        await axios.delete(`http://localhost:5000/api/proposals/${id}`);
        fetchProposals(); // Refresh the list
      } catch (error) {
        console.error('Error deleting proposal:', error);
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/proposals/${id}`, { status });
      fetchProposals(); // Refresh the list
    } catch (error) {
      console.error('Error updating proposal status:', error);
    }
  };

  const filteredProposals = filter === 'all' 
    ? proposals 
    : proposals.filter(proposal => proposal.status === filter);

  return (
    <div className="proposals-container">
      <h2>All Submitted Proposals</h2>
      
      <div className="filter-controls">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`filter-btn ${filter === 'accepted' ? 'active' : ''}`}
          onClick={() => setFilter('accepted')}
        >
          Accepted
        </button>
        <button 
          className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </button>
      </div>
      
      {loading ? (
        <div className="loading">Loading proposals...</div>
      ) : filteredProposals.length === 0 ? (
        <div className="no-proposals">No proposals found</div>
      ) : (
        <div className="proposals-list">
          {filteredProposals.map(proposal => (
            <div key={proposal._id} className={`proposal-card ${proposal.status}`}>
              <div className="proposal-header">
                <h3>{proposal.title}</h3>
                <span className={`status-badge ${proposal.status}`}>
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </span>
              </div>
              
              <div className="proposal-info">
                <p><strong>Submitted By:</strong> {proposal.submittedBy}</p>
                <p><strong>Date:</strong> {new Date(proposal.submissionDate).toLocaleDateString()}</p>
              </div>
              
              <div className="proposal-description">
                <p>{proposal.description}</p>
              </div>
              
              <div className="proposal-actions">
                {/* {proposal.status === 'pending' && (
                  <>
                    <button 
                      className="btn btn-success"
                      onClick={() => handleStatusChange(proposal._id, 'accepted')}
                    >
                      Accept
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleStatusChange(proposal._id, 'rejected')}
                    >
                      Reject
                    </button>
                  </>
                )} */}
                
                <button 
                  className="btn btn-danger delete"
                  onClick={() => handleDelete(proposal._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProposals;