import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/SurveySummary.css';

const SurveySummary = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get survey details
        const surveyRes = await axios.get(`http://localhost:5000/api/surveys/${id}`);
        setSurvey(surveyRes.data);
        
        // Get survey summary
        const summaryRes = await axios.get(`http://localhost:5000/api/surveys/${id}/summary`);
        setSummary(summaryRes.data);
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch survey data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  if (!survey || !summary) {
    return <div className="error">Survey not found</div>;
  }
  
  // Function to render chart/visualization based on question type
  const renderVisualization = (question, index) => {
    const questionSummary = summary.questions[index];
    
    if (question.questionType === 'multiple-choice') {
      // Calculate percentages for the bar chart
      const totalAnswers = questionSummary.totalAnswers || 1; // Avoid division by zero
      
      return (
        <div className="chart bar-chart">
          {question.options.map((option, i) => {
            const count = questionSummary.optionCounts[option] || 0;
            const percentage = Math.round((count / totalAnswers) * 100);
            
            return (
              <div key={i} className="bar-container">
                <div className="bar-label">{option}</div>
                <div className="bar-wrapper">
                  <div
                    className="bar"
                    style={{ width: `${percentage}%` }}
                  ></div>
                  <span className="bar-value">{count} ({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      );
    } else if (question.questionType === 'rating') {
      // Display average rating and distribution
      return (
        <div className="rating-summary">
          <div className="average-rating">
            <span className="rating-label">Average Rating:</span>
            <span className="rating-value">{questionSummary.averageRating}</span>
          </div>
          <div className="rating-distribution">
            {[1, 2, 3, 4, 5].map(rating => {
              const count = questionSummary.ratings[rating] || 0;
              const percentage = questionSummary.totalAnswers
                ? Math.round((count / questionSummary.totalAnswers) * 100)
                : 0;
              
              return (
                <div key={rating} className="rating-bar-container">
                  <span className="rating-number">{rating}</span>
                  <div className="rating-bar-wrapper">
                    <div
                      className="rating-bar"
                      style={{ width: `${percentage}%` }}
                    ></div>
                    <span className="rating-count">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      // For open-ended questions, just show the response count
      return (
        <div className="open-ended-summary">
          <p>{questionSummary.totalAnswers} responses received</p>
        </div>
      );
    }
  };
  
  return (
    <div className="survey-summary">
      <div className="summary-header">
        <h1>{survey.title}</h1>
        <p className="survey-description">{survey.description}</p>
        <div className="summary-meta">
          <div className="meta-item">
            <span className="meta-label">Total Responses:</span>
            <span className="meta-value">{summary.totalResponses}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Created:</span>
            <span className="meta-value">{new Date(survey.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <div className="questions-summary">
        <h2>Questions Summary</h2>
        
        {survey.questions.map((question, index) => (
          <div key={index} className="question-summary-card">
            <h3>Q{index + 1}: {question.questionText}</h3>
            <div className="question-stats">
              <div className="stat">
                <span className="stat-label">Response Rate:</span>
                <span className="stat-value">
                  {Math.round((summary.questions[index].totalAnswers / summary.totalResponses) * 100)}%
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Total Answers:</span>
                <span className="stat-value">{summary.questions[index].totalAnswers}</span>
              </div>
            </div>
            
            <div className="visualization-container">
              {renderVisualization(question, index)}
            </div>
            
            {question.questionType === 'open-ended' && (
              <div className="text-responses">
                <h4>Sample Responses:</h4>
                {summary.questions[index].responses && summary.questions[index].responses.length > 0 ? (
                  <ul className="response-list">
                    {summary.questions[index].responses.slice(0, 5).map((response, i) => (
                      <li key={i} className="response-item">{response}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-responses">No text responses available</p>
                )}
                {summary.questions[index].responses && summary.questions[index].responses.length > 5 && (
                  <button className="view-more-btn">View all {summary.questions[index].responses.length} responses</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="summary-actions">
        <button className="export-btn">Export Results (CSV)</button>
        <button className="share-btn">Share Summary</button>
        <button className="print-btn">Print Report</button>
      </div>
      
      <div className="completion-stats">
        <h2>Completion Statistics</h2>
        <div className="completion-chart">
          <div className="completion-bar">
            <div 
              className="completed" 
              style={{ width: `${summary.completionRate}%` }}
            >
              {summary.completionRate}% completed
            </div>
            <div 
              className="abandoned" 
              style={{ width: `${100 - summary.completionRate}%` }}
            >
              {100 - summary.completionRate}% abandoned
            </div>
          </div>
        </div>
        <div className="completion-details">
          <div className="detail-item">
            <span className="detail-label">Average Completion Time:</span>
            <span className="detail-value">{summary.averageTimeToComplete} minutes</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Most Skipped Question:</span>
            <span className="detail-value">
              {summary.mostSkippedQuestion ? 
                `Q${summary.mostSkippedQuestion.index + 1}: ${survey.questions[summary.mostSkippedQuestion.index].questionText.substring(0, 30)}...` : 
                'None'
              }
            </span>
          </div>
        </div>
      </div>
      
      <div className="survey-footer">
        <button className="back-btn">Back to Surveys</button>
        <button className="edit-btn">Edit Survey</button>
        <button className="close-btn">Close Survey</button>
      </div>
    </div>
  );
};

export default SurveySummary;