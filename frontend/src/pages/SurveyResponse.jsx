import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Navigate, Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const SurveyResponse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hasAlreadyResponded, setHasAlreadyResponded] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchSurveyAndCheckResponse = async () => {
      try {
        const responseCheck = await axios.get(
          `http://localhost:5000/api/surveys/${id}/user-response`
        );

        if (responseCheck.data.hasResponded) {
          setHasAlreadyResponded(true);
          setLoading(false);
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/surveys/${id}`);
        setSurvey(res.data);

        const initialAnswers = res.data.questions.map((question) => ({
          questionId: question._id,
          answer:
            question.questionType === "multiple-choice"
              ? ""
              : question.questionType === "rating"
              ? 0
              : "",
        }));

        setAnswers(initialAnswers);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching survey:", err);
        setError("Failed to load survey. Please try again later.");
        setLoading(false);
      }
    };

    fetchSurveyAndCheckResponse();
  }, [id]);

  const handleInputChange = (questionIndex, value) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex].answer = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const unansweredQuestions = answers.filter((answer) => {
      if (typeof answer.answer === "string" && answer.answer.trim() === "")
        return true;
      if (
        answer.answer === 0 &&
        survey.questions.find((q) => q._id === answer.questionId)
          .questionType === "rating"
      )
        return false;
      return !answer.answer && answer.answer !== 0;
    });

    if (unansweredQuestions.length > 0) {
      alert("Please answer all questions before submitting");
      return;
    }

    setSubmitLoading(true);

    try {
      await axios.post(`http://localhost:5000/api/surveys/${id}/responses`, {
        answers,
      });
      setSubmitSuccess(true);

      setTimeout(() => {
        navigate("/surveys");
      }, 2000);
    } catch (err) {
      console.error("Error submitting survey response:", err);

      if (
        err.response &&
        err.response.data &&
        err.response.data.msg ===
          "You have already submitted a response to this survey"
      ) {
        setHasAlreadyResponded(true);
      } else {
        alert("Failed to submit your response. Please try again.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (hasAlreadyResponded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-yellow-50 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">
            You've already participated in this survey
          </h2>
          <p className="mb-4">
            Our records show that you have already submitted a response to this
            survey.
          </p>
          <Link
            to="/surveys"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
          >
            Back to Surveys
          </Link>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p className="font-semibold">Thank you for your response!</p>
          <p>Your survey response has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-2">{survey.title}</h1>
        <p className="text-gray-600 mb-6">{survey.description}</p>

        <form onSubmit={handleSubmit}>
          {survey.questions.map((question, index) => (
            <div
              key={question._id}
              className="mb-8 pb-6 border-b border-gray-200"
            >
              <h3 className="text-lg font-semibold mb-3">
                {index + 1}. {question.questionText}
              </h3>

              {question.questionType === "multiple-choice" && (
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center">
                      <input
                        type="radio"
                        id={`q${index}-o${optionIndex}`}
                        name={`question-${index}`}
                        value={option}
                        checked={answers[index].answer === option}
                        onChange={() => handleInputChange(index, option)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`q${index}-o${optionIndex}`}
                        className="text-gray-700"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {question.questionType === "open-ended" && (
                <textarea
                  value={answers[index].answer}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                  placeholder="Your answer..."
                ></textarea>
              )}

              {question.questionType === "rating" && (
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleInputChange(index, rating)}
                      className={`h-10 w-10 rounded-full flex items-center justify-center focus:outline-none ${
                        answers[index].answer === rating
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                  <span className="text-gray-500 ml-2">
                    {answers[index].answer
                      ? `${answers[index].answer}/5`
                      : "Select a rating"}
                  </span>
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={submitLoading}
              className={`bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md font-medium ${
                submitLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {submitLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Response"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurveyResponse;
