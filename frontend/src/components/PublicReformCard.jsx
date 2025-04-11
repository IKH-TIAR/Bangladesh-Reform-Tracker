import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';

const PublicReformCard = ({ proposal }) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    // Redirect to login page
    navigate('/login', { 
      state: { 
        from: `/reforms/${proposal._id}`,
        message: 'Please log in to view reform details'
      } 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">
          {proposal.title}
        </h2>
        
        <p className="text-gray-600 text-sm mb-4">
          Submitted by {proposal.submittedBy} on {new Date(proposal.submissionDate).toLocaleDateString()}
        </p>
        
        <p className="text-gray-700 mb-4 line-clamp-3">
          {proposal.description}
        </p>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-green-600">{proposal.progress}%</span>
          </div>
          <ProgressBar progress={proposal.progress} />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="font-semibold">{proposal.milestones.filter(m => m.completed).length}</span> of{' '}
            <span className="font-semibold">{proposal.milestones.length}</span> milestones completed
          </div>
          <button
            onClick={handleViewDetails}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors duration-300"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicReformCard;