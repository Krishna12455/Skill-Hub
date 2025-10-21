

// // export default Postvideo;
// import React, { useState, useEffect } from "react";
// import { doc, setDoc } from "firebase/firestore";
// import { db } from "../firebase";
// import {
//   Form,
//   Button,
//   Alert,
//   Container,
//   Row,
//   Col,
//   ProgressBar,
//   Card
// } from "react-bootstrap";
// import { CLOUDINARY_CONFIG } from "../config/cloudinary";
// import "./Postvideo.css";

// const Postvideo = () => {
//   const [courseTitle, setCourseTitle] = useState("");
//   const [courseCategory, setCourseCategory] = useState("");
//   const [courseLevel, setCourseLevel] = useState("");
//   const [description, setDescription] = useState("");
//   const [objectives, setObjectives] = useState("");
//   const [price, setPrice] = useState("");
//   const [thumbnail, setThumbnail] = useState(null);

//   const [lessonTitle, setLessonTitle] = useState("");
//   const [lessonType, setLessonType] = useState(""); // 'video' or 'text'
//   const [videoFile, setVideoFile] = useState(null);
//   const [textContent, setTextContent] = useState("");
//   const [duration, setDuration] = useState("");

//   const [user, setUser] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitMessage, setSubmitMessage] = useState("");
//   const [submitVariant, setSubmitVariant] = useState("success");

//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploadStatus, setUploadStatus] = useState("");

//   const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB
//   const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; // 5MB

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem("user"));
//     if (userData) setUser(userData);
//   }, []);

//   const validateFileSize = (file, maxSize, fileType) => {
//     if (file.size > maxSize) {
//       const maxSizeMB = (maxSize / 1024 / 1024).toFixed(1);
//       const fileSizeMB = (file.size / 1024 / 1024).toFixed(1);
//       throw new Error(
//         `${fileType} is too large. ${fileSizeMB}MB uploaded, max allowed is ${maxSizeMB}MB.`
//       );
//     }
//   };

//   const getFileSizeMB = (file) => {
//     return (file.size / 1024 / 1024).toFixed(2);
//   };

//   const uploadToCloudinary = async (file, fileType = "image") => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", CLOUDINARY_CONFIG.UPLOAD_PRESET);
//     formData.append("cloud_name", CLOUDINARY_CONFIG.CLOUD_NAME);

//     const url = `${CLOUDINARY_CONFIG.API_BASE_URL}/${CLOUDINARY_CONFIG.CLOUD_NAME}/${fileType}/upload`;

//     const response = await fetch(url, {
//       method: "POST",
//       body: formData
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Upload failed: ${errorText}`);
//     }

//     const result = await response.json();
//     return result.secure_url;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!user) {
//       setSubmitMessage("User not found. Please login again.");
//       setSubmitVariant("danger");
//       return;
//     }

//     if (!courseTitle || !courseCategory || !courseLevel || !description || !price || !lessonTitle || !lessonType) {
//       setSubmitMessage("Please fill all required fields.");
//       setSubmitVariant("danger");
//       return;
//     }

//     if (lessonType === "video" && !videoFile) {
//       setSubmitMessage("Please upload a video file.");
//       setSubmitVariant("danger");
//       return;
//     }

//     if (lessonType === "text" && !textContent) {
//       setSubmitMessage("Please enter lesson text content.");
//       setSubmitVariant("danger");
//       return;
//     }

//     if (!thumbnail) {
//       setSubmitMessage("Please upload a thumbnail image.");
//       setSubmitVariant("danger");
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       setUploadStatus("Validating files...");
//       validateFileSize(thumbnail, MAX_THUMBNAIL_SIZE, "Thumbnail");
//       if (videoFile) validateFileSize(videoFile, MAX_VIDEO_SIZE, "Video");

//       setUploadProgress(20);
//       const thumbnailUrl = await uploadToCloudinary(thumbnail, "image");
//       setUploadProgress(50);

//       let videoUrl = null;
//       if (lessonType === "video") {
//         setUploadStatus("Uploading video...");
//         videoUrl = await uploadToCloudinary(videoFile, "video");
//         setUploadProgress(80);
//       }

//       const courseId = `course_${Date.now()}`;
//       const courseData = {
//         courseInfo: {
//           title: courseTitle,
//           category: courseCategory,
//           level: courseLevel,
//           description,
//           objectives,
//           price: parseFloat(price),
//           thumbnail: thumbnailUrl,
//           createdAt: new Date().toISOString()
//         },
//         lessonContent: {
//           title: lessonTitle,
//           type: lessonType,
//           content: lessonType === "video" ? videoUrl : textContent,
//           duration: duration ? parseInt(duration) : null
//         },
//         teacherInfo: {
//           teacherId: user.uid,
//           teacherName: user.name,
//           teacherEmail: user.email
//         },
//         status: "published",
//         courseId
//       };

//       const userCourseRef = doc(db, "users", user.uid, "courses", courseId);
//       await setDoc(userCourseRef, courseData);

//       setSubmitMessage("✅ Course created successfully!");
//       setSubmitVariant("success");
//       setUploadProgress(100);
//       setUploadStatus("Done");

//       // reset
//       setCourseTitle("");
//       setCourseCategory("");
//       setCourseLevel("");
//       setDescription("");
//       setObjectives("");
//       setPrice("");
//       setThumbnail(null);
//       setLessonTitle("");
//       setLessonType("");
//       setVideoFile(null);
//       setTextContent("");
//       setDuration("");
//     } catch (error) {
//       console.error(error);
//       setSubmitMessage("❌ " + error.message);
//       setSubmitVariant("danger");
//       setUploadStatus("Failed");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="postvideo-container">
//       <Container>
//         <h2 className="mb-4">Create New Course</h2>
//         <Form onSubmit={handleSubmit}>
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Course Title</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={courseTitle}
//                   onChange={(e) => setCourseTitle(e.target.value)}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Category</Form.Label>
//                 <Form.Select
//                   value={courseCategory}
//                   onChange={(e) => setCourseCategory(e.target.value)}
//                   required
//                 >
//                   <option value="">Select</option>
//                   <option value="Web Development">Web Development</option>
//                   <option value="Data Science">Data Science</option>
//                 </Form.Select>
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Level</Form.Label>
//                 <Form.Select
//                   value={courseLevel}
//                   onChange={(e) => setCourseLevel(e.target.value)}
//                   required
//                 >
//                   <option value="">Select</option>
//                   <option value="Beginner">Beginner</option>
//                   <option value="Intermediate">Intermediate</option>
//                   <option value="Advanced">Advanced</option>
//                 </Form.Select>
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Price (₹)</Form.Label>
//                 <Form.Control
//                   type="number"
//                   value={price}
//                   onChange={(e) => setPrice(e.target.value)}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Thumbnail</Form.Label>
//                 <Form.Control
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => setThumbnail(e.target.files[0])}
//                   required
//                 />
//               </Form.Group>
//             </Col>

//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Description</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={3}
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Objectives</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={2}
//                   value={objectives}
//                   onChange={(e) => setObjectives(e.target.value)}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Lesson Title</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={lessonTitle}
//                   onChange={(e) => setLessonTitle(e.target.value)}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Lesson Type</Form.Label>
//                 <div>
//                   <Form.Check
//                     type="radio"
//                     label="Video"
//                     value="video"
//                     checked={lessonType === "video"}
//                     onChange={(e) => setLessonType(e.target.value)}
//                   />
//                   <Form.Check
//                     type="radio"
//                     label="Text"
//                     value="text"
//                     checked={lessonType === "text"}
//                     onChange={(e) => setLessonType(e.target.value)}
//                   />
//                 </div>
//               </Form.Group>

//               {lessonType === "video" && (
//                 <Form.Group className="mb-3">
//                   <Form.Label>Upload Video</Form.Label>
//                   <Form.Control
//                     type="file"
//                     accept="video/*"
//                     onChange={(e) => setVideoFile(e.target.files[0])}
//                     required
//                   />
//                 </Form.Group>
//               )}

//               {lessonType === "text" && (
//                 <Form.Group className="mb-3">
//                   <Form.Label>Lesson Text</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={3}
//                     value={textContent}
//                     onChange={(e) => setTextContent(e.target.value)}
//                     required
//                   />
//                 </Form.Group>
//               )}

//               <Form.Group className="mb-3">
//                 <Form.Label>Duration (minutes)</Form.Label>
//                 <Form.Control
//                   type="number"
//                   value={duration}
//                   onChange={(e) => setDuration(e.target.value)}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Button type="submit" disabled={isSubmitting} className="w-100">
//             {isSubmitting ? "Uploading..." : "Create Course"}
//           </Button>

//           {uploadProgress > 0 && (
//             <ProgressBar
//               now={uploadProgress}
//               label={`${uploadProgress}%`}
//               className="mt-3"
//             />
//           )}

//           {submitMessage && (
//             <Alert variant={submitVariant} className="mt-3">
//               {submitMessage}
//             </Alert>
//           )}
//         </Form>
//       </Container>
//     </div>
//   );
// };

// export default Postvideo;







// src/TeacherDashboard/Postvideo.jsx
import React, { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
  ProgressBar
} from "react-bootstrap";
import { CLOUDINARY_CONFIG } from "../config/cloudinary";
import "./Postvideo.css";

const Postvideo = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCategory, setCourseCategory] = useState("");
  const [courseLevel, setCourseLevel] = useState("");
  const [description, setDescription] = useState("");
  const [objectives, setObjectives] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonType, setLessonType] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [duration, setDuration] = useState("");

  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitVariant, setSubmitVariant] = useState("success");

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");

  const MAX_VIDEO_SIZE = 10 * 1024 * 1024;
  const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024;

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setUser(userData);
  }, []);

  const validateFileSize = (file, maxSize, fileType) => {
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / 1024 / 1024).toFixed(1);
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(1);
      throw new Error(
        `${fileType} is too large. ${fileSizeMB}MB uploaded, max allowed is ${maxSizeMB}MB.`
      );
    }
  };

  const uploadToCloudinary = async (file, fileType = "image") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_CONFIG.UPLOAD_PRESET);
    formData.append("cloud_name", CLOUDINARY_CONFIG.CLOUD_NAME);

    const url = `${CLOUDINARY_CONFIG.API_BASE_URL}/${CLOUDINARY_CONFIG.CLOUD_NAME}/${fileType}/upload`;

    const response = await fetch(url, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    const result = await response.json();
    return result.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setSubmitMessage("User not found. Please login again.");
      setSubmitVariant("danger");
      return;
    }

    if (!courseTitle || !courseCategory || !courseLevel || !description || !price || !lessonTitle || !lessonType) {
      setSubmitMessage("Please fill all required fields.");
      setSubmitVariant("danger");
      return;
    }

    if (lessonType === "video" && !videoFile) {
      setSubmitMessage("Please upload a video file.");
      setSubmitVariant("danger");
      return;
    }

    if (lessonType === "text" && !textContent) {
      setSubmitMessage("Please enter lesson text content.");
      setSubmitVariant("danger");
      return;
    }

    if (!thumbnail) {
      setSubmitMessage("Please upload a thumbnail image.");
      setSubmitVariant("danger");
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadStatus("Validating files...");
      validateFileSize(thumbnail, MAX_THUMBNAIL_SIZE, "Thumbnail");
      if (videoFile) validateFileSize(videoFile, MAX_VIDEO_SIZE, "Video");

      setUploadProgress(20);
      const thumbnailUrl = await uploadToCloudinary(thumbnail, "image");
      setUploadProgress(50);

      let videoUrl = null;
      if (lessonType === "video") {
        setUploadStatus("Uploading video...");
        videoUrl = await uploadToCloudinary(videoFile, "video");
        setUploadProgress(80);
      }

      const courseId = `course_${Date.now()}`;
      const courseData = {
        courseInfo: {
          title: courseTitle,
          category: courseCategory,
          level: courseLevel,
          description,
          objectives,
          price: parseFloat(price),
          thumbnail: thumbnailUrl,
          createdAt: new Date().toISOString(),
          videoUrl: videoUrl || null // ✅ This is crucial for AdminDashboard
        },
        lessonContent: {
          title: lessonTitle,
          type: lessonType,
          content: lessonType === "video" ? videoUrl : textContent,
          duration: duration ? parseInt(duration) : null
        },
        teacherInfo: {
          teacherId: user.uid,
          teacherName: user.name,
          teacherEmail: user.email
        },
        status: "published",
        courseId
      };

      const userCourseRef = doc(db, "users", user.uid, "courses", courseId);
      await setDoc(userCourseRef, courseData);

      setSubmitMessage("✅ Course created successfully!");
      setSubmitVariant("success");
      setUploadProgress(100);
      setUploadStatus("Done");

      // reset
      setCourseTitle("");
      setCourseCategory("");
      setCourseLevel("");
      setDescription("");
      setObjectives("");
      setPrice("");
      setThumbnail(null);
      setLessonTitle("");
      setLessonType("");
      setVideoFile(null);
      setTextContent("");
      setDuration("");
    } catch (error) {
      console.error(error);
      setSubmitMessage("❌ " + error.message);
      setSubmitVariant("danger");
      setUploadStatus("Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="postvideo-container">
      <Container>
        <h2 className="mb-4">Create New Course</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Course Title</Form.Label>
                <Form.Control
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Programming">Programming</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Level</Form.Label>
                <Form.Select
                  value={courseLevel}
                  onChange={(e) => setCourseLevel(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price (₹)</Form.Label>
                <Form.Control
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Thumbnail</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  required
                />
                {thumbnail && (
                  <small className="text-muted">
                    Selected: {thumbnail.name} ({(thumbnail.size / 1024 / 1024).toFixed(2)} MB)
                  </small>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Objectives</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  placeholder="What will students learn from this course?"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Lesson Title</Form.Label>
                <Form.Control
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Lesson Type</Form.Label>
                <div>
                  <Form.Check
                    type="radio"
                    label="Video"
                    value="video"
                    checked={lessonType === "video"}
                    onChange={(e) => setLessonType(e.target.value)}
                    name="lessonType"
                  />
                  <Form.Check
                    type="radio"
                    label="Text"
                    value="text"
                    checked={lessonType === "text"}
                    onChange={(e) => setLessonType(e.target.value)}
                    name="lessonType"
                  />
                </div>
              </Form.Group>

              {lessonType === "video" && (
                <Form.Group className="mb-3">
                  <Form.Label>Upload Video</Form.Label>
                  <Form.Control
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    required
                  />
                  {videoFile && (
                    <small className="text-muted">
                      Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                    </small>
                  )}
                </Form.Group>
              )}

              {lessonType === "text" && (
                <Form.Group className="mb-3">
                  <Form.Label>Lesson Text</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    required
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Duration (minutes)</Form.Label>
                <Form.Control
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Optional"
                />
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit" disabled={isSubmitting} className="w-100">
            {isSubmitting ? "Uploading..." : "Create Course"}
          </Button>

          {uploadProgress > 0 && (
            <div className="mt-3">
              <ProgressBar
                now={uploadProgress}
                label={`${uploadProgress}%`}
              />
              {uploadStatus && <small className="text-muted">{uploadStatus}</small>}
            </div>
          )}

          {submitMessage && (
            <Alert variant={submitVariant} className="mt-3">
              {submitMessage}
            </Alert>
          )}
        </Form>
      </Container>
    </div>
  );
};

export default Postvideo;