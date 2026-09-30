import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";
import CourseThumbnail from "../../components/coursethumbnail/CourseThumbnail";

const CourseDescription = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { fetchUser } = UserData();

  const { fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();

  useEffect(() => {
    fetchCourse(params.id);
  }, [params.id]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const checkoutHandler = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load. Please check your connection.");
        setLoading(false);
        return;
      }

      const { data: { order } } = await axios.post(
        `${server}/api/course/checkout/${params.id}`,
        {},
        {
          headers: { token },
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_hu4uSc3Jfsnnnj",
        amount: order.amount,
        currency: "INR",
        name: "Samarpan",
        description: "Learn with us",
        order_id: order.id,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
        handler: async function (response) {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;

          try {
            const { data } = await axios.post(
              `${server}/api/verification/${params.id}`,
              { razorpay_order_id, razorpay_payment_id, razorpay_signature },
              {
                headers: { token },
              }
            );

            await fetchUser();
            await fetchCourses();
            await fetchMyCourse();
            toast.success(data.message);
            setLoading(false);
            navigate(`/payment-success/${razorpay_payment_id}`);
          } catch (error) {
            toast.error(error.response?.data?.message || "Payment verification failed");
            setLoading(false);
          }
        },
        theme: {
          color: "#172554",
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {course && (
            <div className="min-h-screen bg-[#f8f7f2] py-14">
              <div className="container mx-auto px-4 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  {/* Course Details Section */}
                  <div className="bg-white p-7 rounded-2xl border border-[#e5e1d8] shadow-sm">
                    <CourseThumbnail
                      course={course}
                      className="w-full h-72 object-cover bg-gray-100 rounded-xl mb-6 border border-[#e5e1d8]"
                    />
                    <div className="space-y-3">
                      <div className="inline-block px-3 py-1 bg-[#ccfbf1] text-[#0f766e] text-xs font-bold rounded-full uppercase tracking-wider">
                        Academic Program
                      </div>
                      <h1 className="text-3xl font-extrabold text-[#172554] leading-tight">{course.title}</h1>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 pt-2 border-t border-gray-100">
                        <p><span className="font-semibold text-gray-800">Faculty:</span> {course.createdBy}</p>
                        <p><span className="font-semibold text-gray-800">Duration:</span> {course.duration} weeks</p>
                      </div>
                      <div className="pt-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Tuition Fee</span>
                        <p className="text-3xl font-extrabold text-[#172554]">₹{course.price}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description and Action Section */}
                  <div className="bg-white p-7 rounded-2xl border border-[#e5e1d8] shadow-sm flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-2xl font-bold text-[#172554] mb-3">Course Overview &amp; Curriculum</h3>
                      <p className="text-gray-700 leading-relaxed text-[15px] whitespace-pre-line">{course.description}</p>
                      
                      <div className="mt-6 p-4 bg-[#f8f7f2] rounded-xl border border-[#e5e1d8] space-y-2">
                        <h4 className="font-bold text-sm text-[#172554]">What you'll get:</h4>
                        <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                          <li>Comprehensive video lectures &amp; notes</li>
                          <li>Chapter-wise practice quizzes &amp; formula sheets</li>
                          <li>Doubt clearance &amp; conceptual guidance</li>
                          <li>Full lifetime access to course material</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-4 border-t border-gray-100">
                      {user && user.subscription.includes(course._id) ? (
                        <button
                          onClick={() => navigate(`/course/study/${course._id}`)}
                          className="w-full bg-[#0f766e] text-white py-3.5 rounded-xl font-bold transition-all duration-200 hover:bg-[#0d9488] shadow-md hover:shadow-lg"
                        >
                          Continue to Study
                        </button>
                      ) : (
                        <button 
                          onClick={checkoutHandler} 
                          className="w-full bg-[#172554] text-white py-3.5 rounded-xl font-bold transition-all duration-200 hover:bg-[#1e3a8a] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                          <span>Enroll Now for ₹{course.price}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CourseDescription;