import React, { useState, useEffect } from "react";
import { server } from "../../main";
import "./CourseThumbnail.css";

// Local class-specific fallback assets
import lec9th  from "../../assets/lec_9th.jpg";
import lec10th from "../../assets/lec_10th.jpg";
import lec11th from "../../assets/lec_11th.jpg";
import lec12th from "../../assets/lec_12th.jpg";
import sachinMaths from "../../assets/sachin_basic_maths.jpg";
import defaultImg from "../../assets/img.jpg";

/* ── Build clean URL from stored image path ─────────────────── */
export const buildImageUrl = (imgPath) => {
  if (!imgPath || typeof imgPath !== "string") return null;
  const cleaned = imgPath.trim().replace(/\\/g, "/");
  if (
    cleaned.startsWith("http://") ||
    cleaned.startsWith("https://") ||
    cleaned.startsWith("data:") ||
    cleaned.startsWith("blob:")
  ) {
    return cleaned;
  }
  const normalized = cleaned.startsWith("/") ? cleaned.slice(1) : cleaned;
  return server ? `${server}/${normalized}` : `/${normalized}`;
};

/* ── Category → Academic Theme ─────────────────────────────── */
const getCategoryTheme = (category = "", title = "") => {
  const text = (category + " " + title).toLowerCase();
  if (text.includes("9th"))     return { gradient: "linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)", accent: "#38bdf8", emoji: "📐", label: "Class 9th"   };
  if (text.includes("10th"))    return { gradient: "linear-gradient(135deg, #0f766e 0%, #042f2e 100%)", accent: "#2dd4bf", emoji: "📊", label: "Class 10th"  };
  if (text.includes("11th"))    return { gradient: "linear-gradient(135deg, #b45309 0%, #451a03 100%)", accent: "#fbbf24", emoji: "🔬", label: "Class 11th"  };
  if (text.includes("12th"))    return { gradient: "linear-gradient(135deg, #172554 0%, #1e1b4b 100%)", accent: "#93c5fd", emoji: "🎓", label: "Class 12th"  };
  if (text.includes("mains") || text.includes("jee"))
                                return { gradient: "linear-gradient(135deg, #991b1b 0%, #450a0a 100%)", accent: "#fca5a5", emoji: "🎯", label: "JEE Main"  };
  if (text.includes("advanced") || text.includes("basic"))
                                return { gradient: "linear-gradient(135deg, #115e59 0%, #042f2e 100%)", accent: "#5eead4", emoji: "⚡", label: "JEE Advanced"  };
  if (text.includes("olympiad"))return { gradient: "linear-gradient(135deg, #c2410c 0%, #7c2d12 100%)", accent: "#fdba74", emoji: "🏆", label: "Olympiad"  };
  return                               { gradient: "linear-gradient(135deg, #172554 0%, #0f172a 100%)", accent: "#38bdf8", emoji: "📚", label: "Mathematics" };
};

/* ── Match Local Class Asset ───────────────────────────────── */
const getLocalClassImage = (category = "", title = "") => {
  const text = (category + " " + title).toLowerCase();
  if (text.includes("sachin") || text.includes("basic to advanced") || text.includes("basic maths") || text.includes("one shot")) return sachinMaths;
  if (text.includes("9th") || text.includes("class 9"))  return lec9th;
  if (text.includes("10th") || text.includes("class 10")) return lec10th;
  if (text.includes("11th") || text.includes("class 11")) return sachinMaths;
  if (text.includes("12th") || text.includes("class 12")) return lec12th;
  return defaultImg;
};

/* ── Academic Title Card Fallback ──────────────────────────── */
const TitleCard = ({ course, theme, className, style }) => (
  <div
    className={`crs-thumb-title-card ${className}`}
    style={{ background: theme.gradient, ...style }}
  >
    <div className="crs-thumb-circle crs-thumb-circle-1" />
    <div className="crs-thumb-circle crs-thumb-circle-2" />
    <div className="crs-thumb-circle crs-thumb-circle-3" />
    <div className="crs-thumb-content">
      <div className="crs-thumb-badge" style={{ background: theme.accent + "25", color: theme.accent, border: `1px solid ${theme.accent}40` }}>
        {theme.emoji} {theme.label}
      </div>
      <h3 className="crs-thumb-title">{course?.title || "Mathematics Course"}</h3>
      {course?.createdBy && (
        <p className="crs-thumb-by" style={{ color: theme.accent }}>
          by {course.createdBy}
        </p>
      )}
    </div>
    <div className="crs-thumb-shine" style={{ background: theme.accent }} />
  </div>
);

/* ── Main CourseThumbnail Component ─────────────────────────── */
const CourseThumbnail = ({ course, className = "", style = {} }) => {
  if (!course) return null;

  const uploadedUrl = buildImageUrl(course.image);
  const fallbackAsset = getLocalClassImage(course.category, course.title);
  const theme = getCategoryTheme(course.category, course.title);

  // Status state: 0 = try uploadedUrl, 1 = try fallbackAsset, 2 = show TitleCard
  const [stage, setStage] = useState(uploadedUrl ? 0 : 1);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setStage(uploadedUrl ? 0 : 1);
    setImgLoaded(false);
  }, [course?.image, course?._id]);

  const handleError = () => {
    if (stage === 0) {
      setStage(1); // fallback to local asset
    } else if (stage === 1) {
      setStage(2); // fallback to title card
    }
  };

  if (stage === 2) {
    return <TitleCard course={course} theme={theme} className={className} style={style} />;
  }

  const currentSrc = stage === 0 ? uploadedUrl : fallbackAsset;

  return (
    <div className={`relative overflow-hidden bg-[#f1efe9] w-full h-full flex items-center justify-center ${className}`} style={style}>
      {/* TitleCard placeholder while image is fetching/rendering */}
      {!imgLoaded && (
        <div className="absolute inset-0 z-0">
          <TitleCard course={course} theme={theme} className="w-full h-full" />
        </div>
      )}

      <img
        src={currentSrc}
        alt={course.title || "Course thumbnail"}
        className={`w-full h-full object-cover transition-opacity duration-300 relative z-10 ${
          imgLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setImgLoaded(true)}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};

export default CourseThumbnail;
