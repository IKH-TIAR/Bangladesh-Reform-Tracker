// frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProposals: 0,
    pendingProposals: 0,
    acceptedProposals: 0,
    rejectedProposals: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/proposals');
        const proposals = res.data;
        
        setStats({
          totalProposals: proposals.length,
          pendingProposals: proposals.filter(p => p.status === 'pending').length,
          acceptedProposals: proposals.filter(p => p.status === 'accepted').length,
          rejectedProposals: proposals.filter(p => p.status === 'rejected').length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Proposals</h3>
          <p className="stat-number">{stats.totalProposals}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-number pending">{stats.pendingProposals}</p>
        </div>
        <div className="stat-card">
          <h3>Accepted</h3>
          <p className="stat-number accepted">{stats.acceptedProposals}</p>
        </div>
        <div className="stat-card">
          <h3>Rejected</h3>
          <p className="stat-number rejected">{stats.rejectedProposals}</p>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <h3>Quick Access</h3>
        <div className="action-buttons">
          <a href="/submit-proposal" className="btn btn-primary">Submit New Proposal</a>
          <a href="/all-proposals" className="btn btn-secondary">View All Proposals</a>
          <a href="/accepted-proposals" className="btn btn-success">Track Accepted Proposals</a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;