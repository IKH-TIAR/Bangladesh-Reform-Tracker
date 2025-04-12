import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/ViewSurveys.css';

const ViewSurveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/surveys');
      setSurveys(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const deleteSurvey = async (id) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      try {
        await axios.delete(`http://localhost:5000/api/surveys/${id}`);
        // setSurveys(surveys.filter(survey => survey._id !== id));
        fetchSurveys();
      } catch (err) {
        console.error(err);
      }
    }
  };
  
  // Filter surveys based on search term
  const filteredSurveys = surveys.filter(survey =>
    survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return (
    <div className="view-surveys">
      <h1>All Surveys</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search surveys..."
          className="search-input"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredSurveys.length > 0 ? (
        <div className="surveys-grid">
          {filteredSurveys.map(survey => (
            <div key={survey._id} className="survey-card">
              <h2>{survey.title}</h2>
              <p className="survey-description">{survey.description.substring(0, 100)}...</p>
              <div className="survey-meta">
                <span>Questions: {survey.questions.length}</span>
                <span>Responses: {survey.responses.length}</span>
                <span>Created: {new Date(survey.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="survey-actions">
                <Link to={`/survey/${survey._id}/summary`} className="btn btn-view">
                  View Summary
                </Link>
                <button
                  className="btn btn-delete"
                  onClick={() => deleteSurvey(survey._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-surveys">
          <p>No surveys found.</p>
          <Link to="/create-survey" className="btn btn-create">
            Create a Survey
          </Link>
        </div>
      )}
    </div>
  );
};

export default ViewSurveys;