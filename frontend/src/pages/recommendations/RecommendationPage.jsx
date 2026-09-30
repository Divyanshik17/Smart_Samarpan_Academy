import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { FaSpinner, FaLightbulb } from 'react-icons/fa'; // Icons for features
import { server } from '../../main';
import './AITools.css'; // Import custom CSS file

const RecommendationPage = () => {
  const [recommendation, setRecommendation] = useState('');
  const [loadingRecommendation, setLoadingRecommendation] = useState(true);
  const [errorRecommendation, setErrorRecommendation] = useState(null);

  // Placeholder User ID - In a real app, this would come from your authentication context
  // For testing, use the same userId you used in QuizGenerator.jsx for submitting results
  const userId = "60c72b1f9b1e8b001c8e8e8e"; // REPLACE WITH ACTUAL USER ID OR DYNAMICALLY FETCH

  useEffect(() => {
    const fetchRecommendation = async () => {
      setLoadingRecommendation(true);
      setErrorRecommendation(null);
      try {
        const response = await axios.get(`${server}/api/get-recommendations/${userId}`);
        if (response.data.success) {
          setRecommendation(response.data.recommendation);
        } else {
          setErrorRecommendation(response.data.message || 'Failed to fetch recommendations.');
          toast.error(response.data.message || 'Failed to fetch recommendations.');
        }
      } catch (err) {
        console.error("Error fetching recommendation:", err);
        setErrorRecommendation(err.response?.data?.message || 'An unexpected error occurred while fetching recommendations.');
        toast.error(err.response?.data?.message || 'An unexpected error occurred while fetching recommendations.');
      } finally {
        setLoadingRecommendation(false);
      }
    };

    if (userId) { // Only fetch if userId is available
      fetchRecommendation();
    } else {
      setRecommendation("Please log in to get personalized recommendations.");
      setLoadingRecommendation(false);
    }
  }, [userId]); // Re-fetch if userId changes

  return (
    <div className="min-h-screen bg-[#f8f7f2] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <Toaster />
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e5e1d8] shadow-sm w-full max-w-3xl recommendation-main-card">
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-[#ccfbf1] text-[#0f766e] rounded-full">
            Smart Recommendations
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172554] mt-2 mb-1">
            Personalized Study Guidance
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            AI-driven learning paths tailored to your recent practice &amp; quiz strengths
          </p>
        </div>

        {/* Personalized Recommendation Display */}
        <div className="p-6 bg-[#f8f7f2] rounded-xl border border-[#e5e1d8] shadow-none">
          <h3 className="text-lg font-bold text-[#172554] mb-3 flex items-center">
            <FaLightbulb className="mr-2.5 text-[#d97706]" /> Your Recommendation:
          </h3>
          {loadingRecommendation ? (
            <p className="text-[#0f766e] flex items-center font-medium text-sm">
              <FaSpinner className="animate-spin mr-2" /> Loading personalized recommendations...
            </p>
          ) : errorRecommendation ? (
            <p className="text-red-600 text-sm">Error: {errorRecommendation}</p>
          ) : (
            <p className="text-gray-800 text-base leading-relaxed">{recommendation}</p>
          )}
        </div>

        {/* Navigation links */}
        <div className="mt-8 text-center pt-6 border-t border-[#eeebe3]">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Explore other AI tools:</p>
          <div className="flex justify-center gap-4">
            <Link to="/generate-quiz" className="text-sm text-[#172554] hover:text-[#0f766e] font-bold">Quiz Generator</Link>
            <span className="text-gray-300">·</span>
            <Link to="/generate-formulas" className="text-sm text-[#172554] hover:text-[#0f766e] font-bold">Formula Generator</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;
