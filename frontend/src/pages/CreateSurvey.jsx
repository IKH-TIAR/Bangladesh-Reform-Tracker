import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/CreateSurvey.css';

const CreateSurvey = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: [
      {
        questionText: '',
        questionType: 'multiple-choice',
        options: ['', '']
      }
    ]
  });
  
  const { title, description, questions } = formData;
  
  const onChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const onQuestionChange = (e, questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].questionText = e.target.value;
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };
  
  const onQuestionTypeChange = (e, questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].questionType = e.target.value;
    
    // Reset options if changing to/from multiple choice
    if (e.target.value !== 'multiple-choice') {
      updatedQuestions[questionIndex].options = [];
    } else if (!updatedQuestions[questionIndex].options || updatedQuestions[questionIndex].options.length === 0) {
      updatedQuestions[questionIndex].options = ['', ''];
    }
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };
  
  const onOptionChange = (e, questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = e.target.value;
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };
  
  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push('');
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };
  
  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter(
      (_, index) => index !== optionIndex
    );
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };
  
  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...questions,
        {
          questionText: '',
          questionType: 'multiple-choice',
          options: ['', '']
        }
      ]
    });
  };
  
  const removeQuestion = (questionIndex) => {
    if (questions.length > 1) {
      setFormData({
        ...formData,
        questions: questions.filter((_, index) => index !== questionIndex)
      });
    }
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    try {
      await axios.post('http://localhost:5000/api/surveys', formData);
      
      
      setFormData({
        title: '',
        description: '',
        questions: [
          {
            questionText: '',
            questionType: 'multiple-choice',
            options: ['', '']
          }
        ]
      })
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/view-surveys');
      }, 2000);
      
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <div className="create-survey">
      <h1>Create New Survey</h1>
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Survey Title</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Survey Description</label>
          <textarea
            name="description"
            value={description}
            onChange={onChange}
            required
          ></textarea>
        </div>
        
        <div className="questions-container">
          <h2>Questions</h2>
          
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="question-box">
              <div className="question-header">
                <h3>Question {questionIndex + 1}</h3>
                {questions.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeQuestion(questionIndex)}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="form-group">
                <label>Question Text</label>
                <input
                  type="text"
                  value={question.questionText}
                  onChange={e => onQuestionChange(e, questionIndex)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Question Type</label>
                <select
                  value={question.questionType}
                  onChange={e => onQuestionTypeChange(e, questionIndex)}
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="open-ended">Open Ended</option>
                  <option value="rating">Rating (1-5)</option>
                </select>
              </div>
              
              {question.questionType === 'multiple-choice' && (
                <div className="options-container">
                  <label>Options</label>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="option-group">
                      <input
                        type="text"
                        value={option}
                        onChange={e => onOptionChange(e, questionIndex, optionIndex)}
                        placeholder={`Option ${optionIndex + 1}`}
                        required
                      />
                      {question.options.length > 2 && (
                        <button
                          type="button"
                          className="btn-remove-option"
                          onClick={() => removeOption(questionIndex, optionIndex)}
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn-add-option"
                    onClick={() => addOption(questionIndex)}
                  >
                    Add Option
                  </button>
                </div>
              )}
            </div>
          ))}
          
          <button
            type="button"
            className="btn-add-question"
            onClick={addQuestion}
          >
            Add Question
          </button>
        </div>
        
        <button type="submit" className="btn-submit">
          Create Survey
        </button>
      </form>
    </div>
  );
};

export default CreateSurvey;