import React from 'react';
import { CheckCircle, Circle } from 'react-feather';

const MilestoneList = ({ milestones }) => {
  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-3">Milestones</h3>
      <div className="space-y-3">
        {milestones.map((milestone, index) => (
          <div 
            key={index} 
            className={`flex items-start p-3 rounded-md ${
              milestone.completed ? 'bg-green-50' : 'bg-gray-50'
            }`}
          >
            <div className="mr-3 mt-0.5">
              {milestone.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h4 className={`font-medium ${milestone.completed ? 'text-green-700' : 'text-gray-700'}`}>
                {milestone.title}
              </h4>
              {milestone.dueDate && (
                <p className="text-sm text-gray-500">
                  Due: {new Date(milestone.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestoneList;