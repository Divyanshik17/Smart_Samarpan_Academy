import React from "react";
import Layout from "../Utils/Layout";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import Loading from "../../components/loading/Loading";

const AdminCourses = ({ user }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  if (user && user.role !== "admin") {
    return (
      <Layout>
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
        </div>
      </Layout>
    );
  }

  const { courses, loading } = CourseData();

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="adm-page-title mb-2">Manage All Courses</h2>
        <p className="text-sm text-gray-600">Review, inspect, or manage all published courses on Samarpan Math Academy.</p>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses && courses.length > 0 ? (
            courses.map((e) => {
              return <CourseCard key={e._id} course={e} />;
            })
          ) : (
            <div className="col-span-full text-center py-16 bg-white border border-[#e5e1d8] rounded-2xl">
              <p className="text-gray-500 text-lg">No courses published yet.</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default AdminCourses;