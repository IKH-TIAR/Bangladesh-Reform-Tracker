import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSurveys: 0,
    totalResponses: 0,
    recentSurveys: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/surveys');
        const surveys = res.data;
        
        // Calculate stats
        const totalSurveys = surveys.length;
        let totalResponses = 0;
        surveys.forEach(survey => {
          totalResponses += survey.responses.length;
        });
        
        // Get recent surveys (last 5)
        const recentSurveys = surveys.slice(0, 5);
        
        setStats({
          totalSurveys,
          totalResponses,
          recentSurveys
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <h1>Reform Progress Tracking Dashboard</h1>
      
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Surveys</h3>
          <p className="stat-number">{stats.totalSurveys}</p>
        </div>
        <div className="stat-card">
          <h3>Total Responses</h3>
          <p className="stat-number">{stats.totalResponses}</p>
        </div>
      </div>
      
      <div className="action-buttons">
        <Link to="/create-survey" className="action-button create">
          Create New Survey
        </Link>
        <Link to="/view-surveys" className="action-button view">
          View All Surveys
        </Link>
      </div>
      
      <div className="recent-surveys">
        <h2>Recent Surveys</h2>
        {stats.recentSurveys.length > 0 ? (
          <ul className="survey-list">
            {stats.recentSurveys.map(survey => (
              <li key={survey._id} className="survey-item">
                <div className="survey-info">
                  <h3>{survey.title}</h3>
                  <p>{survey.description.substring(0, 100)}...</p>
                  <p>Responses: {survey.responses.length}</p>
                </div>
                <div className="survey-actions">
                  <Link to={`/survey/${survey._id}/summary`} className="btn-summary">
                    View Summary
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No surveys have been created yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;