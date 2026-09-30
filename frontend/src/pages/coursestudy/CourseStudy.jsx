import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import CourseThumbnail from "../../components/coursethumbnail/CourseThumbnail";

const CourseStudy = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();

  const { fetchCourse, course, loading } = CourseData();

  if (user && user.role !== "admin" && !user.subscription.includes(params.id))
    return navigate("/");

  useEffect(() => {
    fetchCourse(params.id);
  }, [params.id]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {course && (
        <div className="bg-[#f8f7f2] min-h-screen py-14 flex flex-col items-center">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <div className="inline-block px-3 py-1 bg-[#fef3c7] text-[#b45309] text-xs font-bold rounded-full uppercase tracking-wider mb-4 border border-[#fde68a]">
              Active Study Portal
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#172554] mb-6">
              {course.title}
            </h1>

            <div className="bg-white p-6 rounded-2xl border border-[#e5e1d8] shadow-sm mb-8 text-left">
              <CourseThumbnail
                course={course}
                className="w-full max-w-3xl rounded-xl border border-[#e5e1d8] mx-auto mb-6 object-cover"
                style={{ minHeight: '260px', maxHeight: '360px' }}
              />

              <div className="space-y-4 max-w-2xl mx-auto text-center">
                <p className="text-base text-gray-700 leading-relaxed">
                  {course.description}
                </p>
                <div className="flex justify-center gap-6 text-sm text-gray-600 pt-2 border-t border-gray-100">
                  <p><span className="font-semibold text-gray-800">Faculty:</span> {course.createdBy}</p>
                  <p><span className="font-semibold text-gray-800">Duration:</span> {course.duration} weeks</p>
                </div>
              </div>
            </div>

            <div>
              <Link
                to={`/lectures/${course._id}`}
                className="inline-block bg-[#172554] text-white py-3.5 px-10 rounded-xl font-bold shadow-sm hover:bg-[#1e3a8a] hover:shadow-md transition-all"
              >
                Access Classroom Lectures →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseStudy;