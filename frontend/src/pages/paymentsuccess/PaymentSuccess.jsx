import React from "react";
// import "./paymentsuccess.css"; // REMOVE THIS LINE
import { Link, useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa"; // Import a success icon

const PaymentSuccess = ({ user }) => {
  const params = useParams();
  
  return (
    <div className="bg-[#f8f7f2] min-h-[75vh] flex items-center justify-center p-4">
      {user && (
        <div className="bg-white p-8 md:p-10 rounded-2xl border border-[#e5e1d8] shadow-sm max-w-md w-full text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-[#ccfbf1] text-[#0f766e] rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">
            <FaCheckCircle />
          </div>

          <h2 className="text-2xl font-bold text-[#172554] mb-2">Enrollment Successful!</h2>
          <p className="text-sm text-gray-600 mb-6">Your course access has been activated and is ready for study.</p>
          
          <div className="bg-[#f8f7f2] p-4 rounded-xl border border-[#e5e1d8] mb-6">
            <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Payment Transaction ID</p>
            <p className="text-sm font-bold text-[#172554] font-mono break-all">{params.id}</p>
          </div>

          <Link 
            to={`/${user._id}/dashboard`} 
            className="inline-block w-full bg-[#172554] text-white py-3 rounded-xl font-bold transition-all duration-200 hover:bg-[#1e3a8a] shadow-sm hover:shadow"
          >
            Go to Student Dashboard →
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;