import React, { useState, useCallback } from "react";
import "./auth.css"; // Assuming you still have this for general auth page styling
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import { CourseData } from "../../context/CourseContext";
import { GoogleLogin } from '@react-oauth/google'; // NEW: Import GoogleLogin component
import { toast } from 'react-hot-toast'; // Ensure toast is imported for notifications
import axios from 'axios'; // Import axios for backend call
import { server } from '../../main'; // Import server URL

const Login = () => {
  const navigate = useNavigate();
  const { btnLoading, loginUser, fetchUser } = UserData(); // Added fetchUser from UserData
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { fetchMyCourse } = CourseData();

  const submitHandler = async (e) => {
    e.preventDefault();
    await loginUser(email, password, navigate, fetchMyCourse);
  };

  // Memoized Google login success handler
  const googleSuccessHandler = useCallback(async (credentialResponse) => {
    try {
      // Send the Google credential to your backend for verification
      const { data } = await axios.post(`${server}/api/user/google-login`, {
        token: credentialResponse.credential,
      });

      if (data.success) {
        localStorage.setItem("token", data.token); // Store your app's JWT
        await fetchUser(); // Fetch user data after login
        await fetchMyCourse(); // Fetch user's courses
        toast.success(data.message);
        navigate("/"); // Redirect to home or dashboard
      } else {
        toast.error(data.message || "Google login failed.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.response?.data?.message || "An error occurred during Google login.");
    }
  }, [navigate, fetchUser, fetchMyCourse]);

  // Memoized Google login error handler
  const googleErrorHandler = useCallback(() => {
    toast.error("Google login failed. Please try again.");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7f2] p-4 py-12">
      <div className="bg-white p-8 rounded-2xl border border-[#e5e1d8] shadow-sm w-full max-w-md">
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-[#fef3c7] text-[#b45309] rounded-full">
            Samarpan Student Portal
          </span>
          <h2 className="text-2xl font-extrabold text-[#172554] mt-2">Welcome Back</h2>
          <p className="text-xs text-gray-500 mt-1">Log in to access your mathematics courses &amp; quizzes</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-[#172554] mb-1 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              id="email"
              className="w-full px-3.5 py-2.5 border border-[#e5e1d8] rounded-xl text-sm focus:outline-none focus:border-[#0f766e] bg-[#f8f7f2]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold text-[#172554] mb-1 uppercase tracking-wider">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-3.5 py-2.5 border border-[#e5e1d8] rounded-xl text-sm focus:outline-none focus:border-[#0f766e] bg-[#f8f7f2]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button disabled={btnLoading} type="submit" className="w-full bg-[#172554] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#1e3a8a] transition-all shadow-sm flex items-center justify-center">
            {btnLoading ? "Signing In..." : "Log In"}
          </button>
        </form>
        
        <div className="mt-5 text-center text-xs space-y-2">
          <p className="text-gray-600">
            Don't have an account? <Link to="/register" className="text-[#0f766e] hover:underline font-bold">Register here</Link>
          </p>
          <p className="text-gray-600">
            <Link to="/forgot" className="text-[#172554] hover:underline font-semibold">Forgot your password?</Link>
          </p>
        </div>

        {/* Google Login Section */}
        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">Or continue with</p>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={googleSuccessHandler}
              onError={googleErrorHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
