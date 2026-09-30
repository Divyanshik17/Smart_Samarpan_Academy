import React, { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { server } from '../../main';
import './AITools.css'; // Import custom CSS file for specific overrides/enhancements
import katex from 'katex';

/* ── Inline Math renderer ──────────────────────────────────── */
const InlineMath = ({ text }) => {
  if (!text) return null;
  const parts = text.split('$');
  return (
    <span>
      {parts.map((part, index) => {
        if (index % 2 === 0) return <span key={index}>{part}</span>;
        try {
          return <span key={index} dangerouslySetInnerHTML={{ __html: katex.renderToString(part, { throwOnError: false, displayMode: false }) }} />;
        } catch (e) {
          return <span key={index}>${part}$</span>;
        }
      })}
    </span>
  );
};

const QuizGenerator = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('9th_10th_Olympiad');
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();

    setLoading(true);
    setQuiz(null);
    setError(null);
    setStudentAnswers({});
    setShowResults(false);

    try {
      const response = await axios.post(`${server}/api/generate-quiz`, {
        topic,
        difficulty,
        num_questions: 10,
      });

      if (response.data.success) {
        setQuiz(response.data.quiz);
        toast.success('Quiz generated successfully! Now, select your answers.');
      } else {
        setError(response.data.message || 'Failed to generate quiz.');
        toast.error(response.data.message || 'Failed to generate quiz.');
      }
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError(err.response?.data?.message || 'An unexpected error occurred.');
      toast.error(err.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, selectedOption) => {
    setStudentAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionIndex]: selectedOption
    }));
  };

  // Modified handleSubmitQuiz to send results to backend
  const handleSubmitQuiz = async () => {
    // Check if all questions are answered before submitting
    if (Object.keys(studentAnswers).length !== quiz.length) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    setShowResults(true); // Show results immediately in frontend

    const score = calculateScore();
    const totalQuestions = quiz.length;

    // Assuming you have a way to get the current user's ID
    // For now, we'll use a placeholder. In a real app, this comes from auth context/token.
    const userId = "60c72b1f9b1e8b001c8e8e8e"; // Placeholder User ID - REPLACE WITH ACTUAL USER ID

    try {
      const response = await axios.post(`${server}/api/submit-quiz-result`, {
        userId, // Send user ID
        topic: quiz[0].topic || topic, // Use topic from quiz if available, else from state
        difficulty: quiz[0].difficulty || difficulty, // Use difficulty from quiz if available, else from state
        score,
        totalQuestions,
      });

      if (response.data.success) {
        toast.success('Quiz submitted and results saved!');
        console.log('Quiz result saved:', response.data.result);
      } else {
        toast.error(response.data.message || 'Failed to save quiz results.');
        console.error('Failed to save quiz results:', response.data.details);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving quiz results.');
      console.error('Error submitting quiz results:', err);
    }
  };

  // Calculate score (remains the same)
  const calculateScore = () => {
    if (!quiz) return 0;
    let score = 0;
    quiz.forEach((q, index) => {
      if (studentAnswers[index] === q.correct_answer) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="min-h-screen bg-[#f8f7f2] flex items-center justify-center p-4 py-12">
      <Toaster />
      <div className="bg-white p-8 rounded-2xl border border-[#e5e1d8] shadow-sm w-full max-w-2xl quiz-container">
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-[#ccfbf1] text-[#0f766e] rounded-full">
            AI Practice Portal
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#172554] mt-2">Generate Math Quiz</h2>
          <p className="text-xs text-gray-500 mt-1">10 AI-crafted questions with instant evaluation</p>
        </div>

        <form onSubmit={handleGenerateQuiz} className="space-y-4 mb-8">
          <div>
            <label htmlFor="topic" className="block text-xs font-bold text-[#172554] mb-1 uppercase tracking-wider">
              Math Topic:
            </label>
            <input
              type="text"
              id="topic"
              className="w-full px-3.5 py-2.5 border border-[#e5e1d8] rounded-xl text-sm focus:outline-none focus:border-[#0f766e] bg-[#f8f7f2]"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Quadratic Equations, Integration, Trigonometry"
              required
            />
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-xs font-bold text-[#172554] mb-1 uppercase tracking-wider">
              Difficulty Level:
            </label>
            <select
              id="difficulty"
              className="w-full px-3.5 py-2.5 border border-[#e5e1d8] rounded-xl text-sm focus:outline-none focus:border-[#0f766e] bg-[#f8f7f2]"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="9th_10th_Olympiad">Class 9th &amp; 10th Olympiad Level</option>
              <option value="11th_12th_JEE">Class 11th &amp; 12th JEE Main / Advanced</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#172554] text-white py-3 px-4 rounded-xl font-bold text-sm hover:bg-[#1e3a8a] transition-all shadow-sm flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              '⚡ Generate 10-Question Quiz'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">
            <p className="font-semibold">Error: {error}</p>
          </div>
        )}

        {quiz && quiz.length > 0 && (
          <div className="mt-8 quiz-display">
            <h3 className="text-xl font-bold text-[#172554] mb-4">Quiz Questions:</h3>
            {quiz.map((q, qIndex) => (
              <div key={qIndex} className="mb-5 p-4 border border-[#e5e1d8] rounded-xl bg-[#f8f7f2] question-card">
                <p className="font-bold text-base text-[#172554] mb-3">Q{qIndex + 1}: <InlineMath text={q.question} /></p>
                <div className="options-group space-y-2">
                  {q.options.map((option, optIndex) => (
                    <label key={optIndex} className="flex items-center gap-2 text-gray-700 option-label cursor-pointer text-sm">
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        value={option.charAt(0)}
                        onChange={() => handleAnswerChange(qIndex, option.charAt(0))}
                        checked={studentAnswers[qIndex] === option.charAt(0)}
                        className="accent-[#0f766e]"
                        disabled={showResults}
                      />
                      <InlineMath text={option} />
                    </label>
                  ))}
                </div>
                {showResults && (
                  <div className="mt-3 pt-2 border-t border-gray-200 text-xs">
                    <p className={`font-bold ${studentAnswers[qIndex] === q.correct_answer ? 'text-emerald-700' : 'text-rose-700'}`}>
                      Your Answer: {studentAnswers[qIndex] || 'Not answered'}
                    </p>
                    <p className="text-emerald-700 font-semibold mt-0.5">
                      Correct Answer: {q.correct_answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
            {!showResults && (
              <button
                onClick={handleSubmitQuiz}
                className="w-full bg-[#0f766e] text-white py-3 px-4 rounded-xl font-bold text-sm hover:bg-[#0d9488] transition-all shadow-sm mt-6"
                disabled={!quiz || Object.keys(studentAnswers).length !== quiz.length}
              >
                ✅ Submit Quiz Answers
              </button>
            )}
            {showResults && (
              <div className="mt-6 p-5 bg-[#fef3c7] border border-[#fde68a] rounded-xl text-center">
                <h3 className="text-xl font-bold text-[#b45309]">🎉 Final Score: {calculateScore()} / {quiz.length}</h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGenerator;
