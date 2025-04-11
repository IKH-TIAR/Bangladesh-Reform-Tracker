import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReformCard from '../components/PublicReformCard';

const HomePage = () => {
  const [reforms, setReforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const justLoggedOut = sessionStorage.getItem('justLoggedOut');
    if (justLoggedOut) {
      // Remove the flag
      sessionStorage.removeItem('justLoggedOut');
    }
  }, []);

  useEffect(() => {
    const fetchReforms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/proposals/public');
        setReforms(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reforms:', err);
        setError('Failed to load reforms. Please try again later.');
        setLoading(false);
      }
    };

    fetchReforms();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bangladesh Reform Tracker</h1>
          <p className="text-xl md:text-2xl mb-8">Track the progress of important reforms and policy changes in Bangladesh</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/login" 
              className="bg-white text-green-700 hover:bg-gray-100 px-6 py-3 rounded-md text-lg font-medium text-center"
            >
              Sign In to Track Reforms
            </Link>
            <Link 
              to="/signup" 
              className="border-2 border-white text-white hover:bg-green-700 px-6 py-3 rounded-md text-lg font-medium text-center"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>

      {/* Reforms Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Recent Reforms</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through the latest reform initiatives in Bangladesh. Sign in to access detailed information, track progress, and participate in discussions.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reforms.map(reform => (
              <ReformCard 
                key={reform._id} 
                proposal={reform} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Sections */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold mb-3 text-green-700">Track Progress</h3>
              <p className="text-gray-700">Monitor the implementation of reforms with real-time progress tracking and milestone updates.</p>
            </div>
            <div className="p-6 rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold mb-3 text-green-700">Join Discussions</h3>
              <p className="text-gray-700">Participate in meaningful discussions about reforms that matter to you and your community.</p>
            </div>
            <div className="p-6 rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold mb-3 text-green-700">Stay Informed</h3>
              <p className="text-gray-700">Get notified about updates to reforms you're following and new policy initiatives.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to track reforms in Bangladesh?</h2>
          <p className="mb-6">Create an account to get full access to all features and reforms.</p>
          <Link 
            to="/signup" 
            className="bg-white text-green-700 hover:bg-gray-100 px-6 py-3 rounded-md text-lg font-medium inline-block"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;