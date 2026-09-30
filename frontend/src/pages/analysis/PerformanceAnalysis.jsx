import React, { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { FaBrain, FaSpinner, FaLightbulb } from 'react-icons/fa';
import { server } from '../../main';
import './AITools.css';

// A simple component to render markdown-like text
const MarkdownRenderer = ({ text }) => {
    // Basic rendering: split by newlines and handle simple markdown
    const lines = text.split('\n').map((line, index) => {
        if (line.startsWith('### ')) {
            return <h3 key={index} className="text-lg font-bold text-[#172554] mt-4 mb-2">{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) {
            return <h2 key={index} className="text-xl font-extrabold text-[#172554] mt-5 mb-2.5">{line.substring(3)}</h2>;
        }
        if (line.startsWith('**')) {
            return <p key={index} className="my-1 text-[#172554]"><strong>{line.replace(/\*\*/g, '')}</strong></p>;
        }
        if (line.startsWith('* ')) {
            return <li key={index} className="ml-5 list-disc text-gray-700">{line.substring(2)}</li>;
        }
        return <p key={index} className="my-1 text-gray-700 leading-relaxed">{line}</p>;
    });

    return <div className="text-gray-800 text-left">{lines}</div>;
};


const PerformanceAnalysis = () => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalysisRequest = async () => {
    setLoading(true);
    setError(null);
    setAnalysis('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to get an analysis.');
        setLoading(false);
        return;
      }

      const { data } = await axios.get(`${server}/api/user/performance-analysis`, {
        headers: {
          token: token,
        },
      });

      if (data.success) {
        setAnalysis(data.analysis);
        toast.success('Analysis complete!');
      } else {
        setError(data.message || 'Failed to fetch analysis.');
        toast.error(data.message || 'Failed to fetch analysis.');
      }
    } catch (err) {
      console.error("Error fetching analysis:", err);
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f2] flex flex-col items-center p-4 sm:p-6 lg:p-8 py-12">
      <Toaster position="top-center" />
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e5e1d8] shadow-sm w-full max-w-4xl">
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-[#fef3c7] text-[#b45309] rounded-full">
            AI Performance Intelligence
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172554] mt-2 mb-1">
            Student Performance Analysis
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
            Get an in-depth analytical breakdown of your quiz history and custom recommendations to improve your score
          </p>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleAnalysisRequest}
            disabled={loading}
            className="bg-[#172554] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#1e3a8a] focus:outline-none transition-all shadow-sm flex items-center justify-center mx-auto text-sm"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2.5" />
                Analyzing Quiz History...
              </>
            ) : (
              <>
                <FaBrain className="mr-2.5 text-[#0f766e]" />
                Generate Deep Performance Report
              </>
            )}
          </button>
        </div>

        {analysis && (
          <div className="mt-8 p-6 bg-[#f8f7f2] rounded-xl border border-[#e5e1d8]">
            <h3 className="text-lg font-bold text-[#172554] mb-3 flex items-center">
              <FaLightbulb className="mr-2.5 text-[#d97706]" /> Your Personalized Mathematics Report
            </h3>
            <MarkdownRenderer text={analysis} />
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-center text-sm">
            <p className="font-semibold">Error: {error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceAnalysis;
