import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import ProgressBar from '../components/ProgressBar';
import CommentSection from '../components/CommentSection';
import MilestoneList from '../components/MilestoneList';

const ReformDetail = () => {
  const { id } = useParams();
  const [reform, setReform] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchReformDetails();
  }, [id]);

  const fetchReformDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/proposals/${id}`);
      setReform(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reform details:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!reform) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-lg text-gray-600">Reform not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{reform.title}</h1>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Submitted by:</span> {reform.submittedBy}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Date:</span> {new Date(reform.submissionDate).toLocaleDateString()}
          </div>
        </div>

        <p className="text-gray-700 mb-6">{reform.description}</p>
        
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold text-gray-800">Progress</h3>
            <span className="text-sm font-medium text-green-600">{reform.progress}%</span>
          </div>
          <ProgressBar progress={reform.progress} />
        </div>

        <MilestoneList milestones={reform.milestones} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Comments</h2>
        <CommentSection reformId={reform._id} />
      </div>
    </div>
  );
};

export default ReformDetail;