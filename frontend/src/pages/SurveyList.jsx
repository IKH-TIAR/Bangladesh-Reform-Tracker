import React, { useState, useEffect, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userResponses, setUserResponses] = useState({});
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/surveys");
        setSurveys(res.data);

        const responseChecks = await Promise.all(
          res.data.map((survey) =>
            axios
              .get(
                `http://localhost:5000/api/surveys/${survey._id}/user-response`
              )
              .then((response) => ({
                surveyId: survey._id,
                hasResponded: response.data.hasResponded,
              }))
              .catch(() => ({ surveyId: survey._id, hasResponded: false }))
          )
        );

        const responsesMap = {};
        responseChecks.forEach((check) => {
          responsesMap[check.surveyId] = check.hasResponded;
        });

        setUserResponses(responsesMap);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching surveys:", err);
        setError("Failed to load surveys. Please try again later.");
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Surveys</h1>

      {surveys.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg">
          <p className="text-gray-600">
            No surveys are available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey) => {
            const hasResponded = userResponses[survey._id];

            return (
              <div
                key={survey._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{survey.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {survey.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {survey.questions.length} questions
                    </span>

                    {hasResponded ? (
                      <span className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md font-medium">
                        Completed
                      </span>
                    ) : (
                      <Link
                        to={`/surveys/${survey._id}`}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-300"
                      >
                        Take Survey
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SurveyList;
