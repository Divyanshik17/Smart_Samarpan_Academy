import React, { useEffect, useState } from "react";
// import "./lecture.css"; // REMOVE THIS LINE
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";
import { FaPlus, FaTimes, FaTrash, FaSpinner } from "react-icons/fa";

const Lecture = ({ user }) => {
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState({});
  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const [show, setShow] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setvideo] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoPrev, setVideoPrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const isYouTubeUrl = (url) => {
    if (!url) return false;
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("embed/")) return url;
    
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1]?.split("&")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  if (user && user.role !== "admin" && !user.subscription.includes(params.id))
    return navigate("/");

  async function fetchLectures() {
    try {
      const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLectures(data.lectures);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function fetchLecture(id) {
    setLecLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/lecture/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLecture(data.lecture);
      setLecLoading(false);
    } catch (error) {
      console.log(error);
      setLecLoading(false);
    }
  }

  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setVideoPrev(reader.result);
      setvideo(file);
    };
  };

  const submitHandler = async (e) => {
    setBtnLoading(true);
    e.preventDefault();
    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    if (video) {
      myForm.append("file", video);
    }
    if (videoUrl) {
      myForm.append("videoUrl", videoUrl);
    }

    try {
      const { data } = await axios.post(
        `${server}/api/course/${params.id}`,
        myForm,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      toast.success(data.message);
      setBtnLoading(false);
      setShow(false);
      fetchLectures();
      setTitle("");
      setDescription("");
      setvideo("");
      setVideoPrev("");
      setVideoUrl("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding lecture");
      setBtnLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this lecture")) {
      try {
        const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        toast.success(data.message);
        fetchLectures();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const [completed, setCompleted] = useState("");
  const [completedLec, setCompletedLec] = useState("");
  const [lectLength, setLectLength] = useState("");
  const [progress, setProgress] = useState([]);

  async function fetchProgress() {
    try {
      const { data } = await axios.get(
        `${server}/api/user/progress?course=${params.id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setCompleted(data.courseProgressPercentage);
      setCompletedLec(data.completedLectures);
      setLectLength(data.allLectures);
      setProgress(data.progress);
    } catch (error) {
      console.log(error);
    }
  }

  const addProgress = async (id) => {
    try {
      const { data } = await axios.post(
        `${server}/api/user/progress?course=${params.id}&lectureId=${id}`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      console.log(data.message);
      fetchProgress();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLectures();
    fetchProgress();
  }, [params.id]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="bg-[#f8f7f2] min-h-screen py-8 md:py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Progress Bar */}
            <div className="max-w-3xl mx-auto mb-8 bg-white p-5 rounded-2xl border border-[#e5e1d8] shadow-sm text-center">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-[#172554]">Course Progress</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 bg-[#ccfbf1] text-[#0f766e] rounded-full">
                  {completedLec || 0} of {lectLength || 0} Completed
                </span>
              </div>
              <div className="bg-gray-100 w-full rounded-full h-3 overflow-hidden border border-gray-200">
                <div
                  className="bg-[#0f766e] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completed}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 font-semibold mt-2 block">{completed || 0}% Completed</span>
            </div>

            {/* Main Content: Video Player and Lecture List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Video Player */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e5e1d8] shadow-sm p-5">
                {lecLoading ? (
                  <div className="h-96 flex items-center justify-center">
                    <Loading />
                  </div>
                ) : (
                  <>
                    {lecture.video ? (
                      <>
                        <div className="relative pt-[56.25%] bg-black rounded-xl overflow-hidden shadow-sm"> {/* 16:9 aspect ratio */}
                          {isYouTubeUrl(lecture.video) ? (
                            <iframe
                              src={getYouTubeEmbedUrl(lecture.video)}
                              title={lecture.title}
                              className="absolute top-0 left-0 w-full h-full rounded-xl"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          ) : (
                            <video
                              src={lecture.video.startsWith("http") ? lecture.video : `${server}/${lecture.video}`}
                              className="absolute top-0 left-0 w-full h-full rounded-xl"
                              controls
                              controlsList="nodownload noremoteplayback"
                              disablePictureInPicture
                              disableRemotePlayback
                              autoPlay
                              onEnded={() => addProgress(lecture._id)}
                            ></video>
                          )}
                        </div>
                        <div className="mt-5 space-y-2">
                          <h1 className="text-2xl font-bold text-[#172554]">{lecture.title}</h1>
                          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{lecture.description}</p>
                        </div>
                      </>
                    ) : (
                      <div className="h-96 flex flex-col items-center justify-center text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-[#f4f2eb] flex items-center justify-center text-2xl text-[#172554] mb-3">
                          🎓
                        </div>
                        <h2 className="text-xl font-bold text-[#172554] mb-1">Select a Lecture to Begin</h2>
                        <p className="text-sm text-gray-500 max-w-sm">Choose from the lecture playlist on the right to start watching and tracking your progress.</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Right Column: Lecture List & Admin Tools */}
              <div className="lg:col-span-1 bg-white rounded-2xl border border-[#e5e1d8] shadow-sm p-5 h-fit">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <h3 className="font-bold text-[#172554] text-base">Course Lectures</h3>
                  <span className="text-xs bg-[#f4f2eb] text-[#172554] font-bold px-2 py-0.5 rounded-full">
                    {lectures?.length || 0} Lessons
                  </span>
                </div>

                {user && user.role === "admin" && (
                  <button
                    onClick={() => setShow(!show)}
                    className={`w-full text-white py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center mb-4 ${
                      show ? "bg-red-600 hover:bg-red-700" : "bg-[#172554] hover:bg-[#1e3a8a]"
                    }`}
                  >
                    {show ? <FaTimes className="mr-2" /> : <FaPlus className="mr-2" />}
                    {show ? "Close" : "Add New Lecture"}
                  </button>
                )}

                {show && (
                  <div className="mb-4 p-4 bg-[#f8f7f2] border border-[#e5e1d8] rounded-xl">
                    <h4 className="text-sm font-bold text-[#172554] mb-3">Add New Lecture</h4>
                    <form onSubmit={submitHandler} className="space-y-3">
                      <div>
                        <label htmlFor="title" className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border border-[#e5e1d8] rounded-lg p-2 text-xs focus:outline-none focus:border-[#0f766e] bg-white"/>
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                        <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full border border-[#e5e1d8] rounded-lg p-2 text-xs focus:outline-none focus:border-[#0f766e] bg-white"/>
                      </div>
                      <div>
                        <label htmlFor="video-file" className="block text-xs font-semibold text-gray-700 mb-1">Option A: Upload Video File</label>
                        <input type="file" id="video-file" accept="video/*" onChange={changeVideoHandler} className="w-full border border-[#e5e1d8] rounded-lg p-1.5 text-xs bg-white"/>
                      </div>
                      <div className="text-center font-bold text-gray-400 text-xs my-0.5">OR</div>
                      <div>
                        <label htmlFor="video-url" className="block text-xs font-semibold text-gray-700 mb-1">Option B: YouTube Link</label>
                        <input type="url" id="video-url" placeholder="https://www.youtube.com/watch?v=..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="w-full border border-[#e5e1d8] rounded-lg p-2 text-xs focus:outline-none focus:border-[#0f766e] bg-white"/>
                      </div>
                      {videoPrev && (
                        <video src={videoPrev} className="w-full rounded-lg mb-2" controls></video>
                      )}
                      <button disabled={btnLoading} type="submit" className="w-full bg-[#172554] text-white py-2 rounded-lg font-bold text-xs transition-colors hover:bg-[#1e3a8a] flex items-center justify-center">
                        {btnLoading ? <><FaSpinner className="animate-spin mr-2" />Please Wait...</> : "Publish Lecture"}
                      </button>
                    </form>
                  </div>
                )}

                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {lectures && lectures.length > 0 ? (
                    lectures.map((e, i) => (
                      <div
                        key={e._id}
                        onClick={() => fetchLecture(e._id)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-150 border ${
                          lecture._id === e._id 
                            ? "bg-[#172554] text-white border-[#172554] shadow-sm" 
                            : "bg-[#f8f7f2] hover:bg-[#f1efe9] text-gray-800 border-[#e5e1d8]"
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${lecture._id === e._id ? "bg-white/20 text-white" : "bg-white text-gray-700 border border-[#e5e1d8]"}`}>
                            {i + 1}
                          </span>
                          <span className="text-xs font-semibold truncate">{e.title}</span>
                          {progress[0] && progress[0].completedLectures.includes(e._id) && (
                            <span className="ml-1 text-emerald-400">
                              <TiTick className="text-lg inline" />
                            </span>
                          )}
                        </div>
                        {user && user.role === "admin" && (
                          <button
                            onClick={(event) => { event.stopPropagation(); deleteHandler(e._id); }}
                            className={`p-1.5 rounded transition-colors ml-2 ${lecture._id === e._id ? "text-red-200 hover:text-red-100" : "text-red-500 hover:text-red-700"}`}
                            title="Delete lecture"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-xs text-center py-6">No lectures uploaded yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Lecture;