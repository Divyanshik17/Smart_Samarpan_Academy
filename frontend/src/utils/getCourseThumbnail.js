import lec9th from "../assets/lec_9th.jpg";
import lec10th from "../assets/lec_10th.jpg";
import lec11th from "../assets/lec_11th.jpg";
import lec12th from "../assets/lec_12th.jpg";
import defaultImg from "../assets/img.jpg";

export const getCourseThumbnail = (course, serverUrl) => {
  if (!course) return defaultImg;

  const title = (course.title || "").toLowerCase();
  const category = (course.category || "").toLowerCase();

  // Match class-specific local asset thumbnails
  if (title.includes("9th") || title.includes("class 9") || category.includes("9th")) {
    return lec9th;
  }
  if (title.includes("10th") || title.includes("class 10") || category.includes("10th")) {
    return lec10th;
  }
  if (title.includes("11th") || title.includes("class 11") || category.includes("11th")) {
    return lec11th;
  }
  if (title.includes("12th") || title.includes("class 12") || category.includes("12th")) {
    return lec12th;
  }

  // If image is a full URL
  if (course.image && (course.image.startsWith("http://") || course.image.startsWith("https://"))) {
    return course.image;
  }

  // If image exists on server
  if (course.image && serverUrl) {
    return `${serverUrl}/${course.image}`;
  }

  return defaultImg;
};
